import { defineStore } from 'pinia'

export const useClassroomStore = defineStore('classroom', {
  state: () => ({
    classes: [],
    currentClass: null,
    currentLessonIndex: null
  }),
  
  actions: {
    setClasses(classes) {
      this.classes = classes
      // Set first class as default when classes are loaded
      if (classes.length > 0 && !this.currentClass) {
        this.setCurrentClass(classes[0].class.name)
      }
    },
    
    setCurrentClass(className) {
      this.currentClass = this.classes.find(c => c.class.name === className)
    },
    
    setCurrentLessons(lessons, displayList = null) {
      if (this.currentClass) {
        this.currentClass.lessons = lessons
        this.currentClass.displayList = displayList ?? null
      }
    },
    
    setCurrentLesson(index) {
      this.currentLessonIndex = index
    }
  }
})