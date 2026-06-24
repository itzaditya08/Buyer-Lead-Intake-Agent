# AgentMira Case Study: Architectural Breakdown & Engineering Judgment
**Role:** AI Product Engineer

## 1. Executive Summary
This document outlines the architectural decisions, trade-offs, and edge-case handling implemented in the Buyer Lead Intake Agent. The core objective was to build a resilient, agentic workflow that goes beyond a "thin LLM wrapper" to deliver mathematically accurate, secure, and highly actionable Lead Briefs to human realtors.

## 2. Agent Design & Architecture
Rather than relying on a single mega-prompt to parse text, search data, and format output, I designed a **Multi-Step State Machine**.

1. **Security Interceptor (LLM):** Scans the raw input exclusively for prompt injection, malicious overrides, or system manipulation.
2. **Constraint Extraction (LLM + Pydantic):** Parses the sanitized text and forces the LLM to output a strict JSON schema containing variables like `budget_max`, `bedrooms_min`, and `must_haves`.
3. **Deterministic Search Tool (Python/Pandas):** The agent drops out of the LLM context to execute programmatic filtering on the `miami_mls_listings.csv`. This guarantees that a recommended property strictly adheres to budget limits without LLM arithmetic hallucination.
4. **Fallback & Reconciliation Engine (Logic):** If the tool finds 0 matches (e.g., the constraints are impossible), a logic loop triggers. It systematically relaxes constraints (dropping amenities, expanding the budget by 30%) and re-queries the database to find the closest market alternatives.
5. **Synthesis (LLM):** The final step combines the original intent, structured data, and pandas results to draft the executive summary and realtor email script.

## 3. Engineering Judgment & Overcoming Production Bottlenecks
During development, a critical bottleneck emerged: **Third-Party API Rate Limits**. 
The Gemini Free Tier restricts throughput to 15 Requests Per Minute (RPM). Because the pipeline requires up to 3 LLM calls per lead, processing a batch of 12 leads via a synchronous web request caused catastrophic `429 RESOURCE_EXHAUSTED` errors and UI timeouts. 

**The Solution: Decoupled Asynchronous Processing**
To ensure 100% system uptime and a zero-latency UX for the realtor, I decoupled the generation logic from the web presentation layer:
* **The Offline Worker:** I built `generate_briefs_offline.py`, a standalone script that safely processes leads in the background. It implements intelligent backoff strategies, catching `429` errors, sleeping, and retrying until the structured JSON briefs are safely written to a local datastore.
* **The Real-Time UI:** The FastAPI server and React frontend act as a lightning-fast presentation layer, fetching the precomputed briefs via a paginated endpoint (`skip`/`limit`). This mirrors enterprise architectures where heavy AI batch jobs are handled by Celery/Redis queues, not synchronous HTTP requests.

## 4. Trade-offs & Code Quality Decisions
* **In-Memory CSV vs. Vector Database:** Given the dataset size (~300 rows), deploying Pinecone or a full RAG pipeline with chunking would be severe architectural over-engineering. Loading the dataset into Pandas allows for lightning-fast, 100% accurate exact-match filtering.
* **Separation of Concerns:** The backend API strictly handles data structuring and serving, while the React/Tailwind frontend dynamically handles rendering logic based on the presence of data flags (e.g., rendering warning banners only if `security_flag` is true).

## 5. Future Scope & Scalability
If preparing this system for enterprise-scale production at AgentMira, I would prioritize:
1. **Hybrid Retrieval Systems:** As the MLS data grows to 100,000+ rows, I would migrate the backend to PostgreSQL for hard structured queries combined with a Vector DB (pgvector) to handle semantic "vibe" requests.
2. **True Message Queues:** Replacing the offline Python script with AWS SQS or Redis/Celery workers to distribute the AI processing load.
3. **CRM Webhooks:** Bypassing a custom dashboard entirely to push the generated JSON briefs directly into the realtor’s existing CRM (Follow Up Boss, Salesforce).