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

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';

import { MultiselectDropdownModule } from '../../../assets/imported_modules/multiselect-dropdown';
import { Ng2SmartTableModule } from '../../../assets/imported_modules/ng2-smart-table';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { TimepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/timepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { DateConverter } from './enquiry-home/enquiry-home.component';
import { EnquiryHomeComponent } from './enquiry-home/enquiry-home.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TableComponent } from './table-component/table.component';
import { TableBodyComponent } from './table-component/table-body.component';
import { TableHeaderComponent } from './table-component/table-header.component';
import { TableCellComponent } from './table-component/table-cell.component';

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
        TimepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule
    ],
    declarations: [
        EnquiryComponent,
        EnquiryAddComponent,
        EnquiryBulkaddComponent,
        ActionButtonComponent,
        TableBodyComponent,
        SmsOptionComponent,
        EnquiryEditComponent,
        EnquiryPopUpComponent,
        EnquiryInput,
        EnquiryDateInput,
        UserEnquiryComponent,
        DateConverter,
        EnquiryHomeComponent,
        CommentTooltipComponent,
        PaginationComponent,
        TableComponent,
        TableHeaderComponent,
        TableCellComponent
    ],
    entryComponents: [
        ActionButtonComponent,
        SmsOptionComponent,
        UserEnquiryComponent,
        CommentTooltipComponent,
        TableComponent,
        TableBodyComponent,
        TableHeaderComponent,
        TableCellComponent
    ],
    providers: [
    ]
})
export class EnquiryModule {

}