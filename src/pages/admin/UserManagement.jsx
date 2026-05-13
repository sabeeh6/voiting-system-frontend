import React, { useState, useEffect } from "react";
import { 
    Users, Search, Filter, 
    ArrowLeft, ArrowRight, Loader2, 
    User, Mail, CreditCard, 
    Vote as VoteIcon, MapPin, Flag,
    CheckCircle2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [seatFilter, setSeatFilter] = useState("all");
    const [partyFilter, setPartyFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch User Voting Report
    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/votes/report");
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch user report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    // Extract unique seats and parties for filters
    const availableSeats = ["all", ...new Set(users.flatMap(u => u.votingHistory.map(v => v.seat)))];
    const availableParties = ["all", ...new Set(users.flatMap(u => u.votingHistory.map(v => v.party)))];

    // Filter Logic
    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             u.cnic.includes(searchTerm) || 
                             u.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSeat = seatFilter === "all" || u.votingHistory.some(v => v.seat === seatFilter);
        const matchesParty = partyFilter === "all" || u.votingHistory.some(v => v.party === partyFilter);

        return matchesSearch && matchesSeat && matchesParty;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentItems = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, seatFilter, partyFilter]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Voter Analytics</h1>
                    <p className="text-slate-500">Monitor voter participation and electoral choices in real-time.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-bold">{users.length} Registered Voters</span>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 premium-shadow flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[280px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by name, CNIC, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <select 
                            value={seatFilter}
                            onChange={(e) => setSeatFilter(e.target.value)}
                            className="bg-transparent text-sm font-medium text-slate-700 outline-none pr-4 cursor-pointer"
                        >
                            <option value="all">All Seats</option>
                            {availableSeats.filter(s => s !== "all").map(seat => (
                                <option key={seat} value={seat}>{seat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2">
                        <Flag className="w-4 h-4 text-slate-400" />
                        <select 
                            value={partyFilter}
                            onChange={(e) => setPartyFilter(e.target.value)}
                            className="bg-transparent text-sm font-medium text-slate-700 outline-none pr-4 cursor-pointer"
                        >
                            <option value="all">All Parties</option>
                            {availableParties.filter(p => p !== "all").map(party => (
                                <option key={party} value={party}>{party}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Voter Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 premium-shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Voter Info</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Identity</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Voting History</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-4" />
                                        <p className="text-slate-400 text-sm">Synchronizing voter records...</p>
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 text-sm">No voter records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((voter) => (
                                    <motion.tr 
                                        key={voter._id} 
                                        className="hover:bg-emerald-100/40 transition-all group relative border-l-4 border-l-transparent hover:border-l-emerald-700 cursor-default"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-bold group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                                    {voter.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{voter.name}</p>
                                                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {voter.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                                    {voter.cnic}
                                                </div>
                                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block ${
                                                    voter.isVerified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                }`}>
                                                    {voter.isVerified ? "IDENTITY VERIFIED" : "PENDING VERIFICATION"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-wrap gap-2">
                                                {voter.votingHistory.length > 0 ? (
                                                    voter.votingHistory.map((vote, idx) => (
                                                        <div key={idx} className="flex flex-col p-2 bg-slate-50 border border-slate-100 rounded-xl min-w-[120px]">
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                <MapPin className="w-3 h-3 text-emerald-600" />
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{vote.seat}</span>
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-800">{vote.party}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic font-medium">No votes cast yet</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            {voter.hasVoted ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20">
                                                    <VoteIcon className="w-3 h-3" /> Voted
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase">
                                                    Waiting
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <p className="text-xs text-slate-500">
                            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-bold text-slate-900">{filteredUsers.length}</span> voters
                        </p>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                        currentPage === i + 1 
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                                        : "hover:bg-white text-slate-500 border border-transparent hover:border-slate-200"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
