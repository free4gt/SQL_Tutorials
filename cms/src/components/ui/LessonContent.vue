<template>
  <div class="lesson-content">
    <template v-for="(block, index) in normalizedBlocks" :key="`${block.type}-${index}`">
      <component
        v-if="block.type && blockComponents[block.type]"
        :is="blockComponents[block.type]"
        v-bind="getBlockProps(block)"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { blockComponents } from '../blocks'

const props = defineProps(['blocks'])

// blocks from loader: array of { type, ...props } (array format from YAML, rendered in order)
const normalizedBlocks = computed(() => Array.isArray(props.blocks) ? props.blocks : [])

function getBlockProps(block) {
  const { type, ...rest } = block
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

/* Generic block layout: each block component roots with .block-container */
.lesson-content > :deep(.block-container) {
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