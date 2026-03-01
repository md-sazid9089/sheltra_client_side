import axios from 'axios';
import { getToken, clearToken } from '../utils/tokenUtils';

// ── Custom error class ───────────────────────────────────────────────
export class ApiError extends Error {
    /**
     * @param {string}  message     – human-friendly message
     * @param {number}  status      – HTTP status code (0 for network errors)
     * @param {string}  code        – machine-readable code (e.g. 'UNAUTHORIZED')
     * @param {object}  data        – raw response payload, if any
     */
    constructor(message, status = 0, code = 'UNKNOWN', data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.data = data;
    }
}

// ── Error code mapping ───────────────────────────────────────────────
const STATUS_MAP = {
    400: { code: 'BAD_REQUEST', message: 'The request was invalid. Please check your input.' },
    401: { code: 'UNAUTHORIZED', message: 'Your session has expired. Please sign in again.' },
    403: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' },
    404: { code: 'NOT_FOUND', message: 'The requested resource was not found.' },
    422: { code: 'VALIDATION', message: 'Please check the highlighted fields and try again.' },
    429: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a moment and retry.' },
    500: { code: 'SERVER_ERROR', message: 'An unexpected server error occurred. Please try again later.' },
    502: { code: 'BAD_GATEWAY', message: 'The server is temporarily unavailable. Please try again.' },
    503: { code: 'SERVICE_UNAVAILABLE', message: 'The service is undergoing maintenance. Please try again shortly.' },
};

// ── Axios instance ───────────────────────────────────────────────────
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30_000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// ── Request interceptor: inject auth token ───────────────────────────
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: normalise errors ───────────────────────────
apiClient.interceptors.response.use(
    // Successful responses pass through
    (response) => response,

    // Error responses are normalised into ApiError
    (error) => {
        // Network / timeout errors (no response from server)
        if (!error.response) {
            const message = error.code === 'ECONNABORTED'
                ? 'The request timed out. Please check your connection and try again.'
                : 'A network error occurred. Please check your internet connection.';
            return Promise.reject(new ApiError(message, 0, 'NETWORK_ERROR'));
        }

        const { status, data } = error.response;
        const mapped = STATUS_MAP[status] || STATUS_MAP[500];

        // Prefer a message from the server, fall back to our map
        const serverMessage = data?.message || data?.error || data?.detail;
        const friendlyMessage = serverMessage || mapped.message;

        // 401 → clear stale credentials
        if (status === 401) {
            clearToken();
        }

        return Promise.reject(new ApiError(friendlyMessage, status, mapped.code, data));
    }
);

export default apiClient;
