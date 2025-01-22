/**
 * Checks if the provided JSON string has errors.
 * @param value - The JSON string to validate.
 * @returns True if there are errors, false otherwise.
 */
export const hasErrors = (value: string): boolean => {
    try {
        JSON.parse(value.trim());
        return false;
    } catch (e) {
        return true;
    }
};

/**
 * Formats a valid JSON string.
 * @param value - The JSON string to format.
 * @returns A prettified JSON string or an error message.
 */
export const formatJSON = (value: string): string => {
    try {
        return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
        return "Invalid JSON";
    }
};
