import connectDB from '../../../lib/mongodb/connect';
import Ticket from '../../../lib/mongodb/models/ticket';

export default async function handler(req, res) {
    await connectDB();

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const ticket = await Ticket.findById(id);
            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' });
            }
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch ticket' });
        }
    } else if (req.method === 'PUT') {
        try {
            const ticket = await Ticket.findByIdAndUpdate(id, req.body, { new: true });
            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' });
            }
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update ticket' });
        }
    } else if (req.method === 'DELETE') {
        try {
            const ticket = await Ticket.findByIdAndDelete(id);
            if (!ticket) {
                return res.status(404).json({ error: 'Ticket not found' });
            }
            res.status(200).json({ message: 'Ticket deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete ticket' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}