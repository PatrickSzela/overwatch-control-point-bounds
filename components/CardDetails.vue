<template>
  <transition name="fade">
    <m-card class="card-details">
      <m-card-primary :title="title" title-tag="h4">
        <div v-if="difficulty > 0" class="card-details__stars">
          <span>Difficulty:</span>
          <m-icon v-for="star in difficulty" :key="`star_${star}`" icon="star"></m-icon>
          <m-icon v-for="star in maxDifficulty - difficulty" :key="`star_border_${star}`" icon="star_border"></m-icon>
        </div>
      </m-card-primary>

      <m-card-secondary v-if="description">
        <p>{{ description }}</p>
      </m-card-secondary>
    </m-card>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

const maxDifficulty = 3;

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    difficulty: {
      type: Number,
      default: 0,
      validator(value) {
        return value <= maxDifficulty;
      }
    }
  },
  computed: {
    maxDifficulty() {
      return maxDifficulty;
    }
  }
});
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables.scss';
@import '@material/card/_mixins';
@import '@material/typography/_mixins';

.card-details {
  @include mdc-card-fill-color($mdc-theme-surface-secondary);
  color: white;

  &__stars {
    display: flex;
    align-items: center;

    span {
      @include mdc-typography('subtitle2');
      margin-bottom: $text-uppercase-margin-bottom;
      margin-top: 0;
      margin-right: 0.5em;
    }

    .material-icons {
      font-size: 20px;
    }
  }

  .mdc-card__secondary p {
    font-size: 13px;
  }
}
</style>
