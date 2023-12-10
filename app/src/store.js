import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import axios from 'axios'

export default new Vuex.Store({
    state: {
        token: {
            access_token: localStorage.getItem('access_token'),
            refresh_token: localStorage.getItem('refresh_token'),
            valid_to: localStorage.getItem('valid_to'),
        },
        is_logged: false,
    },
    mutations: {
        auth_success(state, token) {
            state.token = token;
            state.is_logged = true;

            localStorage.setItem('access_token', token.access_token);
            localStorage.setItem('refresh_token', token.refresh_token);
            localStorage.setItem('valid_to', token.valid_to);
        },
        auth_fail(state) {
            state.token = {
                access_token: null,
                refresh_token: null,
                valid_to: null,
            };
            state.is_logged = false;

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('valid_to');
        },
        logout_success(state) {
            state.token = {
                access_token: null,
                refresh_token: null,
                valid_to: null,
            }
            state.is_logged = false;

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('valid_to');
        },
    },
    actions: {
        doLogin(context, data) {
            return axios
                .post('/api/auth/login', data)
                .then((response) => {
                    context.commit('auth_success', response.data.token);
                });
        },
        doLogout(context) {
            return axios
                .get('/api/auth/logout')
                .then(() => {
                    context.commit('logout_success')
                });
        },
        refreshToken(context) {
            if (!context.getters.getRefreshToken) {
                context.commit('auth_fail');
                return Promise.reject(new Error('no refresh token'));
            }

            return axios
                .put('/api/auth/refreshtoken', { refresh_token: context.getters.getRefreshToken })
                .then((response) => {
                    context.commit('auth_success', response.data.token);
                })
                .catch((err) => {
                    context.commit('auth_fail');
                    // console.log(err);
                    if (err.response) {
                        console.error(err.response.data.error)
                    }
                });
        },
        checkLogin(context) {
            return new Promise((resolve, reject) => {
                if (context.state.token.valid_to) {
                    if (new Date() > new Date(context.state.token.valid_to)) {
                        context.state.token.access_token = null;
                        context.state.is_logged = false;

                        localStorage.removeItem('access_token');
                    } else {
                        return reject('token was expired');
                    }
                } else {
                    return reject('date is not valid');
                }

                if (context.state.token.access_token) {
                    context.state.is_logged = true
                }

                return resolve('checked');
            });
        },
    },
    getters: {
        getAccessToken: state => state.token.access_token,
        getRefreshToken: state => state.token.refresh_token,
        getValidTo: state => state.token.valid_to,
        //
        isLogged: state => state.is_logged,
    }
})
