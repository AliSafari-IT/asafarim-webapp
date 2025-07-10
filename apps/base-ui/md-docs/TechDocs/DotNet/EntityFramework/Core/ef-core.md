# Entity Framework Core 

Date Created: 2023-09-31
Date Updated: 2024-12-27

[Entity Framework Core Getting Started](https://docs.microsoft.com/en-us/ef/core/get-started/)

Let's get started with Entity Framework Core by following the steps below:

1. Install the Entity Framework Core tools: `dotnet tool install --global dotnet-ef`
2. Create a new Entity Framework Core project: `dotnet new ef`
3. Add a new database context: `dotnet ef dbcontext scaffold`
4. Add a new migration: `dotnet ef migrations add`
5. Update the database: `dotnet ef database update`

## Create  .NET Core console app that performs data access against a SQLite database using Entity Framework Core

### SQLite EF Core Database Provider

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Sqlite;
using SecureCore.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
```

