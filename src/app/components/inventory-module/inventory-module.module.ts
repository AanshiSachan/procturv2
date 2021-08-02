import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryModuleRoutingModule } from './inventory-module-routing.module';
import { InventoryModuleComponent } from './inventory-module.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ItemCmComponent } from './item-cm/item-cm.component';
import { PurchaseItemComponent } from './purchase-item/purchase-item.component';
import { PurchaseAddComponent } from './purchase-add/purchase-add.component';
import { PurchaseViewComponent } from './purchase-view/purchase-view.component';
import { SaleItemComponent } from './sale-item/sale-item.component';
import { SaleAddComponent } from './sale-add/sale-add.component';
import { SaleViewComponent } from './sale-view/sale-view.component';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from '../shared/shared.module';
import { RoleService } from '../.././services/user-management/role.service';
import { ExportToPdfService } from '../../services/export-to-pdf.service';
import { ExcelService } from '../../services/excel.service';
import { ReplacenullPipe } from './replacenull.pipe';
import { OrderByPipe } from './order-by.pipe';
import { ClipboardModule } from "@angular/cdk/clipboard";
@NgModule({
  declarations: [InventoryModuleComponent,
  SupplierComponent,
  ItemCmComponent,
  PurchaseItemComponent,
  PurchaseAddComponent,
  PurchaseViewComponent,
  SaleItemComponent,
  SaleAddComponent,
  SaleViewComponent,
  ReplacenullPipe,
  OrderByPipe,
],
  imports: [
    CommonModule,
    InventoryModuleRoutingModule,
    FormsModule,
    SharedModule,
    ClipboardModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers:[RoleService,ExportToPdfService,ExcelService]
})
export class InventoryModuleModule { }
