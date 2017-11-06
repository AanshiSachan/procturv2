/* Components */
import { AppComponent } from './app.component';
import { CoreSidednavComponent } from './components/core/core-sidednav/core-sidednav.component';
import { CoreHeaderComponent } from './components/core/core-header/core-header.component';
import { LoginComponent } from './components/login/login.component';

/* Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Services */
import { FetchenquiryService } from './services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from './services/fetchprefilldata.service';
import { PopupHandlerService } from './services/enquiry-services/popup-handler.service';
import { FetchStudentService } from './services/student-services/fetch-student.service';
import { PostEnquiryDataService } from './services/enquiry-services/post-enquiry-data.service';
import { AuthenticatorService } from './services/authenticator.service';
import { LoginService } from './services/login-services/login.service';
import { AlertService } from './services/alert.service';


import { Ng2SmartTableModule } from 'ng2-smart-table';

/* Interceptors */
import { LoadInterceptor } from './interceptors/load-interceptor';

/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { CourseComponent } from './components/course/course.component';
import { ToasterModule } from 'angular2-toaster';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    Ng2SmartTableModule,
    ToasterModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    AppComponent,
    CoreSidednavComponent,
    CoreHeaderComponent,
    LoginComponent,
    CourseComponent,
  ],
  entryComponents: [
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
