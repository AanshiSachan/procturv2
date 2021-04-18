import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSetupRoutingModule } from './data-setup-routing.module';
import { DataSetupComponent, DiscountReasonComponent, FeeTypesComponent } from '.';
import { StudentFeeService } from '../../student-module/student_fee.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from '../../shared/shared.module';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule } from 'primeng/primeng';
import { FeeStrucService } from '../../../services/feeStruc.service';
import { FeeTypesV2Component } from './fee-types-v2/fee-types-v2.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataSetupRoutingModule,
    CommonModule,
    // BsDatepickerModule,
    FileUploadModule,
    SplitButtonModule,
    MenuModule,
    SharedModule
  ],
  declarations: [
    DataSetupComponent,
    DiscountReasonComponent,
    MenuComponent,
    FeeTypesComponent,
    FeeTypesV2Component
  ],
  providers:[
    CommonServiceFactory,
    StudentFeeService,
    FeeStrucService 
  ]
})
export class DataSetupModule { }
