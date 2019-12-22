<template>
  <div class="layout layout--default">
    <background-fullscreen
      :src="easterEgg.image || background.image"
      :color="easterEgg.color || background.color"
      :class="easterEgg.color ? 'easter-egg' : ''"
      darken
    ></background-fullscreen>

    <!-- for autoplay to work there needs to be playlist query field, but it turns out it can use value of the video itself.
        Alsp autoplay doesn't work on mobile (and if device toolbar is enabled in Chromium) -->
    <iframe
      v-if="easterEgg.youtube"
      width="0"
      height="0"
      :src="
        `https://www.youtube-nocookie.com/embed/${easterEgg.youtube}?autoplay=1&loop=1&playlist=${easterEgg.youtube}`
      "
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>

    <the-header></the-header>

    <main>
      <nuxt />
    </main>

    <the-footer></the-footer>

    <browser-not-supported></browser-not-supported>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import maps, { Map } from 'assets/maps';
import TheHeader from '~/components/TheHeader.vue';
import TheFooter from '~/components/TheFooter.vue';
import BackgroundFullscreen from '~/components/BackgroundFullscreen.vue';
import BrowserNotSupported from '~/components/BrowserNotSupported.vue';

// ignore that easter egg stuff... it'll be removed soon(ish) 😳
interface EasterEgg {
  text: string;
  image: string;
  color: string;
  youtube: string;
}

const easterEgg: EasterEgg = {
  text: 'fitzy',
  image: 'https://static-cdn.jtvnw.net/emoticons/v1/192335/3.0',
  color: '#cd99a9',
  youtube: 'li9xDS7DS80' // 'SszvfaF_RfE' '9oRk4IQzdng'
};

const randomMapCached: string = Object.keys(maps)[Math.floor(Math.random() * Object.keys(maps).length)];

let easterEggTextCached: string;

export default Vue.extend({
  components: {
    TheHeader,
    TheFooter,
    BackgroundFullscreen,
    BrowserNotSupported
  },
  data() {
    return {
      easterEgg: {} as EasterEgg,
      easterEggText: '',
      background: { color: 'white', image: '' }
    };
  },
  computed: {
    randomMap(): Map {
      return maps[randomMapCached];
    }
  },
  mounted() {
    this.easterEggText = easterEggTextCached;

    if (easterEggTextCached === easterEgg.text) {
      this.easterEgg = easterEgg;
    } else {
      window.addEventListener('keydown', this.onKeyDown, true);

      this.background.color = require('~/assets/maps/' + randomMapCached + '/background.jpg?lqip-colors')[0];

      // eslint-disable-next-line no-undef
      if (Modernizr.webp) {
        this.background.image = require('~/assets/maps/' + randomMapCached + '/background.jpg?webp');
      } else {
        this.background.image = require('~/assets/maps/' + randomMapCached + '/background.jpg');
      }
    }
  },
  beforeDestroy() {
    easterEggTextCached = this.easterEggText;
    window.removeEventListener('keydown', this.onKeyDown, true);
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      const temp = this.easterEggText + event.key.toLowerCase();
      if (easterEgg.text.startsWith(temp)) {
        this.easterEggText = temp;

        if (this.easterEggText === easterEgg.text) {
          this.easterEgg = easterEgg;
          window.removeEventListener('keydown', this.onKeyDown, true);
        }
      } else {
        this.easterEggText = '';

        // if restarted the string and key matches first letter put it in the easter egg
        if (easterEgg.text.startsWith(event.key)) {
          this.easterEggText = event.key;
        }
      }
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
    //align-items: center;
    max-width: $max-width;
    align-self: center;
    width: 100%;

    > *:first-child {
      padding-top: 0;
    }
  }
}

.easter-egg {
  background-repeat: repeat;
  background-size: auto;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-repeat: repeat;
    background-image: url(https://cdn.betterttv.net/emote/567b5b520e984428652809b6/3x);
  }
}
</style>
