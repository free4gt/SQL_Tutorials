<template>
  <div class="image-block">
    <img :src="imageSrc" :alt="alt ?? ''" class="lesson-image" />
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
.image-block {
  margin-bottom: 0.75rem;
}

.lesson-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
}
</style>
