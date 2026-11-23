# 🌱 AgriCyber — Frontend Dashboard

<div align="center">

**Real-time monitoring dashboard for autoencoder-based anomaly detection in IoT irrigation systems**

[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646cff.svg)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8.svg)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf.svg)](https://recharts.org)

_Protecting East African Smart Agriculture from Cyber Threats_

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Getting Started](#-getting-started)
- [Backend URL](#-backend-url)
- [Project Structure](#-project-structure)
- [Using the Attack Simulator](#-using-the-attack-simulator)
- [Deployment](#-deployment)
- [Scripts](#-scripts)
- [Related Repository](#-related-repository)

---

## 🔍 Overview

This is the web interface for **AgriCyber**, a cybersecurity system for smart irrigation. The Flask backend simulates soil sensors and runs every reading through a trained autoencoder. A reading the model can't reconstruct well is flagged as a likely cyber-attack, such as an attacker injecting false sensor values.

The dashboard lets an operator:

- Watch soil moisture, soil temperature and the irrigation valve live
- See an alert as soon as the model flags an anomaly, along with its anomaly score
- Simulate attacks on a sensor and watch the detection respond

**Live backend:** https://agricyber.onrender.com

---

## ✨ Features

| Feature                  | Description                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| 🔐 **Login**             | Simple operator login against the backend's `/api/login`                                    |
| 📟 **Live sensor cards** | Current soil moisture (%), soil temperature (°C) and irrigation valve state (open / closed) |
| 📈 **Live charts**       | Moisture, temperature and valve status over time (last 50 readings), built with Recharts    |
| 🚨 **Anomaly alert**     | Red banner with the anomaly score whenever the autoencoder flags a reading                  |
| ⚔️ **Threat simulation** | Inject an offset of −30 to +30 into moisture or temperature, then stop it, from the browser |
| 🔄 **1-second polling**  | The dashboard refreshes readings from the backend every second                              |

---

## ⚙️ How It Works

```
┌─────────────────────┐   GET /api/readings (every 1 s)   ┌──────────────────────────┐
│                     │ ────────────────────────────────▶ │                          │
│   React dashboard   │                                   │      Flask backend       │
│   (this repo)       │   POST /api/simulate-attack       │  sensor simulation +     │
│                     │ ────────────────────────────────▶ │  autoencoder detection   │
│                     │                                   │                          │
│                     │   POST /api/login                 │                          │
│                     │ ────────────────────────────────▶ │                          │
└─────────────────────┘                                   └──────────────────────────┘
```

1. The operator logs in. `Login.jsx` posts the credentials to `/api/login`.
2. `Dashboard.jsx` polls `/api/readings` every second. The response holds moisture, temperature, valve state, `anomaly_detected` and `anomaly_score`.
3. The sensor cards and charts update with each reading. When `anomaly_detected` is `true`, the alert banner appears.
4. `AttackSimulator.jsx` posts to `/api/simulate-attack` to start or stop shifting a sensor's values, so you can see how the model reacts.

**Example `/api/readings` response:**

```json
{
  "moisture": 42.35,
  "temperature": 25.12,
  "valve": 0,
  "timestamp": "2026-11-23T15:30:00.000000",
  "anomaly_detected": false,
  "anomaly_score": 0.008234
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite 7)
- npm

### Run locally

```bash
# 1. Clone the repository
git clone https://github.com/charmainemimie/frontend_autoencoder_anomaly_detection_irrigation_iot.git
cd frontend_autoencoder_anomaly_detection_irrigation_iot

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

`npm run dev` talks to a backend running on your machine at `http://localhost:5000`. Start it with `python app.py` in the [backend repo](https://github.com/charmainemimie/backend_autoencoder_anomaly_detection_irrigation_iot). To use the live Render backend during development instead, see the next section.

### Demo login

| Username    | Password       |
| ----------- | -------------- |
| `agricyber` | `agricyber123` |

The password can be changed by setting `DEMO_PASSWORD` on the backend.

---

## 🔗 Backend URL

Every API call uses `API_URL` from `src/config.js`, which is chosen like this:

| Situation                       | Backend used                                      |
| ------------------------------- | ------------------------------------------------- |
| `npm run dev`                   | `http://localhost:5000` (from `.env.development`) |
| `npm run build`, no variable    | `https://agricyber.onrender.com`                  |
| `VITE_API_URL` set at build/dev | Whatever you set it to                            |

To point the app at a different backend:

```bash
# Production build against another backend
VITE_API_URL=https://your-backend.example.com npm run build

# Dev server against the live Render backend
VITE_API_URL=https://agricyber.onrender.com npm run dev
```

> **Note:** The backend runs on Render's free plan, which sleeps after about 15 minutes without traffic. The first request after that can take up to a minute while it wakes up, so the dashboard may look empty briefly.

---

## 📁 Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── Login.jsx            # Login form → POST /api/login
│   │   ├── Dashboard.jsx        # Polls /api/readings, alert banner, layout
│   │   ├── SensorCard.jsx       # Single live metric card
│   │   ├── SensorChart.jsx      # Recharts line chart for one metric
│   │   └── AttackSimulator.jsx  # Threat Simulation Panel → POST /api/simulate-attack
│   ├── config.js                # API_URL (backend base URL)
│   ├── App.jsx                  # Switches between Login and Dashboard
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind CSS
├── .env.development             # VITE_API_URL for local development
├── index.html
├── vite.config.js               # Vite + React + Tailwind plugins
└── package.json
```

---

## ⚔️ Using the Attack Simulator

The **Threat Simulation Panel** at the bottom of the dashboard shows how the model responds to sensor tampering:

1. Choose the **target sensor**: Soil Moisture or Soil Temperature.
2. Set the **intensity** with the slider (−30 to +30). This value is added to every reading from that sensor.
3. Click **🚨 Start Attack Simulation**. A banner shows which sensor is being manipulated.
4. Watch the charts and the anomaly score. Large enough shifts trigger the red **ANOMALY DETECTED** banner.
5. Click **✓ Stop Attack Simulation** to return to normal readings.

How large a shift is needed depends on the backend's `THRESHOLD_MULTIPLIER` in `config.py`. Lower values make detection more sensitive.

---

## 🌐 Deployment

This is a static Vite app, so any static host works.

**Vercel / Netlify**

| Setting           | Value           |
| ----------------- | --------------- |
| Build command     | `npm run build` |
| Output directory  | `dist`          |
| Install command   | `npm install`   |

No environment variables are needed to use the Render backend. Set `VITE_API_URL` only if you point it at a different backend.

**Render (Static Site)**

Use the same build command and publish directory (`dist`).

The backend has CORS enabled for all origins, so the frontend can be hosted on any domain.

---

## 🛠 Scripts

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload      |
| `npm run build`   | Create a production build in `dist/`      |
| `npm run preview` | Serve the production build locally        |
| `npm run lint`    | Run ESLint                                |

---

## 🔗 Related Repository

**Backend (Flask + autoencoder):** [backend_autoencoder_anomaly_detection_irrigation_iot](https://github.com/charmainemimie/backend_autoencoder_anomaly_detection_irrigation_iot). It covers the model, the dataset, the evaluation results and the full API documentation.
