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

/* One tab-width indent (2em) in front of the list; list is left-aligned */
.block-list__ul {
  margin: 0 0 0 2em;
  padding-left: 1.5em;
  list-style-type: disc;
  list-style-position: outside;
  font-size: clamp(0.8125rem, 2vw, 1rem);
  line-height: 1.5;
  color: #333;
  text-align: left;
  max-width: 100%;
  overflow-wrap: break-word;
  word-break: break-word;
}

.block-list__li {
  margin-bottom: 0.35rem;
  overflow-wrap: break-word;
  word-break: break-word;
}

.block-list__li:last-child {
  margin-bottom: 0;
}

.block-list__li :deep(.katex) {
  margin: 0 0.15em;
}
</style>
