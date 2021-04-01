import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveRoutingModule } from './leave-routing.module';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { LeaveCategoryComponent } from './leave-category/leave-category.component';
import { LeavePermissionComponent } from './leave-permission/leave-permission.component';
import { LeaveComponent } from './leave/leave.component';


@NgModule({
  declarations: [LeaveApplicationComponent, LeaveCategoryComponent, LeavePermissionComponent, LeaveComponent],
  imports: [
    CommonModule,
    LeaveRoutingModule
  ]
})
export class LeaveModule { }
