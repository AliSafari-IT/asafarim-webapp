# Creating a Modern User Account UI in React TypeScript

Date: 2024-11-10 
Updated: 2024-12-15

A step-by-step guide to building a responsive and theme-aware user account settings interface.

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Component Implementation](#component-implementation)
5. [Styling with Tailwind CSS](#styling)
6. [State Management](#state-management)
7. [Theme Support](#theme-support)
8. [Best Practices](#best-practices)

## Introduction

A well-designed user account interface is crucial for any modern web application. This guide will walk you through creating a responsive, accessible, and theme-aware account settings page using React and TypeScript.

## Prerequisites

- React 18+
- TypeScript 4.5+
- Tailwind CSS 3+
- React Icons (or any icon library)

```bash
npm install react-icons @types/react
```

## Project Structure

```plaintext
src/
  ├── components/
  │   └── AccountSettings/
  │       ├── AccountSettings.tsx
  │       └── types.ts
  ├── services/
  │   └── authService.ts
  └── styles/
      └── index.css
```

## Component Implementation

### 1. Define TypeScript Interfaces

```typescript
// types.ts
export interface UserData {
  email: string;
  userName: string;
}

export interface AccountSettingsProps {
  initialData?: UserData;
  onUpdate?: (data: Partial<UserData>) => Promise<void>;
}
```

### 2. Create the Main Component

```typescript
// AccountSettings.tsx
import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaUser, FaLock, FaKey } from 'react-icons/fa';
import type { AccountSettingsProps } from './types';

const AccountSettings: React.FC<AccountSettingsProps> = ({ initialData, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'username' | 'password'>('email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    userName: initialData?.userName || '',
    currentPassword: '',
    newPassword: '',
  });

  // ... rest of the implementation
};
```

### 3. Implement Navigation

```typescript
const Navigation = ({ activeTab, onTabChange }) => (
  <nav className="space-y-2">
    <button 
      onClick={() => onTabChange('email')} 
      className={`flex items-center gap-3 px-6 py-3 rounded-lg w-full
        ${activeTab === 'email' 
          ? 'bg-primary/10 text-primary border-l-4 border-primary' 
          : 'hover:bg-gray-100 text-gray-600'
        }`}
    >
      <FaEnvelope className="text-xl" />
      <span>Email Settings</span>
    </button>
    {/* Similar buttons for username and password */}
  </nav>
);
```

### 4. Create Form Components

```typescript
const EmailForm = ({ email, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Email Address
      </label>
      <div className="relative">
        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          value={email}
          onChange={onChange}
          className="w-full p-3 pl-12 rounded-lg border focus:ring-2"
          required
        />
      </div>
    </div>
    <button 
      type="submit" 
      disabled={loading}
      className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-white"
    >
      {loading ? 'Updating...' : 'Update Email'}
    </button>
  </form>
);
```

## Styling

We use Tailwind CSS for styling our components. Here are some key styling patterns:

### 1. Responsive Design

```typescript
const Layout = ({ children }) => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-[240px,1fr] gap-8">
      {children}
    </div>
  </div>
);
```

### 2. Theme-Aware Styling

```typescript
const Card = ({ children }) => (
  <div className="
    bg-white dark:bg-gray-900 
    rounded-xl shadow-sm p-6 
    border border-gray-200 dark:border-gray-700
  ">
    {children}
  </div>
);
```

### 3. Interactive Elements

```typescript
const Button = ({ children, ...props }) => (
  <button 
    className="
      px-8 py-3 rounded-lg
      bg-gradient-to-r from-primary to-primary-dark
      text-white font-medium
      transition-all duration-300
      hover:shadow-lg hover:scale-[1.02]
      disabled:opacity-50 disabled:cursor-not-allowed
    "
    {...props}
  >
    {children}
  </button>
);
```

## State Management

### 1. Form State Handling

```typescript
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: keyof typeof formData
) => {
  setFormData(prev => ({
    ...prev,
    [field]: e.target.value
  }));
};
```
