import React, { useRef, useEffect, useState } from 'react';
import { 
    Camera, ShieldCheck, Loader2, 
    X, AlertCircle, Fingerprint,
    CheckCircle2, RefreshCcw, ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from 'face-api.js';

export default function BiometricScanner({ onVerified, onCancel, userProfile }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [status, setStatus] = useState('initializing'); // initializing, active, scanning, verifying, success, error
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
                startCamera();
            } catch (err) {
                console.error("Failed to load face models:", err);
                setError("Neural mapping models failed to load. Please refresh.");
                setStatus('error');
            }
        };
        loadModels();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            setStatus('initializing');
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStatus('active');
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError("Camera access denied. Please ensure your camera is connected and permitted.");
            setStatus('error');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    const handleScan = () => {
        setStatus('scanning');
        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                handleVerify();
            }
        }, 50);
    };

    const handleVerify = async () => {
        setStatus('verifying');
        
        try {
            if (!videoRef.current) throw new Error("Lens stream unavailable");

            // Extract the true mathematical biometric descriptor from the live feed
            const detection = await faceapi.detectSingleFace(
                videoRef.current, 
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceDescriptor();

            if (!detection) {
                setError("No face detected. Please ensure you are centered in the frame with good lighting.");
                setStatus('error');
                return;
            }

            const liveDescriptor = Array.from(detection.descriptor);

            setStatus('success');
            setTimeout(() => {
                onVerified(liveDescriptor);
            }, 1500);

        } catch (err) {
            console.error("Biometric extraction failed:", err);
            setError("Failed to extract neural map. Please try again.");
            setStatus('error');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
        >
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />
            
            <div className="relative w-full max-w-2xl bg-slate-900 rounded-[56px] border border-white/10 overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-8 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                            <Fingerprint className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase tracking-widest text-xs">Biometric Identity Verification</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{status}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onCancel}
                        className="p-3 hover:bg-white/5 rounded-2xl text-slate-400 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scanner Area */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
                    {status === 'initializing' && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Waking up secure lens...</p>
                        </div>
                    )}

                    <video 
                        ref={videoRef} 
                        autoPlay 
                        muted 
                        playsInline
                        className={`w-full h-full object-cover transition-opacity duration-1000 ${
                            status === 'initializing' ? 'opacity-0' : 'opacity-100'
                        }`}
                    />

                    {/* Scanning Overlays */}
                    <AnimatePresence>
                        {(status === 'active' || status === 'scanning') && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 pointer-events-none"
                            >
                                {/* Face Frame */}
                                <div className="absolute inset-0 border-[60px] border-slate-950/40" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-2 border-emerald-500/30 rounded-full" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border-4 border-dashed border-white/10 rounded-full animate-spin-slow" />
                                
                                {status === 'scanning' && (
                                    <motion.div 
                                        initial={{ top: '25%' }}
                                        animate={{ top: '75%' }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="absolute left-1/2 -translate-x-1/2 w-[300px] h-1 bg-emerald-500 shadow-[0_0_20px_#10b981] z-20"
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Success Overlay */}
                    <AnimatePresence>
                        {status === 'success' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-emerald-600/90 flex flex-col items-center justify-center text-white backdrop-blur-sm"
                            >
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 10 }}
                                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                                </motion.div>
                                <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Identity Verified</h3>
                                <p className="text-emerald-100 font-bold text-xs uppercase tracking-widest opacity-80">Access Granted to Ballot Box</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Verifying Overlay */}
                    <AnimatePresence>
                        {status === 'verifying' && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white backdrop-blur-md"
                            >
                                <div className="relative">
                                    <Loader2 className="w-20 h-20 animate-spin text-emerald-500" />
                                    <ScanLine className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black mt-8 mb-2 tracking-tight">Cross-Referencing Credentials</h3>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">Checking Neural Database...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error State */}
                    {status === 'error' && (
                        <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/20">
                                <AlertCircle className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Lens Obstruction</h3>
                            <p className="text-red-200 text-sm font-medium mb-8 max-w-xs">{error}</p>
                            <button 
                                onClick={startCamera}
                                className="px-8 py-4 bg-white text-red-600 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-100"
                            >
                                <RefreshCcw className="w-5 h-5" /> Retry Access
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-10 bg-slate-900/50 flex flex-col items-center gap-6">
                    {status === 'active' && (
                        <button 
                            onClick={handleScan}
                            className="w-full max-w-sm py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl font-black shadow-2xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            <Camera className="w-6 h-6" /> Initiate Facial Scan
                        </button>
                    )}

                    {status === 'scanning' && (
                        <div className="w-full max-w-md">
                            <div className="flex justify-between items-end mb-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Mapping Progress</p>
                                <p className="text-emerald-500 font-black text-xs">{progress}%</p>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            Identity check required for Seat: <span className="text-white">{userProfile?.seat || "Official Election"}</span>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin-slow {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </motion.div>
    );
}
