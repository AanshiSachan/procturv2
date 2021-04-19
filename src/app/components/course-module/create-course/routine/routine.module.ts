import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutineRoutingModule } from './routine-routing.module';
import { RoutineComponent } from './routine.component';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [RoutineComponent, ListComponent, AddEditComponent],
  imports: [
    CommonModule,
    RoutineRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class RoutineModule { }
