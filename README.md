# Autonomous Lead Gen Agent: Frontend UI

This is the user-facing client for the **Autonomous Lead Generation Agent**, a full-stack tool designed to automate B2B research and cold outreach. Built with React and Vite, this application features a premium dark-themed SaaS UI and utilizes advanced data streaming to render real-time agentic workflows.

## Live Demo
* **Frontend Application:** [Insert your Vercel Live URL here]
* **Backend API Repository:** [Insert your Backend GitHub URL here]

## Architecture & Tech Stack

**Core Technologies:**
* **Framework:** React.js bootstrapped with Vite for optimized production builds.
* **Hosting:** Deployed on Vercel for fast, global edge delivery.
* **Styling:** Custom CSS tailored for a modern, sleek, dark-mode B2B interface.

**API Integration & Streaming:**
* Communicates with a decoupled FastAPI Python microservice.
* Consumes **Server-Sent Events (SSE)** via Newline-Delimited JSON (NDJSON) to provide real-time feedback to the user without waiting for the entire LLM generation cycle to complete.

## Key Engineering Decisions

* **Stream Parsing (`ReadableStream`):** Traditional HTTP requests force the user to stare at a loading screen for 5-10 seconds while an LLM generates a response. To prevent this poor UX, the frontend utilizes the native browser `ReadableStream` API and `TextDecoder` to intercept chunked JSON data. 
* **Dynamic State Management:** As the backend yields discrete JSON chunks, the frontend dynamically updates a localized loading state buffer. This allows the user to see the agent's internal monologue in real-time (*"Scouting the web..."* ➔ *"Analyzing data..."* ➔ *"Drafting email..."*), transforming waiting time into an engaging product feature.
* **Graceful Degradation:** The stream parsing includes logic to handle broken or partial network chunks by maintaining a persistent buffer loop, preventing the React component from crashing during network latency spikes.

## Local Setup & Installation

**1. Clone the repository**
```bash
git clone [https://github.com/kinshuknarang/lead-gen-agent-frontend.git](https://github.com/kinshuknarang/lead-gen-agent-frontend.git)
cd lead-gen-agent-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Environment / API Connection**
Ensure your local Python backend is running. Open `src/App.jsx` and verify the fetch URL points to your local or deployed API.
*(If testing locally with FastAPI, ensure it points to `http://127.0.0.1:8000/chat`)*

**4. Run the development server**
```bash
npm run dev
```

## Author
* **Kinshuk** - Architect & Developer
