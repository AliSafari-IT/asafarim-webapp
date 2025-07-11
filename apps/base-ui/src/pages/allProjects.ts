import type { Project } from '@asafarim/paginated-project-grid';

// Sample projects data
export const allProjects: Project[] = [
  {
    id: 'ecommerce-platform-igs',
    title: 'IGS Pharma',
    description: 'A comprehensive healthcare management system for pharmacies, including inventory management and patient records.',
    image: '/images/igs-asafarim-com.png',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: '.NET Core', color: '#339933', icon: '🔵' },
      { name: 'MongoDB', color: '#47A248', icon: '🍃' }
    ],
    links: [
      { type: 'demo', url: 'https://igs.asafarim.com', label: 'Live Demo' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/IGS' }
    ],
    tags: ['healthcare', 'management', 'pharmacy'],
    category: 'e-commerce',
    status: 'active',
    featured: false,
    lastUpdated: '2025-02-10',
    dateCreated: '2025-01-15'
  },
  {
    id: 'aquaflow-hydrological-modelling',
    title: 'Aquaflow Hydrological Modelling',
    image: '/images/aquaflow-asafarim-com.png',
    description: 'A comprehensive hydrological modelling tool for water resource management.',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: '.NET Core', color: '#339933', icon: '🔵' },
      { name: 'MySQL', color: '#47A248', icon: '🐬' }
    ],
    links: [
      { type: 'demo', url: 'https://aquaflow.asafarim.com' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/AquaFlow' }
    ],
    tags: ['fullstack', 'hydrology', 'modelling'],
    category: 'scientific',
    status: 'active',
    featured: false,
    lastUpdated: '2025-6-15'
  },
  {
    id: 'asafarim-webapp',
    title: 'Asafarim Webapp',
    image: '/images/asafarim-com.png',
    description: 'A comprehensive web application for managing and monitoring projects.',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: 'Node.js', color: '#339933', icon: '🔵' },
      { name: 'TypeScript', color: '#47A248', icon: '🍃' },
      { name: '.NET Core', color: '#339933', icon: '🔵' },
      { name: 'Vite', color: '#339933', icon: '🔵' },
      { name: 'Tailwind CSS', color: '#339933', icon: '🔵' },
    ],
    links: [
      { type: 'demo', url: 'https://asafarim.com' },
      { type: 'repo', url: 'https://github.com/alisafari-it/asafarim-webapp' }
    ],
    tags: ['fullstack', 'webapp', 'management'],
    category: 'webapp',
    status: 'active',
    featured: true,
    lastUpdated: '2025-07-10',
    dateCreated: '2025-01-15'
  },
  {
    id: 'bibliography-asafarim-com',
    title: 'Bibliography',
    image: '/images/bibliography-asafarim-com.png',
    description: 'A comprehensive bibliography management system.',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: 'TypeScript', color: '#47A248', icon: '🍃' },
      { name: '.NET Core', color: '#339933', icon: '🔵' },
      { name: 'React Redux', color: '#339933', icon: '�' },
    ],
    links: [
      { type: 'demo', url: 'https://bibliography.asafarim.com' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim/tree/main/ASafariM.Clients/asafarim-bibliography' }
    ],
    tags: ['fullstack', 'typescript', 'bibliography', 'management'],
    category: 'webapp',
    status: 'active',
    featured: false,
    lastUpdated: '2025-07-10',
    dateCreated: '2025-01-15'
  },
  {
    id : 'pbk-asafarim-com',
    title: 'PBK',
    image: '/images/pbk-asafarim-com.png',
    description: 'A comprehensive portfolio management system.',
    techStack: [
      { name: 'Angular', color: '#61dafb', icon: '⚛️' },
      { name: 'TypeScript', color: '#47A248', icon: '🍃' },
      { name: '.NET Core', color: '#339933', icon: '🔵' },
      { name: 'Angular Material', color: '#339933', icon: '�' }
    ],
    links: [
      { type: 'demo', url: 'https://pbk.asafarim.com' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim/tree/main/ASafariM.Clients/asafarim-pbk' }
    ],
    tags: ['fullstack', 'typescript', 'portfolio', 'management', 'angular', 'material'],
    category: 'webapp',
    status: 'archived',
    featured: false,
    lastUpdated: '2025-07-10',
    dateCreated: '2025-01-15'
  }
];
