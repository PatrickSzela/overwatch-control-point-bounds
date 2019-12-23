<template>
  <!-- client-only to fix flashing content when loaded because Material Components Vue doesn't support SSR -->
  <client-only>
    <m-layout-grid>
      <m-layout-grid-inner>
        <m-layout-grid-cell :span="12">
          <m-card class="mdc-card--layout-gutter mdc-card--custom-game">
            <m-card-media class="control-point-media" sixteen-nine :square="false"></m-card-media>

            <m-card-primary title="Compare boundaries of control points"></m-card-primary>

            <m-card-secondary>
              <p>
                boundaries of every control point in the game (except those from Arcade maps) have been manually
                "mapped" and now are surrounded with a "grapple effect", which shows the more accurate bounds.
              </p>
              <p>
                After importing the code just select map which you would like to check out, start the game and then
                start the game mode. Everything else is handled automatically!
              </p>
              <p>
                <strong>There are a few thing you should know:</strong>
              </p>
              <ul>
                <li>
                  If you want to check out bounds of control points in Control game mode, don't forget to select the
                  proper point in game mode settings.
                </li>
                <li>
                  To compare bounds of the 2nd point in Assault game mode, firstly you have to capture the 1st point.
                </li>
              </ul>
            </m-card-secondary>
          </m-card>
        </m-layout-grid-cell>

        <m-layout-grid-cell :span="12">
          <m-card class="mdc-card--layout-gutter mdc-card--payload">
            <div>
              <m-card-primary title="Find out cool stalling point on payload maps"></m-card-primary>

              <m-card-secondary>
                <p>
                  Additionally I've added a big, yellow sphere around every payload in the game. According to my
                  research detection radius of every payload equals to about 7 meters, so feel free to hop in and find
                  some interesting stalling spots. Don't forget that contesting it requires you to have a line of sight
                  with it!
                </p>
              </m-card-secondary>
            </div>

            <!-- <m-card-media class="payload-media" sixteen-nine :square="false"></m-card-media> -->
            <img class="image--payload" src="~/assets/images/payload.png?webp" alt="Payload" />
          </m-card>
        </m-layout-grid-cell>

        <m-layout-grid-cell :span="12">
          <m-button
            class="button--copy-custom-game-code"
            raised
            title="Press to copy the code to the clipboard"
            :ripple="false"
            @click="copyCustomGameCode"
            >Custom Game code: {{ customGameCode }}</m-button
          >
        </m-layout-grid-cell>
      </m-layout-grid-inner>

      <m-snackbar
        :open="copyCustomGameCodeSuccedeed"
        label-text="Copied Custom Game code to the clipboard"
      ></m-snackbar>

      <m-snackbar
        :open="copyCustomGameCodeFailed"
        label-text="Failed to copy Custom Game code to the clipboard"
      ></m-snackbar>

      <button-back to="/"></button-back>
    </m-layout-grid>
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue';
import ButtonBack from '~/components/ButtonBack.vue';

export default Vue.extend({
  components: {
    ButtonBack
  },
  data() {
    return {
      customGameCode: 'N165P',
      copyCustomGameCodeSuccedeed: false,
      copyCustomGameCodeFailed: false
    };
  },
  methods: {
    copyCustomGameCode() {
      // TODO: add old browsers support?
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(this.customGameCode)
          .then(() => {
            this.copyCustomGameCodeSuccedeed = true;
          })
          .catch(() => {
            this.copyCustomGameCodeFailed = true;
          });
      } else {
        this.copyCustomGameCodeFailed = true;
      }

      setTimeout(() => {
        this.copyCustomGameCodeFailed = false;
        this.copyCustomGameCodeSuccedeed = false;
      }, 5000);
    }
  },
  head() {
    return {
      title: 'Custom Game'
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~assets/scss/mixins';
@import '@material/layout-grid/mixins';

.control-point-media {
  @include webp('~assets/images/control_point.jpg');
  background-color: black;
}

.payload-media {
  @include webp('~assets/images/payload.png');
  width: 100%;
  margin: -24px -24px 24px 24px;
  flex-basis: 33%;
}

.mdc-card {
  &--custom-game {
    /deep/ .mdc-card__title {
      @include text-primary-centered;
      text-align: center;
    }
  }

  &--payload {
    flex-direction: column-reverse;

    @media (min-width: mdc-layout-grid-breakpoint-min('desktop')) {
      flex-direction: row;
    }

    @media (max-width: mdc-layout-grid-breakpoint-max('tablet')) {
      /deep/ .mdc-card__title {
        @include text-primary-centered;
        text-align: center;
      }
    }

    img {
      width: 80%;
      height: 100%;
      align-self: center;
      max-width: 320px;
      margin: -12px -12px 0 0;

      @media (min-width: mdc-layout-grid-breakpoint-min('desktop')) {
        width: 40%;
        max-width: 400px;
        margin: -24px -24px 24px 24px;
      }
    }
  }

  &--custom-game {
    .mdc-card__media {
      max-height: 350px;
    }
  }
}

.button--copy-custom-game-code {
  width: 100%;
}
</style>
