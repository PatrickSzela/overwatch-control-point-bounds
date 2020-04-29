<template>
  <!-- client-only to fix flashing content when loaded because Material Components Vue doesn't support SSR -->
  <client-only>
    <div class="page">
      <header>
        <nav>
          <select-fixed id="mapSelect" v-model="queryMap" name="map" enhanced :disabled="Object.keys(maps).length <= 1">
            <m-list-item
              v-for="(map, key) in maps"
              :key="key"
              :data-value="key"
              :ripple="false"
              :selected="queryMap === key"
            >
              <template slot="text">
                {{ map.name }}
              </template>
            </m-list-item>
          </select-fixed>

          <i class="separator" role="separator">/</i>

          <select-fixed
            id="pointSelect"
            v-model="queryPoint"
            name="pont"
            enhanced
            :disabled="Object.keys(currentMap.points).length <= 1"
          >
            <m-list-item
              v-for="(point, key) in currentMap.points"
              :key="key"
              :data-value="key"
              :ripple="false"
              :selected="queryPoint === key"
            >
              <template slot="text">
                {{ point.name }}
              </template>
            </m-list-item>
          </select-fixed>

          <i class="separator" role="separator">/</i>

          <select-fixed
            id="sideSelect"
            v-model="querySide"
            name="side"
            enhanced
            :disabled="Object.keys(currentPoint.sides).length <= 1"
          >
            <m-list-item
              v-for="(side, key) in currentPoint.sides"
              :key="key"
              :data-value="key"
              :ripple="false"
              :selected="querySide === key"
            >
              <template slot="text">
                {{ side.name }}
              </template>
            </m-list-item>
          </select-fixed>
        </nav>
      </header>

      <main>
        <compare-images
          :left-image="leftImage"
          :right-image="rightImage"
          :background="background"
          :details="currentSide.details"
          :height="currentSide.height"
        ></compare-images>
      </main>

      <footer>
        <div class="footer__content">
          <h4>Notes:</h4>
          <ul>
            <li>
              If there's no "Height" option in the 3rd drop-down it means that this point's detection hitbox is as high
              as the skybox or it touches the ceiling.
            </li>
            <li>
              Height of the control point is marked with a pink orb. Additionally I've added a pink line so it's easier
              to compare its height to the rest of the map (camera is perpendicular to the ceiling of the detection
              hitbox). Please note that the boundaries from the top-down view also apply here (but aren't as
              "advanced")!
            </li>
            <li>
              Please remember that images presented above are distored by camera's perspective. For even more accurate
              bounds, check out <nuxt-link to="/custom_game">Custom Game</nuxt-link>.
            </li>
          </ul>
        </div>
      </footer>

      <back-button to="/select_map"></back-button>
    </div>
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue';
import CompareImages from '~/components/CompareImages.vue';
import SelectFixed from '~/components/SelectFixed.vue';
import BackButton from '~/components/BackButton.vue';
import maps, { Map, MapPoint, MapSide } from '~/assets/maps';

function isMap(map: string) {
  return Object.prototype.hasOwnProperty.call(maps, map);
}

function isPoint(map: string, point: string) {
  if (isMap(map)) {
    return Object.prototype.hasOwnProperty.call(maps[map].points, point);
  }
  return false;
}

function isSide(map: string, point: string, side: string) {
  if (isPoint(map, point)) {
    return Object.prototype.hasOwnProperty.call(maps[map].points[point].sides, side);
  }
  return false;
}

export default Vue.extend({
  components: {
    CompareImages,
    SelectFixed,
    BackButton
  },
  computed: {
    maps(): { [index: string]: Map } {
      return maps;
    },
    currentMap(): Map {
      return maps[this.queryMap];
    },
    currentPoint(): MapPoint {
      return this.currentMap.points[this.queryPoint];
    },
    currentSide(): MapSide {
      return this.currentPoint.sides[this.querySide];
    },
    leftImage(): string {
      return this.image('mask_ingame', true);
    },
    rightImage(): string {
      return this.image('mask_real', true);
    },
    background(): string {
      return this.image('background');
    },
    src(): string {
      return `${this.queryMap}/${this.currentPoint.src}/${this.currentSide.src}/`;
    },
    queryMap: {
      get(): string {
        return this.$route.query.map as string;
      },
      set(value: string) {
        this.query(value);
      }
    },
    queryPoint: {
      get(): string {
        return this.$route.query.point as string;
      },
      set(value: string) {
        this.query(this.queryMap, value);
      }
    },
    querySide: {
      get(): string {
        return this.$route.query.side as string;
      },
      set(value: string) {
        this.query(this.queryMap, this.queryPoint, value);
      }
    }
  },
  methods: {
    query(map: string = '', point: string = '', side: string = '') {
      if (!map) {
        map = Object.keys(maps)[0];
      }
      if (!point || !isPoint(map, point)) {
        point = Object.keys(maps[map].points)[0];
      }
      if (!side || !isSide(map, point, side)) {
        side = Object.keys(maps[map].points[point].sides)[0];
      }

      this.$router.push({ path: this.$route.path, query: { map, point, side } });
    },
    image(filename: string, webpAlpha: boolean = false): string {
      try {
        // eslint-disable-next-line no-undef
        if (webpAlpha ? Modernizr.webpalpha : Modernizr.webp) {
          return require('~/assets/maps/' + this.src + filename + '.png?webp');
        } else {
          return require('~/assets/maps/' + this.src + filename + '.png');
        }
      } catch (e) {
        return '';
      }
    }
  },
  head() {
    return {
      title: maps[this.$route.query.map as string].name
    };
  },
  layout: 'fullscreen',
  middleware({ redirect, query }) {
    if (!isSide(query.map as string, query.point as string, query.side as string)) {
      redirect('/select_map');
    }
  }
});
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables';
@import '~assets/scss/mixins';
@import '@material/typography/mixins';
@import '@material/layout-grid/mixins';
@import '@material/ripple/mixins';
@import '@material/select/mixins';

nav {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  user-select: none;

  // very hacky way to deal with h1 scaling and it margins
  transform: map-get($typography-font-family-primary-base, 'transform');
  margin: map-get($typography-font-family-primary-base, 'margin');
  margin-top: 0;
  margin-bottom: 0;
  padding-bottom: 8px;

  @media (min-width: mdc-layout-grid-breakpoint-min('desktop')) {
    flex-direction: row;
    align-items: baseline;
    padding-bottom: 0;

    .separator {
      display: initial;
    }
  }

  .separator {
    margin: 0 0 $text-uppercase-margin-bottom;
    transform: none;
    white-space: nowrap;
  }

  .separator {
    @include mdc-typography('headline2');
    @include headline-media-sizes('headline2');
    margin: 0 0.6em $text-uppercase-margin-bottom 0.4em;
    display: none;

    &:first-of-type {
      @include mdc-typography('headline1');
      @include headline-media-sizes('headline1');
      margin: 0 0.6em $text-uppercase-margin-bottom 0.4em;
    }

    @media (min-width: mdc-layout-grid-breakpoint-min('desktop')) {
      display: initial;
    }
  }

  .material-design-icon {
    margin-left: 0.65rem;
    width: 0.625em;
    height: 0.625em;

    &__svg {
      height: 100%;
      width: 100%;
      bottom: 0;
    }
  }
}

footer {
  .footer__content {
    @include mdc-theme-prop(color, 'text-primary-on-dark');
    background-color: $mdc-theme-surface-secondary;

    @each $size in map-keys($mdc-layout-grid-columns) {
      @include mdc-layout-grid-media-query_($size) {
        padding: map-get($mdc-layout-grid-default-gutter, $size);
      }
    }

    p,
    li {
      @include mdc-typography('caption');
      font-size: 0.875em;
      //text-align: center;
      margin: 0.5em 0;
    }

    > *:first-child {
      margin-top: 0;
    }

    > *:last-child {
      margin-bottom: 0;
    }

    ul {
      margin-top: 0;
    }
  }
}

.mdc-select {
  background: transparent;
  margin: -8px;

  @media (max-width: mdc-layout-grid-breakpoint-max('tablet')) {
    margin-top: 0;
    margin-bottom: 0;

    &:first-child {
      margin-top: -8px;
    }

    &:last-child {
      margin-bottom: -8px;
    }
  }

  &:hover,
  &:focus,
  &:active,
  &--focused {
    background: $mdc-theme-surface-secondary;

    /deep/ .mdc-select__selected-text {
      color: white !important;
    }
  }

  /deep/ &__selected-text {
    color: inherit !important;
    transform: none !important;
    margin: 0 0 $text-uppercase-margin-bottom 0 !important;
    min-width: initial;
    padding-right: 1.125em;
  }

  /deep/ &__dropdown-icon {
    @include mdc-select-dd-arrow-svg-bg_(#333333, 0.87);
    background-size: 100% !important;
    height: 0.35em;
    width: 0.35em;
    right: 16px;

    .mdc-select--focused &,
    .mdc-select:hover &,
    .mdc-select:focus &,
    .mdc-select:active & {
      @include mdc-select-dd-arrow-svg-bg_(#ffffff, 1);
    }
  }

  /deep/ &:nth-of-type(1) {
    .mdc-select__selected-text {
      @include mdc-typography('headline1');
    }

    .mdc-select__selected-text,
    .mdc-select__dropdown-icon {
      @include headline-media-sizes('headline1');
    }
  }

  /deep/ &:nth-of-type(2) {
    .mdc-select__selected-text {
      @include mdc-typography('headline2');
    }

    .mdc-select__selected-text,
    .mdc-select__dropdown-icon {
      @include headline-media-sizes('headline2');
    }
  }

  /deep/ &:nth-of-type(3) {
    .mdc-select__selected-text {
      @include mdc-typography('headline3');
    }

    .mdc-select__selected-text,
    .mdc-select__dropdown-icon {
      @include headline-media-sizes('headline3');
    }
  }
}
</style>
