const { createApp, ref } = Vue;

createApp({
  setup() {
    const currentIndex = ref(0);
    const currentVideoId = ref('');
    const currentCourse = ref(null);
    const currentNotes = ref('<p>Select a course...</p>');
    const isLoading = ref(false);
    const errorMessage = ref('');
    
    const courseList = [
      { name: 'Intro Course - Car Factory', file: 'car-factory.json' },
      { name: 'Practice', file: 'practice.json' },
      { name: 'SQL Tutorials', file: 'sql-tutorials.json' }
    ];

    // Auto-load Car Factory on startup (index 0)
    const initApp = async () => {
      await selectCourse(0); // Car Factory first
    };

    const selectCourse = async (courseIndex) => {
      isLoading.value = true;
      errorMessage.value = '';
      const courseFile = courseList[courseIndex].file;
      try {
        const response = await fetch(`./web_courses/${courseFile}`);
        if (!response.ok) throw new Error('Course not found');
        currentCourse.value = await response.json();
        currentIndex.value = 0;
        playLesson(0);
      } catch (error) {
        errorMessage.value = `Failed to load ${courseList[courseIndex].name}`;
        console.error('Failed to load course:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const playLesson = (index) => {
      currentIndex.value = index;
      const lesson = currentCourse.value.lessons[index];
      currentVideoId.value = lesson.id;
      currentNotes.value = lesson.notes;
    };

    // Initialize app on startup
    initApp();

    return {
      currentCourse,
      currentIndex,
      currentVideoId,
      currentNotes,
      isLoading,
      errorMessage,
      courseList,
      selectCourse,
      playLesson
    };
  }
}).mount('#app');