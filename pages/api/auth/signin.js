import connectDB from "../../../lib/mongodb/connect";
import User from "../../../lib/mongodb/models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

    try {
        await connectDB(); // Ensure DB connection
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Sign In error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
