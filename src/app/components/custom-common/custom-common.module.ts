import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomCommonComponent } from './custom-common.component';
import { CustomCommonRoutingModule } from './custom-common-routing.module';
import { CheckBoxConverter } from './create-custom-comp/create-custom-comp.component';
import { BooleanConverter } from './create-custom-comp/create-custom-comp.component';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreateCustomCompComponent } from './create-custom-comp/create-custom-comp.component';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { OnlyNumber } from './onlynumber.directive';
import {SharedModule} from '../shared/shared.module'

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CustomCommonRoutingModule,
        BsDatepickerModule,
        BusyModule,
        SharedModule
    ],
    declarations: [
        CustomCommonComponent,
        CreateCustomCompComponent,
        CheckBoxConverter,
        BooleanConverter,
        OnlyNumber
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class CustomCommonModule {

}