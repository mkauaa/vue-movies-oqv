import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useLazyImage(src: string, fallback = '/placeholder-movie.svg') {
  const imageRef: Ref<HTMLImageElement | null> = ref(null)
  const isLoaded = ref(false)
  const hasError = ref(false)
  const currentSrc = ref(fallback)

  let observer: IntersectionObserver | null = null

  const loadImage = () => {
    const img = new Image()

    img.onload = () => {
      currentSrc.value = src
      isLoaded.value = true
      hasError.value = false
    }

    img.onerror = () => {
      hasError.value = true
      currentSrc.value = fallback
    }

    img.src = src
  }

  onMounted(() => {
    if (imageRef.value && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage()
              observer?.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: '50px',
        },
      )

      observer.observe(imageRef.value)
    } else {
      // Fallback para navegadores sem suporte ao IntersectionObserver
      loadImage()
    }
  })

  onUnmounted(() => {
    if (observer && imageRef.value) {
      observer.unobserve(imageRef.value)
    }
  })

  return {
    imageRef,
    currentSrc,
    isLoaded,
    hasError,
  }
}
