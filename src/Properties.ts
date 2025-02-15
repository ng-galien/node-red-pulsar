export type Properties = { [key: string]: string };

export function jsonStringToProperties(
    json: string | undefined,
): Properties | undefined {
    if (json) {
        try {
            const object = JSON.parse(json);
            if (typeof object === 'object' && !Array.isArray(object)) {
                const properties: Properties = {};
                for (const key of Object.keys(object)) {
                    const keyVal = object[key];
                    if (typeof keyVal === 'string') {
                        properties[key] = keyVal;
                    }
                }
                //If properties is empty, return undefined
                if (Object.keys(properties).length === 0) {
                    return undefined;
                }
                return properties;
            }
        } catch (e) {
            return undefined;
        }
    }
    return undefined;
}

/**
 * Converts any object to a Properties object.
 *
 * @param any
 */
export function anyToProperties(any?: any): Properties | undefined {
    if (any === undefined || any === null) {
        return undefined;
    }
    if (typeof any === 'object' && !Array.isArray(any)) {
        const properties: Properties = {};
        for (const key of Object.keys(any)) {
            const keyVal = any[key];
            if (typeof keyVal === 'string') {
                properties[key] = keyVal;
            } else if (typeof keyVal === 'number') {
                properties[key] = keyVal.toString();
            } else if (typeof keyVal === 'boolean') {
                properties[key] = keyVal.toString();
            } else if (typeof keyVal === 'object') {
                properties[key] = JSON.stringify(keyVal);
            }
        }
        //If properties is empty, return undefined
        if (Object.keys(properties).length === 0) {
            return undefined;
        }
        return properties;
    }
    return undefined;
}

export function anyToNumber(any?: any): number | undefined {
    if (any === undefined || any === null) {
        return undefined;
    }
    if (typeof any === 'number') {
        return any;
    } else if (typeof any === 'string') {
        const num = Number(any);
        if (!isNaN(num)) {
            return num;
        }
    }
    return undefined;
}

export function anyToBoolean(any?: any): boolean | undefined {
    if (any === undefined || any === null) {
        return undefined;
    }
    if (any === true || any === false) {
        return any;
    } else if (typeof any === 'string') {
        if (any === 'true') {
            return true;
        } else if (any === 'false') {
            return false;
        }
    }
    return undefined;
}

export function anyToString(any: any): string | undefined {
    if (any === undefined || any === null) {
        return undefined;
    }
    if (typeof any === 'string') {
        return any;
    } else if (typeof any === 'number') {
        return any.toString();
    } else if (typeof any === 'boolean') {
        return any.toString();
    }
    return undefined;
}

/**
 * Converts any object to a string array.
 *
 * @param any
 */
export function anyToStringArray(any: any): string[] | undefined {
    if (any === undefined || any === null) {
        return undefined;
    }
    if (Array.isArray(any)) {
        const strings: string[] = [];
        for (const val of any) {
            if (typeof val === 'string') {
                strings.push(val);
            }
        }
        if (strings.length > 0) {
            return strings;
        }
    }
    return undefined;
}
