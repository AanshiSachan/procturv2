import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineAssignmentRoutingModule } from './online-assignment-routing.module';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
// online assignmetn components used
import { ListAssignmentComponent } from './list-assignment/list-assignment.component';
import { ManageAssignmentComponent } from './manage-assignment/manage-assignment.component';
import { ReviewAssignmentComponent } from './review-assignment/review-assignment.component';
import { OnlineAssignmentComponent } from './online-assignment.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    FileUploadModule,
    SplitButtonModule,
    OnlineAssignmentRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    OnlineAssignmentComponent,
    ListAssignmentComponent,
    ManageAssignmentComponent,
    ReviewAssignmentComponent
  ]
})
export class OnlineAssignmentModule { }
