import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

const ThemeSettingsPage: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('#646cff');

  const themes = [
    { id: 'light', name: 'Light', description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', description: 'Easy on the eyes for long sessions' },
    { id: 'auto', name: 'Auto', description: 'Follows system preference' }
  ];

  const accentColors = [
    '#646cff', '#007bff', '#28a745', '#17a2b8', 
    '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Theme Settings</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2>Color Theme</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          Choose your preferred color theme for the application.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {themes.map((theme) => (
            <label 
              key={theme.id}
              style={{ 
                display: 'block',
                padding: '1.5rem',
                border: selectedTheme === theme.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'var(--surface)',
                transition: 'border-color 0.2s'
              }}
            >
              <input
                type="radio"
                name="theme"
                value={theme.id}
                checked={selectedTheme === theme.id}
                onChange={(e) => setSelectedTheme(e.target.value)}
                style={{ marginRight: '0.5rem' }}
              />
              <strong>{theme.name}</strong>
              <br />
              <small style={{ color: 'var(--text-secondary)' }}>{theme.description}</small>
            </label>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Accent Color</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          Choose your preferred accent color for buttons, links, and highlights.
        </p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {accentColors.map((color) => (
            <label
              key={color}
              style={{
                display: 'block',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: color,
                cursor: 'pointer',
                border: accentColor === color ? '3px solid var(--text)' : '2px solid var(--border)',
                transition: 'border-color 0.2s'
              }}
            >
              <input
                type="radio"
                name="accentColor"
                value={color}
                checked={accentColor === color}
                onChange={(e) => setAccentColor(e.target.value)}
                style={{ display: 'none' }}
              />
            </label>
          ))}
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Custom Color:
          </label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            style={{ width: '60px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          />
        </div>
      </section>

      <section>
        <h2>Apply Changes</h2>
        <button
          style={{
            padding: '0.75rem 2rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
          onClick={() => console.log('Theme settings saved:', { selectedTheme, accentColor })}
        >
          Save Settings
        </button>
        
        <button
          style={{
            padding: '0.75rem 2rem',
            background: 'transparent',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
          onClick={() => {
            setSelectedTheme('light');
            setAccentColor('#646cff');
          }}
        >
          Reset to Default
        </button>
      </section>
    </div>
  );
};

const PreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    animations: true,
    notifications: true,
    autoSave: true,
    compactMode: false,
    showTooltips: true,
    language: 'en'
  });

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' }
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Preferences</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2>Interface Preferences</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
          {[
            { key: 'animations', label: 'Enable Animations', description: 'Show smooth transitions and animations' },
            { key: 'notifications', label: 'Enable Notifications', description: 'Show in-app notifications and alerts' },
            { key: 'autoSave', label: 'Auto Save', description: 'Automatically save changes as you work' },
            { key: 'compactMode', label: 'Compact Mode', description: 'Use smaller spacing and condensed layouts' },
            { key: 'showTooltips', label: 'Show Tooltips', description: 'Display helpful tooltips on hover' }
          ].map(({ key, label, description }) => (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'var(--surface)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              <div>
                <strong>{label}</strong>
                <br />
                <small style={{ color: 'var(--text-secondary)' }}>{description}</small>
              </div>
              
              <input
                type="checkbox"
                checked={preferences[key as keyof typeof preferences] as boolean}
                onChange={(e) => handlePreferenceChange(key, e.target.checked)}
                style={{ marginLeft: '1rem' }}
              />
            </label>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Language</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Choose your preferred language for the interface.
        </p>
        
        <select
          value={preferences.language}
          onChange={(e) => handlePreferenceChange('language', e.target.value)}
          style={{
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            background: 'var(--surface)',
            fontSize: '1rem',
            minWidth: '200px'
          }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </section>

      <section>
        <h2>Save Preferences</h2>
        <button
          style={{
            padding: '0.75rem 2rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
          onClick={() => console.log('Preferences saved:', preferences)}
        >
          Save Preferences
        </button>
        
        <button
          style={{
            padding: '0.75rem 2rem',
            background: 'transparent',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
          onClick={() => setPreferences({
            animations: true,
            notifications: true,
            autoSave: true,
            compactMode: false,
            showTooltips: true,
            language: 'en'
          })}
        >
          Reset to Default
        </button>
      </section>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  return (
    <Routes>
      <Route index element={
        <div>
          <h1>Settings</h1>
          <p>Customize your application experience.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3>🎨 Theme Settings</h3>
              <p>Customize the appearance and color scheme of the application.</p>
            </div>
            
            <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h3>⚙️ Preferences</h3>
              <p>Configure interface behavior and user experience settings.</p>
            </div>
          </div>
        </div>
      } />
      <Route path="theme" element={<ThemeSettingsPage />} />
      <Route path="preferences" element={<PreferencesPage />} />
    </Routes>
  );
};

export default SettingsPage;
