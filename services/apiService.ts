
import type { GuardianEvent } from '../types';

let eventSource: EventSource | null = null;

/**
 * Establishes a persistent connection to the backend event stream.
 * It will automatically attempt to reconnect if the connection is lost.
 * 
 * @param onEvent - The callback function to handle incoming events from the Guardian AI.
 * @returns A close function to manually terminate the connection.
 */
export const streamGuardianEvents = (onEvent: (event: GuardianEvent) => void): { close: () => void } => {
    // Ensure only one connection is active at a time
    if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close();
    }

    // Connect to the backend event stream endpoint
    // This assumes your backend serves events from this path.
    eventSource = new EventSource('/api/events');

    // Handle incoming messages from the stream
    eventSource.onmessage = (event) => {
        try {
            const guardianEvent: GuardianEvent = JSON.parse(event.data);
            onEvent(guardianEvent);
        } catch (error) {
            console.error('Failed to parse event from stream:', event.data, error);
            // Dispatch a log entry to the UI about the parsing error
            const errorLog: any = {
                type: 'log_entry',
                payload: {
                    level: 'CRITICAL',
                    message: `Data Error: Failed to parse incoming data stream. See browser console.`
                }
            };
            onEvent(errorLog);
        }
    };

    // Handle connection errors
    eventSource.onerror = () => {
        // EventSource handles reconnection automatically. We log this for debugging
        // and send a message to the UI to inform the user.
        console.warn('EventSource connection failed. The system will attempt to reconnect automatically.');
        const errorLog: any = {
            type: 'log_entry',
            payload: {
                level: 'WARN',
                message: `Connection to Guardian AI lost. Attempting to reconnect...`
            }
        };
        onEvent(errorLog);
    };
    
    // Handle successful connection opening
    eventSource.onopen = () => {
         const successLog: any = {
            type: 'log_entry',
            payload: {
                level: 'SUCCESS',
                message: `Live connection to Guardian AI Core established.`
            }
        };
        onEvent(successLog);
    }

    // Return a function to allow manual closing of the connection
    const close = () => {
        if (eventSource) {
            eventSource.close();
            eventSource = null;
            console.log('EventSource connection manually closed.');
        }
    };

    return { close };
};

/**
 * Sends a command to the Guardian AI backend.
 * 
 * @param command - The command to be executed (e.g., 'SET_SYSTEM_STATUS').
 * @param args - The arguments for the command.
 */
export const sendGuardianCommand = async (command: string, args: Record<string, any> = {}) => {
    try {
        const response = await fetch('/api/command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command, args }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to send command and could not parse error response.' }));
            throw new Error(errorData.message || `Command failed with status: ${response.status}`);
        }
        // The command was sent successfully. The backend will broadcast any resulting state changes
        // through the EventSource stream. No need to process a response here.
        
    } catch (error) {
        console.error('Failed to send command to Guardian AI:', error);
        // In a real-world scenario, you might want to dispatch an error to the UI here
        // to inform the user that their command failed to send. For now, we rely on console logs
        // and the main EventSource connection status for user feedback.
    }
};
