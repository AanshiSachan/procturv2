import { Component, OnInit } from '@angular/core';
import { EventManagmentService } from '../../services/event-managment.service';
import * as moment from 'moment';
import { AppComponent } from '../../app.component';
@Component({
  selector: 'app-event-managment',
  templateUrl: './event-managment.component.html',
  styleUrls: ['./event-managment.component.scss']
})
export class EventManagmentComponent implements OnInit {
  isProfessional: boolean = false;
  eventRecord: any = [];
  endDatecheckbox:boolean= false;
  endDateBox: boolean = false;
  getHoliday: any = [];
  checker:boolean=false;
  getEvent: any = [];
  endDateofEvent:boolean=false;
  closeEditPopup: boolean = false;
  totalRow = 0;
  generalUpdateDataField:boolean=false;
  generalDataField: boolean = false;
  pagedSourceData: any[] = [];
  pageIndex: number = 1;
  displayBatchSize: number = 10;
  closeVarPopup: boolean = false;


  /*========================================================================================
  ========================================================================================== */
  list_obj = {
    year: -1,
    month: -1,
    event_type: "0",
  }

  sendNotify_obj = {
    event_id: ""

  }
  saveDataObj = {
    event_end_date: "",
    event_type: "",
    holiday_date: moment().format("YYYY-MM-DD"),
    holiday_desc: "",
    holiday_long_desc: "",
    holiday_name: "",
    holiday_type: "",
    image: null,
    public_url: ""
  }
  updateListObj: any;

  newUpdateObj={
    event_end_date: "",
    event_type: "",
    holiday_date: moment().format("YYYY-MM-DD"),
    holiday_desc: "",
    holiday_long_desc: "",
    holidayId:"",
    holiday_name: "",
    holiday_type: "",
    image: null,
    public_url: ""
  }

  constructor(private eve_mnge: EventManagmentService, private appc: AppComponent) {
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
  }

  ngOnInit() {
    this.getAllListData();
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
  }
/*=====================================get list of records=================================
============================================================================================ */
  getAllListData() {

    this.eve_mnge.getListEventDesc(this.list_obj).subscribe(
      res => {
        console.log(res);
        this.eventRecord = res;
        this.totalRow = this.eventRecord.length;
        this.fetchTableDataByPage(this.pageIndex);
      },
      error => {
        console.log(error);
      }
    )
  }
/*
  isTimeValid(): boolean {
    let v = moment(this.saveDataObj.holiday_date).diff(moment(this.saveDataObj.event_end_date))
    if (v <= 0) {
      return true;
    }
    else {
      return false;
    }
  }

  
  fetcheventByDate() {
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
*/
/*================================================get events==============================
============================================================================================= */
  getEvents() {
    this.eve_mnge.getEventdata().subscribe(
      res => {
        console.log(res);
        this.getEvent = res;
        console.log(this.getEvent);
      },
      error => {
        console.log(error);
      }
    )
  }
   /*=====================================get holidays============================================
  =============================================================================================== */
  getHolidays() {
    this.eve_mnge.getHolidayData().subscribe(
      res => {
        console.log(res);
        this.getHoliday = res;
      },
      error => {
        console.log(error);
      }
    )
  }
/*==============================================validate event=============================
========================================================================================== */
  eventchange(para) {
    if (this.saveDataObj.event_type == "2") {
      this.generalDataField = true;
    }
    else {
      this.generalDataField = false;
    }
  }
  /*========================================validate event at updatetime=======================
  ==============================================================================================  */
  eventchangeUpdate(para){
if(this.newUpdateObj.event_type=="2"){
  this.generalUpdateDataField=true;
}
else{
  this.generalUpdateDataField=false;
}
  }
  saveEventData() {

    this.eve_mnge.saveEventDescData(this.saveDataObj).subscribe(
      res => {
        console.log(res);
        this.getAllListData();
        this.closeVarPopup = false;
      },
      error => {
        console.log(error);
      }
    )
  }
  /*==========================================get update data================================
  ========================================================================================== */
  updatePopupData() {
  
    this.newUpdateObj.event_end_date = moment(this.newUpdateObj.event_end_date).format('YYYY-MM-DD');
    this.newUpdateObj.holiday_date = moment(this.newUpdateObj.holiday_date).format('YYYY-MM-DD');
    this.eve_mnge.getUpdateEventData(this.newUpdateObj).subscribe(
      res => {
        console.log(res);
        this.closeEditPopup = false;
        this.getAllListData();
      },
      error => {
        console.log(error);
      }
    )
  }


  checkChange(para) {
    if (para == true) {
      this.endDatecheckbox=true;
      this.endDateBox=true;
      this.endDateofEvent=true;
      
    }
    else {
      this.endDatecheckbox = false;
      this.endDateBox=false;
      this.endDateofEvent=false;
    }
  }
  /*=============================================edit update=========================
  ===================================================================================== */

  updateEventForm(holidayId) {
    this.eve_mnge.updateEventData(holidayId).subscribe(
      res => {
        console.log(res);
        this.updateListObj = res;
        this.newUpdateObj.event_type = res.event_type;
        this.newUpdateObj.holiday_date = moment(res.holiday_date).format("YYYY-MM-DD");
        this.newUpdateObj.holiday_desc=res.holiday_desc;
        this.newUpdateObj.holiday_long_desc=res.holiday_long_desc;
        this.newUpdateObj.holiday_name= res.holiday_name;
        this.newUpdateObj.holiday_type= res.holiday_type;
        this.newUpdateObj.holidayId= res.holidayId;
        this.newUpdateObj.event_end_date= moment(res.event_end_date).format("YYYY-MM-DD");
        this.newUpdateObj.image= res.image;
        this.newUpdateObj.public_url= res.public_url;
        if(res.event_end_date==""){
          this.checker=false;

        }
        else{
          this.checker=true;
        }
      console.log(this.newUpdateObj);  
      },
      
      error => {
        console.log(error);
      }
    )
  }
/*===================================================delete event data========================
============================================================================================== */
  deleteEventDataFromList(holidayId) {
    this.eve_mnge.deleteEventData(holidayId).subscribe(
      res => {
        console.log(res);
        this.getAllListData();
      },
      error => {
        console.log(error);
      }
    )
  }
/*==================================send notification to EventType="GENERAL"======================
============================================================================================== */

  sendNotificationAlert(e) {
     var prompt =  confirm("Are you sure,you want to Send Push Notification?");
    if(prompt){
        this.sendNotify_obj.event_id= e;
       this.eve_mnge.sendNotifiation(this.sendNotify_obj).subscribe(
        res => {

        },
        error => {
      }
      )
    }
    else{

    }
  }

  addPopup() {
    this.closeVarPopup = true;
    this.getEvents();
    this.getHolidays();

  }
  updatePopup(holidayId) {
    this.closeEditPopup = true;
    this.getEvents();
    this.getHolidays();
    this.updateEventForm(holidayId);

  }
  deleteEntryData(holidayId) {
    var prompt =  confirm("Are you sure, you want to delete the Event?");
    if(prompt){
      this.deleteEventDataFromList(holidayId);
    }
    else{
      
    }
  
  }
  closeReportPopup() {
    this.closeVarPopup = false;

  }
  closeUpdateReportPopup() {
    this.closeEditPopup = false;
  }
  /*====================================================pagination========================
  ======================================================================================== */
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
