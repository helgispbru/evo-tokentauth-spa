<template>
  <div id="app" class="small-container">
    <header>
      <nav>
        <template><router-link :to="{ name: 'home' }" exact>Home</router-link></template>
        <template v-if="!isLogged"><router-link :to="{ name: 'login' }">Login</router-link></template>
        <template v-if="isLogged"><router-link :to="{ name: 'secure' }">Secure</router-link></template>
        <template v-if="isLogged"><a href="#" v-on:click.prevent="logout">Logout</a></template>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
  },
  created: function () {
    this.$store
      .dispatch('checkLogin')
      .then(() => {
        if (!this.$store.getters.isLogged && this.$store.getters.getRefreshToken) {
          this.$store
            .dispatch('refreshToken')
            .then(() => {
              //
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });

    // Add an interceptor to set the Authorization header
    // - запрос
    axios.interceptors.request.use(
      (config) => {
        if (this.$store.getters.isLogged) {
          config.headers['Authorization'] = `Bearer ${this.$store.getters.getAccessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    // - ответ
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 401 && !error.config.__isRetry && this.$store.getters.getRefreshToken) {
          error.config.__isRetry = true;

          return this.$store
            .dispatch('refreshToken')
            .then(() => {
              if (this.$store.getters.isLogged) {
                error.config.headers['Authorization'] = 'Bearer ' + this.$store.getters.getAccessToken;
                error.config.baseURL = undefined;

                return axios.request(error.config);
              } else {
                return Promise.reject(error);
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }

        if (!this.$store.getters.getRefreshToken) {
          this.$store.commit('auth_fail');
          if (this.$route.name !== 'login') {
            this.$router.push({ name: 'login' });
          }
        }

        return Promise.reject(error);
      }
    );
  },
  methods: {
    logout: function () {
      this.$store
        .dispatch('doLogout')
        .then((res) => {
          if (this.$route.name !== 'home') {
            this.$router.push({ name: 'home' });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
header {
  padding: 10px 0;
}
nav {
  a {
    display: inline-block;
    padding: 8px 12px;
  }
  .router-link-active {
    color: white;
    background-color: darkgray;
    text-decoration: none;
  }
}
</style>
