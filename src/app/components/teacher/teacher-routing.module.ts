import {Routes , RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { TeacherComponent } from './teacher.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';

@NgModule({
    imports:[
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
                //   {
                //       path: 'add',

                //   }
                ]
              }
        ])
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ],
    declarations :[
    ]
})

export class TeacherRoutingModule {

}