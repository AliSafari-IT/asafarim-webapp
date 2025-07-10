# Features List of ASafariM.Project/Task Manager App

Date: 22 Nov 2024
Updated: 22 Nov 2024

## **1. General Features**

- **Responsive Design**: Ensure the app is mobile-friendly and responsive on all devices.
- **Dark/Light Mode**: Support for theme switching.
- **Role-Based Navigation**:
  - **Guest Users**: Limited access to pages like GuestHomePage, ContactPage, PrivacyPage, and AnnouncementPage.
  - **Logged-In Users**: Full access to UserHomePage, TasksPage, ProjectsPage, AccountPage, and other user-specific pages.
  - **Admins**: Access to admin-specific controls and features.

---

## **2. Pages and Their Features**

### **1. GuestHomePage**

- Public landing page with:
  - Welcome message and site overview.
  - Call-to-action buttons for registration and login.
  - Links to ContactPage, PrivacyPage, and AnnouncementPage.
  - List of public announcements (from AnnouncementPage).

### **2. UserHomePage**

- Personalized dashboard for logged-in users:
  - Overview of assigned tasks and projects.
  - Notifications (e.g., new assignments or updates).
  - Recent activities (e.g., timeline events, comments).
  - Quick links to manage tasks and projects.

### **3. ContactPage**

- Public contact form:
  - Fields: Name, Email, Subject, and Message.
  - Backend integration for storing/sending messages via email.
  - CAPTCHA or spam protection.

### **4. PrivacyPage**

- Public page with:
  - Privacy policy and terms of service.
  - FAQ section regarding data handling.

### **5. AnnouncementPage**

- Public announcements page:
  - List of announcements (e.g., new features, updates).
  - Admin panel for creating/editing announcements.
  - Pagination for long lists of announcements.

### **6. TasksPage**

- Tasks management page for logged-in users:
  - List of tasks (with filters: public/private, status, priority).
  - CRUD operations for tasks.
  - Task dependency visualization (for dependent tasks).
  - Toggle for task privacy (visible to creator and admins).
  - Ability to attach files to tasks.

### **7. ProjectsPage**

- Projects management page for logged-in users:
  - List of projects (with filters: status, tags, due dates).
  - CRUD operations for projects.
  - Add tech stack information to projects.
  - View associated tasks with inline editing.

### **8. AccountPage**

- Multi-section page:
  - **Register**: Registration form for new users with validation.
  - **Login**: Secure login form with JWT authentication.
  - **UserProfile**: Edit user profile (name, email, password, preferences).

### **9. TimelinePage**

- Track activities in a vertical timeline:
  - Changes to tasks and projects.
  - Comments and file uploads.
  - Filter by date range or user actions.
  - Responsive design for mobile users.

### **10. SettingsPage**

- User-specific settings:
  - Update notification preferences (email, push notifications).
  - Change theme (light/dark).
  - Manage account security (password reset, 2FA).

### **11. AdminDashboardPage**

- Admin-specific controls:
  - View all users, projects, and tasks.
  - Assign/reassign tasks to any user.
  - Manage roles and permissions.
  - Approve or reject user registrations (optional).

---

## **3. Core Functionalities**

### **Authentication**

- JWT-based secure authentication.
- Role-based access control (guest, user, admin).
- Social login options (e.g., Google, GitHub).

### **Authorization**

- Public pages (accessible by anyone).
- Restricted pages (accessible based on roles).

### **Task Management**

- Full CRUD operations for tasks.
- Task privacy (public/private toggle).
- Admin-controlled task assignments.

### **Project Management**

- CRUD operations for projects.
- Associate tasks, tags, and tech stacks with projects.

### **Timeline**

- Log all significant activities (task updates, comments, file uploads).
- Filter by action type or date range.

### **Notifications**

- Real-time notifications for:
  - Task assignment and updates.
  - New project creation.
  - Announcements.

### **Tags and Categorization**

- Tag management for projects and tasks.
- Filters for tasks and projects based on tags.

### **File Attachments**

- Upload and manage files for tasks and comments.

### **Admin Controls**

- Manage users, roles, and permissions.
- Control task assignments for all projects.

---

## **4. Additional Features**

### **Performance and Optimization**

- Lazy loading for pages with large datasets (e.g., TasksPage, ProjectsPage).
- Caching for frequently accessed data.

### **Accessibility**

- Keyboard navigation and screen reader support.
- High contrast mode for accessibility.

### **Audit Logs**

- Track user actions for accountability.

Date: 22 Nov 2024.
