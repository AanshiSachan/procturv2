/* Components */
import { AppComponent } from './app.component';
import { CoreSidednavComponent } from './components/core/core-sidednav/core-sidednav.component';
import { CoreHeaderComponent } from './components/core/core-header/core-header.component';
import { AppLoaderComponent } from './components/app-loader/app-loader.component'

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
import { StandardServices } from './services/course-services/standardPost.service'
import { LoaderHandlingService } from './services/loading-services/loader-handling.service';
import { Ng2SmartTableModule } from '../assets/imported_modules/ng2-smart-table';

/* Interceptors */
import { LoadInterceptor } from './interceptors/load-interceptor';
import { AuthGuard } from './guards/auth.guard';
/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { ToasterModule } from '../assets/imported_modules/angular2-toaster/angular2-toaster';
import { BsDatepickerModule } from '../assets/imported_modules/ngx-bootstrap/datepicker';
import { TimepickerModule  } from '../assets/imported_modules/ngx-bootstrap/timepicker';
import { ErrorComponent } from './components/error/error.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { OverlayMenuComponent } from './components/overlay-menu/overlay-menu.component';
import { PostStudentDataService } from './services/student-services/post-student-data.service';


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
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [
    AppComponent,
    CoreSidednavComponent,
    CoreHeaderComponent,
    AppLoaderComponent,
    ErrorComponent,
    ComingSoonComponent,
    OverlayMenuComponent,


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
    StandardServices,
    AuthGuard,
    LoaderHandlingService,
    PostStudentDataService

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
