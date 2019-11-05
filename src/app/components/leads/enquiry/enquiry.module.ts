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
import { UserEnquiryComponent } from './enquiry-custom/user-enquiry.component';
import { EnquirySidebarComponent } from './enquiry-home/enquiry-sidebar/enquiry-sidebar.component';
import { EnquiryHomeComponent } from './enquiry-home/enquiry-home.component';
/* Modules */
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { TimepickerModule } from 'ngx-bootstrap-custome/timepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { SharedModule } from '../../shared/shared.module';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';
import { ClosingReasonService } from '../../../services/closingReasons/closing-reason.service';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
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
        UserEnquiryComponent,

        EnquiryHomeComponent,
        CommentTooltipComponent,
        EnquirySidebarComponent
    ],
    entryComponents: [
        ActionButtonComponent,
        SmsOptionComponent,
        UserEnquiryComponent,
        CommentTooltipComponent,
        EnquirySidebarComponent
    ],
    providers: [
        PopupHandlerService,
        ClosingReasonService
    ],
    exports: [EnquiryHomeComponent]

})
export class EnquiryModule {

}
