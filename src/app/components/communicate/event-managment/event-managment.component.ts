import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { HttpService } from '../../../services/http.service';

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
  addEventPopUp: boolean = false;
  searchDataFlag: boolean = false;
  searchedData: any = [];
  list_obj = {
    year: -1,
    month: -1,
    event_type: "2",
  };
  searchText: string = "";
  searchflag: boolean = false;
  searchData: any = [];
  sendNotify_obj = {
    event_id: "",
    institution_id: ''
  };
  saveDataObj = {
    event_end_date: "",
    event_type: "1",
    holiday_date: moment().format("YYYY-MM-DD"),
    holiday_desc: "",
    holiday_long_desc: "",
    holiday_name: "",
    holiday_type: "1",
    image: null,
    public_url: "",
    institution_id: ''
  };
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
    public_url: "",
    institution_id: ''
  };
  acceptedFileFormat = {
    jpg: "0",
    jpeg: "1",
    bmp: "2",
    gif: "3",
    png: "4"
  };
  type: string = "";
  institute_id: any;

  constructor(
    private auth: AuthenticatorService,
    private _http: HttpService,
    private commonService: CommonServiceFactory
  ) {
    this.commonService.removeSelectionFromSideNav();
    this.auth.currentInstituteId.subscribe((id) => {
      this.institute_id = id;
    })
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.getAllListData();
  }

  /*=====================================get list of records=================================
  ============================================================================================ */
  getAllListData() {
    this.pageIndex = 1;
    this.searchDataFlag = false;
    this.searchDataFilter = "";
    const url = "/api/v1/holiday_manager/getDetail/" + this.institute_id;
    this.auth.showLoader();
    this._http.postData(url, this.list_obj).subscribe(
      res => {
        this.auth.hideLoader();
        this.eventRecord = res;
        this.totalRow = this.eventRecord.length;
        this.fetchTableDataByPage(this.pageIndex);
      }),
      (error: any) => {
        this.auth.hideLoader();
        this.errorMessage(error);
      }
  }
  /*================================================get events==============================
  ============================================================================================= */

  getEvents() {
    this.auth.showLoader();
    this._http.getData("/api/v1/masterData/type/EVENT_TYPE/").subscribe(
      res => {
        this.auth.hideLoader();
        this.getEvent = res;
      },
      error => {
        this.auth.hideLoader();
        this.errorMessage(error);
      }
    )
  }

  /*=====================================get holidays============================================
 =============================================================================================== */

  getHolidays() {
    this.auth.showLoader();
    this._http.getData("/api/v1/masterData/type/HOLIDAY_TYPE/").subscribe(
      res => {
        this.auth.hideLoader();
        this.getHoliday = res;
      },
      error => {
        this.auth.hideLoader();
        this.errorMessage(error);
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
      this.commonService.showErrorMessage('error', 'Field is empty', 'Invalid Data');
    }
  }

  fileUpload(imgId) {
    let file = (<HTMLFormElement>document.getElementById('fileAdd')).files[0];
    this.type = file.name.split('.')[1];
    if (file.size > 1048576) {
      this.commonService.showErrorMessage('error', '', 'Uploaded file exceeds 1Mb');
      (<HTMLFormElement>document.getElementById('fileAdd')).value = "";
      return;
    }
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
      let ele: any = <HTMLImageElement>document.getElementById(imgId);
      ele.src = fileReader.result;
    }
    fileReader.onerror = function (error) {
    };
  }

  saveEventData() {

    if (this.saveDataObj.holiday_name == "" || this.saveDataObj.holiday_desc == "") {
      this.commonService.showErrorMessage('error', '', 'Please provide mandatory fields');
      return;
    }
    if (this.saveDataObj.event_end_date != "") {
      if (!this.isTimeValid()) {
        this.commonService.showErrorMessage('error', '', 'Please check date provided');
        return;
      }
      this.saveDataObj.event_end_date = moment(this.saveDataObj.event_end_date).format('YYYY-MM-DD');
    }
    if (this.saveDataObj.holiday_desc.length > 80) {
      this.commonService.showErrorMessage('error', '', 'Description should not be greater than 80');
      return;
    }
    if (this.saveDataObj.holiday_long_desc.length > 300) {
      this.commonService.showErrorMessage('error', '', 'Long description should not be greater than 300');
      return;
    }

    this.saveDataObj.holiday_date = moment(this.saveDataObj.holiday_date).format('YYYY-MM-DD');
    if (this.saveDataObj.event_type == "2") {
      this.saveDataObj.image = (<HTMLImageElement>document.getElementById('imgAdd')).src.split(',')[1];
    }
    this.saveDataObj.institution_id = this.institute_id;
    this.auth.showLoader();
    this._http.postData("/api/v1/holiday_manager/create/", this.saveDataObj).subscribe(
      res => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('success', 'Saved', 'Event created successfully');
        this.getAllListData();
        this.addEventPopUp = false;
      },
      error => {
        this.auth.hideLoader();
        this.errorMessage(error);
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
  /*=============================validate Date==============================================*/
  validateDate(start, end) {
    if (moment(start).format('YYYY-MM-DD') == moment(end).format('YYYY-MM-DD')) {
      return true;
    }
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
      this.commonService.showErrorMessage('error', '', 'Please Provide Mandatory Fields');
      return;
    }
    if (this.newUpdateObj.event_end_date != "") {
      this.newUpdateObj.event_end_date = moment(this.newUpdateObj.event_end_date).format('YYYY-MM-DD');
      if (!this.validateDate(this.newUpdateObj.holiday_date, this.newUpdateObj.event_end_date)) {
        this.commonService.showErrorMessage('error', '', 'Please check date provided');
        return;
      }
    }
    if (this.newUpdateObj.holiday_desc.length > 80) {
      this.commonService.showErrorMessage('error', '', 'Description should not be greater than 80');
      return;
    }
    if (this.newUpdateObj.holiday_long_desc.length > 300) {
      this.commonService.showErrorMessage('error', '', 'Long description should not be greater than 300');
      return;
    }
    this.newUpdateObj.holiday_date = moment(this.newUpdateObj.holiday_date).format('YYYY-MM-DD');
    if (this.newUpdateObj.event_type == "2") {
      this.newUpdateObj.image = (<HTMLImageElement>document.getElementById('imgUpdate')).src.split(',')[1];
    }
    this.newUpdateObj.institution_id = this.institute_id;
    this.auth.showLoader();
    this._http.putData("/api/v1/holiday_manager/update", this.newUpdateObj).subscribe(
      res => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('success', '', 'Event updated successfully');
        this.closeEditPopup = false;
        this.getAllListData();
      },
      error => {
        this.auth.hideLoader();
        this.errorMessage(error);
      })
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
    this.auth.showLoader();
    this._http.getData("/api/v1/holiday_manager/fetch/" + this.institute_id + "/" + holidayId).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.updateListObj = res;
        this.newUpdateObj.event_type = res.event_type;
        this.newUpdateObj.holiday_date = moment(res.holiday_date).format("YYYY-MM-DD");
        this.newUpdateObj.holiday_desc = res.holiday_desc;
        this.newUpdateObj.holiday_long_desc = res.holiday_long_desc;
        this.newUpdateObj.holiday_name = res.holiday_name;
        this.newUpdateObj.holiday_type = res.holiday_type;
        this.newUpdateObj.holidayId = res.holidayId;
        if (res.image != null) {
          this.newUpdateObj.image = "data:image/png;base64," + res.image;
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
      },
      error => {
        this.auth.hideLoader();
        this.errorMessage(error);
      }
    )
  }
  /*===================================================delete event data========================
  ============================================================================================== */
  deleteEventDataFromList(holidayId) {
    this.auth.showLoader();
    this._http.deleteDataById("/api/v1/holiday_manager/delete/" + this.institute_id + "/" + holidayId).subscribe(
      res => {
        this.auth.hideLoader();
        this.getAllListData();
      },
      error => {
        this.auth.hideLoader();
        this.errorMessage(error);
      }
    )
  }
  /*==================================send notification to EventType="GENERAL"======================
  ============================================================================================== */

  sendNotificationAlert(e) {
    var prompt = confirm("Are you sure,you want to Send Push Notification?");
    if (prompt) {
      this.sendNotify_obj.event_id = e;
      this.sendNotify_obj.institution_id = this.institute_id;
      this.auth.showLoader();
      this._http.postData("/api/v1/pushNotification/send", this.sendNotify_obj).subscribe(
        res => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('success', '', 'Notification sent successfully')
        },
        error => {
          this.auth.hideLoader();
          this.errorMessage(error);
        }
      )
    }
  }

  addPopup() {
    this.addEventPopUp = true;
    this.getEvents();
    this.getHolidays();
    this.saveDataObj = {
      event_end_date: "",
      event_type: "1",
      holiday_date: moment().format("YYYY-MM-DD"),
      holiday_desc: "",
      holiday_long_desc: "",
      holiday_name: "",
      holiday_type: "1",
      image: null,
      public_url: "",
      institution_id: ''
    }
  }

  updatePopup(holidayId) {
    this.closeEditPopup = true;
    this.getEvents();
    this.getHolidays();
    this.updateEventForm(holidayId);
  }

  deleteEntryData(holidayId) {
    if (confirm("Are you sure, you want to delete the Event?")) {
      this.deleteEventDataFromList(holidayId);
    }
  }

  closeReportPopup() {
    this.addEventPopUp = false;
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

  eventTypeChange() {
    if (this.saveDataObj.event_type != "2") {
      this.saveDataObj.event_end_date = "";
      this.endDateBox = false;
    }
    if (this.newUpdateObj.event_type != "2") {
      this.newUpdateObj.event_end_date = "";
      this.checker = false;
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

  errorMessage(error) {
    this.commonService.showErrorMessage('error', '', error);
  }

}
