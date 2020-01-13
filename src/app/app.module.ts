/* Modules */
import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToasterModule} from 'angular2-toaster';
import { AppRoutingModule } from './app-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { TimepickerModule } from 'ngx-bootstrap-custome/timepicker';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { SharedModule } from './components/shared/shared.module';

/* Interceptors */
// import { I1, I2 } from './interceptors/load-interceptor';
import { AuthGuard } from './guards/auth.guard';
import { FetchenquiryService, FetchprefilldataService, PostEnquiryDataService, AuthenticatorService, LoginService, 
  ZendAuth, MultiBranchDataService, TablePreferencesService, PaginationService, CommonServiceFactory, MessageShowService, 
  HttpService, ToDoListService, ExpensesService, AppComponent } from '.';
import { ProductService } from './services/products.service';
import { ReturnBookService } from './services/library/return/return-book.service';
import { IssueBookService } from './services/library/issue/issue-book.service';
import { MastersService } from './services/library/master/masters.service';
import { AddBookService } from './services/library/add/add-book.service';
import { MasterTagService } from '../app/components/eStore-module/master-tag/master-tag.component.service';

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
    AppComponent
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
    ToDoListService,
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
