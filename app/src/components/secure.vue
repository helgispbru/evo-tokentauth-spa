<template>
  <div>
    <h4>This page is protected</h4>
    <p>Send request by click: <button type="button" v-on:click="doCheck()">check</button></p>
    <p>
      <template v-for="el in responses"
        >{{ el.message }} <small>at {{ el.date }}</small
        ><br
      /></template>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      responses: [],
    };
  },
  methods: {
    doCheck() {
      axios
        .get('/api/heartbeat')
        .then((response) => {
          console.info('heartbeat', response.data);
          this.responses.push({ date: new Date().toLocaleTimeString('ru-RU'), message: response.data.message });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
//
</style>
