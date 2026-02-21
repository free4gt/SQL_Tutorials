<template>
  <div class="block-container block-list">
    <ul class="block-list__ul">
      <li
        v-for="(item, index) in listItems"
        :key="index"
        class="block-list__li"
        v-katex
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
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
.block-list__ul {
  margin: 0 0 0 1.5em;
  padding: 0 0 0 0.75em;
  border-left: 2px solid rgba(148, 163, 184, 0.4);
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

.block-list__li {
  margin-bottom: 0.5rem;
  padding-left: 0.25em;
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
