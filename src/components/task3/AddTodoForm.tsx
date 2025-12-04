import { Button } from '@/components/ui/button'
import { useTodoStore } from '@/store/todoStore'
import { useState } from 'react'

export function AddTodoForm() {
    const [title, setTitle] = useState('')
    const addTodo = useTodoStore((state) => state.addTodo)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (title.trim()) {
            addTodo(title.trim())
            setTitle('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1 bg-background text-foreground placeholder-muted-foreground px-4 py-2 rounded-md border border-input focus:border-ring focus:outline-none transition-colors"
            />
            <Button type="submit" disabled={!title.trim()}>
                Add
            </Button>
        </form>
    )
}
