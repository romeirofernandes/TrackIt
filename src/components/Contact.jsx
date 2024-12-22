import React from "react";
import { Link } from "react-router-dom";
import MyLogo from "../assets/logo.svg";

const Contact = () => {
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

      <main className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-['Bricolage_Grotesque'] font-bold mb-8 text-[#30313D] text-center">
          We'd love to hear from you
        </h1>

        <form className="bg-[#f2f2f2] shadow-md rounded-lg p-8">
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-[#30313D] font-['Poppins'] mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#06AB78]"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-[#30313D] font-['Poppins'] mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg font-['Poppins'] focus:outline-none focus:ring-2 focus:ring-[#06AB78]"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-[#30313D] font-['Poppins'] mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg font-['Poppins'] resize-none focus:outline-none focus:ring-2 focus:ring-[#06AB78]"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#06AB78] text-white font-['Poppins'] font-medium py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Send Feedback
          </button>
        </form>
      </main>
    </div>
  );
};

export default Contact;
