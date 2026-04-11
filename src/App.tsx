import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SettingsProvider, useSettings } from "./context/SettingsContext"
import BottomNav from "./components/BottomNav"
import Home from "./pages/Home"
import Courses from "./pages/Courses"
import Schedule from "./pages/Schedule"
import Attendance from "./pages/Attendance"
import SplashScreen from "./components/SplashScreen"
import { syncWithBackend } from "./utils/syncWithBackend"

function AppShell() {
    const { settings } = useSettings()

    useEffect(() => {
        if (!settings.fcmToken) return
        syncWithBackend(settings.fcmToken)
    }, [settings.fcmToken])

    return (
        <BrowserRouter>
            <div className="min-h-screen" style={{ backgroundColor: "var(--app-bg)", color: "var(--app-text-primary)" }}>
                <div
                    className="fixed inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(var(--app-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--app-grid-line) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <main style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom))" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/attendance" element={<Attendance />} />
                    </Routes>
                </main>
                <BottomNav />
            </div>
        </BrowserRouter>
    )
}

function App() {
    const [splashDone, setSplashDone] = useState(false)

    return (
        <SettingsProvider>
            {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
            <AppShell />
        </SettingsProvider>
    )
}

export default App