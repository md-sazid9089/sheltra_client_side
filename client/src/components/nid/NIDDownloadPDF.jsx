import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    pdf,
} from '@react-pdf/renderer';
import { FaDownload } from 'react-icons/fa';

// Register font for better rendering
Font.registerHyphenationCallback((word) => [word]);

// Styles for PDF
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#0f172a',
    },
    container: {
        borderWidth: 2,
        borderColor: '#06b6d4',
        borderRadius: 8,
        padding: 30,
        backgroundColor: '#1e293b',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#06b6d4',
        paddingBottom: 15,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
    },
    headerSubtext: {
        fontSize: 10,
        color: '#06b6d4',
    },
    statusBadge: {
        padding: 8,
        backgroundColor: '#10b981',
        borderRadius: 4,
        marginLeft: 'auto',
    },
    statusText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#06b6d4',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 1,
    },
    grid: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 15,
    },
    gridItem: {
        flex: 1,
        marginRight: 15,
        paddingBottom: 15,
    },
    gridItem2: {
        flex: 1,
    },
    label: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#06b6d4',
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffffff',
        wordBreak: 'break-word',
    },
    valueSmall: {
        fontSize: 12,
        fontWeight: '500',
        color: '#ffffff',
    },
    datesContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#ffffff0a',
        padding: 15,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#06b6d4',
    },
    dateItem: {
        flex: 1,
        marginRight: 20,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#06b6d4',
        paddingTop: 15,
        marginTop: 20,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 9,
        color: '#06b6d4',
        marginBottom: 5,
    },
    footerSmall: {
        fontSize: 8,
        color: '#64748b',
    },
});

const NIDPDFDocument = ({ nidData }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerText}>Sheltra Virtual NID</Text>
                            <Text style={styles.headerSubtext}>Verified Identity Document</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{nidData.status}</Text>
                        </View>
                    </View>

                    {/* NID and Personal Details */}
                    <View style={styles.section}>
                        <View style={styles.grid}>
                            <View style={styles.gridItem}>
                                <Text style={styles.label}>NID Number</Text>
                                <Text style={styles.value}>{nidData.nidNumber}</Text>
                            </View>
                            <View style={styles.gridItem2}>
                                <Text style={styles.label}>Full Name</Text>
                                <Text style={styles.value}>{nidData.fullName}</Text>
                            </View>
                        </View>

                        <View style={styles.grid}>
                            <View style={styles.gridItem}>
                                <Text style={styles.label}>Country of Origin</Text>
                                <Text style={styles.valueSmall}>{nidData.country}</Text>
                            </View>
                            {nidData.email && (
                                <View style={styles.gridItem2}>
                                    <Text style={styles.label}>Email Address</Text>
                                    <Text style={styles.valueSmall}>{nidData.email}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Dates Section */}
                    <View style={styles.datesContainer}>
                        <View style={styles.dateItem}>
                            <Text style={styles.label}>Generated Date</Text>
                            <Text style={styles.valueSmall}>{formatDate(nidData.generatedAt)}</Text>
                        </View>
                        <View>
                            <Text style={styles.label}>Valid Until</Text>
                            <Text style={styles.valueSmall}>{formatDate(nidData.expiryDate)}</Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            This Virtual NID is issued by Sheltra and verified by authorized NGO partners.
                        </Text>
                        <Text style={styles.footerSmall}>
                            Document ID: {nidData.nidNumber} | Generated: {new Date(nidData.generatedAt).toLocaleString()}
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export function NIDDownloadPDF({ nidData }) {
    const handleDownloadPDF = async () => {
        try {
            const doc = <NIDPDFDocument nidData={nidData} />;
            const pdfBlob = await pdf(doc).toBlob();

            // Create download link
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Sheltra-NID-${nidData.nidNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 rounded-lg border border-cyan-500/30 transition-colors font-medium"
        >
            <FaDownload size={16} />
            Download NID (React-PDF)
        </button>
    );
}

export default NIDPDFDocument;
