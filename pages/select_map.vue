<template>
  <!-- client-only to fix flashing content when loaded because Material Components Vue doesn't support SSR -->
  <client-only>
    <div class="page">
      <header>
        <h2>Select map to compare boundaries</h2>

        <nav>
          <radio-button
            v-for="(mapType, key) in mapTypes"
            :key="key"
            v-model="mapFilter"
            name="map"
            :value="mapType"
            :label="key"
          ></radio-button>
        </nav>
      </header>

      <main>
        <!-- <m-layout-grid-inner> and transition-group doesn't work... -->
        <transition-group tag="div" class="mdc-layout-grid__inner" name="fade--card-group">
          <m-layout-grid-cell v-for="(map, name) in filteredMaps[mapFilter]" :key="'key-' + name" :span="4">
            <nuxt-link :to="getUrl(name)" class="mdc-card__interactive-container">
              <m-card class="mdc-card--interactive">
                <m-card-media
                  :style="{ backgroundColor: backgroundColor(name), backgroundImage: backgroundImage(name) }"
                  :square="false"
                  sixteen-nine
                >
                  <h3>{{ map.name }}</h3>
                </m-card-media>
              </m-card>
            </nuxt-link>
          </m-layout-grid-cell>
        </transition-group>
        <!-- </m-layout-grid-inner> -->
      </main>

      <back-button to="/"></back-button>
    </div>
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue';
import RadioButton from '~/components/RadioButton.vue';
import BackButton from '~/components/BackButton.vue';
import maps, { filteredMaps, MapTypes } from '~/assets/maps';

let mapFilterCached: MapTypes = MapTypes.Assault;

export default Vue.extend({
  components: {
    RadioButton,
    BackButton
  },
  data() {
    return {
      mapFilter: mapFilterCached
    };
  },
  computed: {
    filteredMaps() {
      return filteredMaps;
    },
    mapTypes() {
      return MapTypes;
    }
  },
  mounted() {
    if (mapFilterCached) {
      this.mapFilter = mapFilterCached;
    }
  },
  beforeDestroy() {
    mapFilterCached = this.mapFilter;
  },
  methods: {
    backgroundImage: (name: string) => {
      return 'url(' + require('~/assets/maps/' + name + '/background.jpg?resize&size=600') + ')'; // converting to webp doesn't work after resizing (https://github.com/bazzite/nuxt-optimized-images/issues/2)
    },
    backgroundColor: (name: string): string => {
      return require('~/assets/maps/' + name + '/background.jpg?lqip-colors')[0];
    },
    getUrl(map: string) {
      const point = Object.keys(maps[map].points)[0];
      const side = Object.keys(maps[map].points[point].sides)[0];
      return `/compare?map=${map}&point=${point}&side=${side}`;
    }
  },
  head() {
    return {
      title: 'Select Map'
    };
  },
  layout: 'fullscreen'
});
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';
@import '~/assets/scss/mixins';

header {
  text-align: center;

  h2 {
    @include text-primary-centered;
    margin-top: 0;
    margin-bottom: 0.375em !important;
  }
}

nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  //padding-bottom: 4px;
  margin-bottom: -8px;
  padding-bottom: 8px;

  .radio-button {
    margin-bottom: 8px;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
}
</style>
