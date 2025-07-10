# EF-Test MD file

date: 2023-08-31

## EF-Test MD file rendering

This is a test for EF-Test MD file rendering.

```csharp
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecureCore.Models;

namespace SecureCore.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
    }
}
```

```bash
dotnet ef migrations add InitialCreate --context ApplicationDbContext --project 'E:\asm-fs\libs\SecureCore\SecureCore.csproj'
```

```bash
dotnet ef database update --context ApplicationDbContext --project 'E:\asm-fs\libs\SecureCore\SecureCore.csproj'
```

---