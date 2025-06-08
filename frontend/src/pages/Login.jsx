import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from 'react';  

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Email is not valid";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear individual field error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        login(data);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.error || "Invalid credentials");
        setErrors({ general: data.error || "Invalid credentials" });
      }
    } catch {
      toast.error("Server error. Please try again later.");
      setErrors({ general: "Server error. Please try again later." });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 animate-fadeIn">
      <div className="bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-xl p-8 w-full max-w-sm shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form className="flex flex-col gap-4" onSubmit={async (e) => {
          setLoading(true);
          await handleSubmit(e);
          setLoading(false);
        }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded bg-white/50 dark:bg-black/20 text-black dark:text-white"
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="p-3 rounded bg-white/50 dark:bg-black/20 text-black dark:text-white"
            disabled={loading}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <button
            className="bg-gradient-to-br from-black/80 to-black/40 
        dark:from-white/80 dark:to-white/30 text-white dark:text-black rounded py-2 font-semibold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {errors.general && <p className="text-red-600 text-sm text-center">{errors.general}</p>}
        </form>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{" "}
          <span className="underline font-medium text-white-600 cursor-pointer" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
