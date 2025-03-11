
"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Loader2 } from "lucide-react"; // For loading spinner
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priorityFilter, setPriorityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 20; // 20 tickets per page
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const userRole = localStorage.getItem("userRole");

            if (!token || userRole !== "support") {
                router.replace("/login");
            } else {
                setIsAuthorized(true);
            }
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch("/api/tickets");
                const data = await response.json();

                if (!Array.isArray(data)) {
                    setTickets([]);
                    setFilteredTickets([]);
                    setLoading(false);
                    return;
                }

                const ticketsWithUserNames = await Promise.all(
                    data.map(async (ticket) => {
                        let createdByName = "Unknown";
                        let assignedToName = "Unassigned";

                        try {
                            if (ticket.createdBy) {
                                const userResponse = await fetch(`/api/user?id=${ticket.createdBy}`);
                                const userData = await userResponse.json();
                                createdByName = userData.name || "Unknown";
                            }
                        } catch (error) {
                            console.error("Error fetching createdBy user data:", error);
                        }

                        try {
                            if (ticket.assignedTo) {
                                const assignedResponse = await fetch(`/api/user?id=${ticket.assignedTo}`);
                                const assignedData = await assignedResponse.json();
                                assignedToName = assignedData.name || "Unassigned";
                            }
                        } catch (error) {
                            console.error("Error fetching assignedTo user data:", error);
                        }

                        return { ...ticket, createdBy: createdByName, assignedTo: assignedToName };
                    })
                );

                setTickets(ticketsWithUserNames);
                setFilteredTickets(ticketsWithUserNames);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                setTickets([]);
                setFilteredTickets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    useEffect(() => {
        let filtered = tickets;
        if (priorityFilter) {
            filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
        }
        if (statusFilter) {
            filtered = filtered.filter(ticket => ticket.status === statusFilter);
        }
        if (searchQuery) {
            filtered = filtered.filter(ticket =>
                ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.createdBy?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredTickets(filtered);
        setCurrentPage(1);
    }, [priorityFilter, statusFilter, searchQuery, tickets]);

    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
    const displayedTickets = filteredTickets.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage);

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this ticket?")) {
            try {
                const response = await fetch(`/api/tickets/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setTickets(tickets.filter(ticket => ticket._id !== id));
                    setFilteredTickets(filteredTickets.filter(ticket => ticket._id !== id));
                } else {
                    console.error("Failed to delete ticket");
                }
            } catch (error) {
                console.error("Error deleting ticket:", error);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-[#0A192F] min-h-screen text-white">
                <div className="container mx-auto py-8 px-4">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Hello, Admin</h1>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-gray-800 p-4 rounded-lg flex flex-wrap gap-4 justify-between items-center shadow-md mb-6">
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="flex-grow bg-[#21262D] text-white px-4 py-2 rounded-lg border border-gray-600 outline-none transition focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <select
                            className="bg-[#21262D] text-white px-3 py-2 rounded-lg border border-gray-600 outline-none transition focus:border-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>

                        <select
                            className="bg-[#21262D] text-white px-3 py-2 rounded-lg border border-gray-600 outline-none transition focus:border-blue-500"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>

                        <button
                            onClick={() => { setPriorityFilter(""); setStatusFilter(""); setSearchQuery(""); }}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Reset Filters
                        </button>
                    </div>

                    {/* Active Filters as Badges */}
                    <div className="flex gap-2 flex-wrap mb-4">
                        {priorityFilter && <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Priority: {priorityFilter}</span>}
                        {statusFilter && <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">Status: {statusFilter}</span>}
                        {searchQuery && <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm">Search: {searchQuery}</span>}
                    </div>

                    {/* Table Section */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border border-gray-600 rounded-lg">
                            <thead>
                                <tr className="bg-gray-800">
                                    <th className="p-3 border border-gray-600">Title</th>
                                    <th className="p-3 border border-gray-600">Description</th>
                                    <th className="p-3 border border-gray-600">Created By</th>
                                    <th className="p-3 border border-gray-600">Assigned To</th>
                                    <th className="p-3 border border-gray-600">Status</th>
                                    <th className="p-3 border border-gray-600">Priority</th>
                                    <th className="p-3 border border-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="p-4 text-center text-gray-400">
                                            <Loader2 className="animate-spin text-white w-10 h-10 mx-auto" />
                                        </td>
                                    </tr>
                                ) : displayedTickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-4 text-center text-gray-400">No matching results.</td>
                                    </tr>
                                ) : (
                                    displayedTickets.map(ticket => (
                                        <tr key={ticket._id} className="border-b border-gray-600 hover:bg-gray-700 transition">
                                            <td className="p-3 border border-gray-600">{ticket.title}</td>
                                            <td className="p-3 border border-gray-600 text-gray-400">{ticket.description}</td>
                                            <td className="p-3 border border-gray-600">{ticket.createdBy || "Unknown"}</td>
                                            <td className="p-3 border border-gray-600">{ticket.assignedTo || "Unassigned"}</td>
                                            <td className={`p-3 border border-gray-600 capitalize font-semibold ${ticket.status === 'open' ? 'text-green-500' :
                                                ticket.status === 'in progress' ? 'text-yellow-500' :
                                                    ticket.status === 'resolved' ? 'text-blue-500' :
                                                        'text-red-500'
                                                }`}>
                                                {ticket.status}
                                            </td>
                                            <td className={`p-3 border border-gray-600 capitalize font-semibold ${ticket.priority === 'urgent' ? 'text-red-500' :
                                                ticket.priority === 'high' ? 'text-orange-500' :
                                                    ticket.priority === 'medium' ? 'text-yellow-500' :
                                                        'text-green-500'
                                                }`}>
                                                {ticket.priority}
                                            </td>
                                            <td className="p-3 border border-gray-600">
                                                <button
                                                    onClick={() => router.push(`/tickets/edit/${ticket._id}`)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ticket._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-4 gap-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}