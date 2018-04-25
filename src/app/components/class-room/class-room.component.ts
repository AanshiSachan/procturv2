import { Component, OnInit } from '@angular/core';
import { ColumnSetting } from '../shared/custom-table/layout.model';
@Component({
  selector: 'app-class-room',
  templateUrl: './class-room.component.html',
  styleUrls: ['./class-room.component.scss']
})
export class ClassRoomComponent {

  keySettings: ColumnSetting[] = [
    { primaryKey: 'sentDateTime', header: 'S No.' },
    { primaryKey: 'emailId', header: 'Room Name' },
    { primaryKey: 'message', header: 'Description' },
    { primaryKey: 'name', header: 'Edit' },
  ];

  constructor() {

   }
   
}
