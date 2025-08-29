<template>
  <div class="search-container">
    <div class="search-bar">
      <div class="search-input-wrapper">
        <i class="pi pi-search search-icon"></i>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          @keydown="handleKeydown"
          type="text"
          placeholder="Digite o nome do filme..."
          class="search-input"
          aria-label="Campo de busca de filmes"
          aria-describedby="search-help"
          role="searchbox"
          aria-autocomplete="list"
          :aria-expanded="showSuggestions"
          aria-owns="search-suggestions"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-button"
          type="button"
          title="Limpar busca"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="clear-icon">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Sugestões de busca -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="search-suggestions"
      id="search-suggestions"
      role="listbox"
      aria-label="Sugestões de filmes"
    >
      <div
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.id"
        @click="selectSuggestion(suggestion)"
        :class="['suggestion-item', { 'suggestion-selected': index === selectedIndex }]"
        role="option"
        :aria-selected="index === selectedIndex"
        :id="`suggestion-${index}`"
        tabindex="-1"
      >
        <img
          :src="getPosterUrl(suggestion.poster_path)"
          :alt="suggestion.title"
          class="suggestion-poster"
        />
        <div class="suggestion-info">
          <h4 class="suggestion-title">{{ suggestion.title }}</h4>
          <p class="suggestion-year">{{ getYear(suggestion.release_date) }}</p>
        </div>
      </div>
    </div>

    <!-- Texto de ajuda para acessibilidade -->
    <div id="search-help" class="sr-only">
      Use as setas para navegar pelas sugestões e Enter para selecionar
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Movie } from '@/services/tmdbApi'
import { tmdbApi } from '@/services/tmdbApi'

const router = useRouter()

const searchQuery = ref('')
const suggestions = ref<Movie[]>([])
const showSuggestions = ref(false)
const selectedIndex = ref(-1)

// Debounce para evitar muitas requisições
let searchTimeout: ReturnType<typeof setTimeout>

const handleSearch = () => {
  clearTimeout(searchTimeout)

  if (searchQuery.value.trim().length < 2) {
    suggestions.value = []
    showSuggestions.value = false
    selectedIndex.value = -1
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const response = await tmdbApi.searchMovies(searchQuery.value, 1)
      suggestions.value = response.results.slice(0, 5) // Limita a 5 sugestões
      selectedIndex.value = -1 // Reset selection
      showSuggestions.value = true
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error)
      suggestions.value = []
    }
  }, 300)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showSuggestions.value || suggestions.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
        selectSuggestion(suggestions.value[selectedIndex.value])
      }
      break
    case 'Escape':
      showSuggestions.value = false
      selectedIndex.value = -1
      break
  }
}

const selectSuggestion = (movie: Movie) => {
  searchQuery.value = movie.title
  showSuggestions.value = false
  selectedIndex.value = -1
  router.push(`/movie/${movie.id}`)
}

const clearSearch = () => {
  searchQuery.value = ''
  suggestions.value = []
  showSuggestions.value = false
  selectedIndex.value = -1
}

const getPosterUrl = (posterPath: string | null) => {
  return tmdbApi.getImageUrl(posterPath, 'w92')
}

const getYear = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).getFullYear()
}

// Fechar sugestões ao clicar fora
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.search-container')) {
    showSuggestions.value = false
  }
}

// Adicionar listener para cliques fora
watch(showSuggestions, (show) => {
  if (show) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
}

.search-bar {
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  border: none;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.clear-button {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.clear-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.clear-icon {
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.7);
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  margin-top: 8px;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.suggestion-selected {
  background-color: rgba(255, 255, 255, 0.1);
}

.suggestion-poster {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.suggestion-info {
  flex: 1;
}

.suggestion-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.suggestion-year {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .search-input {
    padding: 14px 16px 14px 44px;
    font-size: 14px;
  }

  .search-icon {
    font-size: 16px;
    left: 14px;
  }
}

/* Acessibilidade */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
