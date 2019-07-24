export function flattenMessages(nestedMessages: any[], prefix = "") {
    return (
        nestedMessages &&
        Object.keys(nestedMessages).reduce((messages: any, key: any) => {
            let value = nestedMessages[key]
            let prefixedKey = prefix ? `${prefix}.${key}` : key

            if (typeof value === "string") {
                messages[prefixedKey] = value
            } else {
                Object.assign(messages, flattenMessages(value, prefixedKey))
            }

            return messages
        }, {})
    )
}
