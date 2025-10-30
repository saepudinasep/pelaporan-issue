import { useEffect, useState } from "react";
import TicketTable from "../components/TicketTable";

export default function Ticket() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const API_URL =
        "https://script.google.com/macros/s/AKfycbzRHpSwMjsmPbRCR6qRsvEqkPcYJUDwtk_NNi1YK1qflV0hl2H2wRFkLU_eNDDLfok9MQ/exec";

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        if (storedUser) setUserData(storedUser);

        console.log(storedUser);

        const fetchTickets = async () => {
            try {
                const res = await fetch(API_URL);
                const json = await res.json();

                if (!json.data) {
                    setTickets([]);
                    setLoading(false);
                    return;
                }
                console.log(json.data);

                // Map data supaya cocok format TicketTable
                const mapped = json.data.map((row) => ({
                    ticketId: row["Ticket ID"] || "-",
                    createDate: row["Timestamp"]
                        ? new Date(row["Timestamp"]).toLocaleDateString()
                        : "-",
                    errorSystem: row["Kendala System"] || "-",
                    status: row["Status Ticket"] || "-",
                    brand: row["Brand"] || "-",
                    region: row["Region"] || "-",
                    cabang: row["Cabang"] || "-",
                    nik: row["Created By (NIK)"] || "-",
                }));

                let filteredTickets = mapped;

                if (storedUser) {
                    const akses = storedUser.akses?.toUpperCase();

                    switch (akses) {
                        case "REGION":
                            filteredTickets = mapped.filter(
                                (t) =>
                                    t.region?.toLowerCase() ===
                                    storedUser.region?.toLowerCase()
                            );
                            break;

                        case "BRANCH":
                            filteredTickets = mapped.filter(
                                (t) =>
                                    t.region?.toLowerCase() ===
                                    storedUser.region?.toLowerCase() &&
                                    t.cabang?.toLowerCase() ===
                                    storedUser.cabang?.toLowerCase()
                            );
                            break;

                        case "SURVEYOR":
                            filteredTickets = mapped.filter(
                                (t) =>
                                    t.region?.toLowerCase() ===
                                    storedUser.region?.toLowerCase() &&
                                    t.cabang?.toLowerCase() ===
                                    storedUser.cabang?.toLowerCase() &&
                                    t.brand?.toLowerCase() ===
                                    storedUser.product?.toLowerCase()
                            );
                            break;

                        case "CMO":
                        case "MAO":
                            filteredTickets = mapped.filter(
                                (t) =>
                                    t.nik?.toString().trim() ===
                                    storedUser.nik?.toString().trim()
                            );
                            console.log(storedUser.nik.toString().trim());
                            console.log(filteredTickets);
                            break;

                        case "HO":
                            filteredTickets = mapped;
                            break;

                        default:
                            filteredTickets = [];
                            break;
                    }
                }

                // Urutkan dari yang terbaru
                filteredTickets.sort(
                    (a, b) => new Date(b.createDate) - new Date(a.createDate)
                );

                setTickets(filteredTickets);
            } catch (error) {
                console.error("Gagal memuat tiket:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading)
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-[9999]">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );

    return (
        <div className="p-4">
            <TicketTable
                tickets={tickets}
                userData={userData}
                openTicketDetail={(id) => console.log("Open Ticket", id)}
            />
        </div>
    );
}
