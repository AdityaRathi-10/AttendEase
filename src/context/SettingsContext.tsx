/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface AppSettings {
    minAttendance: number
    theme: "dark" | "light"
}

const DEFAULTS: AppSettings = {
    minAttendance: 75,
    theme: "light",
}

const KEY = "app_settings"

const THEME_COLORS = {
    light: "#dde3f5",
    dark:  "#0d0c18",
}

function applyTheme(theme: "dark" | "light") {
    const root = document.documentElement
    if (theme === "dark") {
        root.classList.add("dark")
        root.classList.remove("light")
    } else {
        root.classList.remove("dark")
        root.classList.add("light")
    }
    const color = THEME_COLORS[theme]
    document
        .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
        .forEach(el => { el.content = color })
}

const SettingsContext = createContext<{
    settings: AppSettings
    update: (patch: Partial<AppSettings>) => void
}>({ settings: DEFAULTS, update: () => {} })

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const raw = localStorage.getItem(KEY)
            return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS
        } catch {
            return DEFAULTS
        }
    })

    const update = (patch: Partial<AppSettings>) => {
        setSettings(prev => {
            const next = { ...prev, ...patch }
            localStorage.setItem(KEY, JSON.stringify(next))
            return next
        })
    }

    useEffect(() => {
        applyTheme(settings.theme)
    }, [settings.theme])

    return (
        <SettingsContext.Provider value={{ settings, update }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    return useContext(SettingsContext)
}