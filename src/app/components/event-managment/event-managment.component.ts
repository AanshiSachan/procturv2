import { Component, OnInit } from '@angular/core';
import { EventManagmentService } from '../../services/event-managment.service';
import * as moment from 'moment';
import { AppComponent } from '../../app.component';
import { LoginService } from '../../services/login-services/login.service';
@Component({
  selector: 'app-event-managment',
  templateUrl: './event-managment.component.html',
  styleUrls: ['./event-managment.component.scss']
})
export class EventManagmentComponent implements OnInit {
  isProfessional: boolean = false;
  eventRecord: any = [];
  endDatecheckbox: boolean = false;
  endDateBox: boolean = false;
  getHoliday: any = [];
  checker: boolean = false;
  getEvent: any = [];
  endDateofEvent: boolean = false;
  closeEditPopup: boolean = false;
  totalRow = 0;
  generalUpdateDataField: boolean = false;
  generalDataField: boolean = false;
  pagedSourceData: any[] = [];
  pageIndex: number = 1;
  searchDataFilter = "";
  displayBatchSize: number = 10;
  closeVarPopup: boolean = false;
  searchDataFlag: boolean = false;
  searchedData: any = [];

  /*========================================================================================
  ========================================================================================== */
  list_obj = {
    year: -1,
    month: -1,
    event_type: "",
  }

  sendNotify_obj = {
    event_id: ""

  }
  saveDataObj = {
    event_end_date: "",
    event_type: "1",
    holiday_date: moment().format("YYYY-MM-DD"),
    holiday_desc: "",
    holiday_long_desc: "",
    holiday_name: "",
    holiday_type: "1",
    image: null,
    public_url: ""
  }
  updateListObj: any;

  newUpdateObj = {
    event_end_date: "",
    event_type: "",
    holiday_date: moment().format("YYYY-MM-DD"),
    holiday_desc: "",
    holiday_long_desc: "",
    holidayId: "",
    holiday_name: "",
    holiday_type: "",
    image: null,
    public_url: ""
  }

  constructor(
    private eve_mnge: EventManagmentService,
    private appc: AppComponent,
    private login: LoginService,
  ) {
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  ngOnInit() {
    this.getAllListData();
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
  }
  /*=====================================get list of records=================================
  ============================================================================================ */
  getAllListData() {
    this.pageIndex = 1;
    this.searchDataFlag = false;
    this.searchDataFilter = "";
    this.eve_mnge.getListEventDesc(this.list_obj).subscribe(
      res => {
        this.eventRecord = res;
        this.totalRow = this.eventRecord.length;
        this.fetchTableDataByPage(this.pageIndex);
      },
      error => {
        console.log(error);
      }
    )
  }
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
        this.getHoliday = res;
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

  RunisTimeValid() {
    if (this.saveDataObj.event_type !== "" && this.saveDataObj.holiday_name !== "" && this.saveDataObj.holiday_type !== "") {
      this.isTimeValid();
    }
    else {
      let obj = {
        type: "error",
        title: "Field is Empty",
        body: "invalid data range"
      }
      this.appc.popToast(obj);
    }
  }

  fileUpload(imgId) {
    var file = (<HTMLFormElement>document.getElementById('fileAdd')).files[0];
    if (file.size > 1048576) {
      let obj = {
        type: "error",
        title: "Uploaded File Exceeds 1Mb",
        body: ""
      }
      this.appc.popToast(obj);
      (<HTMLFormElement>document.getElementById('fileAdd')).value = "";
      return;
    }
    var fileReader = new FileReader();
    var encString="";
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
      encString = fileReader.result.split(',')[1];
      (<HTMLImageElement>document.getElementById(imgId)).src = fileReader.result;
    }
    fileReader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  saveEventData() {

    if (this.saveDataObj.holiday_name == "" || this.saveDataObj.holiday_desc == "") {
      let obj = {
        type: "error",
        title: "Error",
        body: "Please Provide Mandatory Fields"
      }
      this.appc.popToast(obj);
      return;
    }
    if (this.saveDataObj.event_end_date != "") {
      if (!this.isTimeValid()) {
        let obj = {
          type: "error",
          title: "Error",
          body: "Please check date provided."
        }
        this.appc.popToast(obj);
        return;
      }
      this.saveDataObj.event_end_date = moment(this.saveDataObj.event_end_date).format('YYYY-MM-DD');
    }
    if (this.saveDataObj.holiday_desc.length > 80) {
      let obj = {
        type: "error",
        title: "Error",
        body: "Description should not be greater than 80"

      }
      this.appc.popToast(obj);
      return;

    }

    if (this.saveDataObj.holiday_long_desc.length > 300) {
      let obj = {
        type: "error",
        title: "Error",
        body: "Longdescription should not be greater than 300"

      }
      this.appc.popToast(obj);
      return;
    }
    this.saveDataObj.holiday_date = moment(this.saveDataObj.holiday_date).format('YYYY-MM-DD');
    this.saveDataObj.image = (<HTMLImageElement>document.getElementById('imgAdd')).src.split(',')[1];
    this.eve_mnge.saveEventDescData(this.saveDataObj).subscribe(
      res => {
        let obj = {
          type: "success",
          title: "Saved",
          body: "Event Created Successfully."
        }
        this.appc.popToast(obj);
        this.getAllListData();
        this.closeVarPopup = false;
        this.saveDataObj = {
          event_end_date: "",
          event_type: "1",
          holiday_date: moment().format("YYYY-MM-DD"),
          holiday_desc: "",
          holiday_long_desc: "",
          holiday_name: "",
          holiday_type: "1",
          image: null,
          public_url: ""
        }
      },
      error => {
        console.log(error);
      }
    )
  }


  /*==========================================get update data================================
  ========================================================================================== */
  isTimeValidData(): boolean {
    let v = moment(this.saveDataObj.holiday_date).diff(moment(this.saveDataObj.event_end_date))
    if (v <= 0) {
      return true;
    }
    else {
      return false;
    }
  }

  validateDate(start, end) {
    let v = moment(start).diff(moment(end))
    if (v <= 0) {
      return true;
    }
    else {
      return false;
    }
  }


  updatePopupData() {
    if (this.newUpdateObj.holiday_name == "" || this.newUpdateObj.holiday_desc == "") {
      let obj = {
        type: "error",
        title: "Error",
        body: "Please Provide Mandatory Fields"
      }
      this.appc.popToast(obj);
      return;
    }
    if (this.newUpdateObj.event_end_date != "") {
      this.newUpdateObj.event_end_date = moment(this.newUpdateObj.event_end_date).format('YYYY-MM-DD');
      if (!this.validateDate(this.newUpdateObj.holiday_date, this.newUpdateObj.event_end_date)) {
        let obj = {
          type: "error",
          title: "Error",
          body: "Please check date provided."
        }
        this.appc.popToast(obj);
        return;
      }
    }

    if (this.newUpdateObj.holiday_desc.length > 80) {
      let obj = {
        type: "error",
        title: "Error",
        body: "Description should not be greater than 80"

      }
      this.appc.popToast(obj);
      return;

    }

    if (this.newUpdateObj.holiday_long_desc.length > 300) {
      let obj = {
        type: "error",
        title: "Error",
        body: "Longdescription should not be greater than 300"

      }
      this.appc.popToast(obj);
      return;
    }

    this.newUpdateObj.holiday_date = moment(this.newUpdateObj.holiday_date).format('YYYY-MM-DD');
    this.newUpdateObj.image = (<HTMLImageElement>document.getElementById('imgUpdate')).src.split(',')[1];
    this.eve_mnge.getUpdateEventData(this.newUpdateObj).subscribe(
      res => {
        let obj = {
          type: "success",
          title: "Saved",
          body: "Event Updated Successfully."
        }
        this.appc.popToast(obj);
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
      this.endDatecheckbox = true;
      this.endDateBox = true;
      this.endDateofEvent = true;

    }
    else {
      this.endDatecheckbox = false;
      this.endDateBox = false;
      this.endDateofEvent = false;
    }
  }
  /*=============================================edit update=========================
  ===================================================================================== */

  updateEventForm(holidayId) {
    this.eve_mnge.updateEventData(holidayId).subscribe(
      res => {
        this.updateListObj = res;
        this.newUpdateObj.event_type = res.event_type;
        this.newUpdateObj.holiday_date = moment(res.holiday_date).format("YYYY-MM-DD");
        this.newUpdateObj.holiday_desc = res.holiday_desc;
        this.newUpdateObj.holiday_long_desc = res.holiday_long_desc;
        this.newUpdateObj.holiday_name = res.holiday_name;
        this.newUpdateObj.holiday_type = res.holiday_type;
        this.newUpdateObj.holidayId = res.holidayId;
        if(res.image != null){
          this.newUpdateObj.image = "data:image/png;base64," + res.image;
          // (<HTMLImageElement>document.getElementById('imgUpdate')).src = res.image;
          // console.log((<HTMLImageElement>document.getElementById('imgUpdate')).src);
          // console.log(this.newUpdateObj.image)
        }
        this.newUpdateObj.public_url = res.public_url;
        if (res.event_type == "1") {
          this.checker = false;
          this.newUpdateObj.event_end_date = "";
        }
        else {
          this.checker = true;
          this.newUpdateObj.event_end_date = moment(res.event_end_date).format("YYYY-MM-DD");
        }
        // console.log(this.newUpdateObj);
      },
      error => {
        console.log(error);
      }
    )
    // (<HTMLImageElement>document.getElementById('imgUpdate')).src = "data:image/png;base64,"+this.newUpdateObj.image;
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
    var prompt = confirm("Are you sure,you want to Send Push Notification?");
    if (prompt) {
      this.sendNotify_obj.event_id = e;
      this.eve_mnge.sendNotifiation(this.sendNotify_obj).subscribe(
        res => {
          let obj = {
            type: "success",
            title: "Saved",
            body: " Notification Send Successfully."

          }
          this.appc.popToast(obj);
        },
        error => {
        }
      )
    }
    else {

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
    var prompt = confirm("Are you sure, you want to delete the Event?");
    if (prompt) {
      this.deleteEventDataFromList(holidayId);
    }
    else {

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
    let data = [];
    if (this.searchDataFlag == true) {
      data = this.searchedData.slice(startindex, startindex + this.displayBatchSize);
    } else {
      data = this.eventRecord.slice(startindex, startindex + this.displayBatchSize);
    }
    return data;
  }


  searchInList() {
    if (this.searchDataFilter != "" && this.searchDataFilter != null) {
      let searchData = this.eventRecord.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchDataFilter.toLowerCase()))
      );
      this.searchedData = searchData;
      this.totalRow = searchData.length;
      this.searchDataFlag = true;
      this.fetchTableDataByPage(this.pageIndex);
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.pageIndex);
      this.totalRow = this.eventRecord.length;
    }
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
