import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // Optional: loading indicator while checking auth
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    toast.error("You must be logged in to access this page");
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected page
  return children;
}
