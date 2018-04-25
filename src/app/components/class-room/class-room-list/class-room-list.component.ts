import { Component, OnInit } from '@angular/core';
import {ClassRoomService} from '../../../services/class-roomService/class-roomlist.service';
@Component({
  selector: 'app-class-room-list',
  templateUrl: './class-room-list.component.html',
  styleUrls: ['./class-room-list.component.scss']
})
export class ClassRoomListComponent  {

  constructor(private classList : ClassRoomService ) { 
    
  }



}

