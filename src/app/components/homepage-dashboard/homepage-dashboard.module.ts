import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageDashboardComponent } from './homepage-dashboard.component';
import { HomepageDashboardRoutingModule } from "./homepage-dashboard-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import 'moment';
import 'hammerjs';
import { ProcturWidgetComponent } from './proctur-widget/proctur-widget.component';
import { SharedModule } from '../shared/shared.module';
// import { HomeComponent } from './home/home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ChartModule } from 'angular-highcharts';
import { WidgetService } from '../../services/widget.service';
import { EnquiryWidgetComponent } from "./enquiry-widget/enquiry-widget.component";
import { FeeWidgetComponent } from './fee-widget/fee-widget.component';
import { GeneralWidgetComponent } from './general-widget/general-widget.component';
import { BiometricWidgetComponent } from './biometric-widget/biometric-widget.component';
import { BiometricStatusServiceService } from '../../services/biometric-status/biometric-status-service.service';
import { BsDatepickerModule } from 'ngx-bootstrap-custome';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ExcelService } from '../../services/excel.service';
// import { MdFormFieldModule } from '@angular/material';
// import { MdInputModule } from '@angular/material';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HomepageDashboardRoutingModule,
        BsDatepickerModule,
        SharedModule,
        ChartModule,
        // MdFormFieldModule,
        // MdInputModule
    ],
    declarations: [
        HomepageDashboardComponent,
        // HomeComponent,
        AdminHomeComponent,
        ProcturWidgetComponent,
        EnquiryWidgetComponent,
        FeeWidgetComponent,
        GeneralWidgetComponent,
        BiometricWidgetComponent,
        ToDoListComponent,
        ExpensesComponent,
    ],
    entryComponents: [
        ProcturWidgetComponent,
        EnquiryWidgetComponent,
        FeeWidgetComponent,
        GeneralWidgetComponent
    ],
    providers: [
        WidgetService,
        ExcelService,
        BiometricStatusServiceService
    ]
})
export class HomepageDashboardModule {

}