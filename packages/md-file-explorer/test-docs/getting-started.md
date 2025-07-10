---
title: "Getting Started"
description: "A comprehensive guide to getting started with our platform"
author: "Ali Safari"
tags: ["guide", "tutorial", "beginner"]
date: "2025-01-10"
---

# Getting Started Guide

Welcome to our platform! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- Basic knowledge of TypeScript
- A text editor or IDE

## Installation

```bash
npm install @asafarim/md-file-explorer
```

## Quick Start

Here's a simple example to get you started:

```typescript
import { MdFileExplorer } from '@asafarim/md-file-explorer'

const explorer = new MdFileExplorer('./docs')
const result = await explorer.scanDirectory()
console.log(result)
```

## Next Steps

- Check out the [Advanced Features](./advanced.md)
- Read the [API Reference](../api/reference.md)
- Browse [Examples](../examples/)
