import { useState } from "react"
import { SlidersHorizontal, CalendarDays } from "lucide-react"
import SettingsDrawer from "./SettingsDrawer"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface Props {
    eyebrow: string
    title: React.ReactNode
    eyebrowIcon?: React.ReactNode
    right?: React.ReactNode
}

function PageHeader({ eyebrow, title, eyebrowIcon, right }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [calOpen, setCalOpen] = useState(false)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // Derive selected date and starting month from the ?date= URL param
    const dateParam = searchParams.get("date")
    const selectedDate: Date | undefined = (() => {
        if (!dateParam) return undefined
        const [y, m, d] = dateParam.split("-").map(Number)
        const parsed = new Date(y, m - 1, d)
        return isNaN(parsed.getTime()) ? undefined : parsed
    })()
    const calendarMonth = selectedDate ?? new Date()

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) return
        // Format as YYYY-MM-DD for the URL param
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, "0")
        const d = String(date.getDate()).padStart(2, "0")
        setCalOpen(false)
        navigate(`/?date=${y}-${m}-${d}`)
    }

    return (
        <>
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1 min-w-0">
                    <div className="app-eyebrow">
                        {eyebrowIcon}
                        <span>{eyebrow}</span>
                    </div>
                    <div className="flex items-center gap-3">{title}</div>
                    {right && <div className="mt-3">{right}</div>}
                    <div className="app-divider" />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 ml-3 mt-1 shrink-0">
                    {/* Calendar picker */}
                    <Popover open={calOpen} onOpenChange={setCalOpen}>
                        <PopoverTrigger asChild>
                            <button
                                className="app-btn-ghost w-9 h-9"
                                aria-label="Pick a date"
                                style={calOpen ? {
                                    background: "var(--app-accent-bg)",
                                    color: "var(--app-accent)",
                                    border: "1px solid var(--app-accent-border)",
                                } : {}}
                            >
                                <CalendarDays className="w-4 h-4" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            sideOffset={8}
                            className="w-auto rounded-2xl border-0 shadow-2xl"
                            style={{
                                background: "var(--app-bg-elevated)",
                                border: "1px solid var(--app-border-mid)",
                                boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)",
                                // Keep it within the viewport on mobile
                                maxWidth: "calc(100vw - 2rem)",
                            }}
                        >
                            {/* Header strip */}
                            <div
                                className="px-4 pt-2 text-xs text-center font-semibold uppercase tracking-widest"
                                style={{
                                    color: "var(--app-text-faint)",
                                }}
                            >
                                Jump to date
                            </div>
                            <div className="px-3">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    month={calendarMonth}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                    className="w-full"
                                />
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Settings */}
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="app-btn-ghost w-9 h-9"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <SettingsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    )
}

export default PageHeader
