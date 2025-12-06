import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogWorkout() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const [editingIndex, setEditingIndex] = useState(null);
    const [editSets, setEditSets] = useState('');
    const [editReps, setEditReps] = useState('');
    const [editWeight, setEditWeight] = useState('');

    const [availableExercises, setAvailableExercises] = useState([]);
    const [addedExercises, setAddedExercises] = useState([]);

    const [selectedExerciseId, setSelectedExerciseId] = useState('');
    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState(10);
    const [weight, setWeight] = useState(0);

    const [unit, setUnit] = useState('lb');
    const [focus, setFocus] = useState('');


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
            return;
        }

        fetch('http://localhost:5000/api/exercises')
            .then(res => res.json())
            .then(data => {
                setAvailableExercises(data);
            })
            .catch(err => console.error("Failed to load exercises:", err));
    }, [navigate]);

    const handleAddExercise = (e) => {
        e.preventDefault();

        if (!selectedExerciseId) return;

        const exObj = availableExercises.find(
            ex => ex.exerciseid === parseInt(selectedExerciseId)
        );

        if (!exObj) return;

        const entered = parseFloat(weight);

        const newExercise = {
            exerciseId: exObj.exerciseid,
            name: exObj.exercisename,
            sets: parseInt(sets),
            reps: parseInt(reps),
            weightLB: unit === 'lb' ? entered : entered * 2.20462,
            weightKG: unit === 'kg' ? entered : entered / 2.20462,
            unit: unit
        };

        setAddedExercises([...addedExercises, newExercise]);
        setSelectedExerciseId('');
    };

    const handleDeleteExercise = (index) => {
        setAddedExercises((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEditExercise = (index) => {
        const ex = addedExercises[index];
        setEditingIndex(index);
        setEditSets(ex.sets);
        setEditReps(ex.reps);
        setEditWeight(ex.unit === 'lb' ? ex.weightLB : ex.weightKG);
    };

    const handleSaveEdit = () => {
        const updated = [...addedExercises];
        const originalUnit = updated[editingIndex].unit;
        const entered = parseFloat(editWeight);

        updated[editingIndex] = {
            ...updated[editingIndex],
            sets: parseInt(editSets),
            reps: parseInt(editReps),
            weightLB: originalUnit === 'lb' ? entered : entered * 2.20462,
            weightKG: originalUnit === 'kg' ? entered : entered / 2.20462
        };

        setAddedExercises(updated);
        setEditingIndex(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (addedExercises.length === 0) {
            setError("Please add at least one exercise before saving.");
            return;
        }
        if (!focus || focus === "") {
            setError("Please select a workout focus before saving.");
            return;
        }

        const workoutData = {
            userId: user.userid,
            notes: notes,
            focus: focus,
            exercises: addedExercises
        };

        try {
            const response = await fetch('http://localhost:5000/api/workouts/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workoutData)
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                setError("Failed to save workout.");
            }
        } catch (err) {
            setError("Server error. Is the backend running?");
        }
    };

    return (
        <div style={{
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: '#242424',
            minHeight: '100vh',
            color: '#fff'
        }}>
            <h2>Log a Workout</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px'
            }}>

                <div style={{
                    padding: '20px',
                    border: '1px solid #bbb',
                    borderRadius: '8px',
                    backgroundColor: '#353333ff',
                    boxShadow: '0 0 8px rgba(0,0,0,0.08)'
                }}>
                    <h3>Add an Exercise</h3>

                    <label>Exercise:</label>
                    <select
                        value={selectedExerciseId}
                        onChange={(e) => setSelectedExerciseId(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    >
                        <option value="">-- Select Exercise --</option>
                        {availableExercises.map(ex => (
                            <option key={ex.exerciseid} value={ex.exerciseid}>
                                {ex.exercisename}
                            </option>
                        ))}
                    </select>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Sets</label>
                            <input type="number" value={sets} onChange={(e) => setSets(e.target.value)} style={{ width: '100%' }} />
                        </div>

                        <div style={{ flex: 1 }}>
                            <label>Reps</label>
                            <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} style={{ width: '100%' }} />
                        </div>

                        <div style={{ flex: 1 }}>
                            <label>Weight</label>
                            <input
                                type="number"
                                value={weight}
                                step="2.5"
                                onChange={(e) => setWeight(e.target.value)}
                                style={{ width: '100%' }}
                            />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setUnit('lb')}
                                    style={{
                                        flex: 1,
                                        padding: '6px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        backgroundColor: unit === 'lb' ? '#2196F3' : '#555',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    LB
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setUnit('kg')}
                                    style={{
                                        flex: 1,
                                        padding: '6px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        backgroundColor: unit === 'kg' ? '#2196F3' : '#555',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    KG
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddExercise}
                        style={{
                            width: '100%',
                            marginTop: '15px',
                            padding: '10px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Add to List
                    </button>
                </div>

                <div>
                    <h3>Current Session</h3>
                    <div style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        height: '300px',
                        overflowY: 'auto',
                        padding: '10px',
                        backgroundColor: '#353333ff',
                        boxShadow: '0 0 8px rgba(0,0,0,0.1)'
                    }}>
                        {addedExercises.length === 0 ? (
                            <p style={{ textAlign: 'center', marginTop: '100px', color: '#bbb' }}>
                                No exercises added yet.
                            </p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {addedExercises.map((ex, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            padding: '10px',
                                            borderBottom: '1px solid #ccc',
                                            backgroundColor: '#ffffff',
                                            marginBottom: '8px',
                                            borderRadius: '6px',
                                            color: '#222',
                                            fontSize: '16px'
                                        }}
                                    >
                                        <strong>{ex.name}</strong>
                                        <br />
                                        {ex.sets} sets × {ex.reps} reps
                                        <br />
                                        {ex.weightLB.toFixed(1)} lb • {ex.weightKG.toFixed(1)} kg

                                        <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleEditExercise(index)}
                                                style={{
                                                    flex: 1,
                                                    padding: '6px',
                                                    backgroundColor: '#2196F3',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    fontSize: '13px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteExercise(index)}
                                                style={{
                                                    flex: 1,
                                                    padding: '6px',
                                                    backgroundColor: '#d32f2f',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    fontSize: '13px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {editingIndex !== null && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#353333',
                    borderRadius: '8px',
                    border: '1px solid #555'
                }}>
                    <h3>Edit Exercise</h3>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Sets</label>
                            <input
                                type="number"
                                value={editSets}
                                onChange={(e) => setEditSets(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div style={{ flex: 1 }}>
                            <label>Reps</label>
                            <input
                                type="number"
                                value={editReps}
                                onChange={(e) => setEditReps(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div style={{ flex: 1 }}>
                            <label>Weight</label>
                            <input
                                type="number"
                                value={editWeight}
                                onChange={(e) => setEditWeight(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={handleSaveEdit}
                            style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Save Changes
                        </button>

                        <button
                            type="button"
                            onClick={() => setEditingIndex(null)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: '#888',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '25px' }}>
                <label><strong>Workout Focus:</strong></label>
                <select
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '5px',
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #555',
                        borderRadius: '4px'
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
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
                <label><strong>Workout Notes:</strong></label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', height: '80px', padding: '8px' }}
                />

                <button type="submit" style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '18px',
                    marginTop: '10px'
                }}>
                    Save Complete Workout
                </button>
            </form>

            <button onClick={() => navigate('/dashboard')} style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#777',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginTop: '10px'
            }}>
                Cancel
            </button>
        </div>
    );
}

export default LogWorkout;
