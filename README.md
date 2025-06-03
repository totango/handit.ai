<p align="center">
  <img width="903" alt="Screenshot 2025-05-21 at 11 09 55 AM" src="https://github.com/user-attachments/assets/e40d816e-3b2f-4abc-9bfb-400528db2b0d" />
</p>


# 🖐️ Handit - The Open Source Engine that Auto-Improves Your AI

Handit evaluates every agent decision, auto-generates better prompts and datasets, A/B-tests the fix, and lets you control what goes live.

Handit is a **developer-first, open-source platform that automatically improves your AI agents** in real-world settings.  
It's designed to **evaluate**, **auto-generate improvements**, and **test fixes** for any AI agent you've deployed.

This isn't another wrapper.  
This is the auto-improvement engine your agents have been missing.

---

## ✨ What Handit Delivers

Handit automatically improves every part of your AI agents—evaluating decisions, generating fixes, and testing improvements.

- 🔍 **Evaluate Everything**  
  Automatically assess every agent decision—inputs, outputs, tool calls, reasoning—across every node. Detect issues, hallucinations, and performance gaps in real-time.

- 🤖 **Auto-Generate Improvements**  
  Automatically create better prompts, datasets, and configurations based on detected issues. Let AI improve your AI with targeted fixes for specific failure patterns.

- 🧪 **A/B Test Automatically**  
  Test improvements against your current setup with intelligent A/B testing. Compare performance, measure impact, and validate fixes before they go live.

- 🎛️ **Control What Goes Live**  
  You decide what improvements to deploy. Review auto-generated fixes, approve changes, and roll back if needed. Full control over your agent's evolution.

- ✍️ **Version Everything**  
  Track every change, improvement, and rollback. Complete version control for prompts, datasets, and configurations—by node, model, or project.

> If your agent is in production, Handit automatically finds what's broken and fixes it—with your approval.

---

## 📅 Roadmap

| Week | Focus                                               | Status         |
|------|------------------------------------------------------|----------------|
| 1    | Backend foundation + infrastructure                 | ✔️ Done |
| 2    | Prompt versioning + A2A routing logic               | ✔️ Done |
| 3    | Auto-evaluation + insight generation                | ✔️ Done |
| 4    | Deployment setup + UI + public release              | ✔️ Done |

---

## 🧪 Project Status

Handit is now open source and in active development!

This repo is live—but the full system is still under construction.  
Early adopters and contributors are welcome to **follow the build**, **open issues**, and **help shape what comes next**.

---

## 🚀 Getting Started

Handit is designed to be easy to run locally with Docker Compose. You can get both the backend (API) and frontend (dashboard) running with a single command.

### 1. Prerequisites
- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/)
- (Optional for advanced users) [Node.js](https://nodejs.org/) and [PostgreSQL](https://www.postgresql.org/)

### 2. Clone the Repository
```bash
git clone https://github.com/handit-ai/handit.ai.git
cd handit.ai
```

### 3. Environment Variables
Create a `.env` file in the root directory (or set the variables in your shell):
```
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```
You can also add any other environment variables required by the API or dashboard.

### 4. Run in Development Mode
This uses `docker-compose.dev.yml` for hot-reloading and local development:
```bash
docker compose -f docker-compose.dev.yml up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001/api](http://localhost:3001/api)
- Database: localhost:5432 (Postgres)
- Redis: localhost:6379

### 5. Run in Production Mode
This uses `docker-compose.yml` for a production-like environment:
```bash
docker compose -f docker-compose.yml up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001/api](http://localhost:3001/api)

### 6. Manual Local Setup (Advanced)
If you want to run the backend and frontend separately (without Docker):
- Install dependencies in each app:
  ```bash
  cd apps/api && npm install
  cd ../dashboard && npm install
  ```
- Start Postgres and Redis locally, and set up your `.env` files.
- Run the backend:
  ```bash
  cd apps/api
  npm run dev
  ```
- Run the frontend:
  ```bash
  cd apps/dashboard
  npm run dev
  ```

---

## 📚 Documentation

- Docs and hosted playground coming soon  
- For updates, follow the creators:
  - [Cristhian Neira](https://www.linkedin.com/in/cristhian-neira)
  - [Oliver Tex](https://www.linkedin.com/in/oliver-tex/)
    
---

## ✏️ Contributing

Want to help build the future of LLM agent optimization?  
We'll soon add:

- `CONTRIBUTING.md`
- Open issues
- Early test environments
- Handit SDKs

Join the Discord and say hi: <a href="https://discord.gg/fnWyEC4t" target="_blank">https://discord.gg/fnWyEC4t</a>

---

## 👥 Contributors

Thanks to everyone helping bring Handit to life:

<a href="https://github.com/handit-ai/handit.ai/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=handit-ai/handit.ai" />
</a>


> Want to appear here? Star the repo, follow along, and make your first PR 🙌

---

## 📄 License

MIT © 2025 – Built with 💡 by the Handit community


