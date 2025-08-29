<template>
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <div class="container">
      <div class="hero-content">
        <div class="hero-row">
          <div class="hero-text">
            <h1 class="hero-title">
              Indeciso? Te digo <br /><span class="title-highlight">O Que Ver</span>
            </h1>
            <p class="hero-subtitle">
              Com filtragem personalizada ou pura sorte, encontre seu novo filme favorito!
            </p>
            <button class="hero-scroll-btn" type="button" @click="scrollToFilters">
              <i class="pi pi-star-fill"></i>
              Sortear
            </button>
          </div>
          <img class="hero-image" :src="heroImageSrc" alt="Hero" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const heroImageSrc = computed(() => `${import.meta.env.BASE_URL}heroImage.png`)

const scrollToFilters = () => {
  const el = document.getElementById('filters')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-background) 100%);
  background-image: url('@/assets/cinema-fundo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: var(--color-text);
  min-height: 100vh;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.hero-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  max-width: 1100px;
  width: 100%;
}

.hero-text {
  flex: 0 0 auto;
  max-width: 620px;
  width: 620px;
}

.hero-image {
  flex: 0 0 auto;
  width: 320px;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.1;
}

.title-highlight {
  font-size: 4rem;
  font-weight: 900;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin: 0 0 40px 0;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.scroll-button {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scroll-button:hover {
  transform: translateX(-50%) translateY(-2px);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.scroll-icon {
  width: 22px;
  height: 22px;
}

.hero-scroll-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);
}

.hero-scroll-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .hero-row {
    gap: 60px;
    max-width: 900px;
  }

  .hero-text {
    width: 500px;
    max-width: 500px;
  }

  .hero-image {
    width: 280px;
  }

  .hero-title {
    font-size: 3rem;
  }

  .title-highlight {
    font-size: 3.2rem;
  }
}

@media (max-width: 768px) {
  .hero-row {
    flex-direction: column-reverse;
    gap: 40px;
    text-align: center;
  }

  .hero-text {
    width: 100%;
    max-width: 100%;
  }

  .hero-image {
    width: 240px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 2rem;
  }

  .title-highlight {
    font-size: 2.2rem;
  }
}

@media (max-width: 480px) {
  .hero-content {
    padding: 0 16px;
  }

  .title-highlight {
    font-size: 1.8rem;
  }
}
</style>
