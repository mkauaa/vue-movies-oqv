<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div id="app">
    <!-- Header -->
    <AppHeader />

    <!-- Conteúdo principal -->
    <main class="main">
      <RouterView />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main */
.main {
  flex: 1;
}
</style>
