
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// The API key is guaranteed to be available in the execution environment.
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


let chatSession: Chat | null = null;

function getChatSession(): Chat {
    if (!chatSession) {
        chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
    }
    return chatSession;
}


interface StreamCallbacks {
    message: string;
    onChunk: (chunk: string) => void;
    onComplete: () => void;
    onError: (error: Error) => void;
}

/**
 * Sends a message to the Gemini AI and streams the response.
 */
export async function streamGuardianResponse({ message, onChunk, onComplete, onError }: StreamCallbacks) {
    try {
        const chat = getChatSession();
        const stream = await chat.sendMessageStream({ message });

        for await (const chunk of stream) {
            onChunk(chunk.text);
        }

        onComplete();
    } catch (error) {
        console.error("Gemini API stream error:", error);
        // Invalidate the chat session on error, so a new one is created next time.
        chatSession = null; 
        onError(error instanceof Error ? error : new Error('An unknown error occurred'));
    }
}