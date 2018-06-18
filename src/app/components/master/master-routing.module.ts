import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

import { MasterComponent } from './master.component';
import { SlotComponent } from '../../components/slot/slot.component';
import { CityAreaMapComponent } from '../../components/city-area-map/city-area-map.component';
import { ClassRoomComponent } from '../../components/class-room/class-room.component';
import { EventManagmentComponent } from '../../components/event-managment/event-managment.component';
import { TopicsComponent } from '../../components/topics/topics.component';
import { ManageExamGradesComponent } from './manage-exam-grades/manage-exam-grades.component';

@NgModule({
    imports: [
        RouterModule.forChild(
            [
                {
                    path: '',
                    component: MasterComponent,
                    pathMatch: 'prefix',
                    children: [
                        {
                            path: '',
                            redirectTo: 'Topics',
                            pathMatch: 'full'
                        },
                        {
                            path: 'manage-exam-grades',
                            component: ManageExamGradesComponent,
                            pathMatch: 'prefix',
                        },
                        {
                            path: 'slot',
                            component: SlotComponent,
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'classroom',
                            component: ClassRoomComponent,
                            canLoad: [AuthGuard]
                        },
                        {

                            path: 'Topics',
                            component: TopicsComponent,
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'eventManagment',
                            component: EventManagmentComponent,
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'areaCity',
                            component: CityAreaMapComponent,
                        }
                    ]
                }
            ]
        )
    ],
    exports: [
        RouterModule
    ]
})
export class MasterRoutingModule {
}