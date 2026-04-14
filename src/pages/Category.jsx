import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTitles } from '../services/api'
import MovieCard from '../components/MovieCard'
import Loader, { SkeletonRow } from '../components/Loader'
import useLazyLoad from '../hooks/useLazyLoad'

const LABELS = {
  MOVIE: '🎬 Movies',
  TV_SERIES: '📺 TV Shows',
  VIDEO_GAME: '🎮 Video Games',
}

const Category = () => {
  const { type } = useParams() // URL se category type
  const [titles, setTitles] = useState([])
  const [nextToken, setNextToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const loadData = useCallback(async (token = null, reset = false) => {
    setLoading(true)
    let cancelled = false

    try {
      const data = await fetchTitles(token, type)
      const items = data?.titles || []

      if (!cancelled) {
        setTitles(prev => {
          if (reset) return items
          const ids = new Set(prev.map(m => m.id))
          return [...prev, ...items.filter(m => !ids.has(m.id))]
        })
        const next = data?.nextPageToken || null
        setNextToken(next)
        if (!next || items.length === 0) setHasMore(false)
        else setHasMore(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      if (!cancelled) {
        setLoading(false)
        setInitialLoading(false)
      }
    }
    return () => { cancelled = true }
  }, [type])

  // Category change hone pe reset karo
  useEffect(() => {
    setTitles([])
    setNextToken(null)
    setHasMore(true)
    setInitialLoading(true)
    loadData(null, true)
  }, [type]) // eslint-disable-line

  const handleSentinel = useCallback(() => {
    if (!loading && hasMore && nextToken) loadData(nextToken)
  }, [loading, hasMore, nextToken, loadData])

  const sentinelRef = useLazyLoad(handleSentinel)

  return (
    <div style={{
      background: '#141414', minHeight: '100vh',
      paddingTop: '80px',
    }}>
      <h1 style={{
        color: '#fff', fontSize: '26px',
        fontWeight: '800', padding: '24px 40px 20px',
        borderBottom: '1px solid #222',
      }}>
        {LABELS[type] || 'Browse'}
        <span style={{ color: '#555', fontSize: '14px', fontWeight: '400', marginLeft: '12px' }}>
          {titles.length > 0 ? `${titles.length} titles` : ''}
        </span>
      </h1>

      <div style={{ padding: '24px 40px 60px' }}>
        {initialLoading ? (
          <SkeletonRow />
        ) : (
          <>
            {/* Grid layout — 10000 movies ke liye */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px',
            }}>
              {titles.map(m => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} style={{ height: '40px', marginTop: '20px' }} />

            {loading && <Loader text={`${titles.length} loaded...`} />}

            {!hasMore && (
              <p style={{ textAlign: 'center', color: '#444', padding: '24px', fontSize: '13px' }}>
                ✓ All {titles.length} titles loaded
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Category