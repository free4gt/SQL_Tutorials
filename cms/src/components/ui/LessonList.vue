<template>
  <div class="lesson-list">
    <h3>{{ store.currentClass?.class?.title || 'Lessons' }}</h3>
    <div v-if="lessons.length" class="lessons-container">
      <button 
        v-for="(lesson, index) in lessons" 
        :key="`${store.currentClass?.class?.name ?? ''}-${index}-${lesson.button?.text ?? index}`"
        @click="$emit('select-lesson', index)"
        :class="{ active: store.currentLessonIndex === index }"
        class="lesson-button"
      >
        {{ lesson.button?.text ?? 'Untitled' }}
      </button>
    </div>
    <div v-else class="no-lessons">No lessons available</div>
  </div>
</template>

<script setup>
import { useClassroomStore } from '../../stores/classroom.js'
const store = useClassroomStore()
defineEmits(['select-lesson'])
defineProps(['lessons'])
</script>

<style scoped>
.lesson-list { 
  background: white; 
  border-radius: 8px; 
  padding: 1.5rem; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h3 { margin-bottom: 1rem; color: #333; font-size: 1.1rem; }
.lessons-container { 
  display: flex; 
  flex-direction: column; 
  gap: 0.5rem; 
  max-height: 100%; 
  overflow-y: auto;
}

.lesson-button { 
  padding: 1rem; 
  border: 1px solid #eee; 
  background: white; 
  text-align: left; 
  border-radius: 6px; 
  cursor: pointer; 
  transition: all 0.2s; 
  font-size: 1rem;
}

.lesson-button:hover, .lesson-button.active { 
  background: #e3f2fd; 
  border-color: #2196f3; 
}

.no-lessons { 
  color: #999; 
  text-align: center; 
  padding: 2rem; 
}

@media (max-width: 768px) {
  .lesson-button { padding: 0.75rem; font-size: 0.95rem; }
}
</style>