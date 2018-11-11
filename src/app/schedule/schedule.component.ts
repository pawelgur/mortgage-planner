import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { Payment } from "../mortgage/mortgage.model";
import { MortgageService } from "../mortgage/mortgage.service";
import * as _ from "lodash";
import * as moment from "moment";

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent {

  @Input() schedule: Payment[] = [];

  total: number;
  coverTotal: number;
  interestTotal: number;

  constructor(
      private service: MortgageService
  ){}

  ngOnChanges() {
      this.total =  this.service.getTotalPaid(this.schedule);
      this.coverTotal = this.service.getTotalCover(this.schedule);
      this.interestTotal = this.service.getTotalInterest(this.schedule);
  }

  formatDate(date: moment.Moment) {
      return date.format("YYYY-MM-DD");
  }

}
