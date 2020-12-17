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

        <m-layout-grid-cell v-if="changelog.length > 0" :span="12">
          <m-card class="mdc-card--layout-gutter changelog">
            <m-card-primary title="Changelog" aria-hidden="true"></m-card-primary>

            <m-card-secondary>
              <div v-for="(log, index) in changelog" :key="log.date" class="log">
                <hr v-if="index > 0" />

                <h5>{{ log.date }}</h5>
                <ul>
                  <li v-for="change in log.changes" :key="change">
                    {{ change }}
                  </li>
                </ul>
              </div>
            </m-card-secondary>
          </m-card>
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
      ],
      changelog: [
        {
          date: '2020-12-17',
          changes: ['Temple of Anubis (1st point): updated the height of the boundaries (lowered from 16.79M to 8.79M)']
        },
        {
          date: '2020-10-07',
          changes: [
            'Hanamura (2nd point): updated the height of the boundaries (lowered from 18.41M to 12.38M)',
            'All: some (very) minor changes to heights of the boundaries on Busan, Eichenwalde, Nepal, Paris and Volskaya Industries'
          ]
        },
        {
          date: '2020-04-29',
          changes: [
            'All: added (good enough™) representation of height of control point boundaries (3rd drop-down on top of the page, read notes to learn more)',
            'All: added some more contestable and noncontestable spots',
            'Hollywood: updated boundaries from patch 1.47.0.0',
            'Updated Custom Game code in Custom Game page',
            'Other small changes'
          ]
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

.mdc-card__interactive-container {
  height: 100%;
}

.mdc-card--interactive {
  text-align: center;
  height: 100%;

  .mdc-card__primary {
    padding-left: 24px !important;
    padding-right: 24px !important;

    @include mdc-layout-grid-media-query_('phone') {
      padding-top: 24px !important;
      padding-bottom: 24px !important;
    }
  }

  /deep/ .mdc-card__title {
    @include text-primary-centered;
    padding-bottom: 8px;

    @include mdc-layout-grid-media-query_('desktop') {
      font-size: 3em;
    }

    @include mdc-layout-grid-media-query_('phone') {
      font-size: 2.625em;
    }
  }

  .mdc-card__media {
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

.changelog {
  .mdc-card__secondary {
    max-height: 250px;
    overflow-x: hidden;
    overflow-y: auto;

    // Firefox and others, why 😢 https://bugzilla.mozilla.org/show_bug.cgi?id=748518
    padding-bottom: 0;
    @each $size in map-keys($mdc-layout-grid-columns) {
      @include mdc-layout-grid-media-query_($size) {
        &::after {
          content: '';
          height: map-get($mdc-layout-grid-default-gutter, $size);
          display: block;
        }
      }
    }
  }

  .log {
    &:first-child > *:first-child {
      margin-top: 0;
    }

    &:last-child > *:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
