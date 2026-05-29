import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldAlert, CheckCircle2, XCircle, Search, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../lib/api";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get("/admin/logs");
                setLogs(response.data.data);
            } catch (error) {
                console.error("Failed to fetch audit logs", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user?.name && log.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.email && log.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getStatusIcon = (status) => {
        if (status === "SUCCESS") return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
        return <XCircle className="w-5 h-5 text-red-500" />;
    };

    const getActionBadge = (action) => {
        let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
        
        if (action.includes("SUCCESS")) colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
        else if (action.includes("FAILED")) colorClass = "bg-red-50 text-red-700 border-red-200";

        return (
            <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${colorClass}`}>
                {action.replace(/_/g, " ")}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-emerald-600" /> System Audit Trail
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Monitor all authentication and voting activities.</p>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by user, email or action..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden premium-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">User / Target</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">IP Address</th>
                                <th className="px-6 py-4 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                            Loading logs...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        No audit logs found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log, index) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        key={log._id} 
                                        className="hover:bg-slate-50 transition-colors group cursor-default"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {new Date(log.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.user ? (
                                                <Link to={`/admin/users/${log.user._id}/logs`} className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1">
                                                    {log.user.name} 
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded uppercase">{log.user.role}</span>
                                                </Link>
                                            ) : (
                                                <span className="font-medium text-slate-500">{log.email || "Unknown"}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getActionBadge(log.action)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {getStatusIcon(log.status)}
                                                <span className="font-medium text-xs">{log.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-slate-500">
                                            {log.ipAddress}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {log.user ? (
                                                <Link 
                                                    to={`/admin/users/${log.user._id}/logs`}
                                                    className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm group-hover:scale-105"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">No Profile</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
