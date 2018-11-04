import { Schedule } from "../mortgage/mortgage.model";

export function getScheduleName(schedule: Schedule) {
    return `${schedule.startDate} ${schedule.sum}eur ${schedule.months} months`;
}