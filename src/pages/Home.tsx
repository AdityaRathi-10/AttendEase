import { useEffect, useState } from "react"
import { db, type ISchedule } from "../db"
import { getDayDate } from "../utils/getDayDate"
import DayDate from "../components/DayDate"
import { Clock, Sparkles } from "lucide-react"
import PageHeader from "../components/PageHeader"

interface Schedule {
    name: string
    scheduleData: ISchedule
}

const convertToSeconds = (time: string) => {
    const [hour, minute] = time.split(":").map(Number)
    return hour * 3600 + minute * 60
}

const checkForClassStatus = (startTime: string, endTime: string, now: Date) => {
    const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
    const startSec = convertToSeconds(startTime)
    const endSec = convertToSeconds(endTime)
    if (endSec > startSec) {
        if (nowSec < startSec) return "Pending"
        if (nowSec >= startSec && nowSec < endSec) return "Ongoing"
        return "Finished"
    }
    if (endSec < startSec) {
        if (nowSec >= startSec || nowSec < endSec) return "Ongoing"
        return "Pending"
    }
    if (nowSec === startSec) return "Ongoing"
    return "Finished"
}

type Status = "Ongoing" | "Pending" | "Finished"

const statusConfig: Record<Status, {
    borderColor: string
    badgeBg: string
    badgeBorder: string
    badgeText: string
    dotColor: string
    cardBg: string
    cardBorder: string
    dotPulse: boolean
    opacity: string
}> = {
    Ongoing: {
        borderColor: "var(--status-ongoing-border)",
        badgeBg: "var(--status-ongoing-bg)",
        badgeBorder: "var(--status-ongoing-border)",
        badgeText: "var(--status-ongoing-text)",
        dotColor: "var(--status-ongoing-text)",
        cardBg: "var(--status-ongoing-bg)",
        cardBorder: "var(--status-ongoing-border)",
        dotPulse: true,
        opacity: "1",
    },
    Pending: {
        borderColor: "var(--app-border-mid)",
        badgeBg: "var(--app-bg-muted)",
        badgeBorder: "var(--app-border)",
        badgeText: "var(--app-text-muted)",
        dotColor: "var(--app-text-faint)",
        cardBg: "var(--app-bg-card)",
        cardBorder: "var(--app-border)",
        dotPulse: false,
        opacity: "1",
    },
    Finished: {
        borderColor: "var(--status-present-border)",
        badgeBg: "var(--status-present-bg)",
        badgeBorder: "var(--status-present-border)",
        badgeText: "var(--status-present-text)",
        dotColor: "var(--status-present-text)",
        cardBg: "var(--app-bg-card)",
        cardBorder: "var(--app-border)",
        dotPulse: false,
        opacity: "0.55",
    },
}

function Home() {
    const [scheduleWithStatus, setScheduleWithStatus] = useState<Schedule[] | null>(null)
    const { day } = getDayDate()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        setInitializing(true)
        const load = async () => {
            try {
                const scheduleData = await db.schedules.where("day").equals(day).toArray()
                const arr: Schedule[] = await Promise.all(
                    scheduleData.map(async (sch) => {
                        const course = await db.courses.get(sch.courseId)
                        return { scheduleData: sch, name: course?.name ?? "Unknown" }
                    })
                )
                setScheduleWithStatus(
                    arr.sort((a, b) =>
                        convertToSeconds(a.scheduleData.fromTime) -
                        convertToSeconds(b.scheduleData.fromTime)
                    )
                )
            } finally {
                setInitializing(false)
            }
        }
        load()
    }, [day])

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    if (initializing) return null

    return (
        <div className="px-4 pt-6 pb-4">
            <PageHeader
                eyebrow="Today's Classes"
                eyebrowIcon={<Sparkles className="w-3.5 h-3.5" />}
                title={<DayDate />}
            />

            {scheduleWithStatus === null ? null : scheduleWithStatus.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div
                        className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5"
                        style={{
                            background: "var(--app-bg-muted)",
                            border: "1px solid var(--app-border)",
                        }}
                    >
                        <Sparkles className="w-7 h-7" style={{ color: "var(--app-text-faint)" }} />
                    </div>
                    <h1 className="text-lg font-bold mb-1" style={{ color: "var(--app-text-primary)" }}>
                        No classes today
                    </h1>
                    <p className="text-sm" style={{ color: "var(--app-text-faint)" }}>Enjoy your free day.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {scheduleWithStatus.map((item, index) => {
                        const status = checkForClassStatus(
                            item.scheduleData.fromTime,
                            item.scheduleData.toTime,
                            currentTime
                        ) as Status
                        const cfg = statusConfig[status]

                        return (
                            <div
                                key={item.scheduleData.id}
                                className="rounded-2xl border-l-4 backdrop-blur-sm transition-all duration-300 overflow-hidden"
                                style={{
                                    background: cfg.cardBg,
                                    border: `1px solid ${cfg.cardBorder}`,
                                    borderLeftColor: cfg.borderColor,
                                    borderLeftWidth: "4px",
                                    opacity: cfg.opacity,
                                }}
                            >
                                <div className="px-4 py-3.5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span
                                                className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono"
                                                style={{
                                                    background: "var(--app-bg-muted)",
                                                    border: "1px solid var(--app-border)",
                                                    color: "var(--app-text-faint)",
                                                }}
                                            >
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span
                                                className="font-semibold truncate text-sm"
                                                style={{ color: "var(--app-text-primary)" }}
                                            >
                                                {item.name}
                                            </span>
                                        </div>
                                        <span
                                            className="shrink-0 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5"
                                            style={{
                                                background: cfg.badgeBg,
                                                border: `1px solid ${cfg.badgeBorder}`,
                                                color: cfg.badgeText,
                                            }}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${cfg.dotPulse ? "animate-pulse" : ""}`}
                                                style={{ background: cfg.dotColor }}
                                            />
                                            {status}
                                        </span>
                                    </div>
                                    <div
                                        className="mt-2 ml-9 flex items-center gap-1.5 text-xs"
                                        style={{ color: "var(--app-text-faint)" }}
                                    >
                                        <Clock className="w-3 h-3" />
                                        <span className="font-mono">
                                            {item.scheduleData.fromTime}
                                            <span className="mx-1.5" style={{ color: "var(--app-border-strong)" }}>-</span>
                                            {item.scheduleData.toTime}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Home