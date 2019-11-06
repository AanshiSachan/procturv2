import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'moment';
import 'hammerjs';
import { FeeTemplateRoutingModule } from "./fee-template-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { FeeTemplateHomeComponent } from './fee-template.component'
import { TemplatePopUpComponent } from './template-popup/template-popup.component';
import { TemplateHomeComponent } from './template-home/template-home.component';
import { FeeTemplateAddComponent } from './fee-template-add/fee-template-add.component';
import { SharedModule } from '../../../shared/shared.module';
import { FeeStrucService } from '../../../../services/feeStruc.service';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FeeTemplateRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule
    ],
    declarations: [
        FeeTemplateHomeComponent,
        TemplateHomeComponent,
        TemplatePopUpComponent,
        FeeTemplateAddComponent
    ],
    entryComponents: [
    ],
    providers: [
        FeeStrucService
    ]
})
export class FeeTemplateModule {

}