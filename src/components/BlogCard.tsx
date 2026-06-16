import { Link } from "react-router-dom";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { formatDate } from "../utils/formatDate";

interface BlogCardProps {
  id: string;
  title: string;
  image: string;
  summary: string;
  author: string;
  date: string;
  readingTime: number;
  tags: string[];
  views?: number;
}

export default function BlogCard({
  id,
  title,
  image,
  summary,
  author,
  date,
  readingTime,
  tags,
  views = 0,
}: BlogCardProps) {
  return (
    <article className="group glass-card flex flex-col overflow-hidden h-full">
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {tags.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-wrap gap-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-slate-900/95 text-indigo-600 dark:text-indigo-400 shadow-sm">
              {tags[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col p-6">
        {/* Meta info */}
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3 space-x-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {author}
          </span>
          <span>•</span>
          <span>{formatDate(date)}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
          <Link to={`/post/${id}`}>{title}</Link>
        </h3>

        {/* Summary */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-grow leading-relaxed">
          {summary}
        </p>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(1, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom Panel */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{readingTime} min read</span>
            </span>
            {views > 0 && (
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{views} views</span>
              </span>
            )}
          </div>
          <Link
            to={`/post/${id}`}
            className="flex items-center space-x-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
