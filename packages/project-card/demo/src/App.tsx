import { useState } from 'react';
import { ProjectCard } from '@asafarim/project-card';
import { DisplayCode } from '@asafarim/display-code';
import type { ProjectCardProps } from '@asafarim/project-card';

const sampleProjects: ProjectCardProps[] = [
  {
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce platform with user authentication, shopping cart, and payment integration using React and Node.js. Features include product catalog, user reviews, order management, and real-time inventory tracking.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=400&h=200',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: 'Node.js', color: '#339933', icon: '🟢' },
      { name: 'MongoDB', color: '#47A248', icon: '🍃' },
      { name: 'Express', color: '#000000', icon: '🚀' }
    ],
    links: [
      { type: 'demo', url: 'https://ecommerce-demo.com', label: 'Live Demo' },
      { type: 'repo', url: 'https://github.com/user/ecommerce' }
    ],
    status: 'active',
    featured: true,
    lastUpdated: '2024-01-15'
  },
  {
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with React and TypeScript, featuring dark mode, responsive design, and smooth animations.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=400&h=200',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: 'TypeScript', color: '#3178c6', icon: '📘' },
      { name: 'CSS3', color: '#1572B6', icon: '🎨' }
    ],
    links: [
      { type: 'demo', url: 'https://portfolio-demo.com' },
      { type: 'repo', url: 'https://github.com/user/portfolio' }
    ],
    status: 'active',
    featured: false,
    lastUpdated: '2024-01-10'
  },
  {
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=400&h=200',
    techStack: [
      { name: 'React', color: '#61dafb', icon: '⚛️' },
      { name: 'Firebase', color: '#FFCA28', icon: '🔥' },
      { name: 'Material-UI', color: '#0081CB', icon: '🎨' }
    ],
    links: [
      { type: 'demo', url: 'https://task-app-demo.com' },
      { type: 'repo', url: 'https://github.com/user/task-app' }
    ],
    status: 'in-progress',
    featured: false,
    lastUpdated: '2024-01-05'
  },
  {
    title: 'Machine Learning Model',
    description: 'An archived machine learning project for image classification using TensorFlow and Python.',
    techStack: [
      { name: 'Python', color: '#3776ab', icon: '🐍' },
      { name: 'TensorFlow', color: '#FF6F00', icon: '🧠' },
      { name: 'Jupyter', color: '#F37626', icon: '📊' }
    ],
    links: [
      { type: 'repo', url: 'https://github.com/user/ml-model' },
      { type: 'documentation', url: 'https://docs.example.com' }
    ],
    status: 'archived',
    featured: false,
    lastUpdated: '2023-12-01'
  }
];

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showLoadingDemo, setShowLoadingDemo] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleCardClick = (title: string) => {
    alert(`Clicked on: ${title}`);
  };

  return (
    <div className={`demo-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="demo-header">
        <h1>@asafarim/project-card</h1>
        <p>A powerful and flexible React component for displaying project cards</p>
        
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </button>
        </div>
      </div>

      <div className="demo-section">
        <h2>🚀 Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>🌓 Theme Support</h3>
            <p>Built-in support for light and dark themes with smooth transitions</p>
          </div>
          <div className="feature-item">
            <h3>📱 Responsive Design</h3>
            <p>Fully responsive layout that works on all device sizes</p>
          </div>
          <div className="feature-item">
            <h3>🎨 Customizable</h3>
            <p>Extensive customization options for colors, spacing, and behavior</p>
          </div>
          <div className="feature-item">
            <h3>🔗 Multiple Link Types</h3>
            <p>Support for demo, repo, documentation, and custom links</p>
          </div>
          <div className="feature-item">
            <h3>🏷️ Status Indicators</h3>
            <p>Visual status indicators for active, archived, and in-progress projects</p>
          </div>
          <div className="feature-item">
            <h3>⚡ Performance</h3>
            <p>Optimized with lazy loading and efficient rendering</p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>📋 Basic Usage</h2>
        <p>Here's how easy it is to use the ProjectCard component:</p>
        <DisplayCode
          code={`import { ProjectCard } from '@asafarim/project-card';

<ProjectCard
  title="My Awesome Project"
  description="A description of my project"
  techStack={[
    { name: 'React', color: '#61dafb', icon: '⚛️' },
    { name: 'TypeScript', color: '#3178c6', icon: '📘' }
  ]}
  links={[
    { type: 'demo', url: 'https://demo.com' },
    { type: 'repo', url: 'https://github.com/user/repo' }
  ]}
  currentTheme="light"
  onCardClick={() => console.log('Card clicked!')}
/>`}
          language="jsx"
          theme={theme}
          title="Basic Usage Example"
          showLineNumbers={true}
          showCopyButton={true}
        />
      </div>

      <div className="demo-section">
        <h2>🎯 Live Examples</h2>
        <p>Click on any card to see the onClick handler in action!</p>
        <div className="demo-grid">
          {sampleProjects.map((project, index) => (
            <ProjectCard
              key={index}
              {...project}
              currentTheme={theme}
              showTechStackIcons={true}
              maxDescriptionLength={150}
              onCardClick={() => handleCardClick(project.title)}
            />
          ))}
        </div>
      </div>

      <div className="demo-section">
        <h2>⏳ Loading State</h2>
        <p>The component includes a beautiful loading state animation:</p>
        <div className="theme-toggle">
          <button onClick={() => setShowLoadingDemo(!showLoadingDemo)}>
            {showLoadingDemo ? 'Hide' : 'Show'} Loading Demo
          </button>
        </div>
        {showLoadingDemo && (
          <div className="demo-single">
            <ProjectCard
              title="Loading Project"
              description="This is loading..."
              techStack={[]}
              links={[]}
              currentTheme={theme}
              isLoading={true}
            />
          </div>
        )}
      </div>

      <div className="demo-section">
        <h2>🎨 Featured Cards</h2>
        <p>Make important projects stand out with the featured prop:</p>
        <div className="demo-single">
          <ProjectCard
            title="Featured Project"
            description="This is a featured project card with special styling to make it stand out from regular cards."
            image="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=400&h=200"
            techStack={[
              { name: 'React', color: '#61dafb', icon: '⚛️' },
              { name: 'Next.js', color: '#000000', icon: '▲' },
              { name: 'Tailwind', color: '#06b6d4', icon: '🎨' }
            ]}
            links={[
              { type: 'demo', url: 'https://featured-demo.com' },
              { type: 'repo', url: 'https://github.com/user/featured' }
            ]}
            currentTheme={theme}
            featured={true}
            showTechStackIcons={true}
            onCardClick={() => handleCardClick('Featured Project')}
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>🔧 Customization Options</h2>
        <p>The ProjectCard component offers extensive customization:</p>
        <DisplayCode
          code={`<ProjectCard
  // Core props
  title="Project Title"
  description="Project description"
  image="https://example.com/image.jpg"
  imageAlt="Alternative text for image"
  
  // Tech stack with colors and icons
  techStack={[
    { name: 'React', color: '#61dafb', icon: '⚛️' }
  ]}
  
  // Multiple link types
  links={[
    { type: 'demo', url: 'https://demo.com', label: 'Live Demo' },
    { type: 'repo', url: 'https://github.com/user/repo' },
    { type: 'documentation', url: 'https://docs.com' },
    { type: 'custom', url: 'https://custom.com', label: 'Custom Link' }
  ]}
  
  // Theming and appearance
  currentTheme="dark"
  featured={true}
  showTechStackIcons={true}
  
  // Behavior
  onCardClick={() => console.log('Clicked!')}
  maxDescriptionLength={200}
  
  // Status and metadata
  status="active" // 'active' | 'archived' | 'in-progress'
  lastUpdated="2024-01-15"
  
  // Loading state
  isLoading={false}
  
  // Custom styling
  className="custom-card-class"
/>`}
          language="jsx"
          theme={theme}
          title="Advanced Customization"
          showLineNumbers={true}
          showCopyButton={true}
        />
      </div>

      <div className="demo-section">
        <h2>📦 Installation</h2>
        <DisplayCode
          code={`npm install @asafarim/project-card

# or

yarn add @asafarim/project-card

# or

pnpm add @asafarim/project-card`}
          language="bash"
          theme={theme}
          title="Package Installation"
          showCopyButton={true}
        />
      </div>

      <div className="demo-section">
        <h2>🎭 TypeScript Support</h2>
        <p>Full TypeScript support with comprehensive type definitions:</p>
        <DisplayCode
          code={`import { ProjectCard, ProjectCardProps, TechStackItem, ProjectLink } from '@asafarim/project-card';

const techStack: TechStackItem[] = [
  { name: 'React', color: '#61dafb', icon: '⚛️' }
];

const links: ProjectLink[] = [
  { type: 'demo', url: 'https://demo.com' }
];

const projectProps: ProjectCardProps = {
  title: 'My Project',
  description: 'Description',
  techStack,
  links
};`}
          language="typescript"
          theme={theme}
          title="TypeScript Usage"
          showLineNumbers={true}
          showCopyButton={true}
        />
      </div>

      <div style={{ textAlign: 'center', margin: '4rem 0 2rem' }}>
        <p style={{ fontSize: '1.1rem', color: theme === 'dark' ? '#a0aec0' : '#4a5568' }}>
          Built with ❤️ by Ali Safari
        </p>
      </div>
    </div>
  );
}

export default App;
