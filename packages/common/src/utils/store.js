const store = {};

export function getStoreItem (key, defaultVal) {
    return store[key] || defaultVal;
}

export function setStoreItem (key, value, replace = true) {
    if (replace || !store[key]) {
        store[key] = value;
    }
}
