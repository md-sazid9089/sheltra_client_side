import { FaShieldAlt, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

export function NIDDocument({ nidData }) {
    if (!nidData) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* NID Card Container */}
            <div className="relative bg-gradient-to-br from-slate-900 via-cyan-900/40 to-teal-900/40 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* NID Card Content */}
                <div className="relative z-10 p-8 md:p-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-cyan-500/20">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
                                <FaShieldAlt className="text-cyan-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Sheltra Virtual NID</h2>
                                <p className="text-cyan-300 text-sm">Verified Identity Document</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${nidData.status === 'Verified'
                                ? 'bg-green-500/15 border border-green-500/30'
                                : 'bg-yellow-500/15 border border-yellow-500/30'
                            }`}>
                            <FaCheckCircle className={nidData.status === 'Verified' ? 'text-green-400' : 'text-yellow-400'} />
                            <span className={nidData.status === 'Verified' ? 'text-green-300 font-semibold' : 'text-yellow-300 font-semibold'}>
                                {nidData.status}
                            </span>
                        </div>
                    </div>

                    {/* NID Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* NID Number */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">NID Number</label>
                            <p className="text-2xl font-bold text-white font-mono break-words">{nidData.nidNumber}</p>
                        </div>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Full Name</label>
                            <p className="text-2xl font-bold text-white">{nidData.fullName}</p>
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Country of Origin</label>
                            <p className="text-xl font-semibold text-white">{nidData.country}</p>
                        </div>

                        {/* Email */}
                        {nidData.email && (
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Email Address</label>
                                <p className="text-white">{nidData.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Dates Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 rounded-xl bg-white/5 border border-cyan-500/10">
                        <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-cyan-400" size={20} />
                            <div>
                                <label className="text-xs uppercase tracking-wider text-cyan-400 font-semibold block">Generated Date</label>
                                <p className="text-white font-semibold">{formatDate(nidData.generatedAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-cyan-400" size={20} />
                            <div>
                                <label className="text-xs uppercase tracking-wider text-cyan-400 font-semibold block">Valid Until</label>
                                <p className="text-white font-semibold">{formatDate(nidData.expiryDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-cyan-500/20 pt-6 text-center">
                        <div className="space-y-2">
                            <p className="text-xs text-cyan-300">
                                This Virtual NID is issued by <span className="font-semibold">Sheltra</span> and verified by authorized NGO partners.
                            </p>
                            <p className="text-xs text-slate-400">
                                Document ID: {nidData.nidNumber} | Generated: {new Date(nidData.generatedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
