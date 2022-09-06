
export function getItem(name, defValue) {
    try {
        return localStorage.getItem(name);
    } catch {
        return defValue;
    }
}

export function setItem(name, value) {
    try {
        localStorage.setItem(name, value);
    } catch {
        // Pass. 
    }
}