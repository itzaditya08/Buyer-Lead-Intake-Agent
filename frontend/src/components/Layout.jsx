export default function Layout({ children, isGlobalLoading }) {
    return (
        <div className="min-h-screen flex flex-col relative font-sans bg-slate-50 text-slate-800">
            
            {/* GLOBAL LOADING OVERLAY */}
            {isGlobalLoading && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center transition-all">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-md w-full mx-4 border border-slate-100 animate-fade-in-up text-center">
                        <div className="loader w-10 h-10 mb-5 border-t-indigo-600 border-4 rounded-full animate-spin"></div>
                        <h3 className="text-xl font-bold text-slate-800">AgentMira AI is Processing</h3>
                        <p className="text-slate-500 font-medium text-sm mt-2">
                            Ingesting inbox, applying security guardrails, scanning MLS data, and generating Lead Briefs...
                        </p>
                        <p className="text-xs text-slate-400 mt-4">(This may take a few seconds)</p>
                    </div>
                </div>
            )}

            {/* STICKY FROSTED HEADER */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 transition-all">
                <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl shadow-md flex items-center justify-center">
                            {/* Real Estate / AI Icon */}
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Agent<span className="text-indigo-600">Mira</span>
                        </h1>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                            Realtor Workspace
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center py-8 px-4 md:px-8">
                <div className={`w-full max-w-7xl relative ${isGlobalLoading ? 'pointer-events-none' : ''}`}>
                    {children}
                </div>
            </main>

            <footer className="text-center py-6 text-slate-400 text-sm font-medium">
                &copy; 2026 AgentMira Inc. Built for Engineering Case Study.
            </footer>
        </div>
    );
}