import { useRef } from 'react';
import { useNIDVerification } from '@/hooks/useNIDVerification';
import { NIDGenerationForm } from '@/components/nid/NIDGenerationForm';
import { NIDVerificationStatus } from '@/components/nid/NIDVerificationStatus';
import { NIDDocument } from '@/components/nid/NIDDocument';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FaShieldAlt, FaDownload, FaArrowLeft } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

export default function VirtualNIDCheck() {
    const navigate = useNavigate();
    const nidRef = useRef();
    const {
        formData,
        status,
        nidData,
        error,
        handleFormSubmit,
        simulateVerification,
        resetVerification,
    } = useNIDVerification();

    const handleDownloadPDF = async () => {
        if (!nidRef.current) return;

        try {
            // Convert the NID card to canvas
            const canvas = await html2canvas(nidRef.current, {
                backgroundColor: '#0f172a',
                scale: 2,
                useCORS: true,
                allowTaint: true,
            });

            // Create PDF from canvas
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            const imgWidth = 297; // A4 width in mm (landscape)
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf_ = new jsPDF({
                orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf_.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            const imgData = canvas.toDataURL('image/png');
            pdf_.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Download the PDF
            pdf_.save(`Sheltra-NID-${nidData.nidNumber}.pdf`);
        } catch (err) {
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 motion-safe-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-950/40 to-teal-950/40 border-b border-cyan-500/20 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        onClick={() => navigate('/refugee/dashboard')}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors"
                    >
                        <FaArrowLeft size={16} />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
                            <FaShieldAlt className="text-cyan-400" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Virtual NID Check</h1>
                            <p className="text-cyan-300">Get your verified National Identification Document</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Initial Form State */}
                {(status === 'idle' || status === 'submitted') && (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Form Card */}
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary mb-2">
                                Profile Information
                            </h2>
                            <p className="text-text-secondary dark:text-text-darkSecondary mb-6">
                                Fill in your details below. Your information will be securely verified by our NGO partners.
                            </p>

                            <NIDGenerationForm
                                onSubmit={handleFormSubmit}
                                isLoading={status === 'submitted'}
                            />
                        </Card>

                        {/* Info Card */}
                        <div className="space-y-6">
                            <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 border-cyan-500/20">
                                <h3 className="text-lg font-semibold text-text-primary dark:text-text-darkPrimary mb-4">
                                    What is a Virtual NID?
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex gap-3">
                                        <span className="text-cyan-400 font-bold">✓</span>
                                        <span className="text-text-secondary dark:text-text-darkSecondary">
                                            A verified digital identity document that proves your identity in the Sheltra system
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-cyan-400 font-bold">✓</span>
                                        <span className="text-text-secondary dark:text-text-darkSecondary">
                                            Verified by trusted NGO partners in your region
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-cyan-400 font-bold">✓</span>
                                        <span className="text-text-secondary dark:text-text-darkSecondary">
                                            Increases employer trust and match rates
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-cyan-400 font-bold">✓</span>
                                        <span className="text-text-secondary dark:text-text-darkSecondary">
                                            Valid for 1 year and can be renewed
                                        </span>
                                    </li>
                                </ul>
                            </Card>

                            <Card className="p-6 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 border-teal-500/20">
                                <h3 className="text-lg font-semibold text-text-primary dark:text-text-darkPrimary mb-4">
                                    Verification Timeline
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-sm">
                                            1
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-primary dark:text-text-darkPrimary">Submit</p>
                                            <p className="text-sm text-text-secondary dark:text-text-darkSecondary">Fill form & submit</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-sm">
                                            2
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-primary dark:text-text-darkPrimary">Wait</p>
                                            <p className="text-sm text-text-secondary dark:text-text-darkSecondary">24-48 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-sm">
                                            3
                                        </div>
                                        <div>
                                            <p className="font-semibold text-text-primary dark:text-text-darkPrimary">Verified</p>
                                            <p className="text-sm text-text-secondary dark:text-text-darkSecondary">Get your NID</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Verification Status State */}
                {(status === 'verifying' || status === 'failed') && (
                    <NIDVerificationStatus
                        status={status}
                        nidData={nidData}
                        onSimulateVerification={simulateVerification}
                        onReset={resetVerification}
                        error={error}
                    />
                )}

                {/* Verified State - Show NID Document */}
                {status === 'verified' && nidData && (
                    <div className="space-y-8">
                        {/* Success Message */}
                        <NIDVerificationStatus
                            status={status}
                            nidData={nidData}
                            onReset={resetVerification}
                        />

                        {/* NID Document */}
                        <div ref={nidRef}>
                            <NIDDocument nidData={nidData} />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={handleDownloadPDF}
                                className="flex items-center justify-center gap-2 bg-brand-primary text-white hover:bg-brand-primary/90"
                            >
                                <FaDownload size={18} />
                                Download as PDF
                            </Button>
                            <Button
                                onClick={resetVerification}
                                variant="secondary"
                            >
                                Start Over
                            </Button>
                        </div>

                        {/* Additional Info */}
                        <Card className="p-6 bg-blue-500/5 border-blue-500/20">
                            <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary mb-3">
                                Next Steps
                            </h3>
                            <ul className="space-y-2 text-sm text-text-secondary dark:text-text-darkSecondary">
                                <li>✓ Your NID is now active and verified</li>
                                <li>✓ You can apply for job opportunities with this verified profile</li>
                                <li>✓ Employers will have more confidence in your applications</li>
                                <li>✓ Keep your NID safe and share it only with trusted sources</li>
                                <li>✓ Your NID is valid for 1 year from today</li>
                            </ul>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
