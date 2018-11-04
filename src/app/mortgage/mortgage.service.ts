import { Injectable } from "@angular/core";
import { Payment, CoverChange, ScheduledPayment, Schedule, DATE_FORMAT } from "./mortgage.model";
import * as moment from "moment";
import * as _ from "lodash";

// todo: instead of having one base and another same with changes, add any number of instances each with changes
// todo: add interest change
// todo: add anuitetas
// todo: remove (edit?) change directly from schedule view

@Injectable()
export class MortgageService {

    
    round(value: number) {
        return Math.round(value * 100) / 100;
    }
    
    // calculates linear schedule with changes
    calculateSchedule(schedule: Schedule) {
        // cover change strategy: decrease payment count leaving monthly cover intact
        // other strategy: same payment count - smaller monthly cover
        const startDate = moment(schedule.startDate, DATE_FORMAT);
        const endDate = moment(startDate).add(schedule.months, "month").date(schedule.paymentDay);
        const monthlyCover = this.round(schedule.sum / schedule.months);

        return this.calculateSchedulePart(
            schedule.sum,
            monthlyCover,
            schedule.interest/100,
            startDate,
            endDate,
            schedule.paymentDay,
            schedule.changes
        );
    }

    // calculates linear schedule with changes
    // todo: bug - does not calculate change if it happens on day of payment
    calculateSchedulePart(creditLeft: number, monthlyCover: number, interestRate: number, startDate: moment.Moment, endDate: moment.Moment, dayOfPayment: number, changes: CoverChange[]) {
        let schedule: Payment[] = [];
        let previousPayment = startDate;
        let nextPayment = moment(previousPayment).add(1, "month").date(dayOfPayment);
        
        while(!nextPayment.isAfter(endDate) && creditLeft >= 0) {
            let paymentInterest = 0;
            const currentChanges = _.filter(changes, x => {
                const changeDate = moment(x.date, DATE_FORMAT);
                return changeDate.isAfter(previousPayment) && changeDate.isBefore(nextPayment);
            });
            if (currentChanges.length) {
                for (const change of currentChanges) {
                    let changeDate = moment(change.date, DATE_FORMAT);
                    let periodEnd = changeDate;
                    
                    // payment is divided by change into periods of different creditLeft and days
                    paymentInterest += this.calculateInterest(previousPayment, periodEnd, creditLeft, interestRate);

                    creditLeft -= change.amount;

                    schedule.push({
                        date: changeDate,
                        cover: change.amount,
                        left: this.round(creditLeft),
                        sum: change.amount
                    });

                    previousPayment = changeDate;

                    if (creditLeft <= 0) {
                        return schedule;
                    }
                }
            }

            paymentInterest += this.calculateInterest(previousPayment, nextPayment, creditLeft, interestRate);

            creditLeft -= monthlyCover;

            schedule.push({
                paymentNr: this.getNextPaymentNr(schedule),
                cover: monthlyCover,
                interest: this.round(paymentInterest),
                sum: this.round(monthlyCover + paymentInterest),
                left: this.round(creditLeft),
                date: nextPayment
            });

            previousPayment = nextPayment;
            nextPayment = moment(nextPayment).add(1, "month").date(dayOfPayment);
        }

        return schedule;
    }

    // simple linear schedule calculation
    calculateLinearSchedule(schedule: Schedule): ScheduledPayment[] {
        let interest = schedule.interest/100;
        let startDate = moment(schedule.startDate, DATE_FORMAT);
        let creditLeft = schedule.sum;
        let paymentsSchedule: ScheduledPayment[] = [];

        let monthlyCover = this.round(schedule.sum / schedule.months);
        let previousPayment = startDate;
        
        for (let paymentNr = 0; paymentNr < schedule.months; paymentNr++) {
            const paymentDate = moment(previousPayment).add(1, "month").date(schedule.paymentDay); 
            const monthlyInterest = this.calculateInterest(previousPayment, paymentDate, creditLeft, interest);
            
            creditLeft -= monthlyCover;

            paymentsSchedule.push({
                paymentNr,
                cover: monthlyCover,
                interest: this.round(monthlyInterest),
                sum: this.round(monthlyCover + monthlyInterest),
                left: this.round(creditLeft),
                date: paymentDate
            });

            previousPayment = paymentDate;
        }

        return paymentsSchedule;
    }

    isScheduledPayment(payment: any) {
        return !_.isNil(payment.paymentNr);
    }

    getTotalPaid(schedule: Payment[]) {
        return this.round(_.sumBy(schedule, x => x.sum));
    }

    getTotalInterest(schedule: Payment[]) {
        return this.round(_.sumBy(schedule, (x: any) => x.interest));
    }

    getEndDifference(schedule1: Payment[], schedule2: Payment[]) {
        const lastPayment1: ScheduledPayment = _.findLast(schedule1, this.isScheduledPayment);
        const lastPayment2: ScheduledPayment = _.findLast(schedule2, this.isScheduledPayment);

        if (lastPayment1 && lastPayment2) {
            return moment.duration(lastPayment2.date.diff(lastPayment1.date)).humanize();
        }

        return "none";
    }

    /**
     * Interest of one payment (during one month)
     */
    private calculateInterest(startDate: moment.Moment, endDate: moment.Moment, creditLeft: number, interestRate: number) {
        const daysInYear = this.getDaysInYear(endDate.year());
        const daysInPayment = endDate.diff(startDate, "days");  
        
        return creditLeft * daysInPayment / daysInYear * interestRate;
    }

    private getDaysInYear(year: number) {
        let days = 0;
        const date = moment(year, "YYYY");
        for (let i = 0; i < 12; i++) {
            days += date.daysInMonth();
            date.add(1, "month");
        }
        return days;
    }

    private getNextPaymentNr(schedule: Payment[]) {
        const lastPayment: ScheduledPayment = _.findLast(schedule, this.isScheduledPayment);

        return lastPayment ? lastPayment.paymentNr + 1 : 0;
    }

}