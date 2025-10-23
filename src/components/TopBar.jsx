export default function TopBar() {
    const handleLogout = () => {
        localStorage.removeItem("loggedIn");
        window.location.href = "/login";
    };

    // Ambil nama user dari localStorage (misalnya diset saat login)
    const userName = localStorage.getItem("userName") || "User Name";

    return (
        <div className="w-full bg-blue-600 text-white flex justify-between items-center px-6 py-3 shadow-md">
            {/* Bagian kiri: Judul dan subjudul */}
            <div className="flex flex-col leading-tight">
                <h1 className="font-bold text-lg">WOM Finance</h1>
                <p className="text-sm opacity-90">Support Listing Issue System</p>
            </div>

            {/* Bagian kanan: User info dan tombol logout */}
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
