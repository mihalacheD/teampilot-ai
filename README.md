# TeamPilot AI

**TeamPilot AI** is a web-based AI assistant built to help managers and small teams
organize work, track progress, and receive **cost-aware, AI-generated insights**
about their daily activity.

The product focuses on **practical AI usage**, caching, and structured outputs —
not just calling an API.

---

## 🚀 Key Features

### ✅ Task & Team Management
- Assign and track tasks per team member
- Task status, priority, and due dates
- Manager vs employee roles

### 🧠 AI-Powered Daily Summaries
- Server-side AI pipeline generating structured daily insights
- Clear separation between:
  - completed work
  - ongoing tasks
  - upcoming priorities
  - risks & alerts
- Designed for **manager decision-making**, not generic summaries

### 💸 AI Cost Optimization
- Daily AI summaries are **cached per day**
- Manual regeneration with explicit user action
- Regeneration count tracking to prevent abuse
- UI clearly indicates **cached vs freshly generated** summaries

### 📊 Insight-Driven Dashboard
- AI insights displayed in structured, readable sections
- Visual status indicators for cached / live AI data
- Clean UX focused on clarity, not AI hype

---

## 🏗️ Architecture Highlights

- **Server-side AI execution** (no client OpenAI calls)
- Structured AI outputs (JSON-first, UI-friendly)
- Prisma JSON fields for flexible AI data storage
- Rate-limit–aware AI pipelines
- Designed to scale without exploding API costs

---

## 🧪 AI Prompt & Data Strategy

- Deterministic, structured prompts
- Output mapped directly to UI components
- Cached summaries stored in MySQL as JSON
- Regeneration only when explicitly requested

---

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma + MySQL**
- **OpenAI API**
- **NextAuth**

---

## 🎯 Why TeamPilot AI?

This project demonstrates:
- Real-world AI product design
- Cost-aware AI implementation
- Server-side AI pipelines
- UX patterns for AI-powered dashboards
- Clean separation between AI logic, data, and UI

Built as a production-minded AI feature, not a demo.
