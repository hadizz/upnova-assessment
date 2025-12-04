# Upnova Assessment

Trying to do my best with this assessment, you can find the tasks descriptions in the tasks folder.

## Technologies & Libraries

### Core
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### Styling
- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### State & Routing
- **Zustand** - Lightweight state management
- **React Router DOM** - Client-side routing

### Animation & AI
- **Motion** - Animation library (Framer Motion)
- **CopilotKit** - AI copilot integration

## Tasks

### Task 1: Cart Chain Event Manager
A sequential asynchronous event system for Shopify-like cart operations. The chain manager executes cart actions in order and stops if any event returns `null` or `undefined`. Perfect for implementing complex cart workflows like conditional gift additions and attribute updates.

### Task 2: OTP Input Animation
Animated one-time password input component featuring:
- 6-digit input with visual separator (3-3 format)
- Smooth highlight transitions between inputs
- Error state with shake animation and color changes
- Success state with icon transition (email → lock)
- Digit fade-in animations from bottom to top

### Task 3: AI-Powered Trip Planner
Interactive todo application with AI chat interface:
- Full CRUD operations for todos (create, read, update, delete)
- AI copilot sidebar using CopilotKit
- Real-time weather integration for trip planning
- Natural language todo management ("Help me plan a trip to Paris")
- Persistent memory for user preferences and plans

## Getting Started

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development Mode
Start the development server:
```bash
pnpm dev
```
The app will be available at `http://localhost:5173`

### Build
Create a production build:
```bash
pnpm build
```

### Preview
Preview the production build locally:
```bash
pnpm preview
```

### Linting
Run ESLint to check code quality:
```bash
pnpm lint
```
