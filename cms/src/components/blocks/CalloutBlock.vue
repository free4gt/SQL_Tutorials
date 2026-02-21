<template>
  <div class="block-container block-callout">
    <aside class="block-callout__inner">
      <h3 v-if="title" class="block-callout__title">{{ title }}</h3>
      <div class="block-callout__body">
        <div
          v-for="(block, index) in allowedBlocks"
          :key="index"
          class="block-callout__item"
        >
          <component
            v-if="block && blockComponents[block.type]"
            :is="blockComponents[block.type]"
            v-bind="getBlockProps(block)"
          />
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { blockComponents } from '../blocks'

const ALLOWED_TYPES = [
  'header',
  'paragraph',
  'list',
  'table',
  'chart',
  'image',
  'divider',
  'tabs',
  'text_section'
]

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
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
.block-callout {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  align-self: flex-start;
}

.block-callout__inner {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 0 1rem 0;
  border-radius: 8px;
  border-left: 6px solid #0284c7;
  background: #e0f2fe;
  box-shadow: 0 2px 6px rgba(2, 132, 199, 0.25);
  box-sizing: border-box;
}

.block-callout__title {
  margin: 0;
  padding: 0.5rem 1rem 0.35rem 1rem;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #0369a1;
  text-align: left;
  border-bottom: 1px solid rgba(2, 132, 199, 0.35);
}

.block-callout__body {
  padding: 0.75rem 1rem 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.block-callout__item {
  width: 100%;
}

.block-callout__item :deep(.block-container) {
  margin: 0;
}
</style>
