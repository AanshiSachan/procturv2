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
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProductMgmtRoutingModule,
    NgSelectModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule    
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
    ReviewProductComponent
  ]
})
export class ProductMgmtModule { }
