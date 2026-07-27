import axios from "axios";
import type { BlogPost } from "../types/blog";
import type { User } from "../types/user";

const getBaseApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // When running in production on Vercel or non-localhost, default to relative "/api"
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "/api";
  }
  return "http://localhost:5000/api";
};

const API_URL = getBaseApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject Bearer token from localStorage automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("blogmind_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface PaginatedPosts {
  posts: BlogPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const authApi = {
  async signup(data: Omit<User, "id"> & { password?: string }): Promise<{ token: string; user: User }> {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  async login(data: { email: string; password?: string }): Promise<{ token: string; user: User }> {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get("/auth/me");
    return response.data;
  },

  async updateProfile(data: { name?: string; email?: string; password?: string }): Promise<{ token: string; user: User }> {
    const response = await api.put("/auth/update", data);
    return response.data;
  },
};

export const postApi = {
  async getPosts(params?: { page?: number; limit?: number; search?: string; tag?: string }): Promise<PaginatedPosts> {
    const response = await api.get("/posts", { params });
    return response.data;
  },

  async getMyPosts(): Promise<BlogPost[]> {
    const response = await api.get("/posts/my-posts");
    return response.data;
  },

  async getPostById(id: string): Promise<BlogPost> {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  async createPost(data: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "views" | "readingTime" | "author">): Promise<BlogPost> {
    const response = await api.post("/posts", data);
    return response.data;
  },

  async updatePost(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  async deletePost(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  async reportPost(id: string, reason: string): Promise<{ reported: boolean; deleted: boolean; message: string }> {
    const response = await api.post(`/posts/${id}/report`, { reason });
    return response.data;
  },
};

export const aiApi = {
  async summarize(content: string): Promise<{ summary: string }> {
    try {
      const response = await api.post("/ai/summarize", { content });
      return response.data;
    } catch (error) {
      console.warn("Backend AI summarize failed, using client fallback:", error);
      const cleanText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
      const summary = sentences.slice(0, 3).join(" ").trim() || cleanText.slice(0, 150);
      return { summary };
    }
  },

  async correct(content: string): Promise<{ correctedText: string }> {
    try {
      const response = await api.post("/ai/correct", { content });
      return response.data;
    } catch (error) {
      console.warn("Backend AI correct failed, using client fallback:", error);
      return { correctedText: content };
    }
  },

  async seedPost(): Promise<{ title: string; content: string; tags: string[] }> {
    try {
      const response = await api.post("/ai/seed");
      return response.data;
    } catch (error) {
      console.warn("Backend AI seed request failed, using client fallback article:", error);
      const fallbackArticles = [
        {
          title: "Mastering React 19: Server Actions, Hooks, and Next-Gen Rendering",
          content: `<h2>The Evolution of Modern React</h2><p>React 19 brings some of the most dramatic upgrades to front-end developer experience in years. With built-in support for <strong>Server Actions</strong>, <code>useActionState</code>, and <code>useOptimistic</code>, the boundary between client and server data flow is smoother than ever.</p><h2>Key Capabilities to Harness</h2><ul><li><strong>Server Actions:</strong> Execute asynchronous server-side functions directly from form submissions.</li><li><strong>Optimistic UI Updates:</strong> Deliver instantaneous feedback to users while mutations resolve in the background.</li></ul><blockquote>"Declarative UI development in React is about seamless server-client synergy."</blockquote>`,
          tags: ["React", "TypeScript", "Frontend"]
        },
        {
          title: "Building Resilient Backend Services with Node.js and TypeScript",
          content: `<h2>Architecting for High Throughput</h2><p>Designing modern enterprise backend services requires balancing clean code architecture with peak performance. Combining <strong>Node.js</strong> with strict <strong>TypeScript</strong> typing ensures maintainability.</p><h2>Essential Design Patterns</h2><ul><li><strong>Repository Pattern:</strong> Decouple database layer operations from your HTTP route controllers.</li><li><strong>Middleware Pipeline:</strong> Enforce JWT authentication, rate limiting, and request validation.</li></ul>`,
          tags: ["Nodejs", "Backend", "Architecture"]
        },
        {
          title: "The Practical Guide to AI-Powered Software Engineering in 2026",
          content: `<h2>How AI Is Reshaping Developer Workflows</h2><p>Artificial intelligence has evolved from simple auto-completion to an indispensable pair programming assistant. Today's developers leverage LLMs for architecture planning, test generation, and debugging.</p><h2>Maximizing AI Productivity</h2><ul><li><strong>Context-Driven Prompts:</strong> Feed precise context, schema definitions, and expected outputs.</li><li><strong>Automated Refactoring:</strong> Accelerate legacy codebase migrations by generating unit tests.</li></ul>`,
          tags: ["AI", "DeveloperTools", "Productivity"]
        },
        {
          title: "Modern CSS Unleashed: Container Queries, Nesting, and Dynamic UI",
          content: `<h2>The New Era of Responsive Styling</h2><p>Modern CSS features like <strong>Container Queries</strong>, native CSS nesting, and <code>:has()</code> selectors give front-end engineers unmatched control over layout responsiveness.</p><h2>Game-Changing Styling Features</h2><ul><li><strong>Container Queries:</strong> Style components based on container size rather than viewport.</li><li><strong>Native Nesting:</strong> Write clean, organized stylesheets directly without preprocessors.</li></ul>`,
          tags: ["CSS", "WebDesign", "UIUX"]
        }
      ];
      return fallbackArticles[Math.floor(Math.random() * fallbackArticles.length)];
    }
  },
};

export default api;
