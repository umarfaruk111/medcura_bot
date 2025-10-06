import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import logo from "../assets/logo.jpg";
import { Eye, EyeOff } from "lucide-react"; // 👁 Import icons

export default function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Toggle state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.success) {
      toast.success("Welcome back! Successfully signed in 🎉");
      navigate("/chat");
    } else {
      toast.error(res.message || "Invalid credentials, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        {/* Logo and Heading */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Medcura Bot Logo"
            className="h-16 w-16 mb-2 rounded-full"
          />
          <h1 className="text-2xl font-bold text-gray-800">Medcura Bot</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your digital healthcare assistant
          </p>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
          Sign In
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password Field with Eye Icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // 👈 Toggle visibility
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
