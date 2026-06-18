import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlog } from "../App";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import FeatureImagePicker, { PREDEFINED_IMAGES } from "../components/FeatureImagePicker";
import TagInput from "../components/TagInput";
import { aiApi } from "../services/api";
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
  ArrowLeft,
  Loader2
} from "lucide-react";

export default function CreatePost() {
  const { createPost } = useBlog();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [featureImage, setFeatureImage] = useState(PREDEFINED_IMAGES[0]);
  const [tags, setTags] = useState<string[]>([]);
  
  // Loader states
  const [isAiCorrecting, setIsAiCorrecting] = useState(false);
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    content: "<p>Start writing your next masterpiece here...</p>"
  });

  if (!editor) {
    return null;
  }

  // AI Summary handler calling backend Groq API
  const handleGenerateSummary = async () => {
    const text = editor.getText().trim();
    if (!text || text === "Start writing your next masterpiece here...") {
      alert("Please write some content in the editor first.");
      return;
    }

    try {
      setIsAiSummarizing(true);
      setAiMessage(null);
      
      const res = await aiApi.summarize(text);
      setSummary(res.summary);
      triggerAiMessage("AI summary generated successfully!");
    } catch (error) {
      console.error("AI summarization failed:", error);
      alert("AI summarization service is currently offline or failed.");
    } finally {
      setIsAiSummarizing(false);
    }
  };

  // AI Grammar Correction handler calling backend Groq API
  const handleCorrectGrammar = async () => {
    const rawHtml = editor.getHTML();
    const text = editor.getText().trim();
    if (!text || text === "Start writing your next masterpiece here...") {
      alert("Please write some content in the editor first.");
      return;
    }

    try {
      setIsAiCorrecting(true);
      setAiMessage(null);

      const res = await aiApi.correct(rawHtml);
      editor.commands.setContent(res.correctedText);
      triggerAiMessage("Grammar corrections applied successfully!");
    } catch (error) {
      console.error("AI grammar check failed:", error);
      alert("AI grammar correction service is currently offline or failed.");
    } finally {
      setIsAiCorrecting(false);
    }
  };

  const triggerAiMessage = (msg: string) => {
    setAiMessage(msg);
    setTimeout(() => setAiMessage(null), 4000);
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!title.trim()) {
      alert("Please enter a title for your blog post.");
      return;
    }

    const contentHtml = editor.getHTML();
    const textContent = editor.getText().trim();
    
    const fallbackSummary = textContent && textContent !== "Start writing your next masterpiece here..."
      ? (textContent.slice(0, 145) + (textContent.length > 145 ? "..." : ""))
      : "No summary provided.";

    try {
      setIsSubmitting(true);
      
      await createPost({
        title: title.trim(),
        summary: summary.trim() || fallbackSummary,
        content: contentHtml,
        featureImage,
        tags,
        status
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save the article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle link menu
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
        disabled={isSubmitting}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Editor Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create New Article
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Draft your content, tag it, and leverage AI features to polish your writing.
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
              disabled={isSubmitting}
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
                  className={`p-2 rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                    editor.isActive("bold") ? "text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/40" : "text-slate-500"
                  }`}
                  title="Bold"
                >
                  <Bold className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                    editor.isActive("italic") ? "text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/40" : "text-slate-500"
                  }`}
                  title="Italic"
                >
                  <Italic className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={`p-2 rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                    editor.isActive("code") ? "text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/40" : "text-slate-500"
                  }`}
                  title="Inline Code"
                >
                  <Code className="w-4.5 h-4.5" />
                </button>
                <div className="w-px h-6 bg-slate-250 dark:bg-slate-800 mx-1" />
                
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                    editor.isActive("heading", { level: 1 }) ? "text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/40" : "text-slate-500"
                  }`}
                  title="Heading 1"
                >
                  <Heading1 className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                    editor.isActive("heading", { level: 2 }) ? "text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/40" : "text-slate-500"
                  }`}
                  title="Heading 2"
                >
                  <Heading2 className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                    editor.isActive("heading", { level: 3 }) ? "text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/40" : "text-slate-500"
                  }`}
                  title="Heading 3"
                >
                  <Heading3 className="w-4.5 h-4.5" />
                </button>
                <div className="w-px h-6 bg-slate-250 dark:bg-slate-800 mx-1" />

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                    editor.isActive("bulletList") ? "text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/40" : "text-slate-500"
                  }`}
                  title="Bullet List"
                >
                  <List className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                    editor.isActive("orderedList") ? "text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/40" : "text-slate-500"
                  }`}
                  title="Ordered List"
                >
                  <ListOrdered className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                    editor.isActive("blockquote") ? "text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/40" : "text-slate-500"
                  }`}
                  title="Blockquote"
                >
                  <Quote className="w-4.5 h-4.5" />
                </button>
                <div className="w-px h-6 bg-slate-250 dark:bg-slate-800 mx-1" />

                <button
                  type="button"
                  onClick={setLink}
                  className={`p-2 rounded-lg transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-800/50 ${
                    editor.isActive("link") ? "text-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/40" : "text-slate-500"
                  }`}
                  title="Hyperlink"
                >
                  <LinkIcon className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Editor Workspace */}
              <div className="p-4 min-h-[350px] dark:text-slate-100 max-h-[500px] overflow-y-auto">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar (Right Column) */}
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
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Publish Post</span>
              </button>
              <button
                type="button"
                onClick={() => handleSave("draft")}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/60 rounded-xl transition-all cursor-pointer border border-slate-200/20 dark:border-slate-800/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                <span>Save Draft</span>
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
                disabled={isAiCorrecting || isAiSummarizing}
                className="w-full text-left flex items-center justify-between p-3 rounded-xl border border-indigo-200/50 hover:border-indigo-400 dark:border-indigo-900/50 dark:hover:border-indigo-800 bg-white dark:bg-slate-900 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed animate-in fade-in"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Correct Grammar
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isAiCorrecting ? "Reviewing grammar..." : "Spelling, punctuation & styling polish."}
                  </p>
                </div>
                {isAiCorrecting ? (
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-indigo-500 group-hover:animate-bounce" />
                )}
              </button>

              <button
                type="button"
                onClick={handleGenerateSummary}
                disabled={isAiCorrecting || isAiSummarizing}
                className="w-full text-left flex items-center justify-between p-3 rounded-xl border border-indigo-200/50 hover:border-indigo-400 dark:border-indigo-900/50 dark:hover:border-indigo-800 bg-white dark:bg-slate-900 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed animate-in fade-in"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Generate Summary
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isAiSummarizing ? "Creating summary..." : "Build a structured abstract paragraph."}
                  </p>
                </div>
                {isAiSummarizing ? (
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-indigo-500 group-hover:animate-bounce" />
                )}
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
          <FeatureImagePicker selectedImage={featureImage} onSelect={setFeatureImage} />
        </div>
      </div>
    </div>
  );
}
