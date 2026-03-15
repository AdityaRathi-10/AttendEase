import Dexie, { type EntityTable } from "dexie";
import type { TDay } from "./enums/Days";

export interface ICourse {
    id?: number;
    name: string;
}

export interface ISchedule {
    id?: number;
    courseId: number;
    day: TDay;
    fromTime: string;
    toTime: string;
}

export interface IAttendance {
    id?: number;
    courseId: number;
    date: string;
    status: "present" | "absent" | null;
}

const db = new Dexie("ScheduleDB") as Dexie & {
    courses: EntityTable<ICourse, "id">;
    schedules: EntityTable<ISchedule, "id">;
    attendance: EntityTable<IAttendance, "id">;
};

db.version(1).stores({
    courses: "++id, name",
    schedules: "++id, courseId, day",
    attendance: "++id, courseId, date",
});

export { db };
