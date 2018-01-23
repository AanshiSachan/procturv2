import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeacherComponent } from './teacher.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { TeacherAddComponent } from './teacher-add/teacher-add.component';
import { TeacherEditComponent } from './teacher-edit/teacher-edit.component';
import { TeacherViewComponent } from './teacher-view/teacher-view.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TeacherComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'list'
                    },
                    {
                        path: 'list',
                        component: TeacherListComponent
                    },
                    {
                        path: 'add',
                        component: TeacherAddComponent
                    },
                    {
                        path: 'edit',
                        component: TeacherEditComponent
                    },
                    {
                        path: 'view',
                        component: TeacherViewComponent
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ],
    declarations: [
    ]
})

export class TeacherRoutingModule {

}