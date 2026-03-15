import { NavLink } from "react-router-dom"
import { Home, BookOpen, CalendarDays, ClipboardCheck } from "lucide-react"
import { Day, type TDay } from "@/enums/Days"

const days: TDay[] = [
    Day.Sunday,
    Day.Monday,
    Day.Tuesday,
    Day.Wednesday,
    Day.Thursday,
    Day.Friday,
    Day.Saturday
]

const today = days[new Date().getDay()]

const tabs = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/courses", icon: BookOpen, label: "Courses" },
    { to: `/schedule?day=${today}`, icon: CalendarDays, label: "Schedule" },
    { to: "/attendance", icon: ClipboardCheck, label: "Attendance" },
]

function BottomNav() {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl"
            style={{
                backgroundColor: "var(--app-bg)",
                borderTop: "1px solid var(--app-border)",
                paddingBottom: "env(safe-area-inset-bottom)",
            }}
        >
            <div className="flex items-center justify-around px-2 py-2">
                {tabs.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end
                        className="flex flex-col items-center gap-1 px-5 py-1 transition-all duration-200"
                    >
                        {({ isActive }) => (
                            <>
                                <div
                                    className="p-1.5 rounded-xl transition-all duration-200"
                                    style={{
                                        background: isActive ? "var(--app-accent-bg)" : "transparent",
                                        border: isActive
                                            ? "1px solid var(--app-accent-border)"
                                            : "1px solid transparent",
                                    }}
                                >
                                    <Icon
                                        className="w-5 h-5 transition-colors duration-200"
                                        style={{
                                            color: isActive
                                                ? "var(--app-accent)"
                                                : "var(--app-text-faint)",
                                        }}
                                    />
                                </div>
                                <span
                                    className="text-[10px] font-semibold tracking-wide transition-colors duration-200"
                                    style={{
                                        color: isActive
                                            ? "var(--app-accent)"
                                            : "var(--app-text-faint)",
                                    }}
                                >
                                    {label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}

export default BottomNav
