import { useState } from "react";
// Use our professional DisplayCodeDemo component
import { DisplayCode } from "@asafarim/display-code";
import { PackageLinks } from "@asafarim/shared";

const codeExamples = {
  javascript: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(\`Fibonacci(10) = \${result}\`);

// Arrow function example
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);`,

  typescript: `// TypeScript Example
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
  
  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
  
  getActiveUsers(): User[] {
    return this.users.filter(user => user.isActive);
  }
}

// Generic function
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

const stringArray = createArray<string>(3, "hello");`,

  jsx: `// React JSX Example
import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);
  
  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };
  
  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;`,

  python: `# Python Example
import asyncio
from typing import List, Optional
from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int
    email: Optional[str] = None
    
    def is_adult(self) -> bool:
        return self.age >= 18
    
    def __str__(self) -> str:
        return f"{self.name} ({self.age} years old)"

class PersonManager:
    def __init__(self):
        self.people: List[Person] = []
    
    def add_person(self, person: Person) -> None:
        self.people.append(person)
    
    def find_adults(self) -> List[Person]:
        return [p for p in self.people if p.is_adult()]
    
    async def send_emails(self) -> None:
        """Simulate sending emails asynchronously"""
        for person in self.people:
            if person.email:
                await self.send_email(person)
    
    async def send_email(self, person: Person) -> None:
        print(f"Sending email to {person.name} at {person.email}")
        await asyncio.sleep(0.1)  # Simulate network delay

# Usage example
if __name__ == "__main__":
    manager = PersonManager()
    manager.add_person(Person("Alice", 25, "alice@example.com"))
    manager.add_person(Person("Bob", 17))
    
    adults = manager.find_adults()
    print(f"Found {len(adults)} adults")`,

  css: `/* CSS Example with modern features */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --border-radius: 8px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--success-color));
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px -2px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.75rem;
}

.card-content {
  color: var(--secondary-color);
  line-height: 1.6;
}

/* Grid layout */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .card {
    padding: 1rem;
  }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .card {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .card-title {
    color: #60a5fa;
  }
}`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern HTML5 Example</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#3b82f6">
</head>
<body>
    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">
                <img src="logo.svg" alt="Company Logo" width="32" height="32">
                <span>My App</span>
            </div>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main class="main-content">
        <section class="hero">
            <h1>Welcome to Our Platform</h1>
            <p>Discover amazing features and grow your business</p>
            <button class="cta-button">Get Started</button>
        </section>

        <section class="features">
            <h2>Our Features</h2>
            <div class="feature-grid">
                <article class="feature-card">
                    <h3>Fast Performance</h3>
                    <p>Lightning-fast load times and smooth interactions.</p>
                </article>
                <article class="feature-card">
                    <h3>Secure</h3>
                    <p>Enterprise-grade security for your data.</p>
                </article>
                <article class="feature-card">
                    <h3>Scalable</h3>
                    <p>Grows with your business needs.</p>
                </article>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p>&copy; 2024 My App. All rights reserved.</p>
    </footer>

    <script src="app.js"></script>
</body>
</html>`,

  json: `{
  "name": "@company/awesome-package",
  "version": "2.1.0",
  "description": "An awesome package for doing amazing things",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "keywords": [
    "typescript",
    "javascript",
    "utility",
    "library"
  ],
  "author": {
    "name": "John Doe",
    "email": "john@example.com",
    "url": "https://johndoe.dev"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/company/awesome-package.git"
  },
  "bugs": {
    "url": "https://github.com/company/awesome-package/issues"
  },
  "homepage": "https://company.github.io/awesome-package",
  "dependencies": {
    "lodash": "^4.17.21",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "@types/lodash": "^4.14.195",
    "@types/jest": "^29.5.2",
    "jest": "^29.5.0",
    "typescript": "^5.1.3",
    "rollup": "^3.25.1",
    "prettier": "^2.8.8",
    "eslint": "^8.42.0"
  },
  "peerDependencies": {
    "react": ">=16.8.0"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "publishConfig": {
    "access": "public"
  }
}`,

  bash: `#!/bin/bash

# Deployment Script
set -e  # Exit on any error

# Configuration
APP_NAME="my-app"
DOCKER_IMAGE="$APP_NAME:latest"
DEPLOY_ENV="\${1:-staging}"
LOG_FILE="/var/log/deploy.log"

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Logging function
log() {
    echo -e "[\$(date '+%Y-%m-%d %H:%M:%S')] \$1" | tee -a "\$LOG_FILE"
}

# Error handling
error_exit() {
    log "\${RED}ERROR: \$1\${NC}"
    exit 1
}

# Success message
success() {
    log "\${GREEN}SUCCESS: \$1\${NC}"
}

# Warning message
warning() {
    log "\${YELLOW}WARNING: \$1\${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error_exit "Docker is not running"
    fi
    success "Docker is running"
}

# Build Docker image
build_image() {
    log "Building Docker image..."
    if docker build -t "\$DOCKER_IMAGE" .; then
        success "Docker image built successfully"
    else
        error_exit "Failed to build Docker image"
    fi
}

# Deploy to environment
deploy() {
    local env=\$1
    log "Deploying to \$env environment..."
    
    case \$env in
        "staging")
            deploy_staging
            ;;
        "production")
            deploy_production
            ;;
        *)
            error_exit "Unknown environment: \$env"
            ;;
    esac
}

# Deploy to staging
deploy_staging() {
    docker-compose -f docker-compose.staging.yml down
    docker-compose -f docker-compose.staging.yml up -d
    success "Deployed to staging"
}

# Deploy to production
deploy_production() {
    warning "Deploying to production..."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ \$REPLY =~ ^[Yy]\$ ]]; then
        kubectl apply -f k8s/
        success "Deployed to production"
    else
        log "Production deployment cancelled"
    fi
}

# Main execution
main() {
    log "Starting deployment process..."
    check_docker
    build_image
    deploy "\$DEPLOY_ENV"
    success "Deployment completed successfully!"
}

# Run main function
main "\$@"`,
};

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showCopyButton, setShowCopyButton] = useState(true);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [wrapLines, setWrapLines] = useState(false);
  const [maxHeight, setMaxHeight] = useState("400px");

  // Toggle between light and dark theme
  function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  // Check for saved theme preference
  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  document.documentElement.setAttribute("data-theme", savedTheme);

  const handleCopy = (code: string) => {
    console.log("Code copied:", code.length, "characters");
  };

  return (
    <div className={`demo-container ${theme === "dark" ? "dark-theme" : ""}`}>
      <div className="demo-header">
        <div className="logo-container">
          <img src="./logo.svg" alt="Display Code Logo" className="demo-logo" />
        </div>
        <h1>@asafarim/display-code</h1>
        <p>Beautiful syntax-highlighted code blocks for React applications</p>

        <PackageLinks
          packageName="@asafarim/display-code"
          githubPath="packages/display-code"
          demoPath="packages/display-code"
        />

        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            Switch to {theme === "light" ? "Dark" : "Light"} Theme
          </button>
        </div>
      </div>

      <div className="demo-section">
        <h2>🚀 Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>🌈 Syntax Highlighting</h3>
            <p>
              Support for 15+ programming languages with proper tokenization
            </p>
          </div>
          <div className="feature-item">
            <h3>🌓 Theme Support</h3>
            <p>Light, dark, and auto themes with smooth transitions</p>
          </div>
          <div className="feature-item">
            <h3>📋 Copy to Clipboard</h3>
            <p>One-click copy functionality with visual feedback</p>
          </div>
          <div className="feature-item">
            <h3>🔢 Line Numbers</h3>
            <p>Optional line numbers with customizable starting numbers</p>
          </div>
          <div className="feature-item">
            <h3>📱 Responsive Design</h3>
            <p>Mobile-optimized styling that works on all devices</p>
          </div>
          <div className="feature-item">
            <h3>⚡ Performance</h3>
            <p>Optimized rendering for large code blocks</p>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>🎮 Interactive Demo</h2>
        <p>Try different settings to see how the component behaves:</p>

        <div className="controls">
          <div className="control-group">
            <label>Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {Object.keys(codeExamples).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Font Size:</label>
            <select
              value={fontSize}
              onChange={(e) =>
                setFontSize(e.target.value as "small" | "medium" | "large")
              }
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="control-group">
            <label>Max Height:</label>
            <select
              value={maxHeight}
              onChange={(e) => setMaxHeight(e.target.value)}
            >
              <option value="200px">200px</option>
              <option value="400px">400px</option>
              <option value="600px">600px</option>
              <option value="none">No limit</option>
            </select>
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
              />
              Line Numbers
            </label>
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={showCopyButton}
                onChange={(e) => setShowCopyButton(e.target.checked)}
              />
              Copy Button
            </label>
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={wrapLines}
                onChange={(e) => setWrapLines(e.target.checked)}
              />
              Wrap Lines
            </label>
          </div>
        </div>

        <DisplayCode
          code={codeExamples[selectedLanguage as keyof typeof codeExamples]}
          language={selectedLanguage as any}
          theme={theme}
          title={`${
            selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
          } Example`}
          showLineNumbers={showLineNumbers}
          showCopyButton={showCopyButton}
          fontSize={fontSize}
          wrapLines={wrapLines}
          maxHeight={maxHeight === "none" ? undefined : maxHeight}
          onCopy={handleCopy}
        />
      </div>

      <div className="demo-section">
        <h2>🌐 Language Support</h2>
        <p>
          The component supports syntax highlighting for multiple programming
          languages:
        </p>

        <div className="language-showcase">
          <DisplayCode
            code={`// Basic usage example
import { DisplayCode } from '@asafarim/display-code';

<DisplayCode
  code="console.log('Hello, World!');"
  language="javascript"
  theme="light"
  showLineNumbers={true}
/>`}
            language="jsx"
            theme={theme}
            title="Basic Usage"
            showLineNumbers={true}
            fontSize="small"
          />

          <DisplayCode
            code={`/* CSS with custom properties */
:root {
  --primary: #3b82f6;
  --radius: 8px;
}

.button {
  background: var(--primary);
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  transition: transform 0.2s;
}

.button:hover {
  transform: translateY(-2px);
}`}
            language="css"
            theme={theme}
            title="CSS Styling"
            showLineNumbers={true}
            fontSize="small"
          />
        </div>
      </div>

      <div className="demo-section">
        <h2>⚙️ Advanced Features</h2>

        <div className="demo-grid">
          <div>
            <h3>Line Highlighting</h3>
            <DisplayCode
              code={`function example() {
  const important = "This line is highlighted";
  console.log("Regular line");
  return important;
}`}
              language="javascript"
              theme={theme}
              showLineNumbers={true}
              highlightLines={[2]}
              title="Highlighted Lines Demo"
            />
          </div>

          <div>
            <h3>Custom Starting Line Number</h3>
            <DisplayCode
              code={`# Starting from line 50
def process_data(data):
    """Process the input data"""
    result = []
    for item in data:
        if item.is_valid():
            result.append(item.transform())
    return result`}
              language="python"
              theme={theme}
              showLineNumbers={true}
              startLineNumber={50}
              title="Custom Line Numbers"
            />
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h2>📦 Installation & Usage</h2>

        <DisplayCode
          code={`# Install the package
npm install @asafarim/display-code

# Or with yarn
yarn add @asafarim/display-code

# Or with pnpm
pnpm add @asafarim/display-code`}
          language="bash"
          theme={theme}
          title="Installation"
          showCopyButton={true}
        />

        <DisplayCode
          code={`import { DisplayCode } from '@asafarim/display-code';

function MyComponent() {
  const code = \`
function greet(name) {
  return \`Hello, \${name}!\`;
}
  \`;

  return (
    <DisplayCode
      code={code}
      language="javascript"
      theme="dark"
      showLineNumbers={true}
      showCopyButton={true}
      title="My Code Example"
      onCopy={(code) => console.log('Copied!')}
    />
  );
}`}
          language="jsx"
          theme={theme}
          title="React Usage Example"
          showLineNumbers={true}
          showCopyButton={true}
        />
      </div>

      <div style={{ textAlign: "center", margin: "4rem 0 2rem" }}>
        <p
          style={{
            fontSize: "1.1rem",
            color: theme === "dark" ? "#a0aec0" : "#4a5568",
          }}
        >
          Built with ❤️ by Ali Safari
        </p>
      </div>
    </div>
  );
}

export default App;
