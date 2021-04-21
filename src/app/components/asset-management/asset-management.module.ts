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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RoleService } from '../.././services/user-management/role.service';
import { ExportToPdfService } from '../../services/export-to-pdf.service';
import { ExcelService } from '../../services/excel.service';
@NgModule({
  declarations: [AssetManagementComponent, 
    SupplierMasterComponent,
    LocationComponent,
     CategoryComponent,
      AssetAssignmentComponent, 
      AssetPurchaseComponent,
  ],
  imports: [
    CommonModule,
    AssetManagementRoutingModule,
    FormsModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    
  ],
  providers: [RoleService,ExportToPdfService,ExcelService],
})
export class AssetManagementModule { }
