import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import MyLogo from "../assets/logo.svg";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      navigate("/login");
    } catch (error) {
      setError(error.message);
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
          <Link to="/">
            <button className="px-4 py-2 bg-[#30313D] text-white rounded-lg font-['Poppins']">
              Home
            </button>
          </Link>
        </div>
      </header>
      <div className="border-b w-full"></div>
      <main className="max-w-md mx-auto mt-12 px-6 mb-12">
        <h1 className="text-3xl font-['Bricolage_Grotesque'] font-bold mb-8 text-[#30313D] text-center">
          Create an account
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4 font-['Poppins']">
            {error}
          </p>
        )}

        <form
          onSubmit={handleRegister}
          className="space-y-6 bg-[#f2f2f2] shadow-md rounded-lg p-8"
        >
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
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[#30313D] font-['Poppins'] mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#06AB78]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#06AB78] text-white font-['Poppins'] font-medium py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center font-['Poppins'] text-[#30313D]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#06AB78] hover:underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Register;
