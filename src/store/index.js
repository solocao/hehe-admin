import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import { db } from '../libs/db';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        //
    },
    mutations: {
        set(state, params) {
            const keys = Object.keys(params);
            keys.forEach(x => {
                const val = params[x];
                db.set(x, val).write();
                state[x] = val;
            });
        }

    },
    actions: {

    },
    modules: {
        app,
        user
    }
});

export default store;
