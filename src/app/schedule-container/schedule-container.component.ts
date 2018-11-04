import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Schedule, Payment, CoverChange, DATE_FORMAT } from '../mortgage/mortgage.model';
import { ScheduleService } from '../schedule/schedule.service';
import { getScheduleName } from '../schedule/schedule.util';
import { MortgageService } from '../mortgage/mortgage.service';
import * as moment from "moment";
import * as _ from "lodash";
import { AppStateService } from '../app-state.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'schedule-container',
  templateUrl: './schedule-container.component.html',
  styleUrls: ['./schedule-container.component.scss']
})
export class ScheduleContainerComponent implements OnInit {

  schedule: Schedule;

  linearSchedule: Payment[] = [];
  changedSchedule: Payment[] = [];

  savings = 0;
  timeSavings = "none";
  showOriginal = false;

  private params$$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private service: MortgageService,
    private appState: AppStateService
  ) { }

  ngOnInit() {
    console.log("schedule-container init");

    this.params$$ = this.route.paramMap.subscribe(params => {
      const id = +params.get("id");
      this.schedule = this.scheduleService.get(id);

      this.linearSchedule = this.service.calculateLinearSchedule(this.schedule);
      this.recalculateChangedSchedule();
    });
  }

  ngOnDestroy() {
    this.params$$.unsubscribe();
  }

  onScheduleUpdated() {
    this.appState.updateSchedule(this.schedule);        

    this.linearSchedule = this.service.calculateLinearSchedule(this.schedule);
    this.recalculateChangedSchedule();
  }

  onChangesUpdated() {    
    this.appState.updateSchedule(this.schedule);
    this.recalculateChangedSchedule();
  }

  formatDate(date: moment.Moment) {
    return date.format(DATE_FORMAT);
  }

  private recalculateChangedSchedule() {
    if (_.isEmpty(this.schedule.changes)) {
      this.changedSchedule = undefined;
      this.savings = 0;
      this.timeSavings = undefined;
      return;
    }

    this.changedSchedule = this.service.calculateSchedule(this.schedule);

    this.savings = this.service.round(this.service.getTotalPaid(this.linearSchedule) - this.service.getTotalPaid(this.changedSchedule));
    this.timeSavings = this.service.getEndDifference(this.linearSchedule, this.changedSchedule);
  }

  get name() {
    return this.schedule && getScheduleName(this.schedule);
  }

  get hasChanges() {
    return !_.isEmpty(this.schedule.changes);
  }

}
