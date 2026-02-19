<template>
  <div class="block-container block-video">
    <div class="video-container">
      <iframe
        :src="src"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="youtube-player"
      />
    </div>
  </div>
</template>

<script setup>
defineProps(['src'])
</script>

<style scoped>
.block-video {
  flex: 0 0 auto;
}

.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

@media (max-width: 768px) {
  .video-container {
    max-height: 50vh;
  }
}

@media (min-width: 769px) {
  .video-container {
    max-height: 60vh;
  }
}

.youtube-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>