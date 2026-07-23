# 🌿 EcoLens AI: Hyper-Local Pollution Detection & Municipal Dispatch

> **Build with Gemma: GDG Pwani Hackathon Entry**  
> Fusing citizen crowdsourcing with Gemma 4 Vision and Next.js to neutralize neighborhood environmental hazards in real-time.

**🌐 Live Demo:** [annetdev.dpdns.org](https://annetdev.dpdns.org/) | [ecolens-ai-jade.vercel.app](https://ecolens-ai-jade.vercel.app)

---

## 💡 The Problem

City-level environmental monitoring systems often fail to catch micro-pockets of severe pollution—such as illegal waste dumping, toxic industrial burning, or localized smog traps at busy junctions. Traditional municipal workflows rely on slow, manual reporting, leaving city operators blind to fast-moving ecological hazards. 

A district officer in Likoni currently receives multiple isolated fire reports via phone calls with no way to prioritize, visualize, or act on them in real-time. **EcoLens AI** closes this data gap by transforming user-submitted smartphone photos into an automated, AI-verified, and actionable Computer-Aided Dispatch (CAD) system for city municipal teams.

---

## 🚀 Key Features

*   **🤖 Gemma 4 AI Visual Threat Analysis:** Leverages Gemma 4's multimodal (vision + text) capabilities to analyze citizen-uploaded images, automatically detecting hazard types, calculating severity ratings, predicting 24-hour Air Quality Index (AQI) spikes, and generating health risk advisories.
*   **🗺️ Neighborhood Hotspot Clustering:** Uses spatial mapping and reverse-geocoding to group raw GPS coordinates into readable neighborhood sectors (e.g., "Likoni, Timbwani ward"), eliminating alert fatigue for municipal operators.
*   **🚒 Secure Municipal Command Center:** Features a role-based protected admin gate allowing dispatchers to review incoming citizen reports, deploy water-mist cannons or cleanup crews, and resolve hazards in real-time.
*   **🌍 Full Bilingual Support (English & Swahili):** Built from the ground up for Mombasa's local community. Gemma 4 generates its environmental summaries and advisories dynamically, supported by frontend dictionary mapping for UI components. 
*   **📊 Live Status Tracking:** Citizens and city officials can track hazard status from *Reported* → *Dispatched* → *Resolved* with instant state updates.
*   **📡 Multi-Source Data Fusion:** Combines citizen-uploaded visual evidence with OpenAQ sensor readings and Sentinel-2 satellite imagery references for comprehensive environmental intelligence.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend & Framework** | Next.js 15 (App Router), React, Tailwind CSS |
| **Artificial Intelligence** | Gemma 4 Multimodal API (Vision & Structured JSON) |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Prisma |
| **Geospatial & Mapping** | Leaflet, Supercluster, Reverse Geocoding |
| **Deployment** | Vercel |

---

## 🧠 How Gemma 4 Powers EcoLens

When a citizen uploads a pollution photo, Gemma 4 performs a full multimodal analysis instantly:

1. **Input:** Citizen uploads photo & description.
2. **Analysis:** Gemma 4 Vision processes the image context.
3. **Output:** Returns strictly typed JSON containing:
   * *Pollution Type* (e.g., Wildfire Smoke, Garbage Burning)
   * *AI Confidence Score* (e.g., 98%)
   * *Severity Level* (Low / Medium / High / Extreme)
   * *Predicted 24-hour AQI* 
   * *Health Risk Advisory & Municipal Recommendation*
4. **Action:** Data is written to Supabase, mapped to the dashboard, and a municipal operator dispatches resources to the exact coordinates.

---

## 🔑 Key Engineering Decisions

*   **Structured JSON from Gemma 4:** Rather than accepting conversational text, the system prompt is heavily engineered to force Gemma into a strict analytical role, ensuring it always returns parsable JSON metrics that the frontend can render reliably.
*   **Frontend Translation Dictionary:** To maintain database integrity while supporting a fully bilingual UI, incident categories are standardized in the database and translated client-side via a dynamic mapping function.
*   **Smart Grid Fallback for Geospatial Clustering:** Legacy reports lacking exact neighborhood names previously grouped into a single "Unknown Sector." A coordinate grid fallback system was built to group unmapped data by localized grid cells, ensuring every incident gets its own accurate hotspot marker.
*   **Precision Dispatch Architecture:** Engineered API queries target precise report ID arrays and include a "Recall Unit" toggle, allowing operators to safely reverse dispatch mistakes without corrupting neighborhood data states.

---

## 🏁 Getting Started Locally

**Prerequisites:** Node.js (v18+) and npm installed.

**1. Clone the Repository**
git clone [https://github.com/AnnetGatende/ecolens-ai.git](https://github.com/AnnetGatende/ecolens-ai.git)
cd ecolens-ai

2. Install Dependencies
npm install

3. Configure Environment Variables
Create a .env file in the root directory:

    DATABASE_URL="your-supabase-postgres-connection-string
 
    NEXT_PUBLIC_GEMMA_API_KEY="your-gemma-api-key"

4. Run Database Migrations

    npx prisma db push

5. Start the Development Server

    npm run dev
    Open http://localhost:3000 in your browser.


🎯 Usage Guide

   Citizen View: Navigate to the home page to see live network intelligence. Go to Report Pollution to upload a photo; GPS coordinates       are auto-detected.

   Municipal Dispatch Center: Access /dashboard and enter the demo PIN: 2026. Review incoming citizen reports, expand sectors to see         Gemma's AQI forecasts, and deploy resources.

  AI Analysis Center: Visit /analysis to see all reports with Gemma's full environmental assessments, localized into Swahili or English.

👩‍💻 Author
Annet Gatende

 Full-Stack Developer | Mombasa, Kenya

 GitHub:[@AnnetGatende](https://github.com/AnnetGatende)

 LinkedIn:[Annet Gatende](https://www.linkedin.com/in/annetgatende/)

Built with ❤️ for the Build with Gemma: GDG Pwani Hackathon — July 31, 2026

📄 License
Licensed under the Apache License, Version 2.0 — see the LICENSE file for details.
