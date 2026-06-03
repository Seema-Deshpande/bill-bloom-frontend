/**
 * Smart API data extractor that handles various response formats:
 * 1. { data: [...] } - single level
 * 2. { data: { data: [...] } } - double level
 * 3. { success: true, data: [...] }
 * 4. { items: [...], groups: [...], etc } - direct array property
 * 5. [...] - direct array
 * 6. { data: { items: [...], groups: [...], etc } }
 */
export const smartExtractData = (res) => {
    const data = res?.data;
    
    // Case: direct array
    if (Array.isArray(data)) {
        return data;
    }
    
    // Case: object - try multiple extraction strategies
    if (data && typeof data === 'object') {
        // Try double-nested data.data
        if (Array.isArray(data.data)) {
            return data.data;
        }
        
        // Try data.data as object and look for arrays inside
        if (data.data && typeof data.data === 'object') {
            // Look for common array property names
            const arrayProps = ['items', 'records', 'results', 'users', 'groups', 'expenses', 'settlements', 'transactions'];
            for (const prop of arrayProps) {
                if (Array.isArray(data.data[prop])) {
                    return data.data[prop];
                }
            }
            // If no common property found, check all properties
            for (const key in data.data) {
                if (Array.isArray(data.data[key])) {
                    return data.data[key];
                }
            }
        }
        
        // Look for arrays at top level of data object
        const arrayProps = ['items', 'records', 'results', 'users', 'groups', 'expenses', 'settlements', 'transactions', 'data'];
        for (const prop of arrayProps) {
            if (Array.isArray(data[prop])) {
                return data[prop];
            }
        }
        
        // Check all properties for arrays
        for (const key in data) {
            if (Array.isArray(data[key])) {
                return data[key];
            }
        }
        
        // Return the data object itself if it might contain other useful info
        return data;
    }
    
    // Fallback
    return null;
};

/**
 * Legacy extractor for simple two-level nesting
 * Used as fallback for simple APIs
 */
export const extractData = (res) => res.data?.data || res.data || null;
