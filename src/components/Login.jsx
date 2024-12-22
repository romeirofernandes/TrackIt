import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import MyLogo from "../assets/logo.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/expenser");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center px-6 py-4">
        <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={MyLogo} alt="TrackIt Logo" className="w-8 h-8" />
            <span className="font-['Bricolage_Grotesque'] font-semibold text-lg text-[#30313D]">
              TrackIt
            </span>
          </Link>
          <Link to="/register">
            <button className="px-4 py-2 bg-[#30313D] text-white rounded-lg font-['Poppins']">
              Register
            </button>
          </Link>
        </div>
      </header>
      <div className="border-b w-full"></div>

      <main className="max-w-md mx-auto mt-16 px-6">
        <h1 className="text-3xl font-['Bricolage_Grotesque'] font-bold mb-8 text-[#30313D] text-center">
          Sign in to your account
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4 font-['Poppins']">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-[#30313D] font-['Poppins'] mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#06AB78]"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[#30313D] font-['Poppins'] mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#06AB78]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#06AB78] text-white font-['Poppins'] font-medium py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center font-['Poppins'] text-[#30313D]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#06AB78] hover:underline">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Login;
