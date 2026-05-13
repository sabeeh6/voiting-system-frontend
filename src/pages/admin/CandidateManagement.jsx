import React, { useState, useEffect } from "react";
import { 
    Plus, Search, Edit2, Trash2, 
    MoreVertical, User, MapPin, 
    Flag, FileText, Loader2, 
    AlertCircle, CheckCircle2, X,
    ArrowLeft, ArrowRight, Trash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../lib/api";

// --- Validation Schema ---
const candidateSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    party: z.string().min(2, "Party name is required"),
    seat: z.string().min(2, "Seat/Constituency is required"),
    age: z.string().transform((val) => parseInt(val, 10)).pipe(
        z.number().min(25, "Candidate must be at least 25 years old").max(100, "Invalid age")
    ),
    manifesto: z.string().min(10, "Manifesto must be at least 10 characters"),
});

export default function CandidateManagement() {
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    
    // --- Selection State ---
    const [selectedIds, setSelectedIds] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            name: "",
            party: "",
            seat: "",
            age: "",
            manifesto: ""
        }
    });

    // Fetch Candidates
    const fetchCandidates = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/candidates");
            if (response.data.success) {
                setCandidates(response.data.data);
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to fetch candidates" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    // Handle Selection
    const toggleSelectAll = () => {
        if (selectedIds.length === currentItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(currentItems.map(c => c._id));
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // Handle Bulk Delete
    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} candidates?`)) return;
        
        setIsSubmitting(true);
        try {
            const response = await api.post("/candidates/bulk-delete", { ids: selectedIds });
            if (response.data.success) {
                setMessage({ type: "success", text: `${selectedIds.length} candidates removed` });
                setCandidates(candidates.filter(c => !selectedIds.includes(c._id)));
                setSelectedIds([]);
            }
        } catch (error) {
            setMessage({ type: "error", text: "Bulk delete failed" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Create/Update
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setMessage({ type: "", text: "" });
        try {
            if (editingCandidate) {
                const response = await api.patch(`/candidates/${editingCandidate._id}`, data);
                if (response.data.success) {
                    setMessage({ type: "success", text: "Candidate updated successfully" });
                    fetchCandidates();
                    closeModal();
                }
            } else {
                const response = await api.post("/candidates/add", data);
                if (response.data.success) {
                    setMessage({ type: "success", text: "Candidate added successfully" });
                    fetchCandidates();
                    closeModal();
                }
            }
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || "Operation failed" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this candidate?")) return;
        
        try {
            const response = await api.delete(`/candidates/${id}`);
            if (response.data.success) {
                setMessage({ type: "success", text: "Candidate removed" });
                setCandidates(candidates.filter(c => c._id !== id));
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete candidate" });
        }
    };

    const openModal = (candidate = null) => {
        if (candidate) {
            setEditingCandidate(candidate);
            setValue("name", candidate.name);
            setValue("party", candidate.party);
            setValue("seat", candidate.seat);
            setValue("age", candidate.age.toString());
            setValue("manifesto", candidate.manifesto);
        } else {
            setEditingCandidate(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCandidate(null);
        reset();
    };

    const filteredCandidates = candidates.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.seat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Pagination Logic ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCandidates.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to page 1 when searching
    useEffect(() => {
        setCurrentPage(1);
        setSelectedIds([]); // Clear selection on search
    }, [searchTerm]);

    // Clear selection on page change
    useEffect(() => {
        setSelectedIds([]);
    }, [currentPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="space-y-8 pb-24"> {/* Added padding for Floating Bar */}
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Candidate Management</h1>
                    <p className="text-slate-500">Add, edit, or remove candidates from the electoral system.</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Add Candidate
                </button>
            </div>

            {/* Notifications */}
            <AnimatePresence>
                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 rounded-2xl flex items-center gap-3 ${
                            message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                        }`}
                    >
                        {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="text-sm font-medium">{message.text}</span>
                        <button onClick={() => setMessage({ type: "", text: "" })} className="ml-auto">
                            <X className="w-4 h-4 opacity-50 hover:opacity-100" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 premium-shadow flex items-center gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by name, party or seat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Candidate Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 premium-shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="pl-8 py-5 w-12">
                                    <input 
                                        type="checkbox"
                                        checked={currentItems.length > 0 && selectedIds.length === currentItems.length}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 rounded-lg accent-emerald-600 cursor-pointer"
                                    />
                                </th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Candidate Info</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Seat / Constituency</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Party</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-4" />
                                        <p className="text-slate-400 text-sm">Loading candidates...</p>
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <User className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 text-sm">No candidates found.</p>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((candidate) => (
                                    <motion.tr 
                                        key={candidate._id} 
                                        className={`transition-all group relative border-l-4 border-l-transparent hover:border-l-emerald-700 cursor-default ${
                                            selectedIds.includes(candidate._id) ? "bg-emerald-50/50 border-l-emerald-600" : "hover:bg-emerald-100/40"
                                        }`}
                                    >
                                        <td className="pl-8 py-5">
                                            <input 
                                                type="checkbox"
                                                checked={selectedIds.includes(candidate._id)}
                                                onChange={() => toggleSelect(candidate._id)}
                                                className="w-5 h-5 rounded-lg accent-emerald-600 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-600/10">
                                                    {candidate.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{candidate.name}</p>
                                                    <p className="text-xs text-slate-500">Age: {candidate.age}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <MapPin className="w-4 h-4 text-emerald-500" />
                                                <span className="text-sm font-medium">{candidate.seat}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                                                    {candidate.party}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => openModal(candidate)}
                                                    className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all border border-slate-100"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(candidate._id)}
                                                    className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all border border-slate-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <p className="text-xs text-slate-500">
                            Showing <span className="font-bold text-slate-900">{indexOfFirstItem + 1}</span> to <span className="font-bold text-slate-900">{Math.min(indexOfLastItem, filteredCandidates.length)}</span> of <span className="font-bold text-slate-900">{filteredCandidates.length}</span> candidates
                        </p>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                        currentPage === i + 1 
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                                        : "hover:bg-white text-slate-500 border border-transparent hover:border-slate-200"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Action Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-8 py-4 rounded-[32px] shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-sm">
                                {selectedIds.length}
                            </div>
                            <span className="text-sm font-medium text-slate-300">Candidates Selected</span>
                        </div>
                        
                        <div className="w-px h-6 bg-white/10" />
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleBulkDelete}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all font-bold text-sm disabled:opacity-50"
                            >
                                <Trash className="w-4 h-4" /> Bulk Delete
                            </button>
                            <button 
                                onClick={() => setSelectedIds([])}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 text-slate-300 rounded-xl transition-all font-bold text-sm"
                            >
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal for Add/Edit */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
                                    </h2>
                                    <p className="text-slate-500 text-sm">Fill in the official electoral details.</p>
                                </div>
                                <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600" />
                                            <input 
                                                {...register("name")}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all"
                                                placeholder="Candidate Name"
                                            />
                                        </div>
                                        {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name.message}</p>}
                                    </div>
                                    {/* Age */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Age</label>
                                        <input 
                                            type="number"
                                            {...register("age")}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all"
                                            placeholder="25+"
                                        />
                                        {errors.age && <p className="text-[10px] text-red-500 ml-1">{errors.age.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    {/* Party */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Political Party</label>
                                        <div className="relative group">
                                            <Flag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600" />
                                            <input 
                                                {...register("party")}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all"
                                                placeholder="e.g. PTI, PMLN, PPP"
                                            />
                                        </div>
                                        {errors.party && <p className="text-[10px] text-red-500 ml-1">{errors.party.message}</p>}
                                    </div>
                                    {/* Seat */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 ml-1">Seat / Constituency</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600" />
                                            <input 
                                                {...register("seat")}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all"
                                                placeholder="e.g. NA-125"
                                            />
                                        </div>
                                        {errors.seat && <p className="text-[10px] text-red-500 ml-1">{errors.seat.message}</p>}
                                    </div>
                                </div>

                                {/* Manifesto */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Manifesto / Mission</label>
                                    <div className="relative group">
                                        <FileText className="absolute left-3 top-4 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600" />
                                        <textarea 
                                            {...register("manifesto")}
                                            rows="4"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 outline-none transition-all resize-none"
                                            placeholder="Describe the candidate's goals and vision..."
                                        />
                                    </div>
                                    {errors.manifesto && <p className="text-[10px] text-red-500 ml-1">{errors.manifesto.message}</p>}
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-bold py-3 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingCandidate ? "Save Changes" : "Add Candidate"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
