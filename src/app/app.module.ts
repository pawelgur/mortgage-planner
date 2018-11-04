import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MortgageService } from './mortgage/mortgage.service';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleService } from './schedule/schedule.service';
import { AppStateService } from './app-state.service';
import { ScheduleContainerComponent } from './schedule-container/schedule-container.component';
import { FormsModule } from '@angular/forms';
import { ChangesComponent } from './changes/changes.component';
import { ChangeRowComponent } from './changes/change-row.component';
import { ScheduleOptionsComponent } from './schedule-options/schedule-options.component';
import { ScheduleComparisonComponent } from './schedule-comparison/schedule-comparison.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ScheduleComponent,
    ScheduleContainerComponent,
    ChangesComponent,
    ChangeRowComponent,
    ScheduleOptionsComponent,
    ScheduleComparisonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    MortgageService,
    ScheduleService,
    AppStateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
