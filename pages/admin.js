import { useEffect, useState } from 'react';

const AdminPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/tickets')
            .then((res) => res.json())
            .then((data) => {
                setTickets(data);
                setLoading(false);
            })
            .catch((error) => console.error('Error fetching tickets:', error));
    }, []);

    return (
        <div className="min-h-screen bg-[#112240] text-white">
            {/* Navbar */}
            <nav className="bg-[#0A192F] p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div>
                    <a href="/" className="text-gray-300 hover:text-white px-4">Home</a>
                    <a href="/new" className="text-gray-300 hover:text-white px-4">Raise Ticket</a>
                </div>
            </nav>

            {/* Admin Ticket Management */}
            <div className="flex items-center justify-center py-6">
                <div className="bg-[#0A192F] p-6 rounded-lg shadow-md w-full max-w-5xl">
                    <h2 className="text-2xl font-bold mb-6 text-center">Admin - Ticket Management</h2>

                    {loading ? (
                        <p className="text-center text-gray-400">Loading tickets...</p>
                    ) : tickets.length === 0 ? (
                        <p className="text-center text-gray-400">No tickets available.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-600 text-gray-300">
                                <thead>
                                    <tr className="bg-gray-800 text-white">
                                        <th className="border border-gray-600 px-4 py-2">Title</th>
                                        <th className="border border-gray-600 px-4 py-2">Description</th>
                                        <th className="border border-gray-600 px-4 py-2">Created By</th>
                                        <th className="border border-gray-600 px-4 py-2">Assigned To</th>
                                        <th className="border border-gray-600 px-4 py-2">Status</th>
                                        <th className="border border-gray-600 px-4 py-2">Priority</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket) => (
                                        <tr key={ticket._id} className="border-t border-gray-600 hover:bg-gray-900 transition">
                                            <td className="border border-gray-600 px-4 py-2">{ticket.title}</td>
                                            <td className="border border-gray-600 px-4 py-2">{ticket.description}</td>
                                            <td className="border border-gray-600 px-4 py-2">{ticket.createdBy?.name || 'Unknown'}</td>
                                            <td className="border border-gray-600 px-4 py-2">{ticket.assignedTo?.name || 'Unassigned'}</td>
                                            <td className="border border-gray-600 px-4 py-2">{ticket.status}</td>
                                            <td className="border border-gray-600 px-4 py-2">{ticket.priority}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
