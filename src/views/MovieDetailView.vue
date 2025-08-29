<template>
  <div class="movie-detail">
    <div v-if="moviesStore.isLoading && !moviesStore.currentMovie" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando detalhes do filme...</p>
    </div>

    <div v-else-if="moviesStore.error" class="error-container">
      <p class="error-message">{{ moviesStore.error }}</p>
      <button @click="retryLoad" class="retry-button">Tentar Novamente</button>
    </div>

    <div v-else-if="moviesStore.currentMovie" class="movie-content">
      <!-- Hero Section integrado -->
      <section class="movie-hero">
        <div class="hero-backdrop" :style="{ backgroundImage: `url(${backdropUrl})` }"></div>
        <div class="hero-overlay">
          <div class="container">
            <div class="hero-content">
              <div class="movie-poster">
                <img :src="posterUrl" :alt="moviesStore.currentMovie.title" class="poster-image" />
              </div>

              <div class="movie-info">
                <h1 class="movie-title">{{ moviesStore.currentMovie.title }}</h1>
                <p class="movie-original-title">{{ moviesStore.currentMovie.original_title }}</p>

                <div class="movie-meta">
                  <span class="meta-item">
                    <span class="meta-icon">📅</span>
                    {{ getYear(moviesStore.currentMovie.release_date) }}
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">⏱️</span>
                    {{ formatRuntime(moviesStore.currentMovie.runtime) }}
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">⭐</span>
                    {{ moviesStore.currentMovie.vote_average.toFixed(1) }}
                  </span>
                </div>

                <div class="movie-genres">
                  <span
                    v-for="genre in moviesStore.currentMovie.genres"
                    :key="genre.id"
                    class="genre-tag"
                  >
                    {{ genre.name }}
                  </span>
                </div>

                <p class="movie-overview">{{ moviesStore.currentMovie.overview }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção detalhada removida conforme solicitado -->
    </div>

    <div v-else class="not-found">
      <div class="not-found-content">
        <h2>Filme indisponível</h2>
        <p>Este filme não está disponível no momento.</p>
        <router-link to="/" class="back-button">Voltar ao Início</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'
import { tmdbApi } from '@/services/tmdbApi'

const route = useRoute()

const moviesStore = useMoviesStore()

const movieId = computed(() => Number(route.params.id))

const posterUrl = computed(() => {
  if (!moviesStore.currentMovie) return ''
  return tmdbApi.getImageUrl(moviesStore.currentMovie.poster_path, 'w500')
})

const backdropUrl = computed(() => {
  if (!moviesStore.currentMovie) return ''
  return tmdbApi.getImageUrl(moviesStore.currentMovie.backdrop_path, 'w1280')
})

const getYear = (dateString: string) => {
  if (!dateString) return 'Ano não disponível'
  return new Date(dateString).getFullYear()
}

const formatRuntime = (minutes: number) => {
  if (!minutes) return 'Duração não disponível'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
}

// Funções de orçamento e logo removidas pois seção de detalhes foi retirada

const retryLoad = () => {
  moviesStore.clearError()
  loadMovie()
}

const loadMovie = async () => {
  if (movieId.value) {
    await moviesStore.fetchMovieDetails(movieId.value)
  }
}

onMounted(() => {
  loadMovie()
})

watch(movieId, () => {
  loadMovie()
})
</script>

<style scoped>
/* .movie-detail não precisa de estilos específicos */

.loading-container,
.error-container {
  text-align: center;
  padding: 120px 20px;
  background: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #dc3545;
  font-size: 1.125rem;
  margin: 0 0 20px 0;
}

.retry-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background: #0056b3;
}

.movie-hero {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: flex-end;
  color: white;
  background: #1a1a1a;
}

.hero-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.8;
}

.hero-overlay {
  position: relative;
  width: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  z-index: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-content {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  padding: 60px 0;
  align-items: end;
}

.movie-poster {
  flex-shrink: 0;
}

.poster-image {
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.movie-info {
  max-width: 600px;
}

.movie-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.1;
}

.movie-original-title {
  font-size: 1.25rem;
  margin: 0 0 24px 0;
  opacity: 0.8;
  font-style: italic;
}

.movie-meta {
  display: flex;
  gap: 24px;
  margin: 0 0 24px 0;
  align-items: center;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.meta-icon {
  font-size: 1rem;
}

.movie-genres {
  display: flex;
  gap: 12px;
  margin: 0 0 24px 0;
  flex-wrap: wrap;
}

.genre-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.movie-overview {
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
}

/* Estilos de detalhes removidos - seção não utilizada */

.not-found {
  text-align: center;
  padding: 120px 20px;
  background: white;
}

.not-found-content {
  max-width: 500px;
  margin: 0 auto;
}

.not-found h2 {
  font-size: 2rem;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.not-found p {
  color: #666;
  margin: 0 0 24px 0;
  font-size: 1.125rem;
}

.back-button {
  display: inline-block;
  background: #007bff;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

/* Desktop First - Layout padrão para telas grandes */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .movie-poster {
    margin: 0 auto;
  }

  /* Grid de detalhes removido */

  .movie-title {
    font-size: 3rem;
  }
}

/* Tablet */
@media (max-width: 768px) {
  .movie-hero {
    min-height: 400px;
  }

  .hero-content {
    padding: 40px 0;
  }

  .movie-title {
    font-size: 2.5rem;
  }

  .movie-meta {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }

  /* Padding de detalhes removido */

  .poster-image {
    width: 250px;
    height: 375px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .movie-title {
    font-size: 2rem;
  }

  .poster-image {
    width: 200px;
    height: 300px;
  }

  /* Seção de detalhes removida */

  .container {
    padding: 0 16px;
  }
}
</style>
