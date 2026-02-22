<template>
  <div class="block-container block-list">
    <component
      :is="ordered ? 'ol' : 'ul'"
      class="block-list__list"
    >
      <li
        v-for="(item, index) in listItems"
        :key="index"
        class="block-list__li"
        v-katex
      >
        {{ item }}
      </li>
    </component>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  ordered: {
    type: Boolean,
    default: false
  }
})

const listItems = computed(() => Array.isArray(props.items) ? props.items : [])
</script>

<style scoped>
.block-list {
  flex: 0 0 auto;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
  text-align: left;
}

/* Match paragraph font exactly: same size, line-height, letter-spacing, color */
.block-list__list {
  margin: 0;
  padding-left: 1.25em;
  list-style-type: disc;
  list-style-position: outside;
  font-size: clamp(0.8125rem, 2vw, 1rem);
  line-height: 1.6;
  letter-spacing: 0.01em;
  color: #475569;
  text-align: left;
  max-width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
}

ol.block-list__list {
  list-style-type: decimal;
}

.block-list__li {
  margin-bottom: 0.05rem;
  padding-left: 0.1em;
  overflow-wrap: break-word;
  word-break: break-word;
  font-size: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  color: inherit;
}

.block-list__li:last-child {
  margin-bottom: 0;
}

.block-list__li::marker {
  color: #94a3b8;
}

.block-list__li :deep(.katex) {
  margin: 0 0.15em;
}
</style>
