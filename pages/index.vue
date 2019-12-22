<template>
  <!-- client-only to fix flashing content when loaded because Material Components Vue doesn't support SSR -->
  <client-only>
    <m-layout-grid>
      <m-layout-grid-inner>
        <m-layout-grid-cell v-for="card in cards" :key="card.title" :span="4">
          <nuxt-link :to="card.link" class="mdc-card__interactive-container">
            <m-card class="mdc-card--interactive mdc-card--layout-gutter">
              <m-card-media :square="false" class="mdc-card__media--4-3" :style="{ backgroundColor: card.color }">
                <m-icon :icon="card.icon"></m-icon>
              </m-card-media>

              <m-card-primary :title="card.title" :subtitle="card.subtitle" aria-hidden="true"> </m-card-primary>
            </m-card>
          </nuxt-link>
        </m-layout-grid-cell>
      </m-layout-grid-inner>
    </m-layout-grid>
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      cards: [
        {
          title: 'Compare',
          subtitle: 'Compare ingame bounds with more accurate ones. 15 maps to choose.',
          icon: 'compare',
          link: '/select_map',
          color: '#186ad3'
        },
        {
          title: 'Custom game',
          subtitle: 'Check out special Custom Game for even more accurate bounds!',
          icon: 'build',
          link: '/custom_game',
          color: '#8246a7'
        },
        {
          title: 'More info',
          subtitle: 'Learn more about how inaccurate ingame bounds are.',
          icon: 'help_outline',
          link: '/info',
          color: '#00994c'
        }
      ]
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
@import '@/assets/scss/mixins.scss';
@import '@material/layout-grid/_mixins';
@import '@material/typography/_mixins';

.mdc-card {
  text-align: center;
  height: 100%;

  &__interactive-container {
    height: 100%;
  }

  &__primary {
    padding-left: 24px !important;
    padding-right: 24px !important;

    @include mdc-layout-grid-media-query_('phone') {
      padding-top: 24px !important;
      padding-bottom: 24px !important;
    }
  }

  /deep/ &__title {
    @include text-primary-centered;
    padding-bottom: 8px;

    @include mdc-layout-grid-media-query_('desktop') {
      font-size: 3em;
    }

    @include mdc-layout-grid-media-query_('phone') {
      font-size: 2.625em;
    }
  }

  &__media {
    @include webp('~assets/images/sunburst.png');

    /deep/ &-content {
      font-size: 2em;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .material-icons {
      @include headline-media-sizes('headline1');
      color: white;
      font-size: 96px;
    }

    @include mdc-layout-grid-media-query_('phone') {
      &::before {
        margin-bottom: 9 / 21 * 100%;
      }
    }
  }
}
</style>
