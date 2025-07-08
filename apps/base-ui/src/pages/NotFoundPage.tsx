import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🔍</div>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text)' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '0.75rem 2rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Go Back
        </button>
        
        <a
          href="/"
          style={{
            padding: '0.75rem 2rem',
            background: 'transparent',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '1rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Go Home
        </a>
      </div>
      
      <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--surface)', borderRadius: '8px', maxWidth: '600px', margin: '4rem auto 0' }}>
        <h3>Popular Pages</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', lineHeight: '2' }}>
          <li><a href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>🏠 Home</a></li>
          <li><a href="/projects" style={{ color: 'var(--primary)', textDecoration: 'none' }}>📋 Projects</a></li>
          <li><a href="/components" style={{ color: 'var(--primary)', textDecoration: 'none' }}>🧩 Components</a></li>
          <li><a href="/about" style={{ color: 'var(--primary)', textDecoration: 'none' }}>👤 About</a></li>
          <li><a href="/contact" style={{ color: 'var(--primary)', textDecoration: 'none' }}>📧 Contact</a></li>
        </ul>
      </div>
    </div>
  );
};

export default NotFoundPage;
