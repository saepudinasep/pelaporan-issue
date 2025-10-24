import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar({ userData }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(userData || null); // 🔹 lokal state untuk user

    // 🔹 Load ulang user dari localStorage saat komponen dimount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, [userData]); // akan dijalankan juga setiap userData berubah

    // 🔹 Deteksi scroll untuk efek blur/shadow navbar
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🔹 Tentukan apakah user dari Head Office
    const isHeadOffice = user?.cabang?.toLowerCase() === "kantor pusat";

    // 🔹 Menu dinamis berdasarkan cabang
    const navItems = isHeadOffice
        ? [
            { name: "Dashboard", path: "/dashboard" },
            { name: "Ticket", path: "/dashboard/ticket" },
            { name: "Report", path: "/dashboard/report" },
            { name: "Panduan", path: "/dashboard/panduan" },
            { name: "Setting", path: "/dashboard/setting" },
        ]
        : [
            { name: "Dashboard", path: "/dashboard" },
            { name: "Ticket", path: "/dashboard/ticket" },
            { name: "New Ticket", path: "/dashboard/ticket/new" },
            { name: "Panduan", path: "/dashboard/panduan" },
            { name: "Setting", path: "/dashboard/setting" },
        ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${isScrolled
                ? "bg-white/70 shadow-sm border-b border-gray-200"
                : "bg-white"
                }`}
        >
            <div className="flex justify-between items-center px-6 py-4 md:justify-center">
                <div className="md:hidden">
                    <h1
                        className="text-blue-600 font-bold text-lg cursor-pointer"
                        onClick={() => navigate("/dashboard")}
                    >
                        WOM Finance
                    </h1>
                </div>

                <button
                    className="md:hidden text-gray-800 focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <ul className="hidden md:flex justify-center items-center gap-16">
                    {navItems.map((item) => (
                        <li
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`cursor-pointer px-3 py-1.5 text-lg font-medium transition-all duration-200 ${isActive(item.path)
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-800 hover:text-blue-500 hover:border-b-2 hover:border-blue-300"
                                }`}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>

            {menuOpen && (
                <ul className="flex flex-col items-center gap-4 py-4 border-t border-gray-200 bg-white/95 md:hidden animate-fadeIn">
                    {navItems.map((item) => (
                        <li
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                setMenuOpen(false);
                            }}
                            className={`cursor-pointer w-full text-center py-2 text-lg font-medium transition-colors duration-200 ${isActive(item.path)
                                ? "text-blue-600 bg-blue-50"
                                : "text-gray-800 hover:text-blue-500 hover:bg-gray-100"
                                }`}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
