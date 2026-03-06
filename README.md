# Civil Architect App

A civil engineering / architecture application with a React frontend, Python FastAPI backend, and optional Electron desktop wrapper.

## Prerequisites

- **Node.js** (v18 or later) and **npm**
- **Python 3.10+** and **pip**

> On **WSL / Linux** make sure build essentials are installed:
> ```bash
> sudo apt update && sudo apt install -y build-essential python3-venv
> ```

## Quick Start (WSL / Linux)

### 1. Clone the repository

```bash
git clone https://github.com/rabiaajaafar690-bit/civil-architect-app.git
cd civil-architect-app
```

### 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

*(Optional)* To enable AI suggestions, create a `.env` file in `backend/`:

```
GEMINI_API_KEY=your-key-here
```

### 3. Frontend setup

Open a **new terminal** (keep the backend running):

```bash
cd frontend
npm install
npm run build
```

> **Important:** You must run `npm install` before `npm run build`. Skipping
> `npm install` causes the `Cannot find package '@tailwindcss/vite'` error
> because the dependencies listed in `package.json` have not been downloaded yet.

For development with hot-reload:

```bash
npm run dev
```

### 4. Electron (optional desktop app)

After building the frontend (`npm run build` in `frontend/`):

```bash
cd electron
npm install
npm start
```

## Project Structure

```
civil-architect-app/
├── backend/          # Python FastAPI backend
│   ├── app/
│   └── requirements.txt
├── frontend/         # React + Vite + Tailwind CSS frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── electron/         # Electron desktop wrapper
    ├── index.js
    └── package.json
```

## Troubleshooting

### `Cannot find package '@tailwindcss/vite'`

This error means `npm install` was not run before building. Fix it with:

```bash
cd frontend
npm install
npm run build
```

### Backend fails to start

Make sure you have activated the virtual environment and installed the dependencies:

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
