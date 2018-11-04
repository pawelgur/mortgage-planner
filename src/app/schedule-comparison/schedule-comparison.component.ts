import { Component, Input } from '@angular/core';
import { Payment } from '../mortgage/mortgage.model';
import { MortgageService } from '../mortgage/mortgage.service';
import * as moment from "moment";
import * as _ from "lodash";

@Component({
  selector: 'schedule-comparison',
  templateUrl: './schedule-comparison.component.html',
  styleUrls: ['./schedule-comparison.component.scss']
})
export class ScheduleComparisonComponent {

  @Input() schedule: Payment[];
  @Input() changedSchedule: Payment[] | undefined;

  endDate: string;
  duration: string;
  total: number;
  interestTotal: number;

  changedEndDate: string;
  changedDuration: string;
  changedTotal: number;
  changedInterestTotal: number;

  savings: number;
  timeSavings: string;
 
  constructor(
    private service: MortgageService
  ) { }

  ngOnChanges() {
    this.endDate = this.getEndDate(this.schedule);
    this.duration = this.getDuration(this.schedule);
    this.total = this.service.getTotalPaid(this.schedule);
    this.interestTotal = this.service.getTotalInterest(this.schedule);

    if (_.isEmpty(this.changedSchedule)) {
      return;
    }

    this.changedEndDate = this.getEndDate(this.changedSchedule);
    this.changedDuration = this.getDuration(this.changedSchedule);
    this.changedTotal = this.service.getTotalPaid(this.changedSchedule);
    this.changedInterestTotal = this.service.getTotalInterest(this.changedSchedule);

    this.savings = this.service.round(this.service.getTotalPaid(this.schedule) - this.service.getTotalPaid(this.changedSchedule));
    this.timeSavings = this.service.getEndDifference(this.schedule, this.changedSchedule);
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
