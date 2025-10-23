import { Routes, Route } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Dashboard from "../pages/Dashboard";
import Ticket from "../pages/Ticket";
import NewTicket from "../pages/NewTicket";
import DetailTicket from "../pages/DetailTicket";
import Report from "../pages/Report";
import Panduan from "../pages/Panduan";
import Setting from "../pages/Setting";

export default function MainLayout({ userData, setIsLoggedIn }) {
    return (
        <div className="min-h-screen flex flex-col">
            <TopBar userData={userData} setIsLoggedIn={setIsLoggedIn} />
            <Navbar userData={userData} />
            <main className="flex-1 p-6 bg-gray-100">
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="ticket" element={<Ticket />} />
                    <Route path="ticket/new" element={<NewTicket />} />
                    <Route path="ticket/:id" element={<DetailTicket />} />
                    <Route path="report" element={<Report />} />
                    <Route path="panduan" element={<Panduan />} />
                    <Route path="setting" element={<Setting />} />
                </Routes>
            </main>
        </div>
    );
}
