import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';
import { CalendarModule } from 'primeng/primeng';
import { StudentRoutingModule } from './student-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { SharedModule } from '../shared/shared.module';

import { StudentBatchListComponent } from './student-batch-list/student-batch-list.component';
import { StudentsComponent } from './students.component';
import { StudentAddComponent } from './student-add/student-add.component'
import { StudentHomeComponent } from './student-home/student-home.component';
import { UserStudentComponent } from './student-custom/user-student.component';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentBulkComponent } from './student-bulk/student-bulk.component';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { StudentFeeTableComponent } from './student-fee-table/student-fee-table.component';
import { StudentDiscountComponent } from './student-discount/student-discount.component';
import { PartialPayHistoryComponent } from './partial-pay-history/partial-pay-history.component';

import { PostStudentDataService } from '../../services/student-services/post-student-data.service';
import { FetchStudentService } from '../../services/student-services/fetch-student.service';
import { AddStudentPrefillService } from '../../services/student-services/add-student-prefill.service';
import { SortPipe } from "./student-add/student-add.component";
import { WidgetService } from '../../services/widget.service';
import { StudentFeeService } from './student_fee.service';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        StudentRoutingModule,
        BsDatepickerModule,
        FileUploadModule, SplitButtonModule, MenuModule,
        SharedModule
    ],
    declarations: [
        StudentsComponent,
        StudentAddComponent,
        StudentHomeComponent,
        UserStudentComponent,
        StudentEditComponent,
        StudentBulkComponent,
        StudentSidebarComponent,
        StudentBatchListComponent,
        SortPipe,
        StudentFeeTableComponent,
        StudentDiscountComponent,
        PartialPayHistoryComponent
    ],
    providers: [
        AddStudentPrefillService,
        WidgetService,
        FetchStudentService,
        PostStudentDataService,
        StudentFeeService
    ],
    entryComponents: [
        UserStudentComponent,
        StudentFeeTableComponent,
        StudentDiscountComponent,
        StudentBatchListComponent,
        PartialPayHistoryComponent
    ]
})
export class StudentModule {
}