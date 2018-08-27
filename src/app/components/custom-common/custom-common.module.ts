import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomCommonComponent } from './custom-common.component';
import { StudentCustomComponent } from './student-custom-comp/student-custom-comp.component';
import { CustomCommonRoutingModule } from './custom-common-routing.module';
import { CheckBoxConverter } from './create-custom-comp/create-custom-comp.component';
import { BooleanConverter } from './create-custom-comp/create-custom-comp.component';
import { CreateCustomCompComponent } from './create-custom-comp/create-custom-comp.component';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { SharedModule } from '../shared/shared.module'

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CustomCommonRoutingModule,
        BsDatepickerModule,
        SharedModule
    ],
    declarations: [
        CustomCommonComponent,
        CreateCustomCompComponent,
        StudentCustomComponent,
        CheckBoxConverter,
        BooleanConverter,
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class CustomCommonModule {

}