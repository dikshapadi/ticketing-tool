import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets", { method: "GET" });
        const data = await response.json();

        const ticketsWithUserNames = await Promise.all(
          data.map(async (ticket) => {
            try {
              console.log(
                `Fetching user for ticket ID: ${ticket._id}, Created By: ${ticket.createdBy}`
              );

              // Fetch createdBy name
              const createdByResponse = await fetch(
                `/api/user?id=${ticket.createdBy}`
              );
              const createdByData = await createdByResponse.json();
              const createdByName = createdByData.name || "Unknown";

              // Fetch assignedTo name (if assigned)
              let assignedToName = "Unassigned";
              if (ticket.assignedTo) {
                const assignedToResponse = await fetch(
                  `/api/user?id=${ticket.assignedTo}`
                );
                const assignedToData = await assignedToResponse.json();
                assignedToName = assignedToData.name || "Unknown";
              }

              return {
                ...ticket,
                createdBy: createdByName,
                assignedTo: assignedToName,
              };
            } catch (error) {
              console.error("Error fetching user data:", error);
              return {
                ...ticket,
                createdBy: "Unknown",
                assignedTo: "Unassigned",
              };
            }
          })
        );

        setTickets(ticketsWithUserNames);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const fetchUserName = async (userId) => {
    try {
      const res = await fetch(`/api/user?id=${userId}`);
      const data = await res.json();
      return data.name;
    } catch {
      return "Unknown";
    }
  };
  const handleSelfAssign = async (id) => {
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch("/api/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          assignedTo: userId,
          status: "in progress",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ticket");
      }

      const updatedTicket = await response.json();
      const assignedToName = await fetchUserName(userId);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === id
            ? { ...ticket, assignedTo: assignedToName, status: "in progress" }
            : ticket
        )
      );
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  return (
    <div className="bg-[#0A192F] min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">All Tickets</h1>
          <Link href="/tickets/new">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
            + Create Ticket
          </button>
          </Link>
        </div>

        {loading ? (
          <p className="text-center">Loading tickets...</p>
        ) : (
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
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="border-b border-gray-600 hover:bg-gray-700 transition"
                  >
                    <td className="p-3">{ticket.title}</td>
                    <td className="p-3">{ticket.description}</td>
                    <td className="p-3">{ticket.createdBy}</td>
                    <td className="p-3">{ticket.assignedTo || "Unassigned"}</td>
                    <td
                      className={`p-3 font-bold ${
                        ticket.status === "open"
                          ? "text-green-400"
                          : ticket.status === "in progress"
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      {ticket.status}
                    </td>
                    <td
                      className={`p-3 font-bold ${
                        ticket.priority === "urgent"
                          ? "text-red-400"
                          : ticket.priority === "medium"
                          ? "text-yellow-300"
                          : "text-green-400"
                      }`}
                    >
                      {ticket.priority}
                    </td>
                    <td className="p-3">
                      {ticket.status === "open" &&
                      (!ticket.assignedTo ||
                        ticket.assignedTo === "Unassigned") ? (
                        <button
                          onClick={() => handleSelfAssign(ticket._id)}
                          className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded"
                        >
                          Self Assign
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
