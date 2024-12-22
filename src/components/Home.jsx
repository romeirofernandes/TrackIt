import React from "react";
import { Link } from "react-router-dom";
import MyLogo from "../assets/logo.svg";
import MyTick from "../assets/tick.svg";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-between items-center px-6 py-4">
        <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={MyLogo} alt="TrackIt Logo" className="w-8 h-8" />
            <span className="font-['Bricolage_Grotesque'] font-semibold text-lg">
              TrackIt
            </span>
          </div>
          <Link to="/contact">
            <button className="px-4 py-2 bg-[#30313D] text-white rounded-lg font-['Poppins']">
              Feedback
            </button>
          </Link>
        </div>
      </header>
      <div className="border-b w-full"></div>

      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-['Bricolage_Grotesque'] font-bold mb-8 text-[#30313D]">
          Helping you save more, every month!
        </h1>

        <h2 className="text-xl font-['Poppins'] mb-8 text-[#30313D]">
          Tools that we provide for students:
        </h2>
        <div className="flex items-center justify-center">
          <div className="space-y-4 mb-8">
            {[
              "Get a personalized budget plan.",
              "Track all your spendings.",
              "Unlimited support.",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 justify-left">
                <img src={MyTick} alt="Checkmark" className="w-5 h-5" />
                <span className="font-['Poppins'] text-[#30313D]">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/register"
          className="inline-block px-8 py-3 bg-[#06AB78] text-white rounded-lg font-['Poppins'] font-medium hover:bg-opacity-90 transition-colors"
        >
          Start Saving Now
        </Link>

        <p className="text-sm font-['Poppins'] text-gray-500 mt-6">
          *How ironic would it be if I charged y'all for a money saving tool...
        </p>
      </main>
    </div>
  );
};

export default Home;
