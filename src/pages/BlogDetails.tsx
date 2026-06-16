import { useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlog } from "../App";
import { Clock, Eye, Calendar, ArrowLeft, BookOpen } from "lucide-react";
import { formatDate } from "../utils/formatDate";

export default function BlogDetails() {
  const { id } = useParams();
  const { posts, updatePost } = useBlog();
  const navigate = useNavigate();

  // Find target post
  const post = posts.find((p) => p.id === id);

  // Increment views count on load (once per mount per id)
  useEffect(() => {
    if (post) {
      // Use a small timeout to avoid updating state during rendering lifecycle warnings
      const timer = setTimeout(() => {
        updatePost(post.id, { views: post.views + 1 });
      }, 50);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Retrieve related posts sharing tags, or fallback to recent published posts
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    
    const candidates = posts.filter(
      (p) => p.id !== post.id && p.status === "published"
    );

    const tagMatches = candidates.filter((p) =>
      p.tags.some((t) => post.tags.includes(t))
    );

    if (tagMatches.length > 0) {
      return tagMatches.slice(0, 3);
    }
    return candidates.slice(0, 3);
  }, [post, posts]);

  if (!post) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Post Not Found</h2>
        <p className="text-slate-500">The article you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer shadow-xs"
        >
          Return to Home Feed
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="glow-bg bg-indigo-500/5 dark:bg-indigo-500/2 w-[500px] h-[500px] -top-96 left-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Column (Left) */}
          <article className="lg:col-span-8 space-y-8">
            {/* Tag List */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-slate-900 dark:text-white leading-[1.15]">
              {post.title}
            </h1>

            {/* Author Profile Panel */}
            <div className="flex items-center justify-between border-y border-slate-200/50 dark:border-slate-800/60 py-4.5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base shadow-xs">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{post.author}</h4>
                  <p className="text-[11px] font-semibold text-slate-400">Contributor Creator</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-400 font-semibold">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-slate-350" />
                  <span>{formatDate(post.createdAt)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-slate-350" />
                  <span>{post.readingTime} min read</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-slate-350" />
                  <span>{post.views} views</span>
                </span>
              </div>
            </div>

            {/* Feature Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xs border border-slate-200/25 dark:border-slate-800/25">
              <img
                src={post.featureImage}
                alt={post.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* AI Summary Highlight */}
            {post.summary && (
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border-l-4 border-indigo-600 p-5 rounded-r-2xl space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  AI-Generated Summary
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{post.summary}"
                </p>
              </div>
            )}

            {/* Rich Content block */}
            <div
              className="rich-content prose max-w-none pt-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Related Posts Sidebar Column (Right) */}
          <aside className="lg:col-span-4 space-y-6 lg:border-l lg:border-slate-200/50 lg:dark:border-slate-800/60 lg:pl-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <BookOpen className="w-4.5 h-4.5 text-slate-450" />
              <span>Related Articles</span>
            </h3>

            <div className="space-y-5">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  to={`/post/${rPost.id}`}
                  className="group block space-y-2 bg-white/40 dark:bg-slate-900/20 hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/60 p-3 rounded-2xl transition-all duration-200"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/20 dark:border-slate-800/20">
                    <img
                      src={rPost.featureImage}
                      alt={rPost.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {rPost.title}
                    </h4>
                    <div className="flex items-center text-[10px] text-slate-400 font-semibold space-x-2.5">
                      <span>{rPost.author}</span>
                      <span>•</span>
                      <span>{rPost.readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
