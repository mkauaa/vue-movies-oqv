<template>
  <div class="card cursor-pointer hover-lift" @click="navigateToMovie">
    <div class="poster-container">
      <img
        ref="imageRef"
        :src="currentSrc"
        :alt="movie.title"
        class="poster-img"
        :class="{ loading: !isLoaded }"
      />
      <div v-if="!isLoaded" class="skeleton"></div>
    </div>

    <div class="flex flex-col gap-2 mt-4">
      <h3 class="text-lg font-bold">{{ movie.title }}</h3>

      <div class="flex items-center justify-between text-sm text-muted">
        <span>{{ formatDate(movie.release_date) }}</span>
        <span class="flex items-center gap-1">
          <i class="pi pi-star-fill text-primary"></i>
          {{ movie.vote_average.toFixed(1) }}
        </span>
      </div>

      <p v-if="movie.overview" class="text-sm text-muted line-clamp-3">
        {{ truncateOverview(movie.overview) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { tmdbApi, type Movie } from '@/services/tmdbApi'
import { useLazyImage } from '@/composables/useLazyImage'

interface Props {
  movie: Movie
}

const props = defineProps<Props>()
const router = useRouter()

const posterUrl = computed(() => {
  return tmdbApi.getImageUrl(props.movie.poster_path, 'w342')
})

// Lazy loading implementation
const { imageRef, currentSrc, isLoaded } = useLazyImage(posterUrl.value)

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.getFullYear()
}

const truncateOverview = (overview: string) => {
  if (overview.length <= 100) return overview
  return overview.substring(0, 100) + '...'
}

const navigateToMovie = () => {
  router.push(`/movie/${props.movie.id}`)
}
</script>

<style scoped>
/* Específico do componente */
.poster-container {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  border-radius: 0.5rem;
  max-height: 280px;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .poster-img {
  transform: scale(1.05);
}

.skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #333 25%, #555 50%, #333 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.poster-img.loading {
  opacity: 0;
}

/* Movido para utilities.css */

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 768px) {
  .poster-container {
    max-height: 240px;
  }
}
</style>
