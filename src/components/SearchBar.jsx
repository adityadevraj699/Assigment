import React, { useState, useEffect, useRef } from 'react'
import { searchTitles } from '../services/api'
import useDebounce from '../hooks/useDebounce'

const SearchBar = ({ onResultClick }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  const debouncedQuery = useDebounce(query, 500) // 500ms debounce

  // Search effect — debounced query change hone pe chalega
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    let cancelled = false // Memory leak prevent
    setLoading(true)

    searchTitles(debouncedQuery)
      .then(data => {
        if (!cancelled) {
          setResults(data?.titles?.slice(0, 8) || [])
        }
      })
      .catch(() => {
        if (!cancelled) setResults([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [debouncedQuery])

  // Click outside pe dropdown close karo
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'rgba(0,0,0,0.7)',
        border: `1px solid ${open ? '#E50914' : '#555'}`,
        borderRadius: '4px',
        padding: '0 12px',
        transition: 'border-color 0.2s',
      }}>
        <span style={{ color: '#888', marginRight: '8px', fontSize: '14px' }}>🔍</span>
        <input
          type="text"
          value={query}
          placeholder="Search titles, year, ID..."
          onFocus={() => setOpen(true)}
          onChange={e => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          style={{
            background: 'transparent',
            border: 'none', outline: 'none',
            color: '#fff', fontSize: '13px',
            padding: '9px 0', width: '220px',
          }}
        />
        {loading && (
          <div style={{
            width: '14px', height: '14px',
            border: '2px solid #333',
            borderTop: '2px solid #E50914',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }} />
        )}
        {query && (
          <span
            onClick={() => { setQuery(''); setResults([]) }}
            style={{ color: '#888', cursor: 'pointer', fontSize: '14px', marginLeft: '6px' }}
          >
            ✕
          </span>
        )}
      </div>

      {/* Dropdown results */}
      {open && (results.length > 0 || (loading && query)) && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '6px',
          width: '320px',
          maxHeight: '420px',
          overflowY: 'auto',
          zIndex: 9999,
          boxShadow: '0 16px 48px rgba(0,0,0,0.9)',
          scrollbarWidth: 'thin',
        }}>
          {results.map(item => (
            <div
              key={item.id}
              onClick={() => {
                onResultClick?.(item)
                setOpen(false)
                setQuery(item.primaryTitle || '')
              }}
              style={{
                display: 'flex', gap: '12px',
                padding: '10px 14px',
                borderBottom: '1px solid #222',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Thumbnail */}
              <div style={{
                width: '36px', height: '52px',
                borderRadius: '3px', overflow: 'hidden',
                background: '#333', flexShrink: 0,
              }}>
                {item.primaryImage?.url ? (
                  <img
                    src={item.primaryImage.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#555', fontSize: '16px'
                  }}>🎬</div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: '#fff', fontSize: '13px',
                  fontWeight: '600', marginBottom: '4px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.primaryTitle}
                </div>
                <div style={{ color: '#888', fontSize: '11px', display: 'flex', gap: '6px' }}>
                  <span>{item.startYear || '—'}</span>
                  <span>•</span>
                  <span style={{ textTransform: 'capitalize' }}>{item.type}</span>
                  {item.rating?.aggregateRating && (
                    <>
                      <span>•</span>
                      <span style={{ color: '#f5c518' }}>★ {item.rating.aggregateRating}</span>
                    </>
                  )}
                </div>
                {item.genres?.length > 0 && (
                  <div style={{ color: '#666', fontSize: '10px', marginTop: '3px' }}>
                    {item.genres.slice(0, 3).join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default SearchBar