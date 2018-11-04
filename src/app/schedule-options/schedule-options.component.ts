import { Component, OnInit, ViewChild, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, skip } from 'rxjs/operators';
import { Schedule } from '../mortgage/mortgage.model';

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

  private valueChanges$$: Subscription;

  ngAfterViewInit() {
    this.valueChanges$$ = this.form.form.valueChanges
      .pipe(
        debounceTime(400),
        skip(1) // skip initial emit todo: improve as it still gets through
      )
      .subscribe(() => {
        this.scheduleUpdated.emit(this.schedule);
    });    
  }

  ngOnDestroy() {
    if (this.valueChanges$$) {
      this.valueChanges$$.unsubscribe();
    }
  }

  get years() {
    return Math.floor(this.schedule.months / 12);
  }

}
