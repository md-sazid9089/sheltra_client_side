/**
 * Decodes a JWT token and extracts the payload
 * @param {string} token - The JWT token
 * @returns {object|null} - The decoded payload or null if invalid
 */
export const decodeToken = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        // Decode the payload (second part)
        const decoded = JSON.parse(atob(parts[1]));
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Gets the token from localStorage
 * @returns {string|null} - The token or null if not found
 */
export const getToken = () => {
    try {
        return localStorage.getItem('authToken');
    } catch (error) {
        console.error('Error accessing localStorage:', error);
        return null;
    }
};

/**
 * Checks if token is expired
 * @param {object} decodedToken - The decoded token payload
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (decodedToken) => {
    if (!decodedToken || !decodedToken.exp) {
        return true;
    }

    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
};

/**
 * Gets user role from token
 * @returns {string|null} - The user role or null
 */
export const getUserRole = () => {
    const token = getToken();
    if (!token) {
        return null;
    }

    const decoded = decodeToken(token);
    if (!decoded || isTokenExpired(decoded)) {
        return null;
    }

    // Common JWT role claim names
    return decoded.role || decoded.roles?.[0] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
};

/**
 * Gets user info from token
 * @returns {object|null} - The user info or null
 */
export const getUserInfo = () => {
    const token = getToken();
    if (!token) {
        return null;
    }

    const decoded = decodeToken(token);
    if (!decoded || isTokenExpired(decoded)) {
        return null;
    }

    return {
        id: decoded.sub || decoded.user_id || decoded.id,
        email: decoded.email,
        name: decoded.name || decoded.given_name,
        role: decoded.role || decoded.roles?.[0],
    };
};

/**
 * Checks if user is authenticated (has valid token)
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = () => {
    const token = getToken();
    if (!token) {
        return false;
    }

    const decoded = decodeToken(token);
    return decoded && !isTokenExpired(decoded);
};

/**
 * Clears the auth token from localStorage
 */
export const clearToken = () => {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    } catch (error) {
        console.error('Error clearing token:', error);
    }
};
