<template>
  <div class="lesson-content">
    <template v-for="(block, index) in normalizedBlocks" :key="`${lessonKey}-${block.type}-${index}`">
      <div
        v-if="block.type && blockComponents[block.type]"
        class="block-wrapper"
        :style="getBlockMarginStyle(block)"
      >
        <component
          :is="blockComponents[block.type]"
          v-bind="getBlockProps(block)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, toRaw } from 'vue'
import { blockComponents } from '../blocks'

const props = defineProps(['blocks', 'lessonKey'])

// blocks from loader: array of { type, ...props } (array format from YAML, rendered in order)
const normalizedBlocks = computed(() => Array.isArray(props.blocks) ? props.blocks : [])

function getBlockMarginStyle(block) {
  const raw = toRaw(block)
  const top = raw.marginTop ?? raw.margin_top
  const bottom = raw.marginBottom ?? raw.margin_bottom
  const style = {}
  if (top != null && String(top).trim() !== '') style.marginTop = String(top).trim()
  if (bottom != null && String(bottom).trim() !== '') style.marginBottom = String(bottom).trim()
  return Object.keys(style).length ? style : undefined
}

function getBlockProps(block) {
  const raw = toRaw(block)
  const { type, marginTop, marginBottom, margin_top, margin_bottom, ...rest } = raw
  if (type === 'sql') {
    try {
      return JSON.parse(JSON.stringify(rest))
    } catch (_) {
      return rest
    }
  }
  return rest
}
</script>

<style scoped>
.lesson-content {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
}

/* Wrapper allows optional marginTop/marginBottom per block (from content) */
.lesson-content > :deep(.block-wrapper) {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

/* Generic block layout: each block component roots with .block-container */
.lesson-content :deep(.block-container) {
  animation: fadeIn 0.5s ease-in;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

/* List and paragraph: left-align content, not centered */
.lesson-content :deep(.block-container.block-list),
.lesson-content :deep(.block-container.block-paragraph) {
  align-items: flex-start;
  justify-content: flex-start;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .lesson-content {
    gap: 0.75rem;
  }
}
</style>
