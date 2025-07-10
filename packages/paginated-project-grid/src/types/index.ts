import { ProjectCardProps } from '@asafarim/project-card';

export interface Project extends Omit<ProjectCardProps, 'currentTheme' | 'className' | 'onCardClick' | 'showTechStackIcons' | 'maxDescriptionLength' | 'imageAlt' | 'isLoading'> {
  id: string;
  category?: string;
  tags?: string[];
  dateCreated?: string;
}

export interface PaginatedProjectGridProps {
  projects: Project[];
  cardsPerPage?: number;
  currentTheme?: 'light' | 'dark' | 'auto';
  className?: string;
  onProjectClick?: (project: Project) => void;
  showTechStackIcons?: boolean;
  maxDescriptionLength?: number;
  enableSearch?: boolean;
  searchPlaceholder?: string;
  noResultsMessage?: string;
  loadingMessage?: string;
  isLoading?: boolean;
  searchFields?: ('title' | 'description' | 'techStack' | 'tags' | 'category')[];
  responsive?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  showLoadMore?: boolean;
  loadMoreText?: string;
  animationDuration?: number;
}
