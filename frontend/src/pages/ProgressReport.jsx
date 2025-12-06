import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProgressionReport() {
    const { exerciseId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadReport = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/reports/${exerciseId}/${user.userid}`
                );

                if (!res.ok) throw new Error("Failed to fetch");

                const result = await res.json();
                setData(result);
            } catch (err) {
                console.error(err);
                setError("Failed to load progression report.");
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, [exerciseId, user.userid]);

    if (loading) {
        return <p style={{ color: "white", padding: 20 }}>Loading...</p>;
    }

    if (error) {
        return (
            <div style={{ padding: 20, color: "white" }}>
                <p>{error}</p>
                <button
                    onClick={() => navigate(`/exercise/${exerciseId}`)}
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        width: "100%",
                        background: "#555",
                        border: "none",
                        color: "white",
                        borderRadius: "6px",
                    }}
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: 20, maxWidth: "800px", margin: "0 auto", color: "white" }}>
            <h2>Progression Report</h2>

            {!data || !data.latest_weight ? (
                <p>Not enough data to generate a report.</p>
            ) : (
                <div
                    style={{
                        background: "#1f1f1f",
                        padding: "15px",
                        borderRadius: "10px",
                        marginTop: "20px",
                        boxShadow: "0 0 15px rgba(0,0,0,0.35)",
                    }}
                >
                    <p><strong>Starting Weight:</strong> {data.start_weight} lb</p>
                    <p><strong>Latest Weight:</strong> {data.latest_weight} lb</p>
                    <p><strong>Best Weight Ever:</strong> {data.best_weight} lb</p>
                    <p><strong>Average Training Weight:</strong> {data.average_weight} lb</p>
                    <p><strong>Total Sessions:</strong> {data.sessions}</p>
                    <p><strong>Improvement:</strong> {data.pct_change}%</p>
                    <p><strong>Consistency:</strong> {data.consistency_days} days per session</p>
                    <p><strong>Estimated 1RM:</strong> {data.estimated_1RM} lb</p>
                    <p><strong>Trend:</strong> {data.trend}</p>
                    <p><strong>Next Step:</strong> {data.next_step}</p>
                </div>
            )}

            <button
                onClick={() => navigate(`/exercise-history/${exerciseId}`)}
                style={{
                    marginTop: "20px",
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#555",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                }}
            >
                Back to Exercise History
            </button>
        </div>
    );
}

export default ProgressionReport;
