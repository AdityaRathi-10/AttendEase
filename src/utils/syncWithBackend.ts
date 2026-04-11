import { db } from "@/db";
import { getAndSetUserId } from "./getAndSetUserId";

export async function syncWithBackend(fcmToken: string | null) {
    const userId = getAndSetUserId();
    const schedules = await db.schedules.toArray();
    const courses = await db.courses.toArray()
    
    const courseMap = new Map(courses.map(c => [c.id, c]))

    const scheduleWithNotifyTime = schedules.map((schedule) => {
        const course = courseMap.get(schedule.courseId)
        const [hours, minutes] = schedule.fromTime.split(":").map(Number);

        const classTime = new Date();
        classTime.setHours(hours, minutes, 0, 0);

        const notifyTime = new Date(classTime.getTime() - 10 * 60 * 1000);

        const data = {
            courseName: `${course?.name}`,
            notifyAt: notifyTime.toISOString(),
            day: schedule.day,
        };
        return data;
    })

    try {
        const response = await fetch("http://localhost:3000/sync", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                schedules: scheduleWithNotifyTime,
                fcmToken,
            }),
        });
        if (!response.ok) {
            console.log("SYNC FAILED");
        }
    } catch (error) {
        console.log("Error", error);
    }

    return null;
}