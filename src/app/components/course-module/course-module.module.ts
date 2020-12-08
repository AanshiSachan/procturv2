import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseModuleComponent } from './course-module.component';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CourseModuleRoutingModule } from './course-module-routing.module';
import { CourseHomeComponent } from './course-home/course-home.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { timeTableService } from '../../services/TimeTable/timeTable.service';
import { tableComponent } from './time-table/table/table.component';
import { SharedModule } from '../shared/shared.module';
import { MasterTagComponent } from './master-tag/master-tag.component';
import { EcourseMappingComponent } from './ecourse-mapping/ecourse-mapping.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { DateWiseComponent } from './analytics/date-wise/date-wise.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    CourseModuleRoutingModule,
    SharedModule,
    FormsModule,
    MatPaginatorModule
  ],
  declarations: [
    CourseModuleComponent,
    CourseHomeComponent,
    TimeTableComponent,
    tableComponent,
    MasterTagComponent,
    EcourseMappingComponent,
    AnalyticsComponent,
  ],
  entryComponents: [
    CourseModuleComponent,
    tableComponent
  ],
  providers: [
    timeTableService
  ],
  exports: []
})
export class CourseModule2 { }
