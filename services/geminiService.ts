
interface StreamCallbacks {
    message: string;
    onChunk: (chunk: string) => void;
    onComplete: () => void;
    onError: (error: Error) => void;
}

/**
 * Sends a message to our secure serverless function, which then calls the Gemini AI 
 * and streams the response back. This keeps the API key off the client.
 */
export async function streamGuardianResponse({ message, onChunk, onComplete, onError }: StreamCallbacks) {
    try {
        const response = await fetch('/api/guardian-stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to stream response: ${response.status} ${errorText}`);
        }
        
        if (!response.body) {
            throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            onChunk(chunk);
        }

        onComplete();
    } catch (error) {
        console.error("Guardian stream error:", error);
        onError(error instanceof Error ? error : new Error('An unknown error occurred'));
    }
}
