import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AcademicYearComponent } from './academic-year.component';
import { AcademicyearService } from '../../../../services/academicYearService/academicyear.service';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { HomeComponent } from './home/home.component';
import { ManageExamModule } from '../../../master/master.module';
import { AcademicYearRoutingModule } from './academic-year-routing.module';

@NgModule({
    imports: [
        SharedModule,
        AcademicYearRoutingModule,
        FormsModule,
        BsDatepickerModule,
        ManageExamModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        AcademicYearComponent,
        HomeComponent
    ],
    providers: [
        AcademicyearService
    ],
    entryComponents:[
        HomeComponent,
        AcademicYearComponent
    ]
})

export class AcademicYearModule {




}
