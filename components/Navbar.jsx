"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="bg-[#112240] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          TicketHub
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/tickets" className="hover:text-gray-300">Tickets</Link>
          <Link href="/profile" className="hover:text-gray-300">Profile</Link>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full">
              Logout
            </button>
          ) : (
            <button onClick={() => router.push("/login")} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full">
              Login
            </button>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4 bg-[#0A192F] py-4 rounded-lg">
          <Link href="/" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/tickets" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Tickets</Link>
          <Link href="/profile" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>Profile</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full">
              Logout
            </button>
          ) : (
            <button onClick={() => router.push("/login")} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full">
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
