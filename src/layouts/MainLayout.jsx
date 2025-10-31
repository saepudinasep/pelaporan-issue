import { Routes, Route } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
// import Dashboard from "../pages/Dashboard";
import Ticket from "../pages/Ticket";
import NewTicket from "../pages/NewTicket";
import DetailTicket from "../pages/DetailTicket";
import Report from "../pages/Report";
import Panduan from "../pages/Panduan";
import Setting from "../pages/Setting";

export default function MainLayout({ userData, setIsLoggedIn }) {
    // console.log("User Data", userData);
    // console.log("setIsLoggedIn", setIsLoggedIn);
    // if (!userData) {
    //     // Tambahkan fallback agar tidak error kalau userData belum sempat diload
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <p className="text-gray-500">Memuat data pengguna...</p>
    //             ${userData}
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <TopBar userData={userData} setIsLoggedIn={setIsLoggedIn} />

            {/* Sidebar / Navbar */}
            <Navbar userData={userData} />

            {/* Konten utama */}
            <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                <Routes>
                    {/* <Route index element={<Dashboard user={userData} />} /> */}
                    <Route path="ticket" element={<Ticket user={userData} />} />
                    <Route path="ticket/new" element={<NewTicket user={userData} />} />
                    <Route path="ticket/:id" element={<DetailTicket user={userData} />} />
                    <Route path="report" element={<Report user={userData} />} />
                    <Route path="panduan" element={<Panduan user={userData} />} />
                    <Route
                        path="setting"
                        element={<Setting userData={userData} setIsLoggedIn={setIsLoggedIn} />}
                    />
                </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100">
                <p className="text-center text-xs text-gray-400 pt-2 pb-4">
                    © 2025 - {new Date().getFullYear()} Marketing Development Sub Division V1.10.23.2025
                </p>
            </footer>
        </div>
    );
}
