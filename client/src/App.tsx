import type React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SymptomSelection from "./components/SymptomSelection";
import TroubleshootingGuide from "./components/TroubleshootingGuide";
import ErrorCodeLookup from "./components/ErrorCodeLookup";
import SolutionDisplay from "./components/SolutionDisplay";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/symptoms"
          element={
            <ProtectedRoute>
              <SymptomSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/troubleshoot"
          element={
            <ProtectedRoute>
              <TroubleshootingGuide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/error-lookup"
          element={
            <ProtectedRoute>
              <ErrorCodeLookup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solutions"
          element={
            <ProtectedRoute>
              <SolutionDisplay />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
