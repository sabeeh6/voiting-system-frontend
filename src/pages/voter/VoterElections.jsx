import React, { useState, useEffect } from "react";
import { 
    Vote as VoteIcon, Calendar, 
    Clock, ChevronRight, Search, 
    Filter, Loader2, MapPin, 
    Timer, CheckCircle2, History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function VoterElections() {
    const navigate = useNavigate();
    const [elections, setElections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchElections = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/elections");
            if (response.data.success) {
                setElections(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch elections:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchElections();
    }, []);

    const filteredElections = elections.filter(e => {
        const matchesFilter = filter === "all" || e.status === filter;
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             e.seat.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case "ongoing": return "bg-emerald-500 text-white shadow-emerald-500/40 border-emerald-400";
            case "upcoming": return "bg-amber-500 text-white shadow-amber-500/40 border-amber-400";
            case "completed": return "bg-slate-700 text-white shadow-slate-700/40 border-slate-600";
            default: return "bg-slate-200 text-slate-500";
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[48px] p-12 text-white">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <VoteIcon className="w-full h-full -rotate-12 translate-x-1/4 translate-y-1/4" />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-black uppercase tracking-widest mb-6 border border-emerald-500/30"
                    >
                        <CheckCircle2 className="w-4 h-4" /> Official Voter Gateway
                    </motion.div>
                    <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">
                        Your Voice, Your Power. <br/> <span className="text-emerald-500 underline decoration-white/20 underline-offset-8">Cast Your Ballot</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
                        Participate in ongoing elections or browse upcoming schedules. Every vote is a step towards a better future.
                    </p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex bg-slate-100 p-1.5 rounded-[24px] w-fit">
                    {["all", "ongoing", "upcoming", "completed"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-6 py-2.5 rounded-[20px] text-sm font-bold capitalize transition-all ${
                                filter === type 
                                ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50" 
                                : "text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by title or constituency..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-[28px] py-4 pl-14 pr-6 font-bold text-slate-900 focus:border-emerald-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Elections Display */}
            {isLoading ? (
                <div className="py-32 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-emerald-600 mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing Electoral Ledger...</p>
                </div>
            ) : filteredElections.length === 0 ? (
                <div className="py-24 bg-slate-50 rounded-[64px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
                        <Calendar className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Quiet on the Front</h3>
                    <p className="text-slate-400 font-medium max-w-xs">No elections match your current criteria. Check back soon for updates.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredElections.map((election) => (
                        <motion.div 
                            key={election._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group bg-white rounded-[56px] p-10 border-2 border-slate-50 shadow-xl hover:shadow-2xl hover:border-emerald-100 transition-all duration-500 relative flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${getStatusStyles(election.status)}`}>
                                    {election.status}
                                </div>
                                <div className="text-slate-300 font-black text-4xl opacity-20 group-hover:opacity-100 transition-opacity">
                                    #{election.seat}
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{election.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">
                                    {election.description || "Official democratic process to select representation for your constituency."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10 p-6 bg-slate-50 rounded-[40px]">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Timer className="w-3.5 h-3.5" /> Start Timeline
                                    </p>
                                    <p className="text-sm font-black text-slate-900">
                                        {new Date(election.startTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400">
                                        {new Date(election.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="space-y-2 border-l-2 border-slate-100 pl-8">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <History className="w-3.5 h-3.5" /> Closing At
                                    </p>
                                    <p className="text-sm font-black text-slate-900">
                                        {new Date(election.endTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400">
                                        {new Date(election.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-3">
                                        {election.candidates.slice(0, 3).map((c, i) => (
                                            <div key={i} className="w-11 h-11 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-xs font-black text-emerald-600 shadow-sm" title={c.name}>
                                                {c.name.charAt(0)}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">
                                        {election.candidates.length} Candidates
                                    </span>
                                </div>

                                {election.status === "ongoing" ? (
                                    <button 
                                        onClick={() => navigate(`/dashboard/vote/${election._id}`)}
                                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] font-black text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 group/btn active:scale-95"
                                    >
                                        Vote Now <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                ) : election.status === "completed" ? (
                                    <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-[24px] font-black text-sm transition-all flex items-center gap-2 active:scale-95">
                                        View Results
                                    </button>
                                ) : (
                                    <div className="px-8 py-4 bg-amber-50 text-amber-600 rounded-[24px] font-black text-sm border-2 border-amber-100 flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Opening Soon
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
