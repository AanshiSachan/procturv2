import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductMgmtRoutingModule } from './product-mgmt-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { GroupComponent } from './group/group.component';
import { ProductCreationComponent } from './product-creation/product-creation.component';
import { BasicInfoComponent } from './product-creation/basic-info/basic-info.component';
import { MockTestComponent } from './product-creation/mock-test/mock-test.component';
import { OnlineExamComponent } from './product-creation/online-exam/online-exam.component';
import { OfflineProductsComponent } from './product-creation/offline-products/offline-products.component';
import { StudyMaterialComponent } from './product-creation/study-material/study-material.component';
import { ReviewProductComponent } from './product-creation/review-product/review-product.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '../../../../node_modules/@angular/forms';
// import { OwlDateTimeModule, OwlNativeDateTimeModul } from 'ng-pick-datetime';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap-custome';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SalesReportclsComponent } from './sales-reportcls/sales-reportcls.component';
import { MessageShowService } from '../../services/message-show.service';
import { ExportToPdfService } from '../../services/export-to-pdf.service';
import { ExcelService } from '../../services/excel.service';
import { TablePreferencesService } from '../../services/table-preference/table-preferences.service';

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
    OfflineProductsComponent,
    StudyMaterialComponent,
    ReviewProductComponent,
    HomeComponent,
    SalesReportclsComponent
  ],
  providers: [
    ExcelService,
    ExportToPdfService,
    MessageShowService,
    TablePreferencesService
  ]
})
export class ProductMgmtModule { }
