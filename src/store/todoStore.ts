import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Todo {
  id: string
  title: string
  completed: boolean
  category?: string
}

export interface UserPreferences {
  name?: string
  destination?: string
  travelDates?: {
    start: string
    end: string
  }
  interests?: string[]
  numberOfTravelers?: number
}

interface TodoState {
  todos: Todo[]
  userPreferences: UserPreferences
  
  // Todo actions
  addTodo: (title: string, category?: string) => void
  addTodos: (todos: { title: string; category?: string }[]) => void
  updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  clearCompleted: () => void
  clearAll: () => void
  
  // User preferences actions
  setUserPreferences: (preferences: Partial<UserPreferences>) => void
  clearUserPreferences: () => void
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      userPreferences: {},

      addTodo: (title, category) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: uuidv4(), title, completed: false, category },
          ],
        })),

      addTodos: (newTodos) =>
        set((state) => ({
          todos: [
            ...state.todos,
            ...newTodos.map((todo) => ({
              id: uuidv4(),
              title: todo.title,
              completed: false,
              category: todo.category,
            })),
          ],
        })),

      updateTodo: (id, updates) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates } : todo
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),

      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),

      clearAll: () => set({ todos: [] }),

      setUserPreferences: (preferences) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        })),

      clearUserPreferences: () => set({ userPreferences: {} }),
    }),
    {
      name: 'travel-todo-storage',
    }
  )
)

