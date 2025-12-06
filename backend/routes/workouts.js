const router = require('express').Router();
const pool = require('../db');

// CREATE A NEW WORKOUT PLAN
router.post('/plans', async (req, res) => {
    try {
        // We need userID from the frontend later. For now, we'll manually send it in the body.
        const { planName, description, userId } = req.body;

        const newPlan = await pool.query(
            'INSERT INTO "workoutplan" (planname, description, userid) VALUES ($1, $2, $3) RETURNING *',
            [planName, description, userId]
        );

        res.json(newPlan.rows[0]);
    } catch (err) {
        console.error('Error creating plan:', err.message);
        res.status(500).send("Server Error");
    }
});


// LOG A COMPLETE WORKOUT
router.post('/log', async (req, res) => {
    const client = await pool.connect();
    try {
        // now also includes focus
        const { userId, notes, focus, exercises } = req.body;
        // exercises: [{ exerciseId, sets, reps, weight }, ...]

        // 1. Start Transaction
        await client.query('BEGIN');

        // 2. Create the main Log entry (focus added)
        const logResult = await client.query(
            'INSERT INTO "workoutlog" (userid, notes, focus) VALUES ($1, $2, $3) RETURNING logid',
            [userId, notes, focus]
        );
        const newLogId = logResult.rows[0].logid;

        // 3. Loop through exercises and save each one
        for (let exercise of exercises) {
            await client.query(
                `INSERT INTO LogDetail 
                    (LogID, ExerciseID, Sets, Reps, weight_lb, weight_kg, unit)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    newLogId,
                    exercise.exerciseId,
                    exercise.sets,
                    exercise.reps,
                    exercise.weightLB,
                    exercise.weightKG,
                    exercise.unit
                ]
            );

        }

        // 4. Commit Transaction
        await client.query('COMMIT');

        res.json({ message: "Workout logged successfully!", logId: newLogId });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error logging workout:', err.message);
        res.status(500).send("Server Error during workout log");
    } finally {
        client.release();
    }
});

// GET ALL WORKOUT LOGS FOR A USER 
router.get('/logs/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const logs = await pool.query(
            `SELECT 
                 logid,
                 notes,
                 focus,
                 TO_CHAR(logdate, 'MM/DD/YYYY') AS formatted_date,
                 TO_CHAR(LogDate, 'FMDay') AS weekday
             FROM "workoutlog"
             WHERE userid = $1
             ORDER BY logdate DESC`,
            [userId]
        );

        res.json(logs.rows);
    } catch (err) {
        console.error('Error fetching logs:', err.message);
        res.status(500).send("Server Error");
    }
});


// GET FULL DETAILS FOR ONE SPECIFIC LOG
router.get('/log-details/:logId', async (req, res) => {
    try {
        const { logId } = req.params;

        const details = await pool.query(
            `SELECT 
                ld.sets,
                ld.reps,
                ld.weight_lb,
                ld.weight_kg,
                ld.unit,
                e.exercisename
             FROM "logdetail" ld
             JOIN "exercises" e 
                ON ld.exerciseid = e.exerciseid
             WHERE ld.logid = $1`,
            [logId]
        );

        res.json(details.rows);
    } catch (err) {
        console.error('Error fetching log details:', err.message);
        res.status(500).send("Server Error");
    }
});


// DELETE A WORKOUT LOG
router.delete('/log/:logId', async (req, res) => {
    try {
        const { logId } = req.params;

        const deleteLog = await pool.query(
            'DELETE FROM "workoutlog" WHERE logid = $1 RETURNING *',
            [logId]
        );

        if (deleteLog.rows.length === 0) {
            return res.json("This log does not exist.");
        }

        res.json("Workout log was deleted!");
    } catch (err) {
        console.error('Error deleting log:', err.message);
        res.status(500).send("Server Error");
    }
});

// UPDATE A LOG'S NOTES
router.put('/log/:logId', async (req, res) => {
    try {
        const { logId } = req.params;
        const { notes } = req.body;

        const updateLog = await pool.query(
            'UPDATE "workoutlog" SET notes = $1 WHERE logid = $2 RETURNING *',
            [notes, logId]
        );

        if (updateLog.rows.length === 0) {
             return res.json("This log does not exist.");
        }

        res.json("Log updated successfully!");
    } catch (err) {
        console.error('Error updating log:', err.message);
        res.status(500).send("Server Error");
    }
});

// UPDATE a logged workout + its exercises
router.put('/log/:logId/edit', async (req, res) => {
    const client = await pool.connect();
    try {
        const { logId } = req.params;
        const { notes, focus, exercises } = req.body;

        await client.query('BEGIN');

        // 1. Update notes & focus
        await client.query(
            `UPDATE workoutlog
             SET notes = $1, focus = $2
             WHERE logid = $3`,
            [notes, focus, logId]
        );

        // 2. Delete old exercises for this log
        await client.query(
            `DELETE FROM logdetail WHERE logid = $1`,
            [logId]
        );

        // 3. Insert updated exercises list
        for (let ex of exercises) {
            await client.query(
                `INSERT INTO logdetail (logid, exerciseid, sets, reps, weight_lb, weight_kg, unit)
                 VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                [
                    logId,
                    ex.exerciseId,
                    ex.sets,
                    ex.reps,
                    ex.weightLB,
                    ex.weightKG,
                    ex.unit,
                ]
            );
        }

        await client.query('COMMIT');
        res.json({ message: "Workout updated!" });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Edit error:", err);
        res.status(500).send("Server error updating workout");
    } finally {
        client.release();
    }
});

// GET FULL WORKOUT (summary + exercises)
router.get('/full/:logId', async (req, res) => {
    try {
        const { logId } = req.params;

        // Get summary
        const summary = await pool.query(
            `SELECT logid, notes, focus, 
                    TO_CHAR(logdate, 'MM/DD/YYYY') AS formatted_date,
                    TO_CHAR(logdate, 'FMDay') AS weekday
             FROM "workoutlog"
             WHERE logid = $1`,
            [logId]
        );

        if (summary.rows.length === 0) {
            return res.status(404).json({ error: "Workout not found" });
        }

        // Get exercises
        const exercises = await pool.query(
            `SELECT 
                logdetailid,
                sets,
                reps,
                weight_lb,
                weight_kg,
                unit,
                e.exercisename,
                e.exerciseid
             FROM "logdetail" ld
             JOIN exercises e ON e.exerciseid = ld.exerciseid
             WHERE ld.logid = $1`,
            [logId]
        );

        res.json({
            summary: summary.rows[0],
            exercises: exercises.rows
        });

    } catch (err) {
        console.error("Error fetching full workout:", err.message);
        res.status(500).send("Server Error");
    }
});

// UPDATE WORKOUT (summary + exercise details)
router.put('/edit/:logId', async (req, res) => {
    const client = await pool.connect();

    try {
        const { logId } = req.params;
        const { notes, focus, exercises } = req.body;

        await client.query("BEGIN");

        // Update summary
        await client.query(
            `UPDATE workoutlog
             SET notes = $1, focus = $2
             WHERE logid = $3`,
            [notes, focus, logId]
        );

        // Update each exercise
        for (const ex of exercises) {
            await client.query(
                `UPDATE logdetail
                 SET sets = $1,
                     reps = $2,
                     weight_lb = $3,
                     weight_kg = $4,
                     unit = $5
                 WHERE logdetailid = $6`,
                [
                    ex.sets,
                    ex.reps,
                    ex.weight_lb,
                    ex.weight_kg,
                    ex.unit,
                    ex.logdetailid
                ]
            );
        }

        await client.query("COMMIT");

        res.json({ message: "Workout updated!" });

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error editing workout:", err.message);
        res.status(500).send("Server Error");
    } finally {
        client.release();
    }
});

// GET full history for a specific exercise
router.get("/exercise-history/:exerciseId", async (req, res) => {
    try {
        const { exerciseId } = req.params;

        const query = `
            SELECT 
                wl.logid,
                TO_CHAR(wl.logdate, 'MM/DD/YYYY') AS date,
                ld.sets,
                ld.reps,
                ld.weight_lb,
                ld.weight_kg
            FROM logdetail ld
            JOIN workoutlog wl ON wl.logid = ld.logid
            WHERE ld.exerciseid = $1
            ORDER BY wl.logdate DESC
        `;

        const logs = await pool.query(query, [exerciseId]);

        // get exercise name
        const exRes = await pool.query(
            `SELECT exercisename FROM exercises WHERE exerciseid = $1`,
            [exerciseId]
        );

        res.json({
            exerciseName: exRes.rows[0]?.exercisename || "Unknown Exercise",
            history: logs.rows
        });

    } catch (err) {
        console.error("Exercise history error:", err);
        res.status(500).send("Server error fetching exercise history");
    }
});

// GET workout history for a specific exercise
router.get('/exercise-history/:exerciseId/:userId', async (req, res) => {
    try {
        const { exerciseId, userId } = req.params;

        const result = await pool.query(
            `
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
            `,
            [exerciseId, userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Exercise history error:", err);
        res.status(500).json({ error: "Server error retrieving exercise history" });
    }
});

router.get('/exercise-history/all', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.exerciseid,
                e.exercisename,
                STRING_AGG(DISTINCT m.bodypart, ', ') AS bodyparts
            FROM exercises e
            LEFT JOIN exercise_muscles em ON e.exerciseid = em.exerciseid
            LEFT JOIN muscles m ON m.muscleid = em.muscleid
            GROUP BY e.exerciseid, e.exercisename
            ORDER BY e.exercisename;
        `);

        res.json(result.rows);
    } catch (err) {
        console.error("Error loading exercise list:", err.message);
        res.status(500).send("Server Error");
    }
});

router.get('/exercise-history/:exerciseId', async (req, res) => {
    try {
        const { exerciseId } = req.params;

        const result = await pool.query(`
            SELECT 
                wl.logid,
                wl.logdate,
                wl.focus,
                ld.sets,
                ld.reps,
                ld.weight_lb,
                ld.weight_kg,
                ld.unit
            FROM logdetail ld
            JOIN workoutlog wl ON wl.logid = ld.logid
            WHERE ld.exerciseid = $1
            ORDER BY wl.logdate DESC;
        `, [exerciseId]);

        res.json(result.rows);
    } catch (err) {
        console.error("Error loading exercise history:", err.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;
