import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>About Base UI App</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2>Overview</h2>
        <p style={{ lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Base UI App is a modern React application built with professional layout components 
          and a comprehensive design system. It demonstrates best practices for building 
          scalable, maintainable web applications with beautiful user interfaces.
        </p>
        
        <p style={{ lineHeight: '1.8' }}>
          The application features a modular architecture with reusable components, 
          responsive design, theme support, and professional navigation patterns.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Key Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3>🎨 Modern UI</h3>
            <p>Clean, professional design with smooth animations and responsive layouts.</p>
          </div>
          
          <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3>📱 Responsive Design</h3>
            <p>Optimized for all devices - desktop, tablet, and mobile.</p>
          </div>
          
          <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3>🌙 Theme Support</h3>
            <p>Light and dark theme modes with smooth transitions.</p>
          </div>
          
          <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3>🧩 Component Library</h3>
            <p>Reusable components for rapid application development.</p>
          </div>
          
          <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3>⚡ Performance</h3>
            <p>Optimized for speed with modern React patterns and best practices.</p>
          </div>
          
          <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <h3>🔧 Developer Experience</h3>
            <p>TypeScript support, ESLint configuration, and development tools.</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Technology Stack</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
          {[
            { name: 'React', icon: '⚛️' },
            { name: 'TypeScript', icon: '📝' },
            { name: 'Vite', icon: '⚡' },
            { name: 'CSS Modules', icon: '🎨' },
            { name: 'React Router', icon: '🛣️' },
            { name: 'ESLint', icon: '🔍' }
          ].map((tech) => (
            <div 
              key={tech.name}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                fontSize: '0.9rem'
              }}
            >
              <span>{tech.icon}</span>
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Getting Started</h2>
        <p style={{ lineHeight: '1.8', marginBottom: '1rem' }}>
          This application serves as both a showcase and a starting point for building 
          modern React applications with professional layouts and components.
        </p>
        
        <div style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '8px', marginTop: '1rem' }}>
          <h3>Quick Start</h3>
          <ol style={{ lineHeight: '1.8' }}>
            <li>Clone the repository</li>
            <li>Install dependencies with <code>pnpm install</code></li>
            <li>Start the development server with <code>pnpm dev</code></li>
            <li>Open your browser to see the application</li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
