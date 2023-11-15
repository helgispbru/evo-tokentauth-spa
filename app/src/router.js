import Vue from 'vue';
import VueRouter from 'vue-router';

import store from './store';

import Home from './views/home.vue'
import Login from './components/login.vue'
import Secure from './components/secure.vue'

Vue.use(VueRouter);

let router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/secure',
            name: 'secure',
            component: Secure,
            meta: {
                requiresAuth: true
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLogged) {
            next()
            return
        }
        next('/login')
    } else {
        next()
    }
})

export default router
