import { ChatWrapper } from '@/components/task3/ChatWrapper'
import { TodoList } from '@/components/task3/TodoList'

export function Task3Page() {
    return (
        <ChatWrapper>
            <div className="min-h-[calc(100vh-4rem)] bg-background">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            AI Travel Planner
                        </h1>
                        <p className="text-muted-foreground">
                            Chat with the AI assistant to plan your perfect trip. Open the sidebar to start planning!
                        </p>
                    </div>
                    <TodoList />
                </div>
            </div>
        </ChatWrapper>
    )
}
