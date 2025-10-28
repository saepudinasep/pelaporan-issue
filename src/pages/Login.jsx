// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import logo from "../assets/Logo.png";
// import { getDefaultPassword } from "../utils/getDefaultPassword";

// export default function Login() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const USERS_URL =
//         "https://docs.google.com/spreadsheets/d/e/2PACX-1vSCB9-Y2Ph95JfTA0jTgDZ1hD0E2HvfAILtxI7RiCvS-6Q7Uaww5nIXVQOLdg7NVE5O0TQx3giAFrUM/pub?gid=0&single=true&output=csv";

//     // Jika sudah login, langsung ke dashboard
//     useEffect(() => {
//         if (localStorage.getItem("loggedIn") === "true") {
//             navigate("/dashboard");
//         }
//     }, [navigate]);

//     const parseCSV = (text) => {
//         const [header, ...rows] = text.trim().split("\n");
//         const keys = header.split(",").map((h) => h.trim());
//         return rows.map((r) => {
//             const values = r.split(",");
//             return keys.reduce(
//                 (obj, key, i) => ({ ...obj, [key]: values[i]?.trim() }),
//                 {}
//             );
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const res = await fetch(USERS_URL);
//             const text = await res.text();
//             const users = parseCSV(text);

//             const user = users.find(
//                 (u) =>
//                     u.username?.toLowerCase() === username.toLowerCase() &&
//                     u.password === password
//             );

//             if (!user) {
//                 setLoading(false);
//                 Swal.fire({
//                     title: "Login Gagal!",
//                     text: "Username atau password salah.",
//                     icon: "error",
//                     confirmButtonColor: "#6366F1",
//                 });
//                 return;
//             }

//             if (user.EMPLOYEE_STATUS !== "Active") {
//                 setLoading(false);
//                 Swal.fire({
//                     title: "Akun Non Aktif!",
//                     text: "Hanya karyawan aktif yang dapat login.",
//                     icon: "error",
//                     confirmButtonColor: "#EF4444",
//                 });
//                 return;
//             }

//             const defaultPassword = getDefaultPassword(user.NAME_KTP, user.NIK);
//             if (user.password?.toLowerCase() === defaultPassword.toLowerCase()) {
//                 localStorage.setItem("pendingReset", JSON.stringify(user));
//                 Swal.fire({
//                     title: "Password Default",
//                     text: "Silakan ubah password Anda terlebih dahulu.",
//                     icon: "info",
//                 }).then(() => navigate("/reset-password"));
//                 setLoading(false);
//                 return;
//             }

//             const userData = {
//                 username: user.username,
//                 name: user.NAME_KTP,
//                 nik: user.NIK,
//                 region: user.Region,
//                 cabang: user.Cabang,
//                 position: user.POSITION_NAME,
//                 product: user.PRODUCT,
//                 status: user.EMPLOYEE_STATUS,
//             };

//             // Simpan global state di localStorage
//             localStorage.setItem("loggedIn", "true");
//             localStorage.setItem("userData", JSON.stringify(userData));

//             Swal.fire({
//                 title: "Login Berhasil!",
//                 text: `Selamat datang, ${user.NAME_KTP}! 👋`,
//                 icon: "success",
//                 timer: 1500,
//                 showConfirmButton: false,
//             });

//             setTimeout(() => {
//                 setLoading(false);
//                 navigate("/dashboard");
//             }, 1500);
//         } catch (err) {
//             console.error("DEBUG ERROR FETCH:", err);
//             setLoading(false);
//             Swal.fire({
//                 title: "Error",
//                 text: "Gagal memuat data login. Periksa koneksi atau URL CSV.",
//                 icon: "error",
//             });
//         }
//     };

//     return (
//         <div className="relative flex min-h-screen items-center justify-center bg-white px-6 py-12">
//             {loading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
//                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
//                 </div>
//             )}

//             <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8">
//                 <div className="flex flex-col items-center text-center">
//                     <img src={logo} alt="Logo" className="h-16 w-auto mb-3" />
//                     <h1 className="text-xl font-semibold text-gray-800">
//                         WOM Finance
//                     </h1>
//                     <p className="text-sm text-gray-500 mb-6">
//                         Support Listing Issue System
//                     </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div>
//                         <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                             Username
//                         </label>
//                         <input
//                             id="username"
//                             type="text"
//                             required
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                             Password
//                         </label>
//                         <input
//                             id="password"
//                             type="password"
//                             required
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
//                     >
//                         Sign in
//                     </button>

//                     <div className="text-right">
//                         <a href="/forgot-password" className="text-sm text-indigo-500 hover:underline">
//                             Lupa Password?
//                         </a>
//                     </div>
//                 </form>

//                 <p className="text-center text-xs text-gray-400 pt-2">
//                     © 2025 - {new Date().getFullYear()} Marketing Development Sub Division V1.0.07.2025
//                 </p>
//             </div>
//         </div>
//     );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/Logo.png";
import { getDefaultPassword } from "../utils/getDefaultPassword";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = "https://script.google.com/macros/s/AKfycbxrUAGgsesLWDluUtrG_yB4-LhBhcllAdtXVGEgsR5WDQe7F7WL93NUnlfj5xA8cl7fwg/exec";

    useEffect(() => {
        if (localStorage.getItem("loggedIn") === "true") {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                body: JSON.stringify({
                    action: "login",
                    username,
                    password,
                }),
            });

            const result = await res.json();
            setLoading(false);

            if (!result.success) {
                Swal.fire({
                    title: "Login Gagal!",
                    text: result.message,
                    icon: "error",
                    confirmButtonColor: "#6366F1",
                });
                return;
            }

            const user = result.data;

            console.log(user);

            const defaultPassword = getDefaultPassword(user.NAME_KTP, user.NIK);
            if (user.password?.toLowerCase() === defaultPassword.toLowerCase()) {
                localStorage.setItem("pendingReset", JSON.stringify(user));
                Swal.fire({
                    title: "Password Default",
                    text: "Silakan ubah password Anda terlebih dahulu.",
                    icon: "info",
                }).then(() => navigate("/reset-password"));
                return;
            }

            const userData = {
                username: user.username,
                name: user.NAME_KTP,
                nik: user.NIK,
                region: user.Region,
                cabang: user.Cabang,
                position: user.POSITION_NAME,
                product: user.PRODUCT,
                status: user.EMPLOYEE_STATUS,
            };

            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userData", JSON.stringify(userData));

            console.log(result.success);
            console.log(result.message);
            console.log(userData);

            Swal.fire({
                title: "Login Berhasil!",
                text: `Selamat datang, ${user.NAME_KTP}! 👋`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            console.error("Error login:", err);
            setLoading(false);
            Swal.fire({
                title: "Error",
                text: "Gagal menghubungi server. Periksa koneksi internet atau Apps Script URL.",
                icon: "error",
            });
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-white px-6 py-12">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[9999]">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            )}

            <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8">
                <div className="flex flex-col items-center text-center">
                    <img src={logo} alt="Logo" className="h-16 w-auto mb-3" />
                    <h1 className="text-xl font-semibold text-gray-800">
                        WOM Finance
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Support Listing Issue System Marketing
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            NIK Karyawan
                        </label>
                        <input
                            id="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                    >
                        Sign in
                    </button>

                    <div className="text-right">
                        <a href="/forgot-password" className="text-sm text-indigo-500 hover:underline">
                            Lupa Password?
                        </a>
                    </div>
                </form>

                <p className="text-center text-xs text-gray-400 pt-2">
                    © 2025 - {new Date().getFullYear()} Marketing Development Sub Division V1.0.07.2025
                </p>
            </div>
        </div>
    );
}


