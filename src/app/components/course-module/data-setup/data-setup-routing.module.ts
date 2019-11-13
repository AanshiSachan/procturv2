import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataSetupComponent } from './data-setup.component';
import { DataSetupHomeComponent } from './data-setup-home/data-setup-home.component';
import { ManageExamGradesComponent } from './manage-exam-grades/manage-exam-grades.component';
import { ClassRoomComponent } from './class-room/class-room.component';


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
                    loadChildren: 'app/components/course-module/data-setup/academic-year/academic-year.module#AcademicYearModule',
                    // canLoad: [AuthGuard]
                },
                {
                    path: 'teacher',
                    loadChildren: 'app/components/course-module/data-setup/teacher/teacher.module#TeacherModule',
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
                }

            ]
        }
    ]
  )],
  exports: [RouterModule]
})
export class DataSetupRoutingModule { }
