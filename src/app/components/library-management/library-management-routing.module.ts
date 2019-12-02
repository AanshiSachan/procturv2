import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryManagementComponent } from './library-management.component';
import { MastersComponent } from './masters/masters.component';
import { AddBookComponent } from './add-book/add-book.component';
import { ReturnBookComponent } from './return-book/return-book.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IssueBookComponent } from './issue-book/issue-book.component';

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: LibraryManagementComponent,
            pathMatch: 'prefix',
            children: [
                {
                    path: '',
                    component: IssueBookComponent,
                    pathMatch: 'prefix'
                },
                {
                    path: 'issue',
                    component: IssueBookComponent,
                    pathMatch: 'prefix'
                },
                {
                    path: 'master',
                    component: MastersComponent,
                    pathMatch: 'prefix'
                },
                {
                    path: 'add',
                    component: AddBookComponent,
                    pathMatch: 'prefix'
                },
                {
                    path: 'return',
                    component: ReturnBookComponent,
                    pathMatch: 'prefix'
                },
                {
                    path: 'dashboard',
                    component: DashboardComponent,
                    pathMatch: 'prefix'
                },
                {
                    path: 'report',
                    loadChildren: "app/components/library-management/report/report.module#ReportModule",
                    pathMatch: 'prefix',
                }
            ]
        }
    ])
  ],
  exports: [RouterModule]
})
export class LibraryManagementRoutingModule { }
