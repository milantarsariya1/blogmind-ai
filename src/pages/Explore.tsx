import { useState, useEffect, useMemo } from "react";
import { useBlog } from "../App";
import BlogCard from "../components/BlogCard";
import { postApi } from "../services/api";
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const { posts: allContextPosts } = useBlog();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Server data state
  const [paginatedPosts, setPaginatedPosts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isServerLoading, setIsServerLoading] = useState(true);

  // Debounced search query
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Extract all unique tags from published posts in context
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allContextPosts
      .filter((post) => post.status === "published")
      .forEach((post) => {
        post.tags.forEach((tag) => tagsSet.add(tag));
      });
    return Array.from(tagsSet);
  }, [allContextPosts]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page on new search
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when tag selection changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag]);

  // Fetch posts from backend when query, tag, or page changes
  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        setIsServerLoading(true);
        const data = await postApi.getPosts({
          page: currentPage,
          limit: 6, // 6 posts per page for better layout alignment
          search: debouncedSearch,
          tag: selectedTag || "",
        });

        setPaginatedPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
        setTotalResults(data.pagination.total);
      } catch (error) {
        console.error("Failed to fetch explore posts from backend:", error);
      } finally {
        setIsServerLoading(false);
      }
    };

    fetchExplorePosts();
  }, [currentPage, debouncedSearch, selectedTag]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="glow-bg bg-indigo-500/10 dark:bg-indigo-500/5 w-[300px] h-[300px] -top-10 -left-10" />
      <div className="glow-bg bg-violet-500/10 dark:bg-violet-500/5 w-[400px] h-[400px] top-1/3 right-10" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-12">
        {/* Back Link & Header */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Explore Articles
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search and filter through all of our publications.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <section className="space-y-6">
          <div className="flex flex-col gap-5 text-center">
            {/* Search Input (First) */}
            <div className="relative w-full max-w-xl mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles, tags, summaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition-all duration-200 text-slate-700 dark:text-slate-200"
              />
            </div>

            {/* Tag Badges list (Directly Below Search Bar) */}
            {allTags.length > 0 && (
              <div className="flex items-center justify-center flex-wrap gap-1.5 w-full">
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
          {(debouncedSearch || selectedTag) && (
            <div className="flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-2.5 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Found <span className="font-bold text-indigo-600 dark:text-indigo-400">{totalResults}</span> results matching:{" "}
                <span className="italic">
                  {selectedTag ? `[Tag: ${selectedTag}]` : ""} {debouncedSearch ? `"${debouncedSearch}"` : ""}
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
          {isServerLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
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
          {!isServerLoading && totalPages > 1 && (
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
