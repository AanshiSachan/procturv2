import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StudentsComponent}    from './students.component';
import {StudentAddComponent}  from './student-add/student-add.component'
import {StudentHomeComponent} from './student-home/student-home.component';
import {StudentRoutingModule} from './student-routing.module';
import {AddStudentPrefillService} from '../../services/student-services/add-student-prefill.service';
import {studentInput} from './student-directives/student-input.directive';
import {StudentPopUpComponent} from './student-pop-up/student-pop-up.component';
import {UserStudentComponent} from './student-custom/user-student.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule } from '../../../assets/imported_modules/ng2-smart-table';
import { BusyModule, BusyConfig} from 'angular2-busy';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import {CalendarModule} from 'primeng/primeng';
import {BsDatepickerModule} from '../../../assets/imported_modules/ngx-bootstrap/datepicker';

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
      ],
    declarations: [
        StudentsComponent,
        StudentAddComponent,
        StudentHomeComponent,
        studentInput,
        StudentPopUpComponent,
        UserStudentComponent
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