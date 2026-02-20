<template>
  <div class="lesson-list">
    <h3 class="lesson-list__title" v-katex>
      <BookOpen class="lesson-list__icon" aria-hidden />
      {{ store.currentClass?.class?.title || 'Lessons' }}
    </h3>
    <div v-if="lessons.length" class="lessons-container">
      <button 
        v-for="(lesson, index) in lessons" 
        :key="`${store.currentClass?.class?.name ?? ''}-${index}-${lesson.button?.text ?? index}`"
        @click="$emit('select-lesson', index)"
        :class="{ active: store.currentLessonIndex === index }"
        class="lesson-button"
      >
        <Play class="lesson-button__icon" aria-hidden />
        <span v-katex>{{ lesson.button?.text ?? 'Untitled' }}</span>
      </button>
    </div>
    <div v-else class="no-lessons">No lessons available</div>
  </div>
</template>

<script setup>
import { BookOpen, Play } from 'lucide-vue-next'
import { useClassroomStore } from '../../stores/classroom.js'
const store = useClassroomStore()
defineEmits(['select-lesson'])
defineProps(['lessons'])
</script>

<style scoped>
/* Container: font and spacing scale with lesson list width */
.lesson-list {
  container-type: inline-size;
  container-name: lesson-list;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.lesson-list__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #333;
  font-size: clamp(0.8125rem, 0.4rem + 2.2cqw, 1.1rem);
}
.lesson-list__icon {
  width: clamp(0.875rem, 0.5rem + 1.8cqw, 1.25rem);
  height: clamp(0.875rem, 0.5rem + 1.8cqw, 1.25rem);
  color: #666;
  flex-shrink: 0;
}
.lesson-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: clamp(0.5rem, 0.25rem + 1.5cqw, 1rem);
  border: 1px solid #eee;
  background: white;
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: clamp(0.75rem, 0.45rem + 2cqw, 1rem);
}
.lesson-button__icon {
  width: clamp(0.875rem, 0.5rem + 1.5cqw, 1.125rem);
  height: clamp(0.875rem, 0.5rem + 1.5cqw, 1.125rem);
  color: #666;
  flex-shrink: 0;
}

.lessons-container {
  display: flex;
  flex-direction: column;
  gap: clamp(0.35rem, 0.5cqw, 0.5rem);
  max-height: 100%;
  overflow-y: auto;
}

.lesson-button:hover, .lesson-button.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.no-lessons {
  color: #999;
  text-align: center;
  padding: 2rem;
  font-size: clamp(0.8125rem, 0.4rem + 2cqw, 1rem);
}

/* Hide header on small viewports (single-column / mobile layout) */
@media (max-width: 768px) {
  .lesson-list .lesson-list__title {
    display: none;
  }
}
</style>