import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectsPage from '../pages/ProjectsPage';
import ComponentsPage from '../pages/ComponentsPage';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import SettingsPage from '../pages/SettingsPage';
import DocumentationPage from '../pages/DocumentationPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/*" element={<ProjectsPage />} />
      <Route path="/components/*" element={<ComponentsPage />} />
      <Route path="/docs/*" element={<DocumentationPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/settings/*" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
