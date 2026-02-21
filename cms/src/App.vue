<template>
  <Layout>
    <template #navbar>
      <Navbar :classes="classes" @select-class="loadClass" />
    </template>
    <template #lesson-list>
      <LessonList
        :lessons="currentLessons"
        :display-list="store.currentClass?.displayList ?? []"
        @select-lesson="loadLesson"
      />
    </template>
    <template #lesson-content>
      <LessonContent
        :blocks="currentBlocks"
        :lesson-key="`${store.currentClass?.class?.name ?? ''}-${store.currentLessonIndex ?? -1}`"
      />
    </template>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import Layout from './components/ui/Layout.vue'
import Navbar from './components/ui/Navbar.vue'
import LessonList from './components/ui/LessonList.vue'
import LessonContent from './components/ui/LessonContent.vue'
import { useClassroomStore } from './stores/classroom.js'
import { useSqlInterpreterStore } from './stores/sqlInterpreter.js'
import { useYamlLoader } from './composables/useYamlLoader.js'

const store = useClassroomStore()
const sqlStore = useSqlInterpreterStore()
const { classes, currentLessons, currentBlocks, loadClasses, loadClass, loadLesson } = useYamlLoader(store)

onMounted(() => {
  sqlStore.initDb()
  loadClasses()
})
</script>