import React from "react";
import { 
    Vote, History, ShieldCheck, 
    TrendingUp, Calendar, ArrowRight, UserCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function VoterDashboard() {
    const { user } = useAuth();

    const stats = [
        { label: "Active Elections", value: "3", icon: Vote, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Total Votes Cast", value: "12", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Verification Level", value: "Premium", icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, {user?.name} 👋</h1>
                    <p className="text-slate-500">Your biometric profile is active and secured with AES-256-GCM.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
                    Vote Now <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 premium-shadow hover:border-emerald-200 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Featured Election Card */}
            <div className="bg-emerald-600 p-8 rounded-[40px] relative overflow-hidden group shadow-2xl shadow-emerald-600/20">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Vote className="w-32 h-32 text-white" />
                </div>
                
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Live Now
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">2026 General Council Election</h2>
                    <p className="text-emerald-50 mb-8 leading-relaxed">
                        Secure your future by participating in the annual council elections. Your vote is protected by 
                        blockchain-grade encryption and multi-layer biometric verification.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 mb-8">
                        <div className="flex items-center gap-2 text-emerald-100">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Ends in 14 hours</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-100">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm">4,203 Votes Cast</span>
                        </div>
                    </div>

                    <button className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                        Open Ballot
                    </button>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 premium-shadow">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <History className="w-5 h-5 text-emerald-600" />
                        Recent Activity
                    </h3>
                    <div className="space-y-6">
                        {[
                            { title: "Voted in Tech Board", time: "2 days ago", type: "vote" },
                            { title: "Profile Verified", time: "5 days ago", type: "security" },
                            { title: "Fingerprint Updated", time: "1 week ago", type: "security" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                                    <p className="text-xs text-slate-400">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Status */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 premium-shadow bg-gradient-to-br from-white to-emerald-50/30">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Security Integrity</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                            <span className="text-sm text-emerald-600 font-medium">Face ID Status</span>
                            <span className="text-xs px-2 py-1 bg-emerald-600 text-white rounded-lg font-bold">Encrypted</span>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
                            <span className="text-sm text-blue-600 font-medium">Biometric Credential</span>
                            <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-lg font-bold">WebAuthn</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                            Your biometric data is stored using industry-standard hashing and encryption. 
                            The system never stores raw images of your fingerprints or face.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
