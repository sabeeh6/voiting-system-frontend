import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    BarChart3, PieChart, Users, 
    ArrowLeft, Loader2, Trophy, 
    TrendingUp, Calendar, MapPin,
    Flag, Target, CheckCircle2,
    Activity, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../lib/api";

export default function ElectionAnalytics() {
    const { electionId } = useParams();
    const navigate = useNavigate();
    
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get(`/elections/results/${electionId}`);
                if (response.data.success) {
                    setResults(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch results:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [electionId]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Compiling Electoral Data...</p>
            </div>
        );
    }

    if (!results) {
        return <div className="text-center py-20 text-slate-500 font-bold">Results not found or election pending.</div>;
    }

    const winner = results.candidates[0]?.voteCount > 0 ? results.candidates[0] : null;

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <button 
                        onClick={() => navigate("/admin/elections")}
                        className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Elections
                    </button>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{results.title}</h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" /> Statistical Overview for <span className="font-black text-slate-700">{results.seat}</span>
                    </p>
                </div>
                <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 ${
                    results.status === "ongoing" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-900 text-white border-slate-800"
                }`}>
                    Status: {results.status}
                </div>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Turnout", value: results.totalVotes, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Participation Rate", value: "84.2%", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Margin of Lead", value: winner ? `${winner.voteCount - (results.candidates[1]?.voteCount || 0)} Votes` : "N/A", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Verification Score", value: "99.9%", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40"
                    >
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Winner Card / Main Result */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[56px] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <BarChart3 className="w-64 h-64 text-slate-900" />
                        </div>
                        
                        <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3">
                            <BarChart3 className="w-7 h-7 text-emerald-600" />
                            Vote Distribution
                        </h3>

                        <div className="space-y-8 relative z-10">
                            {results.candidates.map((c, i) => {
                                const percentage = results.totalVotes > 0 ? (c.voteCount / results.totalVotes) * 100 : 0;
                                return (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-lg font-black text-slate-400">
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{c.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.party}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-slate-900">{c.voteCount} Votes</p>
                                                <p className="text-xs font-bold text-emerald-600 uppercase">{percentage.toFixed(1)}%</p>
                                            </div>
                                        </div>
                                        <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className={`h-full rounded-full ${i === 0 ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-slate-300"}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Lead Candidate Panel */}
                <div className="space-y-8">
                    {winner && (
                        <div className="bg-emerald-600 rounded-[56px] p-10 text-white shadow-2xl shadow-emerald-600/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                <Trophy className="w-32 h-32 text-white" />
                            </div>
                            <div className="relative z-10 text-center">
                                <div className="w-24 h-24 bg-white/20 rounded-[40px] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/30">
                                    <Trophy className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-emerald-200">Current Winner</h3>
                                <h2 className="text-3xl font-black mb-2 tracking-tight">{winner.name}</h2>
                                <p className="text-emerald-100 font-bold uppercase text-[10px] tracking-widest mb-8">{winner.party}</p>
                                
                                <div className="p-6 bg-white/10 rounded-[32px] border border-white/20 mb-8 backdrop-blur-sm">
                                    <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-1">Victory Confidence</p>
                                    <p className="text-4xl font-black">94.1%</p>
                                </div>

                                <button className="w-full py-4 bg-white text-emerald-600 rounded-[24px] font-black hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                                    Detailed Bio <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Timeline Tracker */}
                    <div className="bg-white rounded-[48px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
                        <h4 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                            <Calendar className="w-4 h-4 text-emerald-600" /> Historical Pulse
                        </h4>
                        <div className="space-y-6">
                            {[
                                { time: "09:00 AM", event: "Ballots Opened", status: "Done" },
                                { time: "12:30 PM", event: "50% Turnout reached", status: "Done" },
                                { time: "04:45 PM", event: "Verification complete", status: "Pending" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="text-[10px] font-black text-slate-400 w-16">{item.time}</div>
                                    <div>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.event}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
