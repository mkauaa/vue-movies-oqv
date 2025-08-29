<template>
  <div class="search-view">
    <!-- Seção única com fundo hero -->
    <section class="search-section">
      <div class="search-overlay"></div>

      <!-- Campo de busca centralizado -->
      <div class="search-content">
        <div class="search-header">
          <img src="@/assets/cine-combo.png" alt="Cine Combo" class="cine-combo-logo" />
          <h1 class="search-title">Encontre seu filme:</h1>
        </div>

        <div class="search-bar-container">
          <SearchBar class="search-bar" />
        </div>

        <!-- Resultados integrados -->
        <div v-if="searchQuery" class="search-results-container">
          <!-- Loading -->
          <div
            v-if="moviesStore.isLoading && !moviesStore.hasSearchResults"
            class="loading-container"
          >
            <div class="loading-spinner"></div>
            <p>Buscando filmes...</p>
          </div>

          <!-- Erro -->
          <div v-else-if="moviesStore.error" class="error-container">
            <p class="error-message">{{ moviesStore.error }}</p>
            <button @click="retrySearch" class="retry-button">
              <i class="pi pi-refresh"></i>
              Tentar Novamente
            </button>
          </div>

          <!-- Resultados -->
          <div v-else-if="moviesStore.hasSearchResults" class="search-results">
            <div class="results-header">
              <h2 class="results-title">
                <i class="pi pi-list"></i>
                Resultados da Busca
              </h2>
              <p class="results-subtitle">
                Página {{ moviesStore.currentPage }} de {{ moviesStore.totalPages }}
              </p>
            </div>

            <div class="movies-grid">
              <MovieCard
                v-for="movie in moviesStore.searchResults"
                :key="movie.id"
                :movie="movie"
              />
            </div>

            <!-- Paginação -->
            <div v-if="moviesStore.totalPages > 1" class="pagination">
              <button
                @click="goToPage(moviesStore.currentPage - 1)"
                :disabled="moviesStore.currentPage <= 1"
                class="pagination-button"
                :class="{ disabled: moviesStore.currentPage <= 1 }"
              >
                <i class="pi pi-chevron-left"></i>
                Anterior
              </button>

              <div class="page-numbers">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="['page-button', { active: page === moviesStore.currentPage }]"
                >
                  {{ page }}
                </button>
              </div>

              <button
                @click="goToPage(moviesStore.currentPage + 1)"
                :disabled="moviesStore.currentPage >= moviesStore.totalPages"
                class="pagination-button"
                :class="{ disabled: moviesStore.currentPage >= moviesStore.totalPages }"
              >
                Próxima
                <i class="pi pi-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Nenhum resultado -->
          <div v-else class="no-results">
            <div class="no-results-icon">
              <i class="pi pi-search"></i>
            </div>
            <h2>Nenhum resultado</h2>
            <p>Tente ajustar sua busca ou usar termos diferentes</p>
            <div class="search-tips">
              <h3>
                <i class="pi pi-lightbulb"></i>
                Dicas para melhorar sua busca:
              </h3>
              <ul>
                <li>Verifique a ortografia das palavras</li>
                <li>Tente usar sinônimos</li>
                <li>Use nomes de atores ou diretores</li>
                <li>Especifique o ano do filme</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMoviesStore } from '@/stores/movies'
import SearchBar from '@/components/SearchBar.vue'
import MovieCard from '@/components/MovieCard.vue'

const route = useRoute()
const router = useRouter()
const moviesStore = useMoviesStore()

const searchQuery = computed(() => route.query.q as string)

// Lógica de paginação
const visiblePages = computed(() => {
  const current = moviesStore.currentPage
  const total = moviesStore.totalPages
  const delta = 2

  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else if (total > 1) {
    rangeWithDots.push(total)
  }

  return rangeWithDots.filter((page): page is number => typeof page === 'number')
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= moviesStore.totalPages && page !== moviesStore.currentPage) {
    router.push({
      path: '/search',
      query: {
        q: searchQuery.value,
        page: page.toString(),
      },
    })
  }
}

const retrySearch = () => {
  moviesStore.clearError()
  if (searchQuery.value) {
    moviesStore.searchMovies(searchQuery.value)
  }
}

const performSearch = async () => {
  if (searchQuery.value) {
    const page = Number(route.query.page) || 1
    await moviesStore.searchMovies(searchQuery.value, page)
  }
}

onMounted(() => {
  if (searchQuery.value) {
    performSearch()
  }
})

watch(searchQuery, (newQuery) => {
  if (newQuery) {
    moviesStore.clearSearch()
    performSearch()
  }
})

watch(
  () => route.query.page,
  () => {
    if (searchQuery.value) {
      performSearch()
    }
  },
)
</script>

<style scoped>
.search-view {
  min-height: 100vh;
}

.search-section {
  /* Mesmo fundo da hero section */
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-background) 100%);
  background-image: url('@/assets/cinema-fundo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: var(--color-text);
  min-height: 100vh;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.search-overlay {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
}

.search-content {
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;
  padding-top: 10vh;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
}

.search-header {
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.cine-combo-logo {
  height: 240px;
  width: auto;
  object-fit: contain;
}

.search-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.search-bar-container {
  width: 100%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(15px);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.search-bar {
  width: 100%;
}

.search-results-container {
  width: 100%;
  max-width: 1000px;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
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

.error-message {
  color: #ff6b6b;
  font-size: 1.125rem;
  margin: 0 0 20px 0;
}

.retry-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(225, 29, 72, 0.6);
}

.search-results {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.results-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.results-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.results-title i {
  color: var(--color-primary);
  font-size: 1.75rem;
}

.results-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.pagination-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);
}

.pagination-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(225, 29, 72, 0.6);
}

.pagination-button.disabled {
  background: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-button {
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 44px;
  backdrop-filter: blur(10px);
}

.page-button:hover {
  border-color: var(--color-primary);
  background: rgba(251, 191, 36, 0.3);
}

.page-button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.no-results-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-results-icon i {
  font-size: 80px;
}

.no-results h2 {
  font-size: 1.75rem;
  color: white;
  margin: 0 0 16px 0;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.no-results p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 30px 0;
  font-size: 1.125rem;
}

.search-tips {
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid var(--color-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.search-tips h3 {
  font-size: 1.25rem;
  color: white;
  margin: 0 0 16px 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-tips h3 i {
  color: var(--color-warning);
}

.search-tips ul {
  margin: 0;
  padding-left: 20px;
  color: rgba(255, 255, 255, 0.9);
}

.search-tips li {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* Responsividade */
@media (max-width: 1024px) {
  .search-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .search-content {
    gap: 25px;
    padding-top: 8vh;
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: 16px;
  }

  .search-title {
    font-size: 2.5rem;
  }

  .cine-combo-logo {
    height: 200px;
  }

  .search-bar-container {
    padding: 20px;
  }

  .search-subtitle {
    font-size: 1.125rem;
  }

  .search-bar-container {
    padding: 20px;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .pagination {
    flex-direction: column;
    gap: 16px;
  }

  .search-results {
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .search-content {
    gap: 20px;
    padding-top: 5vh;
  }

  .search-title {
    font-size: 2rem;
  }

  .cine-combo-logo {
    height: 160px;
  }

  .search-bar-container {
    padding: 16px;
  }

  .movies-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .results-title {
    font-size: 1.5rem;
  }
}
</style>
