import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from "@angular/core";
import { CoverChange, DATE_FORMAT } from "../mortgage/mortgage.model";
import * as moment from "moment";
import * as _ from "lodash";

@Component({
    selector: "changes",
    templateUrl: "./changes.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangesComponent {

    @Input() set changes(changes: CoverChange[]) {
        this._changes = [...changes];
    } 
    get changes() {
        return this._changes;
    }
    _changes: CoverChange[];

    @Output() onChanges = new EventEmitter<CoverChange[]>();

    returnStartDate = "2018-01-01";
    returnAmount: number = 1500;
    returnTimes: number = 10;
    returnPeriodMonths: number = 2;    

    addChange() {
        const lastChange = _.last(this.changes);
        const date = lastChange ? moment(lastChange.date).add(1, "month") : moment();
        this.changes.push({
            id: lastChange ? lastChange.id + 1 : 1,
            date: date.format(DATE_FORMAT),
            amount: 0,
            penaltyEnabled: true
        });
    }

    onChangeUpdate() {
        this.onChanges.emit(this.changes);
    }

    onChangeRemove(change: CoverChange) {
        _.pull(this.changes, change);
        this.onChanges.emit(this.changes);
    }

    onPeriodicAdd() {
        // let date = moment(this.returnStartDate);
        // for (let i = 0; i < this.returnTimes; i++) {
        //     id++;
        //     this.changes.push({
        //         id,
        //         date,
        //         amount: this.returnAmount
        //     });
        //     date =  moment(date).add(this.returnPeriodMonths, "month");
        // }

        // this.updateChanges();
    }

    trackById(_index: number, change: CoverChange) {
        return change.id;
    }

}