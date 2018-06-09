import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import {ExamGradeServiceService} from '../../services/examgradeservice/exam-grade-service.service';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { MasterComponent } from './master.component';
import { ManageExamGradesComponent } from './manage-exam-grades/manage-exam-grades.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MasterComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: ManageExamGradesComponent
                    },
                    {
                        path: 'manage-exam-grades',
                        component: ManageExamGradesComponent,
                        pathMatch: 'prefix',
                    },
                ]
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
        MasterComponent,
        ManageExamGradesComponent
],
    providers: [
        ExamGradeServiceService
    ]
})

export class ManageExamModule{




}