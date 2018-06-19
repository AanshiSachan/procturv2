import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AcademicYearComponent } from './academic-year.component';
import { AcademicyearService } from '../../services/academicYearService/academicyear.service';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { HomeComponent } from './home/home.component';
import { ManageExamModule } from '../master/master.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AcademicYearComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: HomeComponent
                    },
                    {
                        path: 'list',
                        component: HomeComponent,
                        pathMatch: 'prefix',
                    },
                ]
            }
        ]),
        SharedModule,
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
    ]
})

export class AcademicYearModule {




}