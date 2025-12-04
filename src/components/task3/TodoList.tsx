import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useTodoActions } from '@/hooks/useTodoActions'
import { useTravelPlannerInstructions } from '@/hooks/useTravelPlannerInstructions'
import { useTodoStore } from '@/store/todoStore'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { AddTodoForm } from './AddTodoForm'
import { TodoItem } from './TodoItem'

export function TodoList() {
    const { todos, clearCompleted, clearAll, userPreferences, clearUserPreferences } = useTodoStore()
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    // Register CopilotKit actions for AI to manage todos
    useTodoActions()

    // Configure AI system prompt and chat suggestions
    useTravelPlannerInstructions()

    // Extract unique categories from todos
    const categories = useMemo(() => {
        const cats = new Set<string>()
        todos.forEach((todo) => {
            if (todo.category) cats.add(todo.category)
        })
        return Array.from(cats).sort()
    }, [todos])

    // Filter todos by selected category
    const filteredTodos = useMemo(() => {
        if (selectedCategory === 'all') return todos
        if (selectedCategory === 'uncategorized') return todos.filter((t) => !t.category)
        return todos.filter((t) => t.category === selectedCategory)
    }, [todos, selectedCategory])

    const completedCount = todos.filter((t) => t.completed).length
    const totalCount = todos.length

    const hasPreferences = userPreferences.name || userPreferences.destination ||
        userPreferences.travelDates || userPreferences.interests?.length || userPreferences.numberOfTravelers

    return (
        <div className="space-y-6">
            {/* User Memory Section */}
            {hasPreferences && (
                <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-card-foreground">📝 Saved Preferences</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearUserPreferences}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            Clear Memory
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                        {userPreferences.name && <div>👤 Name: {userPreferences.name}</div>}
                        {userPreferences.destination && <div>📍 Destination: {userPreferences.destination}</div>}
                        {userPreferences.travelDates && (
                            <div>📅 Dates: {userPreferences.travelDates.start} to {userPreferences.travelDates.end}</div>
                        )}
                        {userPreferences.interests?.length && (
                            <div>🎯 Interests: {userPreferences.interests.join(', ')}</div>
                        )}
                        {userPreferences.numberOfTravelers && (
                            <div>👥 Travelers: {userPreferences.numberOfTravelers}</div>
                        )}
                    </div>
                </div>
            )}

            <AddTodoForm />

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Filter by:</span>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="uncategorized">Uncategorized</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedCategory !== 'all' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                        >
                            Clear filter
                        </Button>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                    {totalCount === 0 ? (
                        'No todos yet. Chat with AI or add one manually!'
                    ) : (
                        <>
                            <span className="text-primary font-medium">{completedCount}</span>
                            {' of '}
                            <span className="text-foreground font-medium">{totalCount}</span>
                            {' completed'}
                            {selectedCategory !== 'all' && (
                                <span className="text-muted-foreground">
                                    {' '}(showing {filteredTodos.length})
                                </span>
                            )}
                        </>
                    )}
                </div>
                {totalCount > 0 && (
                    <div className="flex gap-2">
                        {completedCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={clearCompleted}>
                                Clear completed
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={clearAll}>
                            Clear all
                        </Button>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <AnimatePresence initial={false} mode="sync">
                    {filteredTodos.map((todo) => (
                        <TodoItem key={todo.id} todo={todo} />
                    ))}
                </AnimatePresence>
            </div>

            {totalCount === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <div className="text-6xl mb-4">✈️</div>
                    <h3 className="text-xl font-medium text-foreground mb-2">
                        Ready to plan your trip?
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Open the chat sidebar and tell the AI where you want to go.
                        Try: "Help me plan a 3-day trip to Paris"
                    </p>
                </motion.div>
            )}
        </div>
    )
}
