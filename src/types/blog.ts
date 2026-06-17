export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  featureImage: string;
  tags: string[];
  author: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  readingTime: number;
  views: number;
  reportCount?: number;
  reportReasons?: string[];
}
