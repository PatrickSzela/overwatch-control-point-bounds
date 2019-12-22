<template>
  <div class="layout layout--fullscreen">
    <nuxt />

    <browser-not-supported></browser-not-supported>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BrowserNotSupported from '~/components/BrowserNotSupported.vue';

export default Vue.extend({
  components: {
    BrowserNotSupported
  }
});
</script>

<style lang="scss">
// layout styles works weirdly (https://github.com/nuxt/nuxt.js/issues/3877) so just use BEM
// also when style is scoped stuff is not getting applied to contents of the page
// background and layout are already set in global.scss

@import '~assets/scss/variables';
@import '@material/layout-grid/mixins';

.page {
  display: flex;
  flex-direction: column;
  align-self: center;
  height: 100%;
  width: 100%;
  max-width: $max-width;

  @each $size in map-keys($mdc-layout-grid-columns) {
    @include mdc-layout-grid-media-query_($size) {
      > *:not(.button-back) {
        padding: 0 map-get($mdc-layout-grid-default-margin, $size) map-get($mdc-layout-grid-default-gutter, $size);
      }

      > *:first-child:not(.button-back) {
        padding-top: map-get($mdc-layout-grid-default-margin, $size);
      }

      > *:last-child:not(.button-back) {
        padding-bottom: map-get($mdc-layout-grid-default-margin, $size);
      }
    }
  }

  > main {
    flex-grow: 1;
    flex-shrink: 0; // IE11 fix
    display: flex;
    flex-direction: column;
  }
}
</style>
