import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, Vote, History, User, 
    Settings, LogOut, Menu, X, Bell, 
    Shield, Users, ChevronRight, Gavel
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const voterLinks = [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Elections", path: "/dashboard/elections", icon: Gavel },
        { name: "My Votes", path: "/dashboard/history", icon: History },
        { name: "Profile", path: "/dashboard/profile", icon: User },
    ];

    const adminLinks = [
        { name: "Admin Panel", path: "/admin", icon: LayoutDashboard },
        { name: "Manage Elections", path: "/admin/elections", icon: Shield },
        { name: "Candidates", path: "/admin/candidates", icon: Users },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ];

    const links = user?.role === "admin" ? adminLinks : voterLinks;

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex text-slate-600">
            {/* Sidebar */}
            <aside 
                className={`fixed lg:relative z-40 h-full bg-white border-r border-slate-200 transition-all duration-300 ${
                    isSidebarOpen ? "w-64" : "w-0 lg:w-20 overflow-hidden"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/20">
                            <Vote className="text-white w-5 h-5" />
                        </div>
                        {isSidebarOpen && (
                            <span className="text-lg font-bold text-slate-900 tracking-tight">
                                Secure<span className="text-emerald-600">Vote</span>
                            </span>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 space-y-2 py-4">
                        {links.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                                        isActive 
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                                        : "hover:bg-slate-50 text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    <link.icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "group-hover:text-emerald-500"}`} />
                                    {isSidebarOpen && <span className="text-sm font-medium">{link.name}</span>}
                                    {isActive && isSidebarOpen && <ChevronRight className="ml-auto w-4 h-4" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-100">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all group"
                        >
                            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            {isSidebarOpen && <span className="text-sm font-medium">Log Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between z-30">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <h2 className="text-lg font-bold text-slate-900 hidden md:block">
                            {user?.role === "admin" ? "Administrator Dashboard" : "Voter Portal"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-emerald-600 transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="h-10 w-[1px] bg-slate-200 mx-2" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                                <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-widest">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-600/20">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
