import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ExamGradeServiceService } from '../../services/examgradeservice/exam-grade-service.service';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { MasterComponent } from './master.component';
import { ManageExamGradesComponent } from './manage-exam-grades/manage-exam-grades.component';

import { SlotComponent } from '../../components/slot/slot.component';
import { CityAreaMapComponent } from '../../components/city-area-map/city-area-map.component';
import { ClassRoomComponent } from '../../components/class-room/class-room.component';
import { EventManagmentComponent } from '../../components/event-managment/event-managment.component';
import { TopicsComponent } from '../../components/topics/topics.component';
import { TreeTableModule } from 'primeng/treetable';

import { SlotApiService } from '../../services/slot-service/slot.service';
import { CityAreaService } from '../../services/area-city-service/area-city.service';

import { EventManagmentService } from '../../services/event-managment.service';
import { ClassRoomService } from '../../services/class-roomService/class-roomlist.service';

import { MasterRoutingModule } from './master-routing.module';
import { TopicServiceService } from '../../services/topic-service.service';
import { FilterPipe } from '../../components/event-managment/filterpipe';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        BsDatepickerModule,
        TreeTableModule,
        MasterRoutingModule
    ],
    exports: [
        SlotApiService
    ],
    declarations: [
        MasterComponent,
        ManageExamGradesComponent,
        SlotComponent,
        ClassRoomComponent,
        FilterPipe,
        EventManagmentComponent,
        CityAreaMapComponent,
        TopicsComponent,
    ],
    providers: [
        ExamGradeServiceService,
        SlotApiService,
        CityAreaService,
        ClassRoomService,
        EventManagmentService,
        TopicServiceService,
    ]
})

export class ManageExamModule {




}