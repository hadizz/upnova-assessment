import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

const tasks = [
    {
        id: 1,
        title: 'Task 1',
        description: 'Placeholder for Task 1',
        path: '/task-1',
        status: 'pending',
    },
    {
        id: 2,
        title: 'Task 2',
        description: 'Placeholder for Task 2',
        path: '/task-2',
        status: 'pending',
    },
    {
        id: 3,
        title: 'Task 3',
        description: 'AI Travel Todo App with CopilotKit',
        path: '/task-3',
        status: 'active',
    },
]

export function HomePage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold text-foreground mb-4">
                        Upnova Assessment
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Select a task to get started
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-3">
                    {tasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link
                                to={task.path}
                                className={`block p-6 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg ${task.status === 'active'
                                    ? 'bg-primary/5 border-primary/30 hover:border-primary/50'
                                    : 'bg-card border-border hover:border-primary/20'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span
                                        className={`text-sm font-medium px-3 py-1 rounded-full ${task.status === 'active'
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {task.status === 'active' ? 'Active' : 'Coming Soon'}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    {task.title}
                                </h2>
                                <p className="text-muted-foreground">{task.description}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
