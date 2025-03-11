import connectDB from '@/lib/mongodb/connect';
import Ticket from '@/lib/mongodb/models/ticket';
import User from '@/lib/mongodb/models/user';  // Import the User model

export default async function handler(req, res) {
    try {
        await connectDB(); // Ensure we reuse the existing connection

        if (req.method === 'GET') {
            const tickets = await Ticket.find()
                .populate('createdBy', 'name')  // Populate createdBy with User name
                .populate('assignedTo', 'name'); // Populate assignedTo with User name
            return res.status(200).json(tickets);
        }

        else if (req.method === 'POST') {
            const { title, description, priority, createdBy, category } = req.body;

            if (!title || !description || !createdBy) {
                return res.status(400).json({ message: 'Title, description, and createdBy are required.' });
            }

            const validPriorities = ["low", "medium", "high", "urgent"];
            if (!validPriorities.includes(priority.toLowerCase())) {
                return res.status(400).json({ message: `Invalid priority. Must be one of: ${validPriorities.join(", ")}` });
            }

            const newTicket = new Ticket({
                title,
                description,
                priority: priority.toLowerCase(),
                createdBy,
                category,
            });

            await newTicket.save();
            return res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
        }

        return res.status(405).json({ message: 'Method not allowed' });

    } catch (error) {
        console.error("Error in /api/tickets:", error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
