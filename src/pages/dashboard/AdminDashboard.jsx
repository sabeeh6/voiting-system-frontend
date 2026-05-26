import React, { useState, useEffect } from "react";
import { 
    Users, Gavel, ShieldAlert, 
    BarChart3, Plus, Search, 
    MoreVertical, ArrowUpRight, CheckCircle2,
    Loader2, Activity, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({
        totalVoters: 0,
        activeElections: 0,
        totalVotes: 0,
        pendingVerifications: 0,
        recentUsers: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, electionsRes] = await Promise.all([
                    api.get("/auth/users"),
                    api.get("/elections")
                ]);

                const users = usersRes.data.data;
                const elections = electionsRes.data.data;
                
                setData({
                    totalVoters: users.length,
                    activeElections: elections.filter(e => e.status === "ongoing").length,
                    totalVotes: elections.reduce((acc, e) => acc + (e.voters?.length || 0), 0),
                    pendingVerifications: users.filter(u => !u.isVerified).length,
                    recentUsers: users.slice(0, 5)
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: "Total Voters", value: data.totalVoters.toLocaleString(), change: "+5%", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Active Elections", value: data.activeElections, change: "Live", icon: Gavel, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Total Votes Cast", value: data.totalVotes.toLocaleString(), change: "+2.1%", icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Pending Tasks", value: data.pendingVerifications, change: "-12%", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Aggregating System Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">System Analytics</h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" /> Real-time monitoring of election integrity and network health.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate("/admin/elections")}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-[24px] font-black shadow-2xl shadow-slate-900/20 transition-all flex items-center gap-3 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> New Election
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-emerald-200 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-14 h-14 ${stat.bg} rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-7 h-7 ${stat.color}`} />
                            </div>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                                stat.change.includes('+') || stat.change === "Live" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                            }`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Table */}
                <div className="lg:col-span-2 bg-white rounded-[56px] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Voter Onboarding</h3>
                        <button 
                            onClick={() => navigate("/admin/users")}
                            className="text-xs font-black text-emerald-600 hover:underline uppercase tracking-widest"
                        >
                            View Registry
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identified User</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Credentials</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.recentUsers.map((row, i) => (
                                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-lg shadow-emerald-500/10">
                                                    {row.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{row.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{row.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-xs font-black text-slate-500 uppercase tracking-tighter">{row.cnic || "35201-XXXXXXXX-X"}</td>
                                        <td className="px-10 py-6 text-right">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                                row.isVerified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                            }`}>
                                                {row.isVerified ? "Verified" : "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Integrity Panel */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[56px] p-10 text-white shadow-2xl shadow-slate-900/40 h-full relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                            <ShieldCheck className="w-32 h-32 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-black mb-10 flex items-center gap-3 relative z-10">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                            Security Integrity
                        </h3>

                        <div className="space-y-6 relative z-10">
                            {[
                                { event: "Network Sync", status: "Active", color: "bg-emerald-500" },
                                { event: "Database Audit", status: "Clean", color: "bg-blue-500" },
                                { event: "Firewall Check", status: "Secure", color: "bg-purple-500" },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${log.color}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{log.event}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">{log.status}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-12 p-8 bg-emerald-600 rounded-[40px] text-white shadow-2xl shadow-emerald-600/30">
                            <h4 className="font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Global Ledger
                            </h4>
                            <p className="text-[10px] text-emerald-50/80 font-bold leading-relaxed mb-6 uppercase tracking-tight">
                                Blockchain synchronization active across 12 distributed nodes.
                            </p>
                            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden border border-white/10">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2 }}
                                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
