import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlog } from "../App";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import FeatureImagePicker from "../components/FeatureImagePicker";
import TagInput from "../components/TagInput";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Sparkles,
  CheckCircle,
  FileText,
  Send,
  ArrowLeft
} from "lucide-react";

export default function EditPost() {
  const { id } = useParams();
  const { posts, updatePost } = useBlog();
  const navigate = useNavigate();

  // Find the target post
  const post = posts.find((p) => p.id === id);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [featureImage, setFeatureImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isAiCorrecting, setIsAiCorrecting] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/50 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
        }
      })
    ],
    content: ""
  });

  // Populate data when post is loaded
  useEffect(() => {
    if (post && editor) {
      setTitle(post.title);
      setSummary(post.summary);
      setFeatureImage(post.featureImage);
      setTags(post.tags);
      setStatus(post.status);
      editor.commands.setContent(post.content);
    }
  }, [post, editor]);

  if (!post) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Post Not Found</h2>
        <p className="text-slate-500">The article you are trying to edit does not exist or has been deleted.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  // AI Summary simulation
  const handleGenerateSummary = () => {
    const text = editor.getText().trim();
    if (!text) {
      alert("Please write some content in the editor first.");
      return;
    }

    const cleanTitle = title.trim() || "this article";
    const tagList = tags.length > 0 ? tags.join(", ") : "technology and design";
    const generated = `This article explores the core concepts of '${cleanTitle}', discussing key issues such as ${tagList}. It provides actionable insights and practical recommendations for readers looking to excel in this domain.`;
    
    setSummary(generated);
    triggerAiMessage("AI summary generated successfully!");
  };

  // AI Grammar Correction simulation
  const handleCorrectGrammar = () => {
    const rawHtml = editor.getHTML();
    const text = editor.getText().trim();
    if (!text) {
      alert("Please write some content in the editor first.");
      return;
    }

    setIsAiCorrecting(true);
    setAiMessage(null);

    setTimeout(() => {
      let correctedHtml = rawHtml
        .replace(/\bteh\b/g, "the")
        .replace(/\brecieve\b/g, "receive")
        .replace(/\bseperate\b/g, "separate")
        .replace(/\bnt\b/g, "n't")
        .replace(/\bdont\b/g, "don't")
        .replace(/\bcant\b/g, "can't")
        .replace(/\b(w)eb\s(d)evelopment\b/gi, "Web Development")
        .replace(/\b(r)eact\b/g, "React");

      editor.commands.setContent(correctedHtml);
      setIsAiCorrecting(false);
      triggerAiMessage("Grammar corrections applied successfully!");
    }, 2000);
  };

  const triggerAiMessage = (msg: string) => {
    setAiMessage(msg);
    setTimeout(() => setAiMessage(null), 4000);
  };

  const handleSave = (updatedStatus: "draft" | "published") => {
    if (!title.trim()) {
      alert("Please enter a title for your blog post.");
      return;
    }

    const contentHtml = editor.getHTML();
    const textContent = editor.getText().trim();
    
    const fallbackSummary = textContent
      ? (textContent.slice(0, 145) + (textContent.length > 145 ? "..." : ""))
      : "No summary provided.";
    
    updatePost(post.id, {
      title: title.trim(),
      summary: summary.trim() || fallbackSummary,
      content: contentHtml,
      featureImage,
      tags,
      status: updatedStatus
    });

    navigate("/dashboard");
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8 relative">
      {/* Return link */}
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Editor Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Edit Article
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Make adjustments to your content and update your publication details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Fields (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Article Title
            </label>
            <input
              type="text"
              placeholder="Give your article a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base font-medium outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Tiptap Toolbar & Editor */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Content Body
            </label>
            
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-indigo-600/20 focus-within:border-indigo-600 transition-all duration-200">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
                {/* Formatting triggers */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors ${
                    editor.isActive("bold")
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors ${
                    editor.isActive("italic")
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors ${
                    editor.isActive("code")
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  title="Inline Code"
                >
                  <Code className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

                {/* Headings */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors ${
                    editor.isActive("heading", { level: 1 })
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  title="Heading 1"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors ${
                    editor.isActive("heading", { level: 2 })
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors ${
                    editor.isActive("heading", { level: 3 })
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

                {/* Lists */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors ${
                    editor.isActive("bulletList")
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors ${
                    editor.isActive("orderedList")
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

                {/* Quotes & Links */}
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors ${
                    editor.isActive("blockquote")
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={setLink}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors ${
                    editor.isActive("link")
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                  title="Insert Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Editor Workspace */}
              <div className="p-6 min-h-[300px] dark:text-slate-200">
                {isAiCorrecting ? (
                  <div className="flex flex-col items-center justify-center min-h-[250px]">
                    <LoadingSpinner message="AI correcting grammar & style..." />
                  </div>
                ) : (
                  <EditorContent editor={editor} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Configurations Panel (Right Column) */}
        <div className="space-y-6">
          {/* Action Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Publishing Actions
            </h3>
            
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleSave("published")}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 font-semibold rounded-xl transition-all shadow-xs cursor-pointer ${
                  status === "published"
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-50/50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200/30 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-950/60 dark:border-indigo-900/30"
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{status === "published" ? "Save Updates" : "Publish Now"}</span>
              </button>
              <button
                type="button"
                onClick={() => handleSave("draft")}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 font-semibold rounded-xl transition-all cursor-pointer ${
                  status === "draft"
                    ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/60 border border-slate-200/20 dark:border-slate-800/40"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{status === "draft" ? "Save Draft" : "Revert to Draft"}</span>
              </button>
            </div>
          </div>

          {/* AI Helper Tools */}
          <div className="bg-gradient-to-br from-indigo-900/5 via-violet-900/5 to-purple-900/5 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200/30 dark:border-indigo-900/30 rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold tracking-wide text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5" />
              <span>AI Writing Assistants</span>
            </h3>

            {aiMessage && (
              <div className="flex items-center space-x-1.5 p-2.5 text-xs text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-900/50 rounded-xl">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{aiMessage}</span>
              </div>
            )}

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCorrectGrammar}
                disabled={isAiCorrecting}
                className="w-full text-left flex items-center justify-between p-3 rounded-xl border border-indigo-200/50 hover:border-indigo-400 dark:border-indigo-900/50 dark:hover:border-indigo-800 bg-white dark:bg-slate-900 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Correct Grammar
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Spelling, punctuation & styling polish.
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-indigo-500 group-hover:animate-bounce" />
              </button>

              <button
                type="button"
                onClick={handleGenerateSummary}
                className="w-full text-left flex items-center justify-between p-3 rounded-xl border border-indigo-200/50 hover:border-indigo-400 dark:border-indigo-900/50 dark:hover:border-indigo-800 bg-white dark:bg-slate-900 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Generate Summary
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Build a structured abstract paragraph.
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-indigo-500 group-hover:animate-bounce" />
              </button>
            </div>

            {/* Summary display textarea */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                AI Summary Output
              </label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="AI summary outputs here..."
                className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none focus:border-indigo-500 transition-colors text-slate-700 dark:text-slate-300 resize-none"
              />
            </div>
          </div>

          {/* Tag Chips Input */}
          <TagInput tags={tags} onChange={setTags} />

          {/* Feature Cover Image Selector */}
          {featureImage && (
            <FeatureImagePicker selectedImage={featureImage} onSelect={setFeatureImage} />
          )}
        </div>
      </div>
    </div>
  );
}
