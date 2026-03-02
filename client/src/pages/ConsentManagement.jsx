import { useState, useEffect } from 'react';
import { getUserInfo } from '../utils/tokenUtils';

// ── Consent item definitions ─────────────────────────────────────────
const CONSENT_ITEMS = [
    {
        key: 'shareProfileWithEmployers',
        title: 'Share Profile with Employers',
        description:
            'Allow verified employers on Sheltra to view your full profile, including your name, bio, location, and availability. Employers can only access profiles that have been NGO-verified.',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        key: 'shareSkillsWithEmployers',
        title: 'Share Verified Skills with Employers',
        description:
            'Allow employers to see your NGO-verified skill certifications and proficiency levels. This helps match you with relevant job opportunities, training, and apprenticeships.',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
        ),
    },
    {
        key: 'faceVerificationOptIn',
        title: 'Face Verification (Optional)',
        description:
            'Opt in to optional face-based identity verification using privacy-first technology. Your biometric data is processed locally and never stored on our servers. This can help strengthen your digital identity profile.',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
        ),
        optional: true,
    },
];

// ── Mock API helpers ─────────────────────────────────────────────────
async function fetchConsentSettings() {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
        shareProfileWithEmployers: true,
        shareSkillsWithEmployers: true,
        faceVerificationOptIn: false,
        lastUpdated: '2026-02-28T10:30:00Z',
    };
}

async function updateConsentSettings(settings) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true, lastUpdated: new Date().toISOString() };
}

// ── Component ────────────────────────────────────────────────────────
export default function ConsentManagement() {
    const userInfo = getUserInfo();
    const [consents, setConsents] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [savingKey, setSavingKey] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        loadConsents();
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const loadConsents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchConsentSettings();
            setConsents({
                shareProfileWithEmployers: data.shareProfileWithEmployers,
                shareSkillsWithEmployers: data.shareSkillsWithEmployers,
                faceVerificationOptIn: data.faceVerificationOptIn,
            });
            setLastUpdated(data.lastUpdated);
        } catch (err) {
            setError(err.message || 'Failed to load consent settings.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async (key) => {
        if (savingKey) return;
        const previousValue = consents[key];
        const newValue = !previousValue;

        setConsents((prev) => ({ ...prev, [key]: newValue }));
        setSavingKey(key);
        setNotification(null);

        try {
            const result = await updateConsentSettings({ ...consents, [key]: newValue });
            if (result.success) {
                setLastUpdated(result.lastUpdated);
                const label = CONSENT_ITEMS.find((c) => c.key === key)?.title || key;
                setNotification({
                    type: 'success',
                    message: `"${label}" ${newValue ? 'enabled' : 'disabled'} successfully.`,
                });
            } else {
                throw new Error('Update failed');
            }
        } catch {
            setConsents((prev) => ({ ...prev, [key]: previousValue }));
            setNotification({
                type: 'error',
                message: 'Failed to update consent. Please try again.',
            });
        } finally {
            setSavingKey(null);
        }
    };

    // ── Loading state ────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Consent Management</h2>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-2xl h-28 animate-pulse border border-gray-700/50"
                             style={{ background: 'rgba(255,255,255,0.04)' }} />
                    ))}
                </div>
            </div>
        );
    }

    // ── Error state ──────────────────────────────────────────────────
    if (error) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Consent Management</h2>
                <div className="rounded-2xl border border-red-500/30 p-8 text-center"
                     style={{ background: 'rgba(239,68,68,0.06)' }}>
                    <p className="text-red-400 text-lg font-semibold mb-2">Error Loading Settings</p>
                    <p className="text-red-400/70 mb-4">{error}</p>
                    <button
                        onClick={loadConsents}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-semibold transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // ── Empty state ──────────────────────────────────────────────────
    if (!consents) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Consent Management</h2>
                <div className="rounded-2xl border border-gray-700/50 p-12 text-center"
                     style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                         style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-gray-400 text-lg font-semibold mb-1">No Consent Settings Found</p>
                    <p className="text-gray-500 text-sm">Your consent preferences could not be loaded.</p>
                </div>
            </div>
        );
    }

    // ── Main render ──────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white">Consent Management</h2>
                <p className="text-gray-400 mt-1 text-sm">
                    Control how your data is shared on the Sheltra platform. You can change these at any time.
                </p>
            </div>

            {/* Notification banner */}
            {notification && (
                <div
                    className={`rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2 border transition-all ${
                        notification.type === 'success'
                            ? 'border-emerald-500/30 text-emerald-300'
                            : 'border-red-500/30 text-red-300'
                    }`}
                    style={{
                        background: notification.type === 'success'
                            ? 'rgba(16,185,129,0.08)'
                            : 'rgba(239,68,68,0.08)',
                    }}
                >
                    {notification.type === 'success' ? (
                        <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* User info banner */}
            {userInfo && (
                <div className="rounded-xl border border-gray-700/50 px-5 py-3 flex flex-wrap items-center gap-4"
                     style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-gray-300 text-sm">
                        <span className="text-gray-500 font-medium">Managing consent for:</span>{' '}
                        <span className="text-white font-semibold">{userInfo.name || userInfo.email}</span>
                    </p>
                    {lastUpdated && (
                        <p className="text-gray-500 text-xs ml-auto">
                            Last updated: {new Date(lastUpdated).toLocaleString()}
                        </p>
                    )}
                </div>
            )}

            {/* Consent toggles */}
            <div className="space-y-4">
                {CONSENT_ITEMS.map((item) => (
                    <ConsentToggleCard
                        key={item.key}
                        item={item}
                        checked={consents[item.key]}
                        isSaving={savingKey === item.key}
                        disabled={savingKey !== null}
                        onToggle={() => handleToggle(item.key)}
                    />
                ))}
            </div>

            {/* Privacy info box */}
            <div className="rounded-2xl border border-cyan-500/20 p-6"
                 style={{ background: 'rgba(6,182,212,0.05)' }}>
                <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-base font-bold text-cyan-300">Your Privacy Matters</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Sheltra is committed to protecting your privacy and dignity. Your data is only shared with
                    verified entities when you give explicit consent. All consent changes are logged for
                    transparency and can be revoked at any time. Face verification data, if opted in, is
                    processed locally on your device and is never stored on our servers.
                </p>
            </div>

            {/* GDPR / rights note */}
            <div className="rounded-2xl border border-gray-700/50 p-6"
                 style={{ background: 'rgba(255,255,255,0.03)' }}>
                <h3 className="text-sm font-bold text-gray-300 mb-3">Your Data Rights</h3>
                <ul className="text-gray-400 text-sm space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        You can withdraw any consent at any time with immediate effect.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        Withdrawing consent does not affect prior lawful processing.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        You have the right to request a copy of your data or its deletion.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        For questions, contact your assigned NGO case worker or Sheltra support.
                    </li>
                </ul>
            </div>
        </div>
    );
}

// ── Sub-component: Consent Toggle Card ───────────────────────────────
function ConsentToggleCard({ item, checked, isSaving, disabled, onToggle }) {
    return (
        <div
            className={`rounded-2xl border p-5 flex items-start gap-4 transition-all ${
                checked ? 'border-orange-500/30' : 'border-gray-700/50'
            } ${disabled && !isSaving ? 'opacity-60' : ''}`}
            style={{ background: 'rgba(255,255,255,0.03)' }}
        >
            {/* Icon */}
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{
                    background: checked ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.06)',
                    color: checked ? '#fb923c' : '#9ca3af',
                }}
            >
                {item.icon}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-semibold text-white">{item.title}</h4>
                    {item.optional && (
                        <span className="text-xs border border-yellow-500/40 text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                            Optional
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{item.description}</p>
                {/* Status text */}
                <p className={`text-xs mt-2 font-medium ${
                    isSaving ? 'text-gray-500' : checked ? 'text-emerald-400' : 'text-gray-500'
                }`}>
                    {isSaving ? 'Saving...' : checked ? 'Enabled' : 'Disabled'}
                </p>
            </div>

            {/* Toggle */}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={`Toggle ${item.title}`}
                disabled={disabled}
                onClick={onToggle}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-transparent ${
                    checked ? 'bg-orange-500' : 'bg-gray-700'
                } ${disabled ? 'cursor-not-allowed' : ''}`}
            >
                <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                >
                    {isSaving && (
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="h-3 w-3 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                        </span>
                    )}
                </span>
            </button>
        </div>
    );
}
