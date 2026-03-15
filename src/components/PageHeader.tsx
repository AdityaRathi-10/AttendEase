import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import SettingsDrawer from "./SettingsDrawer"

interface Props {
    eyebrow: string
    title: React.ReactNode
    eyebrowIcon?: React.ReactNode
    right?: React.ReactNode
}

function PageHeader({ eyebrow, title, eyebrowIcon, right }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false)

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
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="app-btn-ghost ml-3 mt-1 w-9 h-9 shrink-0"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                </button>
            </div>
            <SettingsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </>
    )
}

export default PageHeader
