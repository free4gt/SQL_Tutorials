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
.app-layout { 
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f7fa; 
}

.navbar-area { 
  flex-shrink: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
}

.main-content { 
  flex: 1;
  min-height: 0;
  display: grid; 
  grid-template-columns: 3fr 1fr; 
  gap: 2rem; 
  padding: 6rem 0 2rem 2rem; /* top = below fixed navbar (phone default) */
}

.lesson-content-area {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* Tablet: between phone and desktop */
@media (min-width: 769px) {
  .main-content {
    padding-top: 6.5rem;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  .main-content {
    padding-top: 7rem;
  }
}

.lesson-content-area > * {
  flex: 1 1 0;
  min-height: 0;
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

/* MOBILE RESPONSIVE – equal left/right margin */
@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    padding: 6rem 1rem 1rem 1rem;
    gap: 1rem;
  }
  .lesson-list-area {
    order: 2;
    max-height: 300px;
    overflow-y: auto;
    position: sticky;
    bottom: 0;
  }
}

@media (max-width: 480px) {
  .main-content { padding: 6rem 0.75rem 0.5rem 0.75rem; }
  .lesson-content-area {
    padding-bottom: 1rem;
  }
}
</style>