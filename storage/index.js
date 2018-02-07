import 'localforage';

const APP_KEY = 'edible-interfaces';

const config = {
    name        : 'edible-interfaces',
    version     : 1.0,
    storeName   : 'Main Store',
    description : 'Edible Interfaces Storage Adapter'
};

/* EdibleInterfaces Storage Component */
class Storage {

    constructor(appid, appConfig) {
        this.store = localforage;
        this.store.config(config);
        this.store.getItem(APP_KEY).then(function(appData) {
            if (!Boolean(appData)) {
                this.init(appid, appConfig);
            } 
        }); 
    }

    init(appid, appConfig) {
        this.store.setItem(APP_KEY, appConfig);
    }

    /* get and set data on top level config */ 
    get() {
        return this.store.getItem(APP_KEY);
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
