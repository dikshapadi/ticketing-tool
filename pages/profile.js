import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Tickets() {
  const [createdTickets, setCreatedTickets] = useState([]);
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      window.location.href = "/login";
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/user?id=${userId}`);
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets", { method: "GET" });
        const data = await response.json();

        const createdByMe = [];
        const assignedToMe = [];

        await Promise.all(
          data.map(async (ticket) => {
            let createdByName = "Unknown";
            let assignedToName = "Unassigned";

            try {
              const createdByResponse = await fetch(`/api/user?id=${ticket.createdBy}`);
              const createdByData = await createdByResponse.json();
              createdByName = createdByData.name || "Unknown";
            } catch {}

            if (ticket.assignedTo) {
              try {
                const assignedToResponse = await fetch(`/api/user?id=${ticket.assignedTo}`);
                const assignedToData = await assignedToResponse.json();
                assignedToName = assignedToData.name || "Unknown";
              } catch {}
            }

            const formattedTicket = {
              ...ticket,
              createdBy: createdByName,
              assignedTo: assignedToName,
            };

            if (ticket.createdBy === userId) {
              createdByMe.push(formattedTicket);
            }
            if (ticket.assignedTo === userId) {
              assignedToMe.push(formattedTicket);
            }
          })
        );

        setCreatedTickets(createdByMe);
        setAssignedTickets(assignedToMe);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchTickets();
  }, []);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const response = await fetch("/api/uploadProfilePic", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUserProfile((prev) => ({ ...prev, profilePic: data.url }));
      } else {
        console.error("Error updating profile picture:", data.message);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="bg-[#0A192F] min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto py-8 px-4 grid grid-cols-12 gap-8">
  {userProfile && (
    <div className="col-span-4 flex flex-col items-center bg-gray-800 p-8 rounded-lg text-center">
      <label className="cursor-pointer relative">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleProfilePicChange}
        />
        {userProfile.profilePic ? (
          <img
            src={userProfile.profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300 hover:opacity-80 transition"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center text-5xl font-bold bg-gray-700 text-white rounded-full">
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </label>
      <h2 className="text-2xl font-extrabold mt-4">{userProfile.name}</h2>
      <p className="text-lg text-gray-400">{userProfile.email}</p>
    </div>
  )}

  <div className="col-span-8">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold">My Tickets</h1>
      <Link href="/tickets/new">
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
          + Create Ticket
        </button>
      </Link>
    </div>

    {loading ? (
      <p className="text-center">Loading tickets...</p>
    ) : (
      <>
        <h2 className="text-lg font-bold mt-6 mb-2">Created by Me</h2>
        {createdTickets.length > 0 ? (
          <TicketTable tickets={createdTickets} />
        ) : (
          <p>No tickets created by you.</p>
        )}

        <h2 className="text-lg font-bold mt-6 mb-2">Assigned to Me</h2>
        {assignedTickets.length > 0 ? (
          <TicketTable tickets={assignedTickets} />
        ) : (
          <p>No tickets assigned to you.</p>
        )}
      </>
    )}
  </div>
</div>

    </div>
  );
}

function TicketTable({ tickets }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border border-gray-600 rounded-lg">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3">Title</th>
            <th className="p-3">Description</th>
            <th className="p-3">Created By</th>
            <th className="p-3">Assigned To</th>
            <th className="p-3">Status</th>
            <th className="p-3">Priority</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id} className="border-b border-gray-600 hover:bg-gray-700 transition">
              <td className="p-3">{ticket.title}</td>
              <td className="p-3">{ticket.description}</td>
              <td className="p-3">{ticket.createdBy}</td>
              <td className="p-3">{ticket.assignedTo || "Unassigned"}</td>
              <td className="p-3 font-bold text-yellow-400">{ticket.status}</td>
              <td className="p-3 font-bold text-green-400">{ticket.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}