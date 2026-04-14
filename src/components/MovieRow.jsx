import React, { useMemo } from 'react'
import MovieCard from './MovieCard'

const MovieRow = ({ title, movies, onCardClick }) => {
  // useMemo — movies array change nahi hua toh filter dobara nahi chalega
  const validMovies = useMemo(
    () => movies?.filter(m => m?.id) || [],
    [movies]
  )

  if (validMovies.length === 0) return null

  return (
    <div style={{ marginBottom: '36px' }}>
      <h2 style={{
        color: '#e5e5e5',
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '12px',
        paddingLeft: '40px',
        letterSpacing: '0.5px',
      }}>
        {title}
      </h2>

      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingBottom: '16px',
        paddingTop: '8px', // hover ke liye space
        // Scrollbar hide
        scrollbarWidth: 'thin',
        scrollbarColor: '#E50914 transparent',
        WebkitOverflowScrolling: 'touch', // iOS smooth scroll
      }}>
        {validMovies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onCardClick}
          />
        ))}
      </div>
    </div>
  )
}

export default React.memo(MovieRow)