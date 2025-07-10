export interface TechStackItem {
  name: string;
  color?: string;
  icon?: string;
}

export interface ProjectLink {
  type: 'demo' | 'repo' | 'documentation' | 'custom';
  url: string;
  label?: string;
}

export type Theme = 'light' | 'dark' | 'auto';

export interface ProjectCardProps {
  title: string;
  image?: string;
  description: string;
  techStack: TechStackItem[];
  links: ProjectLink[];
  currentTheme?: Theme;
  className?: string;
  onCardClick?: () => void;
  showTechStackIcons?: boolean;
  maxDescriptionLength?: number;
  imageAlt?: string;
  isLoading?: boolean;
  featured?: boolean;
  lastUpdated?: string;
  status?: 'active' | 'archived' | 'in-progress';
}