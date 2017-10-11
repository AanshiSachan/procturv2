import {NgModule}       from '@angular/core';
import {CommonModule}   from '@angular/common';
import {StudentsComponent}    from './students.component';
import {StudentAddComponent}  from './student-add/student-add.component'
import {StudentHomeComponent} from './student-home/student-home.component';
import {StudentRoutingModule} from './student-routing.module';


import { DatePickerModule } from 'angular-io-datepicker';
import { OverlayModule } from 'angular-io-overlay';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BusyModule, BusyConfig} from 'angular2-busy';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { NgDatepickerModule } from 'ng2-datepicker';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        OverlayModule,
        DatePickerModule,
        MultiselectDropdownModule,
        Ng2SmartTableModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        NgDatepickerModule,
        CommonModule,
        StudentRoutingModule
      ],
    declarations: [
        StudentsComponent,
        StudentAddComponent,
        StudentHomeComponent
    ]
})
export class StudentModule {
}