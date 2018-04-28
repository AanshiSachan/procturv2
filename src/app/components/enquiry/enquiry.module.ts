import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnquiryComponent } from './enquiry.component';
import { EnquiryAddComponent } from './enquiry-add/enquiry-add.component';
import { EnquiryBulkaddComponent } from './enquiry-bulkadd/enquiry-bulkadd.component';
import { EnquiryRoutingModule } from "./enquiry-routing.module";
import { ActionButtonComponent } from './enquiry-home/action-button.component';
import { CommentTooltipComponent } from './enquiry-home/comment-tooltip.component';
import { SmsOptionComponent } from './enquiry-home/sms-option.component';
import { EnquiryEditComponent } from './enquiry-edit/enquiry-edit.component';
import { EnquiryPopUpComponent } from './enquiry-pop-up/enquiry-pop-up.component';
import { EnquiryInput, EnquiryDateInput } from './enquiry-directives/enquiry-input.directive';
import { UserEnquiryComponent } from './enquiry-custom/user-enquiry.component';
import { EnquirySidebarComponent } from './enquiry-home/enquiry-sidebar/enquiry-sidebar.component';
/* Modules */
import { FormsModule, ReactiveFormsModule,FormBuilder,Validators,FormControl } from "@angular/forms";
import 'moment';
import 'hammerjs';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { TimepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/timepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { DateConverter } from './enquiry-home/enquiry-home.component';
import { EnquiryHomeComponent } from './enquiry-home/enquiry-home.component';
import { SharedModule } from '../shared/shared.module';
import { OnlyNumber } from './enquiry-directives/onlynumber.directive';

import { PopupHandlerService } from '../../services/enquiry-services/popup-handler.service';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        CommonModule,
        EnquiryRoutingModule,
        BsDatepickerModule,
        TimepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule
    ],
    declarations: [
        EnquiryComponent,
        EnquiryAddComponent,
        EnquiryBulkaddComponent,
        ActionButtonComponent,
        SmsOptionComponent,
        EnquiryEditComponent,
        EnquiryPopUpComponent,
        EnquiryInput,
        EnquiryDateInput,
        UserEnquiryComponent,
        DateConverter,
        OnlyNumber,
        EnquiryHomeComponent,
        CommentTooltipComponent,
        EnquirySidebarComponent
    ],
    entryComponents: [
        ActionButtonComponent,
        SmsOptionComponent,
        UserEnquiryComponent,
        CommentTooltipComponent,
        EnquirySidebarComponent,
        
    ],
    providers: [
        PopupHandlerService,
    ]
})
export class EnquiryModule {

}


