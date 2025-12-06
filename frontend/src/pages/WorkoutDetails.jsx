import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function WorkoutDetails() {
    const { logId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [summary, setSummary] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
            return;
        }

        const fetchWorkout = async () => {
            try {
                // Load summary (date, notes, focus)
                const summaryRes = await fetch(
                    `http://localhost:5000/api/workouts/logs/${user.userid}`
                );
                const allLogs = await summaryRes.json();
                const found = allLogs.find((l) => l.logid === parseInt(logId));

                if (!found) {
                    setError("Workout not found.");
                    setLoading(false);
                    return;
                }

                setSummary(found);

                // Load exercises
                const detailRes = await fetch(
                    `http://localhost:5000/api/workouts/log-details/${logId}`
                );
                const detailData = await detailRes.json();
                setExercises(detailData);
            } catch (err) {
                console.error(err);
                setError("Failed to load workout details.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkout();
    }, [logId, navigate, user]);

    if (loading) {
        return (
            <div style={{
                padding: "20px",
                maxWidth: "800px",
                margin: "0 auto",
                backgroundColor: "#242424",
                minHeight: "100vh",
                color: "#fff"
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: "20px",
                maxWidth: "800px",
                margin: "0 auto",
                backgroundColor: "#242424",
                minHeight: "100vh",
                color: "#fff"
            }}>
                <p>{error}</p>
                <button
                    onClick={() => navigate('/history')}
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        backgroundColor: "#555",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px"
                    }}>
                    Back to History
                </button>
            </div>
        );
    }

    return (
        <div style={{
            padding: "20px",
            maxWidth: "800px",
            margin: "0 auto",
            backgroundColor: "#242424",
            minHeight: "100vh",
            color: "#fff"
        }}>
            <h2>Workout Details</h2>

            <div style={{
                marginTop: "20px",
                padding: "20px",
                backgroundColor: "#1f1f1f",
                borderRadius: "10px",
                boxShadow: "0 0 15px rgba(0,0,0,0.35)"
            }}>
                <h3 style={{ marginBottom: "10px" }}>
                    {summary.weekday} • {summary.formatted_date}
                </h3>

                <p style={{
                    display: "inline-block",
                    backgroundColor: "#444",
                    padding: "5px 10px",
                    borderRadius: "12px",
                    marginBottom: "10px"
                }}>
                    {summary.focus || "Uncategorized"}
                </p>

                <p style={{ marginTop: "15px", color: "#ccc" }}>
                    {summary.notes?.trim() !== "" ? summary.notes : "(No notes)"}
                </p>

                <hr style={{ margin: "20px 0", borderColor: "#333" }} />

                <h3>Exercises</h3>

                {exercises.length === 0 ? (
                    <p>No exercises found for this workout.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {exercises.map((ex, index) => {
                            // Convert strings → numbers safely
                            const lb = ex.weight_lb !== null ? Number(ex.weight_lb) : null;
                            const kg = ex.weight_kg !== null ? Number(ex.weight_kg) : null;

                            return (
                                <li key={index} style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #333",
                                    backgroundColor: "#353333",
                                    borderRadius: "6px",
                                    marginBottom: "10px"
                                }}>
                                    <strong>{ex.exercisename}</strong>
                                    <br />
                                    {ex.sets} sets × {ex.reps} reps
                                    <br />

                                    {(lb !== null && !isNaN(lb)) && (kg !== null && !isNaN(kg)) ? (
                                        <span style={{ color: "#ddd" }}>
                                            {lb.toFixed(1)} lb • {kg.toFixed(1)} kg
                                        </span>
                                    ) : (
                                        <span style={{ color: "#888" }}>
                                            No weight recorded
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <div style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px"
            }}>
                <button
                    onClick={() => navigate('/history')}
                    style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "#555",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px"
                    }}>
                    Back to History
                </button>

                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "#555",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px"
                    }}>
                    Back to Dashboard
                </button>
            </div>
            <div style={{
    marginTop: "20px",
    display: "flex",
    gap: "10px"
}}>
    <button
        onClick={() => navigate(`/edit/${logId}`)}
        style={{
            flex: 1,
            padding: "12px",
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "4px"
        }}
    >
        Edit Workout
    </button>
</div>

        </div>
    );
}

export default WorkoutDetails;
