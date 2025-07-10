# Resolving Migrations Assembly Mismatch in .NET Core with EF

Date: 2023-08-31


Documentation for resolving migrations assembly mismatch in .NET Core with Entity Framework Core (EF).

## Problem

When working with Entity Framework Core (EF), you may encounter an error during migration or database update, such as:
```

Your target project 'ASafariM.Server' doesn't match your migrations assembly 'SecureCore'. Either change your target project or change your migrations assembly.
Change your migrations assembly by using DbContextOptionsBuilder. E.g. options.UseSqlServer(connection, b => b.MigrationsAssembly("Infrastructure")). By default, the migrations assembly is the assembly containing the DbContext.

````

This happens when your project is trying to apply migrations from a different assembly than the one you're targeting. In this solution, we will address how to resolve this issue.

## Solution Overview

### Step 1: Set the Correct Migrations Assembly in `DbContext`
The first step is to ensure that your `DbContext` is correctly configured to use the correct migrations assembly. When using `AddDbContext`, you need to specify the `MigrationsAssembly` explicitly if the `DbContext` resides in a different project than the one where the migrations should be applied.

#### Example:

In your `ApplicationDbContext`, set the migrations assembly explicitly like this:

```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecureCore.Models;
using Domain.Entities;

namespace SecureCore.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var sv = ServerVersion.AutoDetect("DefaultConnection");

                optionsBuilder
                    .UseMySql("DefaultConnection", sv,
                        options => options.MigrationsAssembly("SecureCore"));  // Set migrations assembly explicitly
            }
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; }
    }
}
````

In the above code, we are explicitly setting the migrations assembly to `SecureCore` which contains the migration logic.

### Step 2: Run the Migration with the Correct Parameters

When running the migration command, make sure to specify the correct context and project paths.

From the `ASafariM.Server` directory, use the following command to add the migration:

```bash
dotnet ef migrations add UpdateTaskItemTable --context ApplicationDbContext --startup-project 'E:\asm-fs\apps\backends\ASafariM.Server\ASafariM.Server.csproj' --project 'E:\asm-fs\libs\SecureCore\SecureCore.csproj'
```

### Step 3: Apply the Migration to the Database

Once the migration is successfully added, apply it to the database using the following command:

```bash
dotnet ef database update --context ApplicationDbContext --startup-project 'E:\asm-fs\apps\backends\ASafariM.Server\ASafariM.Server.csproj' --project 'E:\asm-fs\libs\SecureCore\SecureCore.csproj'
```

This ensures the migration is correctly applied to the database.

### Key Takeaways:

1. **Migrations Assembly**: Ensure your `DbContext` specifies the correct migrations assembly using the `MigrationsAssembly` option in `OnConfiguring`.
2. **Targeting Correct Project**: When running `dotnet ef` commands, specify the correct `--context`, `--startup-project`, and `--project` parameters to avoid project mismatches.
3. **Connection Strings**: Ensure your connection string is properly set either in `appsettings.json` or through environment variables.

### Conclusion

By following these steps, you should be able to resolve the migrations assembly mismatch error and successfully apply migrations to your database in .NET Core. Make sure to double-check the project paths and configurations to ensure everything aligns correctly across different projects in your solution.

### How to Use This Article:
- **Save it as a markdown file** (e.g., `Resolving_Migrations_Assembly_Mismatch.md`) for future reference.
- **Customize** any specific paths or details related to your project structure if needed.

