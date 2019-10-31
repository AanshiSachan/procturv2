import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import 'moment';
import { SharedModule } from '../shared/shared.module';

import { LibraryManagementRoutingModule } from './library-management-routing.module';
import { LibraryManagementComponent } from './library-management.component';
import { MastersComponent } from './masters/masters.component';
import { AddBookComponent } from './add-book/add-book.component';
import { IssueBookComponent } from './issue-book/issue-book.component';
import { ReturnBookComponent } from './return-book/return-book.component';
import { LibraryHomeComponent } from './library-home/library-home.component';
import { ActivityComponent } from './activity/activity.component';
import { ReportComponent } from './report/report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReturnBookService } from '../../services/library/return/return-book.service';
import { IssueBookService } from '../../services/library/issue/issue-book.service';
import { AddBookService } from '../../services/library/add/add-book.service';
import { MastersService } from '../../services/library/master/masters.service';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    FileUploadModule,
    SplitButtonModule,
    CommonModule,
    SharedModule,
    LibraryManagementRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    MastersComponent,
    LibraryManagementComponent,
    AddBookComponent,
    IssueBookComponent,
    ReturnBookComponent,
    LibraryHomeComponent,
    ActivityComponent,
    ReportComponent,
    DashboardComponent
  ],
  entryComponents: [
    AddBookComponent
  ],
  providers:[
    ReturnBookService,
    IssueBookService,
    AddBookService,
    MastersService
  ]
})
export class LibraryManagementModule { }
