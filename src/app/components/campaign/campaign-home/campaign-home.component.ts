import {
  Component, OnInit, ViewChild, Input, Output,
  EventEmitter, HostListener, AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
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
  sourceEnquiry: any[] = []; smsPopSource: LocalDataSource; busy: Subscription;
  checkedStatus = []; filtered = []; enqstatus: any[] = []; enqPriority: any[] = [];
  enqFollowType: any[] = []; enqAssignTo: any[] = []; enqStd: any[] = []; enqSubject: any[] = [];
  enqScholarship: any[] = []; enqSub2: any[] = []; paymentMode: any[] = []; commentFormData: any = {};
  today: any = Date.now(); searchBarData: any = null;hours:any; minutes:any; searchBarDate: any = moment().format('YYYY-MM-DD');
  displayBatchSize: number = 100; incrementFlag: boolean = true; updateFormComments: any = [];
  updateFormCommentsBy: any = []; updateFormCommentsOn: any = []; PageIndex: number = 1;
  maxPageSize: number = 0; totalEnquiry: number = 0; isProfessional: boolean = false;
  isActionDisabled: boolean = false; isMessageAddOpen: boolean = false; isMultiSms: boolean = false;
  smsSelectedRowsLength: number = 0; sizeArr: any[] = [25, 50, 100, 150, 200, 500];
  isAllSelected: boolean = false;

  currentDirection = 'desc'; selectedRowGroup: any[] = []; componentPrefill: any = [];
  componentListObject: any = {}; emptyCustomComponent: any; componentRenderer: any = []; customComponentResponse: any = [];
  fetchingDataMessage: string = "Loading"; smsBtnToggle: boolean = false;

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

  selectedMessage:any;

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

    this.sourceEnquiry = [];
    this.selectedRow = null;
    this.selectedRowGroup = [];

    /* start index of object passed is zero then create pagination */
    if (obj.start_index == 0) {
      return this.postData.campaignUploadList(obj).subscribe(
        data => {
          console.log("date" + data);
          if (data.length != 0) {
            if (this.indexJSON.length != 0) {
              this.totalEnquiry = data[0].totalcount;
              this.indexJSON = [];
              this.setPageSize(this.totalEnquiry);
              data.forEach(el => {
                let obj = {
                  isSelected: false,
                  show: true,
                  data: el
                }
                this.sourceEnquiry.push(obj);
              });
              this.cd.markForCheck();
              return this.sourceEnquiry;
            }
            else {
              this.totalEnquiry = data[0].totalcount;
              this.indexJSON = [];
              this.setPageSize(this.totalEnquiry);
              data.forEach(el => {
                let obj = {
                  isSelected: false,
                  show: true,
                  data: el
                }
                this.sourceEnquiry.push(obj);
              });
              this.cd.markForCheck();
              return this.sourceEnquiry;
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
            this.totalEnquiry = data.length;
            this.indexJSON = [];
            this.setPageSize(this.totalEnquiry);
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
              this.sourceEnquiry.push(obj);
            });
            this.cd.markForCheck();
            return this.sourceEnquiry;
          }
          else {
            data.forEach(el => {
              let obj = {
                isSelected: false,
                show: true,
                data: el
              }
              this.sourceEnquiry.push(obj);
            });
            this.cd.markForCheck();
            return this.sourceEnquiry;
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
          this.totalEnquiry = data.length;
          this.indexJSON = [];
          this.setPageSize(this.totalEnquiry);
          this.cd.markForCheck();
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
  }


 
  /* Approved SMS template send */
  sendSmsTemplate() {
    
    if (this.selectedSMS.message != null && this.selectedSMS.message != '') {

      /* Denied */
      if (this.selectedSMS.statusValue == 'Open') {
        let msg = {
          type: 'warning',
          title: 'Unable To Send SMS',
          body: 'Your sms template is pending approval, kindly contact support'
        }
        this.appC.popToast(msg);
        this.cd.markForCheck();
      }

      /* Rejected  */
      else if (this.selectedSMS.statusValue == 'Rejected') {

        let msg = {
          type: 'error',
          title: 'Unable To Send SMS',
          body: 'Your sms template has been rejected, kindly contact support'
        }
        this.appC.popToast(msg);
        this.cd.markForCheck();

      }

      /* Ok Send SMS */
      else if (this.selectedSMS.statusValue == 'Approved') {

        /* Send Multi SMS */
        if (this.isMultiSms) {
          let userId = [];

          //console.log(this.selectedRowGroup);

          this.selectedRowGroup.forEach(el => {
            //console.log(el);
            userId.push(el.data.institute_enquiry_id);
            this.cd.markForCheck();
          });



          let messageId = [];
          messageId.push((this.selectedSMS.message_id).toString());

          this.sendSmsFormData.baseIds = userId;
          this.sendSmsFormData.messageArray = messageId;
          this.cd.markForCheck();
          this.postdata.sendSmsToEnquirer(this.sendSmsFormData).subscribe(
            res => {
              //console.log(res);
              let msg = {
                type: 'success',
                title: 'SMS sent',
                body: "Your sms has been sent and will be delivered shortly"
              }
              this.appC.popToast(msg);
              this.cd.markForCheck();
            },
            err => {
              let msg = {
                type: 'error',
                title: 'Unable To Send SMS',
                body: "SMS notification cannot be sent due to any of following reasons: SMS setting is not enabled for institute. SMS Quota is insufficient for institute. No Users(Contacts) found for notify."
              }
              this.appC.popToast(msg);
              this.cd.markForCheck();
            }
          )

        }
        /* Send Single SMS */
        else {

          let userId = [];
          userId.push((this.selectedRow.data.institute_enquiry_id).toString());
          let messageId = [];
          messageId.push((this.selectedSMS.message_id).toString());

          this.sendSmsFormData.baseIds = userId;
          this.sendSmsFormData.messageArray = messageId;

          this.postdata.sendSmsToEnquirer(this.sendSmsFormData).subscribe(
            res => {
              console.log(res);
              let msg = {
                type: 'success',
                title: 'SMS sent',
                body: "Your sms has been sent and will be delivered shortly"
              }
              this.appC.popToast(msg);
            },
            err => {
              let msg = {
                type: 'error',
                title: 'Unable To Send SMS',
                body: "SMS notification cannot be sent due to any of following reasons: SMS setting is not enabled for institute. SMS Quota is insufficient for institute. No Users(Contacts) found for notify."
              }
              this.appC.popToast(msg);
            }
          )
        }
      }
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

    console.log(this.selectedMessage);
    console.log(this.searchBarDate);
    

    let hourminutes:any;
    let minutes:any;

    if (this.minutes == null){
      minutes = 0;
    }else{
      minutes = parseInt(this.minutes);
      
    }

    if (this.hours == null){
      hourminutes = 0;
    }else{
      let hours = parseInt(this.hours);
      hourminutes = this.hours * 60;
    }

    let total_minutes = hourminutes + minutes;

    // var hours = Math.floor( $('.totalMin').html() / 60);          
    // var minutes = $('.totalMin').html() % 60;

    // var dateString = moment.unix(this.searchBarDate).format("MM/DD/YYYY");
    console.log(dateString);
    var dateString = moment(this.searchBarDate,'MM/DD/YYYY').toDate()
    console.log(dateString);

    console.log(total_minutes);



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

  




  


}


// @Pipe({ name: 'filter' })

// export class FilterPipe  implements PipeTransform {

//   transform(items: any[], searchText: string): any[] {
//     if(!items) return [];
//     if(!searchText) return items;
//     searchText = searchText.toLowerCase();
//     return items.filter( it => {
//       return it.toLowerCase().includes(searchText);
//       });
//   }
// }
