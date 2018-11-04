import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Schedule } from "./mortgage/mortgage.model";
import { ScheduleService } from "./schedule/schedule.service";
import { Observable } from "rxjs/Observable";
import { map, distinctUntilChanged } from "rxjs/operators";


@Injectable()
export class AppStateService {
    // todo: make this central part for updating and getting data (schedule.service would be more like "client" that would react to schedule updates)

    schedules$: Subject<any> = new BehaviorSubject(undefined);

    constructor(private scheduleService: ScheduleService) {
    }

    getSchedules(): Observable<Schedule[]> {
        return this.schedules$.pipe(
            map(() => this.scheduleService.getAll()),
            distinctUntilChanged()
        )
    }

    createSchedule(): Schedule {
        const schedule = this.scheduleService.create();
        this.scheduleService.save(schedule);
        this.schedules$.next();

        return schedule;
    }

    updateSchedule(schedule: Schedule) {
        console.log("schedule update", schedule);
        this.scheduleService.save(schedule);
        this.schedules$.next();
    }

    removeSchedule(schedule: Schedule) {
        this.scheduleService.remove(schedule);
        this.schedules$.next();
    }

}