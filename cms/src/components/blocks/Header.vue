<template>
  <h1 class="lesson-header">{{ text }}</h1>
</template>

<script setup>
defineProps(['text'])
</script>

<style scoped>
.lesson-header { 
  height: 100%;
  display: flex;
  align-items: center;
  font-size: clamp(0.9rem, 2.5vw, 1.35rem); 
  color: #1a1a1a; 
  margin: 0; 
  line-height: 1.2; 
}
</style>