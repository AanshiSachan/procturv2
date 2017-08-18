import { AppComponent } from './core/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePickerModule } from 'angular-io-datepicker';
import { OverlayModule } from 'angular-io-overlay';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MaterialModule, MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule, MdDatepickerModule, MdDialogModule, MdExpansionModule, MdGridListModule, MdIconModule, MdInputModule, MdListModule, MdMenuModule, MdNativeDateModule,
  MdPaginatorModule, MdProgressBarModule, MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectModule, MdSidenavModule, MdSliderModule, MdSlideToggleModule, MdSnackBarModule, MdSortModule, MdTableModule, MdTabsModule, MdToolbarModule, MdTooltipModule,
} from '@angular/material';
import 'moment';
import 'hammerjs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable/src';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { EnquiryComponent } from './enquiry/enquiry.component';
import { EnquiryLeadsComponent } from './enquiry/enquiry-leads/enquiry-leads.component';
import { EnquiryManageComponent } from './enquiry/enquiry-manage/enquiry-manage.component';
import { EnquiryReportComponent } from './enquiry/enquiry-report/enquiry-report.component';
import { EnquiryMasterComponent } from './enquiry/enquiry-master/enquiry-master.component';
import { EnquiryHomeComponent } from './enquiry/enquiry-home/enquiry-home.component';

/* Services */
import { FetchenquiryService } from './services/fetchenquiry.service';
import { FetchenquirycampaignService } from './services/fetchenquirycampaign.service';

const appRoutes = [
  {
    path: 'enquiry',
    component: EnquiryComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        component: EnquiryHomeComponent,
      },
      {
        path: 'lead',
        component: EnquiryLeadsComponent,
        pathMatch: 'full',
      },
      {
        path: 'manage',
        component: EnquiryManageComponent,
        pathMatch: 'full',
      },
      {
        path: 'master',
        component: EnquiryMasterComponent,
        pathMatch: 'full',
      },
      {
        path: 'report',
        component: EnquiryReportComponent,
        pathMatch: 'full',
      },
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    EnquiryComponent,
    EnquiryLeadsComponent,
    EnquiryManageComponent,
    EnquiryReportComponent,
    EnquiryMasterComponent,
    EnquiryHomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    DatePickerModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule, MdAutocompleteModule, MdButtonModule, MdButtonToggleModule, MdCardModule, MdCheckboxModule, MdChipsModule, MdCoreModule, MdDatepickerModule, MdDialogModule, MdExpansionModule, MdGridListModule, MdIconModule, MdInputModule, MdListModule, MdMenuModule, MdNativeDateModule,
    MdPaginatorModule, MdProgressBarModule, MdProgressSpinnerModule, MdRadioModule, MdRippleModule, MdSelectModule, MdSidenavModule, MdSliderModule, MdSlideToggleModule, MdSnackBarModule, MdSortModule, MdTableModule, MdTabsModule, MdToolbarModule, MdTooltipModule,
    NgxDatatableModule,
    MultiselectDropdownModule,
    
  ],
  providers: [
    FetchenquiryService,
    FetchenquirycampaignService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
