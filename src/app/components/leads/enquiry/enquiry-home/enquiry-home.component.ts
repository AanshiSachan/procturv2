import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/* Third party imports */
import * as moment from 'moment';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { MenuItem } from 'primeng/primeng';
import 'rxjs/Rx';
import { instituteInfo } from '../../../../model/instituteinfo';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../services/common-service';
import { FetchenquiryService } from '../../../../services/enquiry-services/fetchenquiry.service';
import { PopupHandlerService } from '../../../../services/enquiry-services/popup-handler.service';
import { PostEnquiryDataService } from '../../../../services/enquiry-services/post-enquiry-data.service';
import { FetchprefilldataService } from '../../../../services/fetchprefilldata.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { MultiBranchDataService } from '../../../../services/multiBranchdata.service';
import { TablePreferencesService } from '../../../../services/table-preference/table-preferences.service';
import { ColumnSetting } from '../../../shared/custom-table/layout.model';


@Component({
    selector: 'app-enquiry-home',
    templateUrl: './enquiry-home.component.html',
    styleUrls: ['./enquiry-home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquiryHomeComponent implements OnInit {
    /* Variable Declaration */
    @ViewChild('skelton') skel: ElementRef;
    @ViewChild('mySidenav') mySidenav: ElementRef;
    @ViewChild('enqPage') enqPage: ElementRef;
    @ViewChild('tablemain') tablemain: ElementRef;
    @ViewChild('pager') pager: ElementRef;
    @ViewChild('optMenu') optMenu: ElementRef;

    sourceEnquiry: any[] = [];
    smsSourceApproved: any[] = [];
    smsSourceOpen: any[] = [];
    emailSourceApproved: any[] = [];
    emailSourceOpen: any[] = [];
    checkedStatus = [];
    filtered = [];
    enqstatus: any[] = [];
    enqPriority: any[] = [];
    campaignList: any[] = [];
    enqFollowType: any[] = [];
    enqAssignTo: any[] = [];
    enqStd: any[] = [];
    enqSubject: any[] = [];
    sources: any[] = [];
    enqScholarship: any[] = [];
    paymentMode: any[] = [];
    schools: any[] = [];
    slots: any[] = [];
    private customComponents: any[] = [];
    statusString: any[] = [];
    smsSelectedRows: any;
    smsGroupSelected: any[] = [];
    private selectedSlots: any[] = [];
    private slotIdArr: any[] = [];
    branchesList: any = [];
    cityList: any = [];
    areaList: any = [];
    closingReasonDataSource: any = [];
    bulkAddItems: MenuItem[];
    indexJSON = [];
    selectedRowGroup: any[] = [];
    componentPrefill: any = [];
    componentRenderer: any = [];
    customComponentResponse: any = [];
    course_subject: any[] = [];
    course_course: any[] = [];
    masterCourseData: any[] = [];
    referredByData: any[] = [];
    sizeArr: any[] = [25, 50, 100, 150, 200, 500];
    commentFormData: any = {};
    emailGridData: any = [];
    filterCustomComponent = [];
    EmailThumbnailUrl: any = '';
    EmailGridSelectedObject: any = null;
    selectedTableRow: any;
    viewPopUp = false;
    isSendGridEnable: boolean = false;
    downloadEnquiryReportAccess: boolean = false;
    /* Variable to handle popups */
    varJson: any = {
        message: '',
        selectedSlotsString: '',
        sortBy: 'followUpDateTime',
        PageIndex: 1,
        totalEnquiry: 0,
        availableSMS: 0,
        smsDataLength: 0,
        selectedRowCount: 0,
        currentDirection: 'desc',
        insttitueId: '',
        fetchingDataMessage: 1,
        sendSmsFormData: { baseIds: [], messageArray: [] },
        searchBarData: null,
        searchBarDate: '',
        displayBatchSize: 100,
        downloadReportOption: 1,
        summaryReport: { from_date: "", to_date: "" },
        enquiryInfo: '',
        smsShowType: 'approvedSms',
        showDownloadSummary: false,
        isFilterApplied: false,
    };
    timeJson = { hour: '', minute: '', meridian: '' };
    isMainBranch: any = 'N';
    // smsSearchData: string = "";
    emailSubject: string = "";
    emptyCustomComponent: any;
    smsSelectedRowsLength: number = 0;
    flagJSON: any = {
        isEnquiryAdmin: false,
        isConverted: false,
        hasReceipt: false,
        isadmitted: false,
        notClosednAdmitted: false,
        isClosed: false,
        isAssignEnquiry: false,
        smsBtnToggle: false,
        isEnquiryOptions: false,
        isProfessional: false,
        isMessageAddOpen: false,
        isMultiSms: false,
        isAllSelected: false,
        isApprovedTab: true,
        isOpenTab: false,
        isSideBar: false,
        isConvertToStudent: false,
        subBranchSelected: false,
        summaryOptions: false,
        showDateRange: false,
        showPreference: false,
        notificationType: 'SMS'
    }
    newSmsString = { data: "", type: "", };
    messageCount: number = 0;
    messageCountForEdit: number = 0;
    selectedRow: any = {};
    componentListObject: any = {};
    /* Model For Registration, valid only for professional institute where status is registred else will thow an error with status code 400 */
    registrationForm = {
        institute_enquiry_id: "",
        amount: "",
        paymentDate: moment().format('YYYY-MM-DD'),
        paymentMode: "",
        reference: "",
    };
    selectedOption: any = {
        email: { show: false, id: 'email' },
        Gender: { show: false, id: 'Gender' },
        standard: { show: false, id: 'standard' },
        subjects: { show: false, id: 'subjects' }
    };
    myOptions: any[] = [
        { id: 'email', name: 'Email' },
        { id: 'Gender', name: 'Gender' },
        { id: 'standard', name: 'Standard' },
        { id: 'subjects', name: 'Subject' }
    ];
    /* Model for Enquiry Update Popup Form */
    updateFormData: any = {
        comment: "",
        status: "",
        statusValue: "",
        institution_id: sessionStorage.getItem('institute_id'),
        isEnquiryUpdate: "Y",
        closedReason: null,
        slot_id: null, priority: "",
        follow_type: "",
        followUpDate: "",
        commentDate: moment().format('YYYY-MM-DD'),
        followUpTime: "",
        followUpDateTime: '',
        isEnquiryV2Update: "N",
        isRegisterFeeUpdate: "N",
        amount: null,
        paymentMode: null,
        paymentDate: null,
        reference: null,
        walkin_followUpDate: '',
        walkin_followUpTime: { hour: '', minute: '' },
        is_follow_up_time_notification: 0,
        source_instituteId: '-1',
        closing_reason_id: '0'
    };
    customCompid: any;
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
    statFilter = [
        { value: 'All', prop: 'All', checked: false, disabled: false },
        { value: 'Pending Followup', prop: 'Pending', checked: true, disabled: false },
        { value: 'Open', prop: 'Open', checked: false, disabled: false },
        { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false },
        { value: 'Registered', prop: 'Registered', checked: false, disabled: false },
        { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false },
        { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false },
        { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }
    ];
    /* Settings for SMS Table Display */
    smsHeader = {
        message: { title: 'Message', id: 'message', show: true },
        statusValue: { title: 'Status.', id: 'statusValue', show: false },
        date: { title: 'Date', id: 'date', show: true },
        action: { title: 'Action', id: 'action', show: true },
        status: { title: 'Status Key', id: 'status', show: false },
        feature_type: { title: 'Feature Type.', id: 'feature_type', show: false },
        message_id: { title: 'Message Id.', id: 'message_id', show: false },
        sms_type: { title: 'Sms Type.', id: 'sms_type', show: false },
    };

    /* Model for institute Data */
    instituteData: instituteInfo = {
        name: "",
        phone: "",
        email: "",
        enquiry_no: "",
        priority: "",
        status: -1,
        filtered_statuses: "",
        follow_type: "",
        followUpDate: this.getDateFormated(null, 'YYYY-MM-DD'),
        enquiry_date: "",
        assigned_to: -1,
        standard_id: -1,
        subjectIdArray: null,
        master_course_name: '',
        courseIdArray: null,
        subject_id: -1,
        is_recent: "N",
        slot_id: -1,
        filtered_slots: "",
        isDashbord: "N",
        enquireDateFrom: "",
        enquireDateTo: "",
        updateDate: "",
        updateDateFrom: "",
        updateDateTo: "",
        start_index: 0,
        batch_size: this.varJson.displayBatchSize,
        closedReason: "",
        enqCustomLi: null,
        sorted_by: "",
        order_by: "",
        commentShow: 'false'
    };

    /* Form for advanced filter  */
    advancedFilterForm: instituteInfo = {
        name: "",
        phone: "",
        email: "",
        enquiry_no: "",
        priority: "",
        status: -1,
        commentShow: 'false',
        filtered_statuses: "",
        follow_type: "",
        followUpDate: this.getDateFormated(null, 'YYYY-MM-DD'),
        enquiry_date: "",
        assigned_to: -1,
        standard_id: -1,
        subjectIdArray: null,
        master_course_name: '-1',
        courseIdArray: null,
        subject_id: -1,
        is_recent: "Y",
        slot_id: -1,
        filtered_slots: "",
        isDashbord: "N",
        enquireDateFrom: "",
        enquireDateTo: "",
        updateDate: "",
        updateDateFrom: "",
        updateDateTo: "",
        start_index: 0,
        batch_size: this.varJson.displayBatchSize,
        closedReason: "",
        enqCustomLi: null,
        source_id: "-1",
        school_id: "-1",
        list_id: "-1",
        city: '',
        area: '',
        referred_by: '',
        country_id: '-1',
        state_id: '-1',
        city_id: '-1'
    };
    enquiryFullDetail: any;
    enquirySettings: ColumnSetting[] = [
        { primaryKey: 'enquiry_no', header: 'ENQ No.', priority: 1, format: this.varJson.currentDirection },
        { primaryKey: 'name', header: 'Name', priority: 2 },
        { primaryKey: 'phone', header: 'Contact No', priority: 3 },
        { primaryKey: 'statusValue', header: 'Status', priority: 4 },
        { primaryKey: 'priority', header: 'Priority', priority: 5 },
        { primaryKey: 'source_name', header: 'Source', priority: 6 },
        { primaryKey: 'followUpDate', header: 'Follow up Date', format: this.varJson.currentDirection, priority: 7, },
        { primaryKey: 'updateDate', header: 'Last Updated', priority: 8 },
        { primaryKey: 'assigned_name', header: 'Assignee Name', priority: 9 },
        { primaryKey: 'follow_type', header: 'Follow Up Type', priority: 10 },
        { primaryKey: 'standard', header: 'STD', priority: 11 },
        { primaryKey: 'referred_by_name', header: 'Referred By', priority: 12 },
        { primaryKey: 'noOfCoursesAssigned', header: 'No. of Courses Assigned', priority: 12 }
    ];
    assignMultipleForm: any = {
        enqLi: [],
        assigned_to: "",
        source_instituteId: ''
    };

    // Customizable Table VAriable

    displayKeys: any[] = [];
    tableSetting: any = {
        tableDetails: { title: 'Enquiry List', key: 'enquiry.home', showTitle: false },
        search: { title: 'Search', showSearch: false },
        keys: this.displayKeys,
        selectAll: { showSelectAll: true, option: 'single', title: 'Select Enquiry', checked: false, key: 'enquiry_no' },
        actionSetting: {},
        displayMessage: "Enter Detail to Search"
    };
    countryList: any[] = [];
    stateList: any[] = [];
    cityDetails: any[] = [];
    showBulkUpload: any = false;

    downloadReportFor = {
        enquiry: false,
        admissions: false,
        fees: false
    }
    // pre fill data flag
    preFill: boolean = false;


    /*Declaration Fin*/
    constructor(
        private enquire: FetchenquiryService,
        private prefill: FetchprefilldataService,
        private router: Router,
        private pops: PopupHandlerService,
        private postdata: PostEnquiryDataService,
        private cd: ChangeDetectorRef,
        private actRoute: ActivatedRoute,
        private auth: AuthenticatorService,
        private multiBranchService: MultiBranchDataService,
        private _commService: CommonServiceFactory,
        private messageService: MessageShowService,
        private _tablePreferencesService: TablePreferencesService,
        private httpService: HttpService
    ) {
        if (_commService.valueCheck(sessionStorage.getItem('userid'))) {
            this.router.navigate(['/authPage']);
        }

        this.actRoute.queryParams.subscribe(e => {
            if ((!this._commService.valueCheck(e.id))) {
                if (this._commService.valueCheck(e.action)) {
                    this.router.navigate(['/view/enquiry/edit/' + e.id]);
                }
                else {
                    switch (e.action) {
                        case 'enquiryEdit': {
                            this.router.navigate(['/view/enquiry/edit/' + e.id]);
                            break;
                        }
                        case 'enquiryUpdate': {
                            //console.log(e);
                            break;
                        }
                    }
                }
            }
        });

    }
    /* OnInit Function */
    ngOnInit() {
        this.auth.institute_type.subscribe(
            res => {
                if (res == 'LANG') {
                    this.flagJSON.isProfessional = true;
                } else {
                    this.flagJSON.isProfessional = false;
                }
            }
        );

        this.auth.currentInstituteId.subscribe(
            res => {
                this.varJson.insttitueId = res;
            }
        );

        if (this.flagJSON.isProfessional) {
            this.enquirySettings[10].header = "Master Course";
        }

        this.isEnquiryAdministrator();
        // this.FetchEnquiryPrefilledData();
        //this.prefill.getLeadSource().subscribe( (data)=>{ console.log(data)})
        /* Fetch prefill data after table data load completes */

        /* Dropdown items for Bulk Actions */
        this.roleManagementForBulkAdd();
        this.checkBulkUploadRole();
        /* Load paginated enquiry data from server */
        let params = sessionStorage.getItem('dashBoardParam');
        if (params != "" && params != null && params != undefined) {
            this.checkIfRoutedFromEnquiry();
            sessionStorage.setItem('dashBoardParam', '');
        } else {
            this.loadTableDatatoSource(this.instituteData);
        }
        this.cd.markForCheck();
        /* Fetch the status of message from  popup handler service */
        this.pops.currentMessage.subscribe(message => {
            this.cd.markForCheck();

            if (this.selectedRow.institute_enquiry_id != null && this.selectedRow.institute_enquiry_id != undefined) {
                if (message == 'sms') {
                    this.cd.markForCheck();
                    this.smsServicesInvoked();
                    this.varJson.message = message;
                    this.cd.markForCheck();
                    this.smsSelectedRows = this.selectedRow;
                    this.flagJSON.isApprovedTab = true;
                    this.cd.markForCheck();
                }
                else if (message == 'update') {
                    this.varJson.enquiryInfo = this.selectedRow.institute_enquiry_id;
                    this.varJson.message = message;
                }
                else {
                    this.varJson.message = message
                    this.cd.markForCheck();
                }

            }
        });

        /* SMS message service handler to communicate between components */
        this.pops.currentSms.subscribe(res => {
            if (res == 'edit') {
                this.cd.markForCheck();
                this.editSms();
            }
        });
        sessionStorage.setItem('varJson.displayBatchSize', this.varJson.displayBatchSize.toString());
        // this.checkMultiBranchStatus();

        // Customizable Table
        this.tableSetting.keys = this.enquirySettings;
        if (this._tablePreferencesService.getTablePreferences(this.tableSetting.tableDetails.key) != null) {
            this.displayKeys = this._tablePreferencesService.getTablePreferences(this.tableSetting.tableDetails.key);
            this.tableSetting.keys = this.displayKeys;
            if (this.displayKeys.length == 0) {
                this.setDefaultValues();
            }
        }
        else {
            this.setDefaultValues();
        }

        if (sessionStorage.getItem('permissions')) {
            let permissions = JSON.parse(sessionStorage.getItem('permissions'));
            if (permissions.includes('714')) { ////update payment and manage cheque,pdc  hide download
                this.varJson.showDownloadSummary = false;
            }
            if (permissions.includes('712')) { // show download summery
                this.varJson.showDownloadSummary = true;
            }
        }

        if (sessionStorage.getItem('permissions') == undefined ||
            sessionStorage.getItem('permissions') == ''
            || sessionStorage.getItem('username') == 'admin') {
            this.varJson.showDownloadSummary = true;
        }
        this.checkRoleAccess();
    }

    checkRoleAccess() {
        if (sessionStorage.getItem('downloadEnquiryReportAccess') == 'true') {
            this.downloadEnquiryReportAccess = true;
        }
    }

    checkBulkUploadRole() {
        if (sessionStorage.getItem('userType') != '0' || sessionStorage.getItem('username') != 'admin') {
            if (sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null) {
                let permissions = JSON.parse(sessionStorage.getItem('permissions'));
                this.showBulkUpload = permissions.includes('728') ? true : false;//sms visiblity
            }
        } else {
            this.showBulkUpload = true;
        }
    }

    // get custome filter component details if is_searchable is applicable --laxmi
    getSearchableCustomeComponents(array) {

        this.filterCustomComponent = array.filter((object) => object.is_searchable == 'Y');
    }

    timeChanges(ev) {
        let obj: any = {};
        let time = ev.split(' ');
        obj.hour = time[0];
        obj.meridian = time[1];
        return obj;
    }

    getDateFormated(value, format) {
        if (value) {
            return moment(value).format(format);
        }
        return moment().format(format);

    }

    isEnquiryAdministrator() {
        if (this._commService.checkUserIsAdmin()) {
            this.flagJSON.isEnquiryAdmin = true;
        } else {
            if (this._commService.checkUserHadPermission('115')) {
                this.flagJSON.isEnquiryAdmin = true;
            } else {
                this.flagJSON.isEnquiryAdmin = false;
            }
        }
    }

    /* Load Table data with respect to the institute data provided */
    loadTableDatatoSource(obj) {
        this.auth.showLoader();
        this.varJson.fetchingDataMessage = 1;
        this.flagJSON.isAllSelected = false;
        this.sourceEnquiry = [];
        this.closeEnquiryFullDetails();
        this.flagJSON.isSideBar = false;
        let enquiryDataSource: any;
        /* start index of object passed is zero then create pagination */
        if (obj.start_index == 0) {
            return this.enquire.getAllEnquiry(obj).subscribe(
                data => {
                    if (data.length != 0) {
                        enquiryDataSource = data;
                        this.varJson.totalEnquiry = data[0].totalcount;
                        this._commService.contactNoPatternChange(data);
                        for (let i = 0; i < data.length; i++) {
                            data[i].updateDate = moment(enquiryDataSource[i].updateDate).format("DD-MMM-YY hh:mm A");
                        }
                        this.sourceEnquiry = data;
                        this.cd.markForCheck();
                        return this.sourceEnquiry;
                    }
                    else {
                        this.varJson.fetchingDataMessage = 2;
                        this.showErrorMessage('info', 'No Records Found', 'We did not find any enquiry for the specified query');
                        this.varJson.totalEnquiry = data.length;
                        this.cd.markForCheck();
                    }
                },
                err => {
                    this.auth.hideLoader();
                    this.varJson.fetchingDataMessage = 2;
                    this.showErrorMessage(this.messageService.toastTypes.error, 'Unable To Connect To Server', 'Please check your internet connection or contact proctur support if the issue persist');
                    this.varJson.totalEnquiry = 0;
                    this.cd.markForCheck();
                });
        }
        else {
            return this.enquire.getAllEnquiry(obj).subscribe(
                data => {
                    this.auth.hideLoader();
                    if (data.length != 0) {
                        this._commService.contactNoPatternChange(data);
                        this.sourceEnquiry = data;
                        this.cd.markForCheck();
                    }
                    else {
                        this.varJson.fetchingDataMessage = 2;
                        this.showErrorMessage('info', 'No Records Found', 'We did not find any enquiry for the specified query');
                        this.varJson.totalEnquiry = 0;
                        this.cd.markForCheck();
                    }
                },
                err => {
                    this.auth.hideLoader();
                    this.varJson.varJson.fetchingDataMessage = 2;
                    this.showErrorMessage(this.messageService.toastTypes.error, 'Unable To Connect To Server', 'Please check your internet connection or contact proctur support if the issue persist');
                    this.varJson.totalEnquiry = 0;
                    this.cd.markForCheck();
                });
        }

    }
    /* Function to fetch prefill data for advanced filter */
    FetchEnquiryPrefilledData() {
      this.auth.showLoader();
      /* Status */
      const getEnqStatus = () => {
        return new Promise((resolve, reject) => {
          this.prefill.getEnqStatus().subscribe(data => { this.enqstatus = data;  resolve()});
        })
      }
        /* Campaigns */
      const getCampaignsList = () => {
        return new Promise((resolve, reject) => {
          this.prefill.getCampaignsList().subscribe((data: any) => { this.campaignList = data; resolve()});
        })
      }
      /* Priority */
      const getEnqPriority = () => {
        return new Promise((resolve, reject) => {
          this.prefill.getEnqPriority().subscribe(data => { this.enqPriority = data; resolve()});
        })
      }
      /* FollowUp Type */
      const getFollowupType = () => {
        return new Promise((resolve, reject) => {
          this.prefill.getFollowupType().subscribe(data => { this.enqFollowType = data; resolve()});
        })
      }
      /* Assign To */
      const getAssignTo = () => {
        return new Promise((resolve, reject) => {
          this.prefill.getAssignTo().subscribe(data => { this.enqAssignTo = data; resolve()});
        })
      }
      /* Sources */
      const getLeadSource = () => {
        return new Promise((resolve, reject) => {
          this.prefill.getLeadSource().subscribe(data => { this.sources = data; resolve() });
        })
      }
      /* Schools */
      const getSchoolDetails = () => {
        return new Promise((resolve, reject) => {
          this.prefill.getSchoolDetails().subscribe(data => { this.schools = data; resolve() });
        })
      }
      /* Standard */
      const getEnqStardards = () => {
        return new Promise((resolve, reject) => {
          this.prefill.getEnqStardards().subscribe(data => { this.enqStd = data; resolve()});
        })
      }
      /* Slots */
      const getEnquirySlots = () => {
        return new Promise((resolve, reject) => {
          if (this.flagJSON.isProfessional) {
             this.prefill.getEnquirySlots().subscribe((res: any) => { res.forEach(el => {
               let obj = { label: el.slot_name, value: el, status: false };
                this.slots.push(obj);
               });
             })
          }
          resolve();
        })
      }
      /* Payment Modes */
      const fetchPaymentModes = () => {
        return new Promise((resolve, reject) => {
            this.prefill.fetchPaymentModes().subscribe((data: any) => { this.paymentMode = data; resolve() });
        })
      }
      // City Area Fetch //
      const getCityList = () => {
        return new Promise((resolve, reject) => {
          this.prefill.getCityList().subscribe(res => { this.cityList = res; resolve()});
        })
      }
      // Closing Reason //
      const getClosingReasons = () => {
        return new Promise((resolve, reject) => {
          this.prefill.getClosingReasons().subscribe(res => { this.closingReasonDataSource = res; resolve()})
        })
      }

      const promises = [];
      let arr = [getEnqStatus(),getCampaignsList(),getEnqPriority(),getFollowupType(), getAssignTo(), getLeadSource(), getSchoolDetails(), getEnqStardards(), getEnquirySlots(), fetchPaymentModes(), getCityList(), getClosingReasons() ];

      for(let i = 0; i < arr.length; i++ ){
         promises.push(arr[i]);
      }


      Promise.all(promises)
      .then(response => {

        /* Custom Components */
        this.fetchCustomComponentData();

        /* Master Course / Standard */
        if (!this.flagJSON.isProfessional) { this.prefill.getMasterCourseData().subscribe((res: any) => { this.masterCourseData = res; }) };

        //  Referred By //
        this.fetchReferredByData();

        this.checkMultiBranchStatus();

        this.preFill = true;
        this.auth.hideLoader()
      })

    }

    fetchReferredByData() {
        let url = '/api/v1/enquiry_campaign/master/lead_referred_by/' + sessionStorage.getItem('institute_id') + '/all'
        // this.auth.showLoader();
        this.httpService.getData(url).subscribe(
            (res: any) => {
              // this.auth.hideLoader();
              this.referredByData = res;
            },
            err => {
              this.auth.hideLoader();
              console.log(err);
            }
        )

    }

    fetchMasterCourseDetails() {
        this.prefill.getMasterCourseData().subscribe((res: any) => { this.masterCourseData = res; });
    }
    //Added By Ashwini Gupta For Editior Email
    editorConf = {
        height: 150,
        menubar: false,
        branding: false,
        plugins: [
            'preview anchor',
            'visualblocks code ',
            'insertdatetime  table paste code  wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent'
    };
    //End
    fetchCustomComponentData() {
        this.customComponents = [];
        this.prefill.fetchCustomComponentEmpty()
            .subscribe(
                data => {
                    if (data != null) {
                        data.forEach(el => {
                            /* General template for custom component */
                            let obj = {};
                            switch (el.type) {
                                case 2: { /* Type +> Checkbox */
                                    obj = { data: el, id: el.component_id, is_required: el.is_required, is_searchable: el.is_searchable, label: el.label, prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')), selected: [], selectedString: '', type: el.type, value: el.enq_custom_value == "" ? false : true, };
                                    break;
                                }
                                case 3: {        /* Type +> Select */
                                    obj = { data: el, id: el.component_id, is_required: el.is_required, is_searchable: el.is_searchable, label: el.label, prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')), selected: [], selectedString: "", type: el.type, value: el.enq_custom_value };
                                    break;
                                }
                                case 4: {   /* Type +> Multiselect */
                                    obj = { data: el, id: el.component_id, is_required: el.is_required, is_searchable: el.is_searchable, label: el.label, prefilled_data: this.createPrefilledDataType4(el.prefilled_data.split(','), el.enq_custom_value.split(','), el.defaultValue.split(',')), selected: [], selectedString: '', type: el.type, value: el.enq_custom_value };
                                    break;
                                }
                                default:
                                    /* Type +> Input/Date */
                                    // if (el.type != 2 && el.type != 4 && el.type != 3) {
                                    obj = { data: el, id: el.component_id, is_required: el.is_required, is_searchable: el.is_searchable, label: el.label, prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')), selected: [], selectedString: '', type: el.type, value: el.enq_custom_value };
                                // }
                            }
                            this.customComponents.push(obj);
                        });
                    }
                    this.getSearchableCustomeComponents(this.customComponents);//
                    this.emptyCustomComponent = this.componentListObject;
                });
    }

    createPrefilledDataType4(dataArr: any[], selected: any[], def: any[]): any[] {
        let customPrefilled: any[] = [];
        if (selected.length != 0 && (!this._commService.valueCheck(selected[0]))) {
            dataArr.forEach(el => { let obj = { data: el, checked: selected.includes(el) }; customPrefilled.push(obj); });
        }
        else {
            dataArr.forEach(el => { let obj = { data: el, checked: def.indexOf(el) != -1 }; customPrefilled.push(obj); });
        }

        return customPrefilled;
    }

    /* Custom Compoenent array creater */
    createPrefilledData(dataArr: any[]): any[] {
        let customPrefilled: any[] = [];
        dataArr.forEach(el => {
            let obj = {
                displayName: el.toLowerCase(),// this is display label
                data: el, //// this is key for select dropdwon
                checked: false
            };
            customPrefilled.push(obj);
        });
        return customPrefilled;
    }

    /* if custom component is of type multielect then toggle the visibility of the dropdowm */
    multiselectVisible(elid) {
        let targetid = elid + "multi";
        if (elid != null && elid != '') {
            if (document.getElementById(targetid).classList.contains('hide')) { document.getElementById(targetid).classList.remove('hide'); }
            else { document.getElementById(targetid).classList.add('hide'); }
        }
    }

    /* if custom component is of type multielect then update the selected or unselected data*/
    updateMultiSelect(data, id) {
        this.filterCustomComponent.forEach(el => {
            if (el.id == id) {
                let x = []
                let y = el.prefilled_data;
                y.forEach(e => { if (e.checked) { x.push(e.data) } });
                el.selected = x;
                el.selectedString = el.selected.join(',');
                el.value = el.selectedString;
            }
        });
    }

    /* Function to search data on smart table */
    searchDatabase() {
        this.clearFilterAdvanced();
        this.statusString = [];
        this.statFilter = [{ value: 'All', prop: 'All', checked: true, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false }, { value: 'Open', prop: 'Open', checked: false, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false }, { value: 'Registered', prop: 'Registered', checked: false, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }];
        this.indexJSON = [];
        this.instituteData.filtered_statuses = this.statusString.join(',');
        this.varJson.PageIndex = 1;

        /* Searchbar empty */
        if (this._commService.valueCheck(this.varJson.searchBarData)) {
            this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
            this.loadTableDatatoSource(this.instituteData);
        }

        /* Searchbar filled */
        else if (!this._commService.valueCheck(this.varJson.searchBarData)) {
            if (isNaN(this.varJson.searchBarData)) {
                this.instituteData = { name: this.varJson.searchBarData, phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                this.loadTableDatatoSource(this.instituteData);
            }
            /* In Case of Number */
            else {
                /* mobile number detected */
                if (this.validateNumber(this.varJson.searchBarData)) {
                    this.instituteData = { name: "", phone: this.varJson.searchBarData, email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.loadTableDatatoSource(this.instituteData);
                }

                /* send data as enquiry number */
                else {
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: this.varJson.searchBarData, commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.loadTableDatatoSource(this.instituteData);

                }
            }
        }
    }

    /* regex validation for name atleast one word required */
    validateString(data: string) {
        return /^[a-zA-Z ]{1,40}$/.test(data);
    }

    /* Custom validation suited only for indian mobile numbers*/
    validateNumber(data) {
        return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[123456789]\d{9}$/.test(data);;
    }

    /* Function to open advanced filter */
    openAdFilter() {
        //document.getElementById('middleMainForEnquiryList').classList.add('hasFilter')
        //console.log(this.advancedFilterForm);
        //document.getElementById('middleMainForEnquiryList').classList.add('hasFilter');
        if(!this.preFill){
          this.FetchEnquiryPrefilledData();
        }
        this.closeEnquiryFullDetails();
        this.flagJSON.isSideBar = false;
        let classArray = ['adFilterOpen', 'adFilterExitVisible', 'qfilt', 'customizableTableSection'];
        this.addHideClass(classArray);
        let removeClassNames = ['adFilterExit', 'advanced-filter-section'];
        this.removeHideClass(removeClassNames);
        this.fetchDataForCountryDetails();
    }

    addHideClass(classArray) {
        classArray.forEach(function (className) {
            document.getElementById(className).classList.add('hide');
        });
    }

    removeHideClass(removeClassNames) {
        removeClassNames.forEach(function (className) {
            document.getElementById(className).classList.remove('hide');
        });
    }

    /** set notification type */
    sendNotificationType(type) {
        this.flagJSON.notificationType = type;
    }

    showSendGridData(type) {
        this.flagJSON.notificationType = type;
        const url = `/api/v1/alerts/config/sendGrid/emailTemplate/${sessionStorage.getItem('institute_id')}`;
        this.auth.showLoader();
        this.emailGridData = [];
        this.httpService.getData(url).subscribe(
            (res: any) => {
                this.auth.hideLoader();
                this.emailGridData = res.result;
                this.cd.markForCheck();
            },
            err => {
                this.auth.hideLoader();
                console.log(err);
            }
        )
        this.emailGridData.forEach(element => {
            if (element.template_updated_date != null || element.template_updated_date != '') {
                element.template_updated_date = moment(element.template_updated_date).format('DD-MMM-YYYY');
            }
        });
    }

    opEmailGridSelected(object, i) {
        this.selectedTableRow = i;
        this.EmailGridSelectedObject = object;
    }

    viewThumbnailUrl(url) {
        this.viewPopUp = true;
        this.EmailThumbnailUrl = url;
    }

    closeViewPopUp() {
        this.viewPopUp = false;
    }

    sendEmailGrid() {
        if (this.EmailGridSelectedObject != null || this.EmailGridSelectedObject != undefined) {
            const url = `/api/v1/enquiry_manager/sendEmail/${sessionStorage.getItem('institute_id')}`;
            const obj = {
                baseIds: this.selectedRowGroup,
                sendGridTemplateId: this.EmailGridSelectedObject.template_id
            }
            this.auth.showLoader();
            this.httpService.postData(url, obj).subscribe(
                (res: any) => {
                    this.auth.hideLoader();
                    this.showErrorMessage(this.messageService.toastTypes.success, '', res.message);
                    this.cd.markForCheck();
                },
                err => {
                    this.auth.hideLoader();
                    console.log(err);
                }
            )
        } else {
            this.showErrorMessage(this.messageService.toastTypes.error, '', 'Please select email template');
        }
        // this.httpService.postData(url,)
    }

    /* Function to close advanced filter */
    closeAdFilter() {
        let hideClassNames = ['adFilterExitVisible', 'qfilt', 'adFilterOpen', 'customizableTableSection'];
        this.removeHideClass(hideClassNames);
        let removeHideClassNames = ['advanced-filter-section', 'adFilterExit'];
        this.addHideClass(removeHideClassNames);
    }

    updateRegisterEnquiry() {
        this.flagJSON.isConvertToStudent = true;
        this.updateFormData.follow_type = "Walkin";
        this.updateFormData.walkin_followUpDate = this.getDateFormated(new Date(), 'YYYY-MM-DD');
        this.updateFormData.walkin_followUpTime = this.getFollowupTime();
        this.pushUpdatedEnquiry();
    }

    getFollowupTime(): any {
        let hour: any = parseInt(moment(new Date()).format('hh'));
        let min: any = moment(new Date()).format('mm');
        let mer: any = moment(new Date()).format('A');

        if (parseInt(min) % 5 != 0) {
            min = Math.ceil(parseInt(min) / 5) * 5;
            if (min >= 60) {
                min = '00';
                if (hour == 12) {
                    hour = '1';
                    if (mer == 'AM') {
                        mer = 'PM';
                    }
                    else {
                        mer = 'AM';
                    }
                }
                else {
                    hour += 1;
                    let formattedNumber = ("0" + hour).slice(-2);
                    hour = formattedNumber.toString();
                }
            }
        }

        return (hour + ":" + min + " " + mer);
    }

    /* Push the updated enquiry to server */
    pushUpdatedEnquiry() {
        if (this.validateTime()) {
            if (this.updateFormData.followUpDate != "Invalid date") {
                this.auth.showLoader();
                this.updateFormData.comment = this.updateFormData.comment;
                this.updateFormData.follow_type = this.getFollowUpReverse(this.updateFormData.follow_type);
                this.updateFormData.priority = this.getPriorityReverse(this.updateFormData.priority);

                let followupdateTime: string = "";

                if (!this._commService.valueCheck(this.timeJson.hour)) {
                    let time = this.timeChanges(this.timeJson.hour);
                    let followUpTime = time.hour + ":" + this.timeJson.minute + " " + time.meridian;
                    followupdateTime = this.getDateFormated(this.updateFormData.followUpDate, 'DD-MMM-YY') + " " + followUpTime;
                    this.updateFormData.followUpTime = followUpTime;
                }

                followupdateTime = this.getDateFormated(this.updateFormData.followUpDate, 'DD-MMM-YY');

                if (this.flagJSON.isConvertToStudent === false) {
                    if (!this._commService.valueCheck(this.updateFormData.walkin_followUpTime.hour)) {
                        let time = this.timeChanges(this.updateFormData.walkin_followUpTime.hour);
                        let walkin_followUpTime = time.hour + ":" + this.updateFormData.walkin_followUpTime.minute + " " + time.meridian;
                        this.updateFormData.walkin_followUpTime = walkin_followUpTime;
                    }
                    else {
                        this.updateFormData.walkin_followUpTime = "";
                    }
                    if (this._commService.valueCheck(this.updateFormData.walkin_followUpDate)) {
                        let walkinfollowUpDate = this.getDateFormated(this.updateFormData.walkin_followUpDate, 'YYYY-MM-DD')
                        this.updateFormData.walkin_followUpDate = walkinfollowUpDate;
                    }
                    else {
                        this.updateFormData.walkin_followUpDate = "";
                    }
                }

                if (this.updateFormData.is_follow_up_time_notification) {
                    this.updateFormData.is_follow_up_time_notification = 1;
                }
                else if (!this.updateFormData.is_follow_up_time_notification) {
                    this.updateFormData.is_follow_up_time_notification = 0;
                }

                if (this.updateFormData.followUpDate != "Invalid date") {
                    this.updateFormData.followUpDate = this.getDateFormated(this.updateFormData.followUpDate, 'YYYY-MM-DD');
                    this.postdata.updateEnquiryForm(this.selectedRow.institute_enquiry_id, this.updateFormData).subscribe(
                        res => {
                            this.auth.hideLoader();
                            this.showErrorMessage(this.messageService.toastTypes.success, this.messageService.object.enquiryMessages.update, 'Your enquiry has been successfully submitted');
                            if (this.flagJSON.isConvertToStudent) {
                                let obj = {
                                    name: this.selectedRow.name,
                                    phone: this.selectedRow.phone,
                                    email: this.selectedRow.email,
                                    gender: this.selectedRow.gender,
                                    dob: this.getDateFormated(this.selectedRow.dob, "YYYY-MM-DD"),
                                    parent_email: this.selectedRow.parent_email,
                                    parent_name: this.selectedRow.parent_name,
                                    parent_phone: this.selectedRow.parent_phone,
                                    enquiry_id: this.selectedRow.institute_enquiry_id,
                                    institute_enquiry_id: this.selectedRow.institute_enquiry_id
                                }
                                sessionStorage.setItem('studentPrefill', JSON.stringify(obj));
                                this.router.navigate(['/view/student/add']);
                            }
                            else {
                                this.closePopup();
                                this.loadTableDatatoSource(this.instituteData);
                            }
                        },
                        err => {
                            this.auth.hideLoader();
                            this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.enquiryMessages.failUpdate, 'There was an error processing your request');
                        }
                    )
                }
                else {
                    this.auth.hideLoader();
                    this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.dateTimeMessages.invalideDateTime, 'Please select a valid date time for follow up');
                }

            }
            else {
                this.auth.hideLoader();

                this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.dateTimeMessages.invalideDateTime, 'Please select a valid date time for follow up');
            }
        }
        else {

            this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.dateTimeMessages.invalideDateTime, "Please enter a valid date time");
        }
    }



    validateTime(): boolean {
        /* some time selected by user or nothing*/
        let check = false;

        if ((this.timeJson.hour != '' && this.timeJson.minute != '') || (this.timeJson.hour == '' && this.timeJson.minute == '')) {
            check = true;
        }
        else {
            return check;
        }

        if ((this.updateFormData.walkin_followUpTime.hour != "" && this.updateFormData.walkin_followUpTime.minute != "") || (this.updateFormData.walkin_followUpTime.hour == "" && this.updateFormData.walkin_followUpTime.minute == "")) {
            check = true;
        }
        else {
            check = false;
        }
        return check;
    }

    /* update the enquiry id for enquiry update pop up */
    updateStatusForEnquiryUpdate(val) {
        this.enqstatus.forEach(el => { if (el.data_value == val) { this.updateFormData.status = el.data_key; } });
    }

    /* Delete Enquiry  */
    deleteEnquiry() {
        this.auth.showLoader();
        this.postdata.deleteEnquiryById(this.selectedRow.institute_enquiry_id).subscribe(
            res => {
                this.auth.hideLoader();
                this.showErrorMessage('success', "Enquiry Deleted", "Your enquiry has been deleted");
                this.closePopup();
                this.cd.markForCheck();
                this.loadTableDatatoSource(this.instituteData);
            },
            err => {
                this.auth.hideLoader();
                this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.enquiryMessages.failDelete, err.error.message);
                this.closePopup();
                this.loadTableDatatoSource(this.instituteData);
            }
        )
    }

    /* Make Registration Payment Data update */
    registerPayment() {
        this.auth.showLoader();
        this.registrationForm.institute_enquiry_id = this.selectedRow.institute_enquiry_id.toString();
        this.registrationForm.paymentDate = this.getDateFormated(this.registrationForm.paymentDate, 'YYYY-MM-DD');

        this.postdata.updateRegisterationPayment(this.registrationForm).subscribe(
            (res: any) => {
                this.auth.hideLoader();
                this.showErrorMessage(this.messageService.toastTypes.success, 'Registration Fee Updated', '');
                this.cd.markForCheck();
                this.selectedRow.invoice_no = res.otherDetails.invoice_no;
                this.flagJSON.hasReceipt = true;
                this.registrationForm = { institute_enquiry_id: "", amount: "", paymentDate: "", paymentMode: "", reference: "", };
                this.cd.markForCheck();
            },
            err => {
                this.auth.hideLoader();
                this.showErrorMessage(this.messageService.toastTypes.error, '', 'There was an error processing your request');
            }
        );
    }

    /* Service to fetch sms records from server and update table Added condtion for sms and email type ashwini gupta*/
    smsServicesInvoked() {
        this.auth.showLoader();
        /* store the data from server and update table */
        this.cd.markForCheck();
        this.enquire.fetchAllSms().subscribe(
            (data: any) => {
                this.auth.hideLoader();
                this.isSendGridEnable = data[0].is_sendGrid_enable;
                this.cd.markForCheck();
                this.smsSourceApproved = [];
                this.smsSourceOpen = [];
                this.emailSourceApproved = [];
                this.emailSourceOpen = [];
                this.varJson.smsDataLength = data.length;
                this.varJson.availableSMS = data[0].institute_sms_quota_available
                this.cd.markForCheck();
                data.forEach(el => {
                    if (el.source === "SMS") {
                        if (el.status == 1) {
                            this.cd.markForCheck();
                            this.smsSourceApproved.push(el);
                        }
                        else {
                            this.cd.markForCheck();
                            this.smsSourceOpen.push(el);
                        }
                    }
                    else if (el.source === "Email") {
                        if (el.status == 1) {
                            this.cd.markForCheck();
                            this.emailSourceApproved.push(el);
                        }
                        else {
                            this.cd.markForCheck();
                            this.emailSourceOpen.push(el);
                        }
                    }

                })
                this.switchSmsTab(this.varJson.smsShowType);
            },
            err => {
                this.auth.hideLoader();
                this.showErrorMessage(this.messageService.toastTypes.error, 'Error loading SMS', 'Please check your internet connection or refresh');
            }
        );
    }

    switchSmsTab(id) {
        this.varJson.smsShowType = id;
        switch (id) {
            case 'approvedSms': {
                this.flagJSON.isApprovedTab = true;
                this.flagJSON.isOpenTab = false;
                this.flagJSON.smsBtnToggle = false;
                this.flagJSON.isAllSelected = false;
                this.selectedSMS = { message: "", message_id: "", sms_type: "", status: "", statusValue: "", date: "", feature_type: "", institute_name: "", };
                if (document.getElementById(id).classList) {
                    if (!document.getElementById(id).classList.contains('active')) {
                        document.getElementById(id).classList.add('active');
                        document.getElementById('openSms').classList.remove('active');
                    }
                }
            }
                break;
            case 'openSms': {
                this.flagJSON.isApprovedTab = false;
                this.flagJSON.isOpenTab = true;
                this.flagJSON.smsBtnToggle = false;
                this.flagJSON.isAllSelected = true;
                this.selectedSMS = { message: "", message_id: "", sms_type: "", status: "", statusValue: "", date: "", feature_type: "", institute_name: "", };
                if (document.getElementById(id).classList) {
                    if (!document.getElementById(id).classList.contains('active')) {
                        document.getElementById(id).classList.add('active');
                        document.getElementById('approvedSms').classList.remove('active');
                    }
                }
            }
                break;
            default:
        }
    }

    hasUnicode(str) {
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127) return true;
        }
        return false;
    }

    countNumberOfMessage() {
        let uniCodeFlag = this.hasUnicode(this.newSmsString.data);
        let charLimit = 160;
        if (uniCodeFlag) {
            charLimit = 70
        }
        if (this.newSmsString.data.length == 0) {
            this.messageCount = 0;
        }
        else if (this.newSmsString.data.length > 0 && this.newSmsString.data.length <= charLimit) {
            this.messageCount = 1;
        }
        else {
            let count = Math.ceil(this.newSmsString.data.length / charLimit);
            console.log(count);
            this.messageCount = count;
        }
    }
    /* push new sms template to server and update the table */
    // changes done by Ashwini Kumar Gupta for SMS and email type of message
    addNewSmsTemplate() {
        if (this.flagJSON.notificationType == 'SMS') {
            if (this.newSmsString.data.trim() == '') {
                this.showErrorMessage(this.messageService.toastTypes.error, '', 'Please enter a valid text message');
            }
            else {
                let sms = { feature_type: 2, message: this.newSmsString.data, sms_type: "Transactional", source: "SMS" };
                this.auth.showLoader();
                this.postdata.addNewSmsTemplate(sms).subscribe(
                    (res: any) => {
                        this.auth.hideLoader();
                        if (res.statusCode == 200) {
                            this.showErrorMessage(this.messageService.toastTypes.success, this.messageService.object.SMSMessages.addNewSMS, '');
                            this.cd.markForCheck();
                            this.newSmsString.data = '';
                            this.cd.markForCheck();
                            this.enquire.fetchAllSms().subscribe(
                                (data: any) => {
                                    this.cd.markForCheck();
                                    this.smsSourceApproved = [];
                                    this.smsSourceOpen = [];
                                    this.varJson.smsDataLength = data.length;
                                    this.varJson.availableSMS = data[0].institute_sms_quota_available
                                    this.cd.markForCheck();
                                    data.forEach(el => {
                                        if (el.source === "SMS") {
                                            if (el.status == 1) {
                                                this.cd.markForCheck();
                                                this.smsSourceApproved.push(el);
                                            }
                                            else {
                                                this.cd.markForCheck();
                                                this.smsSourceOpen.push(el);
                                            }
                                        }

                                    })
                                },
                                err => {
                                    this.showErrorMessage('error', '', err.error.message);
                                }
                            );
                            this.cd.markForCheck();
                        }
                    },
                    err => {
                        this.auth.hideLoader();
                        this.showErrorMessage('error', '', err.error.message);
                    }
                )
            }
        }
        else if (this.flagJSON.notificationType == 'Email') {
            if (this.newSmsString.data.trim() == '') {
                this.showErrorMessage(this.messageService.toastTypes.error, '', 'Please enter a valid text message');
            }
            else {
                let email = { feature_type: 2, message: this.newSmsString.data, sms_type: "Transactional", source: "Email" };
                this.auth.showLoader();
                this.postdata.addNewSmsTemplate(email).subscribe(
                    (res: any) => {
                        this.auth.hideLoader();
                        if (res.statusCode == 200) {
                            this.showErrorMessage(this.messageService.toastTypes.success, this.messageService.object.SMSMessages.addNewSMS, '');
                            this.cd.markForCheck();
                            this.newSmsString.data = '';
                            this.cd.markForCheck();
                            this.enquire.fetchAllSms().subscribe(
                                (data: any) => {
                                    this.cd.markForCheck();
                                    this.emailSourceApproved = [];
                                    this.emailSourceOpen = [];
                                    this.varJson.smsDataLength = data.length;
                                    this.varJson.availableSMS = data[0].institute_sms_quota_available
                                    this.cd.markForCheck();
                                    data.forEach(el => {
                                        if (el.source === "Email") {
                                            if (el.status == 1) {
                                                this.cd.markForCheck();
                                                this.emailSourceApproved.push(el);
                                            }
                                            else {
                                                this.cd.markForCheck();
                                                this.emailSourceOpen.push(el);
                                            }
                                        }
                                    })
                                },
                                err => {
                                    this.showErrorMessage('error', '', err.error.message);
                                }
                            );
                            this.cd.markForCheck();
                        }
                    },
                    err => {
                        this.auth.hideLoader();
                        this.showErrorMessage('error', '', err.error.message);
                    }
                )
            }
        }

        document.getElementById('sms-toggler-icon').innerHTML = "+";
        this.newSmsString.data = "";
        this.flagJSON.isMessageAddOpen = false;

    }

    /* push new sms template to server and update the table */
    addNewEmailTemplate() {
        if (this.selectedSMS.message.trim() == '') {
            this.showErrorMessage(this.messageService.toastTypes.error, '', 'Please enter a valid text message');
        }
        if (this.emailSubject.trim() == '') {
            this.showErrorMessage(this.messageService.toastTypes.error, '', 'Please enter the subject');
        }
        else {
            let messageId = [];
            messageId.push((this.selectedSMS.message_id).toString());
            let email = {
                "baseIds": this.selectedRowGroup,
                "messageArray": messageId,
                "subject": this.emailSubject
            }
            this.auth.showLoader();
            this.cd.markForCheck();
            this.postdata.addNewEmailTemplate(email).subscribe(
                (res: any) => {
                    this.auth.hideLoader();
                    this.cd.markForCheck();
                    if (res.statusCode == 200) {
                        this.showErrorMessage(this.messageService.toastTypes.success, res.message, '');
                        this.cd.markForCheck();
                        this.emailSubject = '';
                        this.cd.markForCheck();
                        this.enquire.fetchAllSms().subscribe(
                            (data: any) => {
                                this.cd.markForCheck();
                                this.smsSourceApproved = [];
                                this.smsSourceOpen = [];
                                this.varJson.smsDataLength = data.length;
                                this.varJson.availableSMS = data[0].institute_sms_quota_available
                                this.cd.markForCheck();
                                data.forEach(el => {
                                    if (el.status == 1) {
                                        this.cd.markForCheck();
                                        this.smsSourceApproved.push(el);
                                    }
                                    else {
                                        this.cd.markForCheck();
                                        this.smsSourceOpen.push(el);
                                    }
                                })
                            },
                            err => {
                                this.showErrorMessage('error', 'Error', err.error.message);
                            }
                        );
                        this.cd.markForCheck();
                    }
                },
                err => {
                    this.auth.hideLoader();
                    this.cd.markForCheck();
                    this.showErrorMessage('error', 'Error', 'Notification sender id not approved. Please contact to support team.');
                }
            )
        }
    }

    /* Stores data for row user has clicked of selected */
    appSmsSelected(row, id) {
        this.cd.markForCheck();
        this.selectedSMS = row;
        // document.getElementById('appradiosms' + id).click();
    }

    /* Stores data for row user has clicked of selected */
    opSmsSelected(row, id) {
        this.cd.markForCheck();
        this.selectedSMS = row;
        // document.getElementById('opradiosms' + id).click();
    }

    /* toggle visibility for add new sms DIV */
    addNewMessage() {
        let content = document.getElementById('sms-toggler-icon').innerHTML;
        if (content == "-") {
            document.getElementById('sms-toggler-icon').innerHTML = "+";
            this.newSmsString.data = "";
            this.flagJSON.isMessageAddOpen = false;
        }
        else if (content == "+") {
            document.getElementById('sms-toggler-icon').innerHTML = "-";
            this.flagJSON.isMessageAddOpen = true;
        }
    }

    /* SMS button visibility */
    editSms() {
        this.flagJSON.smsBtnToggle = true;
    }

    /* Sms edit mode cancel */
    cancelSmsEdit() {
        this.flagJSON.isApprovedTab = false;
        this.flagJSON.isOpenTab = false;
        this.flagJSON.smsBtnToggle = false;
        this.flagJSON.isAllSelected = false;
        this.flagJSON.smsBtnToggle = false;
        this.smsServicesInvoked();
    }

    countNumberOfMessageForEdit() {
        let uniCodeFlag = this.hasUnicode(this.selectedSMS.message);
        let charLimit = 160;
        if (uniCodeFlag) {
            charLimit = 70
        }
        if (this.selectedSMS.message.length == 0) {
            this.messageCountForEdit = 0;
        }
        else if (this.selectedSMS.message.length > 0 && this.selectedSMS.message.length <= charLimit) {
            this.messageCountForEdit = 1;
        }
        else {
            let count = Math.ceil(this.selectedSMS.message.length / charLimit);
            console.log(count);
            this.messageCountForEdit = count;
        }
    }

    /* Update the sms template */
    saveEditedSms() {
        let data = { message: this.selectedSMS.message }
        this.auth.showLoader();
        this.postdata.saveEditedSms(this.selectedSMS.message_id, data).subscribe(
            res => {
                this.auth.hideLoader();
                //"SMS Template saved"
                this.showErrorMessage(this.messageService.toastTypes.success, this.messageService.object.SMSMessages.saveSMS, 'Your sms has been sent for approval');
                this.cancelSmsEdit();
            },
            err => {
                this.auth.hideLoader();
                this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.SMSMessages.failSMS, 'Please check your internet connection or try again later')
            }
        )
        document.getElementByID("sms-content").value = "";
        document.getElementByID("email-content").value = "";
    }

    /* Approved SMS template send */
    sendSmsTemplate() {
        if (this.selectedSMS.message != null && this.selectedSMS.message != '') {
            /* Denied */

            switch (this.selectedSMS.statusValue) {
                case 'Open': {
                    this.showErrorMessage(this.messageService.toastTypes.warning, '', 'Your sms template is pending approval, kindly contact support');
                    this.cd.markForCheck();
                    break;
                }
                case 'Rejected': {
                    this.showErrorMessage(this.messageService.toastTypes.error, '', 'Your sms template has been rejected, kindly contact support');
                    this.cd.markForCheck();
                    break;
                }
                case 'Approved': {
                    /* Send Multi SMS */
                    if (this.flagJSON.isMultiSms) {
                        let messageId = [];
                        messageId.push((this.selectedSMS.message_id).toString());
                        this.varJson.sendSmsFormData.baseIds = this.selectedRowGroup;
                        this.varJson.sendSmsFormData.messageArray = messageId;
                        this.cd.markForCheck();
                        this.auth.showLoader();
                        this.postdata.sendSmsToEnquirer(this.varJson.sendSmsFormData).subscribe(
                            res => {
                                this.auth.hideLoader();
                                this.showErrorMessage(this.messageService.toastTypes.success, '', "SMS send successfully");
                                this.cd.markForCheck();
                            },
                            err => {
                                this.auth.hideLoader();
                                this.showErrorMessage(this.messageService.toastTypes.error, '', "SMS notification cannot be sent due to any of following reasons: SMS setting is not enabled for institute. SMS Quota is insufficient for institute. No Users(Contacts) found for notify");
                                this.cd.markForCheck();
                            }
                        )

                    }
                    /* Send Single SMS */
                    else {
                        let userId = [];
                        userId.push((this.selectedRow.institute_enquiry_id).toString());
                        let messageId = [];
                        messageId.push((this.selectedSMS.message_id).toString());
                        this.varJson.sendSmsFormData.baseIds = userId;
                        this.varJson.sendSmsFormData.messageArray = messageId;
                        this.postdata.sendSmsToEnquirer(this.varJson.sendSmsFormData).subscribe(
                            res => {
                                this.showErrorMessage(this.messageService.toastTypes.success, '', "SMS send successfully");
                            },
                            err => {
                                this.showErrorMessage(this.messageService.toastTypes.error, '', "SMS notification cannot be sent due to any of following reasons: SMS setting is not enabled for institute. SMS Quota is insufficient for institute. No Users(Contacts) found for notify");
                            }
                        )
                    }
                    break;
                }
                default:
                    this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.SMSMessages.blankSMS, 'Please select an approved SMS Template to be sent');
            }
        }


    }

    /* Trigger Bulk Send SMS PopUp */
    sendBulkSms() {
        if ((!this._commService.valueCheck(this.selectedRowGroup)) && (this.selectedRowGroup.length != 0)) {
            this.flagJSON.isMultiSms = true;
            this.smsServicesInvoked();
            this.smsSelectedRowsLength = this.selectedRowGroup.length;
            this.cd.markForCheck();
        }
        else {
            this.showErrorMessage(this.messageService.toastTypes.warning, this.messageService.object.enquiryMessages.sendBulkSMS, '');
        }
    }

    /* Close Bulk Enquiry Popup and clear the field records and state */
    closeBulkSms() {
        this.emailSubject = '';
        this.flagJSON.isMultiSms = false;
        this.flagJSON.isMessageAddOpen = false;
        this.flagJSON.smsBtnToggle = false;
        this.flagJSON.isAllSelected = false;
        this.selectedSMS = { message: "", message_id: "", sms_type: "", status: "", statusValue: "", date: "", feature_type: "", institute_name: "", };
        this.newSmsString.data = "";
        this.smsSelectedRows = null;
        this.varJson.sendSmsFormData = { baseIds: [], messageArray: [] };
        this.cd.markForCheck();
    }

    /* Peform Delete Operation if access is OK */
    bulkDeleteEnquiries() {
        this.cd.markForCheck();

        /* If Admin */
        if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == '') {
            /* Multi rows selected */
            if (this.selectedRowGroup.length != 0) {
                if (confirm('You are about to delete multiple enquiries')) {

                    /* Check if user has selected any enquiry with status 11 or 12 */
                    if (this.validateDeletable()) {

                        let deleteString: string = '';
                        this.selectedRowGroup.forEach(el => { deleteString = deleteString + ',' + el; });

                        let data = { enquiryIdList: deleteString.slice(1), institution_id: sessionStorage.getItem('institute_id') };
                        this.auth.showLoader();

                        this.postdata.deleteEnquiryBulk(data).subscribe(
                            res => {
                                this.auth.hideLoader();
                                this.showErrorMessage(this.messageService.toastTypes.success, this.messageService.object.enquiryMessages.delete, 'Your delete request has been processed');

                                this.selectedRowGroup = [];

                                this.statusFilter({ value: 'In_Progress', prop: 'In_Progress', checked: true, disabled: false });
                                this.statusFilter({ value: 'Open', prop: 'Open', checked: true, disabled: false });
                            },
                            err => {
                                this.auth.hideLoader();
                                this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.enquiryMessages.failDelete, err.error.message);
                            });

                        this.auth.hideLoader();
                    }
                    else {
                        this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.enquiryMessages.unableDelete, 'Only open and InProgress enquiries can be deleted');
                    }
                }
            }
            /* Inadequate row selected */
            else {
                this.showErrorMessage(this.messageService.toastTypes.warning, this.messageService.object.enquiryMessages.bulkAction, '');
            }
        }
        /* Role based access verification */
        else {
            /* If User is Authorized to assign Enquiries */
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('115')) {

                /* Multi rows selected */
                if (this.selectedRowGroup.length != 0) {
                    if (confirm('You are about to delete multiple enquiries')) {

                        if (this.validateDeletable()) {
                            let deleteString: string = '';
                            this.selectedRowGroup.forEach(el => { deleteString = deleteString + ',' + el; });

                            let data = { enquiryIdList: deleteString.slice(1), institution_id: sessionStorage.getItem('institute_id') };

                            this.postdata.deleteEnquiryBulk(data).subscribe(
                                res => {
                                    this.showErrorMessage(this.messageService.toastTypes.success, this.messageService.object.enquiryMessages.delete, 'Your delete request has been processed');
                                    this.selectedRowGroup = [];
                                    this.statusFilter({ value: 'All', prop: 'All', checked: true, disabled: false });
                                },
                                err => {
                                    this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.enquiryMessages.failDelete, err.message);
                                });
                        }
                        else {
                            this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.enquiryMessages.unableDelete, 'Only open and InProgress enquiries can be deleted');
                        }
                    }
                }

                /* Inadequate row selected */
                else {
                    this.showErrorMessage(this.messageService.toastTypes.warning, this.messageService.object.enquiryMessages.selectToDelete, '');
                }
            }
            /* If User is not Authorized to assign Enquiries */
            else {
                this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.enquiryMessages.deleteEnquiry, '');

            }
        }

    }

    /* Check if enquiry is deletable  */
    validateDeletable() {
        let temp: any[] = [];
        this.selectedRowGroup.forEach(s => {
            this.sourceEnquiry.forEach(el => {
                if (el.institute_enquiry_id == s) {
                    temp.push(el);
                }
            });
        });
        let passed = temp.every(isOpenEnquiry);
        function isOpenEnquiry(element, index, array) {
            return (element.status == 0 || element.status == 3);
        }
        return passed;
    }

    /* Bulk Assign popup open */
    bulkAssignEnquiriesOpen() {
      if(!this.preFill){
        this.FetchEnquiryPrefilledData();
      }
        this.cd.markForCheck();
        /* If Admin */
        if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == '') {
            /* Multi rows selected */
            if (this.selectedRowGroup.length != 0) {
                this.flagJSON.isAssignEnquiry = true;
            }
            /* Inadequate row selected */
            else {
                this.showErrorMessage(this.messageService.toastTypes.warning, this.messageService.object.enquiryMessages.bulkAction, '');
            }
        }
        else {
            /* If User is Authorized to assign Enquiries */
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('115')) {
                /* Multi rows selected */
                if (this.selectedRowGroup.length != 0) {
                    this.flagJSON.isAssignEnquiry = true;
                }
                /* Inadequate row selected */
                else {
                    this.showErrorMessage(this.messageService.toastTypes.warning, this.messageService.object.enquiryMessages.bulkAction, '');
                }
            }
            /* If User is not Authorized to assign Enquiries */
            else {
                this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.enquiryMessages.adminEnquiry, '');
            }
        }
    }

    /* Bulk Assign popup close */
    bulkAssignEnquiriesClose() {
        this.flagJSON.isAssignEnquiry = false;
        this.assignMultipleForm = { enqLi: [], assigned_to: "", source_instituteId: '' };
        this.cd.markForCheck();
    }

    /* Bulk Assign popup operation */
    bulkAssignEnquiries() {
        this.cd.markForCheck();
        let assigneeArr: any[] = [];
        this.auth.showLoader();
        this.assignMultipleForm.enqLi = this.selectedRowGroup;
        this.postdata.setEnquiryAssignee(this.assignMultipleForm).subscribe(
            res => {
                this.auth.hideLoader();
                this.showErrorMessage(this.messageService.toastTypes.success, this.messageService.object.enquiryMessages.assignEnquiry, '');
                this.loadTableDatatoSource(this.instituteData);
                this.bulkAssignEnquiriesClose();
                this.cd.markForCheck();
            },
            err => {
                this.auth.hideLoader();
                this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.enquiryMessages.failEnquiry, '');

            }
        );
    }

    /* Convert assignee Id to name */
    getAssigneeName(id): string {
        let name: string = '';
        this.enqAssignTo.forEach(el => { if (el.userid == id) { name = el.name; } });
        return name;
    }

    /* Function to perform advanced filter and update table data */
    filterAdvanced() {
        this.varJson.isFilterApplied = true;
        this.varJson.fetchingDataMessage = 1;
        this.statusString = [];
        this.statFilter = [{ value: 'All', prop: 'All', checked: true, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false }, { value: 'Open', prop: 'Open', checked: false, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false }, { value: 'Registered', prop: 'Registered', checked: false, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }];
        this.flagJSON.isAllSelected = false;
        this.varJson.PageIndex = 1;
        // this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", priority: "", status: -1, filtered_statuses: "", follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null, sorted_by: "", order_by: "", commentShow: 'false' };
        // this.instituteData.filtered_statuses = this.statusString.join(',');
        let tempCustomArr: any[] = [];
        this.filterCustomComponent.forEach(el => {
            if (el.value != "") {
                let obj = { component_id: el.id, enq_custom_id: "0", enq_custom_value: '' };
                if (el.type == '5') {
                    obj.enq_custom_value = this.getDateFormated(el.value, "YYYY-MM-DD");
                }
                else if (el.type == '2') {
                    obj.enq_custom_value = el.value ? 'Y' : 'N';
                }
                else {
                    obj.enq_custom_value = el.value;
                }
                tempCustomArr.push(obj);
            }
        });
        if (tempCustomArr.length != 0) {
            this.advancedFilterForm.enqCustomLi = tempCustomArr;
        }
        else if (tempCustomArr.length == 0) {
            this.advancedFilterForm.enqCustomLi = null;
        }
        this.sourceEnquiry = [];
        this.selectedRowGroup = [];
        this.selectedRow = null;
        this.closeEnquiryFullDetails();
        this.flagJSON.isSideBar = false;

        //Update Date To And From Filter
        if (this.advancedFilterForm.updateDateFrom != "" && this.advancedFilterForm.updateDateFrom != null && this.advancedFilterForm.updateDateTo != "" && this.advancedFilterForm.updateDateTo != null) {
            if (moment(this.advancedFilterForm.updateDateFrom) <= moment(this.advancedFilterForm.updateDateTo)) {
                this.advancedFilterForm.updateDateFrom = this.getDateFormated(this.advancedFilterForm.updateDateFrom, 'YYYY-MM-DD');
                this.advancedFilterForm.updateDateTo = this.getDateFormated(this.advancedFilterForm.updateDateTo, 'YYYY-MM-DD');
            } else {
                this.showErrorMessage(this.messageService.toastTypes.error, '', 'Please enter valid Enquiry Changes From and To Dates');
                return;
            }
            // } else if (this.advancedFilterForm.updateDateFrom != "" && this.advancedFilterForm.updateDateFrom != null) {
            //     if (this.advancedFilterForm.updateDateTo == "" || this.advancedFilterForm.updateDateTo == null) {
            //         this.showErrorMessage(this.messageService.toastTypes.error, '', 'Please enter valid Enquiry Changes To Dates');
            //         return;
            //     }
        } else if (this.advancedFilterForm.updateDateTo != "" && this.advancedFilterForm.updateDateTo != null) {
            if (this.advancedFilterForm.updateDateFrom == "" || this.advancedFilterForm.updateDateFrom == null) {
                this.showErrorMessage(this.messageService.toastTypes.error, '', 'Please enter valid Enquiry Changes From Dates');
                return;
            }
        }
        else {
            this.advancedFilterForm.updateDateFrom = "";
            this.advancedFilterForm.updateDateTo = "";
        }

        if (this.advancedFilterForm.followUpDate != null &&
            this.advancedFilterForm.followUpDate != ''
            && this.advancedFilterForm.followUpDate != 'Invalid date') {
            this.advancedFilterForm.is_recent = "Y";
        }
        else {
            this.advancedFilterForm.is_recent = "N";
        }

        this.instituteData = this.advancedFilterForm;

        this.auth.showLoader();
        this.enquire.getAllEnquiry(this.advancedFilterForm).subscribe(
            data => {
                this.auth.hideLoader();
                this.sourceEnquiry = data;
                if (this.sourceEnquiry.length != 0) {
                    this.varJson.totalEnquiry = data[0].totalcount;
                    this.cd.markForCheck();
                    this.closeAdFilter();
                }
                else {
                    this.varJson.fetchingDataMessage = 2;
                    // this.showErrorMessage(this.messageService.toastTypes.error, '', 'We did not find any enquiry for the specified query');
                    this.varJson.totalEnquiry = 0;
                    this.cd.markForCheck();
                    this.closeAdFilter();
                }
            },
            err => {
                this.auth.hideLoader();
            }
        );
    }

    /* Function to clear the advance filter Manually */
    clearFilterAdvanced() {
        this.varJson.isFilterApplied = false;
        this.advancedFilterForm = {
            name: "", phone: "", email: "",
            enquiry_no: "", priority: "", status: -1, filtered_statuses: "",
            follow_type: "", followUpDate: this.getDateFormated(null, 'YYYY-MM-DD'),
            enquiry_date: "",
            assigned_to: -1, standard_id: -1, subjectIdArray: null,
            master_course_name: '', courseIdArray: null,
            subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "",
            isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "",
            updateDateFrom: "", updateDateTo: "", start_index: 0,
            batch_size: this.varJson.displayBatchSize, closedReason: "",
            enqCustomLi: null, commentShow: 'false',
            country_id: '-1', state_id: '-1', city_id: '-1'
        };
        this.customComponents.forEach(el => { el.selectedString = ''; el.selected = []; el.value = ''; });
        this.varJson.PageIndex = 1;
        this.enqSubject = [];
        this.course_course = [];
        this.cd.markForCheck();
    }

    closeUpdatePop(e) {
        this.pops.changeMessage('');
        this.timeJson = { hour: '', minute: '', meridian: '' };
        this.updateFormData = { comment: "", status: "", institution_id: sessionStorage.getItem('institute_id'), isEnquiryUpdate: "Y", closedReason: null, slot_id: null, priority: "", follow_type: "", followUpDate: "", commentDate: this.getDateFormated(null, 'YYYY-MM-DD'), followUpTime: "", isEnquiryV2Update: "N", isRegisterFeeUpdate: "N", amount: null, paymentMode: null, paymentDate: null, reference: null, walkin_followUpDate: '', walkin_followUpTime: { hour: '', minute: '', }, is_follow_up_time_notification: 0, };
        this.loadTableDatatoSource(this.instituteData);
    }

    /* common function to close popups */
    closePopup() {
        this.pops.changeMessage('');
        this.timeJson = { hour: '', minute: '', meridian: '' };
        this.flagJSON.isApprovedTab = true;
        this.flagJSON.isOpenTab = false;
        this.flagJSON.isMessageAddOpen = false;
        this.flagJSON.smsBtnToggle = false;
        this.newSmsString.data = "";
        this.smsSelectedRows = null;
        this.selectedSMS = { message: "", message_id: "", sms_type: "", status: "", statusValue: "", date: "", feature_type: "", institute_name: "", };
        this.varJson.sendSmsFormData = { baseIds: [], messageArray: [] };
        this.registrationForm = { institute_enquiry_id: "", amount: "", paymentDate: this.getDateFormated(null, 'YYYY-MM-DD'), paymentMode: "", reference: "", }
        this.updateFormData = { comment: "", status: "", institution_id: sessionStorage.getItem('institute_id'), isEnquiryUpdate: "Y", closedReason: null, slot_id: null, priority: "", follow_type: "", followUpDate: "", commentDate: this.getDateFormated(null, 'YYYY-MM-DD'), followUpTime: "", isEnquiryV2Update: "N", isRegisterFeeUpdate: "N", amount: null, paymentMode: null, paymentDate: null, reference: null, walkin_followUpDate: '', walkin_followUpTime: { hour: '', minute: '', }, is_follow_up_time_notification: 0, };
        this.flagJSON.summaryOptions = false;
        this.varJson.summaryReport = { from_date: "", to_date: "", };
        this.flagJSON.showDateRange = false;
        this.cd.markForCheck();
    }

    /* fetch subject when user selects any standard on select menu */
    fetchEnquirySubject() {
        this.auth.showLoader();
        if (this.advancedFilterForm.standard_id != null || this.advancedFilterForm.standard_id != '-1') {
            this.advancedFilterForm.subjectIdArray = null;
            this.enqSubject = [];
            this.prefill.getEnqSubjects(this.advancedFilterForm.standard_id).subscribe(
                data => { this.auth.hideLoader(); this.enqSubject = data; this.cd.markForCheck(); },
                err => { this.auth.hideLoader(); }
            );
        }
        else {
            this.auth.hideLoader();
            this.advancedFilterForm.subject_id = '-1';
            this.enqSubject = [];
        }
    }

    courseMasterChange(e) {
        if (e != '-1') {
            this.masterCourseData.map(el => {
                if (el.master_course == e) {
                    if (el.coursesList == null || el.coursesList.length == 0) {
                        this.course_course = [];
                    }
                    else {
                        this.course_course = el.coursesList;
                    }
                }
            });
        }
        else {
            this.course_course = [];
        }
    }

    /*** pagination functions */
    /* Fetch next set of data from server and update table */
    fetchNext() {
        this.varJson.PageIndex++;
        this.fectchTableDataByPage(this.varJson.PageIndex);
    }

    /* Fetch previous set of data from server and update table */
    fetchPrevious() {
        this.varJson.PageIndex--;
        this.fectchTableDataByPage(this.varJson.PageIndex);
    }

    /* Fetch table data by page index */
    fectchTableDataByPage(index) {
        this.varJson.PageIndex = index;
        let startindex = this.varJson.displayBatchSize * (index - 1);
        if (this.varJson.isFilterApplied) {
            this.advancedFilterForm.start_index = startindex;
            this.advancedFilterForm.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
            this.advancedFilterForm.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
            this.loadTableDatatoSource(this.advancedFilterForm);
        }
        else {
            this.instituteData.start_index = startindex;
            this.instituteData.sorted_by = sessionStorage.getItem('sorted_by') != null ? sessionStorage.getItem('sorted_by') : '';
            this.instituteData.order_by = sessionStorage.getItem('order_by') != null ? sessionStorage.getItem('order_by') : '';
            this.instituteData.filtered_statuses = this.statusString.join(',');
            this.loadTableDatatoSource(this.instituteData);
        }

    }

    /* Fetches Data as per the user selected batch size */
    updateTableBatchSize(num) {
        this.varJson.PageIndex = 1;
        this.varJson.displayBatchSize = parseInt(num);
        this.instituteData.batch_size = this.varJson.displayBatchSize;
        this.instituteData.start_index = 0;
        this.statusString = [];
        this.statFilter = [{ value: 'All', prop: 'All', checked: true, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false }, { value: 'Open', prop: 'Open', checked: false, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false }, { value: 'Registered', prop: 'Registered', checked: false, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }];
        this.instituteData.filtered_statuses = this.statusString.join(',');
        this.loadTableDatatoSource(this.instituteData);
    }

    /* Function to store the data of Custom Component in to Base64 encoded array string */
    customComponentUpdated(val, data) {
        this.componentListObject[data.component_id].enq_custom_value = val;
    }

    /* Fetch all the enquiries as xls file */
    downloadAllEnquiries() {
        this.cd.markForCheck();
        this.auth.showLoader();
        let courseArray = [];
        if (this.advancedFilterForm.courseIdArray == null) {
            courseArray = [""];
        }
        else {
            courseArray = this.advancedFilterForm.courseIdArray;
        }
        let subjectArray = [];
        if (this.advancedFilterForm.subjectIdArray == null) {
            subjectArray = [""];
        }
        else {
            subjectArray = this.advancedFilterForm.subjectIdArray;
        }

        let obj = {
            name: this.instituteData.name,
            phone: this.instituteData.phone,
            email: this.instituteData.email,
            enquiry_no: this.instituteData.enquiry_no,
            priority: this.advancedFilterForm.priority,
            status: this.advancedFilterForm.status,
            filtered_statuses: this.advancedFilterForm.filtered_statuses,
            follow_type: this.advancedFilterForm.follow_type,
            followUpDate: this.advancedFilterForm.followUpDate == '' ? "" : moment(this.advancedFilterForm.followUpDate).format('YYYY-MM-DD'),
            enquiry_date: this.advancedFilterForm.enquiry_date,
            assigned_to: this.advancedFilterForm.assigned_to,
            standard_id: this.advancedFilterForm.standard_id,
            subjectIdArray: subjectArray,
            master_course_name: this.advancedFilterForm.master_course_name,
            courseIdArray: courseArray,
            subject_id: this.advancedFilterForm.subject_id,
            is_recent: this.advancedFilterForm.is_recent,
            slot_id: this.advancedFilterForm.slot_id,
            filtered_slots: this.advancedFilterForm.filtered_slots,
            isDashbord: this.instituteData.isDashbord,
            enquireDateFrom: this.advancedFilterForm.enquireDateFrom == "" ? "" : moment(this.advancedFilterForm.enquireDateFrom).format('YYYY-MM-DD'),
            // this.getDateFormated(this.advancedFilterForm.enquireDateFrom, "YYYY-MM-DD"),
            enquireDateTo: this.advancedFilterForm.enquireDateTo == "" ? "" : moment(this.advancedFilterForm.enquireDateTo).format('YYYY-MM-DD'),
            // moment(this.advancedFilterForm.enquireDateTo, "YYYY-MM-DD"),
            updateDate: this.advancedFilterForm.updateDate == "" ? "" : moment(this.advancedFilterForm.updateDate).format('YYYY-MM-DD'),
            // this.getDateFormated(this.advancedFilterForm.updateDate, "YYYY-MM-DD"),
            updateDateFrom: this.advancedFilterForm.updateDateFrom == "" ? "" : moment(this.advancedFilterForm.updateDateFrom).format('YYYY-MM-DD'),
            // this.getDateFormated(this.advancedFilterForm.updateDateFrom, "YYYY-MM-DD"),
            updateDateTo: this.advancedFilterForm.updateDateTo == "" ? "" : moment(this.advancedFilterForm.updateDateTo).format('YYYY-MM-DD'),
            // this.getDateFormated(this.advancedFilterForm.updateDateTo, "YYYY-MM-DD"),
            start_index: 0,
            batch_size: this.varJson.displayBatchSize,
            closedReason: "",
            enqCustomLi: this.advancedFilterForm.enqCustomLi,
            sorted_by: "",
            order_by: "",
            commentShow: 'false',
            source_id: this.advancedFilterForm.source_id,
            school_id: this.advancedFilterForm.school_id,
            list_id: this.advancedFilterForm.list_id,
            country_id: this.advancedFilterForm.country_id,
            city_id: this.advancedFilterForm.city_id,
            state_id: this.advancedFilterForm.state_id
        };

        this.enquire.fetchAllEnquiryAsXls(obj).subscribe(
            (res: any) => {
                this.auth.hideLoader();
                let byteArr = this._commService.convertBase64ToArray(res.document);
                let fileName = res.docTitle;
                let file = new Blob([byteArr], { type: 'application/vnd.ms-excel' });
                let url = URL.createObjectURL(file);
                let dwldLink = document.getElementById('enq_download');
                this.cd.markForCheck();
                dwldLink.setAttribute("href", url);
                dwldLink.setAttribute("download", fileName);
                document.body.appendChild(dwldLink);
                this.cd.markForCheck();
                dwldLink.click();
                this.cd.markForCheck();
            },
            err => {
                this.auth.hideLoader();
            }
        )
    }

    checkCustomeComponentElement(index) {
        if (!(index % 3)) {
            return true;
        }
        else {
            return false;
        }

    }

    ///// Download Summary Report
    toggleDateSection() {
        if (this.flagJSON.showDateRange == false) {
            this.flagJSON.showDateRange = true;
            document.getElementById('anchTagToggle').text = "Hide";
        } else {
            this.flagJSON.showDateRange = false;
            document.getElementById('anchTagToggle').text = "Download By Date Range";
        }
    }

    downloadSummaryReport() {
        this.flagJSON.summaryOptions = true;
        setTimeout(() => {
            document.getElementById('anchTagToggle').text = "Download By Date Range";
        }, 100);
    }

    reportFor() {
        let reportFor = [];
        if (this.downloadReportFor.enquiry) {
            reportFor.push("Enquiry");
        }
        if (this.downloadReportFor.admissions) {
            reportFor.push("Admissions");
        }
        if (this.downloadReportFor.fees) {
            reportFor.push("Fees");
        }
        return reportFor.toString();
    }
    downloadSummaryReportXl() {

        let report = this.reportFor()

        switch (Number(this.varJson.downloadReportOption)) {
            case 1:
                this.showErrorMessage(this.messageService.toastTypes.error, 'Selection', 'Please select other options');
                break;
            case 2: {
                this.auth.showLoader();
                this.enquire.getSummaryReportOfThisMonth(report).subscribe(
                    res => {
                        this.auth.hideLoader();
                        this.performDownloadAction(res);
                    },
                    err => {
                        this.auth.hideLoader();
                    }
                )
            }
                break;
            case 3: {
                this.auth.showLoader();
                this.enquire.getPreviousMSummary(report).subscribe(
                    res => {
                        this.auth.hideLoader();
                        this.performDownloadAction(res);
                    },
                    err => { this.auth.hideLoader(); }
                )
            }
                break;
            case 4: {
                this.auth.showLoader();
                this.enquire.getSummaryReportOfLastTwoMonth(report).subscribe(
                    res => {
                        this.auth.hideLoader();
                        this.performDownloadAction(res);
                    },
                    err => { this.auth.hideLoader(); }
                )
            }

        }
    }

    downloadSummaryReportXlDateWise() {
        if (this.varJson.summaryReport.to_date != "" && this.varJson.summaryReport.from_date != "") {
            this.auth.showLoader();
            let report = this.reportFor()
            let obj = { to_date: this.getDateFormated(this.varJson.summaryReport.to_date, 'YYYY-MM-DD'), from_date: this.getDateFormated(this.varJson.summaryReport.from_date, 'YYYY-MM-DD') }
            this.enquire.getSummaryReportFromDates(obj, report).subscribe(
                res => { this.auth.hideLoader(); this.performDownloadAction(res); },
                err => { this.auth.hideLoader(); }
            );
        }
        else {
            this.showErrorMessage(this.messageService.toastTypes.error, '', 'Please enter dates');
        }
    }

    performDownloadAction(res) {
        let byteArr = this._commService.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('downloadSummaryReport121');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        dwldLink.click();
    }

    /* Convert enquiry to student */
    convertRow(ev) {
        let institute_id = sessionStorage.getItem("institute_id");
        if (this.flagJSON.isProfessional) {
            this.selectedRow.standard_id = this.selectedRow.master_course_name;
        }
        console.log(ev, this.selectedRow);
        return this.enquire.fetchEnquiryStudentData(institute_id, this.selectedRow.institute_enquiry_id).subscribe(
            (data: any) => {
                this.auth.hideLoader();
                this.selectedRow.standard_id = data.standard_id;
                this.selectedRow.address = data.curr_address;
                this.selectedRow.curr_address = data.curr_address;
                this.selectedRow.country_id = data.country_id;
                this.selectedRow.state_id = data.state_id;
                this.selectedRow.city_id = data.city_id;
                this.selectedRow.area_id = data.area_id;
                this.selectedRow.phone = data.phone;
                this.selectedRow.assigned_to = data.assigned_to;
                sessionStorage.setItem('studentPrefill', JSON.stringify(this.selectedRow));
                this.router.navigate(['/view/students/add'])
                this.closePopup();
                this.cd.markForCheck();

            },
            err => {
                this.auth.hideLoader();
                this.showErrorMessage(this.messageService.toastTypes.error, 'Unable To Connect To Server', 'Please check your internet connection or contact proctur support if the issue persist');
                this.cd.markForCheck();
            });

    }

    /* Download Receipt API */
    downloadReceiptPdf() {
        this.auth.showLoader();
        this.enquire.fetchReceiptPdf(this.selectedRow.invoice_no).subscribe(
            (res: any) => {
                this.auth.hideLoader();
                this.cd.markForCheck();
                let byteArr = this._commService.convertBase64ToArray(res.document);
                let format = res.format;
                let fileName = res.docTitle;
                let file = new Blob([byteArr], { type: 'application/pdf' });
                let url = URL.createObjectURL(file);
                let dwldLink = document.getElementById('reg-pdf-link');
                if (dwldLink.getAttribute('href') == "" || dwldLink.getAttribute('href') == null) {
                    dwldLink.setAttribute("href", url);
                    dwldLink.setAttribute("download", fileName);
                    dwldLink.click();
                    this.cd.markForCheck();
                }
            },
            err => {
                this.auth.hideLoader();
            }
        )
    }

    sortTableById(id) {
        this.varJson.sortBy = id;
        // console.log(this.varJson.sortBy);
        if (id == 'followUpDateTime') { id = 'followUpDate' }
        this.instituteData.sorted_by = id;
        //this.varJson.currentDirection = this.varJson.currentDirection == 'desc' ? 'asc' : 'desc';
        this.instituteData.order_by = this.varJson.currentDirection;
        this.instituteData.filtered_statuses = this.statusString.join(',');
        this.cd.markForCheck();
        this.loadTableDatatoSource(this.instituteData);
    }

    clearSearchDate() {
        this.varJson.searchBarDate = "";
        this.instituteData.followUpDate = "";
        this.instituteData.enquireDateFrom = "";
        this.instituteData.enquireDateTo = "";
    }

    clearFilterType(object) {
        this.advancedFilterForm[object] = "";
    }

    clearupdateDate() {
        this.updateFormData.followUpDate = "";
        this.timeJson.hour = '';
        this.timeJson.minute = '';
        this.timeJson.meridian = '';
    }

    updateSlotSelected(data) {
        /* slot checked */
        let selectedSlotsID;
        if (data.status) {
            this.slotIdArr.push(data.value.slot_id);
            this.selectedSlots.push(data.value.slot_name);
            if (this.selectedSlots.length != 0) {
                document.getElementById('slotwrapper').classList.add('has-value');
            }
            else {
                document.getElementById('slotwrapper').classList.remove('has-value');
            }
            selectedSlotsID = this.slotIdArr.join(',')
            this.varJson.selectedSlotsString = this.selectedSlots.join(',');
            this.advancedFilterForm.filtered_slots = selectedSlotsID;
        }
        /* slot unchecked */
        else {
            if (this.selectedSlots.length < 0) {
                document.getElementById('slotwrapper').classList.add('has-value');
            }
            else if (this.selectedSlots.length == 0) {
                document.getElementById('slotwrapper').classList.remove('has-value');
            }
            else if (this.selectedSlots.length == 1) {
                document.getElementById('slotwrapper').classList.remove('has-value');
            }
            var index = this.selectedSlots.indexOf(data.value.slot_name);
            if (index > -1) {
                this.selectedSlots.splice(index, 1);
            }
            this.varJson.selectedSlotsString = this.selectedSlots.join(',');

            var index2 = this.slotIdArr.indexOf(data.value.slot_id);
            if (index2 > -1) {
                this.slotIdArr.splice(index, 1);
            }
            selectedSlotsID = this.slotIdArr.join(',');
            this.advancedFilterForm.filtered_slots = selectedSlotsID;
        }

    }

    getPriority(id): string {
        let temp: string = ""
        this.enqPriority.forEach(el => {
            if (el.data_key === id) {
                temp = el.data_value;
            }
        });
        return temp;
    }

    getFollowUp(id): string {
        let temp: string = ""
        this.enqFollowType.forEach(el => {
            if (el.data_key === id) {
                temp = el.data_value;
            }
        });
        return temp;
    }

    getFollowUpReverse(id): string {
        let temp: string = ""
        this.enqFollowType.forEach(el => {
            if (el.data_value === id) {
                temp = el.data_key;
            }
        });
        return temp;
    }

    getPriorityReverse(id): string {
        let temp: string = ""
        this.enqPriority.forEach(el => {
            if (el.data_value === id) {
                temp = el.data_key;
            }
        });
        //console.log(temp);
        return temp;
    }

    openEnquiryFullDetails(id) {
        this.closeAdFilter();
        let mySidenavWidth = '27%';
        if (window.innerWidth < 768)
            mySidenavWidth = '100%';
        this.mySidenav.nativeElement.style.width = mySidenavWidth;
        this.mySidenav.nativeElement.style.display = 'block';
        this.enqPage.nativeElement.style.width = "70%";
        this.enqPage.nativeElement.style.marginRight = mySidenavWidth;
        // this.optMenu.nativeElement.classList.add('shorted');
        this.auth.showLoader();
        this.cd.markForCheck();
        this.customCompid = [];
        this.prefill.fetchCustomComponentById(id).subscribe(
            res => {
                this.auth.hideLoader();
                this.cd.markForCheck();
                if (res != null) {
                    this.customCompid = res;
                }
                if(!this.preFill){
                  this.FetchEnquiryPrefilledData();
                }
                this.flagJSON.isSideBar = true;
            },
            err => {
                this.auth.hideLoader();
            }
        )
    }

    closeEnquiryFullDetails() {
        this.auth.showLoader();
        this.flagJSON.isSideBar = false;
        this.mySidenav.nativeElement.style.width = "0";
        this.mySidenav.nativeElement.style.display = 'none';
        this.enqPage.nativeElement.style.width = "100%";
        this.enqPage.nativeElement.style.marginRight = "0";
        // this.optMenu.nativeElement.classList.remove('shorted');
        this.auth.hideLoader();
    }
    /*  Handler for row click event */

    userRowSelect(ev) {
        if (ev != null) {
            this.openEnquiryFullDetails(ev.institute_enquiry_id);
            this.cd.markForCheck();
            this.enquiryFullDetail = ev.institute_enquiry_id;
            this.selectedRow = ev;
            this.flagJSON.isConverted = this.selectedRow.status == 12 ? true : false;
            if ((this.selectedRow.status == 11) && (this.selectedRow.invoice_no != 0)) {
                this.flagJSON.hasReceipt = true;
                sessionStorage.setItem("institute_enquiry_id", this.selectedRow.institute_enquiry_id);
            }
            else {
                if (this.selectedRow.status == 0 || this.selectedRow.status == 3 || this.selectedRow.status == 2) {
                    this.flagJSON.notClosednAdmitted = true;
                    this.flagJSON.isadmitted = false;
                    this.flagJSON.isClosed = false;
                    this.flagJSON.hasReceipt = false;
                }
                else if (this.selectedRow.status == 11) {
                    this.flagJSON.notClosednAdmitted = false;
                    this.flagJSON.isadmitted = true;
                    this.flagJSON.isClosed = false;
                    this.flagJSON.hasReceipt = false;
                }
                else if (this.selectedRow.status == 1 || this.selectedRow.status == 12) {
                    this.flagJSON.notClosednAdmitted = false;
                    this.flagJSON.isadmitted = false;
                    this.flagJSON.isClosed = true;
                    this.flagJSON.hasReceipt = false;
                }
                sessionStorage.setItem("institute_enquiry_id", this.selectedRow.institute_enquiry_id);
            }
        }
        else {
            this.closeEnquiryFullDetails();
            this.flagJSON.isSideBar = false;
        }
    }

    virtualUpdateEnquiry(obj) {
        this.updateFormData = obj;
        this.cd.markForCheck();
        this.auth.showLoader();
        this.postdata.updateEnquiryForm(this.selectedRow.institute_enquiry_id, this.updateFormData)
            .subscribe(
                res => {
                    this.auth.hideLoader();
                    this.cd.markForCheck();
                    this.showErrorMessage(this.messageService.toastTypes.success, this.messageService.object.enquiryMessages.update, 'Your enquiry has been successfully submitted');
                    this.closePopup();
                    this.loadTableDatatoSource(this.instituteData);
                },
                err => {
                    this.auth.hideLoader();
                    this.showErrorMessage(this.messageService.toastTypes.error, this.messageService.object.enquiryMessages.failUpdate, 'There was an error processing your request');
                })
    }

    getRowCount(ev) {
        this.varJson.selectedRowCount = ev;
    }

    getSelectedEnquiries(ev) {
        this.cd.markForCheck();
        this.selectedRowGroup = ev;
    }

    getDirection(e) {
        if (e) {
            this.varJson.currentDirection = "asc";
        }
        else {
            this.varJson.currentDirection = "desc";
        }
    }

    roleManagementForBulkAdd() {
        this.bulkAddItems = [];
        let permissionArray: any = sessionStorage.getItem('permissions');

        if (permissionArray == "" || permissionArray == null) {
            this.giveFullPermisionOfBulfAction();
        }
        else {

            if (permissionArray != undefined) {

                if (permissionArray.indexOf('115') != -1) {
                    this.giveFullPermisionOfBulfAction();
                }
                else {
                    this.bulkAddItems = [{ label: 'Send SMS', icon: 'fa-envelope-o', command: () => { this.sendBulkSms(); } }];
                }
            }

        }
    }


    giveFullPermisionOfBulfAction() {
        this.bulkAddItems = [
            { label: 'Send Notification', icon: 'fa-envelope-o', command: () => { this.sendBulkSms(); } },
            { label: 'Delete Enquiries', icon: 'fa-trash-o', command: () => { this.bulkDeleteEnquiries(); } },
            { label: 'Assign Enquiries', icon: 'fa-buysellads', command: () => { this.bulkAssignEnquiriesOpen(); } }
        ];
    }

    // Multi Branch Check
    checkMultiBranchStatus() {
        const permissionArray = sessionStorage.getItem('permissions');

        if (permissionArray == "" || permissionArray == null) {
            this.auth.isMainBranch.subscribe(
                (value: any) => {
                    this.isMainBranch = value;
                    if (this.isMainBranch == "Y") {
                        this.updateFormData.source_instituteId = this.varJson.insttitueId;
                        this.multiBranchInstituteFound(this.varJson.insttitueId);
                        this.branchUpdated(this.updateFormData.source_instituteId);
                    }
                }
            );

            this.multiBranchService.subBranchSelected.subscribe(
                res => {
                    this.flagJSON.subBranchSelected = res;
                    if (res == true) {
                        this.updateFormData.source_instituteId = this.varJson.insttitueId;
                        const mainBranchId = sessionStorage.getItem('mainBranchId');
                        if (mainBranchId != null) {
                            this.multiBranchInstituteFound(mainBranchId);
                            this.branchUpdated(this.updateFormData.source_instituteId);
                        }
                    }
                }
            )
        }
        else {
            this.isMainBranch = "N";
            this.flagJSON.subBranchSelected = false;
        }
    }

    multiBranchInstituteFound(id) {
        this.prefill.getAllSubBranches(id).subscribe(
            (res: any) => { this.branchesList = res; },
            err => { console.log(err); }
        );
    }

    branchUpdated(e) {
        this.enqAssignTo = [];
        this.prefill.fetchAssignedToData(e).subscribe(
            res => { this.enqAssignTo = res; },
            err => { console.log(err); }
        );
    }

    updateStatFilterStatus(id: string, check: boolean) {
        this.statFilter.forEach(e => { if (e.prop == id) { e.checked = check; } });
    }

    /* Function to toggle table data on checkbox click */
    statusFilter(checkerObj) {
        this.clearFilterAdvanced();
        this.varJson.searchBarData = '';
        this.updateStatFilterStatus(checkerObj.prop, checkerObj.checked);
        if (checkerObj.prop == "All") {
            this.statusString = [];
            if (checkerObj.checked) {
                this.statFilter = [{ value: 'All', prop: 'All', checked: true, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false }, { value: 'Open', prop: 'Open', checked: false, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false }, { value: 'Registered', prop: 'Registered', checked: false, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }];
                this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                this.advancedFilterForm = this.instituteData;
                this.loadTableDatatoSource(this.instituteData);
            }
        }

        else if (checkerObj.prop == "Pending") {
            if (checkerObj.checked) {
                this.statFilter = [{ value: 'All', prop: 'All', checked: false, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: true, disabled: false }, { value: 'Open', prop: 'Open', checked: false, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false }, { value: 'Registered', prop: 'Registered', checked: false, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }]; this.advancedFilterForm.followUpDate = this.getDateFormated(new Date(), "YYYY-MM-DD");
                this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: this.getDateFormated(new Date(), "YYYY-MM-DD"), enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                this.advancedFilterForm = this.instituteData;
                this.loadTableDatatoSource(this.instituteData);
            }
        }

        else if (checkerObj.prop == "Student_Admitted") {
            if (checkerObj.checked) {
                this.statusString.push('12');
                let stat = this.statusString.join(',');
                this.instituteData = { name: "", phone: "", email: "", commentShow: 'false', enquiry_no: "", priority: "", status: -1, filtered_statuses: stat, follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                this.advancedFilterForm = this.instituteData;
                this.loadTableDatatoSource(this.instituteData);
            }
            else {
                let index = this.statusString.indexOf('12');
                if (index !== -1) {
                    this.statusString.splice(index, 1);
                }

                if (this.statusString.length == 0) {
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.advancedFilterForm = this.instituteData;
                    this.loadTableDatatoSource(this.instituteData);
                }

                else if (this.statusString.length != 0) {
                    let stat = this.statusString.join(',');
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: stat, follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.advancedFilterForm = this.instituteData;
                    this.loadTableDatatoSource(this.instituteData);
                }
            }
        }

        else if (checkerObj.prop == "Inactive") {
            if (checkerObj.checked) {
                this.statusString.push('1');
                let stat = this.statusString.join(',');
                this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: stat, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                this.advancedFilterForm = this.instituteData;
                this.loadTableDatatoSource(this.instituteData);
            }
            else {
                let index = this.statusString.indexOf('1');
                if (index !== -1) {
                    this.statusString.splice(index, 1);
                }
                if (this.statusString.length == 0) {
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.advancedFilterForm = this.instituteData;
                    this.loadTableDatatoSource(this.instituteData);
                }
                else if (this.statusString.length != 0) {
                    let stat = this.statusString.join(',');
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: stat, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.advancedFilterForm = this.instituteData;
                    this.loadTableDatatoSource(this.instituteData);
                }
            }

        }

        else if (checkerObj.prop == "Open") {
            if (checkerObj.checked) {
                this.statusString.push('0');
                let stat = this.statusString.join(',');
                this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: stat, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                this.advancedFilterForm = this.instituteData;
                this.loadTableDatatoSource(this.instituteData);
            }
            else {
                let index = this.statusString.indexOf('0');
                if (index !== -1) {
                    this.statusString.splice(index, 1);
                }
                if (this.statusString.length == 0) {
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.advancedFilterForm = this.instituteData;
                    this.loadTableDatatoSource(this.instituteData);
                }
                else if (this.statusString.length != 0) {
                    let stat = this.statusString.join(',');
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: stat, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.advancedFilterForm = this.instituteData;
                    this.loadTableDatatoSource(this.instituteData);
                }

            }

        }

        else if (checkerObj.prop == "In_Progress") {
            if (checkerObj.checked) {
                this.statusString.push('3');
                let stat = this.statusString.join(',');
                this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: stat, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                this.advancedFilterForm = this.instituteData;
                this.loadTableDatatoSource(this.instituteData);
            }
            else {
                let index2 = this.statusString.indexOf('3');
                if (index2 !== -1) {
                    this.statusString.splice(index2, 1);
                }
                if (this.statusString.length == 0) {
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.advancedFilterForm = this.instituteData;
                    this.loadTableDatatoSource(this.instituteData);
                }
                else if (this.statusString.length != 0) {
                    let stat = this.statusString.join(',');
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: stat, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.advancedFilterForm = this.instituteData;
                    this.loadTableDatatoSource(this.instituteData);
                }

            }

        }

        else if (checkerObj.prop == "Registered") {
            if (checkerObj.checked) {
                this.statusString.push('11');
                let stat = this.statusString.join(',');
                this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: stat, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                this.advancedFilterForm = this.instituteData;
                this.loadTableDatatoSource(this.instituteData);
            }
            else {
                let index = this.statusString.indexOf('11');
                if (index !== -1) {
                    this.statusString.splice(index, 1);
                }
                if (this.statusString.length == 0) {
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.advancedFilterForm = this.instituteData;
                    this.loadTableDatatoSource(this.instituteData);
                }
                else if (this.statusString.length != 0) {
                    let stat = this.statusString.join(',');
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: stat, follow_type: "", followUpDate: this.varJson.searchBarDate, enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.advancedFilterForm = this.instituteData;
                    this.loadTableDatatoSource(this.instituteData);
                }

            }

        }

        else if (checkerObj.prop == "Walkin") {
            if (checkerObj.checked) {
                this.statusString = [];
                let stat = this.statusString.join(',');
                this.advancedFilterForm.followUpDate = this.getDateFormated(new Date(), "YYYY-MM-DD");
                this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, follow_type: "Walkin", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_statuses: stat, filtered_slots: "", isDashbord: "N", enquireDateFrom: "", enquireDateTo: "", updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                this.advancedFilterForm = this.instituteData;
                this.loadTableDatatoSource(this.instituteData);
            }
        }

    }

    checkIfRoutedFromEnquiry() {
        this.statFilter = [
            { value: 'All', prop: 'All', checked: false, disabled: false },
            { value: 'Pending Followup', prop: 'Pending', checked: true, disabled: false },
            { value: 'Open', prop: 'Open', checked: false, disabled: false },
            { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false },
            { value: 'Registered', prop: 'Registered', checked: false, disabled: false },
            { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false },
            { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false },
            { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }
        ];
        this.varJson.PageIndex = 1;
        if (sessionStorage.getItem('dashBoardParam') == "" || sessionStorage.getItem('dashBoardParam') == null || sessionStorage.getItem('dashBoardParam') == undefined) { return; }

        else {
            let obj = JSON.parse(sessionStorage.getItem('dashBoardParam'));
            let filter = obj.type;
            let fromDate = obj.dateR[0];
            let toDate = obj.dateR[1];
            this.varJson.searchBarData = '';
            this.statusString = [];

            switch (filter) {
                case "total":
                    {
                        this.statusString = [];
                        this.statFilter = [{ value: 'All', prop: 'All', checked: true, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false }, { value: 'Open', prop: 'Open', checked: false, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false }, { value: 'Registered', prop: 'Registered', checked: false, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }];
                        this.instituteData = { name: "", phone: "", email: "", commentShow: 'false', enquiry_no: "", priority: "", status: -1, filtered_statuses: "", follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: this.getDateFormated(fromDate, "YYYY-MM-DD"), enquireDateTo: this.getDateFormated(toDate, "YYYY-MM-DD"), updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                        this.loadTableDatatoSource(this.instituteData);
                    }
                    break;

                case "Admitted":
                    {
                        this.statusString.push('12');
                        this.statFilter = [{ value: 'All', prop: 'All', checked: false, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false }, { value: 'Open', prop: 'Open', checked: false, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false }, { value: 'Registered', prop: 'Registered', checked: false, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: true, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }];
                        this.instituteData = { name: "", phone: "", email: "", commentShow: 'false', enquiry_no: "", priority: "", status: -1, filtered_statuses: "12", follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: this.getDateFormated(fromDate, "YYYY-MM-DD"), enquireDateTo: this.getDateFormated(toDate, "YYYY-MM-DD"), updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                        this.loadTableDatatoSource(this.instituteData);
                    }
                    break;

                case "Closed":
                    {
                        this.statusString.push('1');
                        this.statFilter = [{ value: 'All', prop: 'All', checked: false, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false }, { value: 'Open', prop: 'Open', checked: false, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false }, { value: 'Registered', prop: 'Registered', checked: false, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: true, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }
                        ];
                        this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: "1", follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: this.getDateFormated(fromDate, "YYYY-MM-DD"), enquireDateTo: this.getDateFormated(toDate, "YYYY-MM-DD"), updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                        this.loadTableDatatoSource(this.instituteData);
                    }
                    break;

                case "Open": {
                    this.statusString.push('0');
                    this.statFilter = [{ value: 'All', prop: 'All', checked: false, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false }, { value: 'Open', prop: 'Open', checked: true, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false }, { value: 'Registered', prop: 'Registered', checked: false, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }];
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: "0", follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: this.getDateFormated(fromDate, "YYYY-MM-DD"), enquireDateTo: this.getDateFormated(toDate, "YYYY-MM-DD"), updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.loadTableDatatoSource(this.instituteData);
                }
                    break;

                case "InProgress": {
                    this.statusString.push('3');
                    this.statFilter = [{ value: 'All', prop: 'All', checked: false, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false }, { value: 'Open', prop: 'Open', checked: false, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: true, disabled: false }, { value: 'Registered', prop: 'Registered', checked: false, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }];
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: "3", follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: this.getDateFormated(fromDate, "YYYY-MM-DD"), enquireDateTo: this.getDateFormated(toDate, "YYYY-MM-DD"), updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.loadTableDatatoSource(this.instituteData);
                }
                    break;

                case "Registered": {
                    this.statusString.push('11');
                    this.statFilter = [{ value: 'All', prop: 'All', checked: false, disabled: false }, { value: 'Pending Followup', prop: 'Pending', checked: false, disabled: false }, { value: 'Open', prop: 'Open', checked: false, disabled: false }, { value: 'In_Progress', prop: 'In_Progress', checked: false, disabled: false }, { value: 'Registered', prop: 'Registered', checked: true, disabled: false }, { value: 'Student_Admitted', prop: 'Student_Admitted', checked: false, disabled: false }, { value: 'Inactive', prop: 'Inactive', checked: false, disabled: false }, { value: 'Walkin', prop: 'Walkin', checked: false, disabled: false }];
                    this.instituteData = { name: "", phone: "", email: "", enquiry_no: "", commentShow: 'false', priority: "", status: -1, filtered_statuses: "11", follow_type: "", followUpDate: "", enquiry_date: "", assigned_to: -1, standard_id: -1, subjectIdArray: null, master_course_name: '', courseIdArray: null, subject_id: -1, is_recent: "Y", slot_id: -1, filtered_slots: "", isDashbord: "N", enquireDateFrom: this.getDateFormated(fromDate, "YYYY-MM-DD"), enquireDateTo: this.getDateFormated(toDate, "YYYY-MM-DD"), updateDate: "", updateDateFrom: "", updateDateTo: "", start_index: 0, batch_size: this.varJson.displayBatchSize, closedReason: "", enqCustomLi: null };
                    this.loadTableDatatoSource(this.instituteData);
                }
                    break;

                default:
                // console.log(filter);


            }
        }
    }

    showApproveButtons(data) {
        let enableApprove = sessionStorage.getItem('allow_sms_approve_feature');
        const permissionArray = sessionStorage.getItem('permissions');
        if (permissionArray == "" || permissionArray == null) {
            if (enableApprove == '1' && data.statusValue == "Open") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    approveRejectSms(data, statusCode) {
        console.log("Approve", data);
        let msg: any = "";
        if (statusCode == 1) {
            msg = "approve";
        } else {
            msg = "reject";
        }
        if (confirm('Are you sure, You want  to ' + msg + ' the message?')) {
            this.prefill.changesSMSStatus({ 'status': statusCode }, data.message_id).subscribe(
                res => {
                    let msg = { title: '' }
                    if (statusCode == 1) {
                        msg.title = "SMS Approved"
                    } else {
                        msg.title = "SMS Rejected";
                    }
                    this.smsServicesInvoked();
                    this.showErrorMessage(this.messageService.toastTypes.success, msg.title, '');
                },
                err => {
                    this.showErrorMessage(this.messageService.toastTypes.error, '', err.error.message);
                }
            )
        }
    }

    // Advance filter City Selection
    onCitySelection(event) {
        this.areaList = [];
        if (event != "") {
            let obj = {
                city: event
            }
            this.prefill.getAreaList(obj).subscribe(
                res => {
                    this.areaList = res;
                },
                err => {
                    //console.log(err);
                }
            )
        }
    }

    // This function gives you full information of enquiry selected which is fetched from server
    completeEnquiryDeatils(event) {
        this.selectedRow.gender = event.gender;
        this.selectedRow.institute_enquiry_id = event.institute_enquiry_id;
        this.selectedRow.school_id = event.school_id;
        if (this.flagJSON.isProfessional) {
            this.selectedRow.standard_id = event.standard_id;
        } else {
            this.selectedRow.master_course_name = event.master_course_name;
        }
    }

    // toast function
    showErrorMessage(objType, massage, body) {
        this._commService.showErrorMessage(objType, massage, body);
    }

    // Customizable Table Function

    setDefaultValues() {
        this.tableSetting.keys = [
            { primaryKey: 'enquiry_no', header: 'ENQ No', priority: 1, allowSortingFlag: true },
            { primaryKey: 'name', header: 'Name', priority: 2, allowSortingFlag: true },
            { primaryKey: 'phone', header: "Contact No", priority: 3, allowSortingFlag: true },
            { primaryKey: 'statusValue', header: 'Status', priority: 4, allowSortingFlag: true },
            { primaryKey: 'priority', header: 'Priority', priority: 5, allowSortingFlag: true },
            { primaryKey: 'source_name', header: 'Source', priority: 6, allowSortingFlag: true },
            { primaryKey: 'followUpDate', header: 'Follow up Date', priority: 7, allowSortingFlag: true },
            { primaryKey: 'updateDate', header: 'Last Updated', priority: 8, allowSortingFlag: true }
        ];
        this.displayKeys = this.tableSetting.keys;
        this._tablePreferencesService.setTablePreferences(this.tableSetting.tableDetails.key, this.displayKeys);
    }

    openPreferences() {
        this.flagJSON.showPreference = true;
    }

    closePreferncesPopup(obj: any) {
        console.log(obj);
        this.flagJSON.showPreference = false;
        if (obj != undefined) {
            if (obj.hasOwnProperty('displayKeys')) {
                this.displayKeys = obj.displayKeys.sort((a, b) => {
                    return a.priority - b.priority
                });
            }
            this.cd.markForCheck();
        }
    }

    fetchDataForCountryDetails() {
        let encryptedData = sessionStorage.getItem('country_data');
        let data = JSON.parse(encryptedData);
        if (data && data.length > 0) {
            this.countryList = data;
        }
    }

    getStateList() {
        this.stateList = [];
        this.cityDetails = [];
        this.advancedFilterForm.state_id = "-1";
        this.advancedFilterForm.city_id = "-1";
        if (this.advancedFilterForm.country_id != -1) {
            const url = `/api/v1/country/state?country_ids=${this.advancedFilterForm.country_id}`
            this.auth.showLoader();
            this.httpService.getData(url).subscribe(
                (res: any) => {
                    this.auth.hideLoader();
                    if (res.result && res.result.length > 0) {
                        this.stateList = res.result[0].stateList;
                    }
                },
                err => {
                    this.auth.hideLoader();
                    this.showErrorMessage(this.messageService.toastTypes.error, '', err.error.message);
                }
            )
        }
    }

    // get city list as per state selection
    getCityList() {
        this.cityList = [];
        this.advancedFilterForm.city_id = "-1";
        if (this.advancedFilterForm.state_id != -1) {
            const url = `/api/v1/country/city?state_ids=${this.advancedFilterForm.state_id}`
            this.auth.showLoader();
            this.httpService.getData(url).subscribe(
                (res: any) => {
                    this.auth.hideLoader();
                    if (res.result.length > 0) {
                        this.cityDetails = res.result[0].cityList;
                    }
                },
                err => {
                    this.auth.hideLoader();
                    this.showErrorMessage(this.messageService.toastTypes.error, '', err.error.message);
                }
            )
        }
    }

}
