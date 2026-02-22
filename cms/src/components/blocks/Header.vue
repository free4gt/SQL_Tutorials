<template>
  <div class="block-container block-header">
    <component
      :is="headingTag"
      class="lesson-header"
      :class="`lesson-header--h${levelClamped}`"
      v-katex
    >
      {{ text }}
    </component>
    <span class="block-header__line" aria-hidden="true"></span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  level: { type: Number, default: 1 }
})

const levelClamped = computed(() => {
  const n = Number(props.level)
  if (!Number.isInteger(n) || n < 1) return 1
  if (n > 6) return 6
  return n
})

const headingTag = computed(() => `h${levelClamped.value}`)
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
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #334155;
  line-height: 1.3;
  text-align: center;
}

.lesson-header--h1 {
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
}

.lesson-header--h2 {
  font-size: clamp(1rem, 2.2vw, 1.25rem);
}

.lesson-header--h3 {
  font-size: clamp(0.9375rem, 2vw, 1.125rem);
}

.lesson-header--h4 {
  font-size: clamp(0.875rem, 1.8vw, 1rem);
}

.lesson-header--h5 {
  font-size: clamp(0.8125rem, 1.6vw, 0.9375rem);
}

.lesson-header--h6 {
  font-size: clamp(0.75rem, 1.4vw, 0.875rem);
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