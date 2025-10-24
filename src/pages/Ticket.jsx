import { useEffect, useState } from "react";
import TicketTable from "../components/TicketTable";
import Swal from "sweetalert2";

export default function Ticket({ userData, openTicketDetail }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ambil data dari Apps Script API
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(
                    "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhcmQ7gRtH7HWLKIkwBpgoDyM_sjOV40RVLa5BMknG3zNleV_9aXnfsLRwE_niyakrbdd0149OhKZjrTv34OOWsZqyXuAET4B9jOc2RYrHsQZ-0OVkrepIKaigLt9nVQ1f8OqBNv8H7OcV6vzKRCrfI4lb1dH8fYdOzP9nAeHMrdgukESwXMtAe-JQ3J7b6sue1PAuP6oUbdOnR1jnuvVNfSZzdO5PkL3Q861Pr_hB-BYKdFCW8v1SphZbKFUOYDPLGs1Bjx4TCAEMvMnzC-0eiZBIv3C0XhnQhEkgN&lib=MTqZ9NHwUWnc8hGUQnOrqUJrQcJ2HCqVX"
                );
                const json = await response.json();
                if (json.data) {
                    // Map data supaya cocok format TicketTable
                    const mapped = json.data.map((row) => ({
                        ticketId: row["Ticket ID"] || "-",
                        createDate: row["Timestamp"]
                            ? new Date(row["Timestamp"]).toLocaleDateString()
                            : "-",
                        errorSystem: row["Kendala System"] || "-",
                        status: row["Status Ticket"] || "-",
                        brand: row["Brand"] || "-",
                    }));
                    // Urutkan dari terbaru
                    mapped.sort(
                        (a, b) => new Date(b.createDate) - new Date(a.createDate)
                    );
                    setTickets(mapped);
                } else {
                    setTickets([]);
                }
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: "error",
                    title: "Gagal Memuat Tiket",
                    text: "Terjadi kesalahan saat mengambil data tiket.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) return <p className="text-center py-6">Memuat tiket...</p>;

    return <TicketTable tickets={tickets} userData={userData} openTicketDetail={openTicketDetail} />;
}
