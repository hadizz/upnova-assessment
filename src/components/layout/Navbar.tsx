import { NavLink } from 'react-router-dom'

export function Navbar() {
    return (
        <nav className="bg-background border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <NavLink
                            to="/"
                            className="text-xl font-bold text-foreground tracking-tight"
                        >
                            Upnova Assessment
                        </NavLink>
                        <div className="hidden sm:flex gap-1">
                            <NavLink
                                to="/task-1"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-secondary text-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`
                                }
                            >
                                Task 1
                            </NavLink>
                            <NavLink
                                to="/task-2"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-secondary text-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`
                                }
                            >
                                Task 2
                            </NavLink>
                            <NavLink
                                to="/task-3"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-secondary text-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                    }`
                                }
                            >
                                Task 3
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
