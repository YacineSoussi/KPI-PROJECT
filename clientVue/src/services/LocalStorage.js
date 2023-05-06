
const storageKey = import.meta.env.VUE_APP_LOCAL_STORAGE_KEY || "app"

export default class LocalStorage {

    static getKey(key) {
        return `${storageKey}-${key}`
    }
    static set(key, value) {
        localStorage.setItem(this.getKey(key), JSON.stringify(value));
    }
    static get(key) {
        return JSON.parse(localStorage.getItem(this.getKey(key)))
    }
    static remove(key) {
        localStorage.removeItem(this.getKey(key))
    }
    static clear() {
        localStorage.clear()
    }
    
}
