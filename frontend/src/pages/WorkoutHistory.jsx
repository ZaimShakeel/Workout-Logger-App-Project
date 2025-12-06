import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WorkoutHistory() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [focusFilter, setFocusFilter] = useState('All');

    useEffect(() => {
        if (!user || !localStorage.getItem('token')) {
            navigate('/');
            return;
        }

        const fetchLogs = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/workouts/logs/${user.userid}`
                );

                if (!res.ok) throw new Error('Failed to fetch workout logs');

                const data = await res.json();
                setLogs(data);
            } catch (err) {
                console.error(err);
                setError('Could not load workout history.');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [navigate, user]);

    // Apply filter directly during render
    const displayedLogs = logs.filter((log) => {
        if (focusFilter === 'All') return true;
        return (log.focus || '').toLowerCase() === focusFilter.toLowerCase();
    });

    return (
        <div
            style={{
                padding: '20px',
                maxWidth: '900px',
                margin: '0 auto',
                backgroundColor: '#242424',
                minHeight: '100vh',
                width: '100%',
                color: '#f5f5f5'
            }}
        >
            <h2 style={{ marginBottom: '10px' }}>Workout History</h2>
            <p style={{ marginTop: 0, marginBottom: '20px', color: '#ccc' }}>
                All workouts you’ve logged so far.
            </p>

            {/* Focus Filter */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <select
                    value={focusFilter}
                    onChange={(e) => setFocusFilter(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#1f1f1f',
                        border: '1px solid #555',
                        color: '#fff',
                        borderRadius: '6px'
                    }}
                >
                    <option value="All">All Focuses</option>
                    <option value="Push">Push</option>
                    <option value="Pull">Pull</option>
                    <option value="Legs">Legs</option>
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Full Body">Full Body</option>
                    <option value="Arms">Arms</option>
                    <option value="Shoulders">Shoulders</option>
                </select>
            </div>

            {loading && <p>Loading workouts...</p>}
            {error && <p style={{ color: 'tomato' }}>{error}</p>}

            {!loading && displayedLogs.length === 0 && (
                <p>No workouts match your filter.</p>
            )}

            {!loading && displayedLogs.length > 0 && (
                <div
                    style={{
                        backgroundColor: '#1f1f1f',
                        borderRadius: '10px',
                        padding: '15px',
                        boxShadow: '0 0 15px rgba(0,0,0,0.35)'
                    }}
                >
                    {displayedLogs.map((log) => (
                        <div
                            key={log.logid}
                            style={{
                                padding: '12px 10px',
                                borderBottom: '1px solid #333',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px'
                            }}
                        >
                            {/* Top row */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                                    {log.weekday} • {log.formatted_date}
                                </span>

                                <span
                                    style={{
                                        fontSize: '13px',
                                        backgroundColor: '#444',
                                        padding: '3px 8px',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                >
                                    {log.focus || 'Uncategorized'}
                                </span>
                            </div>

                            <span style={{ color: '#ddd', fontSize: '14px' }}>
                                {log.notes?.trim() !== '' ? log.notes : '(No notes)'}
                            </span>

                            {/* Buttons */}
                            <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/history/${log.logid}`)}
                                    style={{
                                        padding: '6px 10px',
                                        fontSize: '13px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        backgroundColor: '#2196F3',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    View Details
                                </button>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!window.confirm('Delete this workout?')) return;

                                        try {
                                            const res = await fetch(
                                                `http://localhost:5000/api/workouts/log/${log.logid}`,
                                                { method: 'DELETE' }
                                            );

                                            if (res.ok) {
                                                setLogs((prev) =>
                                                    prev.filter((l) => l.logid !== log.logid)
                                                );
                                            } else {
                                                alert('Failed to delete workout.');
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert('Server error when deleting.');
                                        }
                                    }}
                                    style={{
                                        padding: '6px 10px',
                                        fontSize: '13px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        backgroundColor: '#d32f2f',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    marginTop: '20px',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#555',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Back to Dashboard
            </button>
        </div>
    );
}

export default WorkoutHistory;
