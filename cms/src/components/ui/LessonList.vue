<template>
  <div ref="rootRef" class="lesson-list">
    <h3 v-if="!hideTitle" class="lesson-list__title" v-katex>
      <BookOpen class="lesson-list__icon" aria-hidden />
      {{ store.currentClass?.class?.title || 'Lessons' }}
    </h3>
    <div v-if="hasItems" ref="lessonsContainerRef" class="lessons-container">
      <template v-for="(item, i) in effectiveList" :key="listKey(i, item)">
        <div v-if="item.type === 'category'" class="lesson-list__category">
          {{ item.text }}
        </div>
        <button
          v-else
          class="lesson-button"
          :class="{ active: store.currentLessonIndex === item.lessonIndex }"
          @click="$emit('select-lesson', item.lessonIndex)"
        >
          <Play class="lesson-button__icon" aria-hidden />
          <span v-katex>{{ item.lesson?.button?.text ?? 'Untitled' }}</span>
        </button>
      </template>
    </div>
    <div v-else class="no-lessons">No lessons available</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { BookOpen, Play } from 'lucide-vue-next'
import { useClassroomStore } from '../../stores/classroom.js'

const store = useClassroomStore()
defineEmits(['select-lesson'])
const props = defineProps({
  lessons: { type: Array, default: () => [] },
  displayList: { type: Array, default: () => [] },
  hideTitle: { type: Boolean, default: false }
})

const rootRef = ref(null)
const lessonsContainerRef = ref(null)

function scrollLessonListToTop() {
  if (lessonsContainerRef.value) lessonsContainerRef.value.scrollTop = 0
  // On mobile the aside (.lesson-list-area) is the scrollable container, not the inner div
  const aside = rootRef.value?.parentElement
  if (aside && typeof aside.scrollTop !== 'undefined') aside.scrollTop = 0
}

// When class changes, scroll lesson list to top (e.g. mobile so first lesson is visible)
watch(
  () => store.currentClass?.class?.name,
  () => {
    nextTick(() => scrollLessonListToTop())
  }
)

const effectiveList = computed(() => {
  if (props.displayList?.length) return props.displayList
  return (props.lessons ?? []).map((lesson, index) => ({
    type: 'lesson',
    lesson,
    lessonIndex: index
  }))
})

const hasItems = computed(() => effectiveList.value.length > 0)

function listKey(i, item) {
  if (item.type === 'category') return `cat-${i}-${item.text}`
  return `${store.currentClass?.class?.name ?? ''}-${item.lessonIndex}-${item.lesson?.button?.text ?? item.lessonIndex}`
}
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

.lesson-list__category {
  font-size: clamp(0.7rem, 0.35rem + 1.8cqw, 0.875rem);
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: clamp(0.5rem, 0.25rem + 1.5cqw, 0.75rem) 0 clamp(0.25rem, 0.5cqw, 0.35rem);
  margin-top: 0.5rem;
  border-bottom: 1px solid #eee;
}
.lesson-list__category:first-child {
  margin-top: 0;
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

/* Mobile: lesson list full width, no side gaps */
@media (max-width: 768px) {
  .lesson-list {
    border-radius: 0;
    padding: 1rem 0.5rem 1.5rem 0.5rem;
    box-shadow: none;
  }
}

/* Tablet/desktop — smallest margin on right only */
@media (min-width: 769px) {
  .lesson-list {
    border-radius: 8px;
    padding: 1.5rem;
    margin: 0 0.25rem 0 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    box-sizing: border-box;
  }
}

</style>