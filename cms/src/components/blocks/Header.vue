<template>
  <div class="block-container block-header">
    <h1 class="lesson-header" v-katex>{{ text }}</h1>
    <span class="block-header__line" aria-hidden="true"></span>
  </div>
</template>

<script setup>
defineProps(['text'])
</script>

<style scoped>
.block-header {
  flex: 0 0 auto;
  width: 100%;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lesson-header {
  width: 100%;
  margin: 0 0 0.75rem 0;
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #334155;
  line-height: 1.3;
  text-align: center;
}

.block-header__line {
  display: block;
  width: 100%;
  height: 0;
  border: none;
  border-top: 1px solid rgba(148, 163, 184, 0.5);
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.4);
}

/* Space around KaTeX so math doesn’t sit flush with text */
.lesson-header :deep(.katex) {
  margin: 0 0.15em;
}
</style>