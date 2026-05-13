import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    ShieldCheck, User, Flag, 
    CheckCircle2, AlertCircle, 
    Loader2, ArrowLeft, Send,
    Fingerprint, Lock, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/api";

export default function BallotSubmission() {
    const { electionId } = useParams();
    const navigate = useNavigate();
    
    const [election, setElection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchElectionDetails = async () => {
            try {
                // We need a specific endpoint for election details or use the list
                const response = await api.get("/elections");
                const found = response.data.data.find(e => e._id === electionId);
                if (found) {
                    setElection(found);
                } else {
                    setMessage({ type: "error", text: "Election not found" });
                }
            } catch (error) {
                setMessage({ type: "error", text: "Failed to load election details" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchElectionDetails();
    }, [electionId]);

    const handleCastVote = async () => {
        if (!selectedCandidate) return;
        
        setIsSubmitting(true);
        try {
            const response = await api.post("/votes/cast", { 
                candidateId: selectedCandidate._id 
            });
            
            if (response.data.success) {
                setMessage({ type: "success", text: "Your vote has been recorded securely!" });
                setTimeout(() => navigate("/dashboard/elections"), 3000);
            }
        } catch (error) {
            setMessage({ 
                type: "error", 
                text: error.response?.data?.message || "Voting failed. Please try again." 
            });
            setShowConfirm(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Secure Ballot...</p>
            </div>
        );
    }

    if (!election) {
        return (
            <div className="text-center py-20">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Invalid Session</h2>
                <button onClick={() => navigate("/dashboard/elections")} className="text-emerald-600 font-bold hover:underline">Return to Elections</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-24">
            {/* Security Header */}
            <div className="bg-emerald-600 rounded-[48px] p-10 text-white shadow-2xl shadow-emerald-600/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="relative z-10">
                    <button 
                        onClick={() => navigate("/dashboard/elections")}
                        className="flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    <div className="flex items-start justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                <ShieldCheck className="w-4 h-4" /> End-to-End Encrypted Ballot
                            </div>
                            <h1 className="text-4xl font-black mb-2 tracking-tight">{election.title}</h1>
                            <p className="text-emerald-100 font-medium opacity-90 max-w-xl">
                                Seat: <span className="font-black underline">{election.seat}</span> • Official voting window is currently active. 
                                Select your preferred candidate below.
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col items-center gap-2 bg-white/10 p-6 rounded-[32px] backdrop-blur-md border border-white/20">
                            <Lock className="w-8 h-8 text-white/60" />
                            <span className="text-[10px] font-black uppercase text-center tracking-tighter">Secure<br/>Submission</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-6 rounded-[32px] flex items-center gap-4 border-2 ${
                            message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                        }`}
                    >
                        {message.type === "success" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        <p className="font-bold">{message.text}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Candidate Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {election.candidates.map((candidate) => (
                    <motion.div 
                        key={candidate._id}
                        whileHover={{ y: -4 }}
                        onClick={() => setSelectedCandidate(candidate)}
                        className={`group relative p-8 rounded-[48px] border-4 transition-all duration-300 cursor-pointer overflow-hidden ${
                            selectedCandidate?._id === candidate._id 
                            ? "bg-white border-emerald-500 shadow-2xl shadow-emerald-500/10" 
                            : "bg-white border-slate-50 hover:border-slate-200"
                        }`}
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center text-3xl font-black transition-all ${
                                selectedCandidate?._id === candidate._id 
                                ? "bg-emerald-600 text-white" 
                                : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                            }`}>
                                {candidate.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-2xl font-black text-slate-900 truncate mb-1">{candidate.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {candidate.party}
                                    </span>
                                </div>
                            </div>
                            {selectedCandidate?._id === candidate._id && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Action Bar */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6">
                <div className="bg-slate-900 p-4 rounded-[32px] shadow-2xl border border-white/10 flex items-center justify-between gap-4 backdrop-blur-xl">
                    <div className="pl-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Choice</p>
                        <p className="text-white font-bold truncate max-w-[150px]">
                            {selectedCandidate ? selectedCandidate.name : "None"}
                        </p>
                    </div>
                    <button 
                        disabled={!selectedCandidate || isSubmitting}
                        onClick={() => setShowConfirm(true)}
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-[24px] font-black text-sm transition-all flex items-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-95"
                    >
                        <Send className="w-5 h-5" /> Proceed to Verify
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative bg-white w-full max-w-md rounded-[56px] p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Fingerprint className="w-10 h-10 text-amber-500" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight text-balance">Final Confirmation</h2>
                                <div className="p-6 bg-slate-50 rounded-[32px] border-2 border-slate-100 mb-6">
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Voting for candidate</p>
                                    <p className="text-2xl font-black text-emerald-600 mb-1">{selectedCandidate.name}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase">{selectedCandidate.party}</p>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 mb-8">
                                    <Info className="w-5 h-5 shrink-0" />
                                    <p className="text-left text-[10px] font-bold leading-tight uppercase tracking-tight">
                                        This action is permanent. Once submitted, your vote cannot be changed or revoked.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={handleCastVote}
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black shadow-2xl shadow-slate-900/30 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Authorize & Submit Vote"}
                                </button>
                                <button 
                                    onClick={() => setShowConfirm(false)}
                                    className="w-full py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[24px] font-black transition-all"
                                >
                                    Review Selection
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
