<template>
  <transition name="fade--dialog">
    <nuxt-link v-if="to" :to="to" class="mdc-button mdc-button--outlined button-back">Go back</nuxt-link>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    to: {
      type: String,
      default: ''
    }
  }
});
</script>

<style lang="scss" scoped>
.mdc-button {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 20;
}
</style>
