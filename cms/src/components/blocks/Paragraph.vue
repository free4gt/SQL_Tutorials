<template>
  <p class="lesson-paragraph">{{ text }}</p>
</template>

<script setup>
defineProps(['text'])
</script>

<style scoped>
/* Override BaseBlock center adjustment: left-align paragraph only */
.lesson-paragraph {
  height: 100%;
  overflow-y: auto;
  font-size: clamp(0.8125rem, 2vw, 1rem);
  line-height: 1.5;
  color: #333;
  margin: 0;
  text-align: left;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>