# AI Commit Generator

Date: 2025-03-10

## Overview

The AI Commit Generator is a machine learning model that automatically generates commit messages for version control systems.

## Key Features

- **Automated Commit Messages**: Generate concise and descriptive commit messages.
- **Code Integration**: Seamlessly integrate with existing version control workflows.
- **Customization**: Customize the model to match specific project requirements.

## Application

The AI Commit Generator can be applied in various scenarios:

1. **Individual Developers**: Save time and maintain consistent commit messages
2. **Team Projects**: Ensure uniform commit message formatting across team members
3. **Open Source Projects**: Help contributors follow project commit guidelines
4. **Code Review**: Provide clear context for changes during code reviews
5. **Changelog Generation**: Automate creation of project changelogs
6. **Bug Tracking**: Improve traceability of fixes through descriptive messages
7. **CI/CD Pipelines**: Integrate with automated deployment pipelines
8. **Codebase Analysis**: Use commit messages for codebase health monitoring

## How to create a commit message generator

### Step 1: Define Requirements

1. Determine the desired commit message format
2. Identify supported commit types (e.g., feat, fix, chore)
3. Establish character limits and style guidelines

### Step 2: Choose Technology Stack

1. Select programming language (e.g., C#, Python)
2. Choose ML framework (e.g., OpenAI API, TensorFlow)
3. Decide on integration method (CLI, IDE plugin)

### Step 3: Implement Core Features

1. Create git diff parser
2. Develop message generation logic
3. Add template support
4. Implement validation rules

### Step 4: Add Configuration Options

1. Support custom templates
2. Allow model selection
3. Add token limit controls
4. Enable output formatting

### Step 5: Testing and Validation

1. Create test cases for different commit types
2. Validate message quality
3. Test edge cases
4. Perform integration testing

### Step 6: Deployment and Integration

1. Package as CLI tool or IDE extension
2. Create installation instructions
3. Add documentation
4. Set up CI/CD pipeline

## AI Commit Message Generator for .NET C#

### Project Overview

This guide will walk you through creating an AI-powered commit message generator using C# and .NET. The tool will analyze your git changes and generate standardized, descriptive commit messages following your custom template format.

### Step 1: Create a New .NET Console Application

1. Open Visual Studio 2022
2. Select **Create a new project**
3. Choose **Console App**
4. Name your project `AICommitGenerator` and click **Create**

### Step 2: Install Required Packages

1. Install the OpenAI API package. Add the following NuGet package reference to your project:

```bash
    dotnet add package OpenAI
```

2. Install the LibGit2Sharp package. Add the following NuGet package reference to your project:

```bash
    dotnet add package LibGit2Sharp
```

3. Install the Microsoft.Extensions.Configuration packages. Add the following NuGet package references to your project:

```bash
    dotnet add package Microsoft.Extensions.Configuration
    dotnet add package Microsoft.Extensions.Configuration.Json
    dotnet add package Microsoft.Extensions.Configuration.EnvironmentVariables
```

### Step 3: Create Configuration

Create an appsettings.json file in your project root:

```json
{
  "OpenAI": {
    "ApiKey": "YOUR_API_KEY_HERE",
    "Organization": "YOUR_ORG_ID_HERE",
    "DefaultModel": "gpt-3.5-turbo"
  },
  "CommitTemplate": {
    "Format": "<type>(<scope>): <description>",
    "Types": ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
    "MaxLength": 100
  }
}
```

Create a CommitTemplateSettings.cs class to hold your template configuration:

```csharp
namespace AI_Commit_Generator
{
    public class CommitTemplateSettings
    {
        public string Format { get; set; } = "<type>(<scope>): <description>";
        public string[] Types { get; set; } = new[] { "feat", "fix", "docs", "style", "refactor", "test", "chore" };
        public int MaxLength { get; set; } = 100;
    }
}
```

### Step 4: Create the GitService Class

1. Create a new file named `GitService.cs` in your project root to handle git operations:

```csharp
using LibGit2Sharp;
using System.Text;

namespace AI_Commit_Generator
{
    public class GitService
    {
        private readonly string _repositoryPath;

        public GitService(string repositoryPath = null)
        {
            _repositoryPath = repositoryPath ?? Directory.GetCurrentDirectory();
        }

        public string GetGitDiff()
        {
            try
            {
                using var repo = new Repository(_repositoryPath);
                var diff = new StringBuilder();

                // Get file status
                diff.AppendLine("Files changed:");
                foreach (var item in repo.RetrieveStatus())
                {
                    diff.AppendLine($"{item.State}: {item.FilePath}");
                }

                // Get diff summary
                diff.AppendLine("\nSummary:");

                // Get actual diff but limit it
                diff.AppendLine("\nPartial diff:");
                foreach (var change in repo.Diff.Compare<TreeChanges>(repo.Head.Tip.Tree,
                         DiffTargets.Index | DiffTargets.WorkingDirectory))
                {
                    diff.AppendLine($"Changed: {change.Path}");

                    // Only add first 20 lines of each file diff to avoid token limit issues
                    var patch = repo.Diff.Compare<Patch>(repo.Head.Tip.Tree,
                        DiffTargets.Index | DiffTargets.WorkingDirectory,
                        new List<string> { change.Path });

                    var patchLines = patch.Content.Split('\n').Take(20).ToList();
                    foreach (var line in patchLines)
                    {
                        diff.AppendLine(line);
                    }

                    if (patch.Content.Split('\n').Length > 20)
                    {
                        diff.AppendLine("... [diff truncated]");
                    }

                    diff.AppendLine();
                }

                return diff.ToString();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error getting git diff: {ex.Message}");
                return null;
            }
        }

        public bool CreateCommit(string message)
        {
            try
            {
                using var repo = new Repository(_repositoryPath);

                // Create the signature
                var signature = new Signature(
                    new Identity(repo.Config.GetValueOrDefault("user.name", "AI Commit Generator"),
                                repo.Config.GetValueOrDefault("user.email", "ai@example.com")),
                    DateTimeOffset.Now);

                // Create the commit
                repo.Commit(message, signature, signature);
                return true;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error creating commit: {ex.Message}");
                return false;
            }
        }
    }
}
```

### Step 5: Create the OpenAIService Class

This service will handle the interaction with the OpenAI API:

```csharp
using OpenAI_API;
using OpenAI_API.Chat;
using Microsoft.Extensions.Configuration;

namespace AI_Commit_Generator
{
    public class OpenAIService
    {
        private readonly OpenAIAPI _api;
        private readonly CommitTemplateSettings _templateSettings;
        private readonly string _model;

        public OpenAIService(IConfiguration configuration)
        {
            var apiKey = configuration["OpenAI:ApiKey"];
            var org = configuration["OpenAI:Organization"];
            _model = configuration["OpenAI:DefaultModel"] ?? "gpt-3.5-turbo";

            _api = new OpenAIAPI(new APIAuthentication(apiKey, org));

            _templateSettings = new CommitTemplateSettings();
            configuration.GetSection("CommitTemplate").Bind(_templateSettings);
        }

        public async Task<string> GenerateCommitMessageAsync(string diff)
        {
            if (string.IsNullOrEmpty(diff))
            {
                return null;
            }

            var typesList = string.Join(", ", _templateSettings.Types);
            var prompt = $@"Generate a concise, conventional commit message for the following changes.
Use the format: {_templateSettings.Format}
Types: {typesList}
Example: feat(ui): add new login component

Changes:
{diff}";

            try
            {
                var chat = _api.Chat.CreateConversation();
                chat.Model = _model;
                chat.RequestParameters.MaxTokens = _templateSettings.MaxLength;

                chat.AppendUserInput(prompt);

                var response = await chat.GetResponseFromChatbotAsync();

                // Clean the response
                var message = response.Trim('`').Replace("commit message:", "").Trim();
                return message;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error generating commit message: {ex.Message}");

                // Implement retry logic here if needed

                return null;
            }
        }
    }
}
```

### Step 6: Create the Main Program

Now, let's set up the main Program.cs file:

```csharp
using Microsoft.Extensions.Configuration;
using System.Reflection;

namespace AI_Commit_Generator
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // Setup configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            // Create services
            var gitService = new GitService();
            var openAIService = new OpenAIService(configuration);

            // Get the git diff
            var diff = gitService.GetGitDiff();

            if (string.IsNullOrEmpty(diff))
            {
                Console.WriteLine("No changes to commit.");
                return;
            }

            Console.WriteLine("Analyzing your changes...");

            // Generate commit message
            var commitMessage = await openAIService.GenerateCommitMessageAsync(diff);

            if (string.IsNullOrEmpty(commitMessage))
            {
                Console.WriteLine("Failed to generate commit message.");
                return;
            }

            Console.WriteLine("\nGenerated Commit Message:");
            Console.WriteLine(commitMessage);

            // Ask user if they want to use the generated message
            Console.Write("\nDo you want to use this commit message? (Y/n): ");
            var response = Console.ReadLine()?.ToLower() ?? "y";

            if (response == "y" || response == "")
            {
                // Create the commit
                var success = gitService.CreateCommit(commitMessage);

                if (success)
                {
                    Console.WriteLine("Commit created successfully!");
                }
                else
                {
                    Console.WriteLine("Failed to create commit.");
                }
            }
            else
            {
                Console.WriteLine("Commit canceled.");
            }
        }
    }
}
```

### Step 7: Build and Run

1. Build the project:

````bash
dotnet build

2. Run the application:
```bash
dotnet run
````

### Step 8: Create a Global Tool (Optional)

To make your tool available globally on your system:

1. Modify your project file (.csproj) to include:

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net6.0</TargetFramework>
    <RootNamespace>AI_Commit_Generator</RootNamespace>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>

    <!-- Add these lines for global tool -->
    <PackAsTool>true</PackAsTool>
    <ToolCommandName>git-ai-commit</ToolCommandName>
    <PackageOutputPath>./nupkg</PackageOutputPath>
    <Version>1.0.0</Version>
  </PropertyGroup>

  <!-- Your package references here -->

</Project>
```

2. Pack and install:

```bash
dotnet pack
dotnet tool install --global --add-source ./nupkg AI-Commit-Generator
```

3. Use the tool:

```bash
git-ai-commit
```

### Customizing Your Commit Template

You can modify the CommitTemplate section in the appsettings.json file to change:

- Format: The structure of your commit messages
- Types: The allowed types of commits
- MaxLength: Maximum length for generated commit messages

Example for a different template format:

```json
    "CommitTemplate": {
      "Format": "[<type>] <scope>: <description>",
      "Types": ["FEATURE", "BUGFIX", "DOCS", "STYLE", "REFACTOR", "TEST", "CHORE"],
      "MaxLength": 120
    }
```

### Advanced Features to Implement

1. **Multiple Model Support**: 
   - Add ability to choose between different OpenAI models
   - Implement model performance comparison
   - Add fallback models for reliability

2. **Custom Templates**:
   - Allow loading different templates for different projects
   - Add template validation
   - Implement template versioning

3. **Offline Mode**:
   - Add ability to generate simpler commit messages without API access
   - Implement basic pattern matching
   - Add offline template support

4. **IDE Integration**:
   - Create Visual Studio extension
   - Develop VS Code plugin
   - Add IDE configuration options

### Troubleshooting Guide

1. **API Key Issues**:
   - Verify API key in appsettings.json
   - Check for environment variable overrides
   - Validate API key permissions

2. **Git Repository Issues**:
   - Ensure valid Git repository
   - Verify Git installation
   - Check repository permissions

3. **Permission Issues**:
   - Validate write access to repository
   - Check Git configuration
   - Verify file system permissions

4. **Rate Limiting**:
   - Implement exponential backoff
   - Add rate limit monitoring
   - Include retry mechanism

### Resources and References

- [OpenAI API Documentation](https://platform.openai.com/docs/introduction)
- [LibGit2Sharp Documentation](https://github.com/libgit2/libgit2sharp)
- [Conventional Commits Standard](https://www.conventionalcommits.org/en/v1.0.0/)
