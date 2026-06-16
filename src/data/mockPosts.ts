import type { BlogPost } from "../types/blog";

export const mockPosts: BlogPost[] = [
  {
    id: "post-1",
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
      <pre><code>// Example of a simple AI prompt structure
const aiRequest = {
  prompt: "Synthesize this article into a single paragraph.",
  temperature: 0.7,
  maxTokens: 150
};</code></pre>
      <p>As we advance, the integration between human creativity and machine intelligence will only grow deeper, creating a new era of collaborative literature.</p>
    `,
    featureImage: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800",
    tags: ["Artificial Intelligence", "Writing", "Productivity"],
    author: "Elena Rostova",
    status: "published",
    createdAt: "2026-06-10T10:00:00.000Z",
    updatedAt: "2026-06-10T12:00:00.000Z",
    readingTime: 4,
    views: 1420
  },
  {
    id: "post-2",
    title: "Mastering React 19: Action Hooks and Server Capabilities",
    summary: "Dive deep into the new features of React 19, including the actions API, useActionState, and the unified asset loading system.",
    content: `
      <h2>Welcome to React 19</h2>
      <p>React 19 introduces major updates designed to streamline state management and API integration. The star of this release is the Actions API, which simplifies asynchronous state transitions, error handling, and form submissions.</p>
      <h2>Working with Asynchronous Actions</h2>
      <p>Previously, managing loading states and error feedback during API submissions required writing multiple useState variables. With the new action system, React handles the pending state automatically.</p>
      <pre><code>// React 19 action simulation
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    const response = await saveProfile(formData.get("username"));
    return response.data;
  },
  initialState
);</code></pre>
      <h2>Optimistic Updates Simplified</h2>
      <p>The <code>useOptimistic</code> hook allows developers to render temporary success states before the server finishes responding. This results in instant interface feedback, making web applications feel as responsive as local desktop software.</p>
      <h2>Improved Document Metadata</h2>
      <p>React 19 natively supports title, meta, and link tags inside component trees. The renderer automatically hoists these tags to the HTML head, removing the need for third-party libraries like React Helmet.</p>
    `,
    featureImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
    tags: ["React", "JavaScript", "Web Development"],
    author: "Milan Kovačić",
    status: "published",
    createdAt: "2026-06-12T08:30:00.000Z",
    updatedAt: "2026-06-12T08:30:00.000Z",
    readingTime: 5,
    views: 954
  },
  {
    id: "post-3",
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
      <blockquote>"Good design is as little design as possible. Less, but better – because it concentrates on the essential aspects." - Dieter Rams</blockquote>
      <h2>Glassmorphism and Micro-Animations</h2>
      <p>Adding soft background blurs (backdrop-filter) and thin, high-contrast borders creates depth. Pair these elements with micro-animations—such as a 100ms hover transition on cards—to make the interface feel alive and interactive.</p>
    `,
    featureImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800",
    tags: ["UI Design", "UX", "Aesthetics"],
    author: "Sophia Chen",
    status: "published",
    createdAt: "2026-06-14T14:15:00.000Z",
    updatedAt: "2026-06-14T15:00:00.000Z",
    readingTime: 3,
    views: 1105
  },
  {
    id: "post-4",
    title: "Building a Digital Second Brain in Notion",
    summary: "Organize your life and projects with a Notion-based workflow modeled after Tiago Forte's PARA method.",
    content: `
      <h2>What is a Second Brain?</h2>
      <p>A "Second Brain" is a personal information management system designed to offload memory retrieval. By storing your ideas, article clips, and task histories in a digital database, you free your biological brain to focus on creative execution.</p>
      <h2>The PARA Framework</h2>
      <p>Tiago Forte's PARA method organizes information based on its actionability:</p>
      <ol>
        <li><strong>Projects:</strong> Short-term efforts in your work or life that have a concrete deadline and goal (e.g., Publish BlogMind AI).</li>
        <li><strong>Areas:</strong> Long-term responsibilities that require ongoing upkeep (e.g., Health, Finances, Code Quality).</li>
        <li><strong>Resources:</strong> High-interest topics or reference materials that might be useful in the future (e.g., UI code snippets, design references).</li>
        <li><strong>Archives:</strong> Inactive items from the other three categories (e.g., Completed projects, expired leases).</li>
      </ol>
      <h2>Integrating Notion Databases</h2>
      <p>By connecting a master "Task Database" with a "Project Database" using relations, you can filter tasks dynamically inside each project view. This structured setup guarantees you see exactly what needs to be done next, avoiding search fatigue.</p>
    `,
    featureImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800",
    tags: ["Productivity", "Notion", "Organization"],
    author: "Liam O'Connor",
    status: "published",
    createdAt: "2026-06-15T09:00:00.000Z",
    updatedAt: "2026-06-15T09:00:00.000Z",
    readingTime: 4,
    views: 843
  },
  {
    id: "post-5",
    title: "TypeScript Clean Code: Writing Scalable Applications",
    summary: "Essential guidelines and patterns for structuring TypeScript codebases, focusing on utility types, generics, and strict configurations.",
    content: `
      <h2>The Power of Type Safety</h2>
      <p>TypeScript helps catch errors before the code is executed. However, to unlock its full potential, developers should write clean, semantic types and avoid bypassing compilers with the <code>any</code> keyword.</p>
      <h2>Leveraging Utility Types</h2>
      <p>TypeScript provides utility types that streamline type manipulation. For instance, instead of duplicating interfaces, you can use <code>Pick</code> or <code>Omit</code> to construct new definitions:</p>
      <pre><code>interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Create a safe, passwordless preview
type UserPreview = Omit&lt;User, "role"&gt;;</code></pre>
      <h2>Strict Mode is Mandatory</h2>
      <p>Ensure <code>"strict": true</code> is active in your <code>tsconfig.json</code>. This enables compiler options like <code>noImplicitAny</code> and <code>strictNullChecks</code>, forcing you to handle undefined cases and type parameters explicitly.</p>
    `,
    featureImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800",
    tags: ["TypeScript", "Programming", "Clean Code"],
    author: "Elena Rostova",
    status: "published",
    createdAt: "2026-06-15T11:45:00.000Z",
    updatedAt: "2026-06-15T11:45:00.000Z",
    readingTime: 4,
    views: 712
  },
  {
    id: "post-6",
    title: "Understanding CSS Grid vs. Flexbox in Modern Layouts",
    summary: "Clear, practical examples showing when to employ CSS Grid for layouts versus Flexbox for simple alignment structures.",
    content: `
      <h2>One-Dimensional vs. Two-Dimensional</h2>
      <p>A common point of confusion is deciding between CSS Grid and Flexbox. The general rule is simple: Flexbox is designed for 1-dimensional layouts (a single row or column), whereas Grid is built for 2-dimensional layouts (rows and columns simultaneously).</p>
      <h2>When to Choose Flexbox</h2>
      <p>Use Flexbox when you want to align a series of elements along a single direction. Ideal use cases include:</p>
      <ul>
        <li>Navigation bars (logo on the left, links in the center, buttons on the right).</li>
        <li>Button groupings.</li>
        <li>Simple comment card blocks (avatar next to the name/content).</li>
      </ul>
      <h2>When to Choose CSS Grid</h2>
      <p>Use CSS Grid when you need a rigid, responsive grid with items spanning both rows and columns. Ideal use-cases include:</p>
      <ul>
        <li>Responsive image galleries.</li>
        <li>Blog card feeds (like our dashboard or home page).</li>
        <li>Complex dashboard grids with sidebars, widgets, and main graphs.</li>
      </ul>
      <pre><code>/* Example CSS Grid setup */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}</code></pre>
    `,
    featureImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    tags: ["Web Development", "CSS", "UI Design"],
    author: "Sophia Chen",
    status: "published",
    createdAt: "2026-06-16T10:00:00.000Z",
    updatedAt: "2026-06-16T10:00:00.000Z",
    readingTime: 3,
    views: 450
  },
  {
    id: "post-7",
    title: "Unlocking Peak Productivity in Remote Work Environments",
    summary: "Practical habits, communication rules, and setups to stay focused, prevent burnout, and excel when working from home.",
    content: `
      <h2>The Paradox of Remote Work</h2>
      <p>Working from home offers freedom, but it also blurs the lines between professional and personal life. Without clear boundaries, remote workers can experience chronic fatigue and constant distractions.</p>
      <h2>Three Golden Rules for Remote Focus</h2>
      <p>To establish a productive and healthy work-from-home routine, consider implementing these strategies:</p>
      <ol>
        <li><strong>Establish a Dedicated Workspace:</strong> Never work from your bed. Set up a dedicated desk area that you walk away from at the end of the work day.</li>
        <li><strong>Maintain Fixed Hours:</strong> Set strict start and end times. Turn off Slack and email notifications when your shift finishes.</li>
        <li><strong>Implement asynchronous Communication:</strong> Document your thoughts and progress clearly, reducing the need for constant Zoom meetings.</li>
      </ol>
      <h2>Physical Health and Ergononomics</h2>
      <p>Investing in a high-quality office chair and a standing desk pays dividends. Take five-minute stretch breaks every hour to keep your circulation active and rest your eyes.</p>
    `,
    featureImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800",
    tags: ["Productivity", "Remote Work", "Health"],
    author: "Liam O'Connor",
    status: "published",
    createdAt: "2026-06-16T12:00:00.000Z",
    updatedAt: "2026-06-16T12:00:00.000Z",
    readingTime: 4,
    views: 618
  },
  {
    id: "post-8",
    title: "Drafting the Perfect Hook: Secrets of Viral Copywriting",
    summary: "Learn how to write headlines and summaries that capture immediate interest, utilizing psychology and narrative tension.",
    content: `
      <h2>The 5-Second Attention Economy</h2>
      <p>On the internet, your reader is only a click away from leaving. The title and introduction represent the most critical sections of your article. If you don't engage your audience in the first five seconds, the rest of your content won't be read.</p>
      <h2>Creating Magnetic Headlines</h2>
      <p>Avoid clickbait, but make use of emotional hooks, curiosity gaps, and actionable verbs. For example, compare: </p>
      <blockquote>"Writing Tips" vs. "Drafting the Perfect Hook: Secrets of Viral Copywriting"</blockquote>
      <p>The second headline builds intrigue, promises specific knowledge, and establishes authority.</p>
      <h2>Structuring the Lead Paragraph</h2>
      <p>Start with a punchy sentence that highlights a common challenge. Follow it with a validation of the reader's frustration, and resolve it by explaining exactly how your article will solve that exact challenge.</p>
    `,
    featureImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800",
    tags: ["Writing", "Marketing", "Copywriting"],
    author: "Elena Rostova",
    status: "draft",
    createdAt: "2026-06-16T15:00:00.000Z",
    updatedAt: "2026-06-16T15:15:00.000Z",
    readingTime: 3,
    views: 0
  }
];
