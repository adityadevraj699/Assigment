import { useState, useEffect } from 'react'

/**
 * Value change hone ke baad delay lagata hai
 * Search bar ke liye — har keypress pe API nahi call hoti
 */
const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer) // Cleanup: next keypress pe cancel
  }, [value, delay])

  return debounced
}

export default useDebounce