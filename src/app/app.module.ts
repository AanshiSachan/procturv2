/* Components */
import { AppComponent } from './app.component';
import { chatBotComponent } from './components/chatbot/chatbot.component';


/* Modules */
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Services */
import { FetchenquiryService } from './services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from './services/fetchprefilldata.service';
import { PostEnquiryDataService } from './services/enquiry-services/post-enquiry-data.service';
import { AuthenticatorService } from './services/authenticator.service';
import { LoginService } from './services/login-services/login.service';
import { AlertService } from './services/alert.service';
import { TablePreferencesService } from './services/table-preference/table-preferences.service';
import { ZendAuth } from './services/Chat-bot/chatbot.service';
import { MultiBranchDataService } from './services/multiBranchdata.service';
import { PaginationService } from './services/pagination-service/pagination.service';

/* Interceptors */
import { I1, I2 } from './interceptors/load-interceptor';
import { AuthGuard } from './guards/auth.guard';

/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { TimepickerModule } from 'ngx-bootstrap-custome/timepicker';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { SharedModule } from './components/shared/shared.module';
import { CommonServiceFactory } from './services/common-service';
import {ToasterModule} from 'angular2-toaster';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    ToasterModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    SharedModule,
    Ng2OrderModule
  ],
  declarations: [
    AppComponent,
    chatBotComponent
  ],
  entryComponents: [
    chatBotComponent
  ],
  providers: [
    FetchenquiryService,
    FetchprefilldataService,
    PostEnquiryDataService,
    AuthenticatorService,
    LoginService,
    AuthGuard,
    ZendAuth,
    Title,
    MultiBranchDataService,
    AlertService,
    TablePreferencesService,
    PaginationService,
    CommonServiceFactory
    //   {
    //     provide: HTTP_INTERCEPTORS,
    //     useClass: I2,               // <-- I2 first
    //     multi: true
    // },
    // {
    //     provide: HTTP_INTERCEPTORS,
    //     useClass: I1,               // <-- And only then I1
    //     multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
