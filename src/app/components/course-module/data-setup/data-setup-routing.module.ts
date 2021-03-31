import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataSetupComponent } from './data-setup.component';
import { DataSetupHomeComponent } from './data-setup-home/data-setup-home.component';
import { ManageExamGradesComponent } from './manage-exam-grades/manage-exam-grades.component';
import { ClassRoomComponent } from './class-room/class-room.component';
import { SchoolExamTypeComponent } from './school-exam-type/school-exam-type.component';
import {MasterTagComponent} from './master-tag/master-tag.component';
import {MarkDistributionComponent} from './mark-distribution/mark-distribution.component';
import { MarkSettingComponent } from './mark-setting/mark-setting.component';


@NgModule({
  imports: [RouterModule.forChild([
        {
            path: '',
            component: DataSetupComponent,
            pathMatch: 'prefix',
            children: [
                {
                    path: '',
                    component: DataSetupHomeComponent,
                },
                {
                    path: 'home',
                    component: DataSetupHomeComponent,
                    pathMatch: 'prefix',
                },
                {
                    path: 'academic',
                    loadChildren: () => import('app/components/course-module/data-setup/academic-year/academic-year.module').then(m => m.AcademicYearModule)
                    // loadChildren: 'app/components/course-module/data-setup/academic-year/academic-year.module#AcademicYearModule',
                    // canLoad: [AuthGuard]
                },
                {
                    path: 'manage-exam-grades',
                    component: ManageExamGradesComponent,
                    pathMatch: 'prefix',
                },
                {
                    path: 'classroom',
                    component: ClassRoomComponent,
                    // canLoad: [AuthGuard]
                },
                {
                    path: 'exam-type',
                    component: SchoolExamTypeComponent,
                    // canLoad: [AuthGuard]
                },
                {
                    path: 'master-tag',
                    component: MasterTagComponent
                },
                {
                    path: 'mark-distribution',
                    component: MarkDistributionComponent
                },
                {
                    path: 'mark-setting',
                    component: MarkSettingComponent
                }

            ]
        }
    ]
  )],
  exports: [RouterModule]
})
export class DataSetupRoutingModule { }
