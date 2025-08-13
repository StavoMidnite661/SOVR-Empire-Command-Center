# SOVR EMPIRE COMMAND & CONTROL

A state-of-the-art dashboard for monitoring the SOVR financial ecosystem. This interface serves as the central nervous system for all SOVR services, providing real-time metrics, system controls, and an integrated Guardian AI for security and operational management.

## Core Features

*   **Real-Time Monitoring**: Visualize the entire service mesh with the **Live Network Topology** and drill down into individual service performance with the **Live Metrics Dashboard**.
*   **Guardian AI Console**: Interact directly with the Guardian AI via a command-line chat interface. All commands are processed through a **Cognitive Process Visualizer**, showing the AI's step-by-step reasoning.
*   **Comprehensive System Control**: Manage the entire system's state with master power controls (Active, Standby, Maintenance) and run on-demand **Diagnostic Tests**.
*   **Automated Defense System**: Configure and monitor threat-response protocols for events like DDoS attacks and anomalous API usage.
*   **Security & Compliance**: Get a high-level view of the entire backend with the **System Architecture** diagram. Monitor real-time **Compliance Checks** and verify security token headers.
*   **Precognitive Analysis**: View and act upon "Temporal Echos"—AI-generated predictions of potential future threats and opportunities.

## Architecture

This is a frontend-only application built with:

*   **Framework**: React 19
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Charting**: Recharts
*   **State Management**: React Hooks (`useState`, `useCallback`) with Immer for immutable updates.

### Live Mode Operation

The application is designed to connect to a live backend service. It assumes the backend exposes two primary endpoints:

1.  **`/api/events`**: A Server-Sent Events (SSE) stream that pushes `GuardianEvent` objects to the client. This connection is persistent and is used for all real-time state updates.
2.  **`/api/command`**: A POST endpoint that accepts commands to be processed by the Guardian AI.

## Running the Application

To run the Command & Control console, you must serve the `index.html` file from a static file server. The application is a Single Page Application (SPA) and does not require a build step.

1.  **Prerequisite**: A backend service implementing the [API Specification](#api-specification) must be running and accessible from the same host that serves the frontend files.
2.  **Serve the files**: Use any simple HTTP server to serve the project directory. For example, using Python:
    ```bash
    python -m http.server
    ```
3.  **Access**: Open your browser and navigate to the server's address (e.g., `http://localhost:8000`).

## API Specification

For the C&C frontend to function correctly, the backend service must adhere to the following API contract.

### Server-Sent Events (`/api/events`)

The backend should stream JSON objects, where each message is a `GuardianEvent` as defined in `types.ts`.

**Example Event:**
```json
{
  "type": "log_entry",
  "payload": {
    "level": "INFO",
    "message": "User authenticated successfully."
  }
}
```

Key event types are defined in `types.ts` and include:
*   `full_state_sync`: Sent on initial connection to provide the entire system state.
*   `state_update`: A partial update to the system state.
*   `metric_update`: A new data point for a service's metrics chart.
*   `log_entry`: A new line item for the event log.
*   `chat_message`: A new message for the Guardian AI chat.
*   `cognitive_step`: A step in the AI's command processing flow.

### Command Endpoint (`/api/command`)

*   **Method**: `POST`
*   **Content-Type**: `application/json`

The frontend will send a JSON object with the following structure:

**Request Body:**
```json
{
  "command": "SET_SYSTEM_STATUS",
  "args": {
    "status": "ACTIVE"
  }
}
```

The `command` is a string corresponding to a `GuardianCommand` enum member, and `args` is an object containing the necessary parameters for that command. The backend is responsible for processing this command and broadcasting any resulting state changes over the `/api/events` stream. The frontend does not expect a meaningful response body from the POST request itself, only a `2xx` status code for success.
