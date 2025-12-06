const router = require("express").Router();
const pool = require("../db");

// Muscle Balance Analyzer
router.get("/muscle-balance/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Pull TOTAL volume per muscle group
        const result = await pool.query(
            `
            SELECT 
                m.bodypart,
                SUM(ld.sets * ld.reps) AS volume
            FROM logdetail ld
            JOIN workoutlog wl ON wl.logid = ld.logid
            JOIN exercise_muscles em ON em.exerciseid = ld.exerciseid
            JOIN muscles m ON m.muscleid = em.muscleid
            WHERE wl.userid = $1
            GROUP BY m.bodypart
            ORDER BY m.bodypart;
            `,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.json({
                percentages: [],
                recommendation: "Not enough data to analyze your muscle balance.",
                breakdown: []
            });
        }

        const rows = result.rows.map(r => ({
            muscle: r.bodypart,
            volume: Number(r.volume)
        }));

        const total = rows.reduce((sum, r) => sum + r.volume, 0);

        // --- Percentages of training load ---
        const percentages = rows.map(r => ({
            muscle: r.muscle,
            percent: ((r.volume / total) * 100).toFixed(1),
            volume: r.volume
        }));

        // Sort by descending volume (helpful for report)
        const sorted = [...percentages].sort((a, b) => b.volume - a.volume);

        // Determine weak and overtrained groups
        const weak = percentages.filter(p => p.percent < 12).map(p => p.muscle);
        const strong = percentages.filter(p => p.percent > 30).map(p => p.muscle);

        // Build the recommendation text
        let recommendation = "";

        if (weak.length === 0) {
            recommendation = "Your muscle balance looks solid. Keep training evenly!";
        } else {
            recommendation = `⚠ You are undertraining: ${weak.join(", ")}.\n`;
            recommendation += "Try increasing the volume for those muscle groups next week.\n";
        }

        if (strong.length > 0) {
            recommendation += `⚠ You are over-focusing on: ${strong.join(", ")}.\n`;
            recommendation += "Consider reducing volume slightly to avoid overuse injuries.\n";
        }

        // Extra guidance
        recommendation +=
            "\nGeneral guidelines:\n" +
            "• Aim for each muscle group to be between 14%–22% of total weekly volume.\n" +
            "• Try to keep left/right muscle groups aligned.\n" +
            "• Increase weak muscle groups with 2–4 additional sets per week.\n";

        res.json({
            percentages: sorted,
            recommendation,
            breakdown: rows
        });

    } catch (err) {
        console.error("Muscle Balance Error:", err);
        res.status(500).send("Server Error generating muscle balance report");
    }
});



// Performance Progression Analyzer
router.get("/:exerciseId/:userId", async (req, res) => {
    try {
        const { exerciseId, userId } = req.params;

        const result = await pool.query(
            `
            SELECT 
                wl.logdate,
                ld.weight_lb,
                ld.reps
            FROM logdetail ld
            JOIN workoutlog wl ON wl.logid = ld.logid
            WHERE ld.exerciseid = $1 AND wl.userid = $2
            ORDER BY wl.logdate ASC
            `,
            [exerciseId, userId]
        );

        if (result.rows.length === 0) {
            return res.json({
                message: "Not enough data",
                latest_weight: null
            });
        }

        // Convert strings → numbers
        const entries = result.rows.map(r => ({
            date: new Date(r.logdate),
            weight: r.weight_lb ? Number(r.weight_lb) : 0,
            reps: Number(r.reps)
        }));

        // Remove entries with no weight
        const valid = entries.filter(e => e.weight > 0);

        if (valid.length < 1) {
            return res.json({
                message: "No weight data",
                latest_weight: null
            });
        }

        // BASIC VALUES
        const start = valid[0].weight;
        const latest = valid[valid.length - 1].weight;
        const best = Math.max(...valid.map(v => v.weight));
        const avg = valid.reduce((sum, v) => sum + v.weight, 0) / valid.length;
        const sessions = valid.length;

        // % CHANGE
        const pct_change = start > 0 
            ? ((latest - start) / start * 100).toFixed(1)
            : 0;

        // TREND
        let trend = "Plateau";
        if (latest > start + 2.5) trend = "Improving";
        if (latest < start - 2.5) trend = "Declining";

        // NEXT STEP
        let next_step = "Maintain current weight.";
        if (trend === "Improving") next_step = "Increase weight by 2.5 lb next session.";
        if (trend === "Declining") next_step = "Reduce weight or check form.";

        // CONSISTENCY (average days between sessions)
        let consistency_days = null;
        if (entries.length > 1) {
            let diffs = [];
            for (let i = 1; i < entries.length; i++) {
                const diff = (entries[i].date - entries[i - 1].date) / (1000 * 60 * 60 * 24);
                diffs.push(diff);
            }
            consistency_days = (diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(1);
        }

        // ESTIMATED 1RM (using heaviest weight & reps)
        const top = entries.reduce((best, e) => {
            if (e.weight > best.weight) return e;
            return best;
        }, { weight: 0, reps: 0 });

        const estimated_1RM = top.weight * (1 + top.reps / 30);

        return res.json({
            start_weight: start,
            latest_weight: latest,
            best_weight: best,
            average_weight: Number(avg.toFixed(1)),
            sessions,
            pct_change,
            consistency_days: consistency_days || "N/A",
            estimated_1RM: Number(estimated_1RM.toFixed(1)),
            trend,
            next_step
        });

    } catch (err) {
        console.error("Report Error:", err);
        res.status(500).json({ error: "Server error in progression report" });
    }
});



module.exports = router;
