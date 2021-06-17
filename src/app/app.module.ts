/* Modules */
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { HttpClientModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule } from 'angular2-toaster';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { BsDatepickerConfig, BsDatepickerModule, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AppComponent, AuthenticatorService, CommonServiceFactory, ExpensesService, FetchenquiryService, FetchprefilldataService, HttpService, LoginService, MessageShowService, MultiBranchDataService, PaginationService, PostEnquiryDataService, TablePreferencesService } from '.';
import { AppMainLoaderComponent } from './app-loader/app-loader.component';
import { AppRoutingModule } from './app-routing.module';
import { MasterTagService } from './components/course-module/data-setup/master-tag/master-tag.component.service';
import { SharedModule } from './components/shared/shared.module';
/* Interceptors */
import { I1, I2 } from './interceptors/load-interceptor';
import { AuthGuard } from './guards/auth.guard';
import { role } from './model/role_features';
import { AddBookService } from './services/library/add/add-book.service';
import { IssueBookService } from './services/library/issue/issue-book.service';
import { MastersService } from './services/library/master/masters.service';
import { ReturnBookService } from './services/library/return/return-book.service';
import { ProductService } from './services/products.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NullvaluePipe } from './nullvalue.pipe';
export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    dateInputFormat: 'YYYY-MM-DD',
    showWeekNumbers: false
  });
}
export function getRangePickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    rangeInputFormat: 'YYYY-MM-DD',
    showWeekNumbers: false
  });
}
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // HttpClientModule,
    BrowserAnimationsModule,
    ToasterModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    SharedModule,
    Ng2OrderModule,
    FontAwesomeModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatPaginatorModule,

  ],
  declarations: [
    AppComponent,
    AppMainLoaderComponent,
    NullvaluePipe
  ],
  entryComponents: [
  ],
  providers: [
    { provide: BsDatepickerConfig, useFactory: getDatepickerConfig },
    { provide: BsDaterangepickerConfig, useFactory: getRangePickerConfig },
    FetchenquiryService,
    FetchprefilldataService,
    PostEnquiryDataService,
    AuthenticatorService,
    LoginService,
    AuthGuard,
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
    MasterTagService,
    role,


      {
        provide: HTTP_INTERCEPTORS,
        useClass: I2,               // <-- I2 first
        multi: true
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: I1,               // <-- And only then I1
        multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
