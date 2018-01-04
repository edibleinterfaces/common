const defaultConfig = {
    version: '1.0.0',
    apps: [], // list of config objects for each app
    pinned: [] // list of appids that are pinned to main page
};

const APP_KEY = 'edible-interfaces';

class Storage {

    constructor() {
        this.store = window.localStorage || localStorage;
        const initialized = Boolean(this.store.getItem('edible-interfaces')); 
        if (!initialized) {
            init();
        } 
    }

    init() {
        this.store.setItem('edible-interfaces', JSON.stringify(defaultConfig));
    }

}
