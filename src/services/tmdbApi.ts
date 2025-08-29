import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

if (!API_KEY) {
  console.error('TMDB API Key não configurada!')
  console.log('Configure sua API Key no arquivo .env')
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})
export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  adult: boolean
  video: boolean
  original_language: string
  original_title: string
}

export interface MovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface MovieDetails extends Movie {
  runtime: number
  genres: { id: number; name: string }[]
  production_companies: { id: number; name: string; logo_path: string | null }[]
  spoken_languages: { english_name: string; iso_639_1: string }[]
  status: string
  tagline: string
  budget: number
  revenue: number
  homepage: string
  imdb_id: string
}

export interface Genre {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface MovieCredits {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

export interface SimilarMovie extends Movie {
  similarity_score?: number
  shared_crew?: CrewMember[]
  shared_cast?: CastMember[]
}

export interface Person {
  id: number
  name: string
  profile_path: string | null
  known_for_department: string
  popularity: number
}

export interface PersonResponse {
  page: number
  results: Person[]
  total_pages: number
  total_results: number
}

export interface MovieFilters {
  yearFrom: string
  yearTo: string
  genres: number[]
  minDuration: number | null
  maxDuration: number | null
  minRating?: number | null
  isDynamicRandom?: boolean
}

export const tmdbApi = {
  getImageUrl: (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder-movie.svg'
    return `${IMAGE_BASE_URL}/${size}${path}`
  },

  getPopularMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api
      .get('/movie/popular', { params: { page, language: 'pt-BR' } })
      .then((res) => res.data)
    return response
  },

  getNowPlayingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await api
      .get('/movie/now_playing', { params: { page, language: 'pt-BR' } })
      .then((res) => res.data)
    return response
  },

  getMoviesByGenre: async (genreId: number, page: number = 1): Promise<MovieResponse> => {
    const response = await api
      .get('/discover/movie', {
        params: {
          with_genres: genreId,
          page,
          sort_by: 'popularity.desc',
          language: 'pt-BR',
        },
      })
      .then((res) => res.data)
    return response
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const movieDetails = await api
      .get(`/movie/${movieId}`, { params: { language: 'pt-BR' } })
      .then((res) => res.data)
    return movieDetails
  },

  searchMovies: async (query: string, page: number = 1): Promise<MovieResponse> => {
    const response = await api
      .get('/search/movie', { params: { query, page, language: 'pt-BR' } })
      .then((res) => res.data)
    return response
  },

  getGenres: async (): Promise<Genre[]> => {
    const genres = await api
      .get('/genre/movie/list', { params: { language: 'pt-BR' } })
      .then((res) => res.data.genres)
    return genres
  },

  discoverMovies: (filters: MovieFilters, page: number = 1): Promise<MovieResponse> => {
    const params: Record<string, string | number | boolean> = {
      page,
      sort_by: 'popularity.desc',
      include_adult: false,
      include_video: false,
      language: 'pt-BR',
    }

    if (filters.yearFrom && filters.yearTo) {
      params['primary_release_date.gte'] = `${filters.yearFrom}-01-01`
      params['primary_release_date.lte'] = `${filters.yearTo}-12-31`
    } else if (filters.yearFrom) {
      params['primary_release_date.gte'] = `${filters.yearFrom}-01-01`
    } else if (filters.yearTo) {
      params['primary_release_date.lte'] = `${filters.yearTo}-12-31`
    }

    if (filters.genres.length > 0) {
      params.with_genres = filters.genres.join(',')
    }

    if (filters.minDuration !== null) {
      params['with_runtime.gte'] = filters.minDuration
    }
    if (filters.maxDuration !== null) {
      params['with_runtime.lte'] = filters.maxDuration
    }

    if (filters.minRating !== undefined && filters.minRating !== null) {
      params['vote_average.gte'] = filters.minRating
      params['vote_count.gte'] = 50
    }

    return api.get('/discover/movie', { params }).then((res) => res.data)
  },

  getRandomMovies: async (
    filters: MovieFilters,
    count: number = 20,
    startPage: number = 1,
    pagesToScan: number = 3,
  ): Promise<Movie[]> => {
    try {
      const collected: Movie[] = []
      let page = startPage
      for (let i = 0; i < pagesToScan; i++) {
        const response = await tmdbApi.discoverMovies(filters, page)
        collected.push(...response.results)
        if (page >= (response.total_pages || page)) break
        page += 1
      }
      if (collected.length === 0) return []
      const byPopularity = collected.sort(
        (a: Movie, b: Movie) => (b.popularity || 0) - (a.popularity || 0),
      )
      const shuffled = byPopularity.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    } catch (error) {
      console.error('Erro ao buscar filmes aleatórios:', error)
      throw error
    }
  },

  getSimilarMovies: (movieId: number, page: number = 1): Promise<MovieResponse> => {
    return api.get(`/movie/${movieId}/similar`, { params: { page } }).then((res) => res.data)
  },

  getMovieCredits: (movieId: number): Promise<MovieCredits> => {
    return api.get(`/movie/${movieId}/credits`).then((res) => res.data)
  },
}

export default tmdbApi
