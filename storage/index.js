/*
 *
 * Persistence Plugin for Vuex using Local Storage. 
 * Supporting namespacing under a top level key.
 *
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const Persistence = (localStorageInstance) => store => {
    store.subscribe((mutation, state) => {
        localStorageInstance.data = state
    })
}

export default Persistence 
