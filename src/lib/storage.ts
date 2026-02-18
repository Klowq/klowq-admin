import { promises as fs } from 'fs';
import path from 'path';
import { Blog } from '@/types/blog';

const dataDir = path.join(process.cwd(), 'data');
const blogsFile = path.join(dataDir, 'blogs.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Read blogs from file
export async function getBlogs(): Promise<Blog[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(blogsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
}

// Write blogs to file
async function saveBlogs(blogs: Blog[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(blogsFile, JSON.stringify(blogs, null, 2), 'utf-8');
}

// Get a single blog by ID
export async function getBlogById(id: string): Promise<Blog | null> {
  const blogs = await getBlogs();
  return blogs.find(blog => blog.id === id) || null;
}

// Create a new blog
export async function createBlog(blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
  const blogs = await getBlogs();
  const newBlog: Blog = {
    featured: false, // Default to false if not provided
    preferences: [], // Default to empty array if not provided
    ...blogData,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  blogs.push(newBlog);
  await saveBlogs(blogs);
  return newBlog;
}

// Update a blog
export async function updateBlog(id: string, updates: Partial<Omit<Blog, 'id' | 'createdAt'>>): Promise<Blog | null> {
  const blogs = await getBlogs();
  const index = blogs.findIndex(blog => blog.id === id);
  if (index === -1) {
    return null;
  }
  blogs[index] = {
    ...blogs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveBlogs(blogs);
  return blogs[index];
}

// Delete a blog
export async function deleteBlog(id: string): Promise<boolean> {
  const blogs = await getBlogs();
  const filteredBlogs = blogs.filter(blog => blog.id !== id);
  if (filteredBlogs.length === blogs.length) {
    return false; // Blog not found
  }
  await saveBlogs(filteredBlogs);
  return true;
}

