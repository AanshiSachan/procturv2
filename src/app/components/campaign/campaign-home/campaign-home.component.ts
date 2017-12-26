import {
  Component, OnInit, ViewChild, Input, Output,
  EventEmitter, HostListener, AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn, NgForm } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from '../../../../assets/imported_modules/multiselect-dropdown';
import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { instituteInfo } from '../../../model/instituteinfo';
import { updateEnquiryForm } from '../../../model/update-enquiry-form';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';
import { Logger } from '@nsalaun/ng-logger';
import { Ng2SmartTableModule, LocalDataSource } from '../../../../assets/imported_modules/ng2-smart-table';
import { MenuItem } from 'primeng/primeng';
import { CampaignService } from '../../../services/campaign-services/campaign.service';
import { SmsOptionComponent } from './sms-option.component';
import { error } from 'util';







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
  sourceCampaign: any[] = []; sourceCampaign_total = [] ; smsPopSource: LocalDataSource; busy: Subscription;
  checkedStatus = []; filtered = []; enqstatus: any[] = []; enqPriority: any[] = [];
  enqFollowType: any[] = []; enqAssignTo: any[] = []; enqStd: any[] = []; enqSubject: any[] = [];
  enqScholarship: any[] = []; enqSub2: any[] = []; paymentMode: any[] = []; commentFormData: any = {};
  today: any = Date.now(); searchBarData: any = null;searchBarDate: any = moment().format('YYYY-MM-DD');
  displayBatchSize: number = 100; incrementFlag: boolean = true; updateFormComments: any = [];
  updateFormCommentsBy: any = []; updateFormCommentsOn: any = []; PageIndex: number = 1;
  maxPageSize: number = 0; totalVisibleEnquiry:number = 0; totalCampaign: number = 0; isProfessional: boolean = false;
  isActionDisabled: boolean = false; isMessageAddOpen: boolean = false; isMultiSms: boolean = false;
  smsSelectedRowsLength: number = 0; sizeArr: any[] = [25, 50, 100, 150, 200, 500];
  isAllSelected: boolean = false;
  hourArr:any[] = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  minArr:any[] = ['00','15','30','45']; meridianArr:any[] = ["AM", "PM"];
  hour:string = '12'; minute:string = '00'; meridian:string = 'AM';

  currentDirection = 'desc'; selectedRowGroup: any[] = []; componentPrefill: any = [];
  componentListObject: any = {}; emptyCustomComponent: any; componentRenderer: any = []; customComponentResponse: any = [];
  fetchingDataMessage: string = "Loading"; smsBtnToggle: boolean = false;
  testMessagePopUp=false;

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
    list_name:{ id: 'list_name', title: 'Lead Name', filter: false, show: true },
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
  phone:any;
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

  messageList:any;

  //flag for sorting
  sortFlag = "asc";

  /* Settings for SMS Table Display */
  settingsSmsPopup = {
    selectMode: 'single', mode: 'external', hideSubHeader: false, toggle: 'N',
    actions: { add: false, edit: false, delete: false, columnTitle: '', },
    columns: {
      message: { title: 'Message', filter: false, show: true },
      statusValue: { title: 'Status.', filter: false, show: true },
      //date: { title: 'Date.', filter: false, show: true },
      //status: { title: 'Status Key', filter: false, show: false },
      //campaign_list_id: { title: 'Campaign List.', filter: false, show: false },
      //campaign_list_message_id: { title: 'Campaign List Id.', filter: false, show: false },
      //feature_type: { title: 'Feature Type.', filter: false, show: false },
      //institute_name: { title: 'Institute Name.', filter: false, show: false },
      //message_id: { title: 'Message Id.', filter: false, show: false },
      //sms_type: { title: 'Sms Type.', filter: false, show: false },
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


  myOptions:any[] = [
    { id: 'email', name: 'Email'},
    { id: 'Gender', name: 'Gender' },
    { id: 'standard', name: 'Standard' },
    { id: 'subjects', name: 'Subject' }
  ]

  constructor(private enquire: FetchenquiryService, private prefill: FetchprefilldataService,
    private router: Router, private logger: Logger, private fb: FormBuilder,
    private pops: PopupHandlerService,private postdata: PostEnquiryDataService,
    private appC: AppComponent, private login: LoginService, private cd: ChangeDetectorRef,
    private postData: CampaignService, 
  ) { }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    //console.log(this.isProfessional);
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));

    this.login.changeNameStatus(sessionStorage.getItem('name'));

    /* Load paginated campaign data from server */
    this.busy = this.loadTableDatatoSource(this.instituteData);

    
  }

  /* Load Table data with respect to the institute data provided */
  loadTableDatatoSource(obj) {

    this.postData.campaignMessageList().subscribe(
      data => {console.log(data);
              this.messageList = data;},
      error => {console.log(error)}
    )
    
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
        data => {
          console.log("date" + data);
          if (data.length != 0) {
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
                this.sourceCampaign.push(obj);
              });
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
                this.sourceCampaign.push(obj);
              });
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
      return this.postData.campaignUploadList(obj).subscribe(data => {
        console.log("data else" + data);
        if (data.length != 0) {
          if (this.indexJSON.length != 0) {
            data.forEach(el => {
              let obj = {
                isSelected: false,
                show: true,
                data: el
              }
              this.sourceCampaign.push(obj);
            });
            this.cd.markForCheck();
            this.sourceCampaign_total = this.sourceCampaign;
            this.totalVisibleEnquiry = this.sourceCampaign.length;
            this.totalCampaign = this.sourceCampaign_total.length;
            return this.sourceCampaign;
          }
          else {
            
            data.forEach(el => {
              let obj = {
                list:el.list_name,
                date:el.created_date,
                referred_by:el.referred_by,
                source:el.source,
                isSelected: false,
                show: true,
                data: el
              }
              this.sourceCampaign.push(obj);
            });
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
  








  /* Customiized click detection strategy */
  inputClicked() {
    var nodelist = document.querySelectorAll('.form-ctrl');
    [].forEach.call(nodelist, (elm) => {
      elm.addEventListener('blur', function (event) {
        if (event.target.value != '') {
          event.target.parentNode.classList.add('has-value');
        } else {
          event.target.parentNode.classList.remove('has-value');
        }
      });
    });

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

  openSmsPopup(row){
    console.log("we are here");
    console.log(row);
    this.smsSelectedRows = row;
    this.message = 'sms';
  }

  /* common function to close popups */
  closePopup() {
    console.log("close popup");
    this.message = "";
    this.testMessagePopUp = false;
    this.selectedMessage = [];
    this.smsMessageTest = [];
    
  }

  /* common function to close popups */
  closePopupTest() {
    this.testMessagePopUp = false;
    this.selectedMessage = [];
    this.smsMessageTest =[];
  }
 
  /* Approved SMS template send */
  sendSmsTemplate() {
    
    if(this.selectedMessage.length == 1){

      this.testMessagePopUp = true;

    }else if(this.selectedMessage.length > 1){
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
    this.enquire.fetchAllSms().subscribe(
      data => {
        this.cd.markForCheck();
        this.smsPopSource = new LocalDataSource(data);
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
    let hours:any;
    let minutes:any;
    let meridian:any;
    let queryParam = {campaign_list_id : this.smsSelectedRows.data.list_id, date : "",messageArray:this.selectedMessage};

    minutes = this.minute;      
    hours = this.hour;
    meridian = this.meridian;
    

    let date = this.formatDate(this.searchBarDate);

    let finaldate = date + " "+hours+":"+minutes+" "+meridian;
    
    console.log(finaldate);

    if(this.selectedMessage == null || this.selectedMessage.length == 0){
      let msg = {
        type: 'error',
        title: "Please select a message"
      }
      this.appC.popToast(msg);

    }else{
      queryParam.date = finaldate
      console.log(queryParam); 
      
      this.busy =  this.postData.saveSMSservice(queryParam).subscribe(
        res => {
                let msg = {
                  type: 'success',
                  title: "Campaign created successfully!"
                }
                this.appC.popToast(msg);
          },
        error => {
                  console.log(error);          
                  let err_msg = JSON.parse(error._body);
                  console.log(error.statusText);
                  console.log(err_msg);
                  console.log(err_msg.message);
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


  clearDate(event){
    let node = event.target.parentNode.childNodes;

    [].forEach.call(node, function(el){
      if(el.type == "text" && el.tagName == "INPUT"){
        console.log(el.value);
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

  selectMessage(message,i){
    console.log(message);
    console.log(i);
  }

  /* Function to handle event on table row click*/
  rowClicked(row) {
    
  }



  /* checkbox clicked event  */
  rowCheckBoxClick(state, id, no, message) {
    console.log(state);
    console.log(id);
    console.log(no);
    
    
    if (state) {
      this.selectedMessage.push(no);
      this.smsMessageTest.push(message)
      
    }else{
      let pop_index = this.selectedMessage.indexOf(no);
      this.selectedMessage.splice(pop_index,1);

      this.smsMessageTest.splice(pop_index,1);
    }  
    
    console.log(this.selectedMessage);
    console.log(this.smsMessageTest);

  }
  


  sendTestSMS(form: NgForm){

    if (form.valid) {
      let queryParam = {message   :this.smsMessageTest[0],
                        message_id:this.selectedMessage[0],
                        mobile    :this.phone
                      }

      this.busy =  this.postData.campaignSMSTestService(queryParam).subscribe(
        res => {
                let msg = {
                  type: 'success',
                  title: "Test Message Send Successfully!"
                }
                this.appC.popToast(msg);
          },
        error => {
                  console.log(error);          
                  let err_msg = JSON.parse(error._body);
                  console.log(error.statusText);
                  console.log(err_msg);
                  console.log(err_msg.message);
                  let msg = {
                    type: 'error',
                    title: error.statusText,
                    body: err_msg.message
                  }
                  this.appC.popToast(msg);
          }
      );

    }
    else{
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
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
  







  sortTableById(sortBy){    

    if(sortBy == 'Lead Name'){
      if(this.sortFlag == 'desc'){
        this.sourceCampaign.sort(this.dynamicSort("list"));
        this.sortFlag = 'asc';
      }else{
        this.sourceCampaign.sort(this.dynamicSort("-list"));
        this.sortFlag = 'desc';
      }      
    }else if(sortBy == 'Created date'){
      if(this.sortFlag == 'desc'){
        this.sourceCampaign.sort(this.dynamicSort("date"));
        this.sortFlag = 'asc';
      }else{
        this.sourceCampaign.sort(this.dynamicSort("-date"));
        this.sortFlag = 'desc';
      }  
    }

  }


    /* base64 data to be converted to xls file */
    downloadFailureListFile(data) {

      console.log(data.data.list_name);
      this.postData.downloadFailureListFile(data.data.list_id).subscribe(
        res => {
          
          let byteArr= this.convertBase64ToArray(res.document);
          //console.log(byteArr);
          let format = res.format;
          let fileName = res.docTitle;
          let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
          //console.log(file);
          let url = URL.createObjectURL(file);
          let dwldLink = document.getElementById('template_link_'+data.data.list_id);
          console.log(dwldLink.getAttribute('href'));
          if(dwldLink.getAttribute('href') == null ||dwldLink.getAttribute('href') == undefined ||dwldLink.getAttribute('href') == ''){
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", fileName);
            dwldLink.click();
            dwldLink.setAttribute("href", null);
            dwldLink.setAttribute("download", '');
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


    search_function(nameKey, myArray){
      for (var i=0; i < myArray.length; i++) {
          if (myArray[i].list === nameKey) {
              return myArray[i];
          }
      }
    }



    searchDatabase(){
      if(this.searchBarData == undefined || this.searchBarData == null){
        this.searchBarData = "";
      }

      let term = this.searchBarData;

      this.sourceCampaign = this.sourceCampaign_total.filter(item => 
        Object.keys(item).some(k => item[k] != null && 
        item[k].toString().toLowerCase()
        .includes(term.toLowerCase()))
      );

      if(this.sourceCampaign == undefined || this.sourceCampaign == null){
        this.sourceCampaign = [];
      }

      this.totalVisibleEnquiry = this.sourceCampaign.length;
      this.totalCampaign = this.sourceCampaign_total.length;


      // this.sourceCampaign = this.search_function(this.searchBarData,this.sourceCampaign_total)
      
    }
  


}







