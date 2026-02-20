<template>
  <div class="block-container block-image">
    <div class="image-container">
      <img :src="imageSrc" :alt="alt ?? ''" class="lesson-image" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['src', 'alt'])

const base = import.meta.env.BASE_URL
const imageSrc = computed(() => {
  const s = (props.src ?? '').trim()
  if (!s) return ''
  return `${base}images/${s.replace(/^\//, '')}`
})
</script>

<style scoped>
.block-image {
  flex: 0 0 auto;
}

.image-container {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
}

.lesson-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;
  border-radius: 8px;
  display: block;
}

@media (max-width: 768px) {
  .image-container {
    max-height: 50vh;
  }
}

@media (min-width: 769px) {
  .image-container {
    max-height: 60vh;
  }
}
</style>
