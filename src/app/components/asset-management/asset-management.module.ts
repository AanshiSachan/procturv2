import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetManagementRoutingModule } from './asset-management-routing.module';
import { AssetManagementComponent } from './asset-management.component';
import { SupplierMasterComponent } from './supplier-master/supplier-master.component';
import { LocationComponent } from './location/location.component';
import { FormsModule } from '@angular/forms';
import { CategoryComponent } from './category/category.component';
import { AssetAssignmentComponent } from './asset-assignment/asset-assignment.component';
import { AssetPurchaseComponent } from './asset-purchase/asset-purchase.component';
import { SharedModule } from '../shared/shared.module';
import { FormValidationsDirective } from './form-validations.directive';
import { AddEditAssetComponent } from './add-edit-asset/add-edit-asset.component';



@NgModule({
  declarations: [AssetManagementComponent, SupplierMasterComponent,
    LocationComponent, CategoryComponent, AssetAssignmentComponent, AssetPurchaseComponent,
    FormValidationsDirective,
    AddEditAssetComponent,],
  imports: [
    CommonModule,
    AssetManagementRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class AssetManagementModule { }
