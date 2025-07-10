import { Project } from '@asafarim/paginated-project-grid'

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'ASafariM Web Application',
    description: 'A microservices architecture web application with ASP.NET Core backend, React frontend, and MySQL database. Features containerized development environment with Docker Compose.',
    image: 'https://via.placeholder.com/600x400?text=ASafariM+Web+App',
    techStack: [
      { name: 'ASP.NET Core', color: '#512BD4', icon: '🔷' },
      { name: 'React', color: '#61DAFB', icon: '⚛️' },
      { name: 'MySQL', color: '#4479A1', icon: '🐬' },
      { name: 'Docker', color: '#2496ED', icon: '🐳' }
    ],
    links: [
      { type: 'demo', url: 'https://asafarim.com' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-webapp' },
      { type: 'documentation', url: 'https://docs.asafarim.com' }
    ],
    tags: ['web', 'microservices', 'docker', 'fullstack'],
    category: 'Web Application',
    dateCreated: '2023-01-15'
  },
  {
    id: '2',
    title: 'Paginated Project Grid',
    description: 'A responsive React component for displaying paginated project cards with built-in search functionality. Supports light and dark themes, custom filtering, and lazy loading.',
    image: 'https://via.placeholder.com/600x400?text=Project+Grid',
    techStack: [
      { name: 'React', color: '#61DAFB', icon: '⚛️' },
      { name: 'TypeScript', color: '#3178C6', icon: '📘' },
      { name: 'CSS Modules', color: '#1572B6', icon: '🎨' }
    ],
    links: [
      { type: 'demo', url: 'https://asafarim.com/demos/project-grid' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-webapp/tree/main/packages/paginated-project-grid' }
    ],
    tags: ['component', 'react', 'typescript', 'ui'],
    category: 'UI Component',
    dateCreated: '2023-03-22'
  },
  {
    id: '3',
    title: 'Markdown File Explorer',
    description: 'A TypeScript library for exploring and parsing markdown files in a directory structure. Features include lazy loading, file watching, and metadata extraction.',
    image: 'https://via.placeholder.com/600x400?text=MD+File+Explorer',
    techStack: [
      { name: 'TypeScript', color: '#3178C6', icon: '📘' },
      { name: 'Node.js', color: '#339933', icon: '🟢' },
      { name: 'Markdown', color: '#000000', icon: '📝' }
    ],
    links: [
      { type: 'demo', url: 'https://asafarim.com/demos/md-explorer' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-webapp/tree/main/packages/md-file-explorer' },
      { type: 'documentation', url: 'https://docs.asafarim.com/md-explorer' }
    ],
    tags: ['library', 'markdown', 'filesystem', 'typescript'],
    category: 'Library',
    dateCreated: '2023-05-10'
  },
  {
    id: '4',
    title: 'Project Card Component',
    description: 'A customizable React component for displaying project information in a card format. Supports light and dark themes, tech stack icons, and responsive design.',
    image: 'https://via.placeholder.com/600x400?text=Project+Card',
    techStack: [
      { name: 'React', color: '#61DAFB', icon: '⚛️' },
      { name: 'TypeScript', color: '#3178C6', icon: '📘' },
      { name: 'CSS Modules', color: '#1572B6', icon: '🎨' }
    ],
    links: [
      { type: 'demo', url: 'https://asafarim.com/demos/project-card' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-webapp/tree/main/packages/project-card' }
    ],
    tags: ['component', 'react', 'ui', 'card'],
    category: 'UI Component',
    dateCreated: '2023-02-05'
  },
  {
    id: '5',
    title: 'ASafariM Blog',
    description: 'A technical blog built with Docusaurus using TypeScript. Features articles on web development, microservices, and software engineering best practices.',
    image: 'https://via.placeholder.com/600x400?text=ASafariM+Blog',
    techStack: [
      { name: 'Docusaurus', color: '#2E8555', icon: '📚' },
      { name: 'React', color: '#61DAFB', icon: '⚛️' },
      { name: 'TypeScript', color: '#3178C6', icon: '📘' },
      { name: 'MDX', color: '#1B1F24', icon: '📄' }
    ],
    links: [
      { type: 'demo', url: 'https://blog.asafarim.com' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-blog' }
    ],
    tags: ['blog', 'docusaurus', 'typescript', 'mdx'],
    category: 'Blog',
    dateCreated: '2023-06-18'
  },
  {
    id: '6',
    title: 'Gateway API',
    description: 'An API gateway service built with ASP.NET Core 9.0. Handles routing, authentication, and load balancing for microservices architecture.',
    image: 'https://via.placeholder.com/600x400?text=Gateway+API',
    techStack: [
      { name: 'ASP.NET Core', color: '#512BD4', icon: '🔷' },
      { name: 'C#', color: '#239120', icon: '🔧' },
      { name: 'Docker', color: '#2496ED', icon: '🐳' }
    ],
    links: [
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-webapp/tree/main/services/gateway' },
      { type: 'documentation', url: 'https://docs.asafarim.com/api/gateway' }
    ],
    tags: ['api', 'gateway', 'microservices', 'dotnet'],
    category: 'Backend Service',
    dateCreated: '2023-04-02'
  },
  {
    id: '7',
    title: 'Projects API',
    description: 'A RESTful API service for managing project data. Built with ASP.NET Core 8.0 and Entity Framework Core with MySQL database.',
    image: 'https://via.placeholder.com/600x400?text=Projects+API',
    techStack: [
      { name: 'ASP.NET Core', color: '#512BD4', icon: '🔷' },
      { name: 'Entity Framework', color: '#4479A1', icon: '🗄️' },
      { name: 'MySQL', color: '#4479A1', icon: '🐬' },
      { name: 'Swagger', color: '#85EA2D', icon: '📝' }
    ],
    links: [
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-webapp/tree/main/services/projects' },
      { type: 'documentation', url: 'https://docs.asafarim.com/api/projects' }
    ],
    tags: ['api', 'rest', 'database', 'dotnet'],
    category: 'Backend Service',
    dateCreated: '2023-04-15'
  },
  {
    id: '8',
    title: 'Documentation Portal',
    description: 'A comprehensive documentation portal built with MkDocs. Provides API references, guides, and tutorials for the ASafariM ecosystem.',
    image: 'https://via.placeholder.com/600x400?text=Documentation',
    techStack: [
      { name: 'MkDocs', color: '#2980B9', icon: '📚' },
      { name: 'Markdown', color: '#000000', icon: '📝' },
      { name: 'Python', color: '#3776AB', icon: '🐍' },
      { name: 'Docker', color: '#2496ED', icon: '🐳' }
    ],
    links: [
      { type: 'demo', url: 'https://docs.asafarim.com' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-webapp/tree/main/docs' }
    ],
    tags: ['documentation', 'mkdocs', 'markdown', 'technical-writing'],
    category: 'Documentation',
    dateCreated: '2023-03-10'
  },
  {
    id: '9',
    title: 'UI Component Library',
    description: 'A collection of reusable React components for building consistent user interfaces. Includes form elements, navigation, cards, and more.',
    image: 'https://via.placeholder.com/600x400?text=UI+Components',
    techStack: [
      { name: 'React', color: '#61DAFB', icon: '⚛️' },
      { name: 'TypeScript', color: '#3178C6', icon: '📘' },
      { name: 'Storybook', color: '#FF4785', icon: '📚' },
      { name: 'CSS Modules', color: '#1572B6', icon: '🎨' }
    ],
    links: [
      { type: 'demo', url: 'https://ui.asafarim.com' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-webapp/tree/main/packages/ui' }
    ],
    tags: ['ui', 'components', 'react', 'design-system'],
    category: 'UI Library',
    dateCreated: '2023-01-30'
  },
  {
    id: '10',
    title: 'Developer Portfolio',
    description: 'A personal developer portfolio website showcasing projects, skills, and experience. Built with React and features responsive design.',
    image: 'https://via.placeholder.com/600x400?text=Portfolio',
    techStack: [
      { name: 'React', color: '#61DAFB', icon: '⚛️' },
      { name: 'TypeScript', color: '#3178C6', icon: '📘' },
      { name: 'CSS Modules', color: '#1572B6', icon: '🎨' },
      { name: 'Vite', color: '#646CFF', icon: '⚡' }
    ],
    links: [
      { type: 'demo', url: 'https://alisafari.dev' },
      { type: 'repo', url: 'https://github.com/AliSafari-IT/portfolio' }
    ],
    tags: ['portfolio', 'personal', 'frontend', 'react'],
    category: 'Personal Website',
    dateCreated: '2023-02-20'
  },
  {
    id: '11',
    title: 'Authentication Service',
    description: 'A secure authentication service with JWT token support, OAuth integration, and role-based access control. Built with ASP.NET Core Identity.',
    image: 'https://via.placeholder.com/600x400?text=Auth+Service',
    techStack: [
      { name: 'ASP.NET Core', color: '#512BD4', icon: '🔷' },
      { name: 'Identity', color: '#239120', icon: '🔐' },
      { name: 'JWT', color: '#000000', icon: '🔑' },
      { name: 'OAuth', color: '#2496ED', icon: '🔒' }
    ],
    links: [
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-webapp/tree/main/services/auth' },
      { type: 'documentation', url: 'https://docs.asafarim.com/api/auth' }
    ],
    tags: ['authentication', 'security', 'jwt', 'oauth'],
    category: 'Backend Service',
    dateCreated: '2023-05-25'
  },
  {
    id: '12',
    title: 'Mobile App',
    description: 'A cross-platform mobile application built with React Native. Provides mobile access to the ASafariM ecosystem with offline capabilities.',
    image: 'https://via.placeholder.com/600x400?text=Mobile+App',
    techStack: [
      { name: 'React Native', color: '#61DAFB', icon: '📱' },
      { name: 'TypeScript', color: '#3178C6', icon: '📘' },
      { name: 'Redux', color: '#764ABC', icon: '🔄' },
      { name: 'Expo', color: '#000020', icon: '⚙️' }
    ],
    links: [
      { type: 'repo', url: 'https://github.com/AliSafari-IT/asafarim-mobile' },
      { type: 'documentation', url: 'https://docs.asafarim.com/mobile' }
    ],
    tags: ['mobile', 'react-native', 'cross-platform', 'app'],
    category: 'Mobile Application',
    dateCreated: '2023-07-12'
  }
]
