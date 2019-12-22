<template>
  <!-- client-only to fix flashing content when loaded because Material Components Vue doesn't support SSR -->
  <client-only>
    <m-layout-grid>
      <m-layout-grid-inner>
        <m-layout-grid-cell :span="12">
          <m-card class="mdc-card--layout-gutter">
            <m-card-primary title="Check out the Custom Game!"></m-card-primary>

            <m-card-secondary>
              <p>
                Custom Game code: N165P
              </p>
              <p>
                TODO: Update the Custom Game code, add info about how to use the custom game and info about the payload
                hitbox.
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
      title: 'Custom Game'
    };
  }
});
</script>

<style lang="scss" scoped>
@import '~assets/scss/mixins';

/deep/ .mdc-card__title {
  @include text-primary-centered;
  text-align: center;
}
</style>
