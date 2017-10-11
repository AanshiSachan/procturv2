
/* Components */
import { AppComponent } from './app.component';
import { CoreSidednavComponent } from './components/core/core-sidednav/core-sidednav.component';
import { CoreHeaderComponent } from './components/core/core-header/core-header.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CustomErrorPageComponent } from './components/custom/custom-error-page/custom-error-page.component';
import { CalendarComponent } from './components/custom/calendar/calendar.component';



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
import { FetchenquiryService } from './services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from './services/fetchprefilldata.service';
import { PopupHandlerService } from './services/enquiry-services/popup-handler.service';
import { FetchStudentService } from './services/student-services/fetch-student.service';



/* Interceptors */
import { LoadInterceptor } from './interceptors/load-interceptor';



/* Directives */
import { ClickOutside } from './directives/click-outside.directive';
import { FormInput } from './directives/form-input.directive';
import { SelectorDirective } from './directives/selector.directive';



/* Modules */
import {AppRoutingModule} from './app-routing.module';



@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    CustomErrorPageComponent,
    CoreSidednavComponent,
    CoreHeaderComponent,
    ClickOutside,
    FormInput,
    CalendarComponent,
    SelectorDirective,
  ],
  entryComponents: [
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
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
    FetchprefilldataService,
    PopupHandlerService,
    FetchStudentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
