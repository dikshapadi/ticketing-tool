import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';

const EditTicket = () => {
    const router = useRouter();
    const { id } = router.query;
    const [ticket, setTicket] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/tickets/${id}`)
                .then((res) => res.json())
                .then((data) => {
                    setTicket(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError('Failed to fetch ticket');
                    setLoading(false);
                });
        }
    }, [id]);

    useEffect(() => {
        fetch('/api/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
            })
            .catch((err) => {
                console.error('Failed to fetch users', err);
            });
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticket),
            });
            if (response.ok) {
                router.push('/admin');
            } else {
                setError('Failed to update ticket');
            }
        } catch (err) {
            setError('Failed to update ticket');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Navbar />
            <div className="bg-[#0A192F] min-h-screen text-white flex items-center justify-center">
                <div className="bg-[#0A192F] p-6 rounded-lg shadow-md w-full max-w-lg">
                    <h2 className="text-2xl font-bold mb-4">Edit Ticket</h2>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-gray-300">Title</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                                value={ticket.title}
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Description</label>
                            <textarea
                                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                                value={ticket.description}
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Priority</label>
                            <select
                                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                                value={ticket.priority}
                                disabled
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300">Status</label>
                            <select
                                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                                value={ticket.status}
                                onChange={(e) => setTicket({ ...ticket, status: e.target.value })}
                            >
                                <option value="open">Open</option>
                                <option value="in progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300">Assigned To</label>
                            <select
                                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                                value={ticket.assignedTo}
                                onChange={(e) => setTicket({ ...ticket, assignedTo: e.target.value })}
                            >
                                <option value="">Unassigned</option>
                                {users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded w-full">
                            Update Ticket
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditTicket;