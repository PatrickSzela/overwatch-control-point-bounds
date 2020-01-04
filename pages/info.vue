<template>
  <!-- client-only to fix flashing content when loaded because Material Components Vue doesn't support SSR -->
  <client-only>
    <m-layout-grid>
      <m-layout-grid-inner>
        <m-layout-grid-cell :span="12">
          <m-card class="mdc-card--layout-gutter">
            <m-card-primary title="Did you know how inaccurate control point boundaries are?"></m-card-primary>

            <m-card-media sixteen-nine :square="false">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube-nocookie.com/embed/2W8RTlhdfp0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </m-card-media>

            <m-card-secondary>
              <p>
                <strong
                  >The video above is outdated and contains an old Custom Game code. Check
                  <nuxt-link to="/custom_game">Custom Game</nuxt-link> page for an updated one. The rest of the video is
                  still up to date.</strong
                >
              </p>
              <p>
                Have you ever tried to contest the point while in Overtime but you failed, even though you thought you
                stood on the point? If yes, then you could have been right, because the boundaries you see in game are
                very inaccurate. So inaccurate, that I went ahead and mapped every single point in the game (except
                those from Arcade modes) just to show you how broken can they be.
              </p>
              <p>
                Now, if you wish to check them out, you can do it in a special
                <nuxt-link to="/custom_game">Custom Game</nuxt-link>, or, if you just want a general idea how they look,
                you can <nuxt-link to="/custom_game">Compare them here</nuxt-link>. Be advised that boundaries in the
                2nd option aren't as accurate as in the 1st one - bounds are distorted by camera's perspective and
                ingame bounds are floating above the ground - so take them with a grain of salt.
              </p>
              <p>
                For anyone interested,
                <a href="https://us.forums.blizzard.com/en/overwatch/t/control-point-bounds-are-very-inaccurate/424673"
                  >here</a
                >
                is a bug report on Overwatch Forums which you can follow.
              </p>
            </m-card-secondary>
          </m-card>
        </m-layout-grid-cell>
      </m-layout-grid-inner>

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
  head() {
    return {
      title: 'More Info'
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
@import '@material/layout-grid/_mixins';

.mdc-card {
  /deep/ &__title {
    @include text-primary-centered;
    text-align: center;
  }

  &__media {
    background-color: black;
    max-height: 450px;
  }
}
</style>
