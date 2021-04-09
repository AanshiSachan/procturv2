import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeUpdateRoutingModule } from './fee-update-routing.module';
import { UpdateComponent } from './update/update.component';
import { ViewComponent } from './view/view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UpdateComponent, ViewComponent],
  imports: [
    CommonModule,
    FeeUpdateRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FeeUpdateModule { }
