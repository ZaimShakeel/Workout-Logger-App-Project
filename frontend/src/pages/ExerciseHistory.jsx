import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ExerciseHistory() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [exercises, setExercises] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/exercises/all");
                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                setExercises(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load exercise history.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{
                padding: "20px",
                maxWidth: "900px",
                margin: "0 auto",
                color: "white"
            }}>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: "20px",
                maxWidth: "900px",
                margin: "0 auto",
                color: "white"
            }}>
                <p>{error}</p>
                <button
                    onClick={() => navigate("/dashboard")}
                    style={{
                        marginTop: "20px",
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#555",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    // Filter search results
    const filtered = exercises.filter((ex) => {
        if (!search.trim()) return true;
        return ex.exercisename.toLowerCase().includes(search.toLowerCase());
    });

    // Group by body part
    const groups = filtered.reduce((acc, ex) => {
        const parts = ex.bodypart ? ex.bodypart.split(", ") : ["Other"];
        parts.forEach(bp => {
            if (!acc[bp]) acc[bp] = [];
            acc[bp].push(ex);
        });
        return acc;
    }, {});

    const sortedBodyparts = Object.keys(groups).sort();

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "900px",
                margin: "0 auto",
                color: "white",
                minHeight: "100vh",
                backgroundColor: "#242424"
            }}
        >
            <h2>Exercise History</h2>
            <p style={{ color: "#ccc" }}>View exercises grouped by muscle group.</p>

            {/* Search bar */}
            <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "20px",
                    backgroundColor: "#1f1f1f",
                    border: "1px solid #555",
                    color: "#fff",
                    borderRadius: "6px"
                }}
            />

            <div
                style={{
                    backgroundColor: "#1f1f1f",
                    borderRadius: "10px",
                    padding: "15px",
                    boxShadow: "0 0 15px rgba(0,0,0,0.35)",
                    maxHeight: "70vh",
                    overflowY: "auto"
                }}
            >
                {sortedBodyparts.map((bp) => (
                    <div key={bp} style={{ marginBottom: "25px" }}>
                        <h3
                            style={{
                                borderBottom: "1px solid #555",
                                paddingBottom: "5px",
                                marginBottom: "10px"
                            }}
                        >
                            {bp}
                        </h3>

                        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                            {groups[bp].map((ex) => (
                                <li
                                    key={ex.exerciseid}
                                    style={{
                                        padding: "10px",
                                        background: "#2d2d2d",
                                        marginBottom: "8px",
                                        borderRadius: "6px",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => navigate(`/exercise-history/${ex.exerciseid}`)}
                                >
                                    {ex.exercisename}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

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
                    cursor: "pointer"
                }}
            >
                Back to Dashboard
            </button>
        </div>
    );
}



export default ExerciseHistory;
