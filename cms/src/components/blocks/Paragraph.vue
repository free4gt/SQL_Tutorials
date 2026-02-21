<template>
  <div class="block-container block-paragraph">
    <p class="lesson-paragraph" v-katex>{{ text }}</p>
  </div>
</template>

<script setup>
defineProps(['text'])
</script>

<style scoped>
.block-paragraph {
  flex: 0 0 auto;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
}

.lesson-paragraph {
  font-size: clamp(0.8125rem, 2vw, 1rem);
  line-height: 1.6;
  letter-spacing: 0.01em;
  color: #475569;
  margin: 0;
  text-align: left;
}

/* Slight space around KaTeX in paragraphs */
.lesson-paragraph :deep(.katex) {
  margin: 0 0.15em;
}
</style>