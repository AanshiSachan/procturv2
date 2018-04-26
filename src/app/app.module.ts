/* Components */
import { AppComponent } from './app.component';
import { CoreSidednavComponent } from './components/core/core-sidednav/core-sidednav.component';
import { CoreHeaderComponent } from './components/core/core-header/core-header.component';
import { SlotComponent } from './components/slot/slot.component';

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
import { PostEnquiryDataService } from './services/enquiry-services/post-enquiry-data.service';
import { AuthenticatorService } from './services/authenticator.service';
import { LoginService } from './services/login-services/login.service';
import { AlertService } from './services/alert.service';
import { LoaderHandlingService } from './services/loading-services/loader-handling.service';
import { Ng2SmartTableModule } from '../assets/imported_modules/ng2-smart-table';


/* Interceptors */
import { LoadInterceptor } from './interceptors/load-interceptor';
import { AuthGuard } from './guards/auth.guard';
/* Modules */
import { AppRoutingModule } from './app-routing.module';
import { ToasterModule } from '../assets/imported_modules/angular2-toaster/angular2-toaster';
import { BsDatepickerModule } from '../assets/imported_modules/ngx-bootstrap/datepicker';
import { TimepickerModule } from '../assets/imported_modules/ngx-bootstrap/timepicker';
import { ErrorComponent } from './components/error/error.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { OverlayMenuComponent } from './components/overlay-menu/overlay-menu.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { SharedModule } from './components/shared/shared.module';
import { SlotApiService } from './services/slot-service/slot.service';
import { CityAreaMapComponent } from './components/city-area-map/city-area-map.component';
import { CityAreaService } from './services/area-city-service/area-city.service';

import { SearchBoxComponent } from './components/core/search-box/search-box.component';

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
    TimepickerModule.forRoot(),
    SharedModule,
    Ng2OrderModule
  ],
  declarations: [
    AppComponent,
    CoreSidednavComponent,
    CoreHeaderComponent,
    ErrorComponent,
    ComingSoonComponent,
    OverlayMenuComponent,
    SlotComponent,
    CityAreaMapComponent,
    SearchBoxComponent
  ],
  entryComponents: [
    SearchBoxComponent
  ],
  providers: [
    FetchenquiryService,
    FetchprefilldataService,
    PopupHandlerService,
    PostEnquiryDataService,
    AuthenticatorService,
    LoginService,
    AuthGuard,
    LoaderHandlingService,
    SlotApiService,
    CityAreaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
