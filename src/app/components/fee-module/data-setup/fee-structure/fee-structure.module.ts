import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeStructureRoutingModule } from './fee-structure-routing.module';
import { FeeStructureAddEditComponent } from './fee-structure-add-edit/fee-structure-add-edit.component';
import { FeeStructureHomeComponent } from './fee-structure-home/fee-structure-home.component';
import { FeeStructureComponent } from './fee-structure.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [FeeStructureAddEditComponent, FeeStructureHomeComponent, FeeStructureComponent],
  imports: [
    CommonModule,
    FeeStructureRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class FeeStructureModule { }
