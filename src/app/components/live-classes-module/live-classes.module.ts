import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveClassesRoutingModule } from './live-classes-routing.module';
import { AddClassComponent } from './add-class/add-class.component';
import { EditClassComponent } from './edit-class/edit-class.component';

import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LiveClassesComponent } from './live-classes/live-classes.component';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap-custome';
import { ProductService } from '../../services/products.service';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';


@NgModule({
  imports: [
    CommonModule,
    LiveClassesRoutingModule,
    SharedModule,
    FormsModule,
    SharedModule,
    BsDatepickerModule,
    TimepickerModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    LiveClassesComponent,
    AddClassComponent,
    EditClassComponent,
    AttendanceReportComponent
  ],
  providers: [
    ProductService
  ]
})
export class LiveClassesModule { }
