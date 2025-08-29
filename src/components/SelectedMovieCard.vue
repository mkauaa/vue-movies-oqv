<template>
  <div class="selected-movie-card">
    <div class="selected-movie-poster">
      <img :src="posterUrl" :alt="movie.title" @error="onImgError" />
      <div class="selected-badge">
        <i class="pi pi-star-fill"></i>
        <span class="badge-text">SORTEADO</span>
      </div>
    </div>

    <div class="selected-movie-info">
      <h3 class="selected-movie-title">{{ movie.title }}</h3>
      <div class="selected-movie-meta">
        <span class="selected-year">{{ releaseYear }}</span>
        <span class="selected-rating"><i class="pi pi-star-fill"></i> {{ rating }}</span>
      </div>
      <p v-if="movie.overview" class="selected-overview">{{ movie.overview }}</p>

      <div class="selected-actions">
        <button @click="$emit('view-details')" class="details-button">
          <i class="pi pi-eye"></i>
          Ver Detalhes
        </button>
        <button @click="$emit('randomize')" class="btn btn-secondary">
          <i class="pi pi-star-fill"></i>
          Sortear Outro
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { tmdbApi, type Movie } from '@/services/tmdbApi'

defineEmits<{
  'view-details': []
  randomize: []
}>()

interface Props {
  movie: Movie
}

const props = defineProps<Props>()

const posterUrl = computed(() => tmdbApi.getImageUrl(props.movie.poster_path, 'w500'))
const releaseYear = computed(() =>
  props.movie.release_date ? new Date(props.movie.release_date).getFullYear() : '',
)
const rating = computed(() => props.movie.vote_average?.toFixed(1))

const onImgError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-movie.svg'
}
</script>

<style scoped>
.selected-movie-card {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  background: var(--color-surface);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.selected-movie-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
}

.selected-movie-poster {
  position: relative;
}

.selected-movie-poster img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.selected-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);
}

.selected-movie-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.selected-movie-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.selected-movie-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.selected-year,
.selected-rating {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.selected-rating i {
  color: var(--color-warning);
}

.selected-overview {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0 0 30px 0;
}

.selected-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.details-button,
.new-random-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.details-button {
  background: var(--color-primary);
  color: white;
}

.details-button:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}

.new-random-button {
  background: var(--color-accent);
  color: white;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.new-random-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
}

@media (max-width: 1024px) {
  .selected-movie-card {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .selected-movie-poster {
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .selected-movie-card {
    padding: 30px 20px;
  }

  .selected-actions {
    justify-content: center;
  }

  .details-button,
  .new-random-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
