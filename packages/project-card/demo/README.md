# ProjectCard Demo

This demo showcases the capabilities of the `@asafarim/project-card` component.

## 🚀 Features Demonstrated

- **Theme Support**: Switch between light and dark themes
- **Responsive Design**: Works on all device sizes
- **Status Indicators**: Active, archived, and in-progress states
- **Loading States**: Beautiful loading animations
- **Featured Cards**: Special styling for important projects
- **Tech Stack Display**: With icons and colors
- **Multiple Link Types**: Demo, repo, documentation, and custom links
- **Click Handlers**: Interactive card behavior
- **TypeScript Support**: Full type safety

## 📋 Running the Demo

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the parent package:
   ```bash
   cd ..
   npm run build
   ```

3. Start the demo:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3001`

## 🎯 What You'll See

- **Live Examples**: Multiple project cards with different configurations
- **Interactive Features**: Click cards to see event handlers
- **Theme Switching**: Toggle between light and dark modes
- **Loading Demo**: See the loading state animation
- **Featured Cards**: Special styling for highlighted projects
- **Code Examples**: Usage examples and installation instructions

## 🔧 Customization Examples

The demo shows various customization options:

- Different status types (active, archived, in-progress)
- Featured vs regular cards
- With and without images
- Various tech stack configurations
- Different link types and labels
- Custom descriptions and truncation
- Theme variations

## 📦 Component Props

All available props are demonstrated in the live examples:

- `title` - Project title
- `description` - Project description
- `image` - Project image URL
- `techStack` - Array of technologies with colors and icons
- `links` - Array of project links (demo, repo, docs, custom)
- `currentTheme` - Light or dark theme
- `featured` - Featured card styling
- `status` - Project status indicator
- `isLoading` - Loading state
- `onCardClick` - Click handler
- `maxDescriptionLength` - Description truncation
- `showTechStackIcons` - Show/hide tech stack icons
- `lastUpdated` - Last update date
- `className` - Custom CSS classes

## 🎨 Styling

The demo includes custom CSS that works alongside the component's built-in styles, demonstrating how to:

- Create responsive layouts
- Implement theme switching
- Add custom animations
- Style container layouts
- Create feature showcases

This demo serves as both a showcase and a reference implementation for using the ProjectCard component in real applications.
