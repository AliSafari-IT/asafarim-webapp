# ASafariM Sidebar Demo

[![Deploy Sidebar Demo to Pages](https://github.com/AliSafari-IT/asafarim-webapp/actions/workflows/static/sidebar-package.yml/badge.svg)](https://github.com/AliSafari-IT/asafarim-webapp/blob/main/.github/workflows/deploy-sidebar-demo.yml)

A comprehensive demo application showcasing the [@asafarim/sidebar](https://github.com/AliSafari-IT/asafarim-webapp/tree/main/packages/sidebar) React component with various configuration options and theming capabilities.

## 🚀 Live Demo

Explore the live demo at: [https://alisafari-it.github.io/my-packages/asafarim/sidebar/](https://alisafari-it.github.io/my-packages/asafarim/sidebar/)

## ✨ Features

This demo application showcases the following features of the `@asafarim/sidebar` component:

- **Collapsible Sidebar**: Toggle between expanded and collapsed states
- **Position Toggling**: Switch sidebar between left and right positions
- **Theming Support**: Toggle between light and dark themes
- **Mobile Responsiveness**: Overlay mode for mobile devices
- **Toggle Button Control**: Show/hide the toggle button
- **Navigation Items**: Nested menu structure with icons
- **Interactive Elements**: Clickable items with selection state

## 🛠️ Technology Stack

- **React 18+**: Modern React with functional components and hooks
- **TypeScript**: Type-safe code
- **Vite**: Fast development and optimized builds
- **CSS Modules**: Scoped styling
- **@asafarim/sidebar**: The sidebar component being showcased

## 🏗️ Project Structure

```text
/demo
├── public/            # Static assets
├── src/
│   ├── App.tsx        # Main application component
│   ├── App.css        # Application styles
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

- Node.js 16+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/AliSafari-IT/asafarim-webapp.git
cd asafarim-webapp

# Install dependencies
pnpm install

# Build the sidebar package
cd packages/sidebar
pnpm build

# Run the demo
cd demo
pnpm dev
```

## 🎮 Usage

The demo provides interactive controls to experiment with different sidebar configurations:

### Sidebar Controls

- **Collapsed State**: Toggle between expanded and collapsed sidebar
- **Theme**: Switch between light and dark themes
- **Position**: Toggle sidebar between left and right positions
- **Overlay Mode**: Enable/disable overlay mode for mobile view
- **Toggle Button**: Show/hide the sidebar toggle button

### Code Example

```tsx
import { Sidebar } from '@asafarim/sidebar';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [position, setPosition] = useState<'left' | 'right'>('left');
  
  return (
    <div className="app-container">
      <Sidebar
        items={sidebarItems}
        isCollapsed={isCollapsed}
        onToggle={setIsCollapsed}
        position={position}
        theme={theme}
        onItemClick={handleItemClick}
        logo={<div>Logo</div>}
        footer={<div>Footer Content</div>}
      />
      <main className="content">
        {/* Your content here */}
      </main>
    </div>
  );
}
```

## 📱 Mobile Responsiveness

The sidebar component is fully responsive and adapts to different screen sizes:

- On desktop, the sidebar can be expanded or collapsed
- On mobile devices, the sidebar uses an overlay mode with a semi-transparent backdrop
- The sidebar can be positioned on either the left or right side of the screen

## 🎨 Theming

The sidebar supports comprehensive theming through CSS variables:

- Light and dark themes built-in
- Customizable colors for text, backgrounds, borders, and accents
- Smooth transitions between states

## 🔄 CI/CD

This demo is automatically deployed to GitHub Pages using GitHub Actions whenever changes are pushed to the main branch. The workflow configuration can be found in `.github/workflows/static/sidebar-package.yml`.

## 📄 License

MIT © [Ali Safari](https://github.com/AliSafari-IT)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/AliSafari-IT/asafarim-webapp/issues).

## 📞 Contact

Ali Safari - [@AliSafari_IT](https://twitter.com/AliSafari_IT)

Project Link: [https://github.com/AliSafari-IT/asafarim-webapp](https://github.com/AliSafari-IT/asafarim-webapp)
