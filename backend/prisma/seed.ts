import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  
  // Clear DB
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const passwordHash = await bcrypt.hash("password123", 10);
  
  const user1 = await prisma.user.create({
    data: {
      name: "Elena Rostova",
      email: "elena@example.com",
      passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Sophia Chen",
      email: "sophia@example.com",
      passwordHash,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Milan Kovačić",
      email: "milan@example.com",
      passwordHash,
    },
  });

  // Create Posts
  await prisma.post.create({
    data: {
      userId: user1.id,
      title: "The Future of AI-Assisted Writing: Co-Pilots for Creative Minds",
      summary: "Explore how generative AI is transforming content creation, serving as a brainstorming partner rather than a replacement for human writers.",
      content: `
        <h2>The Rise of AI Companions</h2>
        <p>Generative artificial intelligence is no longer a futuristic concept. Today, it serves as a powerful partner for writers, editors, and creators. By using AI, authors can overcome writer's block, generate initial outlines, and polish their grammar in real time.</p>
        <blockquote>"AI won't replace writers, but writers who use AI will replace writers who don't."</blockquote>
        <h2>Collaborative Brainstorming</h2>
        <p>Imagine having a research assistant who has read the entire internet. You can bounce ideas off the model, ask it to look for historical connections, or draft introductory sentences. Here is a list of ways AI helps in the writing process:</p>
        <ul>
          <li><strong>Structural Outline:</strong> Instantly lay out the chapters or main sub-topics of your article.</li>
          <li><strong>Vocabulary Enhancements:</strong> Suggest synonyms and simplify overly complex terminology.</li>
          <li><strong>Speed Drafting:</strong> Fast-track the writing of repetitive sections or boilerplate text.</li>
        </ul>
        <h2>Maintaining Your Unique Voice</h2>
        <p>The most important element of any article is its authentic human voice. AI should be used to refine and polish, not to dictate the tone. A successful article blends structured technical insights with personal anecdotes and genuine empathy.</p>
      `,
      featureImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800",
      tags: ",Artificial Intelligence,Writing,Productivity,",
      status: "published",
      views: 1420,
      reportReasons: "",
    },
  });

  await prisma.post.create({
    data: {
      userId: user3.id,
      title: "Mastering React 19: Action Hooks and Server Capabilities",
      summary: "Dive deep into the new features of React 19, including the actions API, useActionState, and the unified asset loading system.",
      content: `
        <h2>Welcome to React 19</h2>
        <p>React 19 introduces major updates designed to streamline state management and API integration. The star of this release is the Actions API, which simplifies asynchronous state transitions, error handling, and form submissions.</p>
        <h2>Working with Asynchronous Actions</h2>
        <p>Previously, managing loading states and error feedback during API submissions required writing multiple useState variables. With the new action system, React handles the pending state automatically.</p>
      `,
      featureImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
      tags: ",React,JavaScript,Web Development,",
      status: "published",
      views: 954,
      reportReasons: "",
    },
  });

  await prisma.post.create({
    data: {
      userId: user2.id,
      title: "Creating Minimalist & High-Converting UI Designs",
      summary: "How to apply principles of space, contrast, typography, and functional colors to build interfaces that feel premium and convert readers.",
      content: `
        <h2>The Philosophy of Minimalism</h2>
        <p>Minimalism in UI design isn't just about removing elements; it's about maximizing clarity. Every pixel, background shade, and border should serve a functional purpose. When you remove visual noise, users can focus entirely on the core content.</p>
        <h2>Essential Pillars of Premium Interfaces</h2>
        <ul>
          <li><strong>Negative Space (Whitespace):</strong> Gives content room to breathe and defines visual hierarchy naturally.</li>
          <li><strong>Strict Typographic Hierarchy:</strong> Clear contrast between headers and body font sizes improves scannability.</li>
          <li><strong>Functional Color Palette:</strong> Limit brand colors. Use neutral grays for structure and vibrant accents strictly for interactive elements.</li>
        </ul>
      `,
      featureImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800",
      tags: ",UI Design,UX,Aesthetics,",
      status: "published",
      views: 1105,
      reportReasons: "",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
