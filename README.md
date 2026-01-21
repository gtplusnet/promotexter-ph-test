# Promotexter

A monorepo containing frontend and backend applications.

## Project Structure

```
promotexter/
├── packages/
│   ├── frontend/    # React + Vite frontend
│   └── backend/     # Express.js backend
├── package.json     # Root workspace configuration
└── README.md
```

## Prerequisites

- Node.js (v18 or higher recommended)
- Yarn

## Installation

```bash
yarn install
```

## Development

Run both frontend and backend in development mode:

```bash
yarn dev
```

Run individually:

```bash
# Backend only
yarn dev:backend

# Frontend only
yarn dev:frontend
```

## Build

Build all packages:

```bash
yarn build
```

Build individually:

```bash
yarn build:backend
yarn build:frontend
```

## Ports

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

## Tech Stack

### Frontend
- React 19
- Vite (rolldown-vite)
- TypeScript

### Backend
- Express.js 5
- TypeScript
- Nodemon (development)
