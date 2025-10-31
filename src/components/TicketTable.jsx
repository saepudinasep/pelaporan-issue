import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function TicketTable({ tickets, userData }) {
    const navigate = useNavigate();
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [regionFilter, setRegionFilter] = useState([]);
    const [brandFilter, setBrandFilter] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const isHeadOffice = userData?.cabang === "Kantor Pusat";

    // 🔍 Daftar Region & Brand unik dari data tiket
    const allRegions = [...new Set(tickets.map((t) => t.region).filter(Boolean))];
    const allBrands = [...new Set(tickets.map((t) => t.brand).filter(Boolean))];

    useEffect(() => {
        let filtered = tickets;

        // Filter Ticket ID
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
                        (t.ticketId || "").replace(/\D/g, "") ===
                        searchInput.trim()
                );
            }
        }

        // Filter status
        if (statusFilter !== "All") {
            filtered = filtered.filter(
                (t) =>
                    (t.status || "").toLowerCase() ===
                    statusFilter.toLowerCase()
            );
        }

        // Filter region
        if (regionFilter.length > 0) {
            filtered = filtered.filter((t) =>
                regionFilter.includes(t.region)
            );
        }

        // Filter brand
        if (brandFilter.length > 0) {
            filtered = filtered.filter((t) =>
                brandFilter.includes(t.brand)
            );
        }

        // Urutkan berdasarkan tanggal terbaru
        filtered.sort((a, b) => {
            const [dayA, monthA, yearA] = a.createDate.split("/");
            const [dayB, monthB, yearB] = b.createDate.split("/");
            const dateA = Date.UTC(yearA, monthA - 1, dayA);
            const dateB = Date.UTC(yearB, monthB - 1, dayB);
            return dateB - dateA;
        });

        setFilteredTickets(filtered);
        setCurrentPage(1);
    }, [tickets, searchInput, statusFilter, regionFilter, brandFilter]);

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

    const handleRowClick = (ticketId) => {
        navigate(`/dashboard/ticket/${ticketId}`);
    };

    // 🔍 Dialog filter lanjutan (multi-select modern)
    const openFilterDialog = () => {
        Swal.fire({
            title: "Advanced Search",
            html: `
            <div class="text-left">
                <label class="font-semibold text-sm">Pilih Region:</label>
                <div id="region-container" class="border rounded-lg p-2 mb-3 max-h-40 overflow-y-auto bg-gray-50">
                    ${allRegions
                    .map(
                        (region) => `
                        <label class="flex items-center gap-2 text-sm py-1">
                            <input type="checkbox" value="${region}" ${regionFilter.includes(region) ? "checked" : ""
                            } class="region-checkbox accent-blue-500" />
                            ${region}
                        </label>`
                    )
                    .join("")}
                </div>
                <label class="font-semibold text-sm">Pilih Brand:</label>
                <div id="brand-container" class="border rounded-lg p-2 mb-3 max-h-40 overflow-y-auto bg-gray-50">
                    ${allBrands
                    .map(
                        (brand) => `
                        <label class="flex items-center gap-2 text-sm py-1">
                            <input type="checkbox" value="${brand}" ${brandFilter.includes(brand) ? "checked" : ""
                            } class="brand-checkbox accent-blue-500" />
                            ${brand}
                        </label>`
                    )
                    .join("")}
                </div>
            </div>`,
            showCancelButton: true,
            confirmButtonText: "Terapkan",
            cancelButtonText: "Batal",
            showDenyButton: true,
            denyButtonText: "Reset",
            confirmButtonColor: "#2563eb",
            denyButtonColor: "#d1d5db",
            preConfirm: () => {
                const selectedRegions = Array.from(
                    document.querySelectorAll(".region-checkbox:checked")
                ).map((el) => el.value);
                const selectedBrands = Array.from(
                    document.querySelectorAll(".brand-checkbox:checked")
                ).map((el) => el.value);
                return { selectedRegions, selectedBrands };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setRegionFilter(result.value.selectedRegions);
                setBrandFilter(result.value.selectedBrands);
                Swal.fire("Berhasil!", "Filter diterapkan.", "success");
            } else if (result.isDenied) {
                setRegionFilter([]);
                setBrandFilter([]);
                Swal.fire("Reset!", "Filter dihapus.", "info");
            }
        });
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
                    {/* Tombol Filter Lanjutan */}
                    <button
                        onClick={openFilterDialog}
                        className="px-4 py-1 rounded-full text-sm sm:text-xs font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                    >
                        Advanced Search
                    </button>
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
                                    onClick={() =>
                                        handleRowClick(ticket.ticketId)
                                    }
                                >
                                    <td className="px-4 py-2">
                                        {ticket.createDate || "-"}
                                    </td>
                                    <td className="px-4 py-2 font-medium text-blue-600">
                                        {ticket.ticketId}
                                    </td>
                                    <td className="px-4 py-2">
                                        {ticket.errorSystem || "-"}
                                    </td>
                                    {isHeadOffice && (
                                        <td className="px-4 py-2">
                                            {ticket.brand || "-"}
                                        </td>
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
