import { CopilotKit } from '@copilotkit/react-core'
import { CopilotSidebar } from '@copilotkit/react-ui'
import '@copilotkit/react-ui/styles.css'
import type { ReactNode } from 'react'

interface ChatWrapperProps {
    children: ReactNode
}

export function ChatWrapper({ children }: ChatWrapperProps) {
    return (
        <CopilotKit publicApiKey={import.meta.env.VITE_COPILOT_API_KEY}>
            <CopilotSidebar
                defaultOpen={false}
                clickOutsideToClose={false}
                labels={{
                    title: 'Travel Planner',
                    initial:
                        "Hi! 👋 I'm your AI travel assistant. Tell me where you want to go and I'll help you plan your trip with a personalized todo list!",
                }}
            >
                {children}
            </CopilotSidebar>
        </CopilotKit>
    )
}

