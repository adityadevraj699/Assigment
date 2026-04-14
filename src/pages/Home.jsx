import React, {
  useState, useEffect, useCallback, useMemo, useRef
} from 'react'
import { fetchTitles } from '../services/api'
import HeroBanner from '../components/HeroBanner'
import MovieRow from '../components/MovieRow'
import Loader, { SkeletonRow } from '../components/Loader'
import useLazyLoad from '../hooks/useLazyLoad'

const Home = () => {
  const [allTitles, setAllTitles] = useState([])
  const [nextToken, setNextToken] = useState(null)    // API pagination token
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const loadingRef = useRef(false) // Ref se loading check karo (state se nahi — stale closure issue avoid)

  // Data fetch function
  const loadMore = useCallback(async (token = null) => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)

    let cancelled = false

    try {
      const data = await fetchTitles(token, null)
      const items = data?.titles || []

      if (!cancelled) {
        setAllTitles(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const fresh = items.filter(m => !existingIds.has(m.id))
          return [...prev, ...fresh]
        })

        const nextPageToken = data?.nextPageToken || null
        setNextToken(nextPageToken)
        if (!nextPageToken || items.length === 0) setHasMore(false)
      }
    } catch (err) {
      console.error('Load error:', err)
    } finally {
      if (!cancelled) {
        setLoading(false)
        setInitialLoading(false)
      }
      loadingRef.current = false
    }

    return () => { cancelled = true }
  }, [hasMore])

  // First load
  useEffect(() => {
    loadMore(null)
  }, []) // eslint-disable-line

  // Load more when scroll sentinel is visible
  const handleSentinelVisible = useCallback(() => {
    if (!loadingRef.current && hasMore && nextToken) {
      loadMore(nextToken)
    }
  }, [nextToken, hasMore, loadMore])

  const sentinelRef = useLazyLoad(handleSentinelVisible)

  // useMemo — filter baar baar nahi chalega
  const movies = useMemo(
    () => allTitles.filter(m => m.type === 'movie'),
    [allTitles]
  )

  const tvShows = useMemo(
    () => allTitles.filter(m => m.type === 'tvSeries' || m.type === 'tvMiniSeries'),
    [allTitles]
  )

  const topRated = useMemo(
    () => [...allTitles]
      .filter(m => m.rating?.aggregateRating >= 8.0)
      .sort((a, b) => (b.rating?.aggregateRating || 0) - (a.rating?.aggregateRating || 0))
      .slice(0, 30),
    [allTitles]
  )

  const recentTitles = useMemo(
    () => allTitles.filter(m => m.startYear >= 2024).slice(0, 30),
    [allTitles]
  )

  const heroMovie = allTitles[0] || null

  return (
    <div style={{ background: '#141414', minHeight: '100vh' }}>
      {/* Hero */}
      <HeroBanner movie={heroMovie} />

      {/* Rows */}
      <div style={{ paddingBottom: '60px' }}>
        {initialLoading ? (
          // Skeleton loading state
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <>
            <MovieRow title="🔥 Trending Now" movies={allTitles.slice(0, 30)} />
            <MovieRow title="⭐ Top Rated" movies={topRated} />
            <MovieRow title="🆕 New Releases (2024+)" movies={recentTitles} />
            <MovieRow title="🎬 Movies" movies={movies.slice(0, 30)} />
            <MovieRow title="📺 TV Shows & Series" movies={tvShows.slice(0, 30)} />
            <MovieRow title="🌍 All Titles" movies={allTitles.slice(30, 80)} />
          </>
        )}

        {/* Invisible sentinel — yahan aane pe aur load hoga */}
        <div ref={sentinelRef} style={{ height: '40px' }} />

        {loading && !initialLoading && (
          <Loader text={`Loading more... (${allTitles.length} loaded)`} />
        )}

        {!hasMore && allTitles.length > 0 && (
          <p style={{
            textAlign: 'center', color: '#444',
            padding: '24px', fontSize: '13px'
          }}>
            ✓ All {allTitles.length} titles loaded
          </p>
        )}
      </div>
    </div>
  )
}

export default Home