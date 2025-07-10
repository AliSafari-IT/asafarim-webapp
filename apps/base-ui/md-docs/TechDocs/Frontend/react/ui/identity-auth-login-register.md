# Using Microsoft Identity for Register and Login in React TypeScript with ASP.NET Core

Date: 2024-09-11 
Updated: 2024-12-15 20:04:00

## Overview
This document guides you through implementing a Register and Login feature using Microsoft Identity in a React TypeScript frontend with an ASP.NET Core backend. The guide covers backend and frontend configurations, required code, and testing the implementation.

---

## Backend: ASP.NET Core

### Step 1: Set Up ASP.NET Core Project
1. **Create a new project:**
   ```bash
   dotnet new webapi -n IdentityAuthApp
   cd IdentityAuthApp
   ```

2. **Add Microsoft Identity packages:**
   ```bash
   dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
   dotnet add package Microsoft.AspNetCore.Identity.UI
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer
   ```

3. **Create a database connection:** Update `appsettings.json` with your database connection string:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=IdentityAuthDb;User=yourUser;Password=yourPassword;"
   }
   ```

### Step 2: Configure Identity in `Program.cs`
```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using IdentityAuthApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddDefaultIdentity<IdentityUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
})
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

### Step 3: Create the `ApplicationDbContext`
Create a new folder `Data` and add `ApplicationDbContext.cs`:
```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace IdentityAuthApp.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
```

### Step 4: Add Migration and Update Database
Run the following commands to create the database schema:
```bash
dotnet ef migrations add InitialCreate

# Apply migrations
dotnet ef database update
```

### Step 5: Create API Endpoints for Authentication
Add a `Controllers` folder and create an `AuthController.cs` file:

```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IdentityAuthApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var user = new IdentityUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok("User created successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (!result.Succeeded)
                return Unauthorized("Invalid login attempt");

            return Ok("Login successful");
        }
    }

    public class RegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
```

---

## Frontend: React TypeScript

### Step 1: Set Up React Project
1. **Create a new React app:**
   ```bash
   npx create-react-app identity-auth-client --template typescript
   cd identity-auth-client
   ```

2. **Install Axios for API calls:**
   ```bash
   yarn add axios
   ```

### Step 2: Create Authentication Services
In the `src` folder, create a file `authService.ts`:

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};
```

### Step 3: Create Login and Register Pages

#### Register.tsx
```tsx
import React, { useState } from 'react';
import { register } from '../authService';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(email, password);
      alert(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
```

#### Login.tsx
```tsx
import React, { useState } from 'react';
import { login } from '../authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      alert(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
```

### Step 4: Add Routing
Install React Router:
```bash
yarn add react-router-dom
```

Update `src/App.tsx`:
```tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
```

---

## Testing
1. **Run the backend:**
   ```bash
   dotnet run
   ```

2. **Run the frontend:**
   ```bash
   yarn start
   ```

3. **Test the endpoints:**
   - Navigate to `/register` to create a new user.
   - Navigate to `/login` to log in with the registered user.

---

## Conclusion
By following these steps, you have implemented user registration and login using Microsoft Identity in a fullstack React TypeScript and ASP.NET Core application. Ensure you secure your APIs with proper authentication and authorization for production use.

