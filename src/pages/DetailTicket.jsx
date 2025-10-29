import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function DetailTicket() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chat, setChat] = useState([]);
    const [statusTicket, setStatusTicket] = useState("");
    const [statusEskalasi, setStatusEskalasi] = useState("");
    const [reasonReject, setReasonReject] = useState("");
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);

    const user = JSON.parse(localStorage.getItem("userData")) || {};
    const isHeadOffice =
        user?.region?.toLowerCase() === "kantor pusat" &&
        user?.cabang?.toLowerCase() === "kantor pusat";

    // === Fetch Detail Ticket ===
    useEffect(() => {
        async function fetchTicket() {
            try {
                const res = await fetch(
                    `https://script.google.com/macros/s/AKfycbwBeqKp4Ubfjf6YxvamfKqcHz0Yeapd5p3eJr0yPSdYsDj0yIgi4sn-K7NbcN3K6-Ya/exec?action=getTicket&id=${id}`
                );
                const json = await res.json();
                const dataTicket = json.data;
                const dataChat = json.chat;
                setTicket(dataTicket);
                setChat(dataChat);
                console.log("Detail Ticket:", dataTicket);
                console.log("Chat History:", dataChat);
            } catch (error) {
                Swal.fire("Error", "Gagal memuat detail ticket", "error");
                console.error("Gagal memuat tiket:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTicket();
    }, [id]);

    if (loading)
        return (<div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>);

    if (!ticket)
        return (
            <p className="text-center py-6 text-red-500">
                Ticket tidak ditemukan.
            </p>
        );

    // === Upload file base64 ke folder dinamis (Link Folder Ticket) ===
    const uploadFileBase = async (file, folderUrl) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                const base64 = reader.result.split(",")[1];
                try {
                    const res = await fetch(
                        "https://script.google.com/macros/s/AKfycbwBeqKp4Ubfjf6YxvamfKqcHz0Yeapd5p3eJr0yPSdYsDj0yIgi4sn-K7NbcN3K6-Ya/exec",
                        {
                            method: "POST",
                            // mode: "no-cors",
                            // headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: "uploadFileBase",
                                folderUrl, // folder dinamis dari Link Folder Ticket
                                filename: file.name,
                                filedata: base64,
                            }),
                        }
                    );
                    resolve(res);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // === Fungsi submit chat ===
    const handleSubmitChat = async () => {
        if (!message.trim() && !file) {
            Swal.fire("Oops", "Isi pesan atau unggah file.", "warning");
            return;
        }

        Swal.fire({
            title: "Mengirim...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            let uploadedFileUrl = null;

            // Jika user upload file
            if (file) {
                await uploadFileBase(file, ticket.linkFolderTicket);
                uploadedFileUrl = `File: ${file.name}`;
            }

            await fetch(
                "https://script.google.com/macros/s/AKfycbwBeqKp4Ubfjf6YxvamfKqcHz0Yeapd5p3eJr0yPSdYsDj0yIgi4sn-K7NbcN3K6-Ya/exec",
                {
                    method: "POST",
                    // mode: "no-cors",
                    // headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "sendChat",
                        ticketId: id,
                        sender: user.nama,
                        message,
                        file: uploadedFileUrl,
                    }),
                }
            );

            Swal.fire("Berhasil", "Pesan terkirim", "success");
            setMessage("");
            setFile(null);
        } catch (error) {
            Swal.fire("Error", "Gagal mengirim pesan", "error");
            console.error("Gagal memuat tiket:", error);
        }
    };

    // === Fungsi update status (Head Office) ===
    const handleUpdateStatus = async () => {
        if (statusTicket.toLowerCase() === "reject" && !reasonReject.trim()) {
            Swal.fire("Oops", "Isi reason reject", "warning");
            return;
        }

        Swal.fire({
            title: "Menyimpan...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            await fetch(
                "https://script.google.com/macros/s/AKfycbwBeqKp4Ubfjf6YxvamfKqcHz0Yeapd5p3eJr0yPSdYsDj0yIgi4sn-K7NbcN3K6-Ya/exec",
                {
                    method: "POST",
                    // mode: "no-cors",
                    // headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "updateStatus",
                        ticketId: id,
                        statusTicket,
                        statusEskalasi,
                        reasonReject,
                    }),
                }
            );

            Swal.fire("Berhasil", "Status tiket diperbarui", "success");
        } catch (error) {
            Swal.fire("Error", "Gagal memperbarui status", "error");
            console.error("Gagal memuat tiket:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h3 className="text-2xl font-bold mb-6 text-center">📄 Ticket Detail</h3>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Informasi Pemohon */}
                <div className="bg-white rounded-lg shadow p-5">
                    <h4 className="font-semibold text-blue-600 mb-3">Informasi Pemohon</h4>
                    <div className="space-y-1 text-gray-700">
                        <p><strong>Nama Pemohon:</strong> {ticket["CreatedBy(Name)"]}</p>
                        <p><strong>NIK:</strong> {ticket["CreatedBy(NIK)"]}</p>
                        <p><strong>Jabatan:</strong> {ticket["Position"]}</p>
                        <p>
                            <strong>Request Date:</strong>{" "}
                            {new Date(ticket["Timestamp"]).toLocaleDateString("id-ID")}
                        </p>
                        <p><strong>No Ticket:</strong> {ticket["TicketID"]}</p>
                        <p><strong>Unit Kerja:</strong> {ticket["Cabang"]}</p>
                        <p>
                            <strong>Status Ticket:</strong>{" "}
                            <span
                                className={`px-2 py-1 rounded text-white ${ticket["StatusTicket"] === "Open"
                                    ? "bg-green-500"
                                    : ticket["StatusTicket"] === "Reject"
                                        ? "bg-red-500"
                                        : "bg-gray-500"
                                    }`}
                            >
                                {ticket["StatusTicket"]}
                            </span>
                        </p>
                        <p><strong>Eskalasi By:</strong> TIM {ticket["StatusSolved"] || "-"}</p>
                        <p><strong>Reason IT:</strong> {ticket["FeedbackIT"] || "-"}</p>
                        <p><strong>Reason Reject:</strong> {ticket["ReasonReject"] || "-"}</p>
                    </div>
                </div>

                {/* Detail Permasalahan */}
                <div className="bg-white rounded-lg shadow p-5">
                    <h4 className="font-semibold text-gray-700 mb-3">Detail Permasalahan</h4>
                    <div className="space-y-1 text-gray-700">
                        <p><strong>Brand:</strong> {ticket["Brand"]}</p>
                        <p><strong>Region:</strong> {ticket["Region"]}</p>
                        <p><strong>Error System:</strong> {ticket["IssueSummary"]}</p>
                        <p><strong>Nama Customer:</strong> {ticket["NamaCustomer"]}</p>
                        <p><strong>CUST ID:</strong> {ticket["CustID"]}</p>
                        <p><strong>No ODR:</strong> {ticket["NoODR"]}</p>
                        <p><strong>No APP:</strong> {ticket["NoAPP"]}</p>

                        <div>
                            <strong>Fatal Score:</strong>
                            <ul className="list-disc list-inside ml-2">
                                <li>Dukcapil: {ticket["Dukcapil"]}</li>
                                <li>Negative Status: {ticket["NegativeStatus"]}</li>
                                <li>Biometric: {ticket["Biometric"]}</li>
                            </ul>
                        </div>

                        <div>
                            <strong>Upload:</strong>{" "}
                            {ticket["FileUploadLink"] ? (
                                <a
                                    href={ticket["FileUploadLink"]}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    📎 Lihat File
                                </a>
                            ) : (
                                "-"
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 💬 Historical Chat Section */}
            <div className="bg-white rounded-xl shadow mt-8 p-5">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    💬 <span>Historical Chat</span>
                </h4>

                <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 space-y-3">
                    {chat.length > 0 ? (
                        chat.map((c, i) => {
                            const isUser = c.senderNIK === user.nik;
                            return (
                                <div
                                    key={i}
                                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[75%] p-3 rounded-2xl shadow-sm relative ${isUser
                                            ? "bg-indigo-500 text-white rounded-tr-none"
                                            : "bg-white text-gray-800 rounded-tl-none"
                                            }`}
                                    >
                                        <p className="text-sm leading-snug wrap-break-word">{c.message}</p>

                                        {c.file && (
                                            <a
                                                href={c.file}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`block mt-1 text-xs underline ${isUser ? "text-indigo-200" : "text-blue-500"
                                                    }`}
                                            >
                                                📎 Lihat File
                                            </a>
                                        )}

                                        <div
                                            className={`text-[10px] mt-1 ${isUser ? "text-indigo-200 text-right" : "text-gray-400"
                                                }`}
                                        >
                                            {c.sender} •{" "}
                                            {new Date(c.time).toLocaleString("id-ID", {
                                                dateStyle: "short",
                                                timeStyle: "short",
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-gray-500 text-center text-sm py-10">
                            Belum ada percakapan.
                        </div>
                    )}
                </div>
            </div>

            {/* Post Reply Section */}
            <div className="bg-white rounded-lg shadow mt-8 p-5">
                <h4 className="font-semibold text-gray-700 mb-3">✉️ Post a Reply</h4>

                {isHeadOffice ? (
                    <>
                        {/* Head Office Input */}
                        <div className="mb-3">
                            <label className="block font-medium mb-1">Status Eskalasi</label>
                            <select
                                value={statusEskalasi}
                                onChange={(e) => setStatusEskalasi(e.target.value)}
                                className="border rounded w-full px-3 py-2"
                            >
                                <option value="">Pilih Status Eskalasi</option>
                                <option value="marketing">ESKALASI BY MARKETING</option>
                                <option value="helpdesk">ESKALASI BY IT HELPDESK</option>
                                <option value="uid">ESKALASI BY UID</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="block font-medium mb-1">Status Ticket</label>
                            <select
                                value={statusTicket}
                                onChange={(e) => setStatusTicket(e.target.value)}
                                className="border rounded w-full px-3 py-2"
                            >
                                <option value="">Pilih Status Ticket</option>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                                <option value="Reject">Reject</option>
                            </select>
                        </div>

                        {statusTicket.toLowerCase() === "reject" && (
                            <div className="mb-3">
                                <label className="block font-medium mb-1">Reason Reject</label>
                                <textarea
                                    value={reasonReject}
                                    onChange={(e) => setReasonReject(e.target.value)}
                                    className="border rounded w-full px-3 py-2"
                                    rows="4"
                                />
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="block font-medium mb-1">Post a Reply</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="border rounded w-full px-3 py-2"
                                rows="4"
                            />
                        </div>

                        <button
                            onClick={handleUpdateStatus}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </>
                ) : (
                    <>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="border rounded w-full px-3 py-2 mb-3"
                            rows="4"
                            placeholder="Tulis pesan..."
                        />
                        <input
                            type="file"
                            accept="image/*,video/mp4,application/pdf"
                            onChange={(e) => setFile(e.target.files[0] || null)}
                            className="border rounded w-full px-3 py-2 mb-3"
                        />
                        <button
                            onClick={handleSubmitChat}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
