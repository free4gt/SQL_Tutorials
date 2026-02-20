<template>
  <div class="block-container block-chart">
    <div class="chart-wrapper">
      <component
        v-if="chartComponent && chartData"
        :is="chartComponent"
        :data="chartData"
        :options="mergedOptions"
      />
    </div>
  </div>
</template>

<script setup>
import 'chart.js/auto'
import { computed } from 'vue'
import { Line, Bar, Pie } from 'vue-chartjs'

const props = defineProps({
  chartType: { type: String, default: 'line' },
  data: { type: Object, default: () => ({ labels: [], datasets: [] }) },
  options: { type: Object, default: () => ({}) }
})

const CHART_MAP = {
  line: Line,
  bar: Bar,
  pie: Pie
}

const chartComponent = computed(() => CHART_MAP[props.chartType?.toLowerCase()] || Line)

const chartData = computed(() => {
  const d = props.data
  if (!d || typeof d !== 'object') return null
  return {
    labels: Array.isArray(d.labels) ? d.labels : [],
    datasets: Array.isArray(d.datasets) ? d.datasets : []
  }
})

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const mergedOptions = computed(() => ({
  ...defaultOptions,
  ...props.options
}))
</script>

<style scoped>
.block-chart {
  flex: 0 0 auto;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .chart-wrapper {
    max-height: 50vh;
  }
}

@media (min-width: 769px) {
  .chart-wrapper {
    max-height: 60vh;
  }
}
</style>
