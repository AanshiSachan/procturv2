import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { MultiBranchDataService } from '../../../services/multiBranchdata.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';

@Component({
  selector: 'core-header',
  templateUrl: './core-header.component.html',
  styleUrls: ['./core-header.component.scss']
})
export class CoreHeaderComponent implements OnInit {

  isProfessional: boolean = false;
  isResultDisplayed: boolean;
  instituteName: string;
  userName: string;
  menuToggler: boolean = false;
  hasEnquiry: boolean = true;
  hasStudent: boolean = true;
  hasClass: boolean = true;
  enquiryResult: any[] = [];
  studentResult: any[] = [];
  inputValue: any;
  settings: string;
  manageExamGrades: string = "";
  globalSearchForm: any = {
    name: '',
    phone: '',
    instituteId: sessionStorage.getItem('institute_id'),
    start_index: '0',
    batch_size: '6'
  }
  resultStat: any = 1;
  teacherId: any = 0;
  private userInput: string;
  branchesList: any = [];
  mainBranchId: any = "";
  isMainBranch: any = "N";
  showMainBranchBackBtn: boolean = false;
  checkAdmin: any = "";

  @ViewChild('divAdminTag') divAdminTag: ElementRef;
  @ViewChild('divMyAccountTag') divMyAccountTag: ElementRef;
  @ViewChild('divMasterTag') divMasterTag: ElementRef;
  @ViewChild('divProfileTag') divProfileTag: ElementRef;
  @ViewChild('divTeacherTag') divTeacherTag: ElementRef;
  @ViewChild('divFeeTag') divFeeTag: ElementRef;
  @ViewChild('divSlotTag') divSlotTag: ElementRef;
  @ViewChild('divClassRoomTag') divClassRoomTag: ElementRef;
  @ViewChild('divManageTag') divManageTag: ElementRef;
  @ViewChild('divAcademicTag') divAcademicTag: ElementRef;
  @ViewChild('divGradesTag') divGradesTag: ElementRef;
  @ViewChild('divManageUsers') divManageUsers: ElementRef;
  @ViewChild('divSettingTag') divSettingTag: ElementRef;
  @ViewChild('divGeneralSettingTag') divGeneralSettingTag: ElementRef;
  @ViewChild('divManageFormTag') divManageFormTag: ElementRef;
  @ViewChild('divAreaAndMap') divAreaAndMap: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('seachResult') seachResult: ElementRef;
  @ViewChild('form') form: any;

  @Output() searchViewMore = new EventEmitter<any>();
  @Output() enquiryUpdateAction = new EventEmitter<any>();
  @Output() hideSearchPopup = new EventEmitter<any>();
  @Output() changePassword = new EventEmitter<any>();


  constructor(
    private log: LoginService,
    private router: Router,
    private fetchService: FetchprefilldataService,
    private multiBranchService: MultiBranchDataService,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory
  ) {
  }

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

    this.settings = sessionStorage.getItem('is_exam_grad_feature');
    this.instituteName = sessionStorage.getItem('institute_name');
    this.userName = sessionStorage.getItem('name');

    this.checkAccessOfEnquiryStudentAndEnquiry();

    this.checkUserHadAccess();

    this.form.valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(data => {
        this.userInput = data.userInput;
        this.enquiryResult = [];
        this.studentResult = [];
        this.filterGlobal(data.userInput)
      });

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

  checkAccessOfEnquiryStudentAndEnquiry() {
    if (this.commonService.checkUserIsAdmin()) {
      this.hasEnquiry = true;
      this.hasStudent = true;
      this.hasClass = true;
    } else {
      this.hasEnquiry = false;
      this.hasStudent = false;
      this.hasClass = false;
      if (sessionStorage.getItem('userType') != '3') {
        if (this.commonService.checkUserHadPermission('115') || this.commonService.checkUserHadPermission('110')) {
          this.hasEnquiry = true;
        }

        else if (this.commonService.checkUserHadPermission('301') || this.commonService.checkUserHadPermission('303')) {
          this.hasStudent = true;
        }

        else if (this.commonService.checkUserHadPermission('402')) {
          this.hasStudent = true;
        }
      }
    }
  }

  checkUserHadAccess() {
    this.divProfileTag.nativeElement.style.display = 'none';
    const permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == null || permissionArray == "") {
      if (sessionStorage.getItem('userType') == '0') {
        this.showAllFields();
      }
      else if (sessionStorage.getItem('userType') == '3') {
        this.hideAllFields();
        this.teacherId = JSON.parse(sessionStorage.getItem('institute_info')).teacherId;
        this.divProfileTag.nativeElement.style.display = '';
        this.divAdminTag.nativeElement.style.display = 'none';
        this.divAcademicTag.nativeElement.style.display = 'none';
      }
    } else {
      if (permissionArray != undefined) {
        this.hideAllFields();
        if (permissionArray.indexOf('503') != -1) {
          this.divMasterTag.nativeElement.style.display = '';
          this.divTeacherTag.nativeElement.style.display = '';
        }
        if (permissionArray.indexOf('506') != -1) {
          this.divMasterTag.nativeElement.style.display = '';
          this.divFeeTag.nativeElement.style.display = '';
        }
        if (permissionArray.indexOf('507') != -1 && this.isProfessional) {
          this.divMasterTag.nativeElement.style.display = '';
          this.divSlotTag.nativeElement.style.display = '';
        }
        if (permissionArray.indexOf('509') != -1) {
          this.divMasterTag.nativeElement.style.display = '';
          this.divAcademicTag.nativeElement.style.display = '';
        }
        if (permissionArray.indexOf('602') != -1) {
          this.divSettingTag.nativeElement.style.display = '';
          this.divMyAccountTag.nativeElement.style.display = '';
        }
        if (permissionArray.indexOf('603') != -1) {
          this.divSettingTag.nativeElement.style.display = '';
          this.divGeneralSettingTag.nativeElement.style.display = '';
        }
        if (permissionArray.indexOf('115') != -1) {
          // this.divManageFormTag.nativeElement.style.display = '';
          this.divAreaAndMap.nativeElement.style.display = '';
        }
        if (permissionArray.indexOf('601') != -1) {
          this.divManageUsers.nativeElement.style.display = '';
        }
        if (permissionArray.indexOf('508') != -1) {
          this.divClassRoomTag.nativeElement.style.display = '';
        }
      }
    }
  }

  checkToShowMultiBranch() {
    this.log.currentUserType.subscribe(
      res => {
        if (res == '3') {
          this.checkAdmin = false;
        } else {
          if (this.commonService.checkUserIsAdmin()) {
            this.checkAdmin = false;
          } else {
            this.checkAdmin = true;
          }
        }
      }
    )
  }

  logout() {
    this.clearSearch();
    if (this.log.logoutUser()) {
      this.multiBranchService.subBranchSelected.next(false);
      this.router.navigateByUrl('/authPage');
    }
  }

  triggerOverlayMenu() {
    if (this.menuToggler) {
      this.menuToggler = false;
      document.getElementById('menu-close').classList.add('hide');
      document.getElementById('menu-open').classList.remove('hide');
      this.log.changeMenuStatus(this.menuToggler);
    }
    else {
      this.menuToggler = true;
      document.getElementById('menu-close').classList.remove('hide');
      document.getElementById('menu-open').classList.add('hide');
      this.log.changeMenuStatus(this.menuToggler);
    }
  }

  goToHome() {
    this.router.navigate(['/view/home']);
  }

  showAllFields() {
    this.divAdminTag.nativeElement.style.display = '';
    this.divMyAccountTag.nativeElement.style.display = '';
    this.divMasterTag.nativeElement.style.display = '';
    this.divTeacherTag.nativeElement.style.display = '';
    this.divFeeTag.nativeElement.style.display = '';
    this.divAcademicTag.nativeElement.style.display = '';
    this.divSettingTag.nativeElement.style.display = '';
    this.divGeneralSettingTag.nativeElement.style.display = '';
    this.divManageFormTag.nativeElement.style.display = '';
    this.divManageUsers.nativeElement.style.display = '';
    this.divClassRoomTag.nativeElement.style.display = '';
    if (this.settings == '1') {
      this.divGradesTag.nativeElement.style.display = '';
    } else {
      this.divGradesTag.nativeElement.style.display = 'none';
    }
    if (this.isProfessional) {
      this.divSlotTag.nativeElement.style.display = '';
    }
    else if (!this.isProfessional) {
      this.divSlotTag.nativeElement.style.display = 'none';
    }
  }

  hideAllFields() {
    this.divAdminTag.nativeElement.style.display = 'none';
    this.divMyAccountTag.nativeElement.style.display = 'none';
    this.divMasterTag.nativeElement.style.display = 'none';
    this.divTeacherTag.nativeElement.style.display = 'none';
    this.divFeeTag.nativeElement.style.display = 'none';
    this.divSlotTag.nativeElement.style.display = 'none';
    this.divAcademicTag.nativeElement.style.display = 'none';
    this.divSettingTag.nativeElement.style.display = 'none';
    this.divGeneralSettingTag.nativeElement.style.display = 'none';
    this.divManageFormTag.nativeElement.style.display = 'none';
    this.divAreaAndMap.nativeElement.style.display = 'none';
    this.divManageUsers.nativeElement.style.display = 'none';
    this.divGradesTag.nativeElement.style.display = 'none';
    this.divClassRoomTag.nativeElement.style.display = 'none';
    this.divManageTag.nativeElement.style.display = 'none';
  }

  triggerSearchBox($event) {
    $event.preventDefault();
    this.isResultDisplayed = true;
    this.seachResult.nativeElement.classList.add('searchView');
    this.hideSearchPopup.emit(null);
  }

  closeSearch(e) {
    this.isResultDisplayed = e;
    this.seachResult.nativeElement.classList.remove('searchView');
    //this.userInput = '';
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
    /* Name detected */
    if (isNaN(e)) {
      this.globalSearchForm.name = e;
      this.globalSearchForm.phone = '';
      return this.globalSearchForm;
    }
    /* Nmber detected */
    else {
      this.globalSearchForm.phone = e;
      this.globalSearchForm.name = '';
      return this.globalSearchForm;
    }
  }

  clearSearch() {
    this.enquiryResult = [];
    this.studentResult = [];
  }

  selectedStudent(s) {
    this.closeSearch(false);
    this.router.navigate(['/view/student'], { queryParams: { id: s.id } });
  }

  selectedEnquiry(e) {
    this.closeSearch(false);
    this.router.navigate(['/view/enquiry'], { queryParams: { id: e.id } });
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
  }

  actionSelected(d) {
    this.closeSearch(false);
    if (d.data.source == "Student") {
      this.router.navigate(['/view/student'], { queryParams: { id: d.data.id, action: d.action } });
    }
    else if (d.data.source == "Enquiry") {
      if (d.action == "enquiryUpdate") {
        this.enquiryUpdateAction.emit(d);
      }
      else {
        this.router.navigate(['/view/enquiry'], { queryParams: { id: d.data.id, action: d.action } });
      }
    }
  }

  viewTeacherProfile() {
    this.router.navigate(['/view/teacher/edit/', this.teacherId]);
  }

  // Multi Branch Case Handling

  multiBranchInstituteFound() {
    this.mainBranchId = sessionStorage.getItem('institute_id');
    this.multiBranchService.getAllBranches().subscribe(
      res => {
        this.branchesList = res;
      },
      err => {

      }
    )
  }

  onSubBranchClick(data) {
    this.multiBranchService.setSelectedBranchData(data);
    this.auth.changeInstituteId(data.institute_id);
    this.multiBranchService.getSubBranchLoginInfo(data.institute_id).subscribe(
      res => {
        this.multiBranchService.subBranchSelected.next(true);
        this.fillSessionStorageCommonFields(res);
        sessionStorage.setItem('mainBranchId', this.mainBranchId);
        sessionStorage.setItem('permissions', '');
        this.router.navigateByUrl('/authPage');
      },
      err => {

      }
    )
  }


  loginToMainBranch() {
    let mainBranchId = sessionStorage.getItem('mainBranchId');
    this.multiBranchService.loginToMainBranch(mainBranchId).subscribe(
      res => {
        this.multiBranchService.subBranchSelected.next(false);
        this.fillSessionStorageCommonFields(res);
        this.mainBranchLogin(res);
      },
      err => {
        console.log(err);
      }
    )
  }

  mainBranchLogin(res) {
    sessionStorage.setItem('religion_feature', res.religion_feature);
    sessionStorage.setItem('permissions', '');
    this.router.navigateByUrl('/authPage');
  }


  fillSessionStorageCommonFields(res) {
    sessionStorage.clear();
    let Authorization = btoa(res.userid + "|" + res.userType + ":" + res.password + ":" + res.institution_id);
    sessionStorage.setItem('Authorization', Authorization);
    this.auth.changeAuthenticationKey(Authorization);
    sessionStorage.setItem('institute_id', res.institution_id);
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
    sessionStorage.setItem('open_enq_Visibility_feature', res.open_enq_Visibility_feature);
  }

  changePasswordClick() {
    this.changePassword.emit('true');
  }

}
