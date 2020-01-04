<template>
  <div class="layout layout--default">
    <fullscreen-background :src="background.image" :color="background.color" darken></fullscreen-background>
    <the-header></the-header>
    <main>
      <nuxt />
    </main>
    <the-footer></the-footer>
    <browser-not-supported-snackbar></browser-not-supported-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import maps, { Map } from 'assets/maps';
import TheHeader from '~/components/TheHeader.vue';
import TheFooter from '~/components/TheFooter.vue';
import FullscreenBackground from '~/components/FullscreenBackground.vue';
import BrowserNotSupportedSnackbar from '~/components/BrowserNotSupportedSnackbar.vue';

const randomMapCached: string = Object.keys(maps)[Math.floor(Math.random() * Object.keys(maps).length)];

export default Vue.extend({
  components: {
    TheHeader,
    TheFooter,
    FullscreenBackground,
    BrowserNotSupportedSnackbar
  },
  data() {
    return {
      background: { color: 'white', image: '' }
    };
  },
  computed: {
    randomMap(): Map {
      return maps[randomMapCached];
    }
  },
  mounted() {
    this.background.color = require('~/assets/maps/' + randomMapCached + '/background.jpg?lqip-colors')[0];

    // eslint-disable-next-line no-undef
    if (Modernizr.webp) {
      this.background.image = require('~/assets/maps/' + randomMapCached + '/background.jpg?webp');
    } else {
      this.background.image = require('~/assets/maps/' + randomMapCached + '/background.jpg');
    }
  }
});
</script>

<style lang="scss">
// layout styles works weirdly (https://github.com/nuxt/nuxt.js/issues/3877) so just use BEM
// also when style is scoped stuff is not getting applied to contents of the page

@import '~assets/scss/variables';

.layout--default {
  > main {
    flex-grow: 1; // push footer to the bottom
    flex-shrink: 0; // IE11 fix
    display: flex;
    flex-direction: column;
    max-width: $max-width;
    align-self: center;
    width: 100%;

    > *:first-child {
      padding-top: 0;
    }
  }
}
</style>
