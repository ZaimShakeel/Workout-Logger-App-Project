import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ExerciseHistoryDetails() {
    const { exerciseId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [exerciseName, setExerciseName] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user || !user.userid) {
            navigate("/");
            return;
        }

        const idNum = parseInt(exerciseId);
        if (!exerciseId || isNaN(idNum)) {
            setError("Invalid exercise.");
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                const nameRes = await fetch(
                    `http://localhost:5000/api/exercises/name/${idNum}`
                );
                if (!nameRes.ok) throw new Error("Failed to load exercise name");

                const nameData = await nameRes.json();
                setExerciseName(nameData.exercisename || "Exercise");

                const histRes = await fetch(
                    `http://localhost:5000/api/exercises/history/${idNum}/${user.userid}`
                );
                if (!histRes.ok) throw new Error("Failed to load history");

                const histData = await histRes.json();
                setHistory(histData);
            } catch (err) {
                console.error("History load error:", err);
                setError("Failed to load exercise history.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [exerciseId, navigate, user]);

    if (loading) {
        return (
            <div
                style={{
                    padding: "20px",
                    maxWidth: "900px",
                    margin: "0 auto",
                    color: "white",
                    minHeight: "100vh",
                    backgroundColor: "#242424",
                }}
            >
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    padding: "20px",
                    maxWidth: "900px",
                    margin: "0 auto",
                    color: "white",
                    minHeight: "100vh",
                    backgroundColor: "#242424",
                }}
            >
                <p>{error}</p>
                <button
                    onClick={() => navigate("/exercise-history")}
                    style={{
                        marginTop: "20px",
                        padding: "12px",
                        width: "100%",
                        backgroundColor: "#555",
                        border: "none",
                        color: "white",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    Back to Exercise List
                </button>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "900px",
                margin: "0 auto",
                color: "white",
                minHeight: "100vh",
                backgroundColor: "#242424",
            }}
        >
            <h2>{exerciseName} — Full History</h2>

            {history.length === 0 ? (
                <p>No records found for this exercise.</p>
            ) : (
                <div
                    style={{
                        marginTop: "20px",
                        backgroundColor: "#1f1f1f",
                        padding: "15px",
                        borderRadius: "10px",
                        boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                        maxHeight: "70vh",
                        overflowY: "auto",
                    }}
                >
                    {history.map((h, i) => {
                        const lb =
                            h.weight_lb !== null && h.weight_lb !== undefined
                                ? Number(h.weight_lb)
                                : null;
                        const kg =
                            h.weight_kg !== null && h.weight_kg !== undefined
                                ? Number(h.weight_kg)
                                : null;

                        return (
                            <div
                                key={i}
                                style={{
                                    padding: "12px",
                                    marginBottom: "12px",
                                    backgroundColor: "#2d2d2d",
                                    borderRadius: "8px",
                                }}
                            >
                                <strong>
                                    {h.weekday} • {h.date}
                                </strong>
                                <br />
                                {h.sets} sets × {h.reps} reps
                                <br />
                                {lb !== null && kg !== null ? (
                                    <span>
                                        {lb.toFixed(1)} lb • {kg.toFixed(1)} kg
                                    </span>
                                ) : (
                                    <span style={{ color: "#888" }}>
                                        No weight recorded
                                    </span>
                                )}
                                <br />
                                <span style={{ color: "#ccc" }}>
                                    Focus: {h.focus || "None"}
                                </span>
                                <br />
                                <span style={{ color: "#888" }}>
                                    Notes: {h.notes || "(No notes)"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            <button
                onClick={() => navigate(`/progress/${exerciseId}`)}

                style={{
                    marginTop: "20px",
                    padding: "12px",
                    width: "100%",
                    backgroundColor: "#1e88e5",
                    border: "none",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                View Progression Report
            </button>

            <button
                onClick={() => navigate("/exercise-history")}
                style={{
                    marginTop: "20px",
                    padding: "12px",
                    width: "100%",
                    backgroundColor: "#555",
                    border: "none",
                    color: "white",
                    borderRadius: "6px",
                }}
            >
                Back to Exercise List
            </button>
        </div>
    );
}

export default ExerciseHistoryDetails;
