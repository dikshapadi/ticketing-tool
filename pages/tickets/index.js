import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";  
import Link from "next/link";
export default function Tickets() {
    const router = useRouter(); 
  
      useEffect(() => {
          const userToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
          if (!userToken) {
              router.replace("/login");
          } else {
              router.replace("/tickets");}
      }, [router]); 
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Login Issue",
      description: "User unable to log in with correct credentials.",
      createdBy: "John Doe",
      assignedTo: "",
      status: "open",
      priority: "high",
    },
    {
      id: 2,
      title: "Bug in Reports Page",
      description: "Data not loading correctly in analytics reports.",
      createdBy: "Jane Smith",
      assignedTo: "Alex Brown",
      status: "in progress",
      priority: "medium",
    },
  ]);

  const handleSelfAssign = (id) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === id && ticket.status === "open" && !ticket.assignedTo
          ? { ...ticket, assignedTo: "You", status: "in progress" }
          : ticket
      )
    );
  };

  return (
    <div className="bg-[#0A192F] min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Tickets</h1>
          <Link href="/tickets/new">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
            + Create Ticket
          </button>
          </Link>
        </div>

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
                  key={ticket.id}
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
                      ticket.priority === "high"
                        ? "text-red-400"
                        : ticket.priority === "medium"
                        ? "text-yellow-300"
                        : "text-green-400"
                    }`}
                  >
                    {ticket.priority}
                  </td>
                  <td className="p-3">
                    {ticket.status === "open" && !ticket.assignedTo ? (
                      <button
                        onClick={() => handleSelfAssign(ticket.id)}
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
      </div>
    </div>
  );
}