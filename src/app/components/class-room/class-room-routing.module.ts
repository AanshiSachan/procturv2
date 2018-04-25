import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClassRoomComponent } from './class-room.component'
import { ClassRoomListComponent } from '../../components/class-room/class-room-list/class-room-list.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ClassRoomComponent
                pathMatch: 'prefix',
                children: [
                   
                    {
                        path: '',
                        component: ClassRoomListComponent,
                        pathMatch: 'prefix',
                    },
                  ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class classRoomRoutingModule {
}