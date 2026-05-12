import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Vote, Mail, Lock, CreditCard, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, "CNIC must follow XXXXX-XXXXXXX-X format"),
});

export default function LoginPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onBlur"
    });

    const onSubmit = async (data) => {
        setServerError("");
        setIsSubmitting(true);

        const result = await login(data);

        if (result.success) {
            const userRole = result.user?.role;
            navigate(userRole === "admin" ? "/admin" : "/dashboard");
        } else {
            setServerError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                        <Vote className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">
                        Secure<span className="text-emerald-600">Vote</span>
                    </span>
                </div>

                {/* Card */}
                <div className="bg-white p-8 rounded-3xl premium-shadow border border-slate-200">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-500 text-sm">Triple-verification login for maximum security</p>
                    </div>

                    {serverError && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs text-center flex items-center justify-center gap-2"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {serverError}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.email ? "text-red-400" : "text-slate-400 group-focus-within:text-emerald-600"}`} />
                                <input
                                    {...register("email")}
                                    placeholder="name@example.com"
                                    className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 outline-none transition-all ${
                                        errors.email ? "border-red-300 focus:ring-red-500/5 focus:border-red-400" : "border-slate-200 focus:ring-emerald-500/5 focus:border-emerald-500/50"
                                    }`}
                                />
                            </div>
                            {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-medium text-slate-500">Password</label>
                                <a href="#" className="text-[10px] text-emerald-600 hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.password ? "text-red-400" : "text-slate-400 group-focus-within:text-emerald-600"}`} />
                                <input
                                    type="password"
                                    {...register("password")}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 outline-none transition-all ${
                                        errors.password ? "border-red-300 focus:ring-red-500/5 focus:border-red-400" : "border-slate-200 focus:ring-emerald-500/5 focus:border-emerald-500/50"
                                    }`}
                                />
                            </div>
                            {errors.password && <p className="text-[10px] text-red-500 ml-1">{errors.password.message}</p>}
                        </div>

                        {/* CNIC */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 ml-1">CNIC Number</label>
                            <div className="relative group">
                                <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.cnic ? "text-red-400" : "text-slate-400 group-focus-within:text-emerald-600"}`} />
                                <input
                                    {...register("cnic")}
                                    placeholder="XXXXX-XXXXXXX-X"
                                    className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 outline-none transition-all ${
                                        errors.cnic ? "border-red-300 focus:ring-red-500/5 focus:border-red-400" : "border-slate-200 focus:ring-emerald-500/5 focus:border-emerald-500/50"
                                    }`}
                                />
                            </div>
                            {errors.cnic && <p className="text-[10px] text-red-500 ml-1">{errors.cnic.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-semibold py-2.5 rounded-xl mt-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Log In <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-xs">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
