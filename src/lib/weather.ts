// Open-Meteo API - Free weather API, no key required
// Docs: https://open-meteo.com/

interface WeatherData {
    temperature: number
    apparentTemperature: number
    humidity: number
    precipitation: number
    weatherCode: number
    windSpeed: number
    description: string
}

interface DailyForecast {
    date: string
    maxTemp: number
    minTemp: number
    precipitation: number
    weatherCode: number
    description: string
}

// Weather code descriptions from WMO
const weatherCodeDescriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
}

function getWeatherDescription(code: number): string {
    return weatherCodeDescriptions[code] || 'Unknown'
}

// Geocoding to get coordinates from city name
export async function getCoordinates(
    cityName: string
): Promise<{ lat: number; lon: number; name: string } | null> {
    const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    )
    const data = await response.json()

    if (data.results && data.results.length > 0) {
        return {
            lat: data.results[0].latitude,
            lon: data.results[0].longitude,
            name: data.results[0].name,
        }
    }
    return null
}

// Get current weather
export async function getCurrentWeather(
    lat: number,
    lon: number
): Promise<WeatherData> {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`
    )
    const data = await response.json()

    return {
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
        description: getWeatherDescription(data.current.weather_code),
    }
}

// Get the valid date range for Open-Meteo forecast API
// Forecasts are only available from today up to ~16 days in the future
function getValidForecastDateRange(): { minDate: Date; maxDate: Date } {
    const now = new Date()
    // Set to start of today (midnight)
    const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const maxDate = new Date(minDate)
    maxDate.setDate(maxDate.getDate() + 16)
    return { minDate, maxDate }
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
}

// Clamp dates to valid forecast range
function clampDatesToValidRange(
    startDate: string,
    endDate: string
): { startDate: string; endDate: string; wasClamped: boolean } {
    const { minDate, maxDate } = getValidForecastDateRange()
    let start = new Date(startDate)
    let end = new Date(endDate)
    let wasClamped = false

    if (start < minDate) {
        start = minDate
        wasClamped = true
    }
    if (start > maxDate) {
        start = maxDate
        wasClamped = true
    }
    if (end < minDate) {
        end = minDate
        wasClamped = true
    }
    if (end > maxDate) {
        end = maxDate
        wasClamped = true
    }

    // Ensure start <= end
    if (start > end) {
        const temp = start
        start = end
        end = temp
    }

    return {
        startDate: formatDate(start),
        endDate: formatDate(end),
        wasClamped,
    }
}

// Get weather forecast for specific dates
export async function getWeatherForecast(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
): Promise<{ forecasts: DailyForecast[]; wasClamped: boolean; clampedStartDate: string; clampedEndDate: string }> {
    // Clamp dates to valid API range
    const { startDate: clampedStart, endDate: clampedEnd, wasClamped } = clampDatesToValidRange(startDate, endDate)

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&start_date=${clampedStart}&end_date=${clampedEnd}`
    )
    const data = await response.json()

    const forecasts: DailyForecast[] = []
    if (data.daily) {
        for (let i = 0; i < data.daily.time.length; i++) {
            // Skip days with null values (no forecast data available)
            if (
                data.daily.temperature_2m_max[i] === null ||
                data.daily.temperature_2m_min[i] === null ||
                data.daily.weather_code[i] === null
            ) {
                continue
            }
            forecasts.push({
                date: data.daily.time[i],
                maxTemp: data.daily.temperature_2m_max[i],
                minTemp: data.daily.temperature_2m_min[i],
                precipitation: data.daily.precipitation_sum[i] ?? 0,
                weatherCode: data.daily.weather_code[i],
                description: getWeatherDescription(data.daily.weather_code[i]),
            })
        }
    }

    return { forecasts, wasClamped, clampedStartDate: clampedStart, clampedEndDate: clampedEnd }
}

// Helper to get weather for a city by name
export async function getWeatherForCity(cityName: string): Promise<{
    city: string
    current: WeatherData
} | null> {
    const coords = await getCoordinates(cityName)
    if (!coords) return null

    const current = await getCurrentWeather(coords.lat, coords.lon)
    return {
        city: coords.name,
        current,
    }
}

// Helper to get forecast for a city by name and dates
export async function getForecastForCity(
    cityName: string,
    startDate: string,
    endDate: string
): Promise<{
    city: string
    forecast: DailyForecast[]
    wasClamped: boolean
    clampedStartDate: string
    clampedEndDate: string
} | null> {
    const coords = await getCoordinates(cityName)
    if (!coords) return null

    const { forecasts, wasClamped, clampedStartDate, clampedEndDate } = await getWeatherForecast(
        coords.lat,
        coords.lon,
        startDate,
        endDate
    )
    return {
        city: coords.name,
        forecast: forecasts,
        wasClamped,
        clampedStartDate,
        clampedEndDate,
    }
}

