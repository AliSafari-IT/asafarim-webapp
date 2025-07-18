import React from 'react';
import styles from './Footer.module.css';

interface FooterProps {
  theme: 'light' | 'dark';
  style?: React.CSSProperties;
}

export const Footer: React.FC<FooterProps> = ({ 
  theme, 
  style = {} as React.CSSProperties,
}) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`${styles.footer} ${styles[theme]}`} 
            style={style}>
      <div className={styles.footerContent}>
        <div className={styles.copyright}>
          <span>©</span>
          <span>{currentYear} ASafariM</span>
        </div>
        
        <div className={styles.brand}>
          <div className={styles.brandText}>⚡ ASafariM</div>
          <div className={styles.tagline}>Built with React & TypeScript</div>
          <div className={styles.socialLinks}>
            <a href="https://github.com/alisafari-it" className={styles.socialLink} aria-label="GitHub">
              ⚡
            </a>
            <a href="https://twitter.com/asafarim" className={styles.socialLink} aria-label="Twitter">
              🐦
            </a>
            <a href="https://www.linkedin.com/in/ali-safari-m/" className={styles.socialLink} aria-label="LinkedIn">
              💼
            </a>
          </div>
        </div>
        
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <div className={styles.linkGroupTitle}>Resources</div>
            <a href="/docs" className={styles.link}>Documentation</a>
            <a href="/api" className={styles.link}>API Reference</a>
            <a href="/current-projects" className={styles.link}>Current Projects</a>
          </div>
          
          <div className={styles.linkGroup}>
            <div className={styles.linkGroupTitle}>Support</div>
            <a href="/help" className={styles.link}>Help Center</a>
            <a href="/contact" className={styles.link}>Contact</a>
            <a href="/status" className={styles.link}>Status</a>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className={styles.version}>v1.0.0</div>
      </div>
    </footer>
  );
};
