export default function TopBar({ userData, setIsLoggedIn }) {
    const handleLogout = () => {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userData");
        setIsLoggedIn(false);
        window.location.href = "/login";
    };

    // Ambil nama user dari props atau localStorage fallback
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    const userName = userData?.name || storedUser?.name || "User Name";

    return (
        <div className="w-full bg-blue-600 text-white flex justify-between items-center px-6 py-3 shadow-md">
            {/* Kiri: Judul dan subjudul */}
            <div className="flex flex-col leading-tight">
                <h1 className="font-bold text-lg">WOM Finance</h1>
                <p className="text-sm opacity-90">Support Listing Issue System</p>
            </div>

            {/* Kanan: Info user dan tombol logout */}
            <div className="flex items-center gap-3">
                <span id="userInfo" className="font-semibold text-sm md:text-base">
                    {userName}
                </span>
                <span className="text-white">|</span>
                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 text-sm md:text-base"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
