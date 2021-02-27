import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditAssetComponent } from './add-edit-asset/add-edit-asset.component';
import { AssetAssignmentComponent } from './asset-assignment/asset-assignment.component';
import { AssetPurchaseComponent } from './asset-purchase/asset-purchase.component';
import { CategoryComponent } from './category/category.component';
import { LocationComponent } from './location/location.component';
import { SupplierMasterComponent } from './supplier-master/supplier-master.component';



const routes: Routes = [{
  path: 'asset-supplier',
  component: SupplierMasterComponent

},
{
  path: 'asset-location',
  component: LocationComponent,

},
{
  path: 'asset-category',
  component: CategoryComponent


},
{
  path: 'asset-assignment',
  component: AssetAssignmentComponent,

},
{
  path: 'asset-purchase',
  component: AssetPurchaseComponent,

},
{
  path: '/view/asset-management/add-edit-asset',
  component: AddEditAssetComponent
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetManagementRoutingModule { }
