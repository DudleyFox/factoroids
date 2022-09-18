
export function getItem(name, defValue) {
    try {
        return localStorage.getItem(name) || defValue;
    } catch {
        return defValue;
    }
}

export function getItemInt(name, defValue) {
    return parseInt(getItem(name, defValue));
}

export function setItem(name, value) {
    try {
        localStorage.setItem(name, value);
    } catch {
        // Pass. 
    }
}