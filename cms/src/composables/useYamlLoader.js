import { ref } from 'vue'
import yaml from 'js-yaml'
import { useClassroomStore } from '../stores/classroom.js'

// Normalize blocks for rendering. Supports:
// - Array format (primary): [ { header: { text: '...' } }, { video: { src: '...' } }, ... ] — type is the key, order preserved.
// - Object format (legacy): { header: {...}, video: {...} } — one block per key.
// Output: [ { type: 'header', text: '...' }, { type: 'video', src: '...' }, ... ] for rendering in order.
function normalizeBlocks(raw) {
  let normalized = []
  if (Array.isArray(raw)) {
    normalized = raw.map(block => {
      if (block && typeof block === 'object' && !Array.isArray(block)) {
        const entries = Object.entries(block)
        if (entries.length) {
          const [type, value] = entries[0]
          const props = typeof value === 'object' && value !== null ? value : { text: value }
          return { type, ...props }
        }
      }
      return null
    }).filter(Boolean)
  } else if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    normalized = Object.entries(raw).map(([type, props]) => ({
      type,
      ...(typeof props === 'object' && props !== null ? props : { text: props })
    }))
  }
  return normalized
}

export function useYamlLoader(store) {
  const classes = ref([])
  const currentLessons = ref([])
  const currentBlocks = ref([])

  const base = import.meta.env.BASE_URL

  async function loadClasses() {
    try {
      const response = await fetch(`${base}content/classes.yaml`)
      const text = await response.text()
      const yamlData = yaml.load(text)
      classes.value = Array.isArray(yamlData?.classes) ? yamlData.classes : []
      store.setClasses(classes.value)

      if (classes.value.length > 0 && store.currentClass?.class?.name) {
        await loadClass(store.currentClass.class.name)
      }
    } catch (error) {
      console.error('Failed to load classes:', error)
    }
  }

  async function loadClass(className) {
    try {
      store.setCurrentClass(className)
      // Clear immediately so the new class never receives the previous class's blocks.
      // Otherwise the LessonContent key changes and Vue mounts a new instance while
      // currentBlocks is still stale (async fetch not done), so header/content show wrong class.
      currentBlocks.value = []
      currentLessons.value = []
      store.setCurrentLessons([], [])

      const classData = store.classes?.find(c => c.class.name === className)
      if (!classData) return
      
      const response = await fetch(`${base}content/${classData.class.lessonsYaml}`) 
      const text = await response.text()
      const yamlData = yaml.load(text)
      
      // lessons: mixed array of { lesson: {...} } and { lesson_category: { text: '...' } }
      const rawItems = yamlData.lessons || []
      const lessonsWithArrayBlocks = []
      const displayList = []

      for (const item of rawItems) {
        if (!item || typeof item !== 'object') continue
        if (item.lesson != null) {
          const lessonData = item.lesson
          const blocks = normalizeBlocks(lessonData.blocks)
          const processed = {
            title: lessonData.button?.text || lessonData.title || 'Untitled',
            ...lessonData,
            blocks
          }
          const lessonIndex = lessonsWithArrayBlocks.length
          lessonsWithArrayBlocks.push(processed)
          displayList.push({ type: 'lesson', lesson: processed, lessonIndex })
        } else if (item.lesson_category != null || item.category != null) {
          const cat = item.lesson_category ?? item.category
          const text = typeof cat === 'object' && cat !== null
            ? (cat.text ?? cat.label ?? 'Section')
            : String(cat)
          displayList.push({ type: 'category', text })
        }
      }

      currentLessons.value = lessonsWithArrayBlocks
      store.setCurrentLessons(lessonsWithArrayBlocks, displayList)
      if (lessonsWithArrayBlocks.length > 0) {
        const lessonIndex = store.getLastLessonIndex(className, lessonsWithArrayBlocks.length)
        loadLesson(lessonIndex)
      } else {
        // Class has no lessons: clear lesson state so we don't show stale content
        store.setCurrentLesson(0)
        currentBlocks.value = []
      }
    } catch (error) {
      console.error('Failed to load class:', error)
    }
  }

  function loadLesson(lessonIndex) {
    store.setCurrentLesson(lessonIndex)
    // Use same lessons array as the list so we never show stale/wrong lesson content
    const lesson = currentLessons.value[lessonIndex]
    currentBlocks.value = Array.isArray(lesson?.blocks) ? [...lesson.blocks] : []
  }

  return {
    classes,           // ← REF
    currentLessons,
    currentBlocks,
    loadClasses,
    loadClass,
    loadLesson
  }
}