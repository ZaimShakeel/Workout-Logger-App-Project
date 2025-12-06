import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogWorkout from './pages/LogWorkout'; 
import WorkoutHistory from './pages/WorkoutHistory';
import WorkoutDetails from './pages/WorkoutDetails';
import EditWorkout from './pages/EditWorkout';
import ExerciseHistory from './pages/ExerciseHistory';
import ExerciseHistoryDetails from './pages/ExerciseHistoryDetails';
import ProgressReport from "./pages/ProgressReport";
import MuscleBalance from "./pages/MuscleBalance";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Definitions */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/log-workout" element={<LogWorkout />} />
        <Route path="/history" element={<WorkoutHistory />} />
        <Route path="/history/:logId" element={<WorkoutDetails />} />
        <Route path="/edit/:logId" element={<EditWorkout />} />
        <Route path="/exercise-history" element={<ExerciseHistory />} />
        <Route path="/exercise-history/:exerciseId" element={<ExerciseHistoryDetails />} />
        <Route path="/progress/:exerciseId" element={<ProgressReport />} />
        <Route path="/muscle-balance" element={<MuscleBalance />} />

        

      </Routes>
    </BrowserRouter>
  );
}

export default App;