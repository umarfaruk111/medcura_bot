import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react"; // 👁 Import icons

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Password toggle state
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { success, message } = await signUp(fullName, email, password);
    setLoading(false);

    if (success) {
      toast.success("Account created successfully! Please sign in 🎉");
      navigate("/signin"); // ✅ Redirect to Sign In
    } else {
      toast.error(message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Logo + Header */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.jpg" alt="Medcura Bot Logo" className="w-16 h-16 mb-2 rounded-full" />
          <h1 className="text-2xl font-bold text-blue-600">Medcura Bot</h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Password Input with Eye Icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // 👈 Toggle visibility
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg font-medium transition-all ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
