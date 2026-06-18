import { useState, useMemo, useEffect } from "react";
import { useBlog } from "../App";
import { Link } from "react-router-dom";
import { postApi } from "../services/api";
import { Plus, Edit3, Trash2, BookOpen, FileText, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const { deletePost, currentUser } = useBlog();
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const fetchUserPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await postApi.getMyPosts();
      setUserPosts(posts);
    } catch (error) {
      console.error("Failed to load user posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts on mount
  useEffect(() => {
    fetchUserPosts();
  }, []);

  // Calculate stats based on user's own posts
  const totalPosts = userPosts.length;
  const publishedPosts = userPosts.filter((p) => p.status === "published").length;

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deletePost(id);
        setUserPosts((prev) => prev.filter((post) => post.id !== id));
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete the post. Please try again.");
      }
    }
  };

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    return userPosts.filter((post) => {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags.some((t: string) => t.toLowerCase().includes(query))
      );
    });
  }, [userPosts, searchQuery]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate paginated posts
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Creator Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-bold text-slate-700 dark:text-slate-200">{currentUser?.name}</span>. Manage your publications.
          </p>
        </div>
        <Link
          to="/create-post"
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xs transition-all duration-200 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Post</span>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stat 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Posts</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{totalPosts}</h3>
          </div>
        </div>
        {/* Stat 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Published</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{publishedPosts}</h3>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search posts by title, author, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition-all duration-200 text-slate-700 dark:text-slate-200"
        />
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xs">
          {paginatedPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/80">
                    <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Post Title</th>
                    <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Author</th>
                    <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                    <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {paginatedPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="px-6 py-5 font-semibold text-slate-800 dark:text-slate-200 max-w-xs sm:max-w-sm truncate">
                        {post.status === "published" ? (
                          <Link to={`/post/${post.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            {post.title}
                          </Link>
                        ) : (
                          <span className="text-slate-500">{post.title}</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">{post.author}</td>
                      <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">{formatDate(post.createdAt)}</td>
                      <td className="px-6 py-5 text-right text-sm">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            to={`/edit-post/${post.id}`}
                            className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                            title="Edit Post"
                          >
                            <Edit3 className="w-4.5 h-4.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No Posts Found"
              description={searchQuery ? "No posts match your search query." : "You haven't written any posts yet. Get started by drafting your first blog post using our rich text editor."}
              action={
                !searchQuery ? (
                  <Link
                    to="/create-post"
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Write Your First Post</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Clear Search Filter
                  </button>
                )
              }
            />
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center pt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center space-x-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl font-semibold text-sm cursor-pointer transition-all ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      )}
    </div>
  );
}
