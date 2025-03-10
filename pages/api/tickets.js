
import connectDB from '@/lib/mongodb/connect';
import Ticket from '@/lib/mongodb/models/ticket';

export default async function handler(req, res) {
    await connectDB(); // Ensure DB connection

    if (req.method === 'GET') {
        try {
            const tickets = await Ticket.find()
                .populate('createdBy', 'name')
                .populate('assignedTo', 'name');
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tickets', error });
        }
    }
    else if (req.method === 'POST') {
        try {
            const { title, description, priority, category, createdBy } = req.body;

            // Validate required fields
            if (!title || !description || !createdBy) {
                return res.status(400).json({ message: 'Title, description, and createdBy are required.' });
            }

            // Ensure `priority` matches schema (convert to lowercase)
            const validPriorities = ["low", "medium", "high", "urgent"];
            const priorityLower = priority.toLowerCase();
            if (!validPriorities.includes(priorityLower)) {
                return res.status(400).json({ message: `Invalid priority. Must be one of: ${validPriorities.join(", ")}` });
            }

            const newTicket = new Ticket({
                title,
                description,
                priority: priorityLower,
                category,
                createdBy
            });

            await newTicket.save();
            res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });

        } catch (error) {
            console.error("Error creating ticket:", error);
            res.status(500).json({ message: 'Error creating ticket', error: error.message });
        }
    }
    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
