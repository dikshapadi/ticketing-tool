import connectDB from "@/lib/mongodb/connect";
import User from "@/lib/mongodb/models/user";
export default async function handler(req, res) {
    await connectDB();

    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const user = await User.findById(id).select("name email");
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
