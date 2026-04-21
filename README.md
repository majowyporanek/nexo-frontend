# Nexo Frontend

Nexo is a Jira-clone application. This repository contains the frontend, which features a fully responsive Kanban board and a sidebar navigation layout styled with a custom burgundy theme. 

## Tech Stack

* **Framework:** React 18, Vite 5
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4, daisyUI
* **Routing:** React Router v6
* **State Management / API:** TanStack React Query v5
* **Icons:** lucide-react

## Features

* **Kanban Board:** A Jira-like board with responsive, fluid columns and styled issue cards.
* **Side Navigation:** A sleek, fully featured sidebar navigation with a custom dark burgundy theme.
* **Responsive Styling:** A synergistic layout handling both standard laptops and ultra-wide monitor views cleanly.
* **Issue Cards:** UI implemented for tracking tickets with priority, assignee avatars, issue types, and story points.

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm

### Installation

1. Navigate into the frontend directory:
   ```bash
   cd nexo-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

### Building for Production

To build the application for production:

```bash
npm run build
```
The output will be generated in the `dist` directory.
