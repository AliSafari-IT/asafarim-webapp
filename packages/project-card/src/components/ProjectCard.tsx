import React from 'react';
import { ProjectCardProps } from '../types';
import styles from './ProjectCard.module.css';

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  image,
  description,
  techStack,
  links,
  currentTheme = 'light',
  className = '',
  onCardClick,
  showTechStackIcons = false,
  maxDescriptionLength = 150,
  imageAlt,
  isLoading = false,
  featured = false,
  lastUpdated,
  status = 'active'
}) => {
  const isDark = currentTheme === 'dark';
  
  const truncatedDescription = maxDescriptionLength && description.length > maxDescriptionLength
    ? `${description.substring(0, maxDescriptionLength)}...`
    : description;

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'demo':
        return '🚀';
      case 'repo':
        return '📂';
      case 'documentation':
        return '📚';
      default:
        return '🔗';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'archived':
        return 'Archived';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Active';
    }
  };

  const cardClasses = [
    styles.card,
    isDark ? styles.cardDark : '',
    featured ? (isDark ? styles.featuredDark : styles.featured) : '',
    isLoading ? styles.loading : '',
    className
  ].filter(Boolean).join(' ');

  if (isLoading) {
    return (
      <div className={cardClasses} style={{ width: '100%' }}>
        <div 
          className={`${styles.loadingPlaceholder} ${isDark ? styles.loadingPlaceholderDark : ''}`} 
          style={{ 
            height: '200px', 
            marginBottom: '1rem', 
            width: '100%',
            display: 'block'
          }} 
        />
        <div 
          className={`${styles.loadingPlaceholder} ${isDark ? styles.loadingPlaceholderDark : ''}`} 
          style={{ 
            height: '1.5rem', 
            marginBottom: '0.75rem', 
            width: '100%',
            display: 'block'
          }} 
        />
        <div 
          className={`${styles.loadingPlaceholder} ${isDark ? styles.loadingPlaceholderDark : ''}`} 
          style={{ 
            height: '3rem', 
            marginBottom: '1rem', 
            width: '100%',
            display: 'block'
          }} 
        />
        <div 
          className={`${styles.loadingPlaceholder} ${isDark ? styles.loadingPlaceholderDark : ''}`} 
          style={{ 
            height: '2rem',
            width: '100%',
            display: 'block'
          }} 
        />
      </div>
    );
  }

  return (
    <div className={cardClasses} onClick={onCardClick}>
      {status && (
        <div className={`${styles.status} ${styles[`status${status.charAt(0).toUpperCase() + status.slice(1).replace('-', '')}${isDark ? 'Dark' : ''}`]}`}>
          {getStatusLabel(status)}
        </div>
      )}
      
      <div className={styles.imageContainer}>
        {image ? (
          <img 
            src={image} 
            alt={imageAlt || title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={`${styles.imagePlaceholder} ${isDark ? styles.imagePlaceholderDark : ''}`}>
            No preview available
          </div>
        )}
      </div>

      <h3 className={`${styles.title} ${isDark ? styles.titleDark : ''}`}>
        {title}
      </h3>

      <p className={`${styles.description} ${isDark ? styles.descriptionDark : ''}`}>
        {truncatedDescription}
      </p>

      <div className={styles.techStack}>
        {techStack.map((tech, index) => (
          <span 
            key={index} 
            className={`${styles.techTag} ${isDark ? styles.techTagDark : ''}`}
            style={{ backgroundColor: tech.color }}
          >
            {showTechStackIcons && tech.icon && (
              <span className={styles.techIcon}>{tech.icon}</span>
            )}
            {tech.name}
          </span>
        ))}
      </div>

      <div className={styles.links}>
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.link} ${styles[`link${link.type.charAt(0).toUpperCase() + link.type.slice(1)}`]} ${isDark && link.type === 'repo' ? styles.linkRepoDark : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <span>{getLinkIcon(link.type)}</span>
            {link.label || link.type.charAt(0).toUpperCase() + link.type.slice(1)}
          </a>
        ))}
      </div>

      {lastUpdated && (
        <div className={`${styles.lastUpdated} ${isDark ? styles.lastUpdatedDark : ''}`}>
          Last updated: {new Date(lastUpdated).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};