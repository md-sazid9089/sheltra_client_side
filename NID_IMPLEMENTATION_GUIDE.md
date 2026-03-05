# Virtual NID Check Implementation Guide

## Overview

The Virtual NID Check Page allows refugees to submit their profile information and receive a verified National Identification Document (NID) after NGO verification.

## Components

### 1. **VirtualNIDCheck.jsx** (Main Page)

Located at: `src/pages/refugee/VirtualNIDCheck.jsx`

- Main orchestrating component
- Handles the complete workflow: form submission → verification → NID generation
- Integrates all sub-components
- Provides PDF download functionality

### 2. **NIDGenerationForm.jsx** (Form Component)

Located at: `src/components/nid/NIDGenerationForm.jsx`

- React Hook Form implementation
- Form fields:
  - Full Name (required, 3-50 characters)
  - Country of Origin (dropdown with 37 countries)
  - Email (optional with email validation)
- Built-in validation and error messages
- Accessible form design with proper labels

### 3. **NIDVerificationStatus.jsx** (Status Display)

Located at: `src/components/nid/NIDVerificationStatus.jsx`

- Shows different states:
  - **Verifying**: Loading state with checklist
  - **Verified**: Success message
  - **Failed**: Error handling
- Test mode with "Simulate Verification" button for demo purposes
- Animated loader with progress indicators

### 4. **NIDDocument.jsx** (NID Card Display)

Located at: `src/components/nid/NIDDocument.jsx`

- Professional NID card design
- Displays:
  - Unique NID number (format: NID-YYYYMMDD-XXXXX)
  - Full name
  - Country of origin
  - Email
  - Generated date
  - Expiry date (1 year validity)
  - Verification status badge
- Responsive design with dark mode support
- Ready for PDF generation

### 5. **useNIDVerification.js** (Custom Hook)

Located at: `src/hooks/useNIDVerification.js`

- Manages NID verification workflow state
- Functions:
  - `generateNIDNumber()`: Creates unique NID with timestamp
  - `handleFormSubmit()`: Processes form data
  - `simulateVerification()`: Simulates NGO verification (2-second delay)
  - `resetVerification()`: Resets state for new submission

## Installation

### 1. Install PDF Generation Dependencies

```bash
cd client
npm install html2canvas jspdf
```

### 2. Verify Routes are Configured

Routes are already configured in `src/routes/AppRoutes.jsx`:

```javascript
<Route path="/refugee/nid-check" element={<VirtualNIDCheck />} />
```

### 3. Quick Link Added to Dashboard

The NID Check is already added to the Refugee Dashboard quick links.

## Usage Flow

### Step 1: Form Submission

1. User fills in Full Name, Country, and optional Email
2. Form validates input
3. User clicks "Submit for Verification"

### Step 2: Verification Wait

1. Loading state displays with animated loader
2. Message: "Your profile is being reviewed by our NGO partners"
3. In test mode, click "Simulate Verification" button to proceed
4. Simulated delay of 2 seconds before verification completes

### Step 3: NID Generation

1. Upon verification success, unique NID is generated
2. NID Document displays with all details
3. Success message confirms verification

### Step 4: PDF Download

1. Click "Download as PDF" button
2. File saves as `Sheltra-NID-{NID-NUMBER}.pdf`
3. PDF includes professional layout matching NID card design

## API Integration (Future)

Currently using simulated verification. For real integration:

```javascript
// In useNIDVerification.js, replace simulateVerification with:
const realVerification = async () => {
  setStatus('verifying');
  try {
    const response = await api.post('/refugee/verify-profile', formData);
    const nidNumber = response.data.nidNumber;
    setNidData({
      ...response.data,
      status: 'Verified',
      generatedAt: new Date().toISOString(),
    });
    setStatus('verified');
  } catch (error) {
    setStatus('failed');
    setError(error.message);
  }
};
```

## Customization

### Change Country List

Edit the `COUNTRIES` array in `NIDGenerationForm.jsx`

### Customize NID Number Format

Modify `generateNIDNumber()` in `useNIDVerification.js`:

```javascript
const generateNIDNumber = () => {
  // Custom format: YOUR-FORMAT-HERE
  return `YOUR-NID-${Math.random().toString(36).substring(2, 9)}`;
};
```

### Adjust Verification Delay

In `useNIDVerification.js`, change the timeout value:

```javascript
setTimeout(() => {
  // Verification logic
}, 2000); // Change 2000ms to desired delay
```

## Styling

All components use:

- **TailwindCSS**: Base styling
- **Design Tokens**: `brand-primary`, `surface-darkBase`, etc.
- **Dark Mode**: Full `dark:` class support
- **Responsive Design**: Mobile-first approach

## Testing

### Test the Complete Flow

1. Navigate to `/refugee/nid-check`
2. Fill in form with test data:
   - Name: "Ahmad Hassan"
   - Country: "Afghanistan"
   - Email: "<ahmad@example.com>"
3. Click "Submit for Verification"
4. Click "Simulate Verification" button
5. Wait for NID generation
6. Click "Download as PDF" to generate PDF

### Test Form Validation

- Leave name empty → Shows required error
- Enter short name (< 3 chars) → Shows length error
- Enter invalid email → Shows format error

### Test PDF Generation

- NID card automatically renders to PDF
- File naming follows format: `Sheltra-NID-NID-20260306-XXXXX.pdf`

## Troubleshooting

### PDF Download Not Working

- Ensure `html2canvas` and `jspdf` are installed
- Check browser console for errors
- Verify NID ref is properly attached to NIDDocument

### Form Validation Not Working

- Verify React Hook Form is imported correctly
- Check form field `name` attributes match hook register

### Styling Issues

- Ensure TailwindCSS is properly configured
- Check dark mode class applied to document root
- Verify design tokens are defined in Tailwind config

## Files Modified/Created

### New Files

- `src/pages/refugee/VirtualNIDCheck.jsx` - Main page
- `src/components/nid/NIDGenerationForm.jsx` - Form component
- `src/components/nid/NIDVerificationStatus.jsx` - Status component
- `src/components/nid/NIDDocument.jsx` - NID display
- `src/hooks/useNIDVerification.js` - Custom hook

### Modified Files

- `src/routes/AppRoutes.jsx` - Added NID check route
- `src/pages/refugee/Dashboard.jsx` - Added NID Check quick link

## Performance Considerations

- Form validation happens client-side (no network calls)
- PDF generation uses canvas rendering (can be heavy for large images)
- Simulated verification uses 2-second delay (easily adjustable)

## Security Notes

- Form data is only stored in component state (not persisted)
- No sensitive data is transmitted in demo mode
- In production, use HTTPS for all API calls
- Implement proper authentication for backend verification

## Future Enhancements

1. **Backend Integration**: Connect to real NGO verification API
2. **Email Notifications**: Send verification status updates
3. **NID Renewal**: Implement expiry and renewal system
4. **Blockchain Verification**: Add immutable verification records
5. **Multi-language Support**: Translate form and messages
6. **Advanced PDF Features**: Add QR codes, security features
7. **Export Options**: Add CSV, JSON export formats

## Support & Questions

For issues or questions about the NID implementation, refer to the component JSDoc comments or check the Sheltra development documentation.
