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
                TODO: Update the video and write something cool here
              </p>
            </m-card-secondary>
          </m-card>
        </m-layout-grid-cell>
      </m-layout-grid-inner>

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
