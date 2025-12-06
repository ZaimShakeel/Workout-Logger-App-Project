import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MuscleBalance() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [report, setReport] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/reports/muscle-balance/${user.userid}`);
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                setReport(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load muscle balance report.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user.userid]);

    if (loading) return <p style={{ color: "white" }}>Loading...</p>;

    if (error) return (
        <div style={{ color: "white", padding: 20 }}>
            <p>{error}</p>
            <button onClick={() => navigate("/dashboard")}>Back</button>
        </div>
    );

    return (
        <div style={{ padding: 20, maxWidth: "800px", margin: "0 auto", color: "white" }}>
            <h2>Muscle Balance Analyzer</h2>

            {/* Percent List */}
            <div style={{ marginTop: 20 }}>
                {report.percentages.map((m, i) => (
                    <div key={i} style={{
                        background: "#1f1f1f",
                        padding: "12px",
                        borderRadius: "6px",
                        marginBottom: "10px"
                    }}>
                        <strong>{m.muscle}</strong>: {m.percent}% 
                        <span style={{ color: "#888" }}> (Volume: {m.volume})</span>
                    </div>
                ))}
            </div>

            {/* Recommendations */}
            <div
                style={{
                    marginTop: 20,
                    background: "#2d2d2d",
                    padding: "15px",
                    borderRadius: "8px",
                    whiteSpace: "pre-wrap",
                }}
            >
                <h3>Recommendations</h3>
                <p>{report.recommendation}</p>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate("/dashboard")}
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
                Back to Dashboard
            </button>
        </div>
    );
}

export default MuscleBalance;
