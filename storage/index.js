/*
 *  EdibleInterfaces Storage Component
 *
 *
 */
const APP_KEY = 'edible-interfaces';

class Storage {

    constructor(appid, appConfig) {
        this.store = window.localStorage || localStorage;
        const initialized = Boolean(this.store.getItem(APP_KEY)); 
        if (!initialized) {
            init(appid, appConfig);
        } 
    }

    init(appid, appConfig) {
        this.store.setItem(APP_KEY, JSON.stringify(siteConfig));
    }

    /* get and set data on top level config */ 
    get() {
        return JSON.parse(this.store.getItem(APP_KEY));
    }

    set(data) {
        this.store.setItem(JSON.stringify(data));
    }

    /* get and set data by app */

    appGet(appId){
        const store = this.get();
        return store.apps[appId];
    }

    appSet(appId, data) {
        const store = this.get();
        store.apps[appId] = data;
        this.set(store);
    }

}

export default Storage;
