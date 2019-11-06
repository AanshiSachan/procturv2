import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSetupRoutingModule } from './data-setup-routing.module';
import { DataSetupComponent, DiscountReasonComponent, FeeTypesComponent } from '.';
import { StudentFeeService } from '../../student-module/student_fee.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap-custome';
import { FileUploadModule, SplitButtonModule, MenuModule } from 'primeng/primeng';
import { FeeStrucService } from '../../../services/feeStruc.service';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataSetupRoutingModule,
    CommonModule,
    BsDatepickerModule,
    FileUploadModule,
    SplitButtonModule,
    MenuModule,
    SharedModule
  ],
  declarations: [
    DataSetupComponent,
    DiscountReasonComponent,
    MenuComponent,
    FeeTypesComponent
  ],
  providers:[
    CommonServiceFactory,
    StudentFeeService,
    FeeStrucService 
  ]
})
export class DataSetupModule { }
