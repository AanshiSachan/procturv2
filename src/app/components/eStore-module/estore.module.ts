import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  OnlineClassComponent, OfflineMaterialComponent,  ProductListComponent, HomeComponent, SalesReportsComponent,
  EcourseMappingComponent, OfferHistoryComponent
} from '.';
import { ProductCreationComponent } from './product-creation/product-creation.component';
import { RegisteredStudentComponent } from './product-registered-student/product-registered-student.component';
import { EstoreRoutingModule } from './estore-routing.module';
import { ProductService } from '../../services/products.service';
import { MasterTagComponent } from './master-tag/master-tag.component'




@NgModule({
  imports: [
    CommonModule,
    EstoreRoutingModule,
    FormsModule,
    BsDatepickerModule,
    TimepickerModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    ProductListComponent,    
    ProductCreationComponent,
    EcourseMappingComponent,
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
    OfflineMaterialComponent,
    RegisteredStudentComponent,
    OfferHistoryComponent,
    MasterTagComponent
  ],
  providers: [
    ExcelService,
    ExportToPdfService,
    MessageShowService,
    TablePreferencesService,
    ProductService
  ],
  exports:[EcourseMappingComponent]
})
export class EstoreModule { }
