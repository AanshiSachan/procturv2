import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component'
import { EnquiryAddComponent } from './enquiry-add/enquiry-add.component';
// import { EnquiryReportComponent } from './enquiry-report/enquiry-report.component';


/* Modules */
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { TimepickerModule } from 'ngx-bootstrap-custome/timepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { SharedModule } from '../shared/shared.module';
import { PopupHandlerService } from '../../services/enquiry-services/popup-handler.service';
import { ClosingReasonService } from './services/closing-reason.service';
import { LeadsHomeComponent } from './leads-home/leads-home.component';
import { DataSetupComponent } from './data-setup/data-setup.component';
import { UserEnquiryComponent } from './enquiry/enquiry-custom/user-enquiry.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    BsDatepickerModule,
    TimepickerModule,
    FileUploadModule,
    SplitButtonModule,
    MenuModule,
    SharedModule,
    LeadsRoutingModule
  ],
  declarations: [
    LeadsComponent,
    LeadsHomeComponent,
    EnquiryAddComponent,
    DataSetupComponent,
    UserEnquiryComponent,
    // EnquiryReportComponent
  ],
  entryComponents: [
      LeadsComponent,
      UserEnquiryComponent
  ],
  providers: [
      PopupHandlerService,
      ClosingReasonService
  ],
  exports: [
    UserEnquiryComponent
  ]
})
export class LeadsModule { }
