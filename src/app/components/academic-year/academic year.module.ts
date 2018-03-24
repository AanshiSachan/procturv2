import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AcademicYearComponent } from './academic-year.component';
import { AcademicyearService } from '../../services/academicYearService/academicyear.service';


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
        FormsModule
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

export class academicYearModule{




}