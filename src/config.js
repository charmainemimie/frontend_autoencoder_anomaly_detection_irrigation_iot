// Base URL of the Flask backend.
// Set VITE_API_URL at build time to point somewhere else (see .env.development
// for local dev). Without it, the deployed Render backend is used.
export const API_URL = (import.meta.env.VITE_API_URL || 'https://agricyber.onrender.com').replace(/\/$/, '');
