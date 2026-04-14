import React, { memo, useState, useMemo } from 'react'

/**
 * React.memo — agar props same hain toh re-render nahi hoga
 * 10,000 cards ke saath yeh bahut zaroori hai
 */
const MovieCard = memo(({ movie, onClick }) => {
  const [hovered, setHovered] = useState(false)

  // useMemo — har render pe recalculate nahi hoga
  const info = useMemo(() => ({
    title: movie?.primaryTitle || 'Unknown',
    year: movie?.startYear || '',
    type: movie?.type || '',
    img: movie?.primaryImage?.url || null,
    rating: movie?.rating?.aggregateRating || null,
  }), [movie])

  return (
    <div
      onClick={() => onClick?.(movie)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: '160px',
        maxWidth: '160px',
        height: '240px',
        borderRadius: '6px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        transform: hovered ? 'scale(1.1) translateY(-8px)' : 'scale(1)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, z-index 0s',
        boxShadow: hovered
          ? '0 20px 50px rgba(0,0,0,0.9)'
          : '0 2px 8px rgba(0,0,0,0.5)',
        background: '#1c1c1c',
        zIndex: hovered ? 10 : 1,
      }}
    >
      {/* Poster */}
      {info.img ? (
        <img
          src={info.img}
          alt={info.title}
          loading="lazy" // Browser native lazy load
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        // Fallback — image nahi hai toh placeholder
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '12px', textAlign: 'center',
        }}>
          <span style={{ fontSize: '32px', marginBottom: '8px' }}>🎬</span>
          <span style={{ color: '#aaa', fontSize: '11px', lineHeight: '1.4' }}>
            {info.title}
          </span>
        </div>
      )}

      {/* Rating badge — top right */}
      {info.rating && (
        <div style={{
          position: 'absolute', top: '6px', right: '6px',
          background: 'rgba(0,0,0,0.8)',
          color: '#f5c518', // IMDb yellow
          fontSize: '10px', fontWeight: '700',
          padding: '2px 6px', borderRadius: '3px',
        }}>
          ★ {info.rating}
        </div>
      )}

      {/* Hover overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
        padding: '28px 8px 10px',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}>
        <div style={{
          color: '#fff', fontSize: '11px',
          fontWeight: '700', marginBottom: '3px',
          overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {info.title}
        </div>
        <div style={{ color: '#999', fontSize: '10px' }}>
          {info.year} • {info.type}
        </div>
      </div>
    </div>
  )
})

MovieCard.displayName = 'MovieCard'
export default MovieCard