import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Editor from "./pages/Editor";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/auth.store";
import CustomCursor from "./components/CustomCursor";
import "./App.css";

function App() {
  const isAuth = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <CustomCursor />
      <div className="app-main">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={isAuth ? <Navigate to="/dashboard" /> : <Signup />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={isAuth ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/document/:id" 
            element={isAuth ? <Editor /> : <Navigate to="/login" />} 
          />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



