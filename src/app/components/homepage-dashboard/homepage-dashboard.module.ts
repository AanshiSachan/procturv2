import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageDashboardComponent } from './homepage-dashboard.component';
import { HomepageDashboardRoutingModule } from "./homepage-dashboard-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
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
import { BiometricMaterialWidgetComponent } from './biometric-material-widget/biometric-material-widget.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HomepageDashboardRoutingModule,
        BsDatepickerModule,
        SharedModule,
        ChartModule
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
        BiometricMaterialWidgetComponent
    ],
    entryComponents: [
        ProcturWidgetComponent,
        EnquiryWidgetComponent,
        FeeWidgetComponent,
        GeneralWidgetComponent
    ],
    providers: [
        WidgetService,
        BiometricStatusServiceService
    ]
})
export class HomepageDashboardModule {

}