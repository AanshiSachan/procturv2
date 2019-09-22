import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductMgmtRoutingModule } from './product-mgmt-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap-custome';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MessageShowService } from '../../services/message-show.service';
import { ExportToPdfService } from '../../services/export-to-pdf.service';
import { ExcelService } from '../../services/excel.service';
import { TablePreferencesService } from '../../services/table-preference/table-preferences.service';
import { BasicInfoComponent, MockTestComponent, OnlineExamComponent,
  StudyMaterialComponent, ReviewProductComponent, VideoLectureComponent, ClassroomClassComponent,
  OnlineClassComponent, OfflineMaterialComponent, GroupComponent, ProductListComponent, HomeComponent, SalesReportsComponent
} from '.';
import { ProductCreationComponent } from './product-creation/product-creation.component';




@NgModule({
  imports: [
    CommonModule,
    ProductMgmtRoutingModule,
    NgSelectModule,
    FormsModule,
    BsDatepickerModule,
    TimepickerModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    ProductListComponent,
    GroupComponent,
    ProductCreationComponent,
    BasicInfoComponent,
    MockTestComponent,
    OnlineExamComponent,
    StudyMaterialComponent,
    ReviewProductComponent,
    HomeComponent,
    SalesReportsComponent,
    VideoLectureComponent,
    ClassroomClassComponent,
    OnlineClassComponent,
    OfflineMaterialComponent
  ],
  providers: [
    ExcelService,
    ExportToPdfService,
    MessageShowService,
    TablePreferencesService
  ]
})
export class ProductMgmtModule { }
