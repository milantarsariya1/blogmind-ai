import { createContext, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import type { BlogPost } from "./types/blog";
import type { User } from "./types/user";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { mockPosts } from "./data/mockPosts";
import AppRoutes from "./routes/AppRoutes";

interface BlogContextType {
  posts: BlogPost[];
  createPost: (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "views" | "readingTime">) => BlogPost;
  updatePost: (id: string, updatedPost: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateCurrentUser: (updatedFields: Partial<User>) => void;
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
  // Restore posts from localStorage, fallback to mockPosts
  const [posts, setPosts] = useLocalStorage<BlogPost[]>("blogmind_posts", mockPosts);
  
  // Restore current user from localStorage
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>("blogmind_user", null);

  const createPost = (newPostData: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "views" | "readingTime">) => {
    const newId = `post-${Date.now()}`;
    const nowStr = new Date().toISOString();
    
    // Estimate reading time from text content
    const textOnly = newPostData.content.replace(/<[^>]*>/g, "");
    const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;
    const estimatedTime = Math.ceil(wordCount / 200) || 1;

    const fullPost: BlogPost = {
      ...newPostData,
      id: newId,
      createdAt: nowStr,
      updatedAt: nowStr,
      views: 0,
      readingTime: estimatedTime
    };

    setPosts((prevPosts) => [fullPost, ...prevPosts]);
    return fullPost;
  };

  const updatePost = (id: string, updatedFields: Partial<BlogPost>) => {
    const nowStr = new Date().toISOString();
    
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === id) {
          const merged = { ...post, ...updatedFields, updatedAt: nowStr };
          // If content changed, recalculate reading time
          if (updatedFields.content !== undefined) {
            const textOnly = updatedFields.content.replace(/<[^>]*>/g, "");
            const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;
            merged.readingTime = Math.ceil(wordCount / 200) || 1;
          }
          return merged;
        }
        return post;
      })
    );
  };

  const deletePost = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateCurrentUser = (updatedFields: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        createPost,
        updatePost,
        deletePost,
        currentUser,
        login,
        logout,
        updateCurrentUser,
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </BlogContext.Provider>
  );
}
