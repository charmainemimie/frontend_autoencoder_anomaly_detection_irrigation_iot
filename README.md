# AgriCyber Frontend

React dashboard for the smart irrigation anomaly detection system. It shows live soil moisture and temperature readings, irrigation valve status and autoencoder anomaly alerts, and includes an attack simulator for testing detection.

Backend: [backend_autoencoder_anomaly_detection_irrigation_iot](https://github.com/charmainemimie/backend_autoencoder_anomaly_detection_irrigation_iot), deployed at https://agricyber.onrender.com

## Tech stack

React 19, Vite, Tailwind CSS, Recharts, lucide-react, React Router.

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` reads `.env.development` and talks to a backend running locally on `http://localhost:5000` (start it with `python app.py` in the backend repo).

## Backend URL

All API calls use `API_URL` from `src/config.js`:

| Situation                     | Backend used                                       |
| ----------------------------- | -------------------------------------------------- |
| `npm run dev`                 | `http://localhost:5000` (from `.env.development`)  |
| `npm run build` with no env   | `https://agricyber.onrender.com`                   |
| `VITE_API_URL` set at build   | Whatever you set it to                             |

To point a build at another backend:

```bash
VITE_API_URL=https://your-backend.example.com npm run build
```

On Vercel or Netlify, add `VITE_API_URL` as an environment variable instead.

## Endpoints used

| Endpoint               | Method | Used by           |
| ---------------------- | ------ | ----------------- |
| `/api/login`           | POST   | Login             |
| `/api/readings`        | GET    | Dashboard (polls) |
| `/api/simulate-attack` | POST   | Attack simulator  |

## Notes

- The backend is on Render's free plan, which sleeps after about 15 minutes without traffic. The first request after that can take up to a minute while it wakes up.
- Demo login: `agricyber` / `agricyber123`, unless `DEMO_PASSWORD` is set on the backend.

## Scripts

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload |
| `npm run build`   | Production build into `dist/`        |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Run ESLint                           |
