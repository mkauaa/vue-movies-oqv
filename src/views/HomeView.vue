<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'
// import MovieCard from '@/components/MovieCard.vue'
import MovieFilters from '@/components/MovieFilters.vue'
import HomeHero from '@/components/HomeHero.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import SelectedMovieCard from '@/components/SelectedMovieCard.vue'
import { type MovieFilters as MovieFiltersType } from '@/services/tmdbApi'
import MoviesCarousel from '@/components/MoviesCarousel.vue'

const router = useRouter()
const moviesStore = useMoviesStore()

// Computed properties

const otherMovies = computed(() => {
  // Se há filme selecionado, sempre mostrar outros filmes dos resultados (exceto o em destaque)
  if (moviesStore.selectedRandomMovie && moviesStore.randomMovies.length > 0) {
    return moviesStore.randomMovies.filter(
      (movie) => movie.id !== moviesStore.selectedRandomMovie?.id,
    )
  }

  // Se não há filme selecionado, mostrar todos os filmes aleatórios
  return moviesStore.randomMovies
})

// Computed para obter informações do sorteio dinâmico
const dynamicSortInfo = computed(() => {
  if (!moviesStore.appliedFilters?.isDynamicRandom) return null

  const filters = moviesStore.appliedFilters
  const year = filters.yearFrom || filters.yearTo
  const genreId = filters.genres[0]

  // Encontrar o nome do gênero
  const genre = moviesStore.genres.find((g) => g.id === genreId)

  return {
    year,
    genreName: genre?.name || 'Desconhecido',
  }
})

// Computed para obter informações dos filtros aplicados pelo usuário
const userFiltersInfo = computed(() => {
  if (!moviesStore.appliedFilters || moviesStore.appliedFilters.isDynamicRandom) return null

  const filters = moviesStore.appliedFilters
  const parts: string[] = []

  // Gêneros
  if (filters.genres.length > 0) {
    const genreNames = filters.genres
      .map((id) => moviesStore.genres.find((g) => g.id === id)?.name)
      .filter(Boolean) as string[]
    if (genreNames.length > 0) {
      parts.push(genreNames.length === 1 ? genreNames[0] : genreNames.join(', '))
    }
  }

  // Ano
  if (filters.yearFrom && filters.yearTo) {
    if (filters.yearFrom === filters.yearTo) {
      parts.push(`lançados em ${filters.yearFrom}`)
    } else {
      parts.push(`lançados entre ${filters.yearFrom} e ${filters.yearTo}`)
    }
  } else if (filters.yearFrom) {
    parts.push(`lançados a partir de ${filters.yearFrom}`)
  } else if (filters.yearTo) {
    parts.push(`lançados até ${filters.yearTo}`)
  }

  // Duração
  if (filters.minDuration && filters.maxDuration) {
    parts.push(`com duração entre ${filters.minDuration} e ${filters.maxDuration} min`)
  } else if (filters.minDuration) {
    parts.push(`com duração mínima de ${filters.minDuration} min`)
  } else if (filters.maxDuration) {
    parts.push(`com duração máxima de ${filters.maxDuration} min`)
  }

  // Avaliação
  if (filters.minRating) {
    parts.push(`com nota mínima ${filters.minRating}`)
  }

  return parts.length > 0 ? parts.join(' ') : null
})

// Methods
const loadMovies = async () => {
  await moviesStore.fetchPopularMovies()
}

const retryLoad = () => {
  loadMovies()
}

const handleFindRandom = async (filters: MovieFiltersType) => {
  // Verificar se não há filtros aplicados
  const hasFilters =
    filters.yearFrom ||
    filters.yearTo ||
    filters.genres.length > 0 ||
    filters.minDuration !== null ||
    filters.maxDuration !== null ||
    ('minRating' in filters && (filters as { minRating?: number }).minRating !== null)

  if (!hasFilters) {
    // Se não há filtros, fazer sorteio dinâmico: ano + gênero + filme
    await handleRandomWithDynamicFilters()
  } else {
    // Se há filtros, usar a lógica normal
    await moviesStore.fetchRandomMovies(filters)
  }
}

// Nova função para sorteio dinâmico
const handleRandomWithDynamicFilters = async () => {
  // Carregar gêneros se não estiver carregado
  if (moviesStore.genres.length === 0) {
    await moviesStore.fetchGenres()
  }

  // Sortear um ano aleatório (últimos 30 anos para ter mais variedade)
  const currentYear = new Date().getFullYear()
  const minYear = currentYear - 30 // Ex: 1994 se estamos em 2024
  const randomYear = Math.floor(Math.random() * (currentYear - minYear + 1)) + minYear

  // Sortear um gênero aleatório
  const randomGenreIndex = Math.floor(Math.random() * moviesStore.genres.length)
  const randomGenre = moviesStore.genres[randomGenreIndex]

  // Criar filtros com ano e gênero sorteados
  const dynamicFilters: MovieFiltersType = {
    yearFrom: randomYear.toString(),
    yearTo: randomYear.toString(),
    genres: [randomGenre.id],
    minDuration: null,
    maxDuration: null,
  }

  // Buscar filmes com os filtros sorteados
  await moviesStore.fetchRandomMovies(dynamicFilters)

  // Marcar como sorteio dinâmico (não filtros do usuário)
  moviesStore.appliedFilters = { ...dynamicFilters, isDynamicRandom: true }
}

const retryRandom = () => {
  if (moviesStore.appliedFilters) {
    moviesStore.fetchRandomMovies(moviesStore.appliedFilters)
  }
}

const findNewRandom = () => {
  // Se não há filtros aplicados pelo usuário, fazer novo sorteio dinâmico
  if (!moviesStore.hasAppliedFilters) {
    handleRandomWithDynamicFilters()
  } else if (moviesStore.randomMovies.length > 0) {
    // Se há filtros aplicados pelo usuário, sortear dos filmes aleatórios
    const randomIndex = Math.floor(Math.random() * moviesStore.randomMovies.length)
    moviesStore.selectedRandomMovie = moviesStore.randomMovies[randomIndex]
  }
}

const viewMovieDetails = () => {
  if (moviesStore.selectedRandomMovie) {
    router.push(`/movie/${moviesStore.selectedRandomMovie.id}`)
  }
}

// util methods moved to SelectedMovieCard

onMounted(() => {
  loadMovies()
})
</script>

<template>
  <div class="home">
    <HomeHero />

    <!-- Seção de Filtros -->
    <section id="filters" class="filters-section">
      <div class="container">
        <MovieFilters @find-random="handleFindRandom" />
      </div>
    </section>

    <!-- Seção de Resultados -->
    <section
      v-if="moviesStore.hasRandomMovies || moviesStore.selectedRandomMovie || moviesStore.isLoading"
      class="results-section"
    >
      <div class="container">
        <!-- Loading -->
        <div v-if="moviesStore.isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>
            <i class="pi pi-star-fill"></i>
            Sorteando filmes para você...
          </p>
        </div>

        <!-- Erro -->
        <div v-else-if="moviesStore.error" class="error-container">
          <p class="error-message">{{ moviesStore.error }}</p>
          <button @click="retryRandom" class="retry-button">Tentar Novamente</button>
        </div>

        <!-- Resultados -->
        <div
          v-else-if="moviesStore.hasRandomMovies || moviesStore.selectedRandomMovie"
          class="results-content"
        >
          <!-- Filme Selecionado -->
          <div v-if="moviesStore.selectedRandomMovie" class="selected-movie-section">
            <SectionHeader
              icon="pi pi-star"
              :title="
                !moviesStore.hasAppliedFilters
                  ? 'Filme Sorteado para Você!'
                  : 'Filme Sorteado para Você!'
              "
              :subtitle="
                !moviesStore.hasAppliedFilters
                  ? 'Sorteio dinâmico: ano, gênero e filme escolhidos aleatoriamente'
                  : 'Baseado nos seus filtros, este é o filme escolhido'
              "
            />

            <SelectedMovieCard
              :movie="moviesStore.selectedRandomMovie"
              @view-details="viewMovieDetails"
              @randomize="findNewRandom"
            />
          </div>

          <!-- Carrossel com outros filmes -->
          <div class="other-movies-section">
            <SectionHeader
              icon="pi pi-list"
              :title="
                dynamicSortInfo
                  ? `Outros filmes de ${dynamicSortInfo.genreName} lançados em ${dynamicSortInfo.year}`
                  : userFiltersInfo
                    ? `Outros filmes: ${userFiltersInfo}`
                    : 'Outros Filmes que se Encaixam'
              "
            />
            <MoviesCarousel :movies="otherMovies" />
          </div>
        </div>
      </div>
    </section>

    <!-- Seção de filmes populares (quando não há filtros aplicados) -->
    <section v-else class="popular-section">
      <div class="container">
        <div v-if="moviesStore.isLoading && !moviesStore.hasMovies" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Carregando filmes...</p>
        </div>

        <div v-else-if="moviesStore.error" class="error-container">
          <p class="error-message">{{ moviesStore.error }}</p>
          <button @click="retryLoad" class="retry-button">Tentar Novamente</button>
        </div>

        <div v-else-if="moviesStore.hasMovies">
          <SectionHeader
            icon="pi pi-fire"
            title="Filmes Populares"
            subtitle="Alguns filmes populares para você conhecer"
          />
          <MoviesCarousel :movies="moviesStore.popularMovies.slice(0, 10)" />
        </div>

        <div v-else class="empty-state">
          <p>Nenhum filme disponível</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero moved to HomeHero.vue */

.filters-section {
  padding: 60px 0 30px 0;
  background: var(--color-background);
}

.results-section {
  padding: 30px 0 60px 0;
  background: var(--color-background);
}

.popular-section {
  padding: 80px 0;
  background: var(--color-background);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

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

.selected-movie-section {
  margin-bottom: 60px;
}

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

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.load-more-section {
  text-align: center;
  margin-top: 40px;
}

.load-more-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-button:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
  transform: translateY(-2px);
}

.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
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

.error-container {
  text-align: center;
  padding: 80px 20px;
}

.error-message {
  color: var(--color-error);
  font-size: 1.125rem;
  margin: 0 0 20px 0;
}

.retry-button {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background: var(--color-secondary);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--color-text-muted);
  font-size: 1.125rem;
}

/* Responsividade */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }

  .selected-movie-card {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .selected-movie-poster {
    max-width: 300px;
    margin: 0 auto;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0 40px 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .cta-title {
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .selected-movie-title {
    font-size: 2rem;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  .filters-section,
  .results-section,
  .popular-section {
    padding: 40px 0;
  }

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

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  .hero-content {
    padding: 0 16px;
  }

  .hero-cta {
    padding: 20px 16px;
  }
}
</style>
