<template>
  <nav class="w-full bg-white text-black shadow-sm border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- Title - Left Side -->
      <h1 class="flex items-center gap-2 text-sm sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent tracking-tight leading-tight">
        <BookOpen class="size-5 sm:size-8 md:size-9 text-gray-700 shrink-0" aria-hidden />
        SQL Tutorial
      </h1>
      
      <!-- Dropdown - Right Side -->
      <div class="flex items-center gap-2">
        <LayoutList class="size-5 sm:size-6 text-gray-500 shrink-0" aria-hidden />
        <select 
          v-model="selectedClassName"
          @change="$emit('select-class', selectedClassName)"
          class="nav-select bg-white border-2 border-gray-200 hover:border-black focus:border-black focus:ring-4 focus:ring-gray-100 rounded-lg sm:rounded-2xl px-2 py-1.5 sm:px-6 sm:py-4 font-semibold text-gray-900 min-w-[5rem] sm:min-w-[260px] md:min-w-[300px] transition-all duration-200 shadow-md hover:shadow-xl focus:shadow-xl focus:outline-none appearance-none cursor-pointer"
        >
          <option 
            v-for="classItem in classes" 
            :key="classItem.class.name"
            :value="classItem.class.name"
          >
            {{ classItem.class.title }}
          </option>
        </select>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue'
import { BookOpen, LayoutList } from 'lucide-vue-next'
import { useClassroomStore } from '../../stores/classroom.js'

const store = useClassroomStore()
const emit = defineEmits(['select-class'])
const props = defineProps(['classes'])

const selectedClassName = ref('')

// When classes load, default to first class and keep dropdown in sync
watch(
  () => props.classes,
  (newClasses) => {
    if (newClasses.length > 0) {
      const current = store.currentClass?.class?.name
      const firstClassName = newClasses[0].class.name
      if (!current) {
        store.setCurrentClass(firstClassName)
        selectedClassName.value = firstClassName
      } else {
        selectedClassName.value = current
      }
    }
  },
  { immediate: true, deep: true }
)

// Sync store → dropdown (e.g. when store is set before Navbar mounts)
watch(
  () => store.currentClass?.class?.name,
  (newVal) => {
    if (newVal !== selectedClassName.value) {
      selectedClassName.value = newVal || ''
    }
  },
  { immediate: true }
)

// Sync dropdown → store
watch(selectedClassName, (newVal) => {
  if (newVal && newVal !== store.currentClass?.class?.name) {
    store.setCurrentClass(newVal)
    emit('select-class', newVal)
  }
})
</script>

<style scoped>
.nav-select {
  font-size: 0.7rem;
}
.nav-select option {
  font-size: 0.7rem;
}
@media (min-width: 641px) {
  .nav-select {
    font-size: 1.25rem;
  }
  .nav-select option {
    font-size: 1rem;
  }
}
</style>
