<template>
  <div class="block-container block-divider">
    <p v-if="caption" class="block-divider__caption">{{ caption }}</p>
    <div class="block-divider__line-wrap" aria-hidden="true">
      <span class="block-divider__line block-divider__line--top"></span>
      <span class="block-divider__line block-divider__line--main"></span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  caption: { type: String, default: '' }
})
</script>

<style scoped>
.block-divider {
  flex: 0 0 auto;
  width: 100%;
  margin: 3.5rem 0 2rem 0;
  box-sizing: border-box;
}

.block-divider__caption {
  margin: 0 0 0.875rem 0;
  font-size: 1.3125rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #475569;
  text-align: center;
  line-height: 1.3;
}

.block-divider__line-wrap {
  position: relative;
  width: 100%;
  min-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.block-divider__line {
  display: block;
  width: 100%;
  height: 0;
  border: none;
}

.block-divider__line--top {
  border-top: 1px solid rgba(148, 163, 184, 0.5);
}

.block-divider__line--main {
  border-top: 2px solid #94a3b8;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.6);
}
</style>
