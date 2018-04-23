import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AcademicYearComponent } from './academic-year.component';
import { AcademicyearService } from '../../services/academicYearService/academicyear.service';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AcademicYearComponent,
                pathMatch: 'prefix',
            }
        ]),
        SharedModule,
        FormsModule,
        BsDatepickerModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        
        AcademicYearComponent 
    
],
    providers: [
         AcademicyearService
    ]
})

export class AcademicYearModule{




}