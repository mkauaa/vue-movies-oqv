<template>
  <div class="carousel">
    <div class="carousel-header" v-if="title || subtitle">
      <h3 class="carousel-title" v-if="title">{{ title }}</h3>
      <p class="carousel-subtitle" v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="carousel-wrapper">
      <button
        class="nav prev"
        @click="scrollByAmount(-1)"
        :disabled="!canPrev"
        aria-label="Anterior"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div ref="track" class="carousel-track" @scroll="onScroll">
        <div v-for="movie in uniqueMovies" :key="movie.id" class="carousel-item">
          <MovieCard :movie="movie" />
        </div>
      </div>
      <button class="nav next" @click="scrollByAmount(1)" :disabled="!canNext" aria-label="Próxima">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import MovieCard from '@/components/MovieCard.vue'
import type { Movie } from '@/services/tmdbApi'

interface Props {
  movies: Movie[]
  title?: string
  subtitle?: string
}

const props = defineProps<Props>()
const track = ref<HTMLDivElement | null>(null)
const canNext = ref(true)
const canPrev = ref(false)

const uniqueMovies = computed(() => {
  const seen = new Set<number>()
  return props.movies.filter((m) => {
    if (seen.has(m.id)) return false
    seen.add(m.id)
    return true
  })
})

const scrollByAmount = (direction: number) => {
  if (!track.value) return
  const itemWidth = track.value.firstElementChild?.clientWidth || 280
  const gap = 30
  track.value.scrollBy({ left: direction * (itemWidth + gap) * 2, behavior: 'smooth' })
}

const updateButtons = () => {
  if (!track.value) return
  const el = track.value
  const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth
  const atStart = el.scrollLeft <= 0
  canNext.value = !atEnd
  canPrev.value = !atStart
}

const onScroll = () => updateButtons()

onMounted(() => {
  updateButtons()
  window.addEventListener('resize', updateButtons)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateButtons)
})
</script>

<style scoped>
.carousel-header {
  text-align: center;
  margin-bottom: 16px;
}

.carousel-title {
  margin: 0 0 4px 0;
  color: var(--color-text);
}

.carousel-subtitle {
  margin: 0;
  color: var(--color-text-muted);
}

.carousel-wrapper {
  position: relative;
}

.carousel-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(200px, 1fr);
  gap: 30px;
  overflow-x: hidden;
  scroll-snap-type: x mandatory;
  padding: 8px 48px;
}

.carousel-item {
  scroll-snap-align: start;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
}

.nav:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.prev {
  left: 0;
}
.next {
  right: 0;
}

.nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .carousel-track {
    padding: 8px 16px;
    gap: 16px;
  }
}
</style>
