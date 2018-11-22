import { Injectable } from "@angular/core";
import { Schedule, ScheduleType, DATE_FORMAT } from "../mortgage/mortgage.model";
import * as _ from "lodash";
import * as moment from "moment";

const idsKey = "sch_ids";

@Injectable()
export class ScheduleService {       

    getAll(): Schedule[] {
        const ids = this.getIds();
        return ids.map(id => this.get(id));
    }

    get(id: number) {
        const key = this.getItemKey(id);
        const rawItem = localStorage.getItem(key);
        if (!rawItem) {
            return undefined;
        }

        return JSON.parse(rawItem) as Schedule;
    }

    save(schedule: Schedule) {
        const ids = this.getIds();
        if (!ids.find(id => id === schedule.id)) {
            ids.push(schedule.id);
            this.saveIds(ids);
        }

        const key = this.getItemKey(schedule.id);
        localStorage.setItem(key, JSON.stringify(schedule));
    }

    create(): Schedule {
        const schedule: Schedule = {
            id: this.getNewId(),
            name: "",
            sum: 10000,
            interest: 3,
            startDate: moment().format(DATE_FORMAT),
            paymentDay: 7,
            months: 120,
            type: ScheduleType.linear,          
            changes: [],
            extraCharges: 0,
            coverPenalty: 0
        };

        schedule.name = `${schedule.startDate} ${schedule.sum}eur ${schedule.months} months`;

        return schedule;
    }

    remove(schedule: Schedule) {
        const key = this.getItemKey(schedule.id);
        localStorage.removeItem(key);

        const ids = this.getIds();
        _.pull(ids, schedule.id);
        this.saveIds(ids);
    }

    copy(schedule: Schedule) {
        const clonedSchedule = _.cloneDeep(schedule);
        clonedSchedule.id = this.getNewId();
        
        return clonedSchedule;
    }

    private getIds(): number[] {
        const rawIds = localStorage.getItem(idsKey);
        if (!rawIds) {
            return [];
        }

        return JSON.parse(rawIds) as number[];
    }

    private saveIds(ids: number[]) {
        localStorage.setItem(idsKey, JSON.stringify(ids));
    }

    private getItemKey(id: number) {
        return `sch_item_${id}`;
    }

    private getNewId() {
        const ids = this.getIds();
        return _.isEmpty(ids) 
            ? 1 
            : _.last(ids) + 1;
    }

}