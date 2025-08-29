<template>
  <div class="section-header">
    <h2 class="section-title">
      <i v-if="icon" :class="icon"></i>
      {{ title }}
    </h2>
    <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  icon?: string
}

defineProps<Props>()
</script>

<style scoped>
.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.section-title i {
  color: var(--color-primary);
  font-size: 2rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  margin: 0;
}
</style>
