# 🌿 EcoLens AI: Hyper-Local Pollution Detection & Municipal Dispatch

**Build with Gemma: GDG Pwani Hackathon Entry**

Fusing citizen crowdsourcing with Gemma Multimodal Vision and Next.js 15 to neutralize neighborhood environmental hazards in real-time.

**🌐 Live Demo:** [annetdev.dpdns.org](https://annetdev.dpdns.org/) | [ecolens-ai-jade.vercel.app](https://ecolens-ai-jade.vercel.app)

**📂 Repository:** [github.com/AnnetGatende/ecolens-ai](https://github.com/AnnetGatende/ecolens-ai)



## 💡 The Problem

City-level environmental monitoring systems consistently miss localized micro-pockets of severe pollution—such as illegal waste dumping, toxic tire fires, or smog traps at busy road junctions—because municipal authorities lack street-level visibility. Traditional reporting relies on slow, manual phone calls or paper logging, leaving city dispatch operators blind to fast-moving ecological hazards.

A district officer in Likoni might receive multiple isolated phone calls regarding smoke with no way to prioritize, visualize, or act on them in real time. **EcoLens AI** closes this data gap by transforming crowdsourced citizen evidence into an automated, AI-verified Computer-Aided Dispatch (CAD) platform equipped with full CRUD controls and predictive environmental analytics.



## 🚀 Key Features & EcoLens Command OS

* 🤖 **Gemma Multimodal AI Engine:** Processes citizen-uploaded photos and descriptions to automatically classify pollution types, assess severity, calculate confidence scores, predict 24-hour Air Quality Index (AQI) spikes, and generate municipal action recommendations.
* 🛡️ **Manual Review Queue (<85% AI Confidence Firewall):** Acts as a safety layer for municipal operators. Reports where Gemma's AI confidence score falls below 85% are automatically held in a quarantine queue for admin review before being published to the public transparency map.
* 🗺️ **Embedded Live Command Map:** Integrates an interactive spatial monitoring view directly inside the admin dashboard (`/map?admin=true`), giving operators instant visual awareness of active municipal hot zones.
* 🧩 **Smart Geospatial Hotspot Clustering:** Combines Leaflet and Supercluster to aggregate raw GPS coordinates into human-readable neighborhood sectors (e.g., *"Likoni, Timbwani ward"*), eliminating alert fatigue.
* 📊 **Analytics & Trend Telemetry:** Powered by Recharts to display live incident distributions, active unit statuses, and regional pollution trends over time.
* 🌍 **Native Bilingual Support (English & Swahili):** Built specifically for local operators in Mombasa. Gemma natively generates parallel environmental summaries and advisories in both Swahili and English, controllable via a single UI sidebar toggle.
* 🚒 **Precision Dispatch & Full CRUD Controls:** Enables municipal teams to deploy targeted resources (e.g., water-mist cannons, cleanup crews), recall units, edit records, or purge invalid test submissions via secure database deletion pipelines.
* 📡 **Environment Telemetry Vault:** Diagnostic status monitor tracking server health, backend API keys, and external uplinks.



## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend & UI** | Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons |
| **Artificial Intelligence** | Google Gemma Multimodal API (Vision & Structured JSON) |
| **Database & Persistence** | Supabase (PostgreSQL) |
| **ORM** | Prisma |
| **Geospatial & Visualizations** | Leaflet, Supercluster, Reverse Geocoding, Recharts |
| **Deployment** | Vercel & Custom Domain (`annetdev.dpdns.org`) |



## 🧠 How Gemma Powers EcoLens

When a citizen submits a pollution report, Gemma acts as the core analytical brain:


[ Citizen Photo & Text ] 
          │
          ▼
[ Gemma Multimodal AI Engine ] ──(Strict Prompt Constraints)──► [ Structured JSON Output ]
                                                                        │
 ┌──────────────────────────────────────────────────────────────────────┴──────────────────────────────────┐
 │ • Hazard Classification (e.g., Toxic Waste Fire, Industrial Smog)                                       │
 │ • AI Confidence Score (e.g., 94%)                                                                       │
 │ • Severity Level (Low / Medium / High / Critical)                                                      │
 │ • Predicted 24-Hour AQI Spike                                                                          │
 │ • Municipal Action Advisory (e.g., Deploy Water-Mist Cannon)                                           │
 │ • Native Dual-Language Summary (Parallel English & Swahili Output)                                      │
 └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
[ PostgreSQL / Supabase ] ──► [ Command OS Dashboard & Live Map ]





## 🔑 Key Engineering Decisions

* **Strictly Structured LLM JSON Output:** To prevent unpredictable conversational output, system prompts lock Gemma into a deterministic analytical role. The backend validates and parses structured JSON metrics directly into serverless API pipelines.
* **Native Multilingual AI Output:** Rather than using client-side translation dictionaries, EcoLens leverages Gemma's native multilingual intelligence to generate parallel English and Swahili analytical assessments during the initial inference pass, keeping database records standardized while rendering fluent local terms.
* **Smart Grid Fallback for Unmapped Coordinates:** Unmapped legacy reports lacking ward metadata previously clumped into a single "Unknown Sector." A spatial coordinate grid fallback was engineered to group raw GPS coordinates into localized grid cells, ensuring every incident receives an accurate hotspot marker.
* **Precision Dispatch & Cascade Deletion:** Backend API queries target precise report ID arrays within clusters. A "Recall Unit" toggle alongside an admin DELETE pipeline allows operators to safely reverse accidental dispatches or purge test submissions without corrupting neighborhood data states.



## 🔒 Prototyping vs. Production Architecture

* **Active Real Data:** Citizen image uploads, Gemma multimodal visual processing, PostgreSQL persistence, geospatial clustering, and admin lifecycle state transitions run on **100% live data**.
* **Sensor Streams:** Environmental sensor feeds are simulated in the 1-day hackathon prototype. The backend is architected to transition seamlessly to live IoT feeds via official **OpenAQ API endpoints** and physical $PM_{2.5}$ / $PM_{10}$ sensors in production.
* **Security & Authentication:** For hackathon testing, the admin dashboard uses a demo PIN (`2026`). In production, administrative security will be decoupled behind server-side authentication gates and role-based access control (RBAC), keeping municipal dispatch tools hidden from public view.



## 🏁 Getting Started Locally

### Prerequisites

* Node.js (v18+) and npm installed.

### 1. Clone the Repository


git clone https://github.com/AnnetGatende/ecolens-ai.git
cd ecolens-ai



### 2. Install Dependencies


npm install



### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-supabase-postgres-connection-string"
DIRECT_URL="your-supabase-direct-postgres-connection-string"
GEMMA_API_KEY="your-gemma-api-key"



### 4. Run Database Migrations


npx prisma db push



### 5. Start the Development Server


npm run dev



Open [http://localhost:3000](http://localhost:3000) in your browser.



## 🎯 Usage Guide

* **Citizen View (`/`):** View the live community map. Navigate to **Report Pollution** to capture or upload a hazard photo with auto-detected GPS coordinates.
* **Municipal Dispatch Center (`/dashboard`):** Enter the demo PIN (`2026`). Review incoming reports, inspect low-confidence submissions in the **Manual Review Queue**, view the **Live Command Map**, monitor area analytics, deploy/recall units, or purge test logs.
* **AI Analysis Center (`/analysis`):** Inspect all environmental reports accompanied by Gemma's full AI threat assessments, localized into Swahili or English.



## 👩‍💻 Author

**Annet Gatende**

Full-Stack Developer | Mombasa, Kenya

* **GitHub:** [@AnnetGatende](https://github.com/AnnetGatende)
* **LinkedIn:** [Annet Gatende](https://www.linkedin.com/in/annetgatende/)

*Built with ❤️ for the Build with Gemma: GDG Pwani Hackathon*



## 📄 License

Licensed under the [Apache License, Version 2.0](https://www.google.com/search?q=LICENSE).