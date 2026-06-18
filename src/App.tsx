import { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import type { BlogPost } from "./types/blog";
import type { User } from "./types/user";
import { postApi } from "./services/api";
import AppRoutes from "./routes/AppRoutes";

interface BlogContextType {
  posts: BlogPost[];
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "views" | "readingTime" | "author">) => Promise<BlogPost>;
  updatePost: (id: string, updatedPost: Partial<BlogPost>) => Promise<BlogPost>;
  deletePost: (id: string) => Promise<void>;
  currentUser: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateCurrentUser: (user: User, token: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Restore current user from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("blogmind_user");
    return saved ? JSON.parse(saved) : null;
  });

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await postApi.getPosts({ page: 1, limit: 100 });
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts from backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load posts initially
  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (newPostData: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "views" | "readingTime" | "author">) => {
    setIsLoading(true);
    try {
      const fullPost = await postApi.createPost(newPostData);
      setPosts((prevPosts) => [fullPost, ...prevPosts]);
      return fullPost;
    } catch (error) {
      console.error("Failed to create post:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (id: string, updatedFields: Partial<BlogPost>) => {
    setIsLoading(true);
    try {
      const updated = await postApi.updatePost(id, updatedFields);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? updated : post))
      );
      return updated;
    } catch (error) {
      console.error("Failed to update post:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    setIsLoading(true);
    try {
      await postApi.deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Failed to delete post:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = (user: User, token: string) => {
    setCurrentUser(user);
    localStorage.setItem("blogmind_token", token);
    localStorage.setItem("blogmind_user", JSON.stringify(user));
  };

  const updateCurrentUser = (user: User, token: string) => {
    setCurrentUser(user);
    localStorage.setItem("blogmind_token", token);
    localStorage.setItem("blogmind_user", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("blogmind_token");
    localStorage.removeItem("blogmind_user");
  };

  return (
    <BlogContext.Provider
      value={
        {
          posts,
          isLoading,
          fetchPosts,
          createPost,
          updatePost,
          deletePost,
          currentUser,
          login,
          logout,
          updateCurrentUser,
        } as any
      }
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </BlogContext.Provider>
  );
}
