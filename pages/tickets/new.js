import { useState } from "react";
import Navbar from "@/components/Navbar";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low"); // Set default as per schema
  const [category, setCategory] = useState("General");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const createdBy = localStorage.getItem("userId");

    // Basic validation
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority: priority.toLowerCase(), // Ensure lowercase
          category,
          createdBy,
          category,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Ticket created successfully!");
      setTitle("");
      setDescription("");
      setPriority("low");
      setCategory("General");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
    <Navbar/>
        <div className="min-h-screen bg-[#0A192F] text-white flex items-center justify-center">
      <div className="bg-[#112240] p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Raise a Ticket</h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300">Title</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300">Description</label>
            <textarea
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-gray-300">Priority</label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-300">Category</label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="K8s">K8s</option>
              <option value="Networks">Networks</option>
              <option value="Project Based">Project Based</option>
            </select>
          </div>

          {/* Submit Button */}
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded w-full">
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
    </>

  );
};

export default NewTicket;
