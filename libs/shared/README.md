# @asafarim/shared

[![npm version](https://img.shields.io/npm/v/@asafarim/shared?color=4dabf7&label=npm)](https://www.npmjs.com/package/@asafarim/shared)
[![GitHub stars](https://img.shields.io/github/stars/AliSafari-IT/shared?style=social)](https://github.com/AliSafari-IT/shared)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **A modern collection of reusable React components and utilities for ASafariM web applications.**

---

## 🚀 Quick Install

```sh
pnpm add @asafarim/shared
# or
npm install @asafarim/shared
```

---

## 🌐 Live Demo & Documentation

- **Live Demo:** [alisafari-it.github.io/shared](https://alisafari-it.github.io/shared/)
- **Source:** [github.com/AliSafari-IT/shared](https://github.com/AliSafari-IT/shared)

Explore all components with interactive examples and prop documentation.

---

## 🧩 Components

### `PackageLinks`
A flexible component for displaying links to an npm package, GitHub repository, and live demo.

#### Usage
```tsx
import { PackageLinks } from '@asafarim/shared';

function App() {
  return (
    <PackageLinks
      packageName="@asafarim/display-code"
      githubPath="packages/display-code"
      demoPath="packages/display-code"
    />
  );
}
```

#### Props
| Prop         | Type   | Required | Description                                                        |
|--------------|--------|----------|--------------------------------------------------------------------|
| packageName  | string | Yes      | The npm package name (e.g., `@asafarim/display-code`)              |
| githubPath   | string | Yes      | Path to the package in the GitHub repo (e.g., `packages/display-code`) |
| demoPath     | string | No       | Path to the demo in GitHub Pages (e.g., `packages/display-code`)   |

---

## 🛠️ Development

### Build the Library
```sh
pnpm install
pnpm build
```

### Run the Demo App
```sh
# Install demo dependencies
pnpm demo:install

# Start demo in dev mode
pnpm demo:dev

# Build demo for production
pnpm demo:build

# Preview production build
pnpm demo:preview
```

---

## 📁 Project Structure

```
shared/
├── src/            # Library source code
│   ├── components/ # React components
│   ├── styles/     # Global styles
│   ├── index.ts    # Entry point
│   └── types.d.ts  # Types
├── demo/           # Demo app (Vite + React)
│   ├── src/
│   └── dist/
├── dist/           # Built library
├── package.json
├── rollup.config.js
└── tsconfig.json
```

---

## 🚢 Deployment

- The demo is auto-deployed to **GitHub Pages** on every push to `main`.
- Workflow: Build library → Build demo → Deploy to [https://alisafari-it.github.io/shared/](https://alisafari-it.github.io/shared/)

---

## 📄 License

MIT © [AliSafari-IT](https://github.com/AliSafari-IT)
