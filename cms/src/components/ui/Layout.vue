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
      <aside
        class="lesson-list-area"
        :class="{ 'lesson-list-area--collapsed': lessonListCollapsed }"
      >
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
        <div v-show="!lessonListCollapsed" class="lesson-list-slot">
          <slot name="lesson-list"></slot>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PanelRightOpen, PanelRightClose } from 'lucide-vue-next'

const lessonListCollapsed = ref(false)
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

.lesson-list-area {
  position: relative;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.lesson-list-toggle {
  position: absolute;
  top: 0.25rem;
  right: 0.5rem;
  z-index: 20;
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
  padding-top: 3rem;
  min-height: 100%;
}

/* Collapsed: content expands, list area shrinks to toggle only (same for all breakpoints) */
.main-content--list-collapsed .lesson-list-area {
  overflow: visible;
  min-width: 3rem;
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

/* Mobile Phones (portrait) — collapse: full-width content, button fixed bottom-right */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    padding: 4.25rem .5rem .5rem .5rem; 
    gap: 1rem;
  }
  .main-content--list-collapsed {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  .lesson-content-area {
    padding-bottom: 1rem;
  }
  .lesson-list-area {
    order: 2;
    max-height: 11.5rem; /* ~collapse area + 2 lesson buttons, extra so bottom isn't obscured */
    overflow-y: auto;
    position: sticky;
    bottom: 0;
  }
  .lesson-list-toggle {
    top: 0.125rem;
  }
  .lesson-list-slot {
    padding-top: 2.5rem;
  }
  .main-content--list-collapsed .lesson-list-area {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    left: auto;
    width: auto;
    height: auto;
    max-height: none;
    min-width: 0;
    order: unset;
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
    padding: 4.25rem .5rem .5rem .5rem; 
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


/* Small tablets (portrait) */
@media (min-width: 769px) and (max-width: 1023px) {
  .main-content {
    grid-template-columns: 2fr 1fr;
    padding: 4.75rem 1rem 2rem 1rem; 
    gap: 1.5rem;
  }
  .main-content--list-collapsed {
    grid-template-columns: 1fr 3rem;
    grid-template-rows: 1fr;
  }
  .main-content--list-collapsed .lesson-list-area {
    min-width: 3rem;
  }
}
/* Large tablets / laptops / monitors */
@media (min-width: 1024px) { 
  .main-content {
    padding-top: 7rem;
    grid-template-columns: 3fr 1fr;
    padding: 5rem 1rem 2rem 1rem; 
    gap: 2rem;
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
    padding: 5rem 1rem 1rem 1rem; 
    gap: 2rem;
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
}

</style>