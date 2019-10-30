import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductMgmtRoutingModule } from './product-mgmt-routing.module';
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
  EcourseMappingComponent
} from '.';
import { ProductCreationComponent } from './product-creation/product-creation.component';
import { RegisteredStudentComponent } from './product-registered-student/product-registered-student.component';




@NgModule({
  imports: [
    CommonModule,
    ProductMgmtRoutingModule,
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
  ],
  providers: [
    ExcelService,
    ExportToPdfService,
    MessageShowService,
    TablePreferencesService
  ]
})
export class ProductMgmtModule { }
