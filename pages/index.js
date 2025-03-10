"use client";

import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[#0A192F] flex flex-col justify-center items-center px-4 sm:px-8">

        {/* Shiny Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E3A8A]"></div>

        {/* Subtle Shiny Effect */}
        <div className="absolute inset-0">
          {/* White Glow */}
          <div className="absolute top-10 left-[10%] sm:left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white opacity-10 blur-[120px]"></div>
          <div className="absolute bottom-10 right-[10%] sm:right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white opacity-10 blur-[120px]"></div>

          {/* Black Shadow for Depth */}
          <div className="absolute top-1/3 left-1/4 sm:left-1/3 w-52 sm:w-80 h-52 sm:h-80 bg-black opacity-20 blur-[100px]"></div>
        </div>

        {/* Content Section */}
        <section className="relative text-center text-white z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Effortless Internal Support
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-6">
            Create, track, and resolve tickets seamlessly with our intuitive system.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-5 sm:px-6 py-2 rounded-full text-base sm:text-lg transition-transform duration-300 hover:scale-105">
            Get Started
          </button>
        </section>
      </div>
    </>
  );
}
