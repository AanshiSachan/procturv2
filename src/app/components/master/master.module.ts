import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { TreeTableModule } from 'primeng/treetable';
import { CityAreaMapComponent } from '../../components/city-area-map/city-area-map.component';
import { ClassRoomComponent } from '../../components/class-room/class-room.component';
import { CityAreaService } from '../../services/area-city-service/area-city.service';
import { ClassRoomService } from '../../services/class-roomService/class-roomlist.service';
import { ExamGradeServiceService } from '../../services/examgradeservice/exam-grade-service.service';
import { HttpService } from '../../services/http.service';
import { SlotApiService } from '../../services/slot-service/slot.service';
import { SharedModule } from '../shared/shared.module';
import { ManageExamGradesComponent } from './manage-exam-grades/manage-exam-grades.component';
import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from './master.component';
import { SlotComponent } from './slot/slot.component';





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
        CityAreaMapComponent
        ],
    providers: [
        ExamGradeServiceService,
        SlotApiService,
        CityAreaService,
        HttpService ,
        ClassRoomService
    ]
})

export class ManageExamModule {
}
