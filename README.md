# RTCP - Real-Time Collaborative Platform

RTCP is a production-grade, Google Docs-style real-time collaboration tool. It allows multiple users to edit documents simultaneously with conflict resolution, live presence indicators, and persistent storage.

## 🚀 Features

- **Real-Time Editing**: Powered by **Yjs (CRDT)** for seamless conflict resolution.
- **Live Cursors & Presence**: See other users' cursors, selection, and names in real-time using the Yjs Awareness protocol.
- **Rich Text Support**: Built with **TipTap**, supporting bold, italic, headings, lists, and more.
- **Document Dashboard**: Manage your documents—create, view, and open collaborative sessions.
- **Secure Authentication**: JWT-based auth with a persistent session using Zustand and React Query.
- **Optimized Persistence**: Debounced binary updates to PostgreSQL via Prisma to ensure data integrity without sacrificing performance.
- **Modern UI**: A premium, dark-themed interface built with **Tailwind CSS v4**.

## 🛠️ Tech Stack

### Frontend

- **React (Vite)**
- **TipTap** (Rich text editor)
- **Yjs** (Shared data types / CRDT)
- **Socket.io Client** (Networking)
- **Zustand** (State management)
- **TanStack Query** (Data fetching)
- **Tailwind CSS v4** (Styling)

### Backend

- **Node.js (Express)**
- **Socket.io** (Websocket server)
- **Prisma** (ORM)
- **PostgreSQL** (Database)
- **JSON Web Tokens** (Authentication)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL instance

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd rtcp
   ```
2. **Setup the Server**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in `server/`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/rtcp"
   JWT_SECRET="your_ultra_secret_key"
   PORT=5000
   ```

   Initialize the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   Start the server:

   ```bash
   npm run dev
   ```
3. **Setup the Client**

   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 📂 Project Structure

- `/client`: React frontend application.
- `/server`: Node.js Express server and Socket.io manager.
- `/server/prisma`: Database schema and migrations.

## 🧠 Architecture Notes

- **Conflict Resolution**: Unlike Google Docs (which uses OT), RTCP uses **CRDTs (Conflict-free Replicated Data Types)** via Yjs. This allows for more robust offline support and simpler decentralized syncing.
- **RAM Eviction**: The server implements a smart eviction policy that clears document state from memory once the last user leaves a room to prevent memory leaks.
