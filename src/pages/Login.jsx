import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // sementara login dummy (nanti pakai data CSV dari spreadsheet)
        if (email === "admin@wom.co.id" && password === "12345") {
            localStorage.setItem("loggedIn", "true");
            navigate("/dashboard");
        } else {
            alert("Email atau password salah");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded shadow-md w-96 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-blue-600">
                    Login MSP
                </h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>
                <div className="flex justify-between text-sm">
                    <a href="/forgot-password" className="text-blue-600 hover:underline">
                        Lupa Password?
                    </a>
                    <a href="/reset-password" className="text-blue-600 hover:underline">
                        Reset Password
                    </a>
                </div>
            </form>
        </div>
    );
}
