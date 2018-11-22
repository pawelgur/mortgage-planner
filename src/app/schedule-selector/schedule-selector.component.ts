import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Schedule } from '../mortgage/mortgage.model';
import { getScheduleName } from '../schedule/schedule.util';
import * as _ from "lodash";

@Component({
  selector: 'schedule-selector',
  templateUrl: './schedule-selector.component.html',
  styleUrls: ['./schedule-selector.component.scss']
})
export class ScheduleSelectorComponent implements OnInit {
  
  @Input() schedules: Schedule[] = [];
  @Input() initialSelected: number;
  @Output() onSelect = new EventEmitter<number>();

  selectedSchedule: number;

  ngOnInit() {
    if (this.initialSelected) {
      this.selectedSchedule = this.initialSelected;
    }
  }

  scheduleName(schedule: Schedule) {
    return getScheduleName(schedule);
  }

  onChange(scheduleId: string) {
    this.selectedSchedule = _.toNumber(scheduleId);
    this.onSelect.emit(this.selectedSchedule);
  }

}
