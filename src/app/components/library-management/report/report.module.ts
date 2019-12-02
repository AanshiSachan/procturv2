import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { LostBookComponent } from './lost-book/lost-book.component';
import { ScrapBookComponent } from './scrap-book/scrap-book.component';
import { FineCollectionComponent } from './fine-collection/fine-collection.component';
import { IssuedBookComponent } from './issued-book/issued-book.component';
import { OverdueBookComponent } from './overdue-book/overdue-book.component';
import { NeverIssuedComponent } from './never-issued/never-issued.component';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import 'moment';
import { SharedModule } from '../../shared/shared.module';

import { ReportService } from '../../../services/library/report/report.service';
import { ReturnBookComponent } from './return-book/return-book.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ],
  declarations: [
    ReportComponent,
    LostBookComponent,
    ScrapBookComponent,
    FineCollectionComponent,
    IssuedBookComponent,
    OverdueBookComponent,
    NeverIssuedComponent,
    ReturnBookComponent
  ],
  entryComponents: [
    LostBookComponent
  ],
  providers: [
    ReportService
  ]
})
export class ReportModule { }
