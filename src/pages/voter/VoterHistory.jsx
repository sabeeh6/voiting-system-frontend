import React, { useState, useEffect } from "react";
import { 
    History, ShieldCheck, 
    Calendar, MapPin, Flag,
    User, CheckCircle2, Loader2,
    Lock, ExternalLink, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function VoterHistory() {
    const navigate = useNavigate();
    const [votes, setVotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get("/votes/my-history");
                if (response.data.success) {
                    setVotes(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Participation Ledger</h1>
                    <p className="text-slate-500 font-medium">A transparent, immutable record of your digital democratic footprint.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Auditable Record</span>
                </div>
            </div>

            {/* Security Warning */}
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Lock className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20">
                        <History className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-1">Privacy Guarantee</h2>
                        <p className="text-slate-400 text-sm max-w-md">
                            Your specific ballot choices are encrypted. This ledger confirms your participation 
                            while maintaining the secrecy of your individual vote from third parties.
                        </p>
                    </div>
                </div>
            </div>

            {/* History Timeline */}
            <div className="relative space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[31px] top-4 bottom-4 w-1 bg-slate-100 rounded-full" />

                {isLoading ? (
                    <div className="py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving Secure Logs...</p>
                    </div>
                ) : votes.length === 0 ? (
                    <div className="py-24 bg-white rounded-[48px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <History className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Records Yet</h3>
                        <p className="text-slate-400 max-w-xs mb-8">You haven't participated in any electoral cycles yet.</p>
                        <button 
                            onClick={() => navigate("/dashboard/elections")}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all"
                        >
                            Browse Elections <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    votes.map((vote, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative pl-16 group"
                        >
                            {/* Timeline Point */}
                            <div className="absolute left-6 top-6 w-4 h-4 bg-white border-4 border-emerald-500 rounded-full z-10 group-hover:scale-150 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            
                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-emerald-200 transition-all">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3 h-3" /> Confirmed
                                            </span>
                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" /> 
                                                {new Date(vote.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vote cast for {vote.seat}</h3>
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                                <Flag className="w-4 h-4 text-emerald-500" />
                                                <span className="text-xs font-bold text-slate-700">{vote.party}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                                                <User className="w-4 h-4 text-blue-500" />
                                                <span className="text-xs font-bold text-slate-700">{vote.candidate?.name || "Official Candidate"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between">
                                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 text-center min-w-[120px]">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipt Hash</p>
                                            <p className="text-[10px] font-bold text-slate-600 font-mono">0x{vote._id.slice(-8).toUpperCase()}...{vote._id.slice(0, 4).toUpperCase()}</p>
                                        </div>
                                        <button className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:underline transition-all">
                                            Verify Integrity <ExternalLink className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
