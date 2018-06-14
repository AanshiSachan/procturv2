import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ComponentRoutingModule } from './component-routing.module';
import { ComponentsComponent } from './components.component';

import { SlotComponent } from '../components/slot/slot.component';
import { CityAreaMapComponent } from '../components/city-area-map/city-area-map.component';
import { ClassRoomComponent } from '../components/class-room/class-room.component';
import { EventManagmentComponent } from '../components/event-managment/event-managment.component';
import { TopicsComponent } from '../components/topics/topics.component';
import { TreeTableModule } from 'primeng/treetable';
import { BsDatepickerModule } from '../../assets/imported_modules/ngx-bootstrap/datepicker';

import { SlotApiService } from '../services/slot-service/slot.service';
import { CityAreaService } from '../services/area-city-service/area-city.service';

import { EventManagmentService } from '../services/event-managment.service';
import { ClassRoomService } from '../services/class-roomService/class-roomlist.service';

import { TopicServiceService } from '../services/topic-service.service';
import { FilterPipe } from '../components/event-managment/filterpipe';
import { SharedModule } from '../components/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ComponentRoutingModule,
        TreeTableModule,
        BsDatepickerModule.forRoot(),
        SharedModule,
        FormsModule, ReactiveFormsModule
    ],
    declarations: [
        ComponentsComponent,
        SlotComponent,
        ClassRoomComponent,
        FilterPipe,
        EventManagmentComponent,
        CityAreaMapComponent,
        TopicsComponent,
    ],
    entryComponents: [
    ],
    providers: [
        SlotApiService,
        CityAreaService,
        ClassRoomService,
        EventManagmentService,
        TopicServiceService,
    ],
    exports: [
    ]
})
export class ComponentModule {

}
