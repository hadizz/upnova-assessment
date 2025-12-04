# CopilotKit AI Travel Todo App

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  React App (Vite)                                           │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │   CopilotSidebar    │  │      Todo List UI            │  │
│  │   (AI Chat)         │  │   - Add/Edit/Delete todos    │  │
│  │                     │  │   - Check/Uncheck todos      │  │
│  │   useCopilotAction  │◄─┤   - Filter/Sort              │  │
│  │   useCopilotReadable│  │                              │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
│            │                          ▲                     │
│            ▼                          │                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │          Zustand Store (persisted to localStorage)      ││
│  │   - todos[]                                             ││
│  │   - userPreferences (name, travelDates, interests)      ││
│  │   - chatHistory (optional)                              ││
│  └─────────────────────────────────────────────────────────┘│
│            │                                                │
│            ▼                                                │
│  ┌─────────────────────┐                                    │
│  │  Weather API Call   │  (Open-Meteo)                      │
│  │  via useCopilotAction                                    │
│  └─────────────────────┘                                    │
└─────────────────────────────────────────────────────────────┘
                │
                ▼
       ┌─────────────────┐
       │  Copilot Cloud  │  (LLM Provider)
       │  publicApiKey   │
       └─────────────────┘
```

## Key Implementation Details

### 1. CopilotKit Setup

- Use `CopilotKit` provider with `publicApiKey` (Copilot Cloud)
- Use `CopilotSidebar` for the chat interface
- System instructions via `useCopilotAdditionalInstructions`

### 2. Todo State Management (Zustand)

File: [`src/store/todoStore.ts`](src/store/todoStore.ts)

```typescript
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

### 3. CopilotKit Actions (AI can trigger these)

File: [`src/hooks/useTodoActions.ts`](src/hooks/useTodoActions.ts)

- `addTodos` - Add multiple todos at once
- `updateTodo` - Edit a specific todo
- `deleteTodo` - Remove a todo
- `clearCompleted` - Remove completed todos
- `getWeather` - Fetch weather for a location/date

### 4. CopilotKit Readable State

- Share current todos with AI via `useCopilotReadable`
- Share user preferences (if stored)

### 5. System Prompt Strategy

The AI should:

- Ask clarifying questions (dates, interests, number of travelers)
- Generate categorized todos
- Consider weather when suggesting activities
- Allow iterative refinement

### 6. Weather Integration

- Use Open-Meteo API (free, no key required)
- Create a `getWeather` action the AI can call
- AI uses weather data to adjust recommendations

## Routing Structure

| Route | Page | Description |

|-------|------|-------------|

| `/` | Home | Landing page with links to all tasks |

| `/task-1` | Task1Page | Placeholder for Task 1 (to be added later) |

| `/task-2` | Task2Page | Placeholder for Task 2 (to be added later) |

| `/task-3` | Task3Page | AI Todo App with CopilotKit |

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.tsx          # Navigation bar
│   └── task3/
│       ├── TodoList.tsx        # Main todo list UI
│       ├── TodoItem.tsx        # Individual todo item
│       ├── AddTodoForm.tsx     # Manual add form
│       └── ChatWrapper.tsx     # CopilotKit + Sidebar wrapper
├── pages/
│   ├── HomePage.tsx            # Landing page
│   ├── Task1Page.tsx           # Placeholder
│   ├── Task2Page.tsx           # Placeholder
│   └── Task3Page.tsx           # AI Todo App
├── store/
│   └── todoStore.ts            # Zustand store with persist
├── hooks/
│   └── useTodoActions.ts       # CopilotKit actions
├── lib/
│   └── weather.ts              # Weather API helper
├── App.tsx                     # Router setup
└── main.tsx
```

## Dependencies to Install

```bash
# Core dependencies
pnpm add @copilotkit/react-core @copilotkit/react-ui zustand uuid motion

# Dev dependencies
pnpm add -D @types/uuid tailwindcss @tailwindcss/vite
```

## External References

- [CopilotKit Docs](https://docs.copilotkit.ai)
- [Zustand Persist](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
- [Open-Meteo Weather API](https://open-meteo.com/) (free, no API key)