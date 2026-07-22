# EcoLens AI: Hyper-Local Pollution Detection & Municipal Dispatch

> **Build with Gemma Pwani Hackathon Entry**  
> Fusing citizen crowdsourcing with Gemma 4 Vision and Next.js to neutralize neighborhood environmental hazards in real-time.

---

## 💡 The Problem
City-level environmental monitoring systems often fail to catch micro-pockets of severe pollution—such as illegal waste dumping, toxic industrial burning, or localized smog traps. Traditional municipal workflows rely on slow, manual reporting, leaving city operators blind to fast-moving ecological hazards. 

**EcoLens AI** closes this data gap by transforming user-submitted smartphone photos into an automated, AI-verified, and actionable Computer-Aided Dispatch (CAD) system for city municipal teams.

---

## 🚀 Key Features

* **AI Visual Threat Analysis:** Leverages Gemma 4's multimodal capabilities to analyze user-uploaded images, automatically detecting hazard types, calculating severity ratings, and forecasting 24-hour Air Quality Index (AQI) shifts.
* **Neighborhood Hotspot Clustering:** Uses spatial mapping and aggregation to group raw coordinates into readable sectors, eliminating alert fatigue for municipal operators.
* **Secure Municipal Command Center:** Features a role-based protected admin gate allowing dispatchers to review incoming citizen reports, deploy cleaning units, or resolve hazards in real-time.
* **Live Status Tracking:** Built with instant state updates so citizens and city officials can track hazard status from *Reported* to *Dispatched* and *Resolved*.

---

## 🛠️ Tech Stack

* **Frontend & Framework:** Next.js (App Router), React, Tailwind CSS
* **Artificial Intelligence:** Gemma 4 Multimodal API (Vision & Structured JSON Generation)
* **Database & ORM:** Supabase (PostgreSQL), Prisma ORM
* **Geospatial & Mapping:** Leaflet / Custom map cluster integration

---

## 📂 Project Architecture

```text
ecolens-ai/
├── app/                  # Next.js App Router (Dashboard, Map, Assistant, & Admin Routes)
├── components/           # Modular UI components (AnalysisCenter, Heroes, Metrics, Recommendations)
├── hooks/                # Custom React hooks for dynamic data fetching and state sync
├── lib/                  # Prisma client and core utility functions
├── prisma/               # Database schema and migration files
└── public/               # Static assets and branding images
🏁 Getting Started Locally
Prerequisites
Make sure you have Node.js (v18+) and npm installed on your machine.

1. Clone the Repository
Bash
git clone [https://github.com/AnnetGatende/ecolens-ai.git](https://github.com/AnnetGatende/ecolens-ai.git)
cd ecolens-ai
2. Install Dependencies
Bash
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add your required keys (Supabase database URL, Prisma keys, and Gemma API access tokens):

Code snippet
DATABASE_URL="your-supabase-postgres-connection-string"
NEXT_PUBLIC_GEMMA_API_KEY="your-gemma-api-key"
4. Run Database Migrations
Bash
npx prisma db push
5. Run the Development Server
Bash
npm run dev
Open http://localhost:3000 in your browser to view the application.

🎯 Usage & Municipal Access
Citizen View: Navigate to the main home dashboard to upload pollution evidence, view active neighborhood maps, and check real-time air quality metrics.

Municipal Dispatch Gate: Access the secure admin portal using the master administrative PIN (2026) to evaluate incoming data logs, trigger tactical field units, or log resolved interventions.

📄 License
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.