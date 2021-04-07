import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeeUpdateRoutingModule } from './fee-update-routing.module';
import { FeeViewComponent } from './fee-view/fee-view.component';
import { FeeUpdateComponent } from './fee-update/fee-update.component';


@NgModule({
  declarations: [FeeViewComponent, FeeUpdateComponent],
  imports: [
    CommonModule,
    FeeUpdateRoutingModule
  ]
})
export class FeeUpdateModule { }
