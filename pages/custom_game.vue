<template>
  <!-- client-only to fix flashing content when loaded because Material Components Vue doesn't support SSR -->
  <client-only>
    <m-layout-grid>
      <m-layout-grid-inner>
        <m-layout-grid-cell :span="12">
          <m-card class="mdc-card--layout-gutter mdc-card--custom-game">
            <m-card-media sixteen-nine :square="false"></m-card-media>

            <m-card-primary title="Compare boundaries of control points"></m-card-primary>

            <m-card-secondary>
              <p>
                If you wish to compare the boundaries by yourself, check out this Custom Game! Every control point in
                the game (except those from Arcade maps) has been manually "mapped" and is now surrounded by a "grapple
                effect" that marks its more accurate bounds.
              </p>

              <p>
                After importing the code (which you can find on the bottom of this page) just select the map which
                boundaries you would like to compare (from MAPS menu in Custom Game settings) and start the game!
              </p>

              <hr />

              <p>
                <strong>Do event maps have the same boundaries as the non-event ones?</strong>
              </p>
              <p>
                Yes they do! I would add an option to generate bounds for these maps too but there are some technical
                limitations in the Workshop that prohibit me from doing it.
              </p>

              <hr />

              <p>
                <strong>Have you also mapped the height of these boundaries?</strong>
              </p>
              <p>
                Yes! I mean, kind of: mapping the exact boundaries of every control point in 3D space is almost
                impossible to do, so basically I just added a purple orb which marks the height of the "main" part of
                the hitbox, and with some new red orbs I've marked spots where the height of the rest of the hitbox is
                lowered (so you can't contest the point from there).
              </p>

              <hr />

              <p>
                <strong>These purple spheres are lower than they should be...</strong>
              </p>
              <p>
                Well, actually they are not! The detection in Overwatch is based on the centered point on player's feet,
                which makes the detection very consistent (or inconsistent, depending on how you look at it) - it
                doesn't matter if you're a Wrecking Ball or Tracer, only the center of your mass (but on your feet) must
                be on the point so you can contest it. It's a shame that the actual boundaries aren't very accurate...
              </p>

              <hr />

              <p>
                <strong>What are these colorful spheres I can see on some maps?</strong>
              </p>
              <ul>
                <li>Purlple sphere - marks the height of the "main" part of detection hitbox.</li>
                <li>Green sphere - spot where it's possible to contest the point</li>
                <li>Red sphere - spot where it's not possible to contest the point.</li>
              </ul>
              <p>You can use the <nuxt-link to="/compare">Compare</nuxt-link> tool to learn more about them.</p>

              <hr />

              <p>
                <strong>I can't see the boundaries of 2nd point in Assault mode!</strong>
              </p>
              <p>
                To see these bounds, you have to capture the 1st point (just move yourself to Team 2, capture it and
                move back to Team 1). This also requires the game mode to be started (should start automatically by
                default).
              </p>
            </m-card-secondary>
          </m-card>
        </m-layout-grid-cell>

        <m-layout-grid-cell :span="12">
          <m-card class="mdc-card--layout-gutter mdc-card--payload">
            <div class="mdc-card__container">
              <m-card-primary title="Find cool stall spots on payload maps"></m-card-primary>

              <m-card-secondary>
                <p>
                  Additionally I've added a big, yellow sphere around every payload in the game - according to my
                  "research" the detection radius of every payload equals to (about) 7 meters. So feel free to hop in
                  and find some interesting stall spots! Don't forget that contesting the payload requires you to have a
                  line of sight with it.
                </p>

                <hr />

                <p>
                  <strong>Can I disable that sphere?</strong>
                </p>
                <p>
                  Yes you can! Just go to the Workshop and disable "Display sphere around the payload" rule.
                </p>
              </m-card-secondary>
            </div>

            <m-card-media sixteen-nine :square="false"></m-card-media>
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

      <back-button to="/"></back-button>
    </m-layout-grid>
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue';
import BackButton from '~/components/BackButton.vue';

export default Vue.extend({
  components: {
    BackButton
  },
  data() {
    return {
      customGameCode: 'WNSY6',
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

      // Dirty fix because m-snackbar doesn't handle v-model, so I had to resort to using open prop
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

    .mdc-card__container {
      @media (min-width: mdc-layout-grid-breakpoint-min('desktop')) {
        flex-basis: 65%; // additionally IE fix
      }
    }

    .mdc-card__media {
      @include webp('~assets/images/payload.png');
      background-size: contain;
      width: 60%;
      margin: -12px -12px 0 0;
      align-self: center;
      max-width: 280px;

      @media (min-width: mdc-layout-grid-breakpoint-min('desktop')) {
        flex-basis: 35%;
        max-width: none;
        margin: -24px -24px 24px 24px;
      }
    }
  }

  &--custom-game {
    .mdc-card__media {
      @include webp('~assets/images/control_point.jpg');
      background-color: black;
      max-height: 350px;
    }
  }
}

.button--copy-custom-game-code {
  width: 100%;
}
</style>
