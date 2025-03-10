import { useState } from "react";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("General");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    setError(""); // Clear errors if valid
  };

  return (
    <div className="min-h-screen bg-[#112240] text-white flex items-center justify-center">
      <div className="bg-[#0A192F] p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Raise a Ticket</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
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
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
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
              <option value="IT Support">K8s</option>
              <option value="HR">Networks</option>
              <option value="Finance">Project Based</option>
            </select>
          </div>

          {/* Submit Button */}
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded w-full">
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;
