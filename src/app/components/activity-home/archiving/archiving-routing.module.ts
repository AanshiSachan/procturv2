import { ArchivingComponent } from "./archiving.component";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ArchivingHomeComponent } from "./archiving-home/archiving-home.component";
import { BatchesComponent } from "./batches/batches.component";
import { BatchesArchivedReportComponent } from "./batches-archived-report/batches-archived-report.component";
import { StudentsComponent } from "./students/students.component";
import { StudentsArchivedReportComponent } from "./students-archived-report/students-archived-report.component";
import { CoursesComponent } from "./courses/courses.component";
import { CoursesArchivedReportComponent } from './courses-archived-report/courses-archived-report.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ArchivingComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: ArchivingHomeComponent
                    },
                    {
                        path: 'home',
                        component: ArchivingHomeComponent
                    },
                    {
                        path:'batches',
                        component:BatchesComponent
                    },
                    {
                        path:'batchesArchivedReport',
                        component:BatchesArchivedReportComponent
                    },
                    {
                        path:'students',
                        component:StudentsComponent
                    },
                    {
                        path:'studentsArchivedReport',
                        component: StudentsArchivedReportComponent
                    },
                    {
                        path:'courses',
                        component:CoursesComponent
                    },
                    {
                        path:'coursesArchivedReport',
                        component: CoursesArchivedReportComponent
                    }
                ]
            }
        ])
    ]
})

export class ArchivingRoutingModule {

}
