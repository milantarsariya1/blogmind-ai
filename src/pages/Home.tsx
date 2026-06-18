import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../App";
import BlogCard from "../components/BlogCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const { posts, isLoading } = useBlog();

  // Get only published posts, sorted by date (newest first), and slice the top 6
  const topSixPosts = useMemo(() => {
    return posts
      .filter((post) => post.status === "published")
      .slice(0, 6);
  }, [posts]);

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="glow-bg bg-indigo-500/10 dark:bg-indigo-500/5 w-[300px] h-[300px] -top-10 -left-10" />
      <div className="glow-bg bg-violet-500/10 dark:bg-violet-500/5 w-[400px] h-[400px] top-1/3 right-10" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Write Smarter with
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              AI Power
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
            Welcome to BlogMind AI. Draft articles in our professional editor, refine grammar with a click, and auto-summarize key takeaways.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              to="/dashboard"
              className="px-6 py-3 font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-black dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 rounded-2xl shadow-md transition-all duration-200"
            >
              Start Writing
            </Link>
            <Link
              to="/explore"
              className="px-6 py-3 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800/80 rounded-2xl shadow-xs transition-all duration-200"
            >
              Explore Feed
            </Link>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-150/50 dark:border-slate-800/60 pb-5 gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5.5 h-5.5 text-indigo-500" />
                <span>Recent Publications</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Explore our latest featured insights, tutorials, and tech articles.
              </p>
            </div>
            
            <Link
              to="/explore"
              className="inline-flex items-center space-x-1.5 font-bold text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-805 transition-colors group cursor-pointer"
            >
              <span>Explore all articles</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Cards Grid */}
          {isLoading && posts.length === 0 ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : topSixPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
              {topSixPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  image={post.featureImage}
                  summary={post.summary}
                  author={post.author}
                  date={post.createdAt}
                  readingTime={post.readingTime}
                  tags={post.tags}
                  views={post.views}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 rounded-3xl p-12 text-center">
              <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold">No published articles yet. Check back later!</p>
            </div>
          )}

          {/* Bottom Call to Action / View More Button */}
          {posts.filter(p => p.status === 'published').length > 6 && (
            <div className="flex justify-center pt-4">
              <Link
                to="/explore"
                className="inline-flex items-center space-x-2 px-8 py-3.5 font-bold text-sm text-white bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-800 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                <span>View More Articles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
