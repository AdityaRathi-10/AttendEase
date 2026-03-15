import { getDayDate } from "@/utils/getDayDate"

function DayDate() {
    const { day, date } = getDayDate()
    return (
        <div className="flex flex-col">
            <h1
                className="text-3xl font-bold tracking-tight leading-none"
                style={{ color: "var(--app-text-primary)" }}
            >
                {day}
            </h1>
            <p
                className="text-xs font-mono mt-1.5 tracking-widest"
                style={{ color: "var(--app-text-faint)" }}
            >
                {date}
            </p>
        </div>
    )
}

export default DayDate
