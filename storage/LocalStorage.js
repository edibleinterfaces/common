const EI_NAMESPACE = 'edible-interfaces' // need to version this appropriately for updates

// todo
// write a class getter to encapsulate repeated json parsing & writing to ls
class LocalStorage {

    constructor(appNamespace, appDefaults) {

        this.store = window.localStorage || localStorage
        if (!this.store)
            console.warn('No Local Storage available!')

        const eiData = JSON.parse(this.store.getItem(EI_NAMESPACE)) || { apps: {} }    

        if (!eiData.apps[appNamespace])
          eiData.apps[appNamespace] = appDefaults

        this.store.setItem(EI_NAMESPACE, JSON.stringify(eiData))

    }

    get data() {
      return JSON.parse(this.store.getItem(EI_NAMESPACE))
    }

    set data(newData) {
      this.store.setItem(EI_NAMESPACE, JSON.stringify(newData))
    }

    get stats() {

    }

    reset() {
        this.store.setItem(EI_NAMESPACE, JSON.stringify(eiSchema()))
    }

}

export default LocalStorage
