//import { useState } from 'react';

export default function LeadCard({ brief }) {
    const { 
        buyer_name, lead_id, buyer_summary, extracted_constraints, 
        recommended_properties, security_flag, realtor_context_and_concerns, action_plan 
    } = brief;

    // Helper to format currency
    const formatCurrency = (amount) => {
        if (!amount) return "Not specified";
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            {/* Header Area */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-slate-900">{buyer_name}</h3>
                        <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">{lead_id}</span>
                    </div>
                    <p className="text-slate-600 text-sm mt-2 max-w-3xl">{buyer_summary}</p>
                </div>
                
                {security_flag && (
                    <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-200 font-bold text-sm shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Security Alert Detected
                    </div>
                )}
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: Constraints & Warnings */}
                <div className="space-y-6 lg:col-span-1">
                    
                    {realtor_context_and_concerns && (
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                            <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-1">Realtor Context & Concerns</h4>
                            <p className="text-sm text-amber-900 leading-relaxed">{realtor_context_and_concerns}</p>
                        </div>
                    )}

                    <div>
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Extracted Constraints</h4>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 text-sm">
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Max Budget</span>
                                <span className="font-bold text-slate-900">{formatCurrency(extracted_constraints?.budget_max)}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Min Bedrooms</span>
                                <span className="font-bold text-slate-900">{extracted_constraints?.bedrooms_min || "Any"}</span>
                            </div>
                            <div className="flex flex-col gap-1 border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Locations</span>
                                <span className="font-bold text-slate-900">
                                    {extracted_constraints?.preferred_locations?.length > 0 ? extracted_constraints.preferred_locations.join(", ") : "Open"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500">Must Haves</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {extracted_constraints?.must_haves?.length > 0 ? (
                                        extracted_constraints.must_haves.map((item, idx) => (
                                            <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md font-medium">
                                                {item}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="font-bold text-slate-900">None specified</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MIDDLE & RIGHT COLUMN: Matches & Actions */}
                <div className="space-y-6 lg:col-span-2">
                    
                    {/* RECOMMENDED PROPERTIES */}
                    <div>
                        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Recommended Properties ({recommended_properties?.length || 0})</h4>
                        <div className="space-y-3">
                            {recommended_properties && recommended_properties.length > 0 ? (
                                recommended_properties.map((prop, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h5 className="font-bold text-slate-900">{prop.address}</h5>
                                                <span className="text-xs text-slate-500">MLS: {prop.mls_number}</span>
                                            </div>
                                            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm">
                                                {formatCurrency(prop.price)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-2">
                                            <span className="font-semibold text-slate-800">Why it matches: </span>
                                            {prop.reasoning}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-slate-50 p-6 rounded-lg text-center border border-dashed border-slate-300 text-slate-500 text-sm">
                                    No suitable properties found in the current MLS active inventory matching these constraints.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ACTION PLAN */}
                    {action_plan && (
                        <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 mt-6">
                            <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider mb-3">Suggested Next Action</h4>
                            
                            {action_plan.market_friction_warning && (
                                <p className="text-sm font-medium text-rose-600 mb-3 bg-white p-2 rounded border border-rose-100">
                                    ⚠️ {action_plan.market_friction_warning}
                                </p>
                            )}

                            <div className="bg-white rounded-lg p-4 border border-indigo-200">
                                <p className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                                    {action_plan.suggested_next_action}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}