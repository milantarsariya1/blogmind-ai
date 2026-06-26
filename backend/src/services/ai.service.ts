import Groq from "groq-sdk";
import { readFileSync } from "fs";
import { join } from "path";

const groqApiKey = process.env.GROQ_API_KEY;

// Lazy initialization of Groq Client
let groq: Groq | null = null;
function getGroqClient(): Groq {
  if (!groq) {
    if (!groqApiKey) {
      console.warn("GROQ_API_KEY is not defined. AI features will run in mock mode.");
    }
    groq = new Groq({
      apiKey: groqApiKey || "mock_key",
    });
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

export async function seedBlogPost(): Promise<SeededPost> {
  // Load topics and pick one at random
  const topicsPath = join(__dirname, "../data/seedTopics.json");
  const topics: string[] = JSON.parse(readFileSync(topicsPath, "utf-8"));
  const topic = topics[Math.floor(Math.random() * topics.length)];

  if (!groqApiKey) {
    // Rich mock fallback for local dev without API key
    return {
      title: `${topic.split(":")[0].trim()} — A Developer's Guide`,
      content: `<h2>Introduction</h2><p>This is a seeded demo article about <strong>${topic}</strong>. Configure <code>GROQ_API_KEY</code> in your backend <code>.env</code> to get real AI-generated content.</p><h2>Key Concepts</h2><ul><li><strong>Concept One:</strong> A foundational idea in this space that every developer should know.</li><li><strong>Concept Two:</strong> A practical pattern used in production systems worldwide.</li><li><strong>Concept Three:</strong> An emerging technique reshaping the industry.</li></ul><blockquote>"The best code is the code that solves the problem clearly and maintainably."</blockquote><h2>Conclusion</h2><p>Understanding ${topic.split(" ").slice(0, 4).join(" ")} will make you a significantly more effective developer. Start experimenting today.</p>`,
      tags: ["Technology", "Development", "Best Practices"],
    };
  }

  try {
    const client = getGroqClient();
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional tech blogger. Generate a complete, engaging blog post as a strict JSON object with exactly these three keys:
- "title": A compelling, specific article title (string, max 80 chars)
- "content": A rich HTML body using <h2>, <p>, <ul>, <li>, <strong>, <blockquote>, and optionally <pre><code> blocks. Min 350 words.
- "tags": An array of 3 relevant topic tags (strings)

Return ONLY the raw JSON object. No markdown, no backticks, no explanation.`,
        },
        {
          role: "user",
          content: `Write a blog post about: ${topic}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.75,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const raw = chatCompletion.choices[0]?.message?.content?.trim() || "{}";
    const parsed = JSON.parse(raw) as SeededPost;

    if (!parsed.title || !parsed.content) {
      throw new Error("Groq returned incomplete seed data.");
    }

    return parsed;
  } catch (error: any) {
    console.error("Error seeding blog post:", error);
    throw new Error(`Failed to seed blog post: ${error.message}`, { cause: error });
  }
}
