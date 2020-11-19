import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { DateWiseComponent } from './date-wise/date-wise.component';
import { AllVideosComponent } from './all-videos/all-videos.component';

import { MatPaginatorModule } from '@angular/material/paginator';
@NgModule({
  declarations: [
    DateWiseComponent,
    AllVideosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AnalyticsRoutingModule,
    MatPaginatorModule
  ],
})
export class AnalyticsModule { }
