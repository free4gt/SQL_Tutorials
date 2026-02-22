<template>
  <div class="block-container block-tabs">
    <div class="block-tabs__tab-list" role="tablist">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        type="button"
        role="tab"
        :aria-selected="activeIndex === index"
        :aria-controls="`tabs-panel-${blockId}-${index}`"
        :id="`tabs-tab-${blockId}-${index}`"
        class="block-tabs__tab"
        :class="{ 'block-tabs__tab--active': activeIndex === index }"
        @click="activeIndex = index"
      >
        {{ tab.name }}
      </button>
    </div>
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      :id="`tabs-panel-${blockId}-${index}`"
      role="tabpanel"
      :aria-labelledby="`tabs-tab-${blockId}-${index}`"
      class="block-tabs__panel"
      :class="{ 'block-tabs__panel--active': activeIndex === index }"
    >
      <template v-if="activeIndex === index">
        <div
          v-for="(block, blockIndex) in tab.blocks"
          :key="blockIndex"
          class="block-tabs__block"
        >
          <component
            v-if="block && blockComponents[block.type]"
            :is="blockComponents[block.type]"
            v-bind="getBlockProps(block)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { blockComponents } from '../blocks'

const props = defineProps({
  tabs: {
    type: Array,
    default: () => []
  }
})

const blockId = `tabs-${Math.random().toString(36).slice(2, 9)}`
const activeIndex = ref(0)

const tabs = computed(() => Array.isArray(props.tabs) ? props.tabs : [])

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
.block-tabs {
  flex: 0 0 auto;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border: 1px solid #c5d0de;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Tabs: center-aligned for both top-level and nested tabs */
.block-tabs__tab-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0;
  justify-content: center;
  background: #e8eef4;
  border-bottom: 1px solid #c5d0de;
  flex-shrink: 0;
}

.block-tabs__tab {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #555;
  cursor: pointer;
  margin-bottom: -1px;
  text-align: left;
  white-space: nowrap;
}

.block-tabs__tab:hover {
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.6);
}

.block-tabs__tab--active {
  background: #fff;
  border-bottom-color: #2196f3;
  color: #1a1a1a;
}

.block-tabs__panel {
  display: none;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}

/* Minimal padding so content matches untabbed size; just enough to show border */
.block-tabs__panel--active {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  width: 100%;
}

/* Every block fills the tab panel width 100% */
.block-tabs__block {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.block-tabs__block + .block-tabs__block {
  margin-top: 1rem;
}

/* Inner block components (table, sql, chart, etc.) fit full width of tab */
.block-tabs__panel :deep(.block-container) {
  margin: 0;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.block-tabs__panel :deep(.block-container > *) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
</style>
