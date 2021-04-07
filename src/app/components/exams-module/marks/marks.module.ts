import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarksRoutingModule } from './marks-routing.module';
import { MarksComponent } from './marks.component';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import {SharedModule} from '../../shared/shared.module';
import { MarksUpdateComponent } from './marks-update/marks-update.component'


@NgModule({
  declarations: [MarksComponent, ScheduleListComponent, MarksUpdateComponent],
  imports: [
    CommonModule,
    MarksRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class MarksModule { }
