# ASafariM Web Application

A microservices-based web application with a modern architecture.

## Project Overview

The ASafariM web application is structured as a microservices architecture with the following components:

### Backend Services

1. **Projects API** (ASP.NET Core 8.0)
   - Uses Entity Framework Core with MySQL
   - Components:
     - Projects.Api (Web API)
     - Projects.Application (Business logic)
     - Projects.Domain (Entities)
     - Projects.Infrastructure (Data access)
   - Required NuGet packages:
     - Microsoft.EntityFrameworkCore
     - Pomelo.EntityFrameworkCore.MySql
     - DotNetEnv
     - Swashbuckle.AspNetCore

2. **Gateway API** (ASP.NET Core 9.0)
   - Acts as an API gateway for the microservices

### Database

- **MySQL Database** (v8.3)
  - Database name: asafarimDB
  - Default exposed port: 3307

### Documentation

The project includes several documentation directories:

- `apps/base-ui/md-docs/` - Contains legal and technical documentation
- `apps/docs-server/` - Custom documentation server
- Various markdown documentation in packages, particularly in the markdown-explorer-viewer component

### Frontend Packages

The application includes several frontend packages:

- `display-code`: Code display component
- `markdown-explorer-viewer`: Markdown viewing component
- `md-file-explorer`: Markdown file explorer
- `paginated-project-grid`: Project grid with pagination
- `project-card`: Project card component
- `sidebar`: Sidebar navigation component

## Development Environment

### Prerequisites

- Node.js
- .NET SDK 8.0 or higher

### Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd asafarim-webapp
   ```

2. Set up and run the services according to their individual documentation in the respective directories.

## Project Structure

```tree
asafarim-webapp/
├── apps/
│   └── base-ui/         # Main UI application
├── libs/
│   ├── md-server/       # Markdown server library
│   ├── shared/          # Shared components and utilities
│   └── tools/           # Development tools
└── packages/            # Frontend packages
    ├── display-code/
    ├── markdown-explorer-viewer/
    ├── md-file-explorer/
    ├── paginated-project-grid/
    ├── project-card/
    └── sidebar/
```

## Documentation

For more detailed documentation, please refer to the documentation site running at <http://localhost:3000> when the services are up.

## License

[Add your license information here]
