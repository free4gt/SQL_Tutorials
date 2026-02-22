<template>
  <div class="app-layout">
    <header class="navbar-area">
      <slot name="navbar"></slot>
    </header>
    <div
      class="main-content"
      :class="{ 'main-content--list-collapsed': lessonListCollapsed }"
    >
      <main class="lesson-content-area">
        <slot name="lesson-content"></slot>
      </main>
      <div class="mobile-sticky-bar">
        <aside
          class="lesson-list-area"
          :class="{ 'lesson-list-area--collapsed': lessonListCollapsed }"
        >
          <div class="lesson-list-sticky-header">
            <h3 class="lesson-list-sticky-header__title" v-katex>
              <BookOpen class="lesson-list-sticky-header__icon" aria-hidden />
              {{ classTitle }}
            </h3>
            <button
              type="button"
              class="lesson-list-toggle"
              :class="{ 'lesson-list-toggle--bottom': lessonListCollapsed }"
              :aria-label="lessonListCollapsed ? 'Show lesson list' : 'Hide lesson list'"
              @click="lessonListCollapsed = !lessonListCollapsed"
            >
              <PanelRightOpen v-if="lessonListCollapsed" aria-hidden />
              <PanelRightClose v-else aria-hidden />
            </button>
          </div>
          <div v-show="!lessonListCollapsed" class="lesson-list-slot">
            <slot name="lesson-list"></slot>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { BookOpen, PanelRightOpen, PanelRightClose } from 'lucide-vue-next'
import { useClassroomStore } from '../../stores/classroom.js'

const lessonListCollapsed = ref(false)
const store = useClassroomStore()
const classTitle = computed(() => store.currentClass?.class?.title || 'Lessons')
</script>

<style scoped>

 /* main layout */
.app-layout { 
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7fa; 
}

 /* navbar area */
.navbar-area { 
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
}

 /* main content area */
 .main-content { 
  flex: 1;
  min-height: 0;
  display: grid;
  overflow-x: hidden;
}

/* lesson content area */
.lesson-content-area {
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.lesson-content-area > * {
  flex: 0 0 auto;
  min-height: 100%;
}

/* Wrapper for title + lesson list: on mobile it's a sticky bar below navbar */
.mobile-sticky-bar {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.lesson-list-area {
  position: relative;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  flex-direction: column;
}

/* Sticky title + collapse button: same row, stay fixed when scrolling lesson list (all breakpoints) */
.lesson-list-sticky-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 1px 0 0 rgba(0,0,0,0.04);
}
.lesson-list-sticky-header__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: clamp(0.8125rem, 2.5vw, 1.1rem);
  font-weight: 600;
  color: #333;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lesson-list-sticky-header__icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #666;
  flex-shrink: 0;
}

.lesson-list-sticky-header .lesson-list-toggle {
  position: static;
  flex-shrink: 0;
}
.lesson-list-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: white;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.lesson-list-toggle:hover {
  background: #f0f0f0;
  color: #111;
}
.lesson-list-toggle:focus-visible {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}

.lesson-list-slot {
  min-height: 0;
  flex: 1 1 auto;
}

/* Collapsed: only the toggle button is visible — no title bar, no white box (all breakpoints) */
.main-content--list-collapsed .lesson-list-area {
  overflow: visible;
  min-width: 0;
  background: transparent;
  box-shadow: none;
}
.main-content--list-collapsed .lesson-list-sticky-header {
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
  justify-content: flex-end;
}
.main-content--list-collapsed .lesson-list-sticky-header__title {
  display: none;
}
.main-content--list-collapsed .lesson-list-slot {
  display: none;
}
.main-content--list-collapsed {
  grid-template-columns: 1fr 3rem;
  grid-template-rows: 1fr;
}

.lesson-content-area > *::-webkit-scrollbar,
.lesson-list-area::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

/* Mobile Phones (portrait) — content on top, lesson list full width at bottom, no side grey */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) auto;
    padding: 4.25rem 0 .5rem 0;
    gap: 1rem;
    overflow: hidden;
  }
  .main-content--list-collapsed {
    grid-template-rows: 1fr;
  }
  .lesson-content-area {
    padding: 0 0.5rem 1rem 0.5rem;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .mobile-sticky-bar {
    flex-shrink: 0;
    background: #f5f7fa;
    border-top: 2px solid #c5d0de;
    padding: 0.25rem 0 0 0;
  }
  .lesson-list-sticky-header {
    padding: 0.5rem 0.75rem;
  }
  .lesson-list-area {
    flex-shrink: 0;
    max-height: 11.5rem;
    overflow-y: auto;
    min-height: 0;
  }
  .main-content--list-collapsed .lesson-list-area {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    left: auto;
    width: auto;
    min-width: 0;
    max-height: none;
    overflow: visible;
    z-index: 50;
  }
  .main-content--list-collapsed .lesson-list-toggle--bottom {
    position: absolute;
    top: auto;
    bottom: 0;
    right: 0;
  }
}
/* Mobile phones (landscape) — only when actually landscape so portrait doesn’t get overridden */
@media (max-height: 768px) and (orientation: landscape) {
  .main-content {
    grid-template-columns: 3fr 1fr;
    padding: 4.25rem .5rem .5rem 0;
    gap: 1.5rem;
  }
  .lesson-content-area {
    min-width: 0;
  }
  .main-content--list-collapsed {
    grid-template-columns: 1fr 3rem;
    grid-template-rows: 1fr;
  }
  .main-content--list-collapsed .lesson-list-area {
    min-width: 3rem;
  }
  .main-content--list-collapsed .lesson-list-toggle--bottom {
    position: absolute;
    top: 0.25rem;
    right: 0.5rem;
    bottom: auto;
  }
  .lesson-list-area {
    max-height: none; /* allow list to use full column so it doesn’t cut off */
    position: relative;
    order: unset;
    z-index: 10;
    min-width: 0;
  }
  .lesson-list-toggle {
    z-index: 20;
  }
}


/* Small tablets (portrait) — lesson list flush right and top */
@media (min-width: 769px) and (max-width: 1023px) {
  .main-content {
    grid-template-columns: 2fr 1fr;
    padding: 4.75rem 1rem 2rem 0; 
    gap: 1.5rem;
  }
  .lesson-list-sticky-header {
    padding: 0 0 0.5rem 0.75rem;
  }
  .main-content--list-collapsed {
    grid-template-columns: 1fr 3rem;
    grid-template-rows: 1fr;
  }
  .main-content--list-collapsed .lesson-list-area {
    min-width: 3rem;
  }
}
/* Large tablets / laptops / monitors — lesson list flush right and top */
@media (min-width: 1024px) { 
  .main-content {
    padding-top: 7rem;
    grid-template-columns: 3fr 1fr;
    padding: 5rem 1rem 2rem 0; 
    gap: 2rem;
  }
  .lesson-list-sticky-header {
    padding: 0.5rem 0 0.5rem 0.75rem;
  }
  .main-content--list-collapsed {
    grid-template-columns: 1fr 3rem;
    grid-template-rows: 1fr;
  }
  .main-content--list-collapsed .lesson-list-area {
    min-width: 3rem;
  }
}

@media (min-width: 1300px) { 
  .main-content {
    padding-top: 7rem;
    grid-template-columns: 3fr 1fr;
    padding: 5rem 1rem 1rem 0; 
    gap: 2rem;
  }
  .lesson-list-sticky-header {
    padding: 0 0 0.5rem 0.75rem;
  }
  .main-content--list-collapsed {
    grid-template-columns: 1fr 3rem;
    grid-template-rows: 1fr;
  }
  .main-content--list-collapsed .lesson-list-area {
    min-width: 3rem;
  }
  .lesson-content-area {
    padding: 0 10% 2rem 10%; 
  }
  /* Divider spans full width of content area (breaks out of 10% padding) */
  .lesson-content-area :deep(.block-divider) {
    width: 125%;
    margin-left: -12.5%;
  }
  .lesson-content-area :deep(.block-divider .block-divider__line) {
    width: 100%;
  }
}

</style>