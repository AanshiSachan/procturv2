import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomModule} from '../custom/custom.module';
import {EnquiryComponent} from './enquiry.component';
import {EnquiryAddComponent} from './enquiry-add/enquiry-add.component';
import {EnquiryBulkaddComponent} from './enquiry-bulkadd/enquiry-bulkadd.component';
import {EnquiryManageComponent} from './enquiry-manage/enquiry-manage.component';
import {EnquiryRoutingModule} from "./enquiry-routing.module";
import {ActionButtonComponent} from './enquiry-manage/action-button.component';
import { EnquiryEditComponent } from './enquiry-edit/enquiry-edit.component';
import {EnquiryPopUpComponent} from './enquiry-pop-up/enquiry-pop-up.component';
import {EnquiryInput} from './enquiry-directives/enquiry-input.directive';


/* Modules */
import { DatePickerModule } from 'angular-io-datepicker';
import { OverlayModule } from 'angular-io-overlay';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule } from '../../../ng2-smart-table';
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
        EnquiryRoutingModule,
        CustomModule
      ],
    declarations: [
        EnquiryComponent,
        EnquiryAddComponent,
        EnquiryBulkaddComponent,
        EnquiryManageComponent,
        ActionButtonComponent,
        EnquiryEditComponent,
        EnquiryPopUpComponent,
        EnquiryInput
    ],
    entryComponents: [
        ActionButtonComponent
      ],
    providers: [
    ]  
})
export class EnquiryModule {
    
}