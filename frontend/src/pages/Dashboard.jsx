import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}>
                <h2>Welcome, {user ? user.username : 'User'}!</h2>
                <button onClick={handleLogout} style={{ padding: '5px 10px' }}>
                    Logout
                </button>
            </div>

            <hr />

            <h3>Quick Actions</h3>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '15px', 
                marginTop: '20px',
                maxWidth: '350px'
            }}>

                {/* Log Workout */}
                <Link to="/log-workout">
                    <button
                        style={{
                            width: '100%',
                            padding: '15px 30px',
                            fontSize: '18px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '6px'
                        }}
                    >
                        + Log New Workout
                    </button>
                </Link>

                {/* Workout History */}
                <Link to="/history">
                    <button
                        style={{
                            width: '100%',
                            padding: '15px 30px',
                            fontSize: '18px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '6px'
                        }}
                    >
                        View Workout History
                    </button>
                </Link>

                {/* Exercise History */}
                <Link to="/exercise-history">
                    <button
                        style={{
                            width: '100%',
                            padding: '15px 30px',
                            fontSize: '18px',
                            backgroundColor: '#9C27B0',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '6px'
                        }}
                    >
                        Exercise History
                    </button>
                </Link>

                {/* ⭐ NEW — Muscle Balance Analyzer */}
                <Link to="/muscle-balance">
                    <button
                        style={{
                            width: '100%',
                            padding: '15px 30px',
                            fontSize: '18px',
                            backgroundColor: '#FF9800',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '6px'
                        }}
                    >
                        Muscle Balance Analyzer
                    </button>
                </Link>

            </div>
        </div>
    );
}

export default Dashboard;
