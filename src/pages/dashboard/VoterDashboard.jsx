import React, { useState, useEffect } from "react";
import { 
    Vote, History, ShieldCheck, 
    TrendingUp, Calendar, ArrowRight, UserCheck,
    Lock, Fingerprint, Loader2, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

export default function VoterDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeElections: 0,
        totalVotes: 0,
        voterStatus: "Verified"
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [electionsRes, votesRes] = await Promise.all([
                    api.get("/elections"),
                    api.get("/votes/my-history")
                ]);
                
                const elections = electionsRes.data.data;
                const myVotes = votesRes.data.data;
                const active = elections.filter(e => e.status === "ongoing").length;
                
                setStats({
                    activeElections: active,
                    totalVotes: myVotes.length,
                    voterStatus: user?.isVerified ? "Secured" : "Pending"
                });
            } catch (error) {
                console.error("Dashboard fetch failed:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Authenticating Session...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
                    <p className="text-slate-500 font-medium">Your cryptographic profile is active and monitored for integrity.</p>
                </div>
                <button 
                    onClick={() => navigate("/dashboard/elections")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-[24px] font-black shadow-2xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                >
                    Launch Ballot <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Active Elections", value: stats.activeElections, icon: Vote, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Votes Cast", value: stats.totalVotes, icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Security Level", value: stats.voterStatus, icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-emerald-200 transition-all group cursor-default"
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 ${stat.bg} rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Action Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Featured Promo */}
                <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[56px] relative overflow-hidden group shadow-2xl shadow-slate-900/30 min-h-[400px] flex flex-col justify-end">
                    <div className="absolute top-0 right-0 p-12 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <Zap className="w-64 h-64 text-emerald-500" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-500/30">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            System Integrity Validated
                        </div>
                        <h2 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">Empower your choice through <br/> secure digital voting.</h2>
                        <p className="text-slate-400 font-medium mb-10 max-w-lg leading-relaxed">
                            Votex utilizes end-to-end encryption to ensure that every ballot is cast anonymously and counted accurately. Your voice is your digital signature.
                        </p>
                        
                        <button 
                            onClick={() => navigate("/dashboard/elections")}
                            className="bg-white text-slate-900 px-10 py-5 rounded-[24px] font-black hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-95"
                        >
                            Open Election Gateway
                        </button>
                    </div>
                </div>

                {/* Side Panel: Security & Activity */}
                <div className="space-y-8">
                    {/* Security Status */}
                    <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/40 bg-gradient-to-br from-white to-emerald-50/30 h-full flex flex-col">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-emerald-600" />
                            Security Protocol
                        </h3>
                        <div className="space-y-4 flex-1">
                            <div className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <Fingerprint className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <span className="text-xs font-black text-slate-900 uppercase">Biometrics</span>
                                </div>
                                <span className="text-[10px] font-black px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-tighter">Verified</span>
                            </div>
                            <div className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-black text-slate-900 uppercase">Encryption</span>
                                </div>
                                <span className="text-[10px] font-black px-3 py-1 bg-blue-100 text-blue-700 rounded-full uppercase tracking-tighter">AES-256</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-8 leading-relaxed uppercase tracking-tight text-center">
                            Your biometric data remains on your local hardware. Votex never transmits raw biological patterns.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Activity History */}
            <div className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-xl shadow-slate-200/40">
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <History className="w-7 h-7 text-emerald-600" />
                    Interaction Ledger
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "Session Authenticated", time: "Just now", icon: Lock, bg: "bg-slate-50", color: "text-slate-400" },
                        { title: "Identity Validated", time: "1 hour ago", icon: UserCheck, bg: "bg-emerald-50", color: "text-emerald-600" },
                        { title: "Gateway Accessed", time: "2 hours ago", icon: TrendingUp, bg: "bg-blue-50", color: "text-blue-600" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 rounded-[28px] border border-slate-50 hover:bg-slate-50 transition-colors">
                            <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center`}>
                                <item.icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900">{item.title}</p>
                                <p className="text-xs font-bold text-slate-400">{item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
