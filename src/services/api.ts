import axios from "axios";
import type { BlogPost } from "../types/blog";
import type { User } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    const response = await api.post("/ai/summarize", { content });
    return response.data;
  },

  async correct(content: string): Promise<{ correctedText: string }> {
    const response = await api.post("/ai/correct", { content });
    return response.data;
  },

  async seedPost(): Promise<{ title: string; content: string; tags: string[] }> {
    const response = await api.post("/ai/seed");
    return response.data;
  },
};

export default api;
