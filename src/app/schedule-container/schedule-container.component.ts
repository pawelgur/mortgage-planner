import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Schedule, Payment, CoverChange, DATE_FORMAT, CalculatedSchedule } from '../mortgage/mortgage.model';
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
  styleUrls: ['./schedule-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleContainerComponent implements OnInit {

  schedule: Schedule;

  linearSchedule: CalculatedSchedule;
  changedSchedule: CalculatedSchedule;
  
  hideChanges = false;

  private params$$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private service: MortgageService,
    private appState: AppStateService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log("schedule-container init");

    this.params$$ = this.route.paramMap.subscribe(params => {
      const id = +params.get("id");
      this.schedule = this.scheduleService.get(id);

      this.linearSchedule = this.service.calculateSchedule(this.schedule, true);
      this.recalculateChangedSchedule();

      this.changeDetector.markForCheck();
    });
  }

  ngOnDestroy() {
    this.params$$.unsubscribe();
  }

  onScheduleUpdated() {
    this.appState.updateSchedule(this.schedule);        

    this.linearSchedule = this.service.calculateSchedule(this.schedule, true);
    this.recalculateChangedSchedule();
  }

  onChangesUpdated(changes: CoverChange[]) {    
    this.schedule.changes = changes;
    this.appState.updateSchedule(this.schedule);
    this.recalculateChangedSchedule();
  }

  formatDate(date: moment.Moment) {
    return date.format(DATE_FORMAT);
  }

  private recalculateChangedSchedule() {
    if (_.isEmpty(this.schedule.changes)) {
      this.changedSchedule = undefined;
      return;
    }

    this.changedSchedule = this.service.calculateSchedule(this.schedule);
  }

  get name() {
    return this.schedule && getScheduleName(this.schedule);
  }

  get hasChanges() {
    return !_.isEmpty(this.schedule.changes);
  }

  get calculatedSchedule() {
    return this.hasChanges && !this.hideChanges ? this.changedSchedule : this.linearSchedule;
  }

}
