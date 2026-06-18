import Groq from "groq-sdk";

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
      model: "llama3-8b-8192", // Use a fast, standard model
      temperature: 0.5,
      max_tokens: 150,
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || "";
  } catch (error: any) {
    console.error("Error generating AI summary:", error);
    throw new Error(`Failed to generate summary: ${error.message}`);
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
    throw new Error(`Failed to correct grammar: ${error.message}`);
  }
}
