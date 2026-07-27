import Groq from "groq-sdk";

function getGroqApiKey(): string | undefined {
  return process.env.GROQ_API_KEY;
}

let groq: Groq | null = null;
function getGroqClient(): Groq | null {
  const apiKey = getGroqApiKey();
  if (!apiKey || apiKey.trim() === "" || apiKey === "gsk_...") {
    return null;
  }
  if (!groq) {
    groq = new Groq({ apiKey });
  }
  return groq;
}

export async function generateSummary(content: string): Promise<string> {
  const client = getGroqClient();

  if (client) {
    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a concise blog editor. Summarize the provided blog content in exactly 2 to 3 sentences. Do not add intro or outro, just return the summary directly.",
          },
          {
            role: "user",
            content: content,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.5,
        max_tokens: 150,
      });

      const res = chatCompletion.choices[0]?.message?.content?.trim();
      if (res) return res;
    } catch (error: any) {
      console.warn("Groq AI summary failed, using fallback summary builder:", error?.message || error);
    }
  }

  // Graceful Fallback Summary Generator
  const cleanText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (cleanText.length <= 150) {
    return cleanText || "A concise overview of the article's core themes and key points.";
  }
  const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
  const summarySentences = sentences.slice(0, 3).join(" ").trim();
  return summarySentences.length > 250 ? summarySentences.substring(0, 247) + "..." : summarySentences;
}

export async function correctGrammar(content: string): Promise<string> {
  const client = getGroqClient();

  if (client) {
    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a professional editor. Correct any grammar, spelling, and punctuation issues in the provided text while keeping its overall writing style, tone, and HTML formatting structure (e.g. headers, lists, paragraphs) exactly intact. Return only the corrected text. Do not add any introductory or explanatory text.",
          },
          {
            role: "user",
            content: content,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
      });

      const res = chatCompletion.choices[0]?.message?.content?.trim();
      if (res) return res;
    } catch (error: any) {
      console.warn("Groq AI grammar correction failed, keeping original content:", error?.message || error);
    }
  }

  return content;
}

export interface SeededPost {
  title: string;
  content: string;
  tags: string[];
}

const SEED_TOPICS: string[] = [
  "The future of AI in software development and how developers can stay ahead",
  "Building scalable TypeScript applications with clean architecture patterns",
  "Modern CSS techniques: glassmorphism, container queries, and advanced animations",
  "Mastering React performance optimization: memoization, lazy loading, and profiling",
  "The definitive guide to remote work productivity: habits, tools, and routines",
  "Understanding Large Language Models: how transformers work under the hood",
  "Node.js backend security best practices: authentication, rate limiting, and OWASP",
  "Designing accessible web interfaces: ARIA, contrast, and keyboard navigation",
  "The rise of edge computing and what it means for full-stack developers",
  "Git workflows for teams: branching strategies, code reviews, and CI/CD pipelines",
  "Prompt engineering mastery: techniques for better AI outputs in production",
  "Database design patterns: when to use SQL vs NoSQL and how to scale both",
];

const RICH_SEED_ARTICLES: SeededPost[] = [
  {
    title: "Mastering React 19: Server Actions, Hooks, and Next-Gen Rendering",
    content: `<h2>The Evolution of Modern React</h2>
<p>React 19 brings some of the most dramatic upgrades to front-end developer experience in years. With built-in support for <strong>Server Actions</strong>, <code>useActionState</code>, and <code>useOptimistic</code>, the boundary between client and server data flow is smoother than ever.</p>
<h2>Key Capabilities to Harness</h2>
<ul>
  <li><strong>Server Actions:</strong> Execute asynchronous server-side functions directly from form submissions or event handlers without writing boilerplate API fetch calls.</li>
  <li><strong>Optimistic UI Updates:</strong> Deliver instantaneous feedback to users while background mutations resolve in the background.</li>
  <li><strong>Asset Loading:</strong> Stylesheets, scripts, and fonts pre-render cleanly with automatic hoist optimizations.</li>
</ul>
<blockquote>"Declarative UI development in React is no longer just about state updates—it's about seamless server-client synergy."</blockquote>
<h2>Best Practices for 2026</h2>
<p>When structuring your components, keep mutations close to the UI trigger, leverage suspense boundaries gracefully, and keep client bundle sizes lightweight by delegating heavy computation to server boundaries.</p>`,
    tags: ["React", "TypeScript", "Frontend"],
  },
  {
    title: "Building Resilient Backend Services with Node.js and TypeScript",
    content: `<h2>Architecting for High Throughput</h2>
<p>Designing modern enterprise backend services requires balancing clean code architecture with peak performance. Combining <strong>Node.js</strong> with strict <strong>TypeScript</strong> typing ensures maintainability across large engineering teams.</p>
<h2>Essential Design Patterns</h2>
<ul>
  <li><strong>Repository Pattern:</strong> Decouple database layer operations from your HTTP route controllers to streamline unit testing.</li>
  <li><strong>Middleware Pipeline:</strong> Enforce JWT authentication, rate limiting, and request validation before hits touch core business logic.</li>
  <li><strong>Structured Logging:</strong> Standardize JSON log outputs to monitor error rates and trace latency bottlenecks in production.</li>
</ul>
<blockquote>"Clean architecture isn't about writing more code; it's about making future modifications effortless and bulletproof."</blockquote>
<h2>Conclusion</h2>
<p>By enforcing clear boundaries and robust error handling, your API backend will remain scalable and resilient as application traffic grows exponentially.</p>`,
    tags: ["Nodejs", "Backend", "Architecture"],
  },
  {
    title: "The Practical Guide to AI-Powered Software Engineering in 2026",
    content: `<h2>How AI Is Reshaping the Developer Workflow</h2>
<p>Artificial intelligence has evolved from simple auto-completion to an indispensable pair programming assistant. Today's developers leverage LLMs for architecture planning, test generation, and debugging complex edge cases.</p>
<h2>Maximizing AI Assistant Productivity</h2>
<ul>
  <li><strong>Context-Driven Prompts:</strong> Feed precise context, schema definitions, and expected outputs to receive high-fidelity code solutions.</li>
  <li><strong>Automated Refactoring:</strong> Accelerate legacy codebase migrations by generating unit test suites before refactoring logic.</li>
  <li><strong>Rapid Prototyping:</strong> Scaffold full-stack feature concepts in minutes rather than days.</li>
</ul>
<blockquote>"AI will not replace software engineers, but software engineers using AI will set the benchmark for high-velocity engineering."</blockquote>
<h2>Final Thoughts</h2>
<p>Embrace AI tools as an amplification of your engineering intuition. Maintain rigorous code review standards, test thoroughly, and continue refining your core architectural skills.</p>`,
    tags: ["AI", "DeveloperTools", "Productivity"],
  },
  {
    title: "Modern CSS Unleashed: Container Queries, Nesting, and Dynamic UI",
    content: `<h2>The New Era of Responsive Styling</h2>
<p>Modern CSS has evolved faster over the last three years than in the previous decade. Features like <strong>Container Queries</strong>, native CSS nesting, and <code>:has()</code> selectors give front-end engineers unmatched control over layout responsiveness.</p>
<h2>Game-Changing Styling Features</h2>
<ul>
  <li><strong>Container Queries:</strong> Style components based on the size of their parent container rather than viewport dimensions.</li>
  <li><strong>Native Nesting:</strong> Write clean, organized stylesheets directly without needing preprocessors like Sass.</li>
  <li><strong>Subgrid & Custom Properties:</strong> Build dynamic, fluid layout grids with smooth CSS variable animations.</li>
</ul>
<blockquote>"Responsive design is no longer just mobile vs desktop—it's modular, component-aware layout design."</blockquote>
<h2>Summary</h2>
<p>By updating your CSS toolkit with these native features, you can delete thousands of lines of legacy media queries and JavaScript layout helpers.</p>`,
    tags: ["CSS", "WebDesign", "UIUX"],
  },
  {
    title: "Database Scaling Strategies: SQL vs NoSQL in Modern System Design",
    content: `<h2>Choosing the Right Storage Foundation</h2>
<p>Every successful web application eventually faces database throughput challenges. Deciding between relational databases like PostgreSQL and document stores like MongoDB depends on data consistency requirements and access patterns.</p>
<h2>Core Scaling Principles</h2>
<ul>
  <li><strong>Read Replicas & Connection Pooling:</strong> Distribute read heavy traffic away from your primary database node.</li>
  <li><strong>Indexing Optimization:</strong> Avoid full table scans by creating composite B-tree indexes tailored for frequent query predicates.</li>
  <li><strong>Caching Layer:</strong> Deploy Redis in front of complex join queries to deliver sub-millisecond response times.</li>
</ul>
<blockquote>"Optimize your data model for how your application reads data, not just how it writes it."</blockquote>
<h2>Key Takeaway</h2>
<p>Understand your query access patterns early, measure query execution plans, and index strategically to support smooth horizontal growth.</p>`,
    tags: ["Database", "SystemDesign", "PostgreSQL"],
  }
];

export async function seedBlogPost(): Promise<SeededPost> {
  const client = getGroqClient();

  if (client) {
    try {
      const topic = SEED_TOPICS[Math.floor(Math.random() * SEED_TOPICS.length)];
      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a professional tech blogger. Generate a complete, engaging blog post as a strict JSON object with exactly these three keys:
- "title": A compelling, specific article title (string, max 80 chars)
- "content": A rich HTML body using <h2>, <p>, <ul>, <li>, <strong>, <blockquote> tags. Aim for 300-400 words.
- "tags": An array of 3 relevant topic tags (strings)

Return ONLY the raw JSON object. No markdown, no backticks, no explanation.`,
          },
          {
            role: "user",
            content: `Write a blog post about: ${topic}`,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.75,
        max_tokens: 1200,
        response_format: { type: "json_object" },
      });

      const raw = chatCompletion.choices[0]?.message?.content?.trim() || "{}";
      const parsed = JSON.parse(raw) as SeededPost;

      if (parsed.title && parsed.content && Array.isArray(parsed.tags)) {
        return parsed;
      }
    } catch (error: any) {
      console.warn("Groq AI seed API call failed, using rich seed article fallback:", error?.message || error);
    }
  }

  // Return a random rich seed article from our curated collection
  const randomArticle = RICH_SEED_ARTICLES[Math.floor(Math.random() * RICH_SEED_ARTICLES.length)];
  return randomArticle;
}
