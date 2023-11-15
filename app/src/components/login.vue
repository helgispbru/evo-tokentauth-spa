<template>
  <div>
    <h4>Login</h4>
    <form v-if="!isLogged" v-on:submit.prevent="login">
      <input
        v-model="form.username"
        type="text"
        placeholder="username"
        :class="{ 'has-error': errors.hasOwnProperty('username') }" />
      <p v-if="errors.hasOwnProperty('username') && errors.username.length">
        <small v-for="el in errors.username">{{ el }}</small
        ><br />
      </p>
      <input
        v-model="form.password"
        type="password"
        placeholder="password"
        :class="{ 'has-error': errors.hasOwnProperty('password') }" />
      <p v-if="errors.hasOwnProperty('password') && errors.password.length">
        <small v-for="el in errors.password">{{ el }}</small
        ><br />
      </p>
      <p v-if="message.length">{{ message }}</p>
      <button type="submit">Login</button>
    </form>
    <p v-else>Already logged in</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      message: '',
      errors: {},
    };
  },
  computed: {
    isLogged() {
      return this.$store.getters.isLogged;
    },
  },
  components: {
    //
  },
  methods: {
    login() {
      this.message = '';
      this.errors = {};

      this.$store
        .dispatch('doLogin', this.form)
        .then(() => {
          this.$router.push({ name: 'home' });
        })
        .catch((err) => {
          switch (err.response.status) {
            case 400: // ошибка валидации
              this.errors = err.response.data.error;
              break;
            case 500: // ошибка обработки
              this.message = err.response.data.error;
              break;
            default:
              console.log(err);
          }
        });
    },
  },
};
</script>

<style lang="scss">
//
</style>
