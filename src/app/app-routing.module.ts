import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ScheduleContainerComponent } from './schedule-container/schedule-container.component';
import { ComparisonComponent } from './comparison/comparison.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "schedule/:id", component: ScheduleContainerComponent },
  { path: "compare", component: ComparisonComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
