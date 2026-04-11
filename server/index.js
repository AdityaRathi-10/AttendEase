import { initializeApp, applicationDefault } from "firebase-admin/app"
import { getMessaging } from "firebase-admin/messaging"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import fs from "fs"

dotenv.config({
    path: "./.env"
})

const app = express()
const PORT = 3000

const DB_FILE = "./db.json"
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

app.use(cors({
    origin: "*"
}))
app.use(express.json())

initializeApp({
    credential: applicationDefault(),
    projectId: "attend-ease-8b4e7"
})

function readDB() {
    try {
        if (!fs.existsSync(DB_FILE)) return {}
        const data = fs.readFileSync(DB_FILE, "utf-8").trim()
        if (!data) return {}
        return JSON.parse(data)
    } catch (err) {
        console.error("DB read error:", err)
        return {}
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

async function sendNotification(token, schedule) {
    if (!token) return

    await getMessaging().send({
        token,
        notification: {
            title: "Class Reminder",
            body: `${schedule.courseName} starts in 10 minutes`
        }
    })
}

async function checkAndSend() {
    const db = readDB()
    const now = Date.now()
    const today = new Date().getDay()

    for (const userId in db) {
        const user = db[userId]
        if (!user?.schedules) continue

        for (const schedule of user.schedules) {
            if (schedule.sent) continue
            if (schedule.day !== DAYS[today]) continue

            const notifyTime = new Date(schedule.notifyAt).getTime()

            if (notifyTime <= now) {
                await sendNotification(user.fcmToken, schedule)
                schedule.sent = true
            }
        }
    }
    writeDB(db)
}


app.post("/sync", async (req, res) => {
    const { userId, schedules, fcmToken } = req.body

    const db = readDB()
    db[userId] = {
        fcmToken,
        schedules
    }
    writeDB(db)

    return res.status(200).json({ ok: true })
})

app.post("/send", async (req, res) => {
    const token = req.body.fcmToken
    if (!token) {
        return res.status(400).json({ ok: false })
    }

    await getMessaging().send({
        token,
        notification: {
            title: "Test",
            body: "Manual notification"
        }
    })

    return res.json({ ok: true })
})

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
    setInterval(() => {
        checkAndSend()
            .catch(err => console.error("Scheduler error:", err))
    }, 30 * 1000)
})