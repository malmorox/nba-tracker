#!/usr/bin/env bash
# Arranca backend (FastAPI/uvicorn) y frontend (Vite) a la vez.
# Ctrl+C mata los dos procesos.
trap 'kill 0' EXIT

(cd server && .venv/bin/uvicorn app.main:app --reload --port 8000) &
(cd client && npm run dev) &

wait
