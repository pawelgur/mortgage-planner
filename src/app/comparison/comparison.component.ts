import { Component, OnInit } from '@angular/core';
import { Schedule, CalculatedSchedule } from '../mortgage/mortgage.model';
import { AppStateService } from '../app-state.service';
import { MortgageService } from '../mortgage/mortgage.service';

@Component({
  selector: 'comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss']
})
export class ComparisonComponent implements OnInit {
  schedules: Schedule[] = [];
  schedule1: CalculatedSchedule;
  schedule2: CalculatedSchedule;

  constructor(
    private appState: AppStateService,
    private mortgageService: MortgageService
  ) {}

  ngOnInit() {
    this.appState.getSchedules()
      .subscribe(schedules => this.schedules = schedules);
  }

  onSelect(id: number, isFirst = true) {
    const schedule = this.schedules.find(x => x.id === id);
    const calculatedSchedule = this.mortgageService.calculateSchedule(schedule);
    if (isFirst) {
      this.schedule1 = calculatedSchedule;
    } else {
      this.schedule2 = calculatedSchedule;
    }
  }

}
