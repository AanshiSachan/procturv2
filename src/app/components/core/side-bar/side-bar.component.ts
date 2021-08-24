import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { role } from '../../../model/role_features';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { LoginService } from '../../../services/login-services/login.service';
import { MultiBranchDataService } from '../../../services/multiBranchdata.service';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { HttpService } from '../../../services/http.service';
declare var $;


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild('divAdminTag', { static: true }) divAdminTag: ElementRef;
  @ViewChild('divMyAccountTag', { static: true }) divMyAccountTag: ElementRef;
  @ViewChild('divMasterTag', { static: true }) divMasterTag: ElementRef;
  @ViewChild('divProfileTag', { static: true }) divProfileTag: ElementRef;
  @ViewChild('divTeacherTag', { static: true }) divTeacherTag: ElementRef;
  @ViewChild('divSlotTag', { static: true }) divSlotTag: ElementRef;
  @ViewChild('divClassRoomTag', { static: true }) divClassRoomTag: ElementRef;
  @ViewChild('divManageTag', { static: true }) divManageTag: ElementRef;
  @ViewChild('divAcademicTag', { static: true }) divAcademicTag: ElementRef;
  @ViewChild('divGradesTag', { static: true }) divGradesTag: ElementRef;
  @ViewChild('divManageUsers', { static: true }) divManageUsers: ElementRef;
  @ViewChild('divSettingTag', { static: true }) divSettingTag: ElementRef;
  @ViewChild('divGeneralSettingTag', { static: true }) divGeneralSettingTag: ElementRef;
  @ViewChild('divManageFormTag', { static: true }) divManageFormTag: ElementRef;
  @ViewChild('divAreaAndMap', { static: true }) divAreaAndMap: ElementRef;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  @ViewChild('seachResult', { static: true }) seachResult: ElementRef;
  @ViewChild('form', { static: true }) form: any;

  @Output() searchViewMore = new EventEmitter<any>();
  @Output() enquiryUpdateAction = new EventEmitter<any>();
  @Output() hideSearchPopup = new EventEmitter<any>();
  @Output() changePassword = new EventEmitter<any>();
  permissionData: any[] = [];
  enquiryResult: any[] = [];
  showExpenseToDo: boolean = false;
  showToDo: boolean = false;
  showExpenses: boolean = false;
  isRippleLoad: boolean = false;
  studentResult: any[] = [];
  branchesList: any = [];
  userType: any = '';
  mainBranchId: any = "";
  permissions: any;
  permissionArray = sessionStorage.getItem('permissions');
  isMainBranch: any = "N";
  checkAdmin: any = "";
  instituteId: any;
  activeSession: any;
  resultStat: any = 1;
  teacherId: any = 0;
  sideBar: boolean = false;
  searchBar: boolean = false;
  helpMenu: boolean = false;
  isLangInstitute: boolean = false;
  showMainBranchBackBtn: boolean = false;
  isProfessional: boolean = false;
  menuToggler: boolean = false;
  isResultDisplayed: boolean = false;
  instituteName: string;
  userName: string;
  inputValue: any;
  settings: string;
  manageExamGrades: string = "";
  private userInput: string;
  videoplayer: boolean = false;
  privacy: any = false;
  facultyAccount: boolean = false;
  globalSearchForm: any = {
    name: '',
    phone: '',
    instituteId: sessionStorage.getItem('institute_id'),
    start_index: '0',
    batch_size: '6'
  };
  contact_no:any = '';

  jsonFlags = {
    isAdminforPayroll: false,
    isAdminforLeave:false,
    isAdminforSmsGateway:false,
    isShowLead: false,
    isShowStudent: false,
    isShowModel: false,
    isShowFee: false,
    isShowLiveclass: false,
    isShowLibrabry: false,
    isShoweStore: false,
    isShoweOnlineExam: false,
    isAdmin: false,
    isShowPowerBy: false,
    isShowExpense: false,
    isShowCourse: false,
    isShowLeave: false
  }
  jsonCourseFlags = {
    isShowSetup: false,
    isShowFileManager: false,
    isShowArchiving: false,
    isShowModel: false,
    isShowClass: false,
    isShowExam: false,
    isShowClassPlanner: false,
    isShowEcourseMapping: false,
    isEcourseFileManager: false,
    isShowOnlineAssignment: false
  }
  jsonRolesFlags = {
    isShowManageEnquiry: false,
    isShowDataSetup: false,
    isShowCampaign: false,
    isShowCampaignReport: false,
    isShowAddCampaign: false,
    isShowAddEnquiry: false,
    isShowReport: false
  }
  is_tax_enabled: any;
  // Changes done by Nalini - To handle role based conditions
  jsonFeesFlags = {
    moduleState: '',
    isFeeManageCheque: false,
    isAdmin: false,
    isProfitnloss: false,
    isFeeDues: false,
    isPaymentHistory: false,
    isCourseWise: false,
    isGstReport: false,
    isMonitoringDash: false,
    isOnlineFees: false
  }
  jsonCommunicateFlags = {
    communicateMenu: false,
    showSMSReport: false,
    showEmailReport: false,
    showPTM: false,
    showEvents: false
  }
  jsonEstoreFlags = {
    isEstoreMenu: false,
    isManageProduct: false,
    isManageOffer: false,
    isRegisterUser: false,
    isSalesReport: false,
    isCouponReport: false
  }
  showSMSSetting: boolean = false;
  showManageRole: boolean = false;
  role_feature = role.features;
  Role_features: role = new role();

  tax_type_without_percentage: String;
  enable_online_payment: string = "";
  enable_client_website: boolean = false;
  schoolModel: boolean = false;
  is_zoom_integration_enable: boolean = false;
  custom_text_for_power_by_proctur:any = '';
  //showMaximizedPopup1:boolean = true;
  showMaximizedPopup:boolean = true;
  user_name:any='';
  constructor(
    private auth: AuthenticatorService,
    private log: LoginService,
    private router: Router,
    private fetchService: FetchprefilldataService,
    private multiBranchService: MultiBranchDataService,
    private commonService: CommonServiceFactory,
    private cd: ChangeDetectorRef,
    private httpService: HttpService
  ) {
    this.auth.schoolModel.subscribe(
      res => {
        this.schoolModel = false;
        if (res) {
          this.schoolModel = true;
        }
      }
    )
  }

  ngOnInit() {
    this.settings = sessionStorage.getItem('is_exam_grad_feature');
    this.instituteName = sessionStorage.getItem('institute_name');
    this.userName = sessionStorage.getItem('name');
    this.instituteId = sessionStorage.getItem('institute_id');
    this.user_name = sessionStorage.getItem('username');
    this.log.currentUserType.subscribe(e => {
      if (e == '' || e == null || e == undefined) {
      }
      else {
        this.userType = e
      }
    });

    this.auth.institute_type.subscribe(
      res => {
        if (res === 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    console.log("isProfessional", this.isProfessional);
    this.log.currentPermissions.subscribe(e => {
      if (e == '' || e == null || e == undefined) {
      }
      else {
        this.permissionData = JSON.parse(e);
      }
    });

    this.log.currentUsername.subscribe(res => {
      this.createCustomSidenav();
    });
    this.custom_text_for_power_by_proctur = sessionStorage.getItem('custom_text_for_power_by_proctur');
    this.log.poweredByStatus.subscribe(res => {
      let result: any = res;
      if (result == 1) {
        this.jsonFlags.isShowPowerBy = true;
      }
      else {
        this.jsonFlags.isShowPowerBy = false;
      }
    });

    this.form.valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(data => {
        this.userInput = data.userInput;
        this.enquiryResult = [];
        this.studentResult = [];
        this.filterGlobal(data.userInput)
      });

    this.checkUserHadAccess();
    this.checkInstituteType();
    this.checkManinBranch();
    this.privacy = JSON.parse(sessionStorage.getItem('privacy_alert'));
    // var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();

    // (function(){  

    // var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];

    // s1.async=true;

    // s1.src='https://embed.tawk.to/5fd31bf7df060f156a8bfc37/1ep9alk8n';

    // s1.charset='UTF-8';

    // s1.setAttribute('crossorigin','*');

    // s0.parentNode.insertBefore(s1,s0);

    // })();

    // var $zoho = $zoho || {};
    // $zoho.salesiq = $zoho.salesiq || { widgetcode: "c165a84d5f33a8c8881dd9349ebf02c00e78a8b69f169ab2a3ef7c92aaed2b8abbee2865a1f989b1aefa10a127937fae", values: {}, ready: function () { } };
    // var d = document;
    // var s = d.createElement("script"); s.type = "text/javascript";
    // s.id = "zsiqscript"; s.defer = true;
    // s.src = "https://salesiq.zoho.com/widget";
    // var t = d.getElementsByTagName("script")[0];
    // t.parentNode.insertBefore(s, t); d.write("<div id='zsiqwidget'></div>");
    if(sessionStorage.getItem('userType') == '3') {
      this.facultyAccount = true;
    }
    if (sessionStorage.getItem('enable_online_assignment_feature') == '1') {
      this.jsonCourseFlags.isShowOnlineAssignment = true;
    }
    let zoom = sessionStorage.getItem('is_zoom_enable');
    this.is_zoom_integration_enable = JSON.parse(zoom);
    $(document).ready(function() {
      $('.sidebar-wrapper').css('width','14.5%');
      $('.dropdown'). hover(
       function(){
           $('.sidebar-wrapper').css('width','26.5%');
       },
       function(){
        $('.sidebar-wrapper').css('width','14.5%');
    });
  });
   if(sessionStorage.getItem('userType') == '0' && sessionStorage.getItem('username') == 'admin'){
     this.jsonFlags.isAdminforSmsGateway = true;
   }else{
     this.jsonFlags.isAdminforSmsGateway = false;
   }

if (sessionStorage.getItem('userType') == '0' && sessionStorage.getItem('username') == 'admin') {
  this.jsonFlags.isAdminforLeave = true;
} else {
  this.jsonFlags.isAdminforLeave = false;
}
// =======payrollAccess===========
if(sessionStorage.getItem('userType') =='0' && sessionStorage.getItem('username') == 'admin' || sessionStorage.getItem('userType')=='0' && sessionStorage.getItem('username') != 'admin'){
  this.jsonFlags.isAdminforPayroll = true;
}else{
  this.jsonFlags.isAdminforPayroll = false;
}
// if(sessionStorage.getItem('showSMSService') == 'true' && !this.isProfessional) {
//   $('#releaseNote').modal('show');
// }
$('#modalapp1').modal('show');
// ============end==============
}
  ngAfterViewInit() {
    this.setActiveClassOnSideNav();
    // Patch added for specific institute to show only Home and Lead module
    // Added by Swapnil
    if (this.instituteId == "101317") {
      this.accessToHomeAndLead();
    }
  }

  ngOnDestroy() {
    // sessionStorage.removeItem('showSMSService');
  }

  mouseenter(cond) {
  if(cond) {
    $('.sidebar-wrapper').css('width','26.5%');
  }
}

mouseleave() {
  $('.sidebar-wrapper').css('width','14.5%');
}

  checkpermissinForLeadDetails() {
    let userType = sessionStorage.getItem('userType');
    let username = sessionStorage.getItem('username');
    let array = Object.keys(this.jsonRolesFlags);
    if (sessionStorage.getItem('permissions') == '' && userType == '0' && username == 'admin') {// user role is admin
      array.forEach((flag) => {
        this.jsonRolesFlags[flag] = true;
      });
    }
    else {
      array.forEach((flag) => {
        this.jsonRolesFlags[flag] = false;
      });
      // quick enquiry  --110
      if (this.role_feature.LEAD_MANAGE_ENQUIRY) {
        this.jsonRolesFlags.isShowManageEnquiry = true;
        this.jsonRolesFlags.isShowAddEnquiry = true;
      }
      if (this.role_feature.LEAD_MANAGE_CAMPAIGN) {
        this.jsonRolesFlags.isShowCampaign = true;
      }
      if (this.role_feature.REPORTS_ENQUIRY_CAMPAIGN) {
        this.jsonRolesFlags.isShowCampaignReport = true;
      }
      // enquiry  report --722
      if (this.role_feature.REPORTS_ENQUIRY_REFFER_BY
        || this.role_feature.REPORTS_ENQUIRY_SOURCE || this.role_feature.REPORT_ENQUIRY_COUNSELLOR) {
        this.jsonRolesFlags.isShowReport = true;
      }

    }
  }
  checkCoursePermissions() {
    let perm = sessionStorage.getItem('permissions');
    let userType = sessionStorage.getItem('userType');
    const permissionArray = sessionStorage.getItem('permissions');
    const permittedRoles = sessionStorage.getItem('permitted_roles');
    if ((userType == '0') && ((perm == null || perm == undefined || perm == ''))) {
      this.jsonFlags.isShowCourse = true;
      let array = Object.keys(this.jsonCourseFlags);
      array.forEach((flag) => {
        this.jsonCourseFlags[flag] = true;
      })
    }
    // else if ((userType == '3')) {
    //   this.jsonCourseFlags.isShowModel = false;
    //   this.jsonFlags.isShowCourse = true;
    //   this.jsonCourseFlags.isShowArchiving = false;
    //   let array = ['isShowFileManager', 'isShowExam', 'isShowClass', 'isShowClassPlanner'];

    //   array.forEach((flag) => {
    //     this.jsonCourseFlags[flag] = true;
    //   });
    // }
    else {
      this.jsonCourseFlags.isShowModel = true;
      if (this.role_feature.STUDY_MATERIAL_MENU) {
        this.jsonCourseFlags.isShowFileManager = true;
      }
      // Changes done by Nalini - To handle role based conditions
      if (this.role_feature.CLASS_MENU) {
        this.jsonCourseFlags.isShowClass = true;
        this.jsonFlags.isShowCourse = true;
        this.jsonCourseFlags.isShowClassPlanner = true;
      }
      if (this.role_feature.EXAMS_MENU) {
        this.jsonCourseFlags.isShowExam = true;
        // this.jsonFlags.isShowCourse = true;
      }
    }
    if (userType == '0' && (permissionArray == "" || permissionArray == null)) {
      this.jsonCourseFlags.isShowEcourseMapping = true;
    }

    if (sessionStorage.getItem('enable_elearn_course_mapping_feature') == '1') {
      this.jsonCourseFlags.isShowEcourseMapping = true;
    }

    if (this.role_feature.STUDY_MATERIAL_MENU && sessionStorage.getItem('enable_eLearn_feature') == '1') {
      this.jsonCourseFlags.isEcourseFileManager = true;
    }

    this.jsonCourseFlags.isShowOnlineAssignment = false;
    if (sessionStorage.getItem('enable_online_assignment_feature') == '1') {
      this.jsonCourseFlags.isShowOnlineAssignment = true;
    }
    // if (this.role_feature.SETUP_MENU) {
    //   this.jsonFlags.isShowCourse = true;
    // }
  }

  checkpermissionOfCommunicate() {
    this.userType = Number(sessionStorage.getItem('userType'));
    this.permissionArray = sessionStorage.getItem('permissions');
    if (sessionStorage.getItem('userType') == '0' && sessionStorage.getItem('username') != 'admin') {
      if (sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null) {
        this.permissions = JSON.parse(sessionStorage.getItem('permissions'));
        // Changes done by Nalini - To handle role based commuicate menu conditions
        this.jsonCommunicateFlags.showSMSReport = (this.role_feature.REPORT_MISC_SMS) ? true : false;//sms visiblity
        this.jsonCommunicateFlags.showEmailReport = (this.role_feature.REPORTS_MISC_EMAIL) ? true : false; //email visiblity
        this.jsonCommunicateFlags.communicateMenu = this.role_feature.COMMUNICATE_MENU;
        this.jsonCommunicateFlags.showEvents = this.role_feature.COMMUNICATE_EVENTS;
        this.jsonCommunicateFlags.showPTM = this.role_feature.COMMUNICATE_PTM;
      }
    }
    else {
      let array = Object.keys(this.jsonCommunicateFlags);
      array.forEach((flag) => {
        this.jsonCommunicateFlags[flag] = true;
      });
    }
    if (this.userType == 3) {
      this.jsonCommunicateFlags.showSMSReport = (this.role_feature.REPORTS_MENU && this.role_feature.REPORT_MISC_SMS) ? true : false;//sms visiblity
      this.jsonCommunicateFlags.showEmailReport = (this.role_feature.REPORTS_MENU && this.role_feature.REPORTS_MISC_EMAIL) ? true : false; //email visiblity
      this.jsonCommunicateFlags.communicateMenu = this.role_feature.COMMUNICATE_MENU;
      this.jsonCommunicateFlags.showEvents = this.role_feature.COMMUNICATE_EVENTS;
      this.jsonCommunicateFlags.showPTM = this.role_feature.COMMUNICATE_PTM;
    }
  }
  checkPermissionForFees() {
    this.tax_type_without_percentage = sessionStorage.getItem('tax_type_without_percentage');
    this.is_tax_enabled = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    this.enable_online_payment = sessionStorage.getItem('enable_online_payment_feature');
    const userType = sessionStorage.getItem('userType');
    // if (userType == '3') {
    //   this.jsonFeesFlags.isAdmin = false;
    //   this.jsonFeesFlags.isProfitnloss = false;
    // }
    if (userType == '0') {
      if (sessionStorage.getItem('permissions') == "" || sessionStorage.getItem('permissions') == null) {
        this.jsonFeesFlags.isAdmin = true;
        this.jsonFeesFlags.isProfitnloss = true;
        let array = Object.keys(this.jsonFeesFlags);
        array.forEach((flag) => {
          this.jsonFeesFlags[flag] = true;
        });
      }
    }
    if (sessionStorage.getItem('permissions')) {
      let permissions = JSON.parse(sessionStorage.getItem('permissions'));

      if (this.role_feature.FEE_CHEQUE_MANAGE) {
        this.jsonFeesFlags.isFeeManageCheque = true;
      }
      // Changes done by Nalini - To handle role based fee menu conditions
      this.jsonFeesFlags.isFeeDues = this.role_feature.FEE_DUE_DETAILS;
      this.jsonFeesFlags.isPaymentHistory = this.role_feature.FEE_PAYMENT_HISTORY
      this.jsonFeesFlags.isCourseWise = this.role_feature.REPORT_ENQUIRY_COURSE_WISE;
      this.jsonFeesFlags.isMonitoringDash = this.role_feature.REPORT_FEE_MONITORING_DASHBOARD;
      this.jsonFeesFlags.isGstReport = this.role_feature.REPORT_FEE_GST_REPORT;
      this.jsonFeesFlags.isOnlineFees = this.role_feature.REPORT_FEES_ONLINE_FEES;

    }

    if (userType == '3') {
        this.jsonFeesFlags.isAdmin = false;
        this.jsonFeesFlags.isProfitnloss = false;
      }

    if (sessionStorage.getItem('userType') == '0') {
      if (sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == '') {
        this.jsonFeesFlags.isFeeManageCheque = true;
        this.jsonFeesFlags.isProfitnloss = true;

      }
    }
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') { ///batch 
          this.jsonFeesFlags.moduleState = 'Batch';
        } else { ///course
          this.jsonFeesFlags.moduleState = 'Course';
        }
      }
    )
  }

  hideForUsers() {
    // if (sessionStorage.getItem('userType') == '0') {
      if (sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == '') {
        return true;
      } else if (this.role_feature.MY_ACCOUNTS_MENU) {
        return true;
      } else {
      return false;
    }
  }
  // USER permission
  checkUserHadAccess() {
    this.enable_client_website = (sessionStorage.getItem('enable_client_website') == 'true');
    // this.divProfileTag.nativeElement.style.display = 'none';
    const permissionArray = sessionStorage.getItem('permissions');
    const usertype = sessionStorage.getItem('userType');
    if (permissionArray == null || permissionArray == "") {
      if (usertype == '0') {
        this.jsonFlags.isAdmin = true;
        this.showSMSSetting = true;
        this.showManageRole = true;
        this.showAllFields();       // Swapnil
      }
      else if (usertype == '3') {
        this.jsonFlags.isAdmin = true;
        this.jsonFlags.isShowFee = false;
        this.hideAllFields();     // Swapnil
        this.teacherId = JSON.parse(sessionStorage.getItem('institute_info')).teacherId;
        this.setNativeElementValue(['divMyAccountTag'], '');
        // this.showManageRole = true;
        // this.showSMSSetting = true;
        this.enable_client_website = false;
      }
    } else {
      if (permissionArray != undefined) {
        this.setNativeElementValue(['divMasterTag'], 'none');
        if (this.role_feature.SETTINGS_MENU) {
          this.showSMSSetting = true;
        }
        this.showManageRole = this.role_feature.USERS_MENU;

        // if (this.role_feature.SETUP_MENU) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divTeacherTag.nativeElement.style.display = '';
          // this.setNativeElementValue(['divMasterTag', 'divTeacherTag'], '');      // Swapnil
          // this.setNativeElementValue(['divMasterTag'], '');      // Swapnil
        // }
        if (this.role_feature.FEE_MENU) {
          this.jsonFlags.isShowFee = true;
          this.setNativeElementValue(['divMasterTag'], '');       // Swapnil
        }
        // if (this.role_feature.SETUP_MENU && this.isProfessional) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divSlotTag.nativeElement.style.display = '';
          // this.setNativeElementValue(['divMasterTag', 'divSlotTag'], '');       // Swapnil
          this.setNativeElementValue(['divMasterTag'], '');       // Swapnil
        // }
        // if (this.role_feature.SETUP_MENU) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divAcademicTag.nativeElement.style.display = '';
          // this.setNativeElementValue(['divMasterTag', 'divAcademicTag'], '');      // Swapnil
          // this.setNativeElementValue(['divMasterTag'], '');      // Swapnil
        // }
        if (this.role_feature.MY_ACCOUNTS_MENU) {
          // this.divSettingTag.nativeElement.style.display = '';
          // this.divMyAccountTag.nativeElement.style.display = '';
          this.setNativeElementValue(['divSettingTag', 'divMyAccountTag'], '');      // Swapnil
        }
        if (this.role_feature.SETTINGS_MENU) {
          // this.divSettingTag.nativeElement.style.display = '';
          // this.divGeneralSettingTag.nativeElement.style.display = '';
          // this.setNativeElementValue(['divSettingTag', 'divGeneralSettingTag'], '');      // Swapnil
          this.setNativeElementValue(['divSettingTag'], '');      // Swapnil

        }
        else {
          this.setNativeElementValue(['divSettingTag'], 'none');
        }

        // if (permissionArray.indexOf('115') != -1) {
        // this.divManageFormTag.nativeElement.style.display = '';
        // this.divAreaAndMap.nativeElement.style.display = '';
        // this.setNativeElementValue(['divAreaAndMap'], '');       // Swapnil
        // }
        if (this.role_feature.USERS_MENU) {
          // this.divManageUsers.nativeElement.style.display = '';
          this.setNativeElementValue(['divManageUsers'], '');       // Swapnil
        } else {
          this.setNativeElementValue(['divManageUsers'], 'none');
        }
      }
    }
  }

  accessToHomeAndLead() {
    this.jsonFlags.isShowStudent = false;
    this.jsonFlags.isShowModel = false;
    this.jsonFlags.isShowFee = false;
    this.jsonFlags.isShowLiveclass = false;
    this.jsonCommunicateFlags.communicateMenu = false;
    this.jsonFlags.isShowLibrabry = false;
    this.jsonFlags.isShoweStore = false;
    this.jsonFlags.isShoweOnlineExam = false;
    this.jsonFlags.isAdmin = false;
    this.jsonFlags.isShowPowerBy = false;
    this.jsonFlags.isShowLead = true;
    this.jsonFlags.isShowCourse = false;
  }

  setActiveClassOnSideNav() {
    // this.RemoveActiveTabs();
    let pathLastURL;
    var str = window.location.href;
    var res = str.substring(str.lastIndexOf("/view") + 6, str.length);
    pathLastURL = res;
    var get_module_name = res.substring(0, res.indexOf("/"));
    if (get_module_name != '') {
      pathLastURL = get_module_name;
    }

    console.log(pathLastURL);
    let routesData = {
      'home': 'lizero',
      'leads': 'lione',
      'students': 'litwo',
      'students/add': 'litwo',
      'course': 'lithree',
      'batch': 'lithree',
      'fee': 'lifour',
      'live-classes': 'lifive',
      'communicate': 'lisix',
      'library': 'liseven',
      'e-store': 'lieight',
      'online-exam': 'linine',
      'expense': 'liten',
      'website-configuration': 'liwebsiteConf',
      'dashboard': 'litwelve',
      'online-assignment': 'lithirteen',
      'contentlibrary': 'liforteen'
    };
    if (document.getElementById(routesData[pathLastURL])) {
      this.activeSession = routesData[pathLastURL];
    }
  }


  showAllFields() {
    // let array = ['divMyAccountTag', 'divMasterTag', 'divTeacherTag',  'divAcademicTag',
    //   'divSettingTag', 'divGeneralSettingTag', 'divManageFormTag', 'divManageUsers', 'divClassRoomTag'];
    let array = ['divMyAccountTag', 'divMasterTag', 'divSettingTag', 'divManag', 'divManageUsers'];
    this.setNativeElementValue(array, '');
    // if (this.settings == '1') {
    //   this.divGradesTag.nativeElement.style.display = '';
    // } else {
    //   this.divGradesTag.nativeElement.style.display = 'none';
    // }
    // if (this.isProfessional) {
    //   this.divSlotTag.nativeElement.style.display = '';
    // }
    // else if (!this.isProfessional) {
    //   this.divSlotTag.nativeElement.style.display = 'none';
    // }   // Swapnil
  }

  hideAllFields() {
    // let array = ['divMyAccountTag', 'divMasterTag', 'divTeacherTag',
    //   'divSlotTag', 'divAcademicTag', 'divSettingTag', 'divGeneralSettingTag', 'divManageFormTag',
    //   'divAreaAndMap', 'divManageUsers', 'divGradesTag', 'divClassRoomTag', 'divManageTag'];
    let array = ['divMyAccountTag', 'divMasterTag', 'divSettingTag', 'divManageUsers'];
    this.setNativeElementValue(array, 'none');
  }

  setNativeElementValue(tagArray: any[], value) {
    for (let index in tagArray) {
      if (this[tagArray[index]]) {
        this[tagArray[index]].nativeElement.style.display = value;
      }
    }
  }

  checkManinBranch() {
    this.auth.isMainBranch.subscribe(
      (value: any) => {
        if (this.isMainBranch != value) {
          this.isMainBranch = value;
          if (this.isMainBranch == "Y") {
            this.multiBranchInstituteFound();
          }
        }
      }
    )

    this.checkToShowMultiBranch();

    this.multiBranchService.subBranchSelected.subscribe(
      res => {
        this.showMainBranchBackBtn = res;
      }
    )

  }

  // Multi Branch Case Handling
  multiBranchInstituteFound() {
    this.mainBranchId = sessionStorage.getItem('institute_id');
    this.multiBranchService.getAllBranches().subscribe(
      res => {
        this.branchesList = res;
        console.log("this.branchesList", this.branchesList);
      },
      err => {

      }
    )
  }

  checkToShowMultiBranch() {
    this.log.currentUserType.subscribe(
      res => {
        if (res == '3') {
          this.checkAdmin = false;
        } else {
          if (this.commonService.checkUserIsAdmin()) {
            this.checkAdmin = true;
          } else {
            this.checkAdmin = false;
            this.checkAdmin = this.role_feature.MANAGE_BRANCHES_MENU;
          }
        }
      }
    )
  }

  validateUsertypePermissionData() {
    let p = sessionStorage.getItem('permissions');
    let e = sessionStorage.getItem('userType');
    if (p == '' || p == null || p == undefined) {
      this.permissionData = [];
    }
    if (p != '' && p != null && p != undefined) {
      this.permissionData = JSON.parse(p);
      this.log.changePermissions(p);
    }
    if (e == '' || e == null || e == undefined) {
      this.userType = 0;
    }
    else if (e != '' && e != null && e != undefined) {
      this.userType = e;
      this.log.changeUserType(e);
    }
  }

  //changes by laxmi
  createCustomSidenav() {
    let p = sessionStorage.getItem('permissions');
    let e = sessionStorage.getItem('userType');
    this.checkDefaultData(p, e);
    let userType: any = this.userType;
    let permission: any = this.permissionData;
    let type = Number(sessionStorage.getItem('institute_setup_type'));
    /* Admin or Custom login */
    if (userType == 0) {
      /* admin detected */
      if (permission == null || permission == undefined || permission == '') {
        this.jsonFlags.isAdmin = true;
        let flagsArray = Object.keys(this.jsonFlags);
        flagsArray.forEach(object => {
          this.jsonFlags[object] = true;
        });
      }
      else {
        /* custom user detected */
        /* array to store the user permissions, if the permission length is less than equal to one
        remove the first and last char and validate if its admin or not */
        this.hasLead(this.permissionData);
        this.hasStudent(this.permissionData);
        // this.hasCourse(this.permissionData);
        // this.hasProducts(this.permissionData);
      }

    }
    else if (userType == 3) {
      /* Teacher login detected */
      this.jsonFlags.isAdmin = false;
      this.hasLead(this.permissionData);
      this.hasStudent(this.permissionData);
      // this.teacherLoginFound();
    }

    // please dont chnage this  code from here
    // check these new feature is enable for institute or not
    this.isOnlineExamAllow(type); // check online test is enable or not
    this.isLiveClassesAllow(type);
    this.isElearnAllow(this.permissionData);
    this.isLibraryFeatureAllow(permission); // check librabry feature
    this.isExpenseFeatureAllow();
    this.checkpermissinForLeadDetails();
    this.checkCoursePermissions();
    this.checkPermissionForFees();
    this.checkpermissionOfCommunicate();
  }

  // checkPermissionsForCourse(){
  //   let perm = sessionStorage.getItem('permissions');
  //   let userType = sessionStorage.getItem('userType');
  //    if ((userType=='0')&&((perm == null || perm == undefined || perm == ''))){
  //      let array = Object.keys( this.jsonFlags);
  //      array.forEach((flag)=>{
  //        this.jsonFlags[flag]= true;
  //      })
  //    }
  //    else if((userType=='3')){
  //      this.jsonFlags.isShowModel = false;
  //      this.jsonFlags.isShowArchiving = false;
  //       let array = ['isShowFileManager','isShowExam','isShowClass','isShowClassPlanner'];

  //        array.forEach((flag)=>{
  //          this.jsonFlags[flag]=true;
  //        });         
  //    }
  //    else{
  //      this.jsonFlags.isShowModel = true;
  //      if (perm.includes('114')) {
  //        this.jsonFlags.isShowFileManager = true;
  //      }

  //      if (perm.includes('701')) {
  //        this.jsonFlags.isShowClass = true;
  //      }
  //      if (perm.includes('702')) {
  //        this.jsonFlags.isShowExam = true;
  //      }
  //      if (perm.includes('704')) {
  //        this.jsonFlags.isShowClassPlanner = true;
  //      }
  //    }
  //  }
  // check only default values
  checkDefaultData(p, e) {
    if (p == '' || p == null || p == undefined) {
      this.permissionData = [];
    }
    if (p != '' && p != null && p != undefined) {

      this.permissionData = JSON.parse(p);
      this.log.changePermissions(p);
    }
    if (e == '' || e == null || e == undefined) {
      this.userType = 0;
    }
    if (e != '' && e != null && e != undefined) {
      this.userType = e;
      this.log.changeUserType(e);
    }
  }

  isLibraryFeatureAllow(permission) {
    this.jsonFlags.isShowLibrabry = false;
    if (sessionStorage.getItem('enable_library_feature') == '1') {
      if (sessionStorage.getItem('userType') == '3' || (sessionStorage.getItem('userType') == '0' && sessionStorage.getItem('username') != 'admin')) {
        if (sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null) {
          this.jsonFlags.isShowLibrabry = this.role_feature.LIBRARY_MENU ? true : false;
        }
      } else {
        this.jsonFlags.isShowLibrabry = true;
      }
    }
  }

  isExpenseFeatureAllow() {
  this.jsonFlags.isShowExpense = false;
    // developed by - Nalini 
    // Expenses option are showing in all user login so need to remove-Growth Academy - 101238
    if (sessionStorage.getItem('enable_expense_management') == '1') {
      this.jsonFlags.isShowExpense = true;
      // if (sessionStorage.getItem('userType') == '0' && sessionStorage.getItem('username') != 'admin') {
      //   if (sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null) {
      //     this.jsonFlags.isShowExpense = this.role_feature.EXPENSE_MENU ? true : false;
      //   }
      // } else {
        // this.jsonFlags.isShowExpense = true;
      // }
    }
    sessionStorage.setItem('isShowExpense', String(this.jsonFlags.isShowExpense));
  }

  isLiveClassesAllow(type) {
    this.jsonFlags.isShowLiveclass = false;
    // if user is not admin
    this.jsonFlags.isShowLiveclass = this.checkInstSetupType(type, 256);
    let zoom = sessionStorage.getItem('is_zoom_enable');
    if (JSON.parse(zoom)) {
      this.jsonFlags.isShowLiveclass = true;
    }
    if (this.jsonFlags.isShowLiveclass) {
      if (sessionStorage.getItem('userType') == '0' && sessionStorage.getItem('username') != 'admin') {
        this.jsonFlags.isShowLiveclass = false;
        if (sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null) {
          this.jsonFlags.isShowLiveclass = this.role_feature.LIVE_CLASS_MENU ? true : false;
        }
      } else {
        this.jsonFlags.isShowLiveclass = true;
        // if zoom is enable then also show live class // added by Swapnil
        let zoom = sessionStorage.getItem('is_zoom_enable');
        if (JSON.parse(zoom)) {
          this.jsonFlags.isShowLiveclass = true;
        }
      }
    }
    sessionStorage.setItem('isShowLiveclass', String(this.jsonFlags.isShowLiveclass));
  }

  isElearnAllow(permissions) {
    // this senction is used for enable elearn feature
    let array = Object.keys(this.jsonEstoreFlags);
    array.forEach((flag) => {
      this.jsonEstoreFlags[flag] = false;
    });
    if (sessionStorage.getItem('enable_eLearn_feature') == '1') {
      if (sessionStorage.getItem('userType') != '0' || sessionStorage.getItem('username') != 'admin') {
        if (sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null) {
          // Changes done by Nalini - To handle role based estore conditions
          this.jsonEstoreFlags.isEstoreMenu = this.role_feature.ESTORE_MENU;
          this.jsonEstoreFlags.isManageOffer = this.role_feature.ESTORE_MANAGE_OFFER;
          this.jsonEstoreFlags.isManageProduct = this.role_feature.ESTORE_MANAGE_PRODUCT;
          this.jsonEstoreFlags.isRegisterUser = this.role_feature.ESTORE_REGISTER_USER;
          this.jsonEstoreFlags.isSalesReport = this.role_feature.REPORT_PRODUCT_SALES;
          this.jsonEstoreFlags.isCouponReport = this.role_feature.REPORT_PRODUCT_COUPON;
        }
      } else {
        let array = Object.keys(this.jsonEstoreFlags);
        array.forEach((flag) => {
          this.jsonEstoreFlags[flag] = true;
        });
      }
    }
  }

  isOnlineExamAllow(type) {
    if (this.jsonFlags.isAdmin) {// if user is admin
      this.jsonFlags.isShoweOnlineExam = this.checkInstSetupType(type, 4);
    } else if (sessionStorage.getItem('userType') == '3' || (sessionStorage.getItem('userType') == '0' && sessionStorage.getItem('username') != 'admin')) {
      this.jsonFlags.isShoweOnlineExam = this.role_feature.ONLINE_TESTS_MENU;
    }
    sessionStorage.setItem('isShoweOnlineExam', String(this.jsonFlags.isShoweOnlineExam));
  }


  checkInstSetupType(value, role): boolean {
    if (value != 0) {
      var start = 2;
      var count = 1;
      while (start != value) {
        count++;
        start = start + 2;
      }
      var arr = [0, 0, 0, 0, 0, 0, 0, 0];
      var s = count.toString(2);
      var k = 0;
      for (var i = s.length - 1; i >= 0; i--) {
        arr[k] = parseInt(s.charAt(i));
        k++;
      }

      switch (role) {
        case 2:
          if (arr[0] == 1)
            return true;
          break;

        case 4:
          if (arr[1] == 1)
            return true;
          break;

        case 8:
          if (arr[2] == 1)
            return true;
          break;

        case 16:
          if (arr[3] == 1)
            return true;
          break;
        case 32:
          if (arr[4] == 1)
            return true;
          break;
        case 64:
          if (arr[5] == 1)
            return true;
          break;

        case 128:
          if (arr[6] == 1)
            return true;
          break;
        case 256:
          if (arr[7] == 1)
            return true;
          break;
        default: return false;
      }
      return false;

    }
    else {
      return false;
    }
  }

  /// loggedout user
  loggedout() {
    let flagsArray = Object.keys(this.jsonFlags);
    flagsArray.forEach(object => {
      this.jsonFlags[object] = false;
    })
    document.getElementById('lizero').classList.add('active');
  }

  hasLead(permissions) {
    this.jsonFlags.isShowLead = false;
    if (this.role_feature.LEAD_MENU_ITEM) {
      this.jsonFlags.isShowLead = true;
    }

  }

  hasStudent(permissions) {
    this.jsonFlags.isShowStudent = false;
    if (this.role_feature.STUDENT_MENU_ITEM) {
      this.jsonFlags.isShowStudent = true;
    }
  }

  hasCourse(permissions) {
    this.jsonFlags.isShowModel = false;
    this.jsonFlags.isShowCourse = false;
    if (this.role_feature.EXAMS_MENU ||
      this.role_feature.CLASS_MENU) {
      this.jsonFlags.isShowModel = true;
      this.jsonFlags.isShowCourse = true;
    }
  }


  hasProducts(permissions) {
    this.jsonFlags.isShoweStore = false;
    if (this.isProfessional) {
      if (this.role_feature.CLASS_MENU ||
        this.role_feature.SETUP_MENU || this.role_feature.CLASS_MENU ||
        this.role_feature.EXAMS_MENU) {
        this.jsonFlags.isShoweStore = true;
      }
    }
  }


  hasExam(permissions) {
    if (permissions.includes('103') || this.role_feature.EXAMS_MENU || permissions.includes('203') || this.role_feature.EXAMS_MENU) {
      //document.getElementById('liten').classList.remove('hide');
    }
    else { }
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  /* Function to set the id for setActive function to act upon */
  toggler(id) {
    // this.activeSession = id;
    
  }
  checkInstituteType() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitute = true;
        } else {
          this.isLangInstitute = false;
        }
      }
    )
  }


  /// Teacher Role Found
  teacherLoginFound() {
    this.jsonFlags.isShowLead = false;
    this.jsonFlags.isShowStudent = false;
    this.jsonFlags.isShowModel = true;
  }

  // RemoveActiveTabs() {
  //   let removeArray = ['lizero', 'lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'linine'];
  //   removeArray.forEach(object => {
  //     if (document.getElementById(object)) {
  //       document.getElementById(object).classList.remove('active');
  //     }
  //   });
  // }


  showSubSection(id) {

    for (let i = 0; i < 6; i++) {
      if (document.getElementsByClassName("side-section")[i]) {
        document.getElementsByClassName("side-section") && document.getElementsByClassName("side-section")[i].classList.remove('active-current-menu');
        document.getElementsByClassName("side-section")[i].classList.remove('active-current-menu');
      }
    }
    if (document.getElementById(id)) {
      document.getElementById(id).className = ' side-section';
      // document.getElementById(id).className = ' active-current-menu';
      document.getElementById(id).classList.add('active-current-menu');
    }

    this.helpMenu = true;
    if (document.getElementById('blurBg')) {
      document.getElementById('blurBg').className = 'blur-background';
    }
  }

  // From Headers section
  showHelpMenu() {
    this.helpMenu = (!this.helpMenu);
    this.sideBar = false;

    this.searchBar = false;
  }

  showMenu() {
    this.sideBar = true;
    this.helpMenu = false;

    this.searchBar = false;
    let totalExternalClasses = document.getElementsByClassName("external-menu").length;
    let externalMenu = document.getElementsByClassName("external-menu") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < totalExternalClasses; i++) {
      externalMenu[i].style.display = "none";
    }
  }

  closeMenu() {
    this.sideBar = false;
    this.searchBar = false;
    this.helpMenu = false;
    if (document.getElementById('blurBg')) {
      document.getElementById('blurBg').className = 'normal-background';
    }
    for (let i = 0; i < 6; i++) {
      if (document.getElementsByClassName("side-section")[i]) {
        document.getElementsByClassName("side-section")[i].classList.remove('active-current-menu');
        document.getElementsByClassName("side-section")[i].className = ' side-section';
      }
    }

  }

  logout() {
    this.clearSearch();
    this.log.logoutUser().subscribe(
      (res: any) => {
        this.multiBranchService.subBranchSelected.next(false);
        this.auth.clearStoredData();
        this.auth.changeAuthenticationKey(null);
        this.auth.changeInstituteId(null);
        this.log.changeSidenavStatus('unauthorized');
        sessionStorage.clear();

        this.router.navigateByUrl('/authPage');
      },
      err => {
      }
    )
  }

  clearSearch() {
    this.enquiryResult = [];
    this.studentResult = [];
  }

  changePasswordClick() {
    this.changePassword.emit('true');

    this.searchBar = false;
    this.sideBar = false;
    let totalExternalClasses = document.getElementsByClassName("external-menu").length;
    let externalMenu = document.getElementsByClassName("external-menu") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < totalExternalClasses; i++) {
      externalMenu[i].style.display = "none";
    }
    document.getElementById('account').className = ' side-section';
    document.getElementById('blurBg').className = ' normal-background';
  }

  onSubBranchClick(data) {
    this.multiBranchService.setSelectedBranchData(data);
    this.auth.changeInstituteId(data.institute_id);
    this.multiBranchService.getSubBranchLoginInfo(data.institute_id).subscribe(
      res => {
        this.multiBranchService.subBranchSelected.next(true);
        this.fillSessionStorageCommonFields(res);
        sessionStorage.setItem('mainBranchId', this.mainBranchId);
        this.getCountryData(data.institute_id);
        this.router.navigateByUrl('/authPage');
      },
      err => {

      }
    )
  }

  getCountryData(institute_id) {
    this.log.getInstituteCountryDetails(institute_id).subscribe(
      (res: any) => {
        let country_info = res;
        for (let i = 0; i < country_info.length; i++) {
          let row: any = country_info[i];
          row.symbol = this.getCurrencyDetails(900, row.currency_code, row.country_code);
          if (row.is_default == 'Y') {
            this.commonService.setDefaultCurrencySymbol(row.symbol);
          }
        }
        sessionStorage.setItem('country_data', JSON.stringify(country_info));
      },
      err => {
        console.log(err);
      }
    );
  }


  getCurrencyDetails(value, currency, lang) {
    if (value && currency && lang) {
      let formatted = value.toLocaleString(lang, {
        maximumFractionDigits: 4,
        style: 'currency',
        currency: currency
      });

      formatted = formatted.replace(/[,.]/g, '');
      return formatted.replace(/[0-9]/g, '');
    }
    else {
      return lang;
    }
  }

  loginToMainBranch() {
    let mainBranchId = sessionStorage.getItem('mainBranchId');
    this.multiBranchService.loginToMainBranch(mainBranchId).subscribe(
      res => {
        this.multiBranchService.subBranchSelected.next(false);
        this.fillSessionStorageCommonFields(res);
        this.mainBranchLogin(res);
        this.getCountryData(mainBranchId);
      },
      err => {
        console.log(err);
      }
    )
  }

  mainBranchLogin(res) {
    sessionStorage.setItem('religion_feature', res.religion_feature);
    this.router.navigateByUrl('/authPage');
  }

  changeIcon(id) {
    document.getElementById(id + "_icon").setAttribute('src', "./assets/images/sidebar/sideMenu/" + id + "_color.svg");
  }

  showSubMenu(id) {
    if (document.getElementById(id) && document.getElementById(id).style.display == 'block') {
      document.getElementById(id).style.display = "none";
      // document.getElementById(id+"_current").classList.remove('active-current-menu');
      // document.getElementById(id+"_icon").setAttribute( 'src', "./assets/images/sidebar/sideMenu/"+id+".svg");
      // document.getElementById(id+"icon").src = "./assets/images/sidebar/sideMenu/"+id+".svg";
      return;
    }
    else {
      let totalExternalClasses = document.getElementsByClassName("external-menu").length;
      let externalMenu = document.getElementsByClassName("external-menu") as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < totalExternalClasses; i++) {
        externalMenu[i].style.display = "none";
      }
      // let totalCurrentClasses = document.getElementsByClassName("current-menu").length;
      // let currentMenu = document.getElementsByClassName("current-menu") as HTMLCollectionOf<HTMLElement>;
      // for(let i = 0; i < totalCurrentClasses; i++){
      //   currentMenu[i].classList.remove('active-current-menu');
      // }
      // document.getElementById(id+"_icon").setAttribute( 'src', "./assets/images/sidebar/sideMenu/"+id+"_color.svg");

      // document.getElementById(id+"icon").src = "./assets/images/sidebar/sideMenu/"+id+"_color.svg";
      // document.getElementById(id+"_current").classList.add('active-current-menu')
      if (document.getElementById(id)) { document.getElementById(id).style.display = "block"; }
    }
  };

  hasInventoryAccess() {

    if (sessionStorage.getItem('permissions') == '' && sessionStorage.getItem('userType') != '3') {
      return true;
    }
    else if (this.role_feature.STUDENT_MANAGE) {
      if (sessionStorage.getItem('userType') != '3') {
        return false;
      } else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  routerLink(route, id) {
    for (let i = 0; i < 6; i++) {
      if (document.getElementsByClassName("side-section")[i]) {
        document.getElementsByClassName("side-section")[i].classList.remove('active-current-menu');
      }
    }
    this.sideBar = false;
    let totalCurrentClasses = document.getElementsByClassName("current-menu").length;
    let currentMenu = document.getElementsByClassName("current-menu") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < totalCurrentClasses; i++) {
      currentMenu[i] && currentMenu[i].classList.remove('active-current-menu');
    }
    if (document.getElementById(id)) { document.getElementById(id).className += ' remove-current-menu'; }
    if (document.getElementById('blurBg')) {
      document.getElementById('blurBg').className = 'normal-background';
    }
    this.activeSession = null;
    this.router.navigate([route]);
  }

  viewTeacherProfile() {
    this.router.navigate(['/view/teacher/edit/', this.teacherId]);
  }

  fillSessionStorageCommonFields(res) {
    sessionStorage.clear();
    // Changes done by Nalini to handle role in case of branch switch
    if (res.userType != '1' && res.userType != '99') {
      let Authorization = btoa(res.userid + "|" + res.userType + ":" + res.password + ":" + res.institution_id);
      sessionStorage.setItem('Authorization', Authorization);
      this.auth.changeAuthenticationKey(Authorization);
    }
    else {
      if (res.single_login_login_check) {
        sessionStorage.setItem('single_device_login', 'true');
        let Authorization = btoa(res.userid + "|" + res.userType + ":" + res.password + ":" + res.institution_id + ":" + res.device_id + ":WEB");
        sessionStorage.setItem('Authorization', Authorization);
        this.auth.changeAuthenticationKey(Authorization);
      }
      else {
        sessionStorage.setItem('single_device_login', 'false');
        let Authorization = btoa(res.userid + "|" + res.userType + ":" + res.password + ":" + res.institution_id);
        sessionStorage.setItem('Authorization', Authorization);
        this.auth.changeAuthenticationKey(Authorization);
      }
    }
    console.log(res.permission_id_list);
     if (res.permission_id_list == undefined || res.permission_id_list == undefined || res.permission_id_list == null || res.permission_id_list.length == 0) {
      sessionStorage.setItem('permissions', '');
      this.log.changePermissions('');
      this.Role_features.checkPermissions();
    }
    else {
      sessionStorage.setItem('permissions', JSON.stringify(res.permission_id_list));
      this.log.changePermissions(JSON.stringify(res.permission_id_list));
      this.Role_features.checkPermissions();
    }
    // this.log.currentUsername.subscribe(res => {
      this.createCustomSidenav();
    // });
    this.auth.schoolModel.next(res.is_institute_type_school);
    sessionStorage.setItem('is_institute_type_school', res.is_institute_type_school);
    sessionStorage.setItem('institute_id', res.institution_id);
    sessionStorage.setItem('institution_id', res.institution_id);
    this.auth.changeInstituteId(res.institution_id);
    sessionStorage.setItem('accountId', res.accountId);
    sessionStorage.setItem('alternate_email_id', res.alternate_email_id);
    sessionStorage.setItem('biometric_attendance_feature', res.biometric_attendance_feature);
    sessionStorage.setItem('courseType', res.courseType);
    sessionStorage.setItem('course_structure_flag', res.course_structure_flag);
    this.auth.course_flag.next(res.course_structure_flag);
    sessionStorage.setItem('enable_fee_payment_mandatory_student_creation', res.enable_fee_payment_mandatory_student_creation);
    sessionStorage.setItem('enable_fee_templates', res.enable_fee_templates);
    sessionStorage.setItem('enable_tax_applicable_fee_installments', res.enable_tax_applicable_fee_installments);
    sessionStorage.setItem('is_exam_grad_feature', res.is_exam_grad_feature);
    sessionStorage.setItem('inst_email', res.inst_email);
    sessionStorage.setItem('inst_phone', res.inst_phone);
    sessionStorage.setItem('institute_type', res.institute_type);
    this.auth.instituteType_name.next(res.institute_type);
    // this.auth.institute_type.next(res.institute_type);
    this.auth.makeInstituteType(res.institute_type, res.course_structure_flag);
    sessionStorage.setItem('institute_name', res.institute_name);
    sessionStorage.setItem('is_campaign_message_approve_feature', res.is_campaign_message_approve_feature);
    sessionStorage.setItem('is_main_branch', res.is_main_branch);
    this.auth.isMainBranch.next(res.is_main_branch);
    sessionStorage.setItem('is_student_bulk_upload_byClient', res.is_student_bulk_upload_byClient);
    sessionStorage.setItem('is_student_mgmt_flag', res.is_student_mgmt_flag);
    sessionStorage.setItem('login_teacher_id', res.login_teacher_id);
    sessionStorage.setItem('name', res.name);
    sessionStorage.setItem('password', res.password);
    sessionStorage.setItem('student_report_card_fee_module', res.student_report_card_fee_module);
    sessionStorage.setItem('studwise_fee_mod_with_amt', res.studwise_fee_mod_with_amt);
    sessionStorage.setItem('test_feature', res.test_feature);
    sessionStorage.setItem('testprepEnabled', res.testprepEnabled);
    sessionStorage.setItem('userType', res.userType);
    this.log.changeUserType(res.userType);
    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('userid', res.userid);
    sessionStorage.setItem('message', res.message);
    sessionStorage.setItem('about_us_text', res.about_us_text);
    sessionStorage.setItem('inst_announcement', res.inst_announcement);
    sessionStorage.setItem('logo_url', res.logo_url);
    sessionStorage.setItem('permitted_roles', JSON.stringify(res.featureDivMapping));
    sessionStorage.setItem('enable_routing', res.enable_routing);
    sessionStorage.setItem('enable_online_payment_feature', res.enable_online_payment_feature);
    sessionStorage.setItem('institute_setup_type', res.institute_setup_type);
    sessionStorage.setItem('allow_sms_approve_feature', res.allow_sms_approve_feature);
    sessionStorage.setItem('enable_eLearn_feature', res.enable_eLearn_feature);//
    sessionStorage.setItem('open_enq_Visibility_feature', res.open_enq_Visibility_feature);
    sessionStorage.setItem('enable_fee_template_country_wise', res.enable_fee_template_country_wise);
    sessionStorage.setItem('tax_type_without_percentage', res.tax_type);
    sessionStorage.setItem('tax_type_with_percentage', res.tax_type + "(%)");
    sessionStorage.setItem('enable_elearn_course_mapping_feature', res.enable_elearn_course_mapping_feature);
    //Storing the session value 
    // Added by Nalini
    sessionStorage.setItem('login_option', res.login_option);
    sessionStorage.setItem('payment_amount', res.payment_amount);
    sessionStorage.setItem('payment_due_date', res.payment_due_date);
    sessionStorage.setItem('enable_online_assignment_feature', res.enable_online_assignment_feature);
    sessionStorage.setItem('teacherIDs', res.teacherId);
    sessionStorage.setItem('enable_library_feature', res.enable_library_feature);
    sessionStorage.setItem('enable_vdoCipher_feature', res.enable_vdoCipher_feature);
    sessionStorage.setItem('enable_vimeo_feature', res.enable_vimeo_feature);
    sessionStorage.setItem('enable_client_website', res.enable_client_website);
    sessionStorage.setItem('is_fee_struct_linked', res.is_fee_struct_linked);
  }

  // closeSubMenu(){
  //   let totalExternalClasses = document.getElementsByClassName("external-menu").length;
  //   for(let i = 0; i < totalExternalClasses; i++){
  //     document.getElementsByClassName("external-menu")[i].style.display = "none";
  //   }
  // }


  // FOR Search
  showSearchBar() {

    // window.setTimeout(function () {

    //   document.getElementById('searchIcon').classList.remove('beforeSearchIcon');
    //   document.getElementById('searchIcon').classList.add('afterSearchIcon');
    //   document.getElementById('search_bar').classList.remove('afterHover');
    //   document.getElementById('search_bar').classList.add('beforeHover');

    // }, 20);
    // window.setTimeout(function () {
    //   document.getElementById("search_bar").focus();
    // }, 550);
    this.searchBar = true;
  }

  closeSearchBar() {
    this.searchBar = false;


  }
  // removeClass() {
  //   document.getElementById('searchIcon').classList.remove('afterSearchIcon');
  //   document.getElementById('searchIcon').classList.add('beforeSearchIcon');
  // }
  triggerSearchBox($event) {

    this.showSearchBar();
    $event.preventDefault();
    this.isResultDisplayed = true;
    this.seachResult.nativeElement.classList.add('searchView');
    this.hideSearchPopup.emit(null);
  }

  closeSearch(e) {
    this.isResultDisplayed = e;
    this.seachResult.nativeElement.classList.remove('searchView');
    //this.userInput = '';
    // if(e){
    //   this.searchBar = false;
    // }
    // else{
    //   this.searchBar = true;
    // }
    // this.searchBar = false;
  }

  filterGlobal(value) {
    if (value != null && value != undefined) {
      if (value.trim() != '' && value.length >= 4) {
        let obj = this.getSearchObject(value);
        this.inputValue = value;
        this.searchViewMore.emit(null);
        /* Loading Shows */
        this.resultStat = 0;
        this.fetchService.globalSearch(obj).subscribe(
          res => {
            this.resultStat = 1;
            if (res.length != 0) {
              this.enquiryResult = res.filter(e => e.source == "Enquiry");
              this.studentResult = res.filter(s => s.source == "Student");
            }
            else {
              this.commonService.showErrorMessage("info", "No Records Found", "Please try with a different keyword");
            }
          },
          err => {
          }
        )
      }
      else {

      }
    }

  }

  getSearchObject(e): any {
    let obj = this.globalSearchForm;
    if (/^[\s()+-]*([0-9][\s()+-]*){0,20}$/.test(e)) {
      /* Nmber detected */
      this.globalSearchForm.phone = e;
      this.globalSearchForm.name = '';
      return this.globalSearchForm;
    } else if (isNaN(e)) {
      /* Name detected */
      this.globalSearchForm.name = e;
      this.globalSearchForm.phone = '';
      return this.globalSearchForm;
    }
  }

  selectedStudent(s) {
    this.closeSearch(false);
    this.router.navigate(['/view/students'], { queryParams: { id: s.id } });
    // 
    this.searchBar = false;
  }

  selectedEnquiry(e) {
    this.closeSearch(false);
    this.router.navigate(['/view/leads'], { queryParams: { id: e.id } });
    // 
    this.searchBar = false;
  }

  searchAgain(e) {
    this.userInput = e;
  }

  viewMoreRecods(e) {
    let obj = {
      source: e,
      input: this.userInput
    }
    this.closeSearch(false)
    this.searchViewMore.emit(obj);
    // 
    this.searchBar = false;
  }

  actionSelected(d) {
    this.closeSearch(false);
    if (d.data.source == "Student") {
      console.log(d);
      if(d.action == "studentFee") {
        this.router.navigate(['/view/fee/update-fee/view-fee/'+d.data.id]);
      } else {
        let router_link = this.isProfessional ?'/view/students/reportcard/':'/view/students/reportcardV2/';
        this.router.navigate([router_link+d.data.id]);
      }
      // 
      this.searchBar = false;
    }
    else if (d.data.source == "Enquiry") {
      if (d.action == "enquiryUpdate") {
        this.enquiryUpdateAction.emit(d);
        // 
        this.searchBar = false;
      }
      else
        this.router.navigate(['/view/leads/enquiry/edit/' + d.data.id]); {
        // 
        // this.router.navigate(['/view/leads'], { queryParams: { id: d.data.id, action: d.action } });
        this.searchBar = false;
      }
    }
  }

  openInNewTab(url: string) {
    window.open(url, "_blank");
    this.closeMenu();
    this.helpMenu = false;
  }

  showExpensesList() {
    if (this.showExpenses) {
      this.showExpenses = false;
    }
    else {
      this.showExpenses = true;
      this.showExpenseToDo = true;
    }
    this.closeMenu();
  }


  onOfLoaderFromTodoList(ev) {
    this.isRippleLoad = ev;
  }
  closeShowList() {
    this.showList();
  }

  showList() {
    if (this.showExpenseToDo) {
      this.showExpenseToDo = false;
      if (this.showToDo) {
        this.showToDo = false;
        // Need to call to  to do list destroy function;
      }
      else if (this.showExpenses) {
        this.showExpenses = false;
      }
    }
    else {
      this.showExpenseToDo = true;
    }
    this.closeMenu();
  }

  showToDoList() {
    if (this.showToDo) {
      this.showToDo = false;
      // Need to call to  to do list destroy function;
    }
    else {
      this.showToDo = true;
    }
  }


  showLead: any = 'leadhide';
  showbatch: any = 'batchhide';
  showcourse: any = 'coursehide';
  showFee: any = "feeshide";
  showComm: any = "comhide";
  showeStore: any = "eStorehide";
  showExp: any = "expensehide";
  show(id) {
    switch (id) {
      case 'lead': this.showLead = 'lead'; break;
      case 'course': this.showcourse = 'course';
        this.showbatch = 'batch1'; break;
      case 'batch': this.showbatch = 'batch';
        this.showcourse = 'course1';
        break;
      case 'fees': this.showFee = 'fees'; break;
      case 'communicate': this.showComm = 'com'; break;
      case 'eStore': this.showeStore = 'eStore'; break;
      case 'expense': this.showExp = 'expense'; break;
    }
  }
  hide(id) {
    switch (id) {
      case 'lead': this.showLead = 'leadhide'; break;
      case 'course': this.showcourse = 'coursehide';
        this.showbatch = 'batchhide1'; break;
      case 'batch': this.showbatch = 'batchhide';
        this.showcourse = 'coursehide1'; break;
      case 'fees': this.showFee = 'feeshide'; break;
      case 'communicate': this.showComm = 'comhide'; break;
      case 'eStore': this.showeStore = 'eStorehide'; break;
      case 'expense': this.showExp = 'expensehide'; break;

    }
  }
  setLiveClassType(obj) {
    if (obj != '') {
      sessionStorage.setItem('setLiveClassType', obj);
    }
  }

  setSetupSession(obj) {
    sessionStorage.setItem('class', obj);
  }

  openExamdesk() {
    this.httpService.getData("/api/v2/user/examdesk/SSO")
      .subscribe((data: any) => {
        window.open(this.auth.examDeskUrl + '/administrator/login?token=' + data.result);
      });
    }
  checkIfUserHadAccess(id) {
    this.permissionArray = sessionStorage.getItem('permissions');
    if (this.permissionArray == "" || this.permissionArray == null || !this.permissionArray) {
      return true;
    } else {
      if (id) {
        return true;
      } else {
        return false;
      }
    }
  }
  // =============download-app-api======================
  downloadApp(){
    if(this.validInput()){
    this.auth.showLoader()
    let obj={
      contact_no:this.contact_no
    }
    let url ='/api/v1/career/apply/msgSend'
    this.httpService.postData(url,obj).subscribe(
      (res:any)=>{
    this.auth.hideLoader()
    this.commonService.showErrorMessage('success', '', "Link Send successfully");
    $('#appModal').modal('hide');   
    },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
    }

}
validInput(){
  if(this.contact_no.length != 10){
   
      this.commonService.showErrorMessage('error', '', "Please Enter 10 digit Number");
      $('#appModal').modal('hide');   

      return false;
    }
    return true
  }
}
