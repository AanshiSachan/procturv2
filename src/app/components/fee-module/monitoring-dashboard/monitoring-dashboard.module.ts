import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import 'moment';
import 'hammerjs';
import { SharedModule } from '../../shared/shared.module';

import { ExcelService } from '../../../services/excel.service';
import { monitoringService } from './services/monitoring.service'

import { MonitoringRoutingModule } from './monitoring-dashboard-routing.module';
import { MonitoringDashboardComponent } from './monitoring-dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';

import { FeeLineComponent } from './fee-line-widget/fee-line.component';
import { FeePieComponent } from './fee-pie-widget/fee-pie.component';
import { FeeStackbarComponent } from './fee-stackbar-widget/fee-stackbar.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MonitoringRoutingModule
    ],
    declarations: [
        MonitoringDashboardComponent,
        DashboardHomeComponent,
        FeeLineComponent,
        FeePieComponent,
        FeeStackbarComponent
    ],
    entryComponents: [
        FeeLineComponent,
        FeePieComponent,
        FeeStackbarComponent
    ],
    providers: [
        monitoringService
    ]
})
export class MonitoringDashboardModule {

}