/* Components */
import { AppComponent } from './components/core/app.component';
import { EnquiryComponent } from './components/enquiry/enquiry.component';
import { EnquiryLeadsComponent } from './components/enquiry/enquiry-leads/enquiry-leads.component';
import { EnquiryManageComponent } from './components/enquiry/enquiry-manage/enquiry-manage.component';
import { EnquiryReportComponent } from './components/enquiry/enquiry-report/enquiry-report.component';
import { EnquiryMasterComponent } from './components/enquiry/enquiry-master/enquiry-master.component';
import { EnquiryHomeComponent } from './components/enquiry/enquiry-home/enquiry-home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardAttendanceComponent } from './components/dashboard/dashboard-attendance/dashboard-attendance.component';
import { DashboardFeesComponent } from './components/dashboard/dashboard-fees/dashboard-fees.component';
import { DashboardManageFeesComponent } from './components/dashboard/dashboard-fees/dashboard-manage-fees/dashboard-manage-fees.component';
import { DashboardManageChequesComponent } from './components/dashboard/dashboard-fees/dashboard-manage-cheques/dashboard-manage-cheques.component';
import { DashboardNotificationsComponent } from './components/dashboard/dashboard-notifications/dashboard-notifications.component';
import { DashboardOthersComponent } from './components/dashboard/dashboard-others/dashboard-others.component';
import { DashboardEmployeeManagementComponent } from './components/dashboard/dashboard-employee-management/dashboard-employee-management.component';
import { DashboardExamsComponent } from './components/dashboard/dashboard-exams/dashboard-exams.component';
import { DashboardExamsAttendanceComponent } from './components/dashboard/dashboard-exams/dashboard-exams-attendance/dashboard-exams-attendance.component';
import { DashboardExamsMarksComponent } from './components/dashboard/dashboard-exams/dashboard-exams-marks/dashboard-exams-marks.component';
import { DashboardSentNotificationsComponent } from './components/dashboard/dashboard-notifications/dashboard-sent-notifications/dashboard-sent-notifications.component';
import { DashboardHomeComponent } from './components/dashboard/dashboard-home/dashboard-home.component';
import { DashboardReportsComponent } from './components/dashboard/dashboard-reports/dashboard-reports.component';
import { DashboardStudentsComponent } from './components/dashboard/dashboard-students/dashboard-students.component';
import { DashboardBatchComponent } from './components/dashboard/dashboard-batch/dashboard-batch.component';
import { DashboardSettingsComponent } from './components/dashboard/dashboard-settings/dashboard-settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CustomModalComponent } from './components/custom/custom-modal/custom-modal.component';
import { CustomLoaderComponent } from './components/custom/custom-loader/custom-loader.component';
import { CustomAddEnquiryComponent } from './components/custom/custom-add-enquiry/custom-add-enquiry.component';
import { CustomEditEnquiryComponent } from './components/custom/custom-edit-enquiry/custom-edit-enquiry.component';
import { CustomErrorPageComponent } from './components/custom/custom-error-page/custom-error-page.component';
import { CoreSidednavComponent } from './components/core/core-sidednav/core-sidednav.component';
import { CoreHeaderComponent } from './components/core/core-header/core-header.component';
import { ActionButtonComponent } from './components/enquiry/enquiry-manage/action-button.component';

/* Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { DatePickerModule } from 'angular-io-datepicker';
import { OverlayModule } from 'angular-io-overlay';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule, MdDatepickerModule, MdDialogModule, MdExpansionModule, MdGridListModule, MdIconModule, MdInputModule, MdListModule, MdMenuModule, MdNativeDateModule, MdPaginatorModule, MdProgressBarModule, MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectModule, MdSidenavModule, MdSliderModule, MdSlideToggleModule, MdSnackBarModule, MdSortModule, MdTableModule, MdTabsModule, MdToolbarModule, MdTooltipModule, } from '@angular/material';
import 'moment';
import 'hammerjs';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BusyModule, BusyConfig} from 'angular2-busy';


/* Services */
import { FetchenquiryService } from './services/fetchenquiry.service';

/* Interceptors */
import { LoadInterceptor } from './interceptors/load-interceptor';

/* Directives */
import { ClickOutside } from './directives/click-outside.directive';

const appRoutes = [
  {
    path: '',
    component: DashboardHomeComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        component: DashboardHomeComponent,
        pathMatch: 'full',
      },
      {
        path: 'students',
        component: DashboardStudentsComponent,
        pathMatch: 'full',
      },
    ]
  },
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
        pathMatch: 'prefix',
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
      {
        path: 'add',
        component: CustomAddEnquiryComponent,
        pathMatch: 'full'
      },
      {
        path: 'edit',
        component: CustomEditEnquiryComponent,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    component: CustomErrorPageComponent,
    pathMatch: 'full'
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
    ProfileComponent,
    CustomModalComponent,
    CustomLoaderComponent,
    CustomAddEnquiryComponent,
    CustomEditEnquiryComponent,
    CustomErrorPageComponent,
    CoreSidednavComponent,
    CoreHeaderComponent,
    ActionButtonComponent,
    ClickOutside
  ],
  entryComponents: [
    CustomModalComponent,
    CustomLoaderComponent,
    ActionButtonComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
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
    Ng2SmartTableModule,
    BusyModule,
  ],
  providers: [
    FetchenquiryService,
    /*     { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptor, multi: true } */
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
