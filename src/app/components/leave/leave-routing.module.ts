import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { LeaveCategoryComponent } from './leave-category/leave-category.component';
import { LeavePermissionComponent } from './leave-permission/leave-permission.component';
import { LeaveComponent } from './leave/leave.component';


const routes: Routes = [
  {
    path: '',
    component: LeaveComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: '', component: LeaveComponent
      },
      { path: 'leave-application', component: LeaveApplicationComponent },
      { path: 'leave-category', component: LeaveCategoryComponent },
      { path: 'leave-permission', component: LeavePermissionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }
