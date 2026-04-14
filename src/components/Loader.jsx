import React from 'react'

// Skeleton cards row — loading state me dikhaata hai
export const SkeletonRow = () => (
  <div style={{ marginBottom: '36px' }}>
    <div style={{
      width: '180px', height: '20px',
      background: '#2a2a2a', borderRadius: '4px',
      marginBottom: '12px', marginLeft: '40px',
    }} className="skeleton" />
    <div style={{ display: 'flex', gap: '8px', paddingLeft: '40px', paddingRight: '40px' }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{
          minWidth: '160px', height: '240px',
          borderRadius: '6px', background: '#2a2a2a', flexShrink: 0,
        }} className="skeleton" />
      ))}
    </div>
  </div>
)

// Full page loader
const Loader = ({ text = 'Loading...' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '48px', gap: '12px',
  }}>
    <div style={{
      width: '36px', height: '36px',
      border: '3px solid #2a2a2a',
      borderTop: '3px solid #E50914',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <span style={{ color: '#666', fontSize: '13px' }}>{text}</span>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

export default Loader