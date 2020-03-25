import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineAssignmentComponent } from './online-assignment.component';
import { ListAssignmentComponent } from './list-assignment/list-assignment.component';
import { ManageAssignmentComponent } from './manage-assignment/manage-assignment.component';
import { ReviewAssignmentComponent } from './review-assignment/review-assignment.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: '',
        component: OnlineAssignmentComponent,
        pathMatch: 'prefix',
        children: [
            {
                path: '',
                component: ListAssignmentComponent,
            },
            {
                path: 'home',
                component: ListAssignmentComponent,
                pathMatch: 'prefix',
            },
            {
                path: 'create-assignment',
                component: ManageAssignmentComponent,
                pathMatch: 'prefix',
            },
            {
                path: 'manage-assignment/:id',
                component: ManageAssignmentComponent,
                pathMatch: 'prefix',
            },
            {
                path: 'review-assignment/:id',
                component: ReviewAssignmentComponent,
                pathMatch: 'prefix',
            },

        ]
    }
  ]
  )],
  exports: [RouterModule]
})
export class OnlineAssignmentRoutingModule { }
