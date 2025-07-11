# @asafarim/shared

A collection of shared components and utilities for ASafariM web applications.

## Components

### PackageLinks

A reusable component for displaying links to npm package, GitHub repository, and live demo.

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

| Prop | Type | Description |
|------|------|-------------|
| packageName | string | The npm package name (e.g., "@asafarim/display-code") |
| githubPath | string | The path to the package in the GitHub repository (e.g., "packages/display-code") |
| demoPath | string (optional) | The path to the demo in the GitHub Pages deployment (e.g., "packages/display-code") |
