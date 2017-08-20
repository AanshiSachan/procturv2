import { AppComponent } from './core/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePickerModule } from 'angular-io-datepicker';
import { OverlayModule } from 'angular-io-overlay';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MaterialModule, MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule, MdDatepickerModule, MdDialogModule, MdExpansionModule, MdGridListModule, MdIconModule, MdInputModule, MdListModule, MdMenuModule, MdNativeDateModule,
  MdPaginatorModule, MdProgressBarModule, MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectModule, MdSidenavModule, MdSliderModule, MdSlideToggleModule, MdSnackBarModule, MdSortModule, MdTableModule, MdTabsModule, MdToolbarModule, MdTooltipModule,
} from '@angular/material';
import 'moment';
import 'hammerjs';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule } from 'ng2-smart-table';

/* Custom compoonent */
import { EnquiryComponent } from './enquiry/enquiry.component';
import { EnquiryLeadsComponent } from './enquiry/enquiry-leads/enquiry-leads.component';
import { EnquiryManageComponent } from './enquiry/enquiry-manage/enquiry-manage.component';
import { EnquiryReportComponent } from './enquiry/enquiry-report/enquiry-report.component';
import { EnquiryMasterComponent } from './enquiry/enquiry-master/enquiry-master.component';
import { EnquiryHomeComponent } from './enquiry/enquiry-home/enquiry-home.component';

/* Services */
import { FetchenquiryService } from './services/fetchenquiry.service';
import { FetchenquirycampaignService } from './services/fetchenquirycampaign.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAttendanceComponent } from './dashboard/dashboard-attendance/dashboard-attendance.component';
import { DashboardFeesComponent } from './dashboard/dashboard-fees/dashboard-fees.component';
import { DashboardManageFeesComponent } from './dashboard/dashboard-fees/dashboard-manage-fees/dashboard-manage-fees.component';
import { DashboardManageChequesComponent } from './dashboard/dashboard-fees/dashboard-manage-cheques/dashboard-manage-cheques.component';
import { DashboardNotificationsComponent } from './dashboard/dashboard-notifications/dashboard-notifications.component';
import { DashboardOthersComponent } from './dashboard/dashboard-others/dashboard-others.component';
import { DashboardEmployeeManagementComponent } from './dashboard/dashboard-employee-management/dashboard-employee-management.component';
import { DashboardExamsComponent } from './dashboard/dashboard-exams/dashboard-exams.component';
import { DashboardExamsAttendanceComponent } from './dashboard/dashboard-exams/dashboard-exams-attendance/dashboard-exams-attendance.component';
import { DashboardExamsMarksComponent } from './dashboard/dashboard-exams/dashboard-exams-marks/dashboard-exams-marks.component';
import { DashboardSentNotificationsComponent } from './dashboard/dashboard-notifications/dashboard-sent-notifications/dashboard-sent-notifications.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { DashboardReportsComponent } from './dashboard/dashboard-reports/dashboard-reports.component';
import { DashboardStudentsComponent } from './dashboard/dashboard-students/dashboard-students.component';
import { DashboardBatchComponent } from './dashboard/dashboard-batch/dashboard-batch.component';
import { DashboardSettingsComponent } from './dashboard/dashboard-settings/dashboard-settings.component';
import { ProfileComponent } from './profile/profile.component';

const appRoutes = [
  {
    path: 'enquiry',
    component: EnquiryComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        component: EnquiryHomeComponent,
      },
      {
        path: 'lead',
        component: EnquiryLeadsComponent,
        pathMatch: 'full',
      },
      {
        path: 'manage',
        component: EnquiryManageComponent,
        pathMatch: 'full',
      },
      {
        path: 'master',
        component: EnquiryMasterComponent,
        pathMatch: 'full',
      },
      {
        path: 'report',
        component: EnquiryReportComponent,
        pathMatch: 'full',
      },
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    EnquiryComponent,
    EnquiryLeadsComponent,
    EnquiryManageComponent,
    EnquiryReportComponent,
    EnquiryMasterComponent,
    EnquiryHomeComponent,
    DashboardComponent,
    DashboardAttendanceComponent,
    DashboardFeesComponent,
    DashboardManageFeesComponent,
    DashboardManageChequesComponent,
    DashboardNotificationsComponent,
    DashboardOthersComponent,
    DashboardEmployeeManagementComponent,
    DashboardExamsComponent,
    DashboardExamsAttendanceComponent,
    DashboardExamsMarksComponent,
    DashboardSentNotificationsComponent,
    DashboardHomeComponent,
    DashboardReportsComponent,
    DashboardStudentsComponent,
    DashboardBatchComponent,
    DashboardSettingsComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    DatePickerModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule, MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule, MdDatepickerModule, MdDialogModule, MdExpansionModule, MdGridListModule, MdIconModule, MdInputModule, MdListModule, MdMenuModule, MdNativeDateModule,
    MdPaginatorModule, MdProgressBarModule, MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectModule, MdSidenavModule, MdSliderModule, MdSlideToggleModule, MdSnackBarModule, MdSortModule, MdTableModule, MdTabsModule, MdToolbarModule, MdTooltipModule,
    MultiselectDropdownModule,
    Ng2SmartTableModule
  ],
  providers: [
    FetchenquiryService,
    FetchenquirycampaignService,    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
