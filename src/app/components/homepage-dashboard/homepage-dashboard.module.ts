import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageDashboardComponent } from './homepage-dashboard.component';
import { HomepageDashboardRoutingModule } from "./homepage-dashboard-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem, SelectButtonModule } from 'primeng/primeng';
import 'moment';
import 'hammerjs';
import { ProcturWidgetComponent } from './proctur-widget/proctur-widget.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ChartModule } from 'angular-highcharts';
import { WidgetService } from '../../services/widget.service';
import { EnquiryWidgetComponent } from "./enquiry-widget/enquiry-widget.component";
import { FeeWidgetComponent } from './fee-widget/fee-widget.component';
import { GeneralWidgetComponent } from './general-widget/general-widget.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HomepageDashboardRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        SelectButtonModule,
        MenuModule,
        SharedModule,
        ChartModule
    ],
    declarations: [
        HomepageDashboardComponent,
        HomeComponent,
        AdminHomeComponent,
        ProcturWidgetComponent,
        EnquiryWidgetComponent,
        FeeWidgetComponent,
        GeneralWidgetComponent
    ],
    entryComponents: [
        ProcturWidgetComponent,
        EnquiryWidgetComponent,
        FeeWidgetComponent,
        GeneralWidgetComponent
    ],
    providers: [
        WidgetService
    ]
})
export class HomepageDashboardModule {

}