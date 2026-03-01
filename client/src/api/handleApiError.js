/**
 * Helper to handle ApiErrors consistently across feature flows.
 *
 * Usage inside a component that has access to the toast:
 *
 *   import { handleApiError } from '../api/handleApiError';
 *
 *   try {
 *       await apiClient.get('/endpoint');
 *   } catch (err) {
 *       handleApiError(err, toast, { navigate });
 *   }
 */

export function handleApiError(error, toast, options = {}) {
    const { navigate, onUnauthorized, onForbidden } = options;

    // ApiError instances carry structured info
    if (error?.name === 'ApiError') {
        switch (error.code) {
            case 'UNAUTHORIZED':
                toast.error(error.message);
                if (onUnauthorized) {
                    onUnauthorized();
                } else if (navigate) {
                    navigate('/login');
                }
                return;

            case 'FORBIDDEN':
                toast.error(error.message);
                if (onForbidden) {
                    onForbidden();
                } else if (navigate) {
                    navigate('/unauthorized');
                }
                return;

            case 'NETWORK_ERROR':
                toast.error(error.message);
                return;

            case 'VALIDATION':
                // Surface server validation message; caller can also inspect error.data
                toast.error(error.message);
                return;

            default:
                toast.error(error.message);
                return;
        }
    }

    // Fallback for unexpected / non-ApiError throws
    console.error('Unhandled error:', error);
    toast.error('Something went wrong. Please try again.');
}
