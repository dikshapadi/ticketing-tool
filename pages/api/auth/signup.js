import bcrypt from "bcrypt";
import User from "../../../lib/mongodb/models/user";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
