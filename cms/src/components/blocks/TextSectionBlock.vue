<template>
  <div class="block-container block-text-section">
    <div
      v-for="(block, index) in allowedBlocks"
      :key="index"
      class="block-text-section__item"
    >
      <component
        v-if="block && blockComponents[block.type]"
        :is="blockComponents[block.type]"
        v-bind="getBlockProps(block)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { blockComponents } from '../blocks'

const ALLOWED_TYPES = ['header', 'paragraph', 'list']

const props = defineProps({
  blocks: {
    type: Array,
    default: () => []
  }
})

const allowedBlocks = computed(() => {
  const raw = Array.isArray(props.blocks) ? props.blocks : []
  return raw.filter(b => b && ALLOWED_TYPES.includes(b.type))
})

function getBlockProps(block) {
  if (!block || typeof block !== 'object') return {}
  const { type, marginTop, marginBottom, margin_top, margin_bottom, ...rest } = block
  return rest
}
</script>

<style scoped>
.block-text-section {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  box-sizing: border-box;
}

.block-text-section__item {
  width: 100%;
}

.block-text-section__item :deep(.block-container) {
  margin: 0;
}
</style>
