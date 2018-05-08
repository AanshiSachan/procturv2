/* Components */
import { AppComponent } from './app.component';
import { CoreSidednavComponent } from './components/core/core-sidednav/core-sidednav.component';
import { CoreHeaderComponent } from './components/core/core-header/core-header.component';
import { SlotComponent } from './components/slot/slot.component';

/* Modules */
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Services */
import { FetchenquiryService } from './services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from './services/fetchprefilldata.service';

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
import {EventManagmentService} from './services/event-managment.service';
import {ClassRoomService} from './services/class-roomService/class-roomlist.service';
import { SearchBoxComponent } from './components/core/search-box/search-box.component';
import { ClassRoomComponent } from './components/class-room/class-room.component';
import { EventManagmentComponent } from './components/event-managment/event-managment.component';
import {FilterPipe} from './components/event-managment/filterpipe';
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
    ClassRoomComponent,
    FilterPipe,
    EventManagmentComponent,
    CityAreaMapComponent,
    SearchBoxComponent
  ],
  entryComponents: [
    SearchBoxComponent
  ],
  providers: [
    FetchenquiryService,
    FetchprefilldataService,
    PostEnquiryDataService,
    AuthenticatorService,
    LoginService,
    AuthGuard,
    LoaderHandlingService,
    SlotApiService,
    CityAreaService,
    ClassRoomService,
    EventManagmentService,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
