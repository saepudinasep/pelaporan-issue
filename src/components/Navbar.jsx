import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const navItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Ticket", path: "/dashboard/ticket" },
        { name: "New Ticket", path: "/dashboard/ticket/new" },
        { name: "Report", path: "/dashboard/report" },
        { name: "Panduan", path: "/dashboard/panduan" },
        { name: "Setting", path: "/dashboard/setting" },
    ];

    const isActive = (path) => location.pathname === path;

    // Deteksi scroll untuk efek transparan
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${isScrolled
                    ? "bg-white/70 shadow-sm border-b border-gray-200"
                    : "bg-white"
                }`}
        >
            <div className="flex justify-between items-center px-6 py-4 md:justify-center">
                {/* Logo hanya tampil di mobile */}
                <div className="md:hidden">
                    <h1
                        className="text-blue-600 font-bold text-lg cursor-pointer"
                        onClick={() => navigate("/dashboard")}
                    >
                        WOM Finance
                    </h1>
                </div>

                {/* Tombol Hamburger (Mobile) */}
                <button
                    className="md:hidden text-gray-800 focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Menu Desktop */}
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

            {/* Menu Mobile */}
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
