<template>
  <div class="block-container block-paragraph">
    <p class="lesson-paragraph">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps(['text'])
</script>

<style scoped>
.block-paragraph {
  flex: 0 0 auto;
  justify-content: flex-start;
  align-items: flex-start;
}

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