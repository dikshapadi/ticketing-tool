import connectDB from '../../../lib/mongodb/connect';
import User from '../../../lib/mongodb/models/user';

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}