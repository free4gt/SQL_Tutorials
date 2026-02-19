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

const imageSrc = computed(() => {
  const s = props.src ?? ''
  return s.startsWith('/') ? s : `/${s}`
})
</script>

<style scoped>
.block-image {
  flex: 0 0 auto;
}

.image-container {
  position: relative;
  width: 100%;
  max-height: 70vh;
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
  border-radius: 8px;
  display: block;
}

@media (max-width: 768px) {
  .image-container {
    max-height: 50vh;
  }
}
</style>
