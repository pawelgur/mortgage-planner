import * as moment from "moment";

export interface Dictionary<TValue> {
    [key: string]: TValue;
}

export type Payment = ScheduledPayment | CoverChangePayment;
export const DATE_FORMAT = "YYYY-MM-DD";

export interface ScheduledPayment {
    paymentNr: number;
    cover: number;
    interest: number;
    sum: number;
    left: number;
    date: moment.Moment
}

export interface CoverChangePayment {
    cover: number;
    interest: number;
    sum: number;
    left: number;
    date: moment.Moment
}

export interface CoverChange {
    id: number;
    date: string;
    amount: number;
    penaltyEnabled: boolean;
}

export enum ScheduleType {
    linear = 0
}

/**
 * Schedule settings that actual schedule can be calculated upon
 */
export interface Schedule {
    id: number;
    name: string;
    sum: number;
    interest: number;
    startDate: string;
    paymentDay: number;
    months: number;
    type: ScheduleType;
    changes: CoverChange[];
    extraCharges: number; // todo: consider having name-value pairs
    coverPenalty: number; // extra charge for every cover payment, percentage
}

/**
 * Calculated based on `Schedule`
 */
export interface CalculatedSchedule {
    payments: Payment[];
    totalInterest: number;
    totalCover: number;
    /** interest + cover */
    totalSum: number;
    /** sum + extra charges */
    total: number;
}