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
  endDateBox: boolean = false;
  getHoliday: any = [];
  getEvent: any = [];
  closeEditPopup: boolean = false;
  totalRow = 0;
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

  eventchange(para) {
    if (this.saveDataObj.event_type == "2") {
      this.generalDataField = true;
    }
    else {
      this.generalDataField = false;
    }
  }
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
  updatePopupData() {
    console.log(this.updateListObj);

    this.eve_mnge.getUpdateEventData(this.newUpdateObj).subscribe(
      res => {
        console.log(res);
        this.closeEditPopup = false;
      },
      error => {
        console.log(error);
      }
    )
  }


  checkChange(para) {
    if (para == true) {
      this.endDateBox = true;
    }
    else {
      this.endDateBox = false;
    }
  }

  updateEventForm(holidayId) {
    this.eve_mnge.updateEventData(holidayId).subscribe(
      res => {
        console.log(res);
        this.updateListObj = res;
        this.newUpdateObj.event_type = res.event_type;
        this.newUpdateObj.holiday_date = res.holiday_date;
        this.newUpdateObj.holiday_desc=res.holiday_desc;
        this.newUpdateObj.holiday_long_desc=res.holiday_long_desc;
        this.newUpdateObj.holiday_name= res.holiday_name;
        this.newUpdateObj.holiday_type= res.holiday_type;
        this.newUpdateObj.event_end_date= res.event_end_date;
        this.newUpdateObj.image= res.image;
        this.newUpdateObj.public_url= res.public_url;
      console.log(this.newUpdateObj);  
      },
      
      error => {
        console.log(error);
      }
    )
  }

  deleteEventDataFromList(holidayId) {
    this.eve_mnge.deleteEventData(holidayId).subscribe(
      res => {
        console.log(res);

      },
      error => {
        console.log(error);
      }
    )
  }


  sendNotificationAlert() {
    if (this.list_obj.event_type == "2") {
      alert("are u sure u want to send notification ");

      this.eve_mnge.sendNotifiation(this.sendNotify_obj).subscribe(
        res => {
          console.log(res);
        },
        error => {
          console.log(error);
        }
      )
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
   // this.deleteEventData(holidayId);
  }
  closeReportPopup() {
    this.closeVarPopup = false;

  }
  closeUpdateReportPopup() {
    this.closeEditPopup = false;
  }
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
