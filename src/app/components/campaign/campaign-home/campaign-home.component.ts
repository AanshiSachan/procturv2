import {
  Component, OnInit, ViewChild, Input, Output,
  EventEmitter, HostListener, AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { instituteInfo } from '../../../model/instituteinfo';
import { updateEnquiryForm } from '../../../model/update-enquiry-form';
import { MenuItem } from 'primeng/primeng';
import { CampaignService } from '../../../services/campaign-services/campaign.service';
import { SmsOptionComponent } from './sms-option.component';
import { error } from 'util';
import { NgForm } from '@angular/forms';
import { AuthenticatorService } from '../../../services/authenticator.service';






@Component({
  selector: 'app-campaign-home',
  templateUrl: './campaign-home.component.html',
  styleUrls: ['./campaign-home.component.scss']
})
export class CampaignHomeComponent implements OnInit {


  /* Model for institute Data */
  instituteData: instituteInfo = {
    institute_id: ""

  };

  /* Variable Declaration */
  sourceCampaign: any[] = []; sourceCampaign_total = []; smsPopSource: any; busy: Subscription;
  checkedStatus = []; filtered = []; enqstatus: any[] = []; enqPriority: any[] = [];
  enqFollowType: any[] = []; enqAssignTo: any[] = []; enqStd: any[] = []; enqSubject: any[] = [];
  enqScholarship: any[] = []; enqSub2: any[] = []; paymentMode: any[] = []; commentFormData: any = {};
  today: any = Date.now(); searchBarData: any = null; searchBarDate: any = moment().format('YYYY-MM-DD');
  displayBatchSize: number = 100; incrementFlag: boolean = true; updateFormComments: any = [];
  updateFormCommentsBy: any = []; updateFormCommentsOn: any = []; PageIndex: number = 1;
  maxPageSize: number = 0; totalVisibleEnquiry: number = 0; totalCampaign: number = 0; isProfessional: boolean = false;
  isActionDisabled: boolean = false; isMessageAddOpen: boolean = false; isMultiSms: boolean = false;
  smsSelectedRowsLength: number = 0; sizeArr: any[] = [25, 50, 100, 150, 200, 500];
  isAllSelected: boolean = false;
  hourArr: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['00', '15', '30', '45']; meridianArr: any[] = ["AM", "PM"];
  hour: string = '12'; minute: string = '00'; meridian: string = 'AM';

  currentDirection = 'desc'; selectedRowGroup: any[] = []; componentPrefill: any = [];
  componentListObject: any = {}; emptyCustomComponent: any; componentRenderer: any = []; customComponentResponse: any = [];
  fetchingDataMessage: string = "Loading"; smsBtnToggle: boolean = false;
  testMessagePopUp = false;

  /* items added on ngOnInit */
  bulkAddItems: MenuItem[];
  indexJSON = [];
  selectedRow: any = {
  };

  newSmsString = {
    data: "",
    length: 0,
    type: "",
  };

  selectedMessage = [];

  header: any = {
    list_name: { id: 'list_name', title: 'Lead Name', filter: false, show: true },
    referred_by: { id: 'referred_by', title: 'Referred By', filter: false, show: true },
    source: { id: 'source', title: 'Source', filter: false, show: true },
    created_date: { id: 'created_date', title: 'Created date', filter: false, show: true },
    status: { id: 'status', title: 'Status', filter: false, show: true },
    total_count: { id: 'total_count', title: 'Total count', filter: false, show: true },
    success_count: { id: 'success_count', title: 'Success count', filter: false, show: true },
    failure_count: { id: 'failure_count', title: 'Failure count', filter: false, show: true },
    allow_sms: { id: 'allow_sms', title: 'Send Promotional SMS', filter: false, show: true },

  };

  /* Variable to handle popups */
  message: string = '';

  selectedOption: any = {
    email: { show: false, id: 'email' },
    Gender: { show: false, id: 'Gender' },
    standard: { show: false, id: 'standard' },
    subjects: { show: false, id: 'subjects' }
  };

  //for test sms popups
  phone: any;
  smsMessageTest = [];

  selectedSMS: any = {
    message: "",
    message_id: "",
    sms_type: "",
    status: "",
    statusValue: "",
    date: "",
    feature_type: "",
    institute_name: "",
  };

  sendSmsFormData: any = {
    baseIds: [],
    messageArray: []
  };

  messageList: any = [];

  //flag for sorting
  sortFlag = "asc";

  /* Settings for SMS Table Display */
  settingsSmsPopup = {
    selectMode: 'single', mode: 'external', hideSubHeader: false, toggle: 'N',
    actions: { add: false, edit: false, delete: false, columnTitle: '', },
    columns: {
      message: { title: 'Message', filter: false, show: true },
      statusValue: { title: 'Status.', filter: false, show: true },
      action: {
        title: ' ', filter: false, type: 'custom',
        renderComponent: SmsOptionComponent
      },
    },
    pager: {
      display: false
    }
  };

  smsSearchData: string = "";
  followUpTime: Date = null;
  isConverted: boolean = false; hasReceipt: boolean = false; isadmitted: boolean = false; notClosednAdmitted: boolean = false;
  isClosed: boolean = false; isAssignEnquiry: boolean = false;
  availableSMS: number = 0; smsDataLength: number = 0; isEnquiryAdmin: boolean = false;



  statusString: any[] = ["0", "3"]; smsSelectedRows: any; smsGroupSelected: any[] = [];

  /* Model for checkbox toggler to update data table */
  stats = {
    All: { value: 'All', prop: 'All', checked: false, disabled: false },
    Open: { value: 'Open', prop: 'Open', checked: true, disabled: false },
    Registered: { value: 'Registered', prop: 'In Progress', checked: false, disabled: false },
    Admitted: { value: 'Admitted', prop: 'Student Admitted', checked: false, disabled: false },
    Inactive: { value: 'Inactive', prop: 'Converted', checked: false, disabled: false },
  };


  myOptions: any[] = [
    { id: 'email', name: 'Email' },
    { id: 'Gender', name: 'Gender' },
    { id: 'standard', name: 'Standard' },
    { id: 'subjects', name: 'Subject' }
  ]

  studentdisplaysize: number = 10;
  searchDataFlag: boolean = false;
  sourceCampaignDataSource: any = [];
  totalRow: number = 0;
  searchData: any = [];
  addEditPromotional: boolean = false;
  createNew: boolean = false;
  messageText: any = "";
  enableApprove = sessionStorage.getItem('allow_sms_approve_feature');
  isAdmin = sessionStorage.getItem('permissions');

  constructor(
    private router: Router,
    private appC: AppComponent,
    private login: LoginService,
    private cd: ChangeDetectorRef,
    private postData: CampaignService, private auth: AuthenticatorService
  ) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));

    this.login.changeNameStatus(sessionStorage.getItem('name'));

    /* Load paginated campaign data from server */
    this.loadTableDatatoSource(this.instituteData);


  }

  /* Load Table data with respect to the institute data provided */
  loadTableDatatoSource(obj) {

    this.fetchingDataMessage = "Loading";
    // document.getElementById("bulk-drop").classList.add("hide");
    // document.getElementById('headerCheckbox').checked = false;
    this.isAllSelected = false;

    this.sourceCampaign = [];
    this.selectedRow = null;
    this.selectedRowGroup = [];

    /* start index of object passed is zero then create pagination */
    if (obj.start_index == 0) {
      return this.postData.campaignUploadList(obj).subscribe(
        (data: any) => {
          if (data.length != 0) {
            data = data.sort(function (a, b) {
              return moment(a.created_date).unix() - moment(b.created_date).unix();
            })
            if (this.indexJSON.length != 0) {
              this.totalCampaign = data[0].totalcount;
              this.indexJSON = [];
              this.setPageSize(this.totalCampaign);
              data.forEach(el => {
                let obj = {
                  isSelected: false,
                  show: true,
                  data: el
                }
                this.sourceCampaignDataSource.push(obj);
              });
              this.fetchTableDataByPage(this.PageIndex);
              this.totalRow = this.sourceCampaignDataSource.length;
              this.cd.markForCheck();
              this.sourceCampaign_total = this.sourceCampaign;
              this.totalVisibleEnquiry = this.sourceCampaign.length;
              this.totalCampaign = this.sourceCampaign_total.length;
              return this.sourceCampaign;
            }
            else {
              this.totalCampaign = data[0].totalcount;
              this.indexJSON = [];
              this.setPageSize(this.totalCampaign);
              data.forEach(el => {
                let obj = {

                  isSelected: false,
                  show: true,
                  data: el
                }
                this.sourceCampaignDataSource.push(obj);
              });
              this.fetchTableDataByPage(this.PageIndex);
              this.totalRow = this.sourceCampaignDataSource.length;
              this.cd.markForCheck();
              this.sourceCampaign_total = this.sourceCampaign;
              this.totalVisibleEnquiry = this.sourceCampaign.length;
              this.totalCampaign = this.sourceCampaign_total.length;
              return this.sourceCampaign;
            }
          }
          else {
            let alert = {
              type: 'info',
              title: 'No Records Found',
              body: 'We did not find any enquiry for the specified query'
            }
            this.fetchingDataMessage = "No Record Found";
            this.appC.popToast(alert);
            this.totalCampaign = data.length;
            this.indexJSON = [];
            this.setPageSize(this.totalCampaign);
            this.cd.markForCheck();
          }
        });
    }
    else {
      return this.postData.campaignUploadList(obj).subscribe((data: any) => {
        if (data.length != 0) {
          if (this.indexJSON.length != 0) {
            data.forEach(el => {
              let obj = {
                isSelected: false,
                show: true,
                data: el
              }
              this.sourceCampaignDataSource.push(obj);
            });
            this.cd.markForCheck();
            this.fetchTableDataByPage(this.PageIndex);
            this.totalRow = this.sourceCampaignDataSource.length;
            this.sourceCampaign_total = this.sourceCampaign;
            this.totalVisibleEnquiry = this.sourceCampaign.length;
            this.totalCampaign = this.sourceCampaign_total.length;
            return this.sourceCampaign;
          }
          else {

            data.forEach(el => {
              let obj = {
                list: el.list_name,
                date: el.created_date,
                referred_by: el.referred_by,
                source: el.source,
                isSelected: false,
                show: true,
                data: el
              }
              this.sourceCampaignDataSource.push(obj);
            });
            this.fetchTableDataByPage(this.PageIndex);
            this.totalRow = this.sourceCampaignDataSource.length;
            this.cd.markForCheck();
            this.sourceCampaign_total = this.sourceCampaign;
            this.totalVisibleEnquiry = this.sourceCampaign.length;
            this.totalCampaign = this.sourceCampaign_total.length;
            return this.sourceCampaign;

          }
        }
        else {
          let alert = {
            type: 'info',
            title: 'No Records Found',
            body: 'We did not find any enquiry for the specified query'
          }
          this.fetchingDataMessage = "No Record Found";
          this.appC.popToast(alert);
          this.totalCampaign = data.length;
          this.indexJSON = [];
          this.setPageSize(this.totalCampaign);
          this.cd.markForCheck();

          this.totalVisibleEnquiry = this.sourceCampaign.length;
          this.totalCampaign = this.sourceCampaign_total.length;
        }
      });


    }


  }


  setPageSize(totalCount) {
    let pageSize = Math.ceil(totalCount / this.instituteData.batch_size);
    this.maxPageSize = pageSize;
    let index = {
      value: null,
      start_index: null,
      end_index: null
    }
    let start: number = 0;

    for (var i = 1; i <= pageSize; i++) {
      index = {
        value: i,
        start_index: start,
        end_index: start + (this.displayBatchSize - 1)
      }
      this.indexJSON.push(index);
      start = start + this.displayBatchSize;
    }
  }



  /* Function to toggle smart table column on click event */
  toggleOptionChange(bool, id) {

    if (bool) {
      this.selectedOption[id].show = true;
      this.cd.markForCheck();
    }
    else {
      this.selectedOption[id].show = false;
      this.cd.markForCheck();
    }

  }


  /*  */
  getFollowUpColor(status): string {
    if (status != '') {
      if (moment(status).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD")) {
        return 'black';
      }
      else {
        return 'red';
      }
    }
    else {
      return 'black';
    }

  }


  /* Toggle DropDown Menu on Click */
  bulkActionFunctionOpen() {
    document.getElementById("bulk-drop").classList.remove("hide");
  }


  bulkActionFunctionClose() {
    document.getElementById("bulk-drop").classList.add("hide");
  }





  /* Function to open advanced filter */
  openAdFilter() {
    //document.getElementById('middleMainForEnquiryList').classList.add('hasFilter');
    document.getElementById('adFilterOpen').classList.add('hide');
    document.getElementById('adFilterExitVisible').classList.add('hide')
    document.getElementById('adFilterExit').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.remove('hide');
  }


  /* Function to close advanced filter */
  closeAdFilter() {
    document.getElementById('adFilterExitVisible').classList.remove('hide');
    document.getElementById('adFilterExit').classList.add('hide');
    document.getElementById('adFilterOpen').classList.remove('hide');
    document.getElementById('advanced-filter-section').classList.add('hide');
  }

  openSmsPopup(row) {
    this.smsSelectedRows = row;
    this.message = 'sms';
    this.getSMSList('init');
  }

  /* common function to close popups */
  closePopup() {
    this.message = "";
    this.testMessagePopUp = false;
    this.selectedMessage = [];
    this.smsMessageTest = [];
    this.addEditPromotional = false;
  }

  /* common function to close popups */
  closePopupTest() {
    this.testMessagePopUp = false;
    this.selectedMessage = [];
    this.smsMessageTest = [];
  }

  /* Approved SMS template send */
  sendSmsTemplate() {

    if (this.selectedMessage.length == 1) {

      this.testMessagePopUp = true;

    } else if (this.selectedMessage.length > 1) {
      let msg = {
        type: 'error',
        title: 'Cannot Send Multiple Test SMS',
        body: 'Please select only one message'
      }
      this.appC.popToast(msg);
    }
    else {
      let msg = {
        type: 'error',
        title: 'Cannot Send Blank SMS',
        body: 'Please select an approved SMS Template to be sent'
      }
      this.appC.popToast(msg);
    }
  }


  /* Service to fetch sms records from server and update table*/
  smsServicesInvoked() {
    /* store the data from server and update table */
    this.postData.fetchAllSms().subscribe(
      (data: any) => {
        this.cd.markForCheck();
        this.smsPopSource = data;
        this.cd.markForCheck();
        this.smsDataLength = data.length;
        this.cd.markForCheck();
        this.availableSMS = data[0].institute_sms_quota_available
        this.cd.markForCheck();
      },
      err => {
        let msg = {
          type: 'error',
          title: "Error loading SMS",
          body: "Please check your internet connection or refresh"
        }
        this.appC.popToast(msg);
      }
    );
  }


  /* SMS search */
  onSearch(query: string = '') {

    this.smsPopSource.setFilter(
      [{
        field: 'message',
        search: query
      }], false
    )

  }

  saveEditedSms() {
    let hours: any;
    let minutes: any;
    let meridian: any;
    let queryParam = { campaign_list_id: this.smsSelectedRows.data.list_id, date: "", messageArray: this.selectedMessage };

    minutes = this.minute;
    hours = this.hour;
    meridian = this.meridian;


    let date = this.formatDate(this.searchBarDate);

    let finaldate = date + " " + hours + ":" + minutes + " " + meridian;


    if (this.selectedMessage == null || this.selectedMessage.length == 0) {
      let msg = {
        type: 'error',
        title: "Please select a message"
      }
      this.appC.popToast(msg);

    } else {
      queryParam.date = finaldate

      this.postData.saveSMSservice(queryParam).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: "Campaign created successfully!"
          }
          this.appC.popToast(msg);
        },
        error => {
          //console.log(error);
          let err_msg = JSON.parse(error._body);
          let msg = {
            type: 'error',
            title: error.statusText,
            body: err_msg.message
          }
          this.appC.popToast(msg);
        }
      );
    }







  }


  clearDate(event) {
    let node = event.target.parentNode.childNodes;

    [].forEach.call(node, function (el) {
      if (el.type == "text" && el.tagName == "INPUT") {
        el.value = '';
      }
    });

  }


  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  selectMessage(message, i) {
  }

  /* Function to handle event on table row click*/
  rowClicked(row) {

  }



  /* checkbox clicked event  */
  rowCheckBoxClick(state, id, no, message) {


    if (state) {
      this.selectedMessage.push(no);
      this.smsMessageTest.push(message)

    } else {
      let pop_index = this.selectedMessage.indexOf(no);
      this.selectedMessage.splice(pop_index, 1);

      this.smsMessageTest.splice(pop_index, 1);
    }

  }



  sendTestSMS(form: NgForm) {

    if (form.valid) {
      let queryParam = {
        message: this.smsMessageTest[0],
        message_id: this.selectedMessage[0],
        mobile: this.phone
      }

      this.postData.campaignSMSTestService(queryParam).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: "Test Message Send Successfully!"
          }
          this.appC.popToast(msg);
        },
        error => {
          //console.log(error);
          let err_msg = JSON.parse(error._body);
          let msg = {
            type: 'error',
            title: error.statusText,
            body: err_msg.message
          }
          this.appC.popToast(msg);
        }
      );

    }
    else {
      let msg = {
        type: 'error',
        title: "Invalid Mobile Number",
        body: "Please provide the correct mobile number"
      }
      this.appC.popToast(msg);
    }

  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }








  sortTableById(sortBy) {

    if (sortBy == 'Lead Name') {
      if (this.sortFlag == 'desc') {
        this.sourceCampaign.sort(this.dynamicSort("list"));
        this.sortFlag = 'asc';
      } else {
        this.sourceCampaign.sort(this.dynamicSort("-list"));
        this.sortFlag = 'desc';
      }
    } else if (sortBy == 'Created date') {
      if (this.sortFlag == 'desc') {
        this.sourceCampaign.sort(this.dynamicSort("date"));
        this.sortFlag = 'asc';
      } else {
        this.sourceCampaign.sort(this.dynamicSort("-date"));
        this.sortFlag = 'desc';
      }
    }

  }


  /* base64 data to be converted to xls file */
  downloadFailureListFile(data) {
    this.postData.downloadFailureListFile(data.data.list_id).subscribe(
      (res: any) => {
        let byteArr = this.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('template_link_' + data.data.list_id);
        if (dwldLink.getAttribute('href') == null || dwldLink.getAttribute('href') == undefined || dwldLink.getAttribute('href') == '') {
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", fileName);
          dwldLink.click();
        }
      },
      err => {
        console.log(err.responseJSON.message);
      })
  }


  /* convert base64 string to byte array */
  convertBase64ToArray(val) {

    var binary_string = window.atob(val);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;

  }


  search_function(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].list === nameKey) {
        return myArray[i];
      }
    }
  }

  searchDatabase() {

    if (this.searchBarData == undefined || this.searchBarData == null) {
      this.searchBarData = "";
      this.sourceCampaign = [];
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.sourceCampaignDataSource.length;
    }
    else {
      let searchData = this.sourceCampaignDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchBarData.toLowerCase()))
      );
      this.searchData = searchData;
      this.totalRow = searchData.length;
      this.searchDataFlag = true;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }


  ///////PAGINATION/////////////////

  // pagination functions 
  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.studentdisplaysize * (index - 1);
    this.sourceCampaign = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let data = [];
    if (this.searchDataFlag) {
      data = this.searchData.slice(startindex, startindex + this.studentdisplaysize);
    } else {
      data = this.sourceCampaignDataSource.slice(startindex, startindex + this.studentdisplaysize);
    }
    return data;
  }

  rowClickEvent(row) {
    this.selectedRow = row;
  }



  /// Add Edit Promotional SMS

  addEditPromotionalSms() {
    this.addEditPromotional = true;
    this.getSMSList('');
  }

  getSMSList(Key) {
    let data: any;
    if (Key == "init") {
      data = { status: 1, sms_type: "Promotional" };
    } else {
      data = { feature_type: 1 }
    }
    this.messageList = [];
    this.postData.campaignMessageList(data).subscribe(
      data => {
        this.messageList = data;
      },
      error => { console.log(error) }
    )
  }

  editRowTable(row, index) {
    document.getElementById(("rowMessage" + index).toString()).classList.remove('displayComp');
    document.getElementById(("rowMessage" + index).toString()).classList.add('editComp');
  }

  cancelEditRow(index) {
    document.getElementById(("rowMessage" + index).toString()).classList.add('displayComp');
    document.getElementById(("rowMessage" + index).toString()).classList.remove('editComp');
  }

  deleteRow(row, index) {
    if (confirm('Do you want to delete this Message>?')) {
      this.postData.deleteMessage(row.message_id).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: "Deleted",
            body: "Deleted Successfully"
          }
          this.appC.popToast(msg);
          this.getSMSList('');
        },
        err => {
          //console.log(err);
          let msg = {
            type: 'error',
            title: "Error",
            body: JSON.parse(err._body).message
          }
          this.appC.popToast(msg);
        }
      )
    }
  }


  saveInformation(row, index) {
    if (row.message.trim() != "" && row.message.trim() != null) {
      let obj = {
        message: row.message.trim()
      }
      this.postData.updateMessage(obj, row.message_id).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: "Saved",
            body: "Updated Successfully"
          }
          this.appC.popToast(msg);
          this.getSMSList('');
        },
        err => {
          let msg = {
            type: 'error',
            title: "Error",
            body: JSON.parse(err._body).message
          }
          this.appC.popToast(msg);
        }
      )

    }
  }

  createNewSMS() {
    this.createNew = true;
  }

  closeAddDiv() {
    this.createNew = false;
  }

  addNewMessage() {
    if (this.messageText.trim() != "" && this.messageText.trim() != null) {
      let test = {
        message: this.messageText,
        sms_type: "Promotional"
      }
      this.postData.addNewMessage(test).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: "Added",
            body: "Added Successfully"
          }
          this.appC.popToast(msg);
          this.getSMSList('');
          this.messageText = "";
          this.closeAddDiv();
        },
        err => {
          //console.log(err);
          let msg = {
            type: 'error',
            title: "Error",
            body: err.error.message
          }
          this.appC.popToast(msg);
        }
      )
    } else {
      let msg = {
        type: 'error',
        title: "Error",
        body: "Please provide message text"
      }
      this.appC.popToast(msg);
    }
  }

  approveMessage(data) {
    if (confirm('Do you want to continue?')) {
      this.postData.approveMessage(data.message_id).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: "Added",
            body: "Added Successfully"
          }
          this.appC.popToast(msg);
          this.getSMSList('');
          this.messageText = "";
          this.closeAddDiv();
        },
        err => {
          //console.log(err);
          let msg = {
            type: 'error',
            title: "Error",
            body: err.error.message
          }
          this.appC.popToast(msg);
        }
      )
    }
  }

  showApproveButtons(data) {
    let check = false;
    if (data.statusValue == 'Open' && this.enableApprove == '1' && this.isAdmin == "") {
      return false;
    } else {
      return true;
    }
  }

  showActionButton(row) {
    if (this.enableApprove == '1' && this.isAdmin == "") {
      return false
    } else {
      return true;
    }
  }

}







