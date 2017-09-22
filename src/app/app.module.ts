/* Components */
import { AppComponent } from './components/core/app.component';
import { CoreSidednavComponent } from './components/core/core-sidednav/core-sidednav.component';
import { CoreHeaderComponent } from './components/core/core-header/core-header.component';
import { EnquiryComponent } from './components/enquiry/enquiry.component';
import { EnquiryHomeComponent } from './components/enquiry/enquiry-home/enquiry-home.component';
import { EnquiryManageComponent } from './components/enquiry/enquiry-manage/enquiry-manage.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardHomeComponent } from './components/dashboard/dashboard-home/dashboard-home.component';
import { DashboardStudentsComponent } from './components/dashboard/dashboard-students/dashboard-students.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CustomModalComponent } from './components/custom/custom-modal/custom-modal.component';
import { CustomLoaderComponent } from './components/custom/custom-loader/custom-loader.component';
import { CustomAddEnquiryComponent } from './components/custom/custom-add-enquiry/custom-add-enquiry.component';
import { CustomEditEnquiryComponent } from './components/custom/custom-edit-enquiry/custom-edit-enquiry.component';
import { CustomErrorPageComponent } from './components/custom/custom-error-page/custom-error-page.component';
import { ActionButtonComponent } from './components/enquiry/enquiry-manage/action-button.component';
import { EnquiryAddComponent } from './components/enquiry/enquiry-add/enquiry-add.component';
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
import 'moment';
import 'hammerjs';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BusyModule, BusyConfig} from 'angular2-busy';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';

/* Services */
import { FetchenquiryService } from './services/fetchenquiry.service';

/* Interceptors */
import { LoadInterceptor } from './interceptors/load-interceptor';

/* Directives */
import { ClickOutside } from './directives/click-outside.directive';
import { FormInput } from './directives/form-input.directive';


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
        path: 'manage',
        component: EnquiryManageComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'addEnquiry',
        component: EnquiryAddComponent,
        pathMatch: 'prefix'
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
    EnquiryManageComponent,
    EnquiryHomeComponent,
    DashboardComponent,
    DashboardHomeComponent,
    DashboardStudentsComponent,
    ProfileComponent,
    CustomModalComponent,
    CustomLoaderComponent,
    CustomAddEnquiryComponent,
    CustomEditEnquiryComponent,
    CustomErrorPageComponent,
    CoreSidednavComponent,
    CoreHeaderComponent,
    ActionButtonComponent,
    ClickOutside,
    EnquiryAddComponent,
    FormInput
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
    MultiselectDropdownModule,
    Ng2SmartTableModule,
    BusyModule,
    NgLoggerModule.forRoot(Level.LOG),
  ],
  providers: [
    FetchenquiryService,
    /*     { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptor, multi: true } */
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
