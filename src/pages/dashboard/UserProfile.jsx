import React, { useState } from "react";
import { 
    User, Mail, Fingerprint, 
    ShieldCheck, Key, LogOut,
    CheckCircle2, Camera, Bell,
    Globe, Smartphone, Loader2,
    ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

export default function UserProfile() {
    const { user, logout } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleMockUpdate = () => {
        setIsUpdating(true);
        setTimeout(() => {
            setIsUpdating(false);
            setMessage({ type: "success", text: "Profile security updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Notification Toast */}
            <AnimatePresence>
                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-6 rounded-[32px] flex items-center gap-4 border-2 shadow-2xl ${
                            message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                        }`}
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        <p className="font-black uppercase tracking-widest text-xs">{message.text}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Header */}
            <div className="bg-white rounded-[56px] p-12 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full translate-x-1/3 -translate-y-1/3 opacity-50 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[48px] flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-emerald-500/30">
                            {user?.name.charAt(0)}
                        </div>
                        <button className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
                            <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest self-center md:self-auto">
                                Official {user?.role}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-4 h-4" /> {user?.email}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-slate-500 text-xs font-bold">
                                <Globe className="w-3.5 h-3.5 text-emerald-500" /> Member since {new Date(user?.createdAt).getFullYear()}
                            </div>
                            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-slate-500 text-xs font-bold">
                                <Smartphone className="w-3.5 h-3.5 text-blue-500" /> Device Authorized
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Security Identity */}
                <div className="bg-slate-900 rounded-[56px] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <Fingerprint className="w-32 h-32 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-black mb-10 flex items-center gap-3 relative z-10">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        Digital Identity
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">National ID (CNIC)</p>
                                <p className="text-xl font-black tracking-widest">35201-XXXXXXX-X</p>
                            </div>
                            <ShieldAlert className="w-6 h-6 text-amber-500" />
                        </div>

                        <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black uppercase tracking-tight">Biometric Status</span>
                                <span className="text-[10px] font-black px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full uppercase tracking-tighter">Activated</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black uppercase tracking-tight">Encryption Key</span>
                                <span className="text-[10px] font-black px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full uppercase tracking-tighter">ECC-384</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings & Actions */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
                            <Key className="w-6 h-6 text-emerald-600" />
                            Account Access
                        </h3>
                        
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-5 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition-colors">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-black text-slate-900 uppercase">Change Security Pin</span>
                                </div>
                                <ShieldAlert className="w-4 h-4 text-slate-300" />
                            </button>

                            <button className="w-full flex items-center justify-between p-5 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-black text-slate-900 uppercase">Alert Preferences</span>
                                </div>
                                <ShieldAlert className="w-4 h-4 text-slate-300" />
                            </button>

                            <button 
                                onClick={handleMockUpdate}
                                disabled={isUpdating}
                                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] font-black shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3"
                            >
                                {isUpdating ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Profile Configuration"}
                            </button>

                            <button 
                                onClick={logout}
                                className="w-full py-5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-[24px] font-black transition-all flex items-center justify-center gap-3"
                            >
                                <LogOut className="w-5 h-5" /> De-authorize Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
