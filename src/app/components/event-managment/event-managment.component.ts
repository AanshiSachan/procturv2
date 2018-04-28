import { Component, OnInit } from '@angular/core';
import {EventManagmentService} from  '../../services/event-managment.service';
@Component({
  selector: 'app-event-managment',
  templateUrl: './event-managment.component.html',
  styleUrls: ['./event-managment.component.scss']
})
export class EventManagmentComponent implements OnInit {
   list_obj={
  
    holiday_year:-1,
   holiday_month:-1, 
   event_type: 0
   
     }
    
  constructor(private eve_mnge :EventManagmentService) { }

  ngOnInit() {
  }

getAllListData(){
  this.eve_mnge.getListEventDesc(this.list_obj).subscribe(
    res=>{
      console.log(res);
    },
    error=>{
      console.log(error);
    }
  )
}




}
