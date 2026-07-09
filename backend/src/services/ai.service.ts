import Groq from "groq-sdk";

const groqApiKey = process.env.GROQ_API_KEY;

// Lazy initialization of Groq Client — only created when key is available
let groq: Groq | null = null;
function getGroqClient(): Groq {
  if (!groqApiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured. Please add it to Vercel environment variables."
    );
  }
  if (!groq) {
    groq = new Groq({ apiKey: groqApiKey });
  }
  return groq;
}

export async function generateSummary(content: string): Promise<string> {
  if (!groqApiKey) {
    // Return mock summary for development if API key is not configured
    return `[Mock Summary] This article explores key aspects of the topic, focusing on practical insights, standard design principles, and developer experiences. (Configure GROQ_API_KEY to get real AI summaries)`;
  }

  try {
    const client = getGroqClient();
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a concise blog editor. Summarize the provided blog content in exactly 2 to 3 sentences. Do not add intro or outro, just return the summary directly.",
        },
        {
          role: "user",
          content: content,
        },
      ],
      model: "llama-3.1-8b-instant", // Use a fast, standard model
      temperature: 0.5,
      max_tokens: 150,
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || "";
  } catch (error: any) {
    console.error("Error generating AI summary:", error);
    throw new Error(`Failed to generate summary: ${error.message}`, { cause: error });
  }
}

export async function correctGrammar(content: string): Promise<string> {
  if (!groqApiKey) {
    // Return mock correction if key is not configured
    return content + "\n\n(Grammar check mock: please configure GROQ_API_KEY on the backend)";
  }

  try {
    const client = getGroqClient();
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional editor. Correct any grammar, spelling, and punctuation issues in the provided text while keeping its overall writing style, tone, and HTML formatting structure (e.g. headers, lists, paragraphs) exactly intact. Return only the corrected text. Do not add any introductory or explanatory text.",
        },
        {
          role: "user",
          content: content,
        },
      ],
      model: "llama-3.3-70b-versatile", // High quality reasoning model
      temperature: 0.2,
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || "";
  } catch (error: any) {
    console.error("Error correcting grammar:", error);
    throw new Error(`Failed to correct grammar: ${error.message}`, { cause: error });
  }
}

export interface SeededPost {
  title: string;
  content: string;
  tags: string[];
}

// Seed topics embedded inline to avoid filesystem dependency in serverless deployments
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

export async function seedBlogPost(): Promise<SeededPost> {
  const topic = SEED_TOPICS[Math.floor(Math.random() * SEED_TOPICS.length)];

  if (!groqApiKey) {
    // Rich mock fallback for local dev without API key
    return {
      title: `${topic.split(":")[0].trim()} — A Developer's Guide`,
      content: `<h2>Introduction</h2><p>This is a seeded demo article about <strong>${topic}</strong>. Configure <code>GROQ_API_KEY</code> in your backend <code>.env</code> to get real AI-generated content.</p><h2>Key Concepts</h2><ul><li><strong>Concept One:</strong> A foundational idea in this space that every developer should know.</li><li><strong>Concept Two:</strong> A practical pattern used in production systems worldwide.</li><li><strong>Concept Three:</strong> An emerging technique reshaping the industry.</li></ul><blockquote>"The best code is the code that solves the problem clearly and maintainably."</blockquote><h2>Conclusion</h2><p>Understanding ${topic.split(" ").slice(0, 4).join(" ")} will make you a significantly more effective developer. Start experimenting today.</p>`,
      tags: ["Technology", "Development", "Best Practices"],
    };
  }

  // Primary attempt: fast 8b model (low latency, fits Vercel 10s timeout)
  try {
    const client = getGroqClient();
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

    if (!parsed.title || !parsed.content) {
      throw new Error("Groq returned incomplete seed data.");
    }

    return parsed;
  } catch (primaryError: any) {
    console.error("Primary model seed failed, trying fallback model:", primaryError.message);

    // Fallback: try mixtral as secondary option
    try {
      const client = getGroqClient();
      const fallbackCompletion = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a tech blogger. Return a JSON object with keys: "title" (string), "content" (HTML string with h2/p/ul/li tags, ~250 words), "tags" (array of 3 strings). Return ONLY raw JSON.`,
          },
          {
            role: "user",
            content: `Write a blog post about: ${topic}`,
          },
        ],
        model: "gemma2-9b-it",
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const fallbackRaw = fallbackCompletion.choices[0]?.message?.content?.trim() || "{}";
      const fallbackParsed = JSON.parse(fallbackRaw) as SeededPost;

      if (!fallbackParsed.title || !fallbackParsed.content) {
        throw new Error("Fallback model also returned incomplete seed data.");
      }

      return fallbackParsed;
    } catch (fallbackError: any) {
      console.error("Fallback model also failed:", fallbackError.message);
      const combinedMessage = `Primary: ${primaryError.message} | Fallback: ${fallbackError.message}`;
      throw new Error(`Failed to seed blog post: ${combinedMessage}`);
    }
  }
}
