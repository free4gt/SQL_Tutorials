import { defineStore } from 'pinia'

const LAST_CLASS_KEY = 'sql-tutorial-last-class'
const LAST_LESSONS_KEY = 'sql-tutorial-last-lessons'

function getLastLessonsMap() {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(LAST_LESSONS_KEY)
    return raw ? { ...JSON.parse(raw) } : {}
  } catch {
    return {}
  }
}

function setLastLessonForClass(className, index) {
  if (typeof localStorage === 'undefined' || !className) return
  const map = getLastLessonsMap()
  map[className] = index
  localStorage.setItem(LAST_LESSONS_KEY, JSON.stringify(map))
}

export const useClassroomStore = defineStore('classroom', {
  state: () => ({
    classes: [],
    currentClass: null,
    currentLessonIndex: null
  }),

  actions: {
    setClasses(classes) {
      this.classes = Array.isArray(classes) ? classes : []
      if (this.classes.length === 0) return
      // Prefer cached class from localStorage if it exists in the list; first visit → no cache, use first class
      const cached = typeof localStorage !== 'undefined' ? localStorage.getItem(LAST_CLASS_KEY) : null
      const cachedExists = cached && this.classes.some(c => c.class.name === cached)
      if (cachedExists) {
        this.setCurrentClass(cached)
      } else {
        // First time or invalid cache: default to first class
        this.setCurrentClass(this.classes[0].class.name)
      }
    },

    setCurrentClass(className) {
      this.currentClass = this.classes.find(c => c.class.name === className)
      if (typeof localStorage !== 'undefined' && className) {
        localStorage.setItem(LAST_CLASS_KEY, className)
      }
    },
    
    setCurrentLessons(lessons, displayList = null) {
      if (this.currentClass) {
        this.currentClass.lessons = lessons
        this.currentClass.displayList = displayList ?? null
      }
    },
    
    setCurrentLesson(index) {
      this.currentLessonIndex = index
      if (this.currentClass?.class?.name != null) {
        setLastLessonForClass(this.currentClass.class.name, index)
      }
    },

    /** Returns cached lesson index for className if valid (0 <= index < lessonCount), else 0. */
    getLastLessonIndex(className, lessonCount) {
      const map = getLastLessonsMap()
      const idx = map[className]
      if (typeof idx === 'number' && idx >= 0 && idx < lessonCount) return idx
      return 0
    }
  }
})