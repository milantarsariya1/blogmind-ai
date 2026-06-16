export const calculateReadingTime = (content: string): number => {
  if (!content) return 1;
  const textOnly = content.replace(/<[^>]*>/g, ""); // Strip HTML tags
  const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);
  return readingTime > 0 ? readingTime : 1;
};
