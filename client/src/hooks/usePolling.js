import { useState, useEffect, useRef } from 'react';
import { storage } from '@/lib/storage';

/**
 * usePolling Hook - HTTP Polling for Real-Time Data
 * 
 * Implements polling mechanism to fetch data at regular intervals.
 * Used by ChatBox to fetch new messages every 3 seconds.
 * 
 * Features:
 * - Configurable polling interval
 * - Automatic retries on failure
 * - Prevents duplicate requests in-flight
 * - Respects authentication tokens
 * - Returns data, loading state, and error state
 * 
 * @param {string} url - API endpoint to poll (e.g., '/api/chat/get-messages')
 * @param {object} queryParams - Query parameters to include (e.g., { lastMessageId: 5 })
 * @param {number} interval - Polling interval in milliseconds (default: 3000)
 * @param {boolean} enabled - Enable/disable polling (default: true)
 * 
 * @returns {object} { data, loading, error }
 * 
 * @example
 * const { data: messages, loading, error } = usePolling(
 *   '/api/chat/get-messages',
 *   { lastMessageId: lastId, limit: 50 },
 *   3000
 * );
 */
export function usePolling(
  url,
  queryParams = {},
  interval = 3000,
  enabled = true
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isRequestInFlight = useRef(false);

  // ────────────────────────────────────────────────────────────────────────
  // Function: Fetch data from API
  // Includes authentication token from localStorage and query parameters
  // In development, requests to /api/* are proxied to backend by Vite
  // ────────────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    // Prevent duplicate in-flight requests
    if (isRequestInFlight.current) {
      return;
    }

    isRequestInFlight.current = true;
    setLoading(true);

    try {
      // Build URL with query parameters
      // Use VITE_API_URL for backend API calls (not frontend origin)
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
      const urlObj = new URL(fullUrl);
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          urlObj.searchParams.append(key, value);
        }
      });

      // Fetch with authentication token from storage (uses sheltra_token key)
      const token = storage.getToken();
      const response = await fetch(urlObj.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();

      // Update state with fetched data
      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error(`Polling error for ${url}:`, err);
      setError(err.message || 'Polling failed');
    } finally {
      setLoading(false);
      isRequestInFlight.current = false;
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // Effect: Setup polling interval
  // Polls data at specified interval when enabled
  // Fetches immediately on mount
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) {
      // Clear interval if polling is disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Fetch immediately on mount
    fetchData();

    // Setup polling interval
    intervalRef.current = setInterval(fetchData, interval);

    // Cleanup: clear interval on unmount or when interval changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [url, interval, enabled, queryParams]);

  // ────────────────────────────────────────────────────────────────────────
  // Return: Polling state and data
  // ────────────────────────────────────────────────────────────────────────
  return {
    data,
    loading,
    error,
  };
}
