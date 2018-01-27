import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentsComponent } from './students.component';
import { StudentAddComponent } from './student-add/student-add.component'
import { StudentEditComponent } from './student-edit/student-edit.component'
import { StudentHomeComponent } from './student-home/student-home.component';
import { StudentBulkComponent } from './student-bulk/student-bulk.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: StudentsComponent,
                children: [
                    {
                        path: '',
                        component: StudentHomeComponent,
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'home',
                        component: StudentHomeComponent,
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'add',
                        component: StudentAddComponent,
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'edit/:id',
                        component: StudentEditComponent,
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'bulk',
                        component: StudentBulkComponent,
                        pathMatch: 'prefix',
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class StudentRoutingModule {
}