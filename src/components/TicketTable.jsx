import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function TicketTable({ tickets, userData, openTicketDetail }) {
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const isHeadOffice = userData?.cabang === "Kantor Pusat";

    useEffect(() => {
        let filtered = tickets;

        if (searchInput.trim() !== "") {
            if (!/^\d+$/.test(searchInput)) {
                Swal.fire({
                    icon: "warning",
                    title: "Input Tidak Valid",
                    text: "Harap masukkan angka Ticket ID (contoh: 25090001).",
                });
            } else {
                filtered = filtered.filter(
                    (t) =>
                        (t.ticketId || "").replace(/\D/g, "") === searchInput.trim()
                );
            }
        }

        if (statusFilter !== "All") {
            filtered = filtered.filter(
                (t) => (t.status || "").toLowerCase() === statusFilter.toLowerCase()
            );
        }

        // Urutkan dari createDate terbaru ke terlama
        filtered.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

        setFilteredTickets(filtered);
        setCurrentPage(1);
    }, [tickets, searchInput, statusFilter]);

    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const pageTickets = filteredTickets.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getBadgeClass = (status) => {
        switch ((status || "").toLowerCase()) {
            case "open":
                return "bg-green-500 text-white";
            case "closed":
                return "bg-gray-500 text-white";
            case "reject":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-300 text-gray-800";
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">📂 Daftar Tiket</h3>

            {/* Search & Status Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <input
                    type="text"
                    placeholder="Cari Ticket ID"
                    className="border rounded px-3 py-2 w-full md:w-1/3 text-sm sm:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                    {["Open", "Closed", "Reject", "All"].map((status) => (
                        <button
                            key={status}
                            className={`px-4 py-1 rounded-full text-sm sm:text-xs font-medium border transition-colors duration-200 ${statusFilter === status
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-xs">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                                Create Date
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                                Ticket
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                                Error System
                            </th>
                            {isHeadOffice && (
                                <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                                    Brand
                                </th>
                            )}
                            <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pageTickets.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={isHeadOffice ? 5 : 4}
                                    className="text-center py-4 text-gray-500"
                                >
                                    Belum ada tiket.
                                </td>
                            </tr>
                        ) : (
                            pageTickets.map((ticket) => (
                                <tr
                                    key={ticket.ticketId}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                    onClick={() => openTicketDetail(ticket.ticketId)}
                                >
                                    <td className="px-4 py-2">{ticket.createDate || "-"}</td>
                                    <td className="px-4 py-2 font-medium text-blue-600">{ticket.ticketId}</td>
                                    <td className="px-4 py-2">{ticket.errorSystem || "-"}</td>
                                    {isHeadOffice && (
                                        <td className="px-4 py-2">{ticket.brand || "-"}</td>
                                    )}
                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs sm:text-[10px] font-semibold ${getBadgeClass(
                                                ticket.status
                                            )}`}
                                        >
                                            {ticket.status || "-"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`px-3 py-1 rounded-full text-sm sm:text-xs border transition-colors duration-200 ${currentPage === i + 1
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
