<template>
  <div class="movie-filters">
    <div class="filters-header">
      <h2 class="filters-title">
        <i class="pi pi-sliders-h"></i>
        Configure seus filtros
      </h2>
      <p class="filters-subtitle">Selecione os critérios para encontrar o filme perfeito</p>
    </div>

    <div class="filters-two-col">
      <div class="filters-left">
        <!-- Ano de lançamento -->
        <div class="filter-group">
          <label class="filter-label">
            <i class="pi pi-calendar"></i>
            Ano de Lançamento
          </label>
          <div class="year-range">
            <div class="year-input">
              <label>De:</label>
              <select v-model="filters.yearFrom" class="filter-select">
                <option value="">Qualquer ano</option>
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div class="year-input">
              <label>Até:</label>
              <select v-model="filters.yearTo" class="filter-select">
                <option value="">Qualquer ano</option>
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Duração -->
        <div class="filter-group">
          <label class="filter-label">
            <i class="pi pi-clock"></i>
            Duração (minutos)
          </label>
          <div class="duration-range">
            <div class="duration-input">
              <label>Mínimo:</label>
              <input
                v-model.number="filters.minDuration"
                type="number"
                min="0"
                max="300"
                placeholder="0"
                class="filter-input"
              />
            </div>
            <div class="duration-input">
              <label>Máximo:</label>
              <input
                v-model.number="filters.maxDuration"
                type="number"
                min="0"
                max="300"
                placeholder="300"
                class="filter-input"
              />
            </div>
          </div>
        </div>

        <!-- Avaliação mínima -->
        <div class="filter-group">
          <label class="filter-label">
            <i class="pi pi-star"></i>
            Avaliação mínima
          </label>
          <div class="duration-range">
            <div class="duration-input">
              <label>Nota mínima (0 - 10):</label>
              <input
                v-model.number="filters.minRating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="0"
                class="filter-input"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Gêneros -->
      <div class="filters-right">
        <div class="filter-group">
          <label class="filter-label">
            <i class="pi pi-tag"></i>
            Gêneros
          </label>
          <div class="genres-grid">
            <button
              v-for="genre in availableGenres"
              :key="genre.id"
              @click="toggleGenre(genre.id)"
              :class="['genre-button', { 'genre-selected': filters.genres.includes(genre.id) }]"
              type="button"
            >
              {{ genre.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Botões de ação -->
    <div class="filters-actions">
      <button @click="clearFilters" class="clear-button">
        <i class="pi pi-trash"></i>
        Limpar Filtros
      </button>
      <button @click="findRandomMovie" class="btn btn-primary" :disabled="isLoading">
        <i class="pi pi-star-fill"></i>
        {{ isLoading ? 'Buscando...' : 'Sortear Filme' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { tmdbApi } from '@/services/tmdbApi'

interface Filters {
  yearFrom: string
  yearTo: string
  genres: number[]
  minDuration: number | null
  maxDuration: number | null
  minRating: number | null
}

interface Genre {
  id: number
  name: string
}

//

const emit = defineEmits<{
  findRandom: [filters: Filters]
}>()

const isLoading = ref(false)
const availableGenres = ref<Genre[]>([])
//

const filters = reactive<Filters>({
  yearFrom: '',
  yearTo: '',
  genres: [],
  minDuration: null,
  maxDuration: null,
  minRating: null,
})

// Gerar anos de 1900 até o ano atual
const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const yearsArray = []
  for (let year = currentYear; year >= 1900; year--) {
    yearsArray.push(year)
  }
  return yearsArray
})

// Carregar gêneros disponíveis
const loadGenres = async () => {
  try {
    const genres = await tmdbApi.getGenres()
    availableGenres.value = genres
  } catch (error) {
    console.error('Erro ao carregar gêneros:', error)
  }
}

//

// Limpar filtros
const clearFilters = () => {
  Object.assign(filters, {
    yearFrom: '',
    yearTo: '',
    genres: [],
    minDuration: null,
    maxDuration: null,
    minRating: null,
  })
}

// Toggle gênero selecionado
const toggleGenre = (genreId: number) => {
  const index = filters.genres.indexOf(genreId)
  if (index > -1) {
    // Remove se já estiver selecionado
    filters.genres.splice(index, 1)
  } else {
    // Adiciona se não estiver selecionado
    filters.genres.push(genreId)
  }
}

// Encontrar filme aleatório
const findRandomMovie = () => {
  isLoading.value = true
  emit('findRandom', { ...filters })
  setTimeout(() => {
    isLoading.value = false
  }, 100)
}

onMounted(() => {
  loadGenres()
})
</script>

<style scoped>
.movie-filters {
  background: var(--color-surface);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 32px;
}

.filters-header {
  text-align: center;
  margin-bottom: 32px;
}

.filters-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.filters-title i {
  color: var(--color-primary);
  font-size: 1.75rem;
}

.filters-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  margin: 0;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* Two-column layout for filters */
.filters-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.filters-left,
.filters-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-label {
  font-weight: 600;
  color: var(--color-text);
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label i {
  color: var(--color-primary);
  font-size: 1rem;
}

.year-range,
.duration-range {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.year-input,
.duration-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.year-input label,
.duration-input label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.filter-select,
.filter-input {
  padding: 12px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background: var(--color-background);
  color: var(--color-text);
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.genres-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
}

.genre-button {
  padding: 12px 16px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  white-space: nowrap;
}

.genre-button:hover {
  border-color: var(--color-primary);
  background: var(--color-surface-hover);
}

.genre-button.genre-selected {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  font-weight: 600;
}

.genre-button.genre-selected:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.search-input-wrapper {
  position: relative;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.suggestion-item:hover {
  background: var(--color-surface-hover);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.filters-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.clear-button,
.random-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-button {
  background: var(--color-surface);
  color: var(--color-text-muted);
  border: 2px solid var(--color-border);
}

.clear-button:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.random-button {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);
}

.random-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(225, 29, 72, 0.6);
}

.random-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsividade */
@media (max-width: 768px) {
  .movie-filters {
    padding: 24px 20px;
  }

  .filters-title {
    font-size: 1.75rem;
  }

  .filters-two-col {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .year-range,
  .duration-range {
    grid-template-columns: 1fr;
  }

  .genres-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .filters-actions {
    flex-direction: column;
  }

  .clear-button,
  .random-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
