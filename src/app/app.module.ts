/* Components */
import { AppComponent } from './components/core/app.component';
import { CoreSidednavComponent } from './components/core/core-sidednav/core-sidednav.component';
import { CoreHeaderComponent } from './components/core/core-header/core-header.component';
import { EnquiryComponent } from './components/enquiry/enquiry.component';
import { EnquiryHomeComponent } from './components/enquiry/enquiry-home/enquiry-home.component';
import { EnquiryManageComponent } from './components/enquiry/enquiry-manage/enquiry-manage.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CustomErrorPageComponent } from './components/custom/custom-error-page/custom-error-page.component';
import { ActionButtonComponent } from './components/enquiry/enquiry-manage/action-button.component';
import { EnquiryAddComponent } from './components/enquiry/enquiry-add/enquiry-add.component';
import { EnquiryConfirmModalComponent } from './components/custom/enquiry-confirm-modal/enquiry-confirm-modal.component';
import { CalendarComponent } from './components/custom/calendar/calendar.component';
import { EnquiryBulkaddComponent } from './components/enquiry/enquiry-bulkadd/enquiry-bulkadd.component';
import { StudentHomeComponent } from './components/students/student-home/student-home.component';

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
import { NgDatepickerModule } from 'ng2-datepicker';

/* Services */
import { FetchenquiryService } from './services/fetchenquiry.service';
import { FetchprefilldataService } from './services/fetchprefilldata.service';
/* Interceptors */
import { LoadInterceptor } from './interceptors/load-interceptor';

/* Directives */
import { ClickOutside } from './directives/click-outside.directive';
import { FormInput } from './directives/form-input.directive';
import { SelectorDirective } from './directives/selector.directive';

const appRoutes = [
  
  {
    path: '',
    component: EnquiryManageComponent,
  },
  {
    path: 'enquiry',
    component: EnquiryComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        component: EnquiryManageComponent,
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
        path: 'addBulkEnquiry',
        component: EnquiryBulkaddComponent,
        pathMatch: 'prefix'
      }
    ]
  },
  {
    path: 'student',
    component: StudentHomeComponent,
    pathMatch: 'full',
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
    ProfileComponent,
    CustomErrorPageComponent,
    CoreSidednavComponent,
    CoreHeaderComponent,
    ActionButtonComponent,
    ClickOutside,
    EnquiryAddComponent,
    FormInput,
    EnquiryConfirmModalComponent,
    CalendarComponent,
    SelectorDirective,
    EnquiryBulkaddComponent,
    StudentHomeComponent
  ],
  entryComponents: [
    ActionButtonComponent,
    EnquiryConfirmModalComponent,
    CalendarComponent
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
    NgDatepickerModule
  ],
  providers: [
    FetchenquiryService,
    FetchprefilldataService
    /*     { provide: HTTP_INTERCEPTORS, useClass: LoadInterceptor, multi: true } */
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
