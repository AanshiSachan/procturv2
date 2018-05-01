import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { InventoryRoutingModule } from "./inventory-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import 'moment';
import 'hammerjs';

import { HomeComponent } from './inventory-home/inventory-home.component';

//import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { InventoryCategoryComponent } from './inventory-category/inventory-category.component';
import { InventoryCategoryService } from '../../services/inventory-services/inventory-category.service';
import { InventoryService } from '../../services/inventory-services/inventory.service';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        InventoryRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule
    ],
    declarations: [
        InventoryComponent,
        HomeComponent,
        InventoryCategoryComponent
    ], 
    entryComponents: [        
    ],
    providers: [
        InventoryService,
        InventoryCategoryService
    ]
})
export class InventoryModule {

}