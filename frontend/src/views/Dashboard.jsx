import { useState } from 'react';
import { api } from '../api/apiClient';
import LeadCard from '../components/LeadCard';

export default function Dashboard({ leadsData, setLeadsData, setIsGlobalLoading }) {
    const [error, setError] = useState("");
    const [totalAvailable, setTotalAvailable] = useState(12);

    const handleProcessChunk = async () => {
        setIsGlobalLoading(true);
        setError("");
        try {
            // Figure out how many leads are already on the screen
            const currentCount = leadsData ? leadsData.length : 0;
            
            // Ask the backend for the next 3 leads
            const response = await api.processBatchLeads(currentCount, 3);
            
            setTotalAvailable(response.total_available);

            if (leadsData) {
                // If we already have cards, add the new ones to the bottom
                setLeadsData([...leadsData, ...response.briefs]);
            } else {
                // If the screen is empty, just show the first 3
                setLeadsData(response.briefs);
            }
        } catch (err) {
            setError(err.message || "Failed to process leads. Please try again.");
        } finally {
            setIsGlobalLoading(false);
        }
    };

    const handleReset = () => {
        setLeadsData(null);
        setError("");
    };

    // --- SCREEN 1: THE EMPTY INBOX (Start Screen) ---
    if (!leadsData) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-lg text-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Inbox is Pending</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        You have unread inbound inquiries. Process them in batches of 3 to safely extract constraints and query the MLS.
                    </p>
                    <button 
                        onClick={handleProcessChunk}
                        className="w-full bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        Process First 3 Leads
                    </button>
                </div>
            </div>
        );
    }

    // Check if we have loaded all available leads
    const isComplete = leadsData.length >= totalAvailable;

    // --- SCREEN 2: THE POPULATED DASHBOARD ---
    return (
        <div className="space-y-8 animate-fade-in-up pb-12">
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Processed Lead Briefs</h2>
                    <p className="text-slate-500 mt-1">Showing {leadsData.length} of {totalAvailable} leads.</p>
                </div>
                <button 
                    onClick={handleReset}
                    className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                    Reset Dashboard
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            {/* RENDER THE CARDS */}
            <div className="grid grid-cols-1 gap-8">
                {leadsData.map((brief, index) => (
                    <LeadCard key={index} brief={brief} />
                ))}
            </div>

            {/* THE "NEXT 3" BUTTON (Hides when 12 are loaded) */}
            {!isComplete && (
                <div className="flex justify-center mt-12 pt-8 border-t border-slate-200">
                    <button 
                        onClick={handleProcessChunk}
                        className="bg-indigo-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-xl flex items-center justify-center gap-3"
                    >
                        Process Next 3 Leads
                    </button>
                </div>
            )}

            {/* SUCCESS BADGE (Shows when 12 are loaded) */}
            {isComplete && (
                <div className="text-center mt-12 pt-8 border-t border-slate-200">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-6 py-3 rounded-full text-sm inline-flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        All 12 Leads Processed Successfully
                    </span>
                </div>
            )}
        </div>
    );
}