import { Component, OnInit, ViewChild, ChangeDetectionStrategy, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, skip } from 'rxjs/operators';
import { Schedule, DATE_FORMAT } from '../mortgage/mortgage.model';
import * as moment from "moment";
import { MortgageService } from '../mortgage/mortgage.service';

@Component({
  selector: 'schedule-options',
  templateUrl: './schedule-options.component.html',
  styleUrls: ['./schedule-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleOptionsComponent {

  @Input() schedule: Schedule;
  @Output() scheduleUpdated = new EventEmitter<Schedule>();

  @ViewChild("form") form: NgForm;

  endDate: string;
  optionType = "endDate";
  private valueChanges$$: Subscription;

  constructor(
    private mortgageService: MortgageService
  ) { }

  ngOnChanges(changes: { schedule: SimpleChange }) {
    const prevSchedule = changes.schedule.previousValue
    if (this.schedule && prevSchedule && this.schedule.id !== prevSchedule.id || this.schedule && !prevSchedule) {
      this.optionType = "endDate";
      this.endDate = this.mortgageService.getEndDate(this.schedule).format(DATE_FORMAT);

      this.initForm();
    }    
  }

  ngOnDestroy() {
    if (this.valueChanges$$) {
      this.valueChanges$$.unsubscribe();
    }
  }

  initForm() {
    if (this.valueChanges$$) {
      this.valueChanges$$.unsubscribe();
    }

    this.valueChanges$$ = this.form.form.valueChanges
      .pipe(
        debounceTime(400),
        skip(1) // skip initial emit
      )
      .subscribe(() => {
        if (this.isEndTimeSelected) {
          let startDate = moment(this.schedule.startDate, DATE_FORMAT);
          let endDate = moment(this.endDate, DATE_FORMAT);
          
          this.schedule.months = Math.ceil(endDate.diff(startDate, "months", true));
          this.schedule.paymentDay = endDate.date();
        } else {
          this.endDate = this.mortgageService.getEndDate(this.schedule).format(DATE_FORMAT);
        }        

        this.scheduleUpdated.emit(this.schedule);
    }); 
  }

  get years() {
    return Math.floor(this.schedule.months / 12);
  }

  get isEndTimeSelected() {
    return this.optionType === "endDate";
  }

  onOptionTypeChange(event) {
    this.optionType = event.currentTarget.value;
  }

}
