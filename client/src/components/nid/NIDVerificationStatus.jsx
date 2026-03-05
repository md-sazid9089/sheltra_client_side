import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ActionButton from '@/components/ui/ActionButton';

export function NIDVerificationStatus({ status, nidData, onSimulateVerification, onReset, error }) {
    if (status === 'idle' || status === 'submitted') {
        return null; // Form is shown instead
    }

    if (status === 'verifying') {
        return (
            <div className="w-full max-w-2xl mx-auto space-y-6">
                {/* Loading Card */}
                <div className="bg-gradient-to-br from-slate-900 via-cyan-900/40 to-teal-900/40 rounded-2xl border border-cyan-500/20 p-8 text-center shadow-xl">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-500/30 animate-pulse">
                            <FaClock className="text-cyan-400" size={32} />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Verifying Your Profile</h3>
                    <p className="text-cyan-300 mb-4">Your information is being reviewed by our NGO partners.</p>

                    <div className="space-y-2 mb-6">
                        <div className="h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 rounded-full animate-shimmer w-full" />
                        <p className="text-sm text-slate-400">This usually takes 24-48 hours. We'll notify you once verification is complete.</p>
                    </div>

                    {/* Checklist */}
                    <div className="bg-white/5 rounded-xl p-6 border border-cyan-500/10 text-left space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span className="text-sm text-white">Profile information submitted</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-sm text-white">Awaiting NGO verification</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-slate-600" />
                            <span className="text-sm text-slate-400">NID generation (pending)</span>
                        </div>
                    </div>

                    {/* Simulate Verification Button (for testing) */}
                    <div className="border-t border-cyan-500/20 pt-6">
                        <p className="text-xs text-slate-400 mb-4">For testing purposes:</p>
                        <ActionButton variant="primary" onClick={onSimulateVerification}>
                            SIMULATE VERIFICATION
                        </ActionButton>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'verified' && nidData) {
        return (
            <div className="w-full space-y-6">
                {/* Success Message */}
                <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-2xl border border-green-500/20 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <FaCheckCircle className="text-green-400" size={24} />
                        <h3 className="text-xl font-bold text-white">Profile Verified!</h3>
                    </div>
                    <p className="text-green-300 text-sm">
                        Your profile has been successfully verified by our NGO partners. Your Virtual NID has been generated below.
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="w-full max-w-2xl mx-auto space-y-6">
                <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl border border-red-500/20 p-8 text-center">
                    <div className="mb-4">
                        <FaTimesCircle className="text-red-400 mx-auto" size={40} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">Verification Failed</h3>
                    <p className="text-red-300 mb-6">{error}</p>

                    <button
                        onClick={onReset}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg border border-red-500/30 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
