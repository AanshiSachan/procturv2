import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductMgmtRoutingModule } from './product-mgmt-routing.module';
import { ProductMgmtComponent } from './product-mgmt.component';
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
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  imports: [
    CommonModule,
    ProductMgmtRoutingModule,
    NgSelectModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [
    ProductMgmtComponent,
    ProductListComponent,
    GroupComponent,
    ProductCreationComponent,
    BasicInfoComponent,
    MockTestComponent,
    OnlineExamComponent,
    OfflineProductsComponent,
    StudyMaterialComponent,
    ReviewProductComponent
  ]
})
export class ProductMgmtModule { }
