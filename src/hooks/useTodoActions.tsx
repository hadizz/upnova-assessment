import { getForecastForCity, getWeatherForCity } from '@/lib/weather'
import { useTodoStore } from '@/store/todoStore'
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core'

export function useTodoActions() {
    const { todos, userPreferences, addTodos, updateTodo, deleteTodo, clearCompleted, setUserPreferences } =
        useTodoStore()

    // Share current todos with the AI
    useCopilotReadable({
        description: 'The current list of travel todos/tasks',
        value: todos,
    })

    // Share user preferences with the AI
    useCopilotReadable({
        description: 'User travel preferences including destination, dates, and interests',
        value: userPreferences,
    })

    // Action: Add multiple todos at once
    useCopilotAction({
        name: 'addTodos',
        description: 'Add multiple travel todos/tasks to the list. Use this when creating a travel plan.',
        parameters: [
            {
                name: 'todos',
                type: 'object[]',
                description: 'Array of todos to add',
                required: true,
                attributes: [
                    {
                        name: 'title',
                        type: 'string',
                        description: 'The todo title/description',
                        required: true,
                    },
                    {
                        name: 'category',
                        type: 'string',
                        description: 'Category like "Before Trip", "Day 1", "Packing", "Booking", etc.',
                        required: false,
                    },
                ],
            },
        ],
        handler: async ({ todos: newTodos }) => {
            addTodos(newTodos)
            return `Added ${newTodos.length} todos to the list`
        },
    })

    // Action: Update a specific todo
    useCopilotAction({
        name: 'updateTodo',
        description: 'Update an existing todo item. Can change title, category, or completion status.',
        parameters: [
            {
                name: 'todoId',
                type: 'string',
                description: 'The ID of the todo to update',
                required: true,
            },
            {
                name: 'title',
                type: 'string',
                description: 'New title for the todo',
                required: false,
            },
            {
                name: 'category',
                type: 'string',
                description: 'New category for the todo',
                required: false,
            },
            {
                name: 'completed',
                type: 'boolean',
                description: 'Whether the todo is completed',
                required: false,
            },
        ],
        handler: async ({ todoId, title, category, completed }) => {
            const updates: { title?: string; category?: string; completed?: boolean } = {}
            if (title !== undefined) updates.title = title
            if (category !== undefined) updates.category = category
            if (completed !== undefined) updates.completed = completed
            updateTodo(todoId, updates)
            return `Updated todo ${todoId}`
        },
    })

    // Action: Delete a todo
    useCopilotAction({
        name: 'deleteTodo',
        description: 'Delete a specific todo from the list',
        parameters: [
            {
                name: 'todoId',
                type: 'string',
                description: 'The ID of the todo to delete',
                required: true,
            },
        ],
        handler: async ({ todoId }) => {
            deleteTodo(todoId)
            return `Deleted todo ${todoId}`
        },
    })

    // Action: Clear completed todos
    useCopilotAction({
        name: 'clearCompletedTodos',
        description: 'Remove all completed todos from the list',
        parameters: [],
        handler: async () => {
            clearCompleted()
            return 'Cleared all completed todos'
        },
    })

    // Action: Get current weather for a city
    useCopilotAction({
        name: 'getCurrentWeather',
        description: 'Get the current weather for a specific city. Use this to provide weather-aware travel advice.',
        parameters: [
            {
                name: 'city',
                type: 'string',
                description: 'The city name to get weather for (e.g., "Paris", "Tokyo", "New York")',
                required: true,
            },
        ],
        handler: async ({ city }) => {
            const weather = await getWeatherForCity(city)
            if (!weather) {
                return `Could not find weather data for "${city}"`
            }
            return `Current weather in ${weather.city}: ${weather.current.temperature}°C (feels like ${weather.current.apparentTemperature}°C), ${weather.current.description}. Humidity: ${weather.current.humidity}%, Wind: ${weather.current.windSpeed} km/h`
        },
        render: ({ status, result, args }) => {
            if (status === 'inProgress') {
                return <div className="text-sm text-muted-foreground italic">🌤️ Checking weather for {args.city}...</div>
            }
            if (status === 'complete' && result) {
                return (
                    <div className="rounded-lg border bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-3 text-sm my-2">
                        <div className="font-semibold text-blue-700 dark:text-blue-300">🌡️ Current Weather</div>
                        <div className="mt-1 text-slate-700 dark:text-slate-300">{result}</div>
                    </div>
                )
            }
            return <></>
        },
    })

    // Action: Get weather forecast for travel dates
    useCopilotAction({
        name: 'getWeatherForecast',
        description: 'Get weather forecast for a city during specific FUTURE travel dates. Only works for dates from today up to 16 days ahead. Do NOT call this for past dates.',
        parameters: [
            {
                name: 'city',
                type: 'string',
                description: 'The city name to get forecast for',
                required: true,
            },
            {
                name: 'startDate',
                type: 'string',
                description: 'Start date in YYYY-MM-DD format. Must be today or in the future.',
                required: true,
            },
            {
                name: 'endDate',
                type: 'string',
                description: 'End date in YYYY-MM-DD format. Must be within 16 days from today.',
                required: true,
            },
        ],
        handler: async ({ city, startDate, endDate }) => {
            // Calculate valid date range
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const maxForecastDate = new Date(today)
            maxForecastDate.setDate(maxForecastDate.getDate() + 16)
            const todayStr = today.toISOString().split('T')[0]
            const maxDateStr = maxForecastDate.toISOString().split('T')[0]

            // Parse requested dates
            const requestedStart = new Date(startDate)
            const requestedEnd = new Date(endDate)

            // Check if dates are in the past
            if (requestedEnd < today) {
                return `⚠️ Cannot check weather for past dates. The dates you requested (${startDate} to ${endDate}) are in the past. Weather forecasts are only available from today (${todayStr}) up to ${maxDateStr}. Please provide future dates.`
            }

            // Check if dates are too far in the future
            if (requestedStart > maxForecastDate) {
                return `⚠️ The dates you requested (${startDate} to ${endDate}) are too far in the future. Weather forecasts are only available for the next 16 days (until ${maxDateStr}). Please check again closer to your travel date.`
            }

            const forecast = await getForecastForCity(city, startDate, endDate)
            if (!forecast) {
                return `Could not find weather data for "${city}". Please check the city name.`
            }

            // Check if no forecast data is available
            if (forecast.forecast.length === 0) {
                return `⚠️ No forecast data available for the requested dates (${startDate} to ${endDate}). Weather forecasts are only available from today (${todayStr}) up to ${maxDateStr}. Please request dates within this range.`
            }

            let dateNote = ''
            if (forecast.wasClamped) {
                dateNote = `\n\n⚠️ Note: Your dates (${startDate} to ${endDate}) were partially outside the forecast range. Showing forecast for ${forecast.clampedStartDate} to ${forecast.clampedEndDate} only.`
            }

            const forecastSummary = forecast.forecast
                .map(
                    (day) =>
                        `${day.date}: ${day.minTemp}°C - ${day.maxTemp}°C, ${day.description}${day.precipitation > 0 ? `, ${day.precipitation}mm rain` : ''}`
                )
                .join('\n')
            return `Weather forecast for ${forecast.city}:\n${forecastSummary}${dateNote}`
        },
        render: ({ status, result, args }) => {
            if (status === 'inProgress') {
                return <div className="text-sm text-muted-foreground italic">📅 Getting forecast for {args.city}...</div>
            }
            if (status === 'complete' && result) {
                // Check if it's an error message
                const isError = result.startsWith('⚠️') || result.startsWith('Could not')

                if (isError) {
                    return (
                        <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 p-3 text-sm my-2">
                            <div className="text-amber-800 dark:text-amber-200">{result}</div>
                        </div>
                    )
                }

                // Parse the result to display it nicely
                const lines = result.split('\n')
                const title = lines[0]
                const forecasts = lines.slice(1).filter((line: string) => line && !line.startsWith('⚠️'))
                const note = lines.find((line: string) => line.startsWith('⚠️'))

                return (
                    <div className="rounded-lg border bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-3 text-sm my-2">
                        <div className="font-semibold text-amber-700 dark:text-amber-300">📅 {title}</div>
                        <div className="mt-2 space-y-1">
                            {forecasts.map((day: string, idx: number) => (
                                <div key={idx} className="text-slate-700 dark:text-slate-300 pl-2 border-l-2 border-amber-300 dark:border-amber-600">
                                    {day}
                                </div>
                            ))}
                        </div>
                        {note && (
                            <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 italic">{note}</div>
                        )}
                    </div>
                )
            }
            return <></>
        },
    })

    // Action: Save user preferences
    useCopilotAction({
        name: 'saveUserPreferences',
        description: 'Save user travel preferences for future reference',
        parameters: [
            {
                name: 'name',
                type: 'string',
                description: "User's name",
                required: false,
            },
            {
                name: 'destination',
                type: 'string',
                description: 'Travel destination',
                required: false,
            },
            {
                name: 'startDate',
                type: 'string',
                description: 'Trip start date (YYYY-MM-DD)',
                required: false,
            },
            {
                name: 'endDate',
                type: 'string',
                description: 'Trip end date (YYYY-MM-DD)',
                required: false,
            },
            {
                name: 'interests',
                type: 'string[]',
                description: 'Array of interests like "museums", "food", "nightlife", "nature"',
                required: false,
            },
            {
                name: 'numberOfTravelers',
                type: 'number',
                description: 'Number of people traveling',
                required: false,
            },
        ],
        handler: async ({ name, destination, startDate, endDate, interests, numberOfTravelers }) => {
            const prefs: Parameters<typeof setUserPreferences>[0] = {}
            if (name) prefs.name = name
            if (destination) prefs.destination = destination
            if (startDate && endDate) prefs.travelDates = { start: startDate, end: endDate }
            if (interests) prefs.interests = interests
            if (numberOfTravelers) prefs.numberOfTravelers = numberOfTravelers
            setUserPreferences(prefs)
            return 'User preferences saved'
        },
    })
}

