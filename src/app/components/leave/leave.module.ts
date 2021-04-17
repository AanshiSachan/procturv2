import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveRoutingModule } from './leave-routing.module';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { LeaveCategoryComponent } from './leave-category/leave-category.component';
import { LeavePermissionComponent } from './leave-permission/leave-permission.component';
import { LeaveComponent } from './leave/leave.component';
import { FormsModule } from '@angular/forms';
import { ExportToPdfService } from '../../services/export-to-pdf.service';
// import { ExcelService } from '../../services/excel.service';
import { SharedModule } from '../shared/shared.module';

import 'moment';




@NgModule({
  declarations: [LeaveApplicationComponent, LeaveCategoryComponent, LeavePermissionComponent, LeaveComponent],
  imports: [
    CommonModule,
    LeaveRoutingModule,
    FormsModule,
    SharedModule,

  ],
  providers: [
    ExportToPdfService
  ],
})
export class LeaveModule { }
