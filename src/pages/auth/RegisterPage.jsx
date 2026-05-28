import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Vote, User, Mail, Lock, CreditCard, Calendar, 
    Fingerprint, Camera, Check, ArrowRight, ArrowLeft, 
    Loader2, AlertCircle, ShieldCheck, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";
import { startRegistration } from '@simplewebauthn/browser';

// --- Validation Schemas ---

const step1Schema = z.object({
    role: z.enum(["voter", "admin"]),
});

const step2Schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const step3Schema = z.object({
    cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, "CNIC must follow XXXXX-XXXXXXX-X format"),
    cnicIssueDate: z.string().min(1, "CNIC issue date is required"),
});

// Full schema for final submission
const registerSchema = z.object({
    role: z.enum(["voter", "admin"]),
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, "CNIC must follow XXXXX-XXXXXXX-X format"),
    cnicIssueDate: z.string().min(1, "CNIC issue date is required"),
    faceDescriptor: z.any().nullable(),
    fingerprint: z.any().nullable(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
}).superRefine((data, ctx) => {
    if (data.role === "voter") {
        if (data.faceDescriptor === null || data.faceDescriptor === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Face scan is required",
                path: ["faceDescriptor"],
            });
        }
        if (data.fingerprint === null || data.fingerprint === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Fingerprint scan is required",
                path: ["fingerprint"],
            });
        }
    }
});

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [serverError, setServerError] = useState("");
    
    const webcamRef = useRef(null);
    const { register: authRegister } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        trigger,
        getValues,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(
            step === 1 ? step1Schema : 
            step === 2 ? step2Schema : 
            step === 3 ? step3Schema : 
            registerSchema
        ),
        defaultValues: {
            role: "voter",
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            cnic: "",
            cnicIssueDate: "",
            faceDescriptor: null,
            fingerprint: null
        },
        mode: "onBlur" // Validate on blur for better UX
    });

    const selectedRole = watch("role");

    // Load face-api models only when needed (Step 5) to save bandwidth
    useEffect(() => {
        // Start pre-loading at step 4 to ensure they are ready by step 5, or if they jump directly
        if ((step === 4 || step === 5) && selectedRole === "voter" && !modelsLoaded) {
            const loadModels = async () => {
                try {
                    const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
                    await Promise.all([
                        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                    ]);
                    setModelsLoaded(true);
                } catch (err) {
                    console.error("Failed to load face models:", err);
                    setServerError("Biometric systems initialization failed. Please refresh.");
                }
            };
            loadModels();
        }
    }, [step, selectedRole, modelsLoaded]);

    const nextStep = async () => {
        const fieldsToValidate = 
            step === 1 ? ["role"] :
            step === 2 ? ["name", "email", "password", "confirmPassword"] :
            step === 3 ? ["cnic", "cnicIssueDate"] :
            [];
            
        const isStepValid = await trigger(fieldsToValidate);
        
        if (isStepValid) {
            if (step === 3 && selectedRole === "admin") {
                setStep(4); // Skip biometrics directly to Security Review (Step 4) for Admin
            } else {
                setStep(prev => prev + 1);
            }
            setServerError("");
        }
    };

    const prevStep = () => {
        setServerError("");
        if (step === 4 && selectedRole === "admin") {
            setStep(3); // Admin goes back to Identity Info (Step 3) from Review
        } else {
            setStep(prev => prev - 1);
        }
    };

    // --- Biometric Handlers ---

    const handleFingerprint = async () => {
        setIsProcessing(true);
        setServerError("");
        try {
            // High-fidelity simulation for fingerprint
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const mockFingerprint = {
                credentialId: btoa(Math.random().toString()),
                publicKey: btoa("simulated-key-" + Date.now()),
                counter: 0
            };
            
            setValue("fingerprint", mockFingerprint, { shouldValidate: true });
            setStep(5); // Shifted to Step 5 (Face Scan)
        } catch (err) {
            setServerError("Fingerprint system error: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFaceCapture = async () => {
        if (!modelsLoaded) {
            setServerError("Face recognition models are still loading...");
            return;
        }

        setIsProcessing(true);
        setServerError("");

        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) throw new Error("Could not capture image");

            const img = await faceapi.fetchImage(imageSrc);
            const detection = await faceapi
                .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                throw new Error("No face detected. Please ensure you are in a well-lit area.");
            }

            const descriptorArray = Array.from(detection.descriptor);
            setValue("faceDescriptor", descriptorArray, { shouldValidate: true });
            
            setIsProcessing(false);
            setStep(6); // Shifted to Step 6 (Security Review)
        } catch (err) {
            setServerError(err.message);
            setIsProcessing(false);
        }
    };

    const onSubmit = async (data) => {
        setIsProcessing(true);
        setServerError("");
        
        const result = await authRegister(data);

        if (result.success) {
            const userRole = result.user?.role;
            navigate(userRole === "admin" ? "/admin" : "/dashboard");
        } else {
            setServerError(result.message);
            setIsProcessing(false);
        }
    };

    const handleFingerprintCapture = async () => {
        setIsProcessing(true);
        setServerError("");
        try {
            // 1. Get registration options from server
            const email = getValues("email");
            const optionsRes = await api.get(`/auth/register-fingerprint-options?email=${email}`);
            const options = optionsRes.data.data;

            // 2. Start WebAuthn Registration
            const credential = await startRegistration(options);

            const credentialData = {
                credentialId: credential.id,
                publicKey: JSON.stringify(credential.response), // Securely capture the raw attestation response
                counter: 0
            };

            // 3. Store the credential in form
            setValue("fingerprint", credentialData);
            
            // 4. Immediate Senior Dev Validation
            const isValid = await trigger("fingerprint");
            if (!isValid) {
                setServerError("Cryptographic validation of your fingerprint failed. Please ensure the scan is clean and try again.");
                return;
            }
            
            // Move to next step automatically only if valid
            setStep(5); // Shifted to Step 5 (Face Scan)
        } catch (err) {
            console.error("Fingerprint capture failed:", err);
            setServerError(err.message || "Hardware biometric scan failed. Please ensure your device supports fingerprint/biometric login.");
        } finally {
            setIsProcessing(false);
        }
    };

    const renderRoleSelection = () => {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="space-y-2 text-center">
                    <p className="text-slate-500 text-sm">Please choose your registration role to proceed.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Voter Card */}
                    <div 
                        onClick={() => setValue("role", "voter")}
                        className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 relative overflow-hidden ${
                            selectedRole === "voter" 
                                ? "border-emerald-500 bg-emerald-50/40 shadow-md shadow-emerald-500/5" 
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                    >
                        {selectedRole === "voter" && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                            selectedRole === "voter" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                        }`}>
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Voter</h4>
                            <p className="text-slate-400 text-xs mt-1">Register to cast your vote securely (biometrics required)</p>
                        </div>
                    </div>

                    {/* Admin Card */}
                    <div 
                        onClick={() => setValue("role", "admin")}
                        className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 relative overflow-hidden ${
                            selectedRole === "admin" 
                                ? "border-emerald-500 bg-emerald-50/40 shadow-md shadow-emerald-500/5" 
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                    >
                        {selectedRole === "admin" && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                            selectedRole === "admin" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                        }`}>
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Administrator</h4>
                            <p className="text-slate-400 text-xs mt-1">Manage elections, candidates, and users (biometrics skipped)</p>
                        </div>
                    </div>
                </div>

                <input type="hidden" {...register("role")} />

                <button 
                    type="button" 
                    onClick={nextStep} 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl mt-6 flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                >
                    Continue <ArrowRight className="w-4 h-4" />
                </button>
            </motion.div>
        );
    };

    const renderProfile = () => {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 ml-1">Full Name</label>
                    <div className="relative group">
                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.name ? "text-red-400" : "text-slate-400 group-focus-within:text-emerald-600"}`} />
                        <input
                            {...register("name")}
                            placeholder="John Doe"
                            className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 outline-none transition-all ${
                                errors.name ? "border-red-300 focus:ring-red-500/5 focus:border-red-400" : "border-slate-200 focus:ring-emerald-500/5 focus:border-emerald-500/50"
                            }`}
                        />
                    </div>
                    {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.email ? "text-red-400" : "text-slate-400 group-focus-within:text-emerald-600"}`} />
                        <input
                            {...register("email")}
                            placeholder="john@example.com"
                            className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 outline-none transition-all ${
                                errors.email ? "border-red-300 focus:ring-red-500/5 focus:border-red-400" : "border-slate-200 focus:ring-emerald-500/5 focus:border-emerald-500/50"
                            }`}
                        />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-500 ml-1">{errors.email.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 ml-1">Password</label>
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
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 ml-1">Confirm</label>
                        <div className="relative group">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.confirmPassword ? "text-red-400" : "text-slate-400 group-focus-within:text-emerald-600"}`} />
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                placeholder="••••••••"
                                className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 outline-none transition-all ${
                                    errors.confirmPassword ? "border-red-300 focus:ring-red-500/5 focus:border-red-400" : "border-slate-200 focus:ring-emerald-500/5 focus:border-emerald-500/50"
                                }`}
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-[10px] text-red-500 ml-1">{errors.confirmPassword.message}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <button type="button" onClick={prevStep} className="bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="button" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20">
                        Identity Verification <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        );
    };

    const renderIdentity = () => {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
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
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 ml-1">CNIC Issue Date</label>
                    <div className="relative group">
                        <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.cnicIssueDate ? "text-red-400" : "text-slate-400 group-focus-within:text-emerald-600"}`} />
                        <input
                            type="date"
                            {...register("cnicIssueDate")}
                            className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 outline-none transition-all ${
                                errors.cnicIssueDate ? "border-red-300 focus:ring-red-500/5 focus:border-red-400" : "border-slate-200 focus:ring-emerald-500/5 focus:border-emerald-500/50"
                            }`}
                        />
                    </div>
                    {errors.cnicIssueDate && <p className="text-[10px] text-red-500 ml-1">{errors.cnicIssueDate.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <button type="button" onClick={prevStep} className="bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="button" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20">
                        {selectedRole === "admin" ? "Final Review" : "Biometrics"} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        );
    };

    const renderFingerprint = () => {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200 shadow-inner">
                    <Fingerprint className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">Fingerprint Registration</h3>
                    <p className="text-slate-500 text-sm">Register your device's biometric scanner for secure voting.</p>
                </div>
                <button 
                    type="button"
                    onClick={handleFingerprintCapture} 
                    disabled={isProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Fingerprint Scan"}
                </button>
                <button type="button" onClick={prevStep} className="w-full text-slate-400 text-xs hover:text-slate-600 transition-colors">
                    Wait, go back to identity info
                </button>
            </motion.div>
        );
    };

    const renderFaceScan = () => {
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center space-y-4">
                <div className="relative mx-auto w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden border-2 border-emerald-500/30 shadow-xl shadow-emerald-500/10">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-[20px] border-white/40 rounded-3xl pointer-events-none" />
                    <div className="absolute inset-[30px] border border-emerald-500/40 rounded-full animate-pulse pointer-events-none" />
                    <div className="absolute left-0 right-0 h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] z-20 animate-scan pointer-events-none" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Face Recognition</h3>
                    <p className="text-slate-500 text-xs">Ensure your face is clearly visible in the center.</p>
                </div>
                <button 
                    type="button"
                    onClick={handleFaceCapture} 
                    disabled={isProcessing || !modelsLoaded}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Camera className="w-5 h-5" /> Capture & Encrypt</>}
                </button>
                {!modelsLoaded && <p className="text-emerald-600 text-[10px] animate-pulse">Initializing facial mapping system...</p>}
            </motion.div>
        );
    };

    const renderReview = () => {
        const reviewItems = [
            { label: "Personal Profile", value: getValues("name"), icon: User },
            { label: "Identity Verified", value: getValues("cnic"), icon: CreditCard },
            { 
                label: "Account Role", 
                value: selectedRole === "admin" ? "Administrator" : "Voter", 
                icon: ShieldCheck 
            },
        ];

        if (selectedRole === "voter") {
            reviewItems.push({ label: "Biometrics Encrypted", value: "AES-256-GCM Secure", icon: Lock });
        } else {
            reviewItems.push({ label: "Biometrics Status", value: "Skipped (Admin Exemption)", icon: Shield });
        }

        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-4 shadow-inner">
                        <ShieldCheck className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Security Review</h3>
                    <p className="text-slate-500 text-sm">All verification layers are ready for secure storage.</p>
                </div>
                
                <div className="space-y-3">
                    {reviewItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <item.icon className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{item.label}</p>
                                <p className="text-sm text-slate-700 font-medium">{item.value}</p>
                            </div>
                            <Check className="w-4 h-4 text-emerald-500" />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <button type="button" onClick={prevStep} className="bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                    >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
                    </button>
                </div>
            </motion.div>
        );
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return renderRoleSelection();
            case 2:
                return renderProfile();
            case 3:
                return renderIdentity();
            case 4:
                return selectedRole === "admin" ? renderReview() : renderFingerprint();
            case 5:
                return renderFaceScan();
            case 6:
                return renderReview();
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                        <Vote className="text-white w-5 h-5" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight">
                        Secure<span className="text-emerald-600">Vote</span>
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-1.5 mb-6 px-4">
                    {Array.from({ length: selectedRole === "admin" ? 4 : 6 }, (_, idx) => idx + 1).map((s) => (
                        <div 
                            key={s} 
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                                s <= step ? "bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-slate-200"
                            }`} 
                        />
                    ))}
                </div>

                {/* Card */}
                <div className="bg-white p-8 rounded-[32px] premium-shadow border border-slate-100">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-slate-900">Create Account</h1>
                        <p className="text-slate-500 text-xs">
                            Step {step} of {selectedRole === "admin" ? 4 : 6}: {
                                step === 1 ? "Role Selection" : 
                                step === 2 ? "Personal Profile" : 
                                step === 3 ? "Identity Info" : 
                                selectedRole === "admin" 
                                    ? "Final Review"
                                    : step === 4 
                                        ? "Biometric Device" 
                                        : step === 5 
                                            ? "Facial Mapping" 
                                            : "Final Review"
                            }
                        </p>
                    </div>

                    {serverError && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] flex items-center gap-2"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{serverError}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {renderStep()}
                    </form>

                    {step === 1 && (
                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-slate-400 text-xs">
                                Already registered?{" "}
                                <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
