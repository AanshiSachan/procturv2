/* Modules */
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { TimepickerModule } from 'ngx-bootstrap-custome/timepicker';
import { AppComponent, AuthenticatorService, CommonServiceFactory, ExpensesService, FetchenquiryService, FetchprefilldataService, HttpService, LoginService, MessageShowService, MultiBranchDataService, PaginationService, PostEnquiryDataService, TablePreferencesService, ZendAuth } from '.';
import { MasterTagService } from '../app/components/eStore-module/master-tag/master-tag.component.service';
import { AppMainLoaderComponent } from './app-loader/app-loader.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';
/* Interceptors */
// import { I1, I2 } from './interceptors/load-interceptor';
import { AuthGuard } from './guards/auth.guard';
import { AddBookService } from './services/library/add/add-book.service';
import { IssueBookService } from './services/library/issue/issue-book.service';
import { MastersService } from './services/library/master/masters.service';
import { ReturnBookService } from './services/library/return/return-book.service';
import { ProductService } from './services/products.service';


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
    Ng2OrderModule,

  ],
  declarations: [
    AppComponent,
    AppMainLoaderComponent
  ],
  entryComponents: [
  ],
  providers: [
    FetchenquiryService,
    FetchprefilldataService,
    PostEnquiryDataService,
    AuthenticatorService,
    LoginService,
    AuthGuard,
    ZendAuth,
    MultiBranchDataService,
    TablePreferencesService,
    PaginationService,
    CommonServiceFactory,
    MessageShowService,
    HttpService,
       ExpensesService,
    MastersService,
    AddBookService,
    IssueBookService,
    ReturnBookService,
    ProductService,
    MasterTagService

    
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
