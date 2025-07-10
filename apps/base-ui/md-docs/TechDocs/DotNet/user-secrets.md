# User Secrets

Date: 2024-09-11 
Updated: 2024-12-15

User secrets are a secure way to store sensitive information, such as database connection strings or API keys, in your ASP.NET Core application.

To add user secrets to your ASP.NET MVC application, follow these steps:

### Step 1: Add the User Secrets Tool
Ensure the `Microsoft.Extensions.Configuration.UserSecrets` package is included in your project. Add it via NuGet Package Manager or using the following command in the **Package Manager Console**:

```bash
Install-Package Microsoft.Extensions.Configuration.UserSecrets
```

Alternatively, if you're using the .NET CLI:

```bash
dotnet add package Microsoft.Extensions.Configuration.UserSecrets
```

### Step 2: Enable User Secrets in Your Project
1. Edit your `.csproj` file and add the `<UserSecretsId>` property inside a `<PropertyGroup>`:

```xml
<PropertyGroup>
  <UserSecretsId>your-app-unique-guid</UserSecretsId>
</PropertyGroup>
```

Replace `your-app-unique-guid` with a unique value, such as a GUID.

To generate a GUID, use the .NET CLI:

```bash
dotnet new guid
```

### Step 3: Initialize User Secrets
Run the following command in the terminal at the project root to initialize user secrets:

```bash
dotnet user-secrets init
```

### Step 4: Add Secrets
Use the following command to add a secret:

```bash
dotnet user-secrets set "YourSecretKey" "YourSecretValue"
```

Repeat this for all the secrets you need.

### Step 5: Access User Secrets in Code
1. Add the `Microsoft.Extensions.Configuration` namespace in your application:

   ```csharp
   using Microsoft.Extensions.Configuration;
   ```

2. Configure your application to load user secrets in `Program.cs` or `Startup.cs`:

   - For **Program.cs** (minimal hosting model in .NET 6+):
     ```csharp
     var builder = WebApplication.CreateBuilder(args);
     
     builder.Configuration.AddUserSecrets<Program>();

     var app = builder.Build();
     ```

   - For **Startup.cs** (traditional hosting model):
     ```csharp
     public Startup(IConfiguration configuration)
     {
         var builder = new ConfigurationBuilder()
             .AddUserSecrets<Startup>();

         Configuration = builder.Build();
     }

     public IConfiguration Configuration { get; }
     ```

3. Access the secret values:
   ```csharp
   var secretValue = Configuration["YourSecretKey"];
   Console.WriteLine($"Secret Value: {secretValue}");
   ```

### Step 6: Verify Secrets
Run your application and ensure the secrets are loaded and used correctly.

### Notes:
- **Local Scope Only:** User secrets are not meant for production. They are stored in a JSON file on your local machine (e.g., `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>` on Windows).
- **Security Best Practices:** Never commit secrets directly into your source control. Use a configuration like Azure Key Vault or AWS Secrets Manager for production environments.