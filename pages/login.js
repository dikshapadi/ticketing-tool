"use client";

import { useState } from "react";
import Navbar from '../components/Navbar';

export default function AuthForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");
    const [isSignUp, setIsSignUp] = useState(true);

    const handleAuth = async () => {
        const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/signin";
        const body = isSignUp ? { name, email, password, role } : { email, password };

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        if (res.ok) alert(isSignUp ? "Account created successfully!" : "Logged in successfully!");
        else alert(data.message);
    };

    return (
        <div>
      <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#112240]">
             
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h1 className="text-xl font-bold mb-4">{isSignUp ? "Sign Up" : "Sign In"}</h1>

                {isSignUp && (
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="w-full p-2 mb-2 border rounded"
                    />
                )}
                
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 mb-2 border rounded"
                />

                {isSignUp && (
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                    >
                        <option value="employee">Employee</option>
                        <option value="support">Support</option>
                    </select>
                )}

                <button
                    onClick={handleAuth}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {isSignUp ? "Sign Up" : "Sign In"}
                </button>

                <p className="text-sm text-center mt-2">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button className="text-blue-600 underline" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
        </div>
    );
}
