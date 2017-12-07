import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnquiryComponent } from './enquiry.component';
import { EnquiryAddComponent } from './enquiry-add/enquiry-add.component';
import { EnquiryBulkaddComponent } from './enquiry-bulkadd/enquiry-bulkadd.component';
import { EnquiryManageComponent } from './enquiry-manage/enquiry-manage.component';
import { EnquiryRoutingModule } from "./enquiry-routing.module";
import { ActionButtonComponent } from './enquiry-home/action-button.component';
import { CommentTooltipComponent } from './enquiry-home/comment-tooltip.component';
import { SmsOptionComponent } from './enquiry-home/sms-option.component';
import { EnquiryEditComponent } from './enquiry-edit/enquiry-edit.component';
import { EnquiryPopUpComponent } from './enquiry-pop-up/enquiry-pop-up.component';
import { EnquiryInput, EnquiryDateInput } from './enquiry-directives/enquiry-input.directive';
import { UserEnquiryComponent } from './enquiry-custom/user-enquiry.component';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';

import { MultiselectDropdownModule } from '../../../assets/imported_modules/multiselect-dropdown';
import { Ng2SmartTableModule } from '../../../assets/imported_modules/ng2-smart-table';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { DateConverter } from './enquiry-home/enquiry-home.component';
import { EnquiryHomeComponent } from './enquiry-home/enquiry-home.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MultiselectDropdownModule,
        Ng2SmartTableModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        CommonModule,
        EnquiryRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule
    ],
    declarations: [
        EnquiryComponent,
        EnquiryAddComponent,
        EnquiryBulkaddComponent,
        EnquiryManageComponent,
        ActionButtonComponent,
        SmsOptionComponent,
        EnquiryEditComponent,
        EnquiryPopUpComponent,
        EnquiryInput,
        EnquiryDateInput,
        UserEnquiryComponent,
        DateConverter,
        EnquiryHomeComponent,
        CommentTooltipComponent
    ],
    entryComponents: [
        ActionButtonComponent,
        SmsOptionComponent,
        UserEnquiryComponent,
        CommentTooltipComponent
    ],
    providers: [
    ]
})
export class EnquiryModule {

}