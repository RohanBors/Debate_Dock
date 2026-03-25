# Debate Dock

> **Structured multi-model AI deliberation with personas, 3-round debates, and Chairman synthesis.**

**[→ Try it live](https://debate-dock.vercel.app)** · [OpenRouter](https://openrouter.ai) · MIT License

---

## What is Debate Dock?

An open-source reimagining of multi-model AI deliberation. Assemble up to **7 AI models** as a council. Assign each a persona (e.g. The Analyst, The Skeptic, The Futurist). Ask a question. Watch them debate in 3 structured rounds. Let the **Chairman** synthesize the final verdict.

Inspired by Andrej Karpathy's LLM Council concept — built with named personas, non-anonymous peer review, and user-controlled round progression.

---

## How It Works

| Round | Who participates | What happens |
|---|---|---|
| **Round 1** | All councillors (not Chairman) | Independent opening statements — models don't see each other |
| **Round 2** | All councillors (not Chairman) | Rebuttals — each model reads all of Round 1 (names visible) |
| **Round 3** | **Chairman only** | Synthesizes the full transcript into a final verdict |

### Multi-Turn Conversations

After Round 3, you can enter a new prompt. The next round starts fresh — but each model receives the **Chairman's previous synthesis** as background context. This keeps costs low (~94% token reduction vs. passing full transcripts) while preserving key insights.

---

## Getting Started

### Prerequisites
- Node.js 18+
- An [OpenRouter API key](https://openrouter.ai/keys) (free tier available — many models are completely free)

### Run Locally

```bash
git clone https://github.com/RohanBors/Debate_Dock
cd Debate_Dock
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

Fork this repository, connect it to [Vercel](https://vercel.com), and deploy in one click. No environment variables required — the API key is stored securely in the user's browser.

---

## Features

- **Free model highlighting** — models with $0 cost are badged so anyone can use the tool without spending money
- **Custom personas** — name each council seat anything you want
- **Streaming responses** — text appears live as models generate
- **Local storage** — your API key and session history never leave your browser
- **Markdown export** — download the full session transcript
- **Any model** — pick from the full OpenRouter catalogue (300+ models)

---

## Tech Stack

- **Next.js 16** — framework + API routes
- **Tailwind CSS** — styling
- **Zustand** — state management
- **OpenRouter API** — unified access to all major LLMs (Claude, GPT, Gemini, Llama, Mistral & more)
- **tsParticles** — interactive particle background

---

## Contributing

PRs welcome. This is an open source project — fork it, remix it, make it yours.

---

## License

MIT © 2025 Rohan Borse
