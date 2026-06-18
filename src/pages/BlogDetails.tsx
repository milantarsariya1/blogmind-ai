import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlog } from "../App";
import { postApi } from "../services/api";
import { Clock, Eye, Calendar, ArrowLeft, BookOpen, Flag } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import LoadingSpinner from "../components/LoadingSpinner";

export default function BlogDetails() {
  const { id } = useParams();
  const { posts: allContextPosts } = useBlog();
  const navigate = useNavigate();

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Report state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("irrelevant");
  const [customReason, setCustomReason] = useState("");

  // Fetch post details on load (and increment view on backend)
  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await postApi.getPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Failed to load post details:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  // Retrieve related posts sharing tags, or fallback to recent published posts
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    
    const candidates = allContextPosts.filter(
      (p) => p.id !== post.id && p.status === "published"
    );

    const tagMatches = candidates.filter((p) =>
      p.tags.some((t) => post.tags.includes(t))
    );

    if (tagMatches.length > 0) {
      return tagMatches.slice(0, 3);
    }
    return candidates.slice(0, 3);
  }, [post, allContextPosts]);

  const handleReportSubmit = async (simulateMax: boolean = false) => {
    if (!post) return;
    
    let finalReason = reportReason;
    if (reportReason === "other") {
      if (!customReason.trim()) {
        alert("Please describe the issue before submitting.");
        return;
      }
      finalReason = customReason.trim();
    }

    try {
      setIsReportModalOpen(false);

      if (simulateMax) {
        // Send a specific flag or do repeated requests to trigger backend removal limit of 8
        // Let's send a flag that immediately triggers the limit, or in the database we can just send multiple reports
        // Since we want to test moderation instantly, let's call the report endpoint.
        // Wait, on the backend we can check if the reason contains a simulation string, or we can just send the report
        // and delete it. But since backend reportPost deletes it if reportCount > 7, we can just trigger it!
        // To simulate, we can send a custom reason that the backend could recognize, or we can just send 8 report calls in parallel.
        // Let's run a loop to report it 8 times to satisfy backend criteria! That's very robust and works on standard API!
        setIsLoading(true);
        for (let i = 0; i < 8; i++) {
          const res = await postApi.reportPost(post.id, `Simulation report #${i + 1}: ${finalReason}`);
          if (res.deleted) {
            alert("This post has been automatically removed from the site as it has received more than 7 reports from the community.");
            navigate("/");
            return;
          }
        }
      } else {
        const res = await postApi.reportPost(post.id, finalReason);
        if (res.deleted) {
          alert("This post has been automatically removed from the site as it has received more than 7 reports from the community.");
          navigate("/");
        } else {
          // Update local post state
          setPost((prev: any) => ({
            ...prev,
            reportCount: (prev.reportCount || 0) + 1,
          }));
          alert(`Report submitted successfully! The content is now under review. (Current reports: ${(post.reportCount || 0) + 1}/8)`);
        }
      }
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
      setReportReason("irrelevant");
      setCustomReason("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-40">
        <LoadingSpinner />
      </div>
    );
  }

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

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
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
              {post.tags.map((tag: string) => (
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

            {/* Report Content Panel */}
            <div className="border-t border-slate-200/50 dark:border-slate-800/60 pt-6 mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Flag this article?</h4>
                <p className="text-xs text-slate-500">If you find this content inappropriate, abusive, or irrelevant, please let us know.</p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 text-xs font-semibold text-red-650 hover:text-red-700 bg-red-50 dark:bg-red-950/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 rounded-xl transition-all border border-red-200/40 dark:border-red-900/40 cursor-pointer self-start sm:self-auto shadow-2xs"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Content</span>
              </button>
            </div>
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

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Flag className="w-5 h-5 text-red-500" />
                <span>Report Blog Post</span>
              </h3>
              <button
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportReason("irrelevant");
                  setCustomReason("");
                }}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Help us keep our community safe and clean. Select a reason why you are reporting this article:
              </p>

              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="reportReason"
                    value="irrelevant"
                    checked={reportReason === "irrelevant"}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="mt-0.5 text-indigo-650 focus:ring-indigo-550 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block">Irrelevant Content</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Off-topic, spam, ads, or content not matching our publishing goals.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="reportReason"
                    value="abusive"
                    checked={reportReason === "abusive"}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="mt-0.5 text-indigo-650 focus:ring-indigo-550 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block">Abusive Content</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Hateful, violent, harassment, or violates our terms of conduct.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name="reportReason"
                    value="other"
                    checked={reportReason === "other"}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="mt-0.5 text-indigo-650 focus:ring-indigo-550 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block">Other Reason</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Describe the issue in your own words.</span>
                  </div>
                </label>
              </div>

              {reportReason === "other" && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Describe the issue</label>
                  <textarea
                    rows={3}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Type the reason why this article should be moderated..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-indigo-500 transition-colors text-slate-700 dark:text-slate-350 resize-none"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleReportSubmit(false)}
                className="flex-grow py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-850 rounded-xl transition-colors cursor-pointer text-center"
              >
                Submit Report
              </button>
              <button
                type="button"
                onClick={() => handleReportSubmit(true)}
                className="flex-grow py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
                title="Test moderation threshold instantly"
              >
                Submit & Simulate Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
