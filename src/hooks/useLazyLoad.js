import { useEffect, useRef, useCallback } from 'react'

/**
 * IntersectionObserver — element screen pe aaye toh callback call hoti hai
 * Infinite scroll ke liye use hota hai
 */
const useLazyLoad = (onVisible, options = {}) => {
  const ref = useRef(null)

  const stableCallback = useCallback(onVisible, [onVisible])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          stableCallback()
        }
      },
      { threshold: 0.1, ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [stableCallback])

  return ref
}

export default useLazyLoad