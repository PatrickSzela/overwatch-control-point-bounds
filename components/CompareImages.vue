<template>
  <client-only>
    <m-card ref="compareImages" class="compare-images" :class="{ 'compare-images--fullscreen': isFullscreenEnabled }">
      <div class="compare-images__inner">
        <vue-compare-image
          v-if="!isOverlayImagesEnabled && leftImage && rightImage"
          :left-image="leftImage"
          :right-image="rightImage"
          left-image-alt="In-game bounds"
          right-image-alt="More accurate bounds"
          :style="{ backgroundImage: 'url(' + background + ')' }"
          class="compare-images__vci"
          :class="{
            'compare-images__vci--disabled': loadingState === loadingStates.Failed
          }"
        ></vue-compare-image>

        <div v-else class="compare-images__overlay-images" :style="{ backgroundImage: 'url(' + background + ')' }">
          <div v-if="leftImage" class="left-image" :style="{ backgroundImage: 'url(' + leftImage + ')' }"></div>
          <div v-if="rightImage" class="right-image" :style="{ backgroundImage: 'url(' + rightImage + ')' }"></div>
          <div v-if="height" class="perpendicular-line"></div>
        </div>

        <div v-if="height" class="compare-images__info">
          <h4>Height: {{ height }}m</h4>
        </div>

        <div
          v-if="isDetailsOverlayEnabled && !isScreenTooSmall && loadingState === loadingStates.Finished"
          class="compare-images__details-overlay"
        >
          <m-icon-button
            v-for="(detail, index) in details"
            :key="index"
            :ripple="false"
            class="compare-images__detail-activator"
            :style="detailActivatorPosition(detail)"
            @mouseover="activeDetail = detail"
            @mouseleave="activeDetail = null"
          >
            <m-icon :icon="detail.contestable ? 'check_circle' : 'cancel'"></m-icon>
          </m-icon-button>
        </div>

        <transition name="fade--dialog">
          <details-card
            v-if="activeDetail && !isScreenTooSmall && loadingState === loadingStates.Finished"
            :title="activeDetail.contestable ? 'Contestable' : 'Not contestable'"
            :description="activeDetail.description"
            :difficulty="activeDetail.difficulty"
            class="compare-images__detail-card"
            :style="detailsCardPosition"
          ></details-card>
        </transition>

        <transition name="fade--dialog">
          <div v-if="loadingState !== loadingStates.Finished" class="compare-images__loading-overlay">
            <overwatch-spinner v-if="loadingState === loadingStates.Loading" light></overwatch-spinner>
            <p v-else-if="loadingState === loadingStates.Failed">Something went wrong while downloading image(s).</p>
          </div>
        </transition>

        <m-snackbar
          :open="isScreenTooSmall"
          :has-dismiss="true"
          label-text="Your screen size is too small and some functionality will be unavailable. Try entering fullscreen mode?"
        ></m-snackbar>
      </div>

      <div class="compare-images__controls">
        <m-icon-button
          :value="isDetailsOverlayEnabled"
          :title="isDetailsOverlayEnabled ? 'Disable details overlay' : 'Enable details overlay'"
          toggle-on-label="Enable details overlay"
          toggle-off-label="Disable details overlay"
          :disabled="isScreenTooSmall || !details.length"
          ripple="false"
          @change="isDetailsOverlayEnabled = $event"
        >
          <m-icon slot="toggleOn" icon="layers"></m-icon>
          <m-icon slot="toggleOff" icon="layers_clear"></m-icon>
        </m-icon-button>

        <m-icon-button
          :value="isOverlayImagesEnabled"
          :title="isOverlayImagesEnabled ? 'Compare images' : 'Overlay images'"
          toggle-on-label="Overlay images"
          toggle-off-label="Compare images"
          :disabled="!leftImage || !rightImage"
          ripple="false"
          @change="isOverlayImagesEnabled = $event"
        >
          <m-icon slot="toggleOn" icon="collections"></m-icon>
          <m-icon slot="toggleOff" icon="compare"></m-icon>
        </m-icon-button>

        <m-icon-button
          :value="isFullscreenEnabled"
          :title="isFullscreenEnabled ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'"
          toggle-on-label="Enter fullscreen (F)"
          toggle-off-label="Exit fullscreen (F)"
          :disabled="!isFullscreenSupported()"
          ripple="false"
          @change="isFullscreenEnabled = $event"
        >
          <m-icon slot="toggleOn" icon="fullscreen"></m-icon>
          <m-icon slot="toggleOff" icon="fullscreen_exit"></m-icon>
        </m-icon-button>
      </div>
    </m-card>
  </client-only>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import VueCompareImage from 'vue-compare-image';
import OverwatchSpinner from '~/components/OverwatchSpinner.vue';
import DetailsCard from '~/components/DetailsCard.vue';
import { MapDetails } from '~/assets/maps';

export enum ImageTypes {
  Left = 'left',
  Right = 'right',
  Background = 'background'
}

export enum LoadingStates {
  Loading = 'loading',
  Failed = 'failed',
  Finished = 'finished'
}

export default Vue.extend({
  components: { VueCompareImage, OverwatchSpinner, DetailsCard },
  props: {
    leftImage: {
      type: String,
      default: null
    },
    rightImage: {
      type: String,
      default: null
    },
    background: {
      type: String,
      required: true
    },
    details: {
      type: Array as PropType<MapDetails[]>,
      default: () => []
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isFullscreenEnabled: false,
      isOverlayImagesEnabled: true,
      isDetailsOverlayEnabled: true,
      isScreenTooSmall: false,
      images: { left: new Image(), right: new Image(), background: new Image() },
      loadingState: LoadingStates.Loading,
      activeDetail: null
    };
  },
  computed: {
    detailsCardPosition() {
      const pos = { top: '', right: '', bottom: '', left: '' };

      if (this.activeDetail) {
        // @ts-ignore: Object is possibly 'null'.
        const offsetX = this.activeDetail.position.x / this.images.background.width;
        // @ts-ignore: Object is possibly 'null'.
        const offsetY = this.activeDetail.position.y / this.images.background.height;

        if (offsetX > 0.5) {
          pos.right = `${100 - offsetX * 100}%`;
        } else {
          pos.left = `${offsetX * 100}%`;
        }

        if (offsetY > 0.5) {
          pos.bottom = `${100 - offsetY * 100}%`;
        } else {
          pos.top = `${offsetY * 100}%`;
        }
      }

      return pos;
    },
    loadingStates() {
      return LoadingStates;
    }
  },
  watch: {
    // handler with string as a value throws an ESLint error
    background: {
      handler(value: string) {
        this.preload(value, ImageTypes.Background);
      },
      immediate: true
    },
    leftImage: {
      handler(value: string) {
        if (value) {
          this.preload(value, ImageTypes.Left);
        }
      },
      immediate: true
    },
    rightImage: {
      handler(value: string) {
        if (value) {
          this.preload(value, ImageTypes.Right);
        }
      },
      immediate: true
    },
    isFullscreenEnabled: {
      handler(value: boolean) {
        if (value && !document.fullscreenElement) {
          const compareImages = (this.$refs.compareImages as Vue).$el;
          this.requestFullscreen(compareImages);
        } else if (!value) {
          this.exitFullscreen();
        }
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onFKeyDown, true);
    window.addEventListener('resize', this.onWindowResize);

    // won't work when called immediately
    setTimeout(() => {
      this.onWindowResize();
    }, 1);

    Object.values(this.images).forEach((image) => {
      image.onload = () => {
        if (Object.values(this.images).every((item) => item.complete)) {
          this.loadingState = LoadingStates.Finished;
        }
      };
      image.onerror = () => {
        this.loadingState = LoadingStates.Failed;
      };
    });
  },
  beforeDestroy() {
    this.isFullscreenEnabled = false;

    window.removeEventListener('keydown', this.onFKeyDown, true);
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    preload(image: string, type: ImageTypes) {
      this.loadingState = LoadingStates.Loading;
      this.images[type].src = image;

      this.activeDetail = null;
    },
    isFullscreenSupported() {
      // doc is type of any because TS doesn't like fullscreen prefixes
      const doc: any = document;
      return (
        doc.fullscreenEnabled || doc.mozFullscreenEnabled || doc.webkitFullscreenEnabled || doc.msFullscreenEnabled
      );
    },
    // elem is type of any because TS doesn't like fullscreen prefixes
    requestFullscreen(elem: any) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }

      document.addEventListener('fullscreenchange', this.onFullscreenChange);
      document.addEventListener('mozfullscreenchange', this.onFullscreenChange);
      document.addEventListener('webkitfullscreenchange', this.onFullscreenChange);
      document.addEventListener('msfullscreenchange', this.onFullscreenChange);

      // eslint-disable-next-line no-undef
      // Modernizr.deviceorientation seems to not being detected properly?
      if (window.screen.orientation) {
        window.screen.orientation.lock('landscape').catch(() => {
          // do not throw an error when it's not possible to change orientation because functionality is not supported on device
        });
      }
    },
    exitFullscreen() {
      // doc is type of any because TS doesn't like fullscreen prefixes
      const doc: any = document;
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }

      document.removeEventListener('fullscreenchange', this.onFullscreenChange);
      document.removeEventListener('mozfullscreenchange', this.onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', this.onFullscreenChange);
      document.removeEventListener('msfullscreenchange', this.onFullscreenChange);

      // eslint-disable-next-line no-undef
      if (Modernizr.deviceorientation) {
        window.screen.orientation.unlock();
      }
    },
    detailActivatorPosition(detail: MapDetails) {
      const pos = { top: '', left: '' };
      pos.top = `${(detail.position.y / this.images.background.height) * 100}%`;
      pos.left = `${(detail.position.x / this.images.background.width) * 100}%`;
      return pos;
    },
    onFKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      if (
        event.key.toLowerCase() === 'f' &&
        !event.repeat &&
        !event.altKey &&
        !event.shiftKey &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        this.isFullscreenEnabled = !this.isFullscreenEnabled;
      }
    },
    onFullscreenChange(event: Event) {
      if (event.target) {
        const doc: any = document;
        this.isFullscreenEnabled =
          doc.fullscreenElement === event.target ||
          doc.webkitFullscreenElement === event.target ||
          doc.mozFullScreenElement === event.target ||
          doc.msFullscreenElement === event.target;
      }
    },
    onWindowResize() {
      this.isScreenTooSmall = window.innerWidth < 680 || window.innerHeight < 300;
      if (this.isScreenTooSmall) {
        this.activeDetail = null;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables.scss';
@import '@material/icon-button/mixins';
@import '@material/layout-grid/mixins';
@import '@material/typography/mixins';

.compare-images {
  background-color: black;
  position: relative;
  justify-content: center;
  user-select: none;
  z-index: 1;
  flex-shrink: 0; // IE11 fix

  &__inner {
    position: relative;
    margin: 0 auto;
    width: 100%;
    background-color: inherit;
  }

  &--fullscreen &__inner {
    // simulate 'contain' when in fullscreen so images won't be cut off on screens with aspect ratios different from 16x9
    max-width: calc(#{16 / 9} * 100vh);
  }

  &__controls {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    padding: 4px;
    z-index: 5;

    @media (min-width: mdc-layout-grid-breakpoint-min('desktop')) {
      padding: 8px;
    }
  }

  &__details-overlay {
    z-index: 2;
  }

  &__detail-activator {
    padding: 0;
    position: absolute;
    margin-left: -16px;
    margin-top: -16px;
    width: 32px;
    height: 32px;

    .material-icons {
      font-size: 32px;
    }

    &::before,
    &::after {
      content: none; // say no to mdc-ripple
    }
  }

  &__detail-card {
    position: absolute;
    max-width: 300px;
    width: 100%;
    z-index: 3;
    margin: 10px;
  }

  &__loading-overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $mdc-theme-surface-secondary;
    z-index: 4;
    display: flex;
    flex-direction: column;

    p {
      @include mdc-typography('subtitle1');
      margin: 0;
      padding: 36px;
      color: white;
      text-transform: none;
      text-align: center;
    }

    .overwatch-spinner {
      width: 10%;
    }
  }

  &__overlay-images,
  &__vci {
    background-size: cover;
    background-position: center;
    background-color: inherit;
    padding-bottom: 9 / 16 * 100%;
    z-index: 1;
  }

  &__vci {
    overflow: visible !important; // show handle outside of the container

    /deep/ .left-image,
    /deep/ .right-image {
      position: absolute;
      background: inherit; // VueCompareImages clips only left image, which makes right one to show under left one
    }

    /deep/ .left-image {
      z-index: 2;
    }

    &--disabled {
      pointer-events: none;
      padding-bottom: 9 / 16 * 100%; //vci uses img, so if image fails to load, it can shrink itself
    }
  }

  &__overlay-images {
    .left-image,
    .right-image {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-size: cover;
      background-position: center;
    }

    .right-image {
      opacity: 0.75;
    }
  }

  &__info {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0px 10px;
    max-width: 33%;

    h4 {
      color: white;
      text-shadow: 0 0 3px rgba(0, 0, 0, 0.75);
    }
  }

  .mdc-snackbar {
    position: absolute;
    text-align: center;
  }

  .mdc-icon-button {
    @include mdc-icon-button-ink-color(white);
    @include mdc-states-base-color(black);

    z-index: 1; // render ripple below icon
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.75);

    &::before,
    &::after {
      z-index: -1 !important;
    }
  }

  .perpendicular-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    height: 1.5%;
    background-color: #ed4fe9;
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
