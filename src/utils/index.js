// Utility Functions

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

// Format date
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

// Generate unique ID
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Show notification (placeholder for future implementation)
export const showNotification = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // TODO: Implement toast notifications
};

// Validate number input
export const validateNumber = (value, min = 0, max = Infinity) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
};

// Deep clone object
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};
