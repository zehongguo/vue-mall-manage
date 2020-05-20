<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
}
</script>

<style>
@import url('assets/css/base.css');

#nprogress .bar {
  background: rgb(3, 172, 250) !important;
  height: 2px !important;
}
</style>
