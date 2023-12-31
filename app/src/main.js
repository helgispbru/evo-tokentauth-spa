import Vue from 'vue';
import App from './App.vue';

import router from './router';
import store from './store';

import axios from 'axios';
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

const app = new Vue({
    router,
    store,
    created() {
        //
    },
    render: (h) => h(App),
}).$mount('#app');
