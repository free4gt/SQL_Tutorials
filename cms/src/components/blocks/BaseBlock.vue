<template>
  <div class="base-block">
    <div class="base-block__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
/**
 * Base block – shared layout for all block types (header, paragraph, video, image).
 * Provides: default top/bottom margin, 100% width, content centered in the lesson area.
 * Concrete blocks are rendered via the default slot.
 */
</script>

<style scoped>
.base-block {
  width: 100%;
  height: 100%;
  min-height: 0;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.base-block__content {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Slot content fills base block and is center-adjusted on all viewports */
.base-block__content :deep(> *) {
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
