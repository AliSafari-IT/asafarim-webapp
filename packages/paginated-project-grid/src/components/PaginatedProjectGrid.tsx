import React, { useState, useMemo, useEffect } from 'react';
import { ProjectCard } from '@asafarim/project-card';
import { PaginatedProjectGridProps, Project } from '../types';
import styles from './PaginatedProjectGrid.module.css';

export const PaginatedProjectGrid: React.FC<PaginatedProjectGridProps> = ({
  projects,
  cardsPerPage = 6,
  currentTheme = 'light',
  className = '',
  onProjectClick,
  showTechStackIcons = false,
  maxDescriptionLength = 150,
  enableSearch = true,
  searchPlaceholder = "Search projects by name, description, or technology...",
  noResultsMessage = "No projects found matching your search.",
  loadingMessage = "Loading projects...",
  isLoading = false,
  searchFields = ['title', 'description', 'techStack', 'tags'],
  responsive = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  },
  showLoadMore = false,
  loadMoreText = "Load More",
  animationDuration = 300
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(cardsPerPage);

  const isDark = currentTheme === 'dark';

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projects;

    const searchLower = searchTerm.toLowerCase().trim();
    
    return projects.filter(project => {
      const searchableFields = [];
      
      if (searchFields.includes('title')) {
        searchableFields.push(project.title);
      }
      
      if (searchFields.includes('description')) {
        searchableFields.push(project.description);
      }
      
      if (searchFields.includes('techStack')) {
        searchableFields.push(...project.techStack.map(tech => tech.name));
      }
      
      if (searchFields.includes('tags') && project.tags) {
        searchableFields.push(...project.tags);
      }
      
      if (searchFields.includes('category') && project.category) {
        searchableFields.push(project.category);
      }
      
      return searchableFields.some(field => 
        field.toLowerCase().includes(searchLower)
      );
    });
  }, [projects, searchTerm, searchFields]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  
  const paginatedProjects = showLoadMore 
    ? filteredProjects.slice(0, itemsToShow)
    : filteredProjects.slice(startIndex, endIndex);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
    setItemsToShow(cardsPerPage);
  }, [searchTerm, cardsPerPage]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search toggle
  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle load more
  const handleLoadMore = () => {
    setItemsToShow(prev => prev + cardsPerPage);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Get responsive grid class
  const getGridClass = () => {
    return `${styles.projectGrid} ${styles.gridDesktop}`;
  };

  const containerClasses = [
    styles.gridContainer,
    className
  ].filter(Boolean).join(' ');

  const searchToggleClasses = [
    styles.searchToggle,
    isDark ? styles.searchToggleDark : ''
  ].filter(Boolean).join(' ');

  const searchInputClasses = [
    styles.searchInput,
    isDark ? styles.searchInputDark : ''
  ].filter(Boolean).join(' ');

  // Loading state
  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className={`${styles.loadingState} ${isDark ? styles.loadingStateDark : ''}`}>
          <div className={styles.loadingSpinner}>⟳</div>
          {loadingMessage}
        </div>
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <div className={containerClasses}>
        <div className={`${styles.emptyState} ${isDark ? styles.emptyStateDark : ''}`}>
          <div className={styles.emptyStateIcon}>📂</div>
          <div className={styles.emptyStateTitle}>No Projects Yet</div>
          <div className={styles.emptyStateMessage}>
            Projects will appear here once they are added.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Search Section */}
      {enableSearch && (
        <div className={styles.searchSection}>
          <div className={searchToggleClasses} onClick={handleSearchToggle}>
            <span className={`${styles.searchIcon} ${isSearchExpanded ? styles.searchIconExpanded : ''}`}>
              🔍
            </span>
            Search Projects
          </div>
          
          <div className={isSearchExpanded ? styles.searchExpanded : styles.searchCollapsed}>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className={searchInputClasses}
            />
            
            {searchTerm && (
              <div className={`${styles.searchResults} ${isDark ? styles.searchResultsDark : ''}`}>
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredProjects.length === 0 && searchTerm && (
        <div className={`${styles.emptyState} ${isDark ? styles.emptyStateDark : ''}`}>
          <div className={styles.emptyStateIcon}>🔍</div>
          <div className={styles.emptyStateTitle}>No Results Found</div>
          <div className={styles.emptyStateMessage}>
            {noResultsMessage}
          </div>
        </div>
      )}

      {/* Project Grid */}
      {filteredProjects.length > 0 && (
        <>
          <div className={getGridClass()}>
            {paginatedProjects.map((project, index) => (
              <div 
                key={project.id} 
                className={styles.projectCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProjectCard
                  {...project}
                  currentTheme={currentTheme}
                  showTechStackIcons={showTechStackIcons}
                  maxDescriptionLength={maxDescriptionLength}
                  onCardClick={() => onProjectClick?.(project)}
                />
              </div>
            ))}
          </div>

          {/* Pagination or Load More */}
          {showLoadMore ? (
            // Load More Button
            itemsToShow < filteredProjects.length && (
              <button
                onClick={handleLoadMore}
                className={`${styles.loadMoreButton} ${isDark ? styles.loadMoreButtonDark : ''}`}
              >
                {loadMoreText}
              </button>
            )
          ) : (
            // Pagination
            totalPages > 1 && (
              <div className={styles.pagination}>
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`${styles.paginationButton} ${isDark ? styles.paginationButtonDark : ''}`}
                >
                  ‹
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className={`${styles.paginationInfo} ${isDark ? styles.paginationInfoDark : ''}`}>
                        {page}
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page as number)}
                        className={`${styles.paginationButton} ${
                          currentPage === page 
                            ? isDark 
                              ? styles.paginationButtonActiveDark 
                              : styles.paginationButtonActive
                            : isDark 
                              ? styles.paginationButtonDark 
                              : ''
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`${styles.paginationButton} ${isDark ? styles.paginationButtonDark : ''}`}
                >
                  ›
                </button>

                {/* Pagination Info */}
                <div className={`${styles.paginationInfo} ${isDark ? styles.paginationInfoDark : ''}`}>
                  {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length}
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};
