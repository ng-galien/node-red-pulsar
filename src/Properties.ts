export type Properties = { [key: string]: string }

export function jsonStringToProperties(json: string|undefined): Properties | undefined {
    if (json) {
        try {
            const object = JSON.parse(json)
            if (typeof object === 'object' && !Array.isArray(object)) {
                const properties: Properties = {}
                for (const key of Object.keys(object)) {
                    const keyVal = object[key]
                    if (typeof keyVal === 'string') {
                        properties[key] = keyVal
                    }
                }
                return properties
            }
        } catch (e) {
            return undefined
        }
    }
    return undefined
}
