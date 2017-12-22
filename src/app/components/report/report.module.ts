import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';


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
import { ReportHomeComponent } from './report-home/report-home.component';
import { SmsReportComponent } from './sms-report/sms-report.component';



@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MultiselectDropdownModule,
        Ng2SmartTableModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        CommonModule,
        ReportRoutingModule,
        BsDatepickerModule,
        TimepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule
    ],
    declarations: [
        ReportComponent,
        ReportHomeComponent,
        SmsReportComponent
    ],
    entryComponents: [

    ],
    providers: [
    ]
})
export class ReportModule {

}
