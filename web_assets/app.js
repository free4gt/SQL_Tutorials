const { createApp, ref } = Vue;

createApp({
  setup() {
    const currentIndex = ref(0);
    const currentVideoId = ref('');
    const currentCourse = ref(null);
    const currentNotes = ref('<p>Select a course...</p>');
    const isLoading = ref(false);
    const errorMessage = ref('');
    const courseList = ref([]);
    
    const loadCourseList = async () => {
      try {
        const response = await fetch('./web_courses/table-of-contents.json');
        if (!response.ok) throw new Error('Table of contents not found');
        courseList.value = await response.json();
      } catch (error) {
        console.error('Failed to load table of contents:', error);
        courseList.value = [];
        errorMessage.value = 'Failed to load course list';
      }
    };

    const selectCourse = async (courseIndex) => {
      isLoading.value = true;
      errorMessage.value = '';
      const courseFile = courseList.value[courseIndex].file;
      
      try {
        const response = await fetch(`./web_courses/course_content/${courseFile}`);
        if (!response.ok) throw new Error('Course not found');
        currentCourse.value = await response.json();
        currentIndex.value = 0;
        playLesson(0);
      } catch (error) {
        errorMessage.value = `Failed to load ${courseList.value[courseIndex]?.name || 'course'}`;
        console.error('Failed to load course:', error);
      } finally {
        isLoading.value = false;  // ✅ FIXED
      }
    };

    const playLesson = (index) => {
      currentIndex.value = index;
      const lesson = currentCourse.value?.lessons?.[index];
      if (lesson) {
        currentVideoId.value = lesson.id;
        currentNotes.value = lesson.notes || '<p>No notes available</p>';
      }
    };

    // Auto-load first course + video on startup ✅
    const initApp = async () => {
      await loadCourseList();
      if (courseList.value.length > 0) {
        await selectCourse(0);  // Auto-plays first video!
      }
    };
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