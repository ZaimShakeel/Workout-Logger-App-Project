const router = require("express").Router();
const pool = require("../db");

//
// 0) BASIC EXERCISE LIST (USED BY LogWorkout PAGE)
//
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT exerciseid, exercisename
            FROM exercises
            ORDER BY exercisename;
        `);

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching basic exercise list:", err.message);
        res.status(500).send("Server Error");
    }
});

//
// 1) GET ALL EXERCISES + BODY PARTS (USED BY ExerciseHistory)
//
router.get("/all", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.exerciseid,
                e.exercisename,
                COALESCE(STRING_AGG(DISTINCT m.bodypart, ', '), 'Other') AS bodypart
            FROM exercises e
            LEFT JOIN exercise_muscles em ON e.exerciseid = em.exerciseid
            LEFT JOIN muscles m ON m.muscleid = em.muscleid
            GROUP BY e.exerciseid, e.exercisename
            ORDER BY e.exercisename;
        `);

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching exercises:", err.message);
        res.status(500).send("Server Error");
    }
});

//
// 2) GET FULL HISTORY FOR SPECIFIC EXERCISE
//
router.get("/history/:exerciseId/:userId", async (req, res) => {
    try {
        const { exerciseId, userId } = req.params;

        const result = await pool.query(`
            SELECT 
                wl.logid,
                TO_CHAR(wl.logdate, 'MM/DD/YYYY') AS date,
                TO_CHAR(wl.logdate, 'FMDay') AS weekday,
                wl.notes,
                wl.focus,
                ld.sets,
                ld.reps,
                ld.weight_lb,
                ld.weight_kg,
                e.exercisename
            FROM logdetail ld
            JOIN workoutlog wl ON wl.logid = ld.logid
            JOIN exercises e ON e.exerciseid = ld.exerciseid
            WHERE ld.exerciseid = $1 AND wl.userid = $2
            ORDER BY wl.logdate DESC
        `, [exerciseId, userId]);

        res.json(result.rows);
    } catch (err) {
        console.error("Exercise history error:", err);
        res.status(500).json({ error: "Server error retrieving exercise history" });
    }
});

//
// 3) GET EXERCISE NAME ONLY
//
router.get("/name/:exerciseId", async (req, res) => {
    try {
        const { exerciseId } = req.params;

        const result = await pool.query(
            `SELECT exercisename FROM exercises WHERE exerciseid = $1`,
            [exerciseId]
        );

        res.json(result.rows[0] || { exercisename: "Unknown Exercise" });
    } catch (err) {
        console.error("Error fetching exercise name:", err.message);
        res.status(500).send("Server Error");
    }
});

// PERFORMANCE PROGRESSION REPORT
router.get("/progression/:exerciseId/:userId", async (req, res) => {
    try {
        const { exerciseId, userId } = req.params;

        const result = await pool.query(
            `
            SELECT 
                wl.logdate,
                ld.sets,
                ld.reps,
                ld.weight_lb,
                ld.weight_kg
            FROM logdetail ld
            JOIN workoutlog wl ON wl.logid = ld.logid
            WHERE ld.exerciseid = $1 AND wl.userid = $2
            ORDER BY wl.logdate ASC
            `,
            [exerciseId, userId]
        );

        const rows = result.rows;

        if (rows.length === 0)
            return res.json({ history: [], summary: "No data available." });

        // Compute progression
        let lastWeight = null;
        let plateauCount = 0;
        const progression = [];

        rows.forEach((r) => {
            const weight = Number(r.weight_lb) || 0;
            const reps = Number(r.reps) || 1;

            // Epley 1RM estimate
            const oneRM = weight * (1 + reps / 30);

            progression.push({
                date: r.logdate,
                weight,
                reps,
                oneRM: Number(oneRM.toFixed(1))
            });

            if (lastWeight !== null) {
                if (weight === lastWeight) plateauCount++;
            }

            lastWeight = weight;
        });

        // RECOMMENDATION LOGIC
        let recommendation = "";

        if (progression.length < 3) {
            recommendation = "Keep training — need more data before analyzing progression.";
        } else if (plateauCount >= 2) {
            recommendation =
                "You've hit a plateau. Consider increasing weight by 2.5–5 lbs or increasing reps.";
        } else if (progression[progression.length - 1].weight >
                   progression[0].weight) {
            recommendation = "Good job! You're making steady progress.";
        } else {
            recommendation = "Slight plateau — try progressive overload soon.";
        }

        res.json({
            history: progression,
            recommendation
        });
    } catch (err) {
        console.error("Progression error:", err);
        res.status(500).send("Server Error");
    }
});


module.exports = router;
