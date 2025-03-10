import Navbar from '../components/Navbar';
import connectDB from "@/lib/mongodb/connect";
export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#112240] text-white min-h-[calc(100vh-64px)] flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Effortless Internal Support
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Create, track, and resolve tickets seamlessly with our intuitive system.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-lg">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
}
