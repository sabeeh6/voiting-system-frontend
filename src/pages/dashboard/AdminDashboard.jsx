import React from "react";
import { 
    Users, Gavel, ShieldAlert, 
    BarChart3, Plus, Search, 
    MoreVertical, ArrowUpRight, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const stats = [
        { label: "Total Voters", value: "24,802", change: "+12%", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Active Elections", value: "8", change: "+2", icon: Gavel, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Total Votes cast", value: "156.4k", change: "+5.4%", icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Pending Verification", value: "42", change: "-18%", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">System Overview</h1>
                    <p className="text-slate-500">Monitoring Votex network health and election integrity.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-semibold border border-slate-200 transition-all flex items-center gap-2 shadow-sm">
                        <Search className="w-4 h-4" /> Reports
                    </button>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Election
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 premium-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                                stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            }`}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Registrations Table */}
                <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 premium-shadow overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">Recent Registrations</h3>
                        <button className="text-sm text-emerald-600 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CNIC</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {[
                                    { name: "Ahmed Khan", email: "ahmed@example.com", cnic: "35201-XXXXXXX-X", status: "Verified" },
                                    { name: "Sara Ali", email: "sara@example.com", cnic: "42101-XXXXXXX-X", status: "Verified" },
                                    { name: "Zainab Malik", email: "zainab@example.com", cnic: "12101-XXXXXXX-X", status: "Pending" },
                                    { name: "Bilal Sheikh", email: "bilal@example.com", cnic: "35202-XXXXXXX-X", status: "Verified" },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700">
                                                    {row.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{row.name}</p>
                                                    <p className="text-[10px] text-slate-400">{row.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-xs font-mono text-slate-500">{row.cnic}</td>
                                        <td className="px-8 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${
                                                row.status === "Verified" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4 text-slate-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 premium-shadow">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Security Logs</h3>
                    <div className="space-y-6">
                        {[
                            { event: "Election #24 Ended", time: "10m ago", color: "bg-emerald-500" },
                            { event: "New Candidate Added", time: "45m ago", color: "bg-emerald-400" },
                            { event: "System Audit Complete", time: "2h ago", color: "bg-emerald-600" },
                            { event: "Security Patch Applied", time: "5h ago", color: "bg-emerald-300" },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={`w-[2px] h-10 rounded-full ${log.color}`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-sm font-medium text-slate-900">{log.event}</p>
                                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] text-slate-400">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-10 p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl text-white shadow-xl shadow-emerald-600/20">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                            <h4 className="font-bold">Backup Active</h4>
                        </div>
                        <p className="text-xs text-emerald-50/80 leading-relaxed mb-4">
                            Global election data is being synchronized with secondary nodes across 4 regions.
                        </p>
                        <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "94%" }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-white" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
