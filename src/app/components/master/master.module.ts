import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ExamGradeServiceService } from '../../services/examgradeservice/exam-grade-service.service';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { MasterComponent } from './master.component';
import { ManageExamGradesComponent } from './manage-exam-grades/manage-exam-grades.component';

import { SlotComponent } from './slot/slot.component';
import { CityAreaMapComponent } from '../../components/city-area-map/city-area-map.component';
import { ClassRoomComponent } from '../../components/class-room/class-room.component';
import { EventManagmentComponent } from '../../components/event-managment/event-managment.component';
import { TreeTableModule } from 'primeng/treetable';

import { SlotApiService } from '../../services/slot-service/slot.service';
import { CityAreaService } from '../../services/area-city-service/area-city.service';

import { EventManagmentService } from '../../services/event-managment.service';
import { ClassRoomService } from '../../services/class-roomService/class-roomlist.service';

import { MasterRoutingModule } from './master-routing.module';
import { TopicServiceService } from '../../services/topic-service.service';
import { HttpService  } from '../../services/http.service';
import { FilterPipe } from '../../components/event-managment/filterpipe';
import { AcademicYearModule } from '../academic-year/academic-year.module';
import { AcademicYearComponent } from '../academic-year/academic-year.component';
import { HomeComponent } from '../academic-year/home/home.component';

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        BsDatepickerModule,
        TreeTableModule,
        MasterRoutingModule
    ],
    exports: [

    ],
    declarations: [
        MasterComponent,
        ManageExamGradesComponent,
        SlotComponent,
        ClassRoomComponent,
        FilterPipe,
        EventManagmentComponent,
        CityAreaMapComponent
        ],
    providers: [
        ExamGradeServiceService,
        SlotApiService,
        CityAreaService,
        HttpService ,
        ClassRoomService,
        EventManagmentService,
        TopicServiceService,
    ]
})

export class ManageExamModule {
}
