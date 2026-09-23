# উপলব্ধি · RAG workspace

A polished, responsive React + Vite frontend prototype for a grounded RAG workspace.

# Hosted Link(For Devolopment Mode)
Hosted Link : https://upolabdhi-dt6t.onrender.com/

```bash
# Server Diagram
Frontend --> LBServer --> {Backend1, Backend2, Backend3, Backend4}    //A simple Diagram For Understanding...

```

## Run locally

```bash
npm install
npm run dev
```

The Vite server is configured for the Arena live preview host.

## Included flows

- Animated marketing landing page answering **What we do / What you get / How to start**
- CSS-built waving assistant robot inspired by the supplied reference image
- Sign in and account creation flows with OTP verification UI
- First-run personalization / onboarding questions
- Authenticated landing page with upload, document bucket, and start asking actions
- Dashboard with usage stats, recent documents, recent questions, and RAG pipeline health
- Multi-format document library for PDF, DOCX, TXT, and OCR/image files
- Simulated processing status for extraction, chunking, embeddings, and vector indexing
- Document overview, glossary preview, and processing map drawer
- Grounded chat with multi-document context, preset questions, streaming response simulation, citations, PDF source viewer/highlighting, copy, regenerate, and thumbs feedback
- Chat history with search, selective export, complete export, and deletion
- AI study/work planner, profile, response tone/instructions, privacy, storage, and danger-zone settings

This build uses local UI state and browser storage for the demo experience. The screens are ready to wire to FastAPI REST endpoints for production ingestion, retrieval, auth, storage, and model calls.
