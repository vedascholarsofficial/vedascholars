// Small, dependency-free validators used by the controllers.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isNonEmptyString = (value, max = 500) =>
    typeof value === 'string' && value.trim().length > 0 && value.length <= max;

const normalizeEmail = (value) =>
    typeof value === 'string' ? value.trim().toLowerCase() : '';

const isValidEmail = (value) =>
    typeof value === 'string' && value.length <= 254 && EMAIL_PATTERN.test(value);

const isValidPassword = (value) =>
    typeof value === 'string' && value.length >= 8 && value.length <= 128;

// Existing accounts may have been stored with mixed-case emails, so lookups
// match either the normalised or the original trimmed form.
const emailLookup = (rawEmail) => {
    const trimmed = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const normalized = trimmed.toLowerCase();
    return normalized === trimmed ? { email: normalized } : { email: { $in: [normalized, trimmed] } };
};

const isObjectId = (value) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

const toStringArray = (value, { maxItems = 50, maxLength = 100 } = {}) => {
    if (!Array.isArray(value)) return null;
    if (value.length > maxItems) return null;
    if (!value.every((item) => typeof item === 'string' && item.length <= maxLength)) return null;
    return value.map((item) => item.trim()).filter(Boolean);
};

// Keeps only the listed string fields of each object in an array.
const toObjectArray = (value, fields, { maxItems = 30, maxLength = 2000 } = {}) => {
    if (!Array.isArray(value) || value.length > maxItems) return null;
    const result = [];
    for (const item of value) {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
        const clean = {};
        for (const field of fields) {
            const fieldValue = item[field];
            if (fieldValue === undefined || fieldValue === null) continue;
            if (Array.isArray(fieldValue)) {
                const list = toStringArray(fieldValue, { maxLength: 100 });
                if (list === null) return null;
                clean[field] = list;
            } else if (typeof fieldValue === 'string' && fieldValue.length <= maxLength) {
                clean[field] = fieldValue;
            } else {
                return null;
            }
        }
        result.push(clean);
    }
    return result;
};

module.exports = {
    isNonEmptyString,
    normalizeEmail,
    isValidEmail,
    isValidPassword,
    emailLookup,
    isObjectId,
    toStringArray,
    toObjectArray,
};
