import { Injectable } from "@angular/core";
import { Payment, CoverChange, ScheduledPayment, Schedule, DATE_FORMAT, CalculatedSchedule } from "./mortgage.model";
import * as moment from "moment";
import * as _ from "lodash";

@Injectable()
export class MortgageService {
    
    round(value: number) {
        return Math.round(value * 100) / 100;
    }
    
    // calculates linear schedule with changes
    calculateSchedule(schedule: Schedule, ignoreChanges = false): CalculatedSchedule {
        // cover change strategy: decrease payment count leaving monthly cover intact
        // other strategy: same payment count - smaller monthly cover
        const startDate = moment(schedule.startDate, DATE_FORMAT);
        const endDate = this.getEndDate(schedule);
        const monthlyCover = this.round(schedule.sum / schedule.months);

        const payments = this.calculateLinearSchedule(
            schedule.sum,
            monthlyCover,
            schedule.interest/100,
            startDate,
            endDate,
            schedule.paymentDay,
            ignoreChanges ? [] : schedule.changes
        );

        const totalCover = this.getTotalCover(payments);
        const totalInterest = this.getTotalInterest(payments);
        const extraCharges = schedule.extraCharges || 0;

        return {
            payments,
            totalCover,
            totalInterest,
            totalSum: this.round(totalCover + totalInterest),
            total: this.round(totalCover + totalInterest + extraCharges)
        }
    }

    // calculates linear schedule with changes
    calculateLinearSchedule(creditLeft: number, monthlyCover: number, interestRate: number, startDate: moment.Moment, endDate: moment.Moment, dayOfPayment: number, changes: CoverChange[]) {
        let schedule: Payment[] = [];
        let previousPayment = startDate;
        let nextPayment = moment(previousPayment).add(1, "month").date(dayOfPayment);
        
        while(!nextPayment.isAfter(endDate) && creditLeft > 0) {
            const currentChanges = _.filter(changes, x => {
                const changeDate = moment(x.date, DATE_FORMAT);
                return changeDate.isAfter(previousPayment) && changeDate.isBefore(nextPayment) || changeDate.isSame(nextPayment, "day");
            });

            if (currentChanges.length) {
                for (const change of currentChanges) {
                    let changeDate = moment(change.date, DATE_FORMAT);
                    let periodEnd = changeDate;
                    
                    // payment is divided by change into periods of different creditLeft and days
                    const changeInterest = this.calculateInterest(previousPayment, periodEnd, creditLeft, interestRate);
                    
                    // interest is included in change amount and paid at same time
                    const changeCover = change.amount - changeInterest; 

                    creditLeft -= changeCover;

                    schedule.push({
                        date: changeDate,
                        cover: this.round(changeCover),
                        left: this.round(creditLeft),
                        sum: change.amount,
                        interest: this.round(changeInterest)
                    });

                    previousPayment = changeDate;

                    if (creditLeft <= 0) {
                        return schedule;
                    }
                }
            }

            // no cover payment if had returned money during previous month
            let currentCover = currentChanges.length ? 0 : monthlyCover; 
            currentCover = currentCover > creditLeft ? creditLeft : currentCover;

            let paymentInterest = this.calculateInterest(previousPayment, nextPayment, creditLeft, interestRate);

            creditLeft -= currentCover;

            schedule.push({
                paymentNr: this.getNextPaymentNr(schedule),
                cover: this.round(currentCover),
                interest: this.round(paymentInterest),
                sum: this.round(currentCover + paymentInterest),
                left: this.round(creditLeft),
                date: nextPayment
            });

            previousPayment = nextPayment;
            nextPayment = moment(nextPayment).add(1, "month").date(dayOfPayment);
        }

        return schedule;
    }

    isScheduledPayment(payment: any) {
        return !_.isNil(payment.paymentNr);
    }

    getTotalCover(schedule: Payment[]) {
        return this.round(_.sumBy(schedule, x => x.cover));
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

    getEndDate(schedule: Schedule) {
        const startDate = moment(schedule.startDate, DATE_FORMAT);
        return startDate.add(schedule.months, "month").date(schedule.paymentDay);
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