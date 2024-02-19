

export const flatMap = (obj: any): { [key: string]: any } => {
    const flat: { [key: string]: any } = {};

    if (obj !== null && typeof obj === 'object') {
        if (Array.isArray(obj)) {
            // Handle array
            obj.forEach((value, index) => {
                if (typeof value === 'object') {
                    const nested = flatMap(value);
                    for (const innerKey in nested) {
                        flat[`${index}.${innerKey}`] = nested[innerKey];
                    }
                } else {
                    flat[index.toString()] = value;
                }
            });
        } else {
            // Handle object
            for (const key in obj) {
                const value = obj[key];
                if (typeof value === 'object') {
                    const nested = flatMap(value);
                    for (const innerKey in nested) {
                        flat[`${key}.${innerKey}`] = nested[innerKey];
                    }
                } else {
                    flat[key] = value;
                }
            }
        }
    } else {
        // If the obj is neither an object nor an array, wrap it in an object
        return obj;
    }

    return flat;
}