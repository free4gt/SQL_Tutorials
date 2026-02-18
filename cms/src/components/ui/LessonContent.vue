<template>
  <div class="lesson-content">
    <div 
      v-for="(block, index) in normalizedBlocks" 
      :key="`${block.type}-${index}`"
      class="block-container"
      :class="`block-${block.type}`"
    >
      <BaseBlock v-if="block.type && blockComponents[block.type]">
        <component 
          :is="blockComponents[block.type]" 
          v-bind="getBlockProps(block)"
        />
      </BaseBlock>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { blockComponents, BaseBlock } from '../blocks'

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
  height: 100%;
  display: flex; 
  flex-direction: column; 
  padding: 0;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.lesson-content::-webkit-scrollbar {
  display: none;
}

.block-container { 
  animation: fadeIn 0.5s ease-in;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.block-container.block-header {
  flex: 0 0 5%;
}

.block-container.block-video {
  flex: 0 0 82%;
}

.block-container.block-paragraph {
  flex: 0 0 13%;
}

.block-container:not(.block-header):not(.block-video):not(.block-paragraph) {
  flex: 0 0 auto;
}

@keyframes fadeIn { 
  from { opacity: 0; transform: translateY(10px); } 
  to { opacity: 1; transform: translateY(0); } 
}

@media (max-width: 768px) {
  .block-container.block-header { flex: 0 0 5%; }
  .block-container.block-video { flex: 0 0 82%; }
  .block-container.block-paragraph { flex: 0 0 13%; }
}

/* Smallest: remove top margin on first block so content sits flush under navbar */
@media (max-width: 480px) {
  .block-container:first-child :deep(.base-block) {
    margin-top: 0;
  }
}
</style>