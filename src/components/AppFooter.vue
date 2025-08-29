<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2025 O Que Ver? Descubra filmes incríveis com nosso recomendador aleatório.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer {
  background: var(--color-surface);
  color: var(--color-text-muted);
  padding: 40px 0;
  margin-top: auto;
  border-top: 1px solid var(--color-border);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.footer-content p {
  margin: 0;
  font-size: 0.875rem;
}
</style>
