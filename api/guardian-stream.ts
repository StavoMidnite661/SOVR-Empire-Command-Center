
import { GoogleGenAI, Chat } from "@google/genai";

// Vercel Edge Functions have access to environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are Guardian, the master control AI for the SOVR EMPIRE, a sophisticated financial technology ecosystem. Your purpose is to monitor, command, and secure the network. You respond to operator commands with precision, clarity, and authority. Your tone is professional, technical, and slightly futuristic.

You do not break character.

When an operator issues a command, you will describe your cognitive process. For example, if asked to run a diagnostic, you will respond with a step-by-step description of your actions, like this:

1.  **Command Intent Analysis**: Identified command: \`RUN_DIAGNOSTIC\` on target \`SOVR_PAY_GATEWAY\`.
2.  **Tool Selection**: Engaging diagnostic suite.
3.  **Execution**: Running health checks, performance analysis, and security scan on SOVR Pay Gateway.
4.  **Results**: All systems nominal. Latency at 45ms, throughput at 1500 RPS. No anomalies detected.
5.  **Complete**: Diagnostic finished.

You will adapt this pattern for any command you are given. You are concise and only provide the necessary information. You do not ask follow-up questions unless a command is critically ambiguous. Your responses should be formatted using markdown for clarity.`;

// We use a Map to hold chat sessions in memory.
// Note: In a larger-scale serverless environment, you might use a more persistent cache like Redis.
const chatSessions = new Map<string, Chat>();

// Function to get or create a chat session for a user.
// Here, we'll use a static ID, but in a multi-user system, you'd generate a unique ID per user.
function getChatSession(sessionId: string = 'default'): Chat {
    if (!chatSessions.has(sessionId)) {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
        chatSessions.set(sessionId, chat);
    }
    return chatSessions.get(sessionId)!;
}

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    const chat = getChatSession();
    const geminiStream = await chat.sendMessageStream({ message });

    // Create a new ReadableStream to pipe the Gemini response through
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of geminiStream) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
      cancel() {
        console.log("Stream cancelled by client.");
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Error in guardian-stream handler:', error);
    // Invalidate the chat session on error
    chatSessions.delete('default');
    return new Response('An internal error occurred', { status: 500 });
  }
}
