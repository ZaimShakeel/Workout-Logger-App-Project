import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditWorkout() {
    const { logId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [summary, setSummary] = useState(null);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/workouts/full/${logId}`);
                const data = await res.json();

                setSummary(data.summary);

                const mapped = data.exercises.map(ex => ({
                    logdetailid: ex.logdetailid,
                    exerciseid: ex.exerciseid,
                    name: ex.exercisename,
                    sets: Number(ex.sets),
                    reps: Number(ex.reps),
                    unit: ex.unit || "lb",
                    weight_lb: ex.weight_lb !== null ? Number(ex.weight_lb) : 0,
                    weight_kg: ex.weight_kg !== null ? Number(ex.weight_kg) : 0
                }));

                setExercises(mapped);
            } catch (err) {
                console.error(err);
                setError("Failed to load workout.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkout();
    }, [logId]);

    const updateField = (index, field, value) => {
        setExercises(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: Number(value) };
            return updated;
        });
    };

    const updateWeight = (index, value) => {
        const num = Number(value);

        setExercises(prev => {
            const updated = [...prev];
            const ex = { ...updated[index] };

            if (ex.unit === "lb") {
                ex.weight_lb = num;
                ex.weight_kg = num / 2.20462;
            } else {
                ex.weight_kg = num;
                ex.weight_lb = num * 2.20462;
            }

            updated[index] = ex;
            return updated;
        });
    };

    const toggleUnit = (index, unit) => {
        setExercises(prev => {
            const updated = [...prev];
            const ex = { ...updated[index] };

            if (unit === "lb") {
                ex.weight_lb = ex.weight_kg * 2.20462;
            } else {
                ex.weight_kg = ex.weight_lb / 2.20462;
            }

            ex.unit = unit;
            updated[index] = ex;
            return updated;
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");

        try {
            const payload = {
                notes: summary.notes,
                focus: summary.focus,
                exercises: exercises.map(ex => ({
                    logdetailid: ex.logdetailid,
                    sets: ex.sets,
                    reps: ex.reps,
                    weight_lb: ex.weight_lb,
                    weight_kg: ex.weight_kg,
                    unit: ex.unit
                }))
            };

            const res = await fetch(
                `http://localhost:5000/api/workouts/edit/${logId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) throw new Error("Failed to update workout.");

            navigate(`/history/${logId}`);
        } catch (err) {
            console.error(err);
            setError("Error saving workout.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ color: "white" }}>Loading...</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", color: "white" }}>
            <h2>Edit Workout</h2>

            {error && <p style={{ color: "tomato" }}>{error}</p>}

            {/* NOTES */}
            <label>Notes:</label>
            <textarea
                value={summary.notes}
                onChange={(e) => setSummary({ ...summary, notes: e.target.value })}
                style={{
                    width: "98%",
                    height: "120px",
                    padding: "10px",
                    background: "#333",
                    color: "white",
                    borderRadius: "6px"
                }}
            />

            {/* FOCUS */}
            <label style={{ marginTop: "20px", display: "block" }}>Focus:</label>
            <select
                value={summary.focus}
                onChange={(e) => setSummary({ ...summary, focus: e.target.value })}
                style={{
                    width: "100%",
                    padding: "10px",
                    background: "#333",
                    color: "white",
                    borderRadius: "6px"
                }}
            >
                <option value="">-- Select Focus --</option>
                <option value="Push">Push</option>
                <option value="Pull">Pull</option>
                <option value="Legs">Legs</option>
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Full Body">Full Body</option>
                <option value="Arms">Arms</option>
                <option value="Shoulders">Shoulders</option>
            </select>

            <h3 style={{ marginTop: "30px" }}>Exercises</h3>

            {exercises.map((ex, index) => (
                <div key={ex.logdetailid} style={{
                    background: "#2d2d2d",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    width: "100%", 
                    margin: "0 auto" 
                }}>
                    <strong style={{ fontSize: "18px" }}>{ex.name}</strong>

                    {/* SETS */}
                    <label style={{ display: "block", marginTop: "10px" }}>Sets:</label>
                    <input
                        type="number"
                        value={ex.sets}
                        onChange={(e) => updateField(index, "sets", e.target.value)}
                        style={{
                            width: "780px",
                            padding: "8px",
                            background: "#444",
                            borderRadius: "6px",
                            color: "white"
                        }}
                    />

                    {/* REPS */}
                    <label style={{ display: "block", marginTop: "10px" }}>Reps:</label>
                    <input
                        type="number"
                        value={ex.reps}
                        onChange={(e) => updateField(index, "reps", e.target.value)}
                        style={{
                            width: "780px",
                            padding: "8px",
                            background: "#444",
                            borderRadius: "6px",
                            color: "white"
                        }}
                    />

                    {/* WEIGHT */}
                    <label style={{ display: "block", marginTop: "10px" }}>Weight:</label>

                    <input
                        type="number"
                        step="2.5"
                        value={ex.unit === "lb" ? ex.weight_lb : ex.weight_kg}
                        onChange={(e) => updateWeight(index, e.target.value)}
                        style={{
                            width: "780px",
                            padding: "8px",
                            background: "#444",
                            borderRadius: "6px",
                            color: "white"
                        }}
                    />

                    {/* UNIT TOGGLE */}
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button
                            onClick={() => toggleUnit(index, "lb")}
                            style={{
                                flex: 1,
                                padding: "10px",
                                borderRadius: "6px",
                                background: ex.unit === "lb" ? "#1e88e5" : "#555",
                                border: "none",
                                color: "white"
                            }}
                        >
                            LB
                        </button>

                        <button
                            onClick={() => toggleUnit(index, "kg")}
                            style={{
                                flex: 1,
                                padding: "10px",
                                borderRadius: "6px",
                                background: ex.unit === "kg" ? "#1e88e5" : "#555",
                                border: "none",
                                color: "white"
                            }}
                        >
                            KG
                        </button>
                    </div>
                </div>
            ))}

            <button
                onClick={handleSave}
                style={{
                    marginTop: "20px",
                    padding: "14px",
                    width: "100%",
                    background: "#4caf50",
                    border: "none",
                    color: "white",
                    borderRadius: "6px",
                    fontSize: "16px"
                }}
            >
                {saving ? "Saving..." : "Save Workout"}
            </button>
        </div>
    );
}

export default EditWorkout;
