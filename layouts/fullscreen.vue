<template>
  <div class="layout layout--fullscreen">
    <nuxt />

    <browser-not-supported-snackbar></browser-not-supported-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import BrowserNotSupportedSnackbar from '~/components/BrowserNotSupportedSnackbar.vue';

export default Vue.extend({
  components: {
    BrowserNotSupportedSnackbar
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
      > *:not(.back-button) {
        padding: 0 map-get($mdc-layout-grid-default-margin, $size) map-get($mdc-layout-grid-default-gutter, $size);
      }

      > header {
        padding-top: map-get($mdc-layout-grid-default-margin, $size) !important;
      }

      > footer {
        padding-bottom: map-get($mdc-layout-grid-default-margin, $size) !important;
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
