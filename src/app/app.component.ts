import { Component } from '@angular/core';
import { Schedule } from './mortgage/mortgage.model';
import { AppStateService } from './app-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  schedules: Schedule[] = [];

  constructor(
    private appState: AppStateService
  ) {}

  ngOnInit() {
    this.appState.getSchedules()
      .subscribe(schedules => this.schedules = schedules);
  }

  create() {
    this.appState.createSchedule();
  }

  remove(schedule: Schedule) {
    this.appState.removeSchedule(schedule);    
  }

  copy(schedule: Schedule) {
    this.appState.copySchedule(schedule);    
  }
}
