import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { Payment, CalculatedSchedule, ScheduledPayment } from "../mortgage/mortgage.model";
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

  @Input() schedule: CalculatedSchedule

  constructor(
      public service: MortgageService
  ){}

  formatDate(date: moment.Moment) {
      return date.format("YYYY-MM-DD");
  }

  getPaymentLabel(payment: Payment) {
    return this.service.isScheduledPayment(payment)
      ? (payment as ScheduledPayment).paymentNr
      : "(ret)";
  }

}
