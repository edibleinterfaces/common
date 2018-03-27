const appKey = 'edible-interfaces';
const schema = JSON.stringify({ apps: {} });

class LocalStorage {


    constructor() {
        this.namespace = appKey;
        this.store = window.localStorage || localStorage;

        if (!this.store)
            console.warn('No Local Storage available!');

        const data = JSON.parse(this.store.getItem(this.namespace));    

        if (!data) {
            this.store.setItem(this.namespace, schema);
        }
    }

    get(appName) {
        const appData = JSON.parse(this.store.getItem(this.namespace));
        return appData.apps[appName] || {};
    }

    set(appName, data) {
        const appData = JSON.parse(this.store.getItem(this.namespace));
        appData.apps[appName] = data;
        this.store.setItem(appKey, JSON.stringify(appData));
    }

}

export default new LocalStorage();
