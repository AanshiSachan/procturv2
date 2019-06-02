import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibraryManagementComponent } from './library-management.component';
import { MastersComponent } from './masters/masters.component';
import { AddBookComponent } from './add-book/add-book.component';
import { IssueBookComponent } from './issue-book/issue-book.component';
import { ReturnBookComponent } from './return-book/return-book.component';
import { LibraryHomeComponent } from './library-home/library-home.component';

const routes: Routes = [];

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
                    component: LibraryHomeComponent,
                    pathMatch: 'prefix'
                },
                {
                    path: 'home',
                    component: LibraryHomeComponent,
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
                    path: 'issue',
                    component: IssueBookComponent,
                    pathMatch: 'prefix'
                },
                {
                    path: 'return',
                    component: ReturnBookComponent,
                    pathMatch: 'prefix'
                }
            ]
        }
    ])
  ],
  exports: [RouterModule]
})
export class LibraryManagementRoutingModule { }
