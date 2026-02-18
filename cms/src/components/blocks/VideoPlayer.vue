<template>
  <div class="video-container">
    <iframe 
      :src="src" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="youtube-player"
    />
  </div>
</template>

<script setup>
defineProps(['src'])
</script>

<style scoped>
.video-container { 
  position: relative; 
  width: 100%;
  height: 100%;
  min-height: 0;
  border-radius: 8px; 
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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