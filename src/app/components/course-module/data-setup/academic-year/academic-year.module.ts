import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { HttpService } from '../../../../services/http.service';
import { ManageExamModule } from '../../../master/master.module';
import { SharedModule } from '../../../shared/shared.module';
import { AcademicYearRoutingModule } from './academic-year-routing.module';
import { AcademicYearComponent } from './academic-year.component';
import { HomeComponent } from './home/home.component';


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
        HttpService
    ],
    entryComponents: [
        HomeComponent,
        AcademicYearComponent
    ]
})

export class AcademicYearModule {




}
