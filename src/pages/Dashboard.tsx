import { useBlog } from "../App";
import { Link } from "react-router-dom";
import { Plus, Edit3, Trash2, FileText, BarChart2, BookOpen } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import EmptyState from "../components/EmptyState";

export default function Dashboard() {
  const { posts, deletePost, currentUser } = useBlog();

  // Calculate stats
  const totalPosts = posts.length;
  const draftPosts = posts.filter((p) => p.status === "draft").length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deletePost(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Creator Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-bold text-slate-700 dark:text-slate-200">{currentUser?.name}</span>. Manage your drafts and publications.
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl animate-pulse">
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
        {/* Stat 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Drafts</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{draftPosts}</h3>
          </div>
        </div>
        {/* Stat 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-xl">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Views</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{totalViews.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xs">
        {posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/80">
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Post Title</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Author</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400">Views</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200 max-w-xs sm:max-w-sm truncate">
                      {post.status === "published" ? (
                        <Link to={`/post/${post.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {post.title}
                        </Link>
                      ) : (
                        <span className="text-slate-500">{post.title}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40"
                            : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40"
                        }`}
                      >
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{post.author}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{formatDate(post.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">{post.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Link
                          to={`/edit-post/${post.id}`}
                          className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                          title="Edit Post"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
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
            description="You haven't written any posts yet. Get started by drafting your first blog post using our rich text editor."
            action={
              <Link
                to="/create-post"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Write Your First Post</span>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
