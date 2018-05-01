import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsComponent } from './students.component';
import { StudentAddComponent } from './student-add/student-add.component'
import { StudentHomeComponent } from './student-home/student-home.component';
import { StudentRoutingModule } from './student-routing.module';
import { AddStudentPrefillService } from '../../services/student-services/add-student-prefill.service';

import { StudentPopUpComponent } from './student-pop-up/student-pop-up.component';
import { UserStudentComponent } from './student-custom/user-student.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';
import { CalendarModule } from 'primeng/primeng';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentBulkComponent } from './student-bulk/student-bulk.component';
import { SharedModule } from '../shared/shared.module';
import { SortPipe } from "./student-add/student-add.component";
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { WidgetService } from '../../services/widget.service';
import { OnlyNumber } from './student-directives/onlynumber.directive';
import { FetchStudentService } from '../../services/student-services/fetch-student.service';
import { PostStudentDataService } from '../../services/student-services/post-student-data.service';
import { StudentFeeTableComponent } from './student-fee-table/student-fee-table.component';
import { StudentDiscountComponent } from './student-discount/student-discount.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        StudentRoutingModule,
        BsDatepickerModule,
        Ng2OrderModule,
        FileUploadModule, SplitButtonModule, MenuModule,
        SharedModule
    ],
    declarations: [
        StudentsComponent,
        StudentAddComponent,
        StudentHomeComponent,
        StudentPopUpComponent,
        UserStudentComponent,
        StudentEditComponent,
        StudentBulkComponent,
        StudentSidebarComponent,
        SortPipe,
        OnlyNumber,
        StudentFeeTableComponent,
        StudentDiscountComponent
    ],
    providers: [
        AddStudentPrefillService,
        WidgetService,
        FetchStudentService,
        PostStudentDataService
    ],
    entryComponents: [
        UserStudentComponent,
        StudentFeeTableComponent,
        StudentDiscountComponent
    ]
})
export class StudentModule {
}