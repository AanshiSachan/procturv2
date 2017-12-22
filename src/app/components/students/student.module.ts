import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsComponent } from './students.component';
import { StudentAddComponent } from './student-add/student-add.component'
import { StudentHomeComponent } from './student-home/student-home.component';
import { StudentRoutingModule } from './student-routing.module';
import { AddStudentPrefillService } from '../../services/student-services/add-student-prefill.service';
import { studentInput } from './student-directives/student-input.directive';
import { StudentPopUpComponent } from './student-pop-up/student-pop-up.component';
import { UserStudentComponent } from './student-custom/user-student.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';
import { MultiselectDropdownModule } from '../../../assets/imported_modules/multiselect-dropdown';
import { Ng2SmartTableModule } from '../../../assets/imported_modules/ng2-smart-table';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { CalendarModule } from 'primeng/primeng';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentBulkComponent } from './student-bulk/student-bulk.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        StudentRoutingModule,
        MultiselectDropdownModule,
        Ng2SmartTableModule,
        BsDatepickerModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        FileUploadModule, SplitButtonModule, MenuModule
    ],
    declarations: [
        StudentsComponent,
        StudentAddComponent,
        StudentHomeComponent,
        studentInput,
        StudentPopUpComponent,
        UserStudentComponent,
        StudentEditComponent,
        StudentBulkComponent,
        PaginationComponent
    ],
    providers: [
        AddStudentPrefillService
    ],
    entryComponents: [
        UserStudentComponent
    ]
})
export class StudentModule {
}