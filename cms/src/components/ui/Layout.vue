<template>
  <div class="app-layout">
    <header class="navbar-area">
      <slot name="navbar"></slot>
    </header>
    <div class="main-content">
      <main class="lesson-content-area">
        <slot name="lesson-content"></slot>
      </main>
      <aside class="lesson-list-area">
        <slot name="lesson-list"></slot>
      </aside>
    </div>
  </div>
</template>

<script setup>
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
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.lesson-content-area > *::-webkit-scrollbar,
.lesson-list-area::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

/* Mobile Phones (portrait) */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    padding: 4.25rem .5rem .5rem .5rem; 
    gap: 1rem;
  }
  .lesson-content-area {
    padding-bottom: 1rem;
  }
  .lesson-list-area {
    order: 2;
    max-height: 120px; /* compact but show at least 2 lesson buttons */
    overflow-y: auto;
    position: sticky;
    bottom: 0;
  }
}
/* Mobile phones (landscape) — only when actually landscape so portrait doesn’t get overridden */
@media (max-height: 768px) and (orientation: landscape) {
  .main-content {
    grid-template-columns: 3fr 1fr;
    padding: 4.25rem .5rem .5rem .5rem; 
    gap: 1.5rem;
  }
  .lesson-list-area {
    max-height: none; /* allow list to use full column so it doesn’t cut off */
    position: static;
    order: unset;
  }
}

/* Small tablets (portrait) */
@media (min-width: 768px) and (max-width: 1023px) {
  .main-content {
    grid-template-columns: 2fr 1fr;
    padding: 4.75rem 1rem 2rem 1rem; 
    gap: 1.5rem;
  }
}
/* large tablets/laptops/monitors (landscape) */
@media (min-width: 1024px) { 
  .main-content {
    padding-top: 7rem;
    grid-template-columns: 3fr 1fr;
    padding: 5rem 1rem 2rem 1rem; 
    gap: 2rem;
  }
}

@media (min-width: 1300px) { 
  .main-content {
    padding-top: 7rem;
    grid-template-columns: 3fr 1fr;
    padding: 5rem 1rem 1rem 1rem; 
    gap: 2rem;
  }
  .lesson-content-area {
    padding: 0 10% 2rem 10%; 
  }
}

</style>