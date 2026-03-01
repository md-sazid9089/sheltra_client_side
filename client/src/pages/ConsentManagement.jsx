import { useState, useEffect } from 'react';
import { getUserInfo } from '../utils/tokenUtils';

// ── Consent item definitions ─────────────────────────────────────────
const CONSENT_ITEMS = [
    {
        key: 'shareProfileWithEmployers',
        title: 'Share Profile with Employers',
        description:
            'Allow verified employers on Sheltra to view your full profile, including your name, bio, location, and availability. Employers can only access profiles that have been NGO-verified.',
        icon: '👤',
    },
    {
        key: 'shareSkillsWithEmployers',
        title: 'Share Verified Skills with Employers',
        description:
            'Allow employers to see your NGO-verified skill certifications and proficiency levels. This helps match you with relevant job opportunities, training, and apprenticeships.',
        icon: '🛠️',
    },
    {
        key: 'faceVerificationOptIn',
        title: 'Face Verification (Optional)',
        description:
            'Opt in to optional face-based identity verification using privacy-first technology. Your biometric data is processed locally and never stored on our servers. This can help strengthen your digital identity profile.',
        icon: '📷',
        optional: true,
    },
];

// ── Mock API helpers ─────────────────────────────────────────────────
async function fetchConsentSettings() {
    // Replace with actual API call: GET /api/refugee/consent
    // const response = await fetch('/api/refugee/consent', { headers: { Authorization: `Bearer ${token}` } });
    // return await response.json();
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
        shareProfileWithEmployers: true,
        shareSkillsWithEmployers: true,
        faceVerificationOptIn: false,
        lastUpdated: '2026-02-28T10:30:00Z',
    };
}

async function updateConsentSettings(settings) {
    // Replace with actual API call: PUT /api/refugee/consent
    // const response = await fetch('/api/refugee/consent', {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    //     body: JSON.stringify(settings),
    // });
    // return await response.json();
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
    const [savingKey, setSavingKey] = useState(null); // tracks which toggle is saving
    const [notification, setNotification] = useState(null); // { type: 'success'|'error', message }

    // Load consent settings on mount
    useEffect(() => {
        loadConsents();
    }, []);

    // Auto-dismiss notifications
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
        if (savingKey) return; // prevent concurrent saves
        const previousValue = consents[key];
        const newValue = !previousValue;

        // Optimistic update
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
            // Rollback on failure
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
                <h2 className="text-3xl font-bold text-gray-900">Consent Management</h2>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-lg h-28 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    // ── Error state ──────────────────────────────────────────────────
    if (error) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Consent Management</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
                    <p className="text-red-600 text-lg font-semibold mb-2">Error Loading Settings</p>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={loadConsents}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
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
                <h2 className="text-3xl font-bold text-gray-900">Consent Management</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <p className="text-gray-500 text-5xl mb-4">🔒</p>
                    <p className="text-gray-600 text-lg font-semibold mb-2">No Consent Settings Found</p>
                    <p className="text-gray-400">Your consent preferences could not be loaded.</p>
                </div>
            </div>
        );
    }

    // ── Main render ──────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Consent Management</h2>
                <p className="text-gray-500 mt-1">
                    Control how your data is shared on the Sheltra platform. You can change these at any time.
                </p>
            </div>

            {/* Notification banner */}
            {notification && (
                <div
                    className={`rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2 transition-all ${
                        notification.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                >
                    <span>{notification.type === 'success' ? '✅' : '❌'}</span>
                    <span>{notification.message}</span>
                </div>
            )}

            {/* User info banner */}
            {userInfo && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex flex-wrap items-center gap-4">
                    <p className="text-gray-700 text-sm">
                        <strong>Managing consent for:</strong> {userInfo.name || userInfo.email}
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">🔒 Your Privacy Matters</h3>
                <p className="text-blue-800 text-sm">
                    Sheltra is committed to protecting your privacy and dignity. Your data is only shared with
                    verified entities when you give explicit consent. All consent changes are logged for
                    transparency and can be revoked at any time. Face verification data, if opted in, is
                    processed locally on your device and is never stored on our servers.
                </p>
            </div>

            {/* GDPR / rights note */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-sm font-bold text-gray-700 mb-2">Your Data Rights</h3>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                    <li>You can withdraw any consent at any time with immediate effect.</li>
                    <li>Withdrawing consent does not affect prior lawful processing.</li>
                    <li>You have the right to request a copy of your data or its deletion.</li>
                    <li>For questions, contact your assigned NGO case worker or Sheltra support.</li>
                </ul>
            </div>
        </div>
    );
}

// ── Sub-component: Consent Toggle Card ───────────────────────────────
function ConsentToggleCard({ item, checked, isSaving, disabled, onToggle }) {
    return (
        <div
            className={`bg-white border rounded-lg shadow-sm p-5 flex items-start gap-4 transition-all ${
                checked ? 'border-indigo-200' : 'border-gray-200'
            } ${disabled && !isSaving ? 'opacity-60' : ''}`}
        >
            {/* Icon */}
            <span className="text-3xl mt-0.5 shrink-0">{item.icon}</span>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-semibold text-gray-900">{item.title}</h4>
                    {item.optional && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            Optional
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                {/* Status text */}
                <p className={`text-xs mt-2 font-medium ${checked ? 'text-green-600' : 'text-gray-400'}`}>
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
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
                    checked ? 'bg-indigo-600' : 'bg-gray-300'
                } ${disabled ? 'cursor-not-allowed' : ''}`}
            >
                <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                >
                    {isSaving && (
                        <span className="absolute inset-0 flex items-center justify-center">
                            <span className="h-3 w-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                        </span>
                    )}
                </span>
            </button>
        </div>
    );
}
