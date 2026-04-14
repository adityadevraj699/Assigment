import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SearchBar from './SearchBar'

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'TV Shows', path: '/category/TV_SERIES' },
  { label: 'Movies', path: '/category/MOVIE' },
  { label: 'Video Games', path: '/category/VIDEO_GAME' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Scroll pe navbar background change
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 1000,
      background: scrolled
        ? 'rgba(20,20,20,0.98)'
        : 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)',
      display: 'flex', alignItems: 'center',
      padding: '0 40px',
      height: '64px',
      gap: '28px',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'background 0.3s, backdrop-filter 0.3s',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
    }}>
      {/* Logo */}
      <span
        onClick={() => navigate('/')}
        style={{
          color: '#E50914', fontSize: '26px',
          fontWeight: '900', cursor: 'pointer',
          letterSpacing: '-1px', marginRight: '16px',
          userSelect: 'none',
        }}
      >
        NETFIX
      </span>

      {/* Nav links */}
      {NAV_ITEMS.map(item => {
        const active = location.pathname === item.path
        return (
          <span
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              color: active ? '#fff' : '#b3b3b3',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: active ? '600' : '400',
              borderBottom: active ? '2px solid #E50914' : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.2s, border-color 0.2s',
              userSelect: 'none',
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = active ? '#fff' : '#b3b3b3'}
          >
            {item.label}
          </span>
        )
      })}

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <SearchBar />
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '4px',
          background: '#E50914',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          color: '#fff', fontWeight: '700', fontSize: '14px',
          cursor: 'pointer',
        }}>
          {localStorage.getItem('user')?.[0]?.toUpperCase() || 'G'}
        </div>
      </div>
    </nav>
  )
}

export default React.memo(Navbar)