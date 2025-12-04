import { Button } from '@/components/ui/button'
import type { Todo } from '@/store/todoStore'
import { useTodoStore } from '@/store/todoStore'
import { motion } from 'motion/react'
import { useState } from 'react'

interface TodoItemProps {
    todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(todo.title)
    const { updateTodo, deleteTodo, toggleTodo } = useTodoStore()

    const handleSave = () => {
        if (editTitle.trim()) {
            updateTodo(todo.id, { title: editTitle.trim() })
            setIsEditing(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave()
        } else if (e.key === 'Escape') {
            setEditTitle(todo.title)
            setIsEditing(false)
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
                layout: { type: "spring", stiffness: 500, damping: 35 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }}
            className={`group flex items-center gap-3 p-4 rounded-lg border transition-all ${todo.completed
                ? 'bg-muted/50 border-border'
                : 'bg-card border-border hover:border-primary/30'
                }`}
        >
            <button
                onClick={() => toggleTodo(todo.id)}
                className={`shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${todo.completed
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground hover:border-primary'
                    }`}
            >
                {todo.completed && (
                    <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            {isEditing ? (
                <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="flex-1 bg-background text-foreground px-3 py-1 rounded-md border border-input focus:border-ring focus:outline-none"
                />
            ) : (
                <div className="flex-1 min-w-0">
                    <p
                        className={`text-base truncate ${todo.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                            }`}
                    >
                        {todo.title}
                    </p>
                    {todo.category && (
                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {todo.category}
                        </span>
                    )}
                </div>
            )}

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isEditing && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setIsEditing(true)}
                            title="Edit"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => deleteTodo(todo.id)}
                            title="Delete"
                            className="hover:text-destructive"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </Button>
                    </>
                )}
            </div>
        </motion.div>
    )
}
