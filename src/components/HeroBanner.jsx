import React, { useMemo } from 'react'

const HeroBanner = ({ movie, onPlayClick }) => {
  const info = useMemo(() => ({
    title: movie?.primaryTitle || 'Featured Title',
    year: movie?.startYear || '',
    plot: movie?.plot || '',
    img: movie?.primaryImage?.url || null,
    rating: movie?.rating?.aggregateRating || null,
    genres: movie?.genres?.slice(0, 3) || [],
  }), [movie])

  if (!movie) return (
    // Skeleton loader — data aane se pehle
    <div style={{
      height: '70vh', background: '#141414',
      display: 'flex', alignItems: 'flex-end', padding: '0 40px 60px',
    }}>
      <div>
        <div style={{ width: '300px', height: '40px', background: '#2a2a2a', borderRadius: '4px', marginBottom: '12px' }} className="skeleton" />
        <div style={{ width: '200px', height: '16px', background: '#2a2a2a', borderRadius: '4px' }} className="skeleton" />
      </div>
    </div>
  )

  return (
    <div style={{
      position: 'relative',
      height: '70vh',
      minHeight: '500px',
      overflow: 'hidden',
      marginBottom: '24px',
    }}>
      {/* Background image */}
      {info.img && (
        <img
          src={info.img}
          alt={info.title}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
      )}

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.1) 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, #141414 0%, transparent 40%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        left: '40px',
        maxWidth: '480px',
      }}>
        {/* Genre tags */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {info.genres.map(g => (
            <span key={g} style={{
              background: 'rgba(229,9,20,0.3)',
              border: '1px solid rgba(229,9,20,0.5)',
              color: '#ff6b6b', fontSize: '10px',
              padding: '2px 8px', borderRadius: '2px',
              fontWeight: '600', letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              {g}
            </span>
          ))}
        </div>

        <h1 style={{
          color: '#fff',
          fontSize: 'clamp(28px, 4vw, 52px)',
          fontWeight: '900',
          lineHeight: '1.1',
          marginBottom: '8px',
          textShadow: '2px 2px 20px rgba(0,0,0,0.8)',
        }}>
          {info.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          {info.rating && (
            <span style={{ color: '#f5c518', fontWeight: '700', fontSize: '14px' }}>
              ★ {info.rating}/10
            </span>
          )}
          {info.year && (
            <span style={{ color: '#aaa', fontSize: '13px' }}>{info.year}</span>
          )}
        </div>

        {info.plot && (
          <p style={{
            color: '#ccc', fontSize: '13px',
            lineHeight: '1.6', marginBottom: '20px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {info.plot}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => onPlayClick?.(movie)}
            style={{
              background: '#fff', color: '#000',
              border: 'none', padding: '10px 24px',
              borderRadius: '4px', fontWeight: '700',
              fontSize: '15px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.target.style.background = '#ddd'}
            onMouseLeave={e => e.target.style.background = '#fff'}
          >
            ▶ Play
          </button>
          <button style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#fff', border: 'none',
            padding: '10px 24px', borderRadius: '4px',
            fontWeight: '700', fontSize: '15px',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
          }}>
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(HeroBanner)