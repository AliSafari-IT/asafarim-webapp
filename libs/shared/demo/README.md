# Demo Development

This directory contains the demo application for the @asafarim/shared component library.

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open your browser to [http://localhost:5173/shared/](http://localhost:5173/shared/)

## Building for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

## Project Structure

```
demo/
├── src/
│   ├── components/
│   │   ├── Overview.tsx          # Main overview page
│   │   └── PackageLinksDemo.tsx  # PackageLinks component demo
│   ├── App.tsx                   # Main app component with routing
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── package.json                  # Demo dependencies
├── tsconfig.json                 # TypeScript config
├── tsconfig.node.json            # Node TypeScript config
└── vite.config.ts                # Vite configuration
```

## Adding New Component Demos

1. Create a new demo component in `src/components/`
2. Add the route to `App.tsx`
3. Add navigation link to the Navigation component
4. Follow the pattern established by `PackageLinksDemo.tsx`

## Features

- 🚀 Vite for fast development and building
- 📱 Responsive design
- 🎨 Dark theme with modern styling
- 🔗 React Router for navigation
- 📝 Live code examples with syntax highlighting
- 📊 Component prop documentation tables
- ♿ Accessible navigation and content
