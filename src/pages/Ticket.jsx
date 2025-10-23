import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketTable from "../components/TicketTable";
import Papa from "papaparse";
import Swal from "sweetalert2";

export default function Ticket({ userData }) {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const CSV_URL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSCB9-Y2Ph95JfTA0jTgDZ1hD0E2HvfAILtxI7RiCvS-6Q7Uaww5nIXVQOLdg7NVE5O0TQx3giAFrUM/pub?gid=1708544896&single=true&output=csv"; // ganti dengan CSV publik

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const res = await fetch(CSV_URL);
                if (!res.ok) throw new Error("Gagal fetch CSV");
                const csvText = await res.text();

                // parse CSV
                const { data, errors } = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                });

                if (errors.length) {
                    console.error(errors);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Terjadi kesalahan saat memproses data tiket.",
                    });
                }

                // Map kolom agar sesuai TicketTable
                const mappedTickets = data.map((row) => {
                    // Ambil tanggal saja dari Timestamp
                    let createDate = row["Timestamp"] || "-";
                    if (createDate !== "-") {
                        createDate = createDate.split(" ")[0]; // ambil bagian tanggal saja
                    }

                    return {
                        createDate,
                        ticketId: row["Ticket ID"] || "-",
                        errorSystem: row["Kendala System"] || "-",
                        brand: row["Brand"] || "-",
                        status: row["Status Ticket"] || "-",
                    };
                });

                // Urutkan dari terbaru ke terlama
                mappedTickets.sort((a, b) => {
                    if (a.createDate === "-" || !a.createDate) return 1;
                    if (b.createDate === "-" || !b.createDate) return -1;
                    return new Date(b.createDate) - new Date(a.createDate);
                });


                setTickets(mappedTickets);
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const openTicketDetail = (ticketId) => {
        navigate(`/dashboard/ticket/${ticketId}`);
    };

    return (
        <div>
            {loading ? (
                <div className="text-center py-10">Loading tickets...</div>
            ) : (
                <TicketTable
                    tickets={tickets}
                    userData={userData}
                    openTicketDetail={openTicketDetail}
                />
            )}
        </div>
    );
}
