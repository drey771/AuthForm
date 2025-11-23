import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "./components/Registration";
import ThemeToggle from "./components/ThemeToggle";
import { Toaster } from "react-hot-toast";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
