import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center mb-4">
              <img
                src={user.profilePicture}
                alt={user.fullname}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  {user.fullname}
                </h2>
                <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
              </div>
            </div>

            <p className="text-black dark:text-white">
              <span className="font-medium">Phone:</span> {user.phone || "-"}
            </p>
            <p className="text-black dark:text-white">
              <span className="font-medium">Gender:</span> {user.gender || "-"}
            </p>
            <p className="text-black dark:text-white mt-2">
              <span className="font-medium">Interests:</span>{" "}
              {user.interests && user.interests.length > 0
                ? user.interests.join(", ")
                : "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
