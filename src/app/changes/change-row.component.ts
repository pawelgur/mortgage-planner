import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";
import { CoverChange } from "../mortgage/mortgage.model";
import * as moment from "moment";

@Component({
    selector: "change-row",
    templateUrl: "./change-row.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeRowComponent {

    @Input() change: CoverChange;
    @Output() changeUpdated = new EventEmitter();
    @Output() changeRemoved = new EventEmitter<CoverChange>();

    returnDate: string = "yyyy-mm-dd";
    returnAmount: number;
    penaltyEnabled = true;
    isEditing = true;

    formatDate(date: moment.Moment) {
        return date.format("YYYY-MM-DD");
    }

    ngOnChanges() {
        this.returnDate = this.change.date;
        this.returnAmount = this.change.amount;
        this.penaltyEnabled = !!this.change.penaltyEnabled;
    }

    onSave() {
        this.isEditing = false;
        this.change.date = this.returnDate;
        this.change.amount = this.returnAmount;
        this.change.penaltyEnabled = this.penaltyEnabled;
        this.changeUpdated.emit();
    }

    onEdit() {
        this.isEditing = true;
    }

}