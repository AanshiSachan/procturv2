/* Components */
import { AppComponent } from './app.component';
import { CoreSidednavComponent } from './components/core/core-sidednav/core-sidednav.component';
import { CoreHeaderComponent } from './components/core/core-header/core-header.component';
import { LoginComponent } from './components/login/login.component';

/* Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePickerModule } from 'angular-io-datepicker';
import { OverlayModule } from 'angular-io-overlay';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Services */
import { FetchenquiryService } from './services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from './services/fetchprefilldata.service';
import { PopupHandlerService } from './services/enquiry-services/popup-handler.service';
import { FetchStudentService } from './services/student-services/fetch-student.service';
import {PostEnquiryDataService} from './services/enquiry-services/post-enquiry-data.service';
import {AuthenticatorService} from './services/authenticator.service';
import {LoginService} from './services/login-services/login.service';
import {AlertService} from './services/alert.service';

/* Interceptors */
import { LoadInterceptor } from './interceptors/load-interceptor';

/* Modules */
import {AppRoutingModule} from './app-routing.module';




@NgModule({
  declarations: [
    AppComponent,
    CoreSidednavComponent,
    CoreHeaderComponent,
    LoginComponent,
    ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    DatePickerModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
  ],
  providers: [
    FetchenquiryService,
    FetchprefilldataService,
    PopupHandlerService,
    FetchStudentService,
    PostEnquiryDataService,
    AuthenticatorService,
    LoginService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
