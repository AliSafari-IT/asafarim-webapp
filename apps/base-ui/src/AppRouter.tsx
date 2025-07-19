import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DocumentationPage from "./pages/DocumentationPage";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ComponentsPage from "./pages/ComponentsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SettingsPage from "./pages/SettingsPage";

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/projects/*" element={<ProjectsPage />} />
        <Route path="/components/*" element={<ComponentsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/settings/*" element={<SettingsPage />} />
        <Route path="/docs/*" element={<DocumentationPage />} />
      </Routes>
    </Router>
  );
};
