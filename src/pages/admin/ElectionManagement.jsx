import React, { useState, useEffect } from "react";
import { 
    Calendar, Clock, Trophy, 
    Plus, Search, Edit2, Trash2, 
    CheckCircle2, AlertCircle, X, 
    Loader2, Users, MapPin, 
    BarChart3, Settings, Timer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../lib/api";

// --- Validation Schema ---
const electionSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().optional(),
    seat: z.string().min(2, "Seat name is required"),
    startTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start time"),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end time"),
    candidates: z.array(z.string()).min(2, "Select at least 2 candidates"),
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
});

export default function ElectionManagement() {
    const navigate = useNavigate();
    const [elections, setElections] = useState([]);
    const [allCandidates, setAllCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(electionSchema),
        defaultValues: {
            candidates: []
        }
    });

    const selectedCandidates = watch("candidates");

    // Fetch Elections & Candidates
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [electionsRes, candidatesRes] = await Promise.all([
                api.get("/elections"),
                api.get("/candidates")
            ]);
            setElections(electionsRes.data.data);
            setAllCandidates(candidatesRes.data.data);
        } catch (error) {
            setMessage({ type: "error", text: "Failed to fetch data" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await api.post("/elections/create", data);
            if (response.data.success) {
                setMessage({ type: "success", text: "Election created successfully!" });
                fetchData();
                setIsModalOpen(false);
                reset();
            }
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || "Creation failed" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this election permanently?")) return;
        try {
            await api.delete(`/elections/${id}`);
            setElections(elections.filter(e => e._id !== id));
            setMessage({ type: "success", text: "Election removed" });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete" });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "ongoing": return "bg-emerald-500 shadow-emerald-500/20";
            case "upcoming": return "bg-blue-500 shadow-blue-500/20";
            case "completed": return "bg-slate-500 shadow-slate-500/20";
            default: return "bg-slate-400";
        }
    };

    return (
        <div className="space-y-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Election Control Center</h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Manage official electoral cycles and schedules.
                    </p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-3xl font-black shadow-2xl shadow-emerald-600/30 transition-all flex items-center gap-3 active:scale-95 group"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" /> 
                    Create Election
                </button>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`fixed top-8 right-8 z-[100] p-5 rounded-[24px] shadow-2xl flex items-center gap-4 border ${
                            message.type === "success" ? "bg-white text-emerald-700 border-emerald-100" : "bg-white text-red-700 border-red-100"
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.type === "success" ? "bg-emerald-50" : "bg-red-50"}`}>
                            {message.type === "success" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        </div>
                        <span className="font-bold">{message.text}</span>
                        <button onClick={() => setMessage({ type: "", text: "" })} className="hover:rotate-90 transition-transform">
                            <X className="w-5 h-5 opacity-40" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Elections Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {isLoading ? (
                    <div className="col-span-full py-32 text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Secure Records...</p>
                    </div>
                ) : elections.length === 0 ? (
                    <div className="col-span-full py-24 bg-white rounded-[48px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Calendar className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Elections</h3>
                        <p className="text-slate-400 max-w-xs">Start by creating your first electoral cycle for a specific seat.</p>
                    </div>
                ) : (
                    elections.map((election) => (
                        <motion.div 
                            key={election._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-[48px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group"
                        >
                            {/* Status Badge */}
                            <div className="absolute top-8 right-8 flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor(election.status)}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    {election.status}
                                </span>
                            </div>

                            <div className="flex flex-col h-full">
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-tighter mb-4">
                                        <MapPin className="w-3.5 h-3.5" /> {election.seat}
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{election.title}</h2>
                                    <p className="text-slate-500 text-sm line-clamp-2 font-medium">{election.description || "Official electoral process for public representation."}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Timer className="w-3 h-3" /> Start Time
                                        </p>
                                        <p className="text-sm font-black text-slate-700">
                                            {new Date(election.startTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold">
                                            {new Date(election.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" /> End Time
                                        </p>
                                        <p className="text-sm font-black text-slate-700">
                                            {new Date(election.endTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold">
                                            {new Date(election.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex -space-x-3">
                                        {election.candidates.slice(0, 3).map((c, i) => (
                                            <div key={i} className="w-10 h-10 rounded-2xl bg-slate-100 border-4 border-white flex items-center justify-center text-xs font-black text-slate-500 shadow-sm" title={c.name}>
                                                {c.name.charAt(0)}
                                            </div>
                                        ))}
                                        {election.candidates.length > 3 && (
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-4 border-white flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-sm">
                                                +{election.candidates.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleDelete(election._id)}
                                            className="p-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/admin/analytics/${election._id}`)}
                                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/20"
                                        >
                                            <BarChart3 className="w-4 h-4" /> View Analytics
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Create Election Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative bg-white w-full max-w-2xl rounded-[60px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20"
                        >
                            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Initiate Election</h2>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Electoral Protocol V2.4</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-3xl transition-colors">
                                    <X className="w-8 h-8 text-slate-300" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Election Title</label>
                                            <input 
                                                {...register("title")}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-900 focus:border-emerald-500 focus:ring-0 outline-none transition-all"
                                                placeholder="e.g. General Election 2026"
                                            />
                                            {errors.title && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.title.message}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Seat</label>
                                            <input 
                                                {...register("seat")}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-900 focus:border-emerald-500 focus:ring-0 outline-none transition-all"
                                                placeholder="e.g. NA-125"
                                            />
                                            {errors.seat && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.seat.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                        <textarea 
                                            {...register("description")}
                                            rows="3"
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-4 px-6 font-bold text-slate-900 focus:border-emerald-500 focus:ring-0 outline-none transition-all resize-none"
                                            placeholder="Briefly describe the purpose of this election..."
                                        />
                                    </div>

                                    {/* Timing */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Start Timeline</label>
                                            <input 
                                                type="datetime-local"
                                                {...register("startTime")}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-900 focus:border-emerald-500 focus:ring-0 outline-none transition-all"
                                            />
                                            {errors.startTime && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.startTime.message}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">End Timeline</label>
                                            <input 
                                                type="datetime-local"
                                                {...register("endTime")}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold text-slate-900 focus:border-emerald-500 focus:ring-0 outline-none transition-all"
                                            />
                                            {errors.endTime && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.endTime.message}</p>}
                                        </div>
                                    </div>

                                    {/* Candidate Selection */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between items-center">
                                            Select Candidates 
                                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px]">{selectedCandidates.length} Selected</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-[32px] border-2 border-slate-100 custom-scrollbar">
                                            {allCandidates.map((c) => (
                                                <label 
                                                    key={c._id}
                                                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                                                        selectedCandidates.includes(c._id) 
                                                        ? "bg-white border-emerald-500 shadow-lg shadow-emerald-500/10" 
                                                        : "bg-white border-transparent hover:border-slate-200"
                                                    }`}
                                                >
                                                    <input 
                                                        type="checkbox"
                                                        value={c._id}
                                                        {...register("candidates")}
                                                        className="w-5 h-5 rounded-lg accent-emerald-600"
                                                    />
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-black text-slate-900 truncate">{c.name}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{c.party}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.candidates && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{errors.candidates.message}</p>}
                                    </div>
                                </div>

                                <div className="pt-8 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-5 rounded-[24px] transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Authorize Election"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
