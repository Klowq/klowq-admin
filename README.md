# Klowq Admin - Blog Management System

A Next.js application for managing blog posts with full CRUD functionality and authentication.

## Features

- **Authentication**: Secure login system protecting all routes
- Create new blog posts
- Update existing blog posts
- Delete blog posts
- List all blog posts

## Getting Started

First, install the dependencies:

```bash
npm install
```

Create a `.env.local` file in the root directory (you can copy from `.env.local.example`):

```bash
ADMIN_EMAIL=admin@klowq.com
ADMIN_PASSWORD=admin123
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

**Important**: Change the default credentials in production! Generate a secure `NEXTAUTH_SECRET` using:
```bash
openssl rand -base64 32
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. You'll be redirected to the login page.

## Default Credentials

- **Email**: admin@klowq.com
- **Password**: admin123

⚠️ **Change these credentials in production!**

## Project Structure

- `/src/app` - Next.js App Router pages
- `/src/app/api/blogs` - API routes for blog operations (protected)
- `/src/app/api/auth` - NextAuth.js authentication routes
- `/src/app/login` - Login page
- `/src/auth.ts` - NextAuth.js configuration
- `/src/middleware.ts` - Route protection middleware
- `/src/types` - TypeScript type definitions
- `/src/lib` - Utility functions and data storage
- `/src/components` - React components

## Authentication

All routes are protected by default. Users must log in to:
- View the blog list
- Create, update, or delete blog posts
- Access any API endpoints

The authentication system uses NextAuth.js v5 with JWT sessions.

