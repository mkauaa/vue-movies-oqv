import { defineStore } from 'pinia'
import {
  tmdbApi,
  type Movie,
  type MovieDetails,
  type SimilarMovie,
  type MovieFilters,
} from '@/services/tmdbApi'

export const useMoviesStore = defineStore('movies', {
  state: () => ({
    // Filmes populares e em cartaz
    popularMovies: [] as Movie[],
    nowPlayingMovies: [] as Movie[],

    // Busca
    searchResults: [] as Movie[],
    searchQuery: '',
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,

    randomMovies: [] as Movie[],
    selectedRandomMovie: null as Movie | null,
    appliedFilters: null as MovieFilters | null,

    // Gêneros
    genres: [] as { id: number; name: string }[],

    // Filme atual
    currentMovie: null as MovieDetails | null,

    // Filmes similares
    similarMovies: [] as SimilarMovie[],
    selectedMovie: null as Movie | null,

    // Estados de loading e erro
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    hasMovies: (state) => state.popularMovies.length > 0 || state.nowPlayingMovies.length > 0,
    hasSearchResults: (state) => state.searchResults.length > 0,
    hasSimilarMovies: (state) => state.similarMovies.length > 0,
    hasRandomMovies: (state) => state.randomMovies.length > 0,

    topSimilarMovies: (state) =>
      state.similarMovies.filter((movie) => (movie.similarity_score || 0) > 0),

    moviesWithSharedCrew: (state) =>
      state.similarMovies.filter(
        (movie) =>
          (movie.shared_cast && movie.shared_cast.length > 0) ||
          (movie.shared_crew && movie.shared_crew.length > 0),
      ),

    hasAppliedFilters: (state) => {
      if (!state.appliedFilters) return false

      // Se é sorteio dinâmico, considerar como "sem filtros do usuário"
      if (state.appliedFilters.isDynamicRandom) return false

      const filters = state.appliedFilters
      return (
        filters.yearFrom ||
        filters.yearTo ||
        filters.genres.length > 0 ||
        filters.minDuration !== null ||
        filters.maxDuration !== null ||
        (filters.minRating !== null && filters.minRating !== undefined)
      )
    },
  },

  actions: {
    // Buscar filmes populares
    async fetchPopularMovies() {
      this.isLoading = true
      this.error = null

      try {
        const response = await tmdbApi.getPopularMovies()
        this.popularMovies = response.results
      } catch (error) {
        this.error = 'Erro ao carregar filmes populares'
        console.error('Erro ao carregar filmes populares:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Buscar filmes em cartaz
    async fetchNowPlayingMovies() {
      this.isLoading = true
      this.error = null

      try {
        const response = await tmdbApi.getNowPlayingMovies()
        this.nowPlayingMovies = response.results
      } catch (error) {
        this.error = 'Erro ao carregar filmes em cartaz'
        console.error('Erro ao carregar filmes em cartaz:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Buscar filmes
    async searchMovies(query: string, page: number = 1) {
      this.isLoading = true
      this.error = null
      this.searchQuery = query

      try {
        const response = await tmdbApi.searchMovies(query, page)
        this.searchResults = response.results
        this.currentPage = response.page
        this.totalPages = response.total_pages
        this.totalResults = response.total_results
      } catch (error) {
        this.error = 'Erro ao buscar filmes'
        console.error('Erro ao buscar filmes:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Buscar detalhes de um filme
    async fetchMovieDetails(movieId: number) {
      this.isLoading = true
      this.error = null

      try {
        const movieDetails = await tmdbApi.getMovieDetails(movieId)
        this.currentMovie = movieDetails
      } catch (error) {
        this.error = 'Erro ao carregar detalhes do filme'
        console.error('Erro ao carregar detalhes do filme:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Buscar gêneros
    async fetchGenres() {
      try {
        this.genres = await tmdbApi.getGenres()
      } catch (error) {
        console.error('Erro ao carregar gêneros:', error)
      }
    },

    async fetchRandomMovies(filters: MovieFilters) {
      this.isLoading = true
      this.error = null
      this.appliedFilters = { ...filters }

      try {
        const movies = await tmdbApi.getRandomMovies(filters, 21, 1, 3)
        this.randomMovies = movies

        if (movies.length > 0) {
          const randomIndex = Math.floor(Math.random() * movies.length)
          this.selectedRandomMovie = movies[randomIndex]
        }
        this.currentPage = 3
      } catch (error) {
        this.error = 'Erro ao buscar filmes aleatórios'
        console.error('Erro ao buscar filmes aleatórios:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchMoreRandomMovies() {
      if (!this.appliedFilters) return

      this.isLoading = true
      this.error = null

      try {
        const nextStartPage = this.currentPage + 1
        const additionalMovies = await tmdbApi.getRandomMovies(
          this.appliedFilters,
          10,
          nextStartPage,
          2,
        )
        this.randomMovies = [...this.randomMovies, ...additionalMovies]
        this.currentPage = nextStartPage + 1
      } catch (error) {
        this.error = 'Erro ao buscar mais filmes'
        console.error('Erro ao buscar mais filmes:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchSimpleSimilarMovies(movieId: number, page: number = 1) {
      this.isLoading = true
      this.error = null

      try {
        const response = await tmdbApi.getSimilarMovies(movieId, page)
        this.similarMovies = response.results.map((movie) => ({
          ...movie,
          similarity_score: 0,
          shared_cast: [],
          shared_crew: [],
        }))
        this.totalPages = response.total_pages
        this.totalResults = response.total_results
        this.currentPage = page
      } catch (error) {
        this.error = 'Erro ao buscar filmes similares'
        console.error('Erro ao buscar filmes similares:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Limpar resultados de busca
    clearSearch() {
      this.searchResults = []
      this.searchQuery = ''
      this.currentPage = 1
      this.totalPages = 0
      this.totalResults = 0
      this.error = null
    },

    clearRandomMovies() {
      this.randomMovies = []
      this.selectedRandomMovie = null
      this.appliedFilters = null
      this.error = null
    },

    // Limpar filmes similares
    clearSimilarMovies() {
      this.similarMovies = []
      this.selectedMovie = null
      this.currentPage = 1
      this.totalPages = 0
      this.totalResults = 0
      this.error = null
    },

    // Limpar erro
    clearError() {
      this.error = null
    },
  },
})
