import { Component, Input } from '@angular/core';
import { Payment, CalculatedSchedule } from '../mortgage/mortgage.model';
import { MortgageService } from '../mortgage/mortgage.service';
import * as moment from "moment";
import * as _ from "lodash";

@Component({
  selector: 'schedule-comparison',
  templateUrl: './schedule-comparison.component.html',
  styleUrls: ['./schedule-comparison.component.scss']
})
export class ScheduleComparisonComponent {

  @Input() schedule: CalculatedSchedule;
  @Input() changedSchedule: CalculatedSchedule | undefined;

  endDate: string;
  duration: string;
  total: number;
  overpaid: number;

  changedEndDate: string;
  changedDuration: string;
  changedTotal: number;
  changedOverpaid: number;

  savings: number;
  timeSavings: string;
 
  constructor(
    private service: MortgageService
  ) { }

  ngOnChanges() {
    this.endDate = this.getEndDate(this.schedule.payments);
    this.duration = this.getDuration(this.schedule.payments);
    this.total = this.schedule.total;
    this.overpaid = this.service.round(this.schedule.total - this.schedule.totalCover);

    if (_.isEmpty(this.changedSchedule)) {
      return;
    }

    this.changedEndDate = this.getEndDate(this.changedSchedule.payments);
    this.changedDuration = this.getDuration(this.changedSchedule.payments);
    this.changedTotal = this.changedSchedule.total;
    this.changedOverpaid = this.service.round(this.changedSchedule.total - this.changedSchedule.totalCover);

    this.savings = this.service.round(this.total - this.changedTotal);
    this.timeSavings = this.service.getEndDifference(this.schedule.payments, this.changedSchedule.payments);
  }

  getEndDate(schedule: Payment[]) {
    const lastMonth = _.last(schedule);
    return lastMonth ? lastMonth.date.format("LL") : "";
  }

  getDuration(schedule: Payment[]) {
    const lastMonth = _.last(schedule);
    if (!lastMonth) {
        return "";
    }
    return moment.duration(lastMonth.date.diff(moment())).humanize();
  }

}
