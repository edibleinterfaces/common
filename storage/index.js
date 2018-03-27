/*
 *
 * Persistence Plugin for Vuex using Local Storage. 
 * Supporting namespacing under a top level key.
 *
 */

import Vue from 'vue';
import Vuex from 'vuex';

import storage from './LocalStorage';

Vue.use(Vuex);

export default function({ namespace }) {
    return function(store) {
        store.subscribe((mutation, state) => {
            storage.set(namespace, state);
        });
    };
}
