import Link from 'next/link';
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="bg-[#0A192F] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          TicketHub
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/tickets" className="hover:text-gray-300">Tickets</Link>
          <Link href="/profile" className="hover:text-gray-300">Profile</Link>
        </div>

        {/* Login/Logout Button (Static for now, will update with auth later) */}
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"  
        onClick={() => router.push("/login")}>
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
