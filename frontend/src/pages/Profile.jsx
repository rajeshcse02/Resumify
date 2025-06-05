import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEffect } from 'react';  

const Profile = () => {
  const { user } = useAuth();
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordChange = async () => {
    setMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Password updated successfully.");
        setPassword("");
        setShowPasswordField(false);
      } else {
        setMessage(data.error || "Error changing password.");
      }
    } catch {
      setMessage("Server error.");
    }
  };
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen px-4 animate-fadeIn">
      <div className="bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-xl p-8 w-full max-w-sm shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <div className="space-y-4">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {/* <p><strong>Password:</strong> ********</p> */}

          <button
            onClick={() => setShowPasswordField(!showPasswordField)}
            className="bg-black text-white dark:bg-white dark:text-black rounded py-2 font-semibold w-full"
          >
            {showPasswordField ? "Cancel" : "Change Password"}
          </button>

          {showPasswordField && (
            <div className="space-y-3">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 rounded bg-white/50 dark:bg-black/20 text-black dark:text-white w-full"
              />
              <button
                onClick={handlePasswordChange}
                className="bg-blue-600 text-white rounded py-2 font-semibold w-full"
              >
                Update Password
              </button>
            </div>
          )}
          {message && <p className="text-sm text-center mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
