import { Component, OnInit } from '@angular/core';
import {EventManagmentService} from  '../../services/event-managment.service';
import * as moment from 'moment';
import { AppComponent } from '../../app.component';
@Component({
  selector: 'app-event-managment',
  templateUrl: './event-managment.component.html',
  styleUrls: ['./event-managment.component.scss']
})
export class EventManagmentComponent implements OnInit {
  isProfessional:boolean =false;
  eventRecord: any=[];
  totalRow = 0;
  pagedSourceData: any[] = [];
  pageIndex: number = 1;
  displayBatchSize: number = 10;


  /*========================================================================================
  ========================================================================================== */
  list_obj={
    year:-1,
    month:-1, 
   event_type: 0,
   }

     sendNotify_obj={
      event_id:""

     }
      saveDataObj= {
      event_end_date:"",
      event_type:"1",
      holiday_date:moment().format("YYYY-MM-DD"),
      holiday_desc:"fdd",
      holiday_long_desc:"",
      holiday_name:"education",
      holiday_type:"1",
      image:null,
      institution_id:"100058",
      public_url:""
      }
    
  constructor(private eve_mnge :EventManagmentService, private appc:AppComponent) { 
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
  }

  ngOnInit() {
    this.getAllListData();
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
  }

getAllListData(){
  this.eve_mnge.getListEventDesc(this.list_obj).subscribe(
    res=>{
      console.log(res);
      this.eventRecord= res;
      this.totalRow=this.eventRecord.length;
      this.fetchTableDataByPage(this.pageIndex);
    },
    error=>{
      console.log(error);
    }
  )
}

isTimeValid(): boolean {
  let v = moment(this.saveDataObj.holiday_date).diff(moment(this.saveDataObj.event_end_date))
  if (v <= 0) {
    return true;
  }
  else {
    return false;
  }
}

/* fetching email info by date */
  fetchemailByDate() {
  if (this.isTimeValid()) {
  
    this.saveEventData();
  }
  else {
    let obj = {
      type: "error",
      title: "Invalid Date Range Selected",
      Body: "From date cannot be greater than To date"
    }
    this.appc.popToast(obj);

  }
}


saveEventData(){
  
  this.eve_mnge.saveEventDescData(this.saveDataObj).subscribe(
  res=>{
    console.log(res);
  },
  error=>{
    console.log(error);
  }
)
}

sendNotificationAlert(){
  if(this.list_obj.event_type= 2){
    alert("are u sure u want to send notification ");
  
  this.eve_mnge.sendNotifiation(this.sendNotify_obj).subscribe(
    res=>{
      console.log(res);
    },
    error=>{
      console.log(error);
    }
  )
  }}

/*====================================================pagination */
fetchTableDataByPage(index) {
  this.pageIndex = index;
  let startindex = this.displayBatchSize * (index - 1);
 this.pagedSourceData = this.getClassRoomTableFromSource(startindex);
}

fetchNext() {
  this.pageIndex++;
  this.fetchTableDataByPage(this.pageIndex);
}

fetchPrevious() {
  if (this.pageIndex != 1) {
    this.pageIndex--;
    this.fetchTableDataByPage(this.pageIndex);
  }
}

getClassRoomTableFromSource(startindex) {
  let t = this.eventRecord.slice(startindex, startindex + this.displayBatchSize);
  return t;
}

removeFullscreen() {
  var header = document.getElementsByTagName('core-header');
  var sidebar = document.getElementsByTagName('core-sidednav');

  [].forEach.call(header, function (el) {
    el.classList.remove('hide');
  });
  [].forEach.call(sidebar, function (el) {
    el.classList.remove('hide');
  });
}

removeSelectionFromSideNav() {
  document.getElementById('lione').classList.remove('active');
  document.getElementById('litwo').classList.remove('active');
  document.getElementById('lithree').classList.remove('active');
  document.getElementById('lifour').classList.remove('active');
  document.getElementById('lifive').classList.remove('active');
  document.getElementById('lisix').classList.remove('active');
  document.getElementById('liseven').classList.remove('active');
  document.getElementById('lieight').classList.remove('active');
  document.getElementById('linine').classList.remove('active');
  document.getElementById('lizero').classList.remove('active');
  /* document.getElementById('liten').classList.remove('active');
  document.getElementById('lieleven').classList.remove('active'); */
}



}
