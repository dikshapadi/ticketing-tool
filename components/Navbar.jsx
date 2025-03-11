"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      setIsLoggedIn(!!token);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Tickets", href: "/tickets" },
    { name: "Profile", href: "/profile" }
  ];

  return (
    <nav className="bg-[#112240] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-400">
          TicketHub
        </Link>

        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative hover:text-gray-300 ${pathname === item.href ? "after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] after:bg-blue-400" : ""
                }`}
            >
              {item.name}
            </Link>
          ))}
          {userRole === 'support' && (
            <Link
              href="/admin"
              className={`relative hover:text-gray-300 ${pathname === '/admin' ? "after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[2px] after:bg-blue-400" : ""
                }`}
            >
              Manage Tickets
            </Link>
          )}
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
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-gray-300 ${pathname === item.href ? "underline" : ""
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {userRole === 'support' && (
            <Link
              href="/admin"
              className={`hover:text-gray-300 ${pathname === '/admin' ? "underline" : ""
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Manage Tickets
            </Link>
          )}
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
