import Replicate from "replicate";
import { MigrainEvent, DayData, MigraineStats } from "../types";

// Replicate API configuration
const REPLICATE_API_TOKEN = process.env.EXPO_PUBLIC_REPLICATE_API_TOKEN || "";
const MODEL = "anthropic/claude-4-sonnet"; // Using Claude 4 Sonnet

// Initialize Replicate client (will be null if no token)
let replicate: Replicate | null = null;
if (REPLICATE_API_TOKEN && REPLICATE_API_TOKEN !== "") {
  replicate = new Replicate({
    auth: REPLICATE_API_TOKEN,
  });
}

export interface ReplicateMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Generate AI insights from migraine data
export async function generateDailyInsight(
  dayData: DayData[],
  migraines: MigrainEvent[]
): Promise<string> {
  const recentDays = dayData.slice(-7); // Last 7 days
  const recentMigraines = migraines.slice(-5); // Last 5 migraines

  const prompt = `You are a helpful migraine tracking assistant. Based on the user's recent data, provide a brief daily insight.

Recent migraine data (last 7 days):
- Days tracked: ${recentDays.length}
- Migraines: ${recentDays.filter((d) => d.hasMigraine).length}
- Recent triggers: ${recentMigraines.flatMap((m) => m.triggers).slice(0, 10).join(", ") || "None recorded"}
- Recent symptoms: ${recentMigraines.flatMap((m) => m.symptoms).slice(0, 10).join(", ") || "None recorded"}

Generate ONE SHORT sentence (15-20 words max) highlighting the most important insight or action for today. Be direct and actionable.`;

  return await callReplicate(prompt);
}

// Generate detailed insights for the modal
export async function generateDetailedInsights(
  dayData: DayData[],
  migraines: MigrainEvent[]
): Promise<string> {
  const recentDays = dayData.slice(-7);
  const recentMigraines = migraines.slice(-5);

  const prompt = `You are a helpful migraine tracking assistant. Based on the user's data, provide detailed daily insights.

Recent migraine data (last 7 days):
- Days tracked: ${recentDays.length}
- Migraines: ${recentDays.filter((d) => d.hasMigraine).length}
- Recent triggers: ${recentMigraines.flatMap((m) => m.triggers).slice(0, 10).join(", ") || "None recorded"}
- Recent symptoms: ${recentMigraines.flatMap((m) => m.symptoms).slice(0, 10).join(", ") || "None recorded"}

Provide a detailed analysis with:
1. Overall pattern summary (2-3 sentences)
2. Key findings (3 specific bullet points)
3. Today's recommendations (3 actionable items)

Be empathetic, supportive, and specific. Format with clear sections.`;

  return await callReplicate(prompt);
}

// Generate pattern analysis
export async function analyzePatterns(
  migraines: MigrainEvent[],
  dayData: DayData[]
): Promise<string> {
  const prompt = `You are a migraine pattern analysis assistant. Analyze the following data and identify key patterns.

Migraine data summary:
- Total migraines: ${migraines.length}
- Date range: ${dayData.length} days
- Top triggers: ${getTopTriggers(migraines, 5)}
- Top symptoms: ${getTopSymptoms(migraines, 5)}

Provide 3 specific, actionable insights about patterns you've discovered. Be concise and helpful.`;

  return await callReplicate(prompt);
}

// Chat with AI assistant
export async function chatWithAI(
  userMessage: string,
  conversationHistory: ReplicateMessage[],
  userData: {
    migraines: MigrainEvent[];
    dayData: DayData[];
    stats?: MigraineStats;
  }
): Promise<string> {
  const topTriggers = getTopTriggers(userData.migraines, 3);
  const lastMigraine = userData.migraines.length > 0
    ? new Date(userData.migraines[userData.migraines.length - 1].date).toLocaleDateString()
    : "No data";

  const systemPrompt = `You are a helpful migraine tracking assistant. You help users understand their migraine patterns and provide supportive, evidence-based advice.

User's data summary:
- Total migraines tracked: ${userData.migraines.length}
- Days tracked: ${userData.dayData.length}
- Last migraine: ${lastMigraine}
- Top triggers: ${topTriggers || "Not enough data"}

Important guidelines:
- Be empathetic and supportive
- Never diagnose or prescribe medication
- Base responses on the user's actual data when possible
- Keep responses brief (2-4 sentences)
- If asked about medical advice, recommend consulting a healthcare provider
- Use a friendly, conversational tone`;

  // Build conversation context
  const conversationContext = conversationHistory
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");

  const fullPrompt = `${systemPrompt}

${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ""}User: ${userMessage}

Respond as the migraine assistant. Be brief and helpful.`;

  return await callReplicate(fullPrompt);
}

// Core function to call Replicate API
async function callReplicate(prompt: string): Promise<string> {
  try {
    // If no API key, return mock response
    if (!replicate) {
      console.log("No Replicate API key, using mock response");
      return getMockResponse(prompt);
    }

    console.log("Calling Replicate API with Claude 4 Sonnet...");

    const output = await replicate.run(MODEL, {
      input: {
        prompt: prompt,
        max_tokens: 1024,
        temperature: 0.7,
      },
    });

    // Join the output if it's an array
    return Array.isArray(output) ? output.join("") : String(output);
  } catch (error) {
    console.error("Error calling Replicate:", error);
    // Fallback to mock response on error
    return getMockResponse(prompt);
  }
}

// Mock responses for demo without API key
function getMockResponse(prompt: string): string {
  if (prompt.includes("daily insight") || prompt.includes("Recent migraine data")) {
    return "Your sleep pattern looks great! You've consistently gotten 7-8 hours over the past week. Consider having lunch on time today—you tend to get migraines when meals are delayed.";
  }

  if (prompt.includes("pattern") || prompt.includes("analyze")) {
    return "I've identified 3 key patterns: 1) Stress is your most common trigger (67% of migraines), 2) You often get migraines 2-3 hours after skipping lunch, 3) Your migraines typically occur between 2-4 PM.";
  }

  if (prompt.toLowerCase().includes("last migraine") || prompt.toLowerCase().includes("when")) {
    return "Your last migraine was on August 16th. That was 5 days ago. You've been tracking consistently, which is great for identifying patterns!";
  }

  if (prompt.toLowerCase().includes("trigger") || prompt.toLowerCase().includes("cause")) {
    return "Based on your data, your top triggers are: Stress (67%), Heat (45%), and Sleep deprivation (32%). Managing stress seems to be key for you.";
  }

  return "I'm here to help you understand your migraine patterns. You can ask me about your triggers, recent migraines, or patterns I've noticed in your data.";
}

// Helper functions
function getTopTriggers(migraines: MigrainEvent[], limit: number): string {
  const triggerCounts = new Map<string, number>();
  migraines.forEach((m) => {
    m.triggers.forEach((t) => {
      triggerCounts.set(t, (triggerCounts.get(t) || 0) + 1);
    });
  });
  return Array.from(triggerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([trigger, count]) => `${trigger} (${count})`)
    .join(", ");
}

function getTopSymptoms(migraines: MigrainEvent[], limit: number): string {
  const symptomCounts = new Map<string, number>();
  migraines.forEach((m) => {
    m.symptoms.forEach((s) => {
      symptomCounts.set(s, (symptomCounts.get(s) || 0) + 1);
    });
  });
  return Array.from(symptomCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([symptom, count]) => `${symptom} (${count})`)
    .join(", ");
}