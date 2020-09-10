import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { TimepickerModule } from 'ngx-bootstrap-custome/timepicker';
import { FileUploadModule, MenuModule, SplitButtonModule } from 'primeng/primeng';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';
import { ManageExamModule } from '../../master/master.module';
import { SharedModule } from '../../shared/shared.module';
import { LeadsModule } from '../leads.module';
import { ClosingReasonService } from '../services/closing-reason.service';
import { EnquiryBulkaddComponent } from './enquiry-bulkadd/enquiry-bulkadd.component';
import { EnquiryEditComponent } from './enquiry-edit/enquiry-edit.component';
import { ActionButtonComponent } from './enquiry-home/action-button.component';
import { CommentTooltipComponent } from './enquiry-home/comment-tooltip.component';
import { EnquiryHomeComponent } from './enquiry-home/enquiry-home.component';
import { EnquirySidebarComponent } from './enquiry-home/enquiry-sidebar/enquiry-sidebar.component';
import { SmsOptionComponent } from './enquiry-home/sms-option.component';
import { EnquiryPopUpComponent } from './enquiry-pop-up/enquiry-pop-up.component';
import { EnquiryRoutingModule } from "./enquiry-routing.module";
import { EnquiryComponent } from './enquiry.component';
import { EditorModule } from '@tinymce/tinymce-angular';



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
        SharedModule,
        LeadsModule,
        ManageExamModule,
        EditorModule
    ],
    declarations: [
        EnquiryComponent,
        EnquiryBulkaddComponent,
        ActionButtonComponent,
        SmsOptionComponent,
        EnquiryEditComponent,
        EnquiryPopUpComponent,
        EnquiryHomeComponent,
        CommentTooltipComponent,
        EnquirySidebarComponent
    ],
    entryComponents: [
        ActionButtonComponent,
        SmsOptionComponent,
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
