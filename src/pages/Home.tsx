import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../App";
import BlogCard from "../components/BlogCard";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import EmptyState from "../components/EmptyState";

export default function Home() {
  const { posts } = useBlog();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts to show only published posts
  const publishedPosts = useMemo(() => {
    return posts.filter((post) => post.status === "published");
  }, [posts]);

  // Extract all unique tags from published posts
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    publishedPosts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [publishedPosts]);

  // Filter based on search query and tag selection
  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [publishedPosts, searchQuery, selectedTag]);

  // Reset page when filter changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag]);

  // Calculate paginated posts
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="glow-bg bg-indigo-500/10 dark:bg-indigo-500/5 w-[300px] h-[300px] -top-10 -left-10" />
      <div className="glow-bg bg-violet-500/10 dark:bg-violet-500/5 w-[400px] h-[400px] top-1/3 right-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Write Smarter with{" "}
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
            <a
              href="#posts-feed"
              className="px-6 py-3 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800/80 rounded-2xl shadow-xs transition-all duration-200"
            >
              Explore Feed
            </a>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section id="posts-feed" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles, tags, summaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition-all duration-200 text-slate-700 dark:text-slate-200"
              />
            </div>
            {/* Tag Badges list */}
            {allTags.length > 0 && (
              <div className="flex items-center flex-wrap gap-1.5 max-w-xl">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                    selectedTag === null
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      selectedTag === tag
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search State Indicator */}
          {(searchQuery || selectedTag) && (
            <div className="flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-2.5 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Found <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredPosts.length}</span> results matching:{" "}
                <span className="italic">
                  {selectedTag ? `[Tag: ${selectedTag}]` : ""} {searchQuery ? `"${searchQuery}"` : ""}
                </span>
              </p>
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Cards Grid Feed */}
          {paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.map((post) => (
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
            <EmptyState
              title="No Articles Found"
              description="We couldn't find any published posts matching your search parameters. Try adjusting your query or tag filter."
              icon={Search}
              action={
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer transition-colors"
                >
                  Reset Search Filters
                </button>
              }
            />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-8 space-x-2">
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
        </section>
      </div>
    </div>
  );
}
