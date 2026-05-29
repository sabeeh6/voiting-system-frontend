import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    User, ShieldAlert, CheckCircle2, XCircle, ArrowLeft, 
    Activity, Calendar, MapPin, Laptop, Shield, UserX, UserCheck, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../lib/api";

export default function UserLogDetailsPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const [userData, setUserData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/admin/users/${userId}/logs`);
                setUserData(response.data.data.user);
                setLogs(response.data.data.logs);
            } catch (error) {
                console.error("Failed to fetch user logs", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [userId]);

    const handleToggleStatus = async () => {
        if (!window.confirm(`Are you sure you want to ${userData.isActive ? 'deactivate' : 'activate'} this user?`)) return;
        
        setIsToggling(true);
        try {
            const response = await api.patch(`/admin/users/${userId}/toggle-status`);
            setUserData(prev => ({ ...prev, isActive: response.data.data.isActive }));
        } catch (error) {
            console.error("Failed to toggle status", error);
            alert(error.response?.data?.message || "Failed to toggle status");
        } finally {
            setIsToggling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="text-center py-12">
                <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-800">User Not Found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-emerald-600 hover:underline">Go Back</button>
            </div>
        );
    }

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
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header / Back */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    User Activity Profile
                </h1>
            </div>

            {/* User Details Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 premium-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -z-10" />
                
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {userData.name}
                            {!userData.isActive && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] uppercase font-bold rounded-full border border-red-200">Suspended</span>
                            )}
                        </h2>
                        <div className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> {userData.role}</span>
                            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> CNIC: {userData.cnic}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleToggleStatus}
                        disabled={isToggling}
                        className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                            userData.isActive 
                            ? "bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" 
                            : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20"
                        }`}
                    >
                        {isToggling ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : userData.isActive ? (
                            <><UserX className="w-4 h-4" /> Suspend Account</>
                        ) : (
                            <><UserCheck className="w-4 h-4" /> Activate Account</>
                        )}
                    </button>
                </div>
            </div>

            {/* Timeline / Logs */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 premium-shadow">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" /> Activity Timeline
                </h3>
                
                <div className="space-y-6">
                    {logs.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">No activity recorded for this user yet.</p>
                    ) : (
                        logs.map((log, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={log._id} 
                                className="relative pl-6 sm:pl-8 before:absolute before:left-[11px] before:top-8 before:bottom-[-24px] last:before:hidden before:w-[2px] before:bg-slate-100"
                            >
                                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                                    log.status === "SUCCESS" ? "bg-emerald-500" : "bg-red-500"
                                }`}>
                                    {log.status === "SUCCESS" ? <CheckCircle2 className="w-3 h-3 text-white" /> : <XCircle className="w-3 h-3 text-white" />}
                                </div>
                                
                                <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 rounded-2xl p-4 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            {getActionBadge(log.action)}
                                            <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" /> {new Date(log.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Context Details</p>
                                            <div className="bg-white rounded-lg p-3 border border-slate-200">
                                                {Object.keys(log.details || {}).length > 0 ? (
                                                    <pre className="text-[11px] font-mono text-slate-600 whitespace-pre-wrap">
                                                        {JSON.stringify(log.details, null, 2)}
                                                    </pre>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No additional context.</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Environment</p>
                                            <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                    <span className="text-xs text-slate-600 font-mono break-all">{log.ipAddress}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Laptop className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                    <span className="text-xs text-slate-600 break-words">{log.userAgent}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
