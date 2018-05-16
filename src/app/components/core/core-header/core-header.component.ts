import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { MultiBranchDataService } from '../../../services/multiBranchdata.service';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'core-header',
  templateUrl: './core-header.component.html',
  styleUrls: ['./core-header.component.scss']
})
export class CoreHeaderComponent implements OnInit {

  isProfessional: boolean;
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
  settings: string = "0";
  manageExamGrades: string = "";
  globalSearchForm: any = {
    name: '',
    phone: '',
    instituteId: sessionStorage.getItem('institute_id'),
    start_index: '0',
    batch_size: '6'
  }

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('seachResult') seachResult: ElementRef;
  @ViewChild('form') form: any;
  resultStat: any = 1;
  teacherId: any = 0;


  @Output() searchViewMore = new EventEmitter<any>();
  @Output() hideSearchPopup = new EventEmitter<any>();

  private userInput: string;

  constructor(
    private log: LoginService,
    private router: Router,
    private fetchService: FetchprefilldataService,
    private appC: AppComponent,
    private multiBranchService: MultiBranchDataService,
    private auth: AuthenticatorService
  ) {
  }

  ngOnInit() {
    this.settings = sessionStorage.getItem('exam_grading_system')
    this.log.currentInstitute.subscribe(res => {
      this.instituteName = res;
      this.updatePermissions();
      this.AddBtnPermision();
    });

    this.log.currentUsername.subscribe(res => {
      this.userName = res;
    });

    this.checkPermissionArrayData();

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

    this.isMainBranch = sessionStorage.getItem('is_main_branch');
    if (this.isMainBranch == "Y") {
      this.multiBranchInstituteFound();
    }

  }


  logout() {
    this.clearSearch();
    if (this.log.logoutUser()) {
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
    this.router.navigate(['/home']);
  }


  checkPermissionArrayData() {
    let userType: any = Number(sessionStorage.getItem('userType'));
    if (userType != 3) {
      this.checkUserHadAccess();
    } else {
      //this is for teacher type
      this.hideAllFields();
    }
  }

  checkUserHadAccess() {
    document.getElementById('divProfileTag').classList.add('hide');
    const permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == null || permissionArray == "") {
      if (sessionStorage.getItem('userType') == '0') {
        this.showAllFields();
      }
      else if (sessionStorage.getItem('userType') == '3') {
        document.getElementById('divProfileTag').classList.remove('hide');
        this.teacherId = 0;
        this.teacherId = JSON.parse(sessionStorage.getItem('institute_info')).teacherId;
        this.showTeacherFields();
      }
    } else {
      if (permissionArray != undefined) {
        this.hideAllFields();
        if (permissionArray.indexOf('503') != -1) {
          document.getElementById('divMasterTag').classList.remove('hide');
          document.getElementById('divTeacherTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('506') != -1) {
          document.getElementById('divMasterTag').classList.remove('hide');
          document.getElementById('divFeeTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('507') != -1 && this.isProfessional) {
          document.getElementById('divMasterTag').classList.remove('hide');
          document.getElementById('divSlotTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('509') != -1) {
          document.getElementById('divMasterTag').classList.remove('hide');
          document.getElementById('divAcademicTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('602') != -1) {
          document.getElementById('divSettingTag').classList.remove('hide');
          document.getElementById('divMyAccountTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('603') != -1) {
          document.getElementById('divSettingTag').classList.remove('hide');
          document.getElementById('divGeneralSettingTag').classList.remove('hide');
        }
        if (permissionArray.indexOf('115') != -1) {
          document.getElementById('divManageFormTag').classList.remove('hide');
          document.getElementById('divAreaAndMap').classList.remove('hide');
        }
        if (permissionArray.indexOf('601') != -1) {
          document.getElementById('divManageUsers').classList.remove('hide');
        }
      }
    }
  }

  showAllFields() {
    document.getElementById('divAdminTag').classList.remove('hide');
    document.getElementById('divMyAccountTag').classList.remove('hide');
    document.getElementById('divMasterTag').classList.remove('hide');
    document.getElementById('divTeacherTag').classList.remove('hide');
    document.getElementById('divFeeTag').classList.remove('hide');
    document.getElementById('divAcademicTag').classList.remove('hide');
    document.getElementById('divSettingTag').classList.remove('hide');
    document.getElementById('divGeneralSettingTag').classList.remove('hide');
    document.getElementById('divManageFormTag').classList.remove('hide');
    if (this.settings == '1') {
      document.getElementById('divGradesTag').classList.remove('hide');
    }
    if (this.isProfessional) {
      document.getElementById('divSlotTag').classList.remove('hide');
    }
    else if (!this.isProfessional) {
      document.getElementById('divSlotTag').classList.add('hide');
    }
    document.getElementById('divManageUsers').classList.remove('hide');
  }

  showTeacherFields() {
    document.getElementById('divAdminTag').classList.add('hide');
    document.getElementById('divMyAccountTag').classList.add('hide');
    document.getElementById('divMasterTag').classList.add('hide');
    document.getElementById('divTeacherTag').classList.add('hide');
    document.getElementById('divFeeTag').classList.add('hide');
    document.getElementById('divAcademicTag').classList.add('hide');
    document.getElementById('divSettingTag').classList.add('hide');
    document.getElementById('divGeneralSettingTag').classList.add('hide');
    document.getElementById('divManageFormTag').classList.add('hide');
    document.getElementById('divAreaAndMap').classList.add('hide');
    document.getElementById('divSlotTag').classList.add('hide');
    document.getElementById('divClassRoomTag').classList.add('hide');
    document.getElementById('divManageTag').classList.add('hide');
    document.getElementById('divAcademicTag').classList.add('hide');
    if (this.settings == '1') {
      document.getElementById('divGradesTag').classList.remove('hide');
    }
    document.getElementById('divManageUsers').classList.add('hide');
  }

  hideAllFields() {
    document.getElementById('divAdminTag').classList.add('hide');
    document.getElementById('divMyAccountTag').classList.add('hide');
    document.getElementById('divMasterTag').classList.add('hide');
    document.getElementById('divTeacherTag').classList.add('hide');
    document.getElementById('divFeeTag').classList.add('hide');
    document.getElementById('divSlotTag').classList.add('hide');
    document.getElementById('divAcademicTag').classList.add('hide');
    document.getElementById('divSettingTag').classList.add('hide');
    document.getElementById('divGeneralSettingTag').classList.add('hide');
    document.getElementById('divManageFormTag').classList.add('hide');
    document.getElementById('divAreaAndMap').classList.add('hide');
    if (this.settings == '1') {
      document.getElementById('divGradesTag').classList.remove('hide');
    }
    document.getElementById('divManageUsers').classList.add('hide');
  }

  hasEnquiryAccess(): boolean {
    let permissionArray: any = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null) {
      return true;
    }
    else {
      let id = 115;
      let id2 = 110;
      if (permissionArray.indexOf(id) != -1 || permissionArray.indexOf(id2) != -1) {
        return true;
      } else {
        return false;
      }
    }
  }

  hasStudentAccess(): boolean {
    let permissionArray: any = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null) {
      return true;
    }
    else {
      let id = 301;
      let id2 = 303;
      if (permissionArray.indexOf(id) != -1 && permissionArray.indexOf(id2) != "-1") {
        return true;
      } else {
        return false;
      }
    }
  }

  hasCourseAccess(): boolean {
    let permissionArray: any = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null) {
      return true;
    }
    else {
      let id = 402;
      if (permissionArray.indexOf(id) != -1) {
        return true;
      } else {
        return false;
      }
    }
  }

  updatePermissions() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.checkUserHadAccess();
    this.hasEnquiry = this.hasEnquiryAccess();
    this.hasStudent = this.hasStudentAccess();
    this.hasClass = this.hasCourseAccess();
  }


  AddBtnPermision() {
    let userType: any = Number(sessionStorage.getItem('userType'));
    if (userType === 3) {
      this.hasEnquiry = false;
      this.hasStudent = false;
      this.hasClass = false;
    }
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
              let obj = {
                type: "info",
                title: "No Records Found",
                body: "Please try with a different keyword"
              }
              this.appC.popToast(obj);
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
    this.router.navigate(['/student'], { queryParams: { id: s.id } });
  }

  selectedEnquiry(e) {
    this.closeSearch(false);
    this.router.navigate(['/enquiry'], { queryParams: { id: e.id } });
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
      this.router.navigate(['/student'], { queryParams: { id: d.data.id, action: d.action } });
    }
    else {
      this.router.navigate(['/enquiry'], { queryParams: { id: d.data.id, action: d.action } });
    }
  }

  viewTeacherProfile() {
    localStorage.setItem('teacherID', this.teacherId);
    this.router.navigateByUrl('teacher/edit');
  }

  // Multi Branch Case Handling

  branchesList: any = [];
  mainBranchId: any = "";
  isMainBranch: any = "N";

  multiBranchInstituteFound() {
    this.mainBranchId = sessionStorage.getItem('institute_id');

    this.multiBranchService.getAllBranches().subscribe(
      res => {
        console.log(res);
        this.branchesList = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  onSubBranchClick(data) {
    this.multiBranchService.setSelectedBranchData(data);
    this.auth.changeInstituteId(data.institute_id);
    this.multiBranchService.getSubBranchLoginInfo(data.institute_id).subscribe(
      res => {
        this.alternateLoginSuccess(res);
      },
      err => {

      }
    )
  }

  alternateLoginSuccess(res) {
    sessionStorage.clear();
    sessionStorage.setItem('mainBranchId', this.mainBranchId);
    sessionStorage.setItem('institute_info', JSON.stringify(res.institute_info));
    let Authorization = btoa(res.userid + "|" + res.userType + ":" + res.password + ":" + res.institution_id);

    sessionStorage.setItem('Authorization', Authorization);
    sessionStorage.setItem('institute_id', res.institution_id);

    this.auth.changeAuthenticationKey(Authorization);
    this.auth.changeInstituteId(res.institution_id);

    sessionStorage.setItem('accountId', res.accountId);
    sessionStorage.setItem('alternate_email_id', res.alternate_email_id);
    sessionStorage.setItem('biometric_attendance_feature', res.biometric_attendance_feature);
    sessionStorage.setItem('courseType', res.courseType);
    sessionStorage.setItem('course_structure_flag', res.course_structure_flag);
    sessionStorage.setItem('enable_fee_payment_mandatory_student_creation', res.enable_fee_payment_mandatory_student_creation);
    sessionStorage.setItem('enable_fee_templates', res.enable_fee_templates);
    sessionStorage.setItem('enable_tax_applicable_fee_installments', res.enable_tax_applicable_fee_installments);
    sessionStorage.setItem('is_exam_grad_feature', res.is_exam_grad_feature);
    sessionStorage.setItem('inst_email', res.inst_email);
    sessionStorage.setItem('inst_phone', res.inst_phone);
    sessionStorage.setItem('institute_setup_type', res.institute_setup_type);
    sessionStorage.setItem('institute_type', res.institute_type);
    sessionStorage.setItem('institute_name', res.institute_name);
    sessionStorage.setItem('is_campaign_message_approve_feature', res.is_campaign_message_approve_feature);
    sessionStorage.setItem('allow_sms_approve_feature', res.allow_sms_approve_feature);
    sessionStorage.setItem('is_main_branch', res.is_main_branch);
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
    sessionStorage.setItem('name', res.name);
    sessionStorage.setItem('about_us_text', res.about_us_text);
    sessionStorage.setItem('inst_announcement', res.inst_announcement);
    sessionStorage.setItem('logo_url', res.logo_url);
    sessionStorage.setItem('permitted_roles', JSON.stringify(res.featureDivMapping));
    sessionStorage.setItem('is_exam_grad_feature', res.is_exam_grad_feature);
    sessionStorage.setItem('enable_routing', res.enable_routing);
    sessionStorage.setItem('enable_online_payment_feature', res.enable_online_payment_feature);
    sessionStorage.setItem('permissions', '');
    this.router.navigateByUrl('/');
  }

  loginToMainBranch() {
    debugger
    let mainBranchId = sessionStorage.getItem('mainBranchId');
    this.multiBranchService.loginToMainBranch(mainBranchId).subscribe(
      res => {
        this.mainBranchLogin(res);
      },
      err => {
        console.log(err);
      }
    )
  }

  mainBranchLogin(res) {
    sessionStorage.clear();
    sessionStorage.setItem('institute_info', JSON.stringify(res.data));
    let institute_data = res;
    let Authorization = btoa(institute_data.userid + "|" + institute_data.userType + ":" + institute_data.password + ":" + institute_data.institution_id);
    sessionStorage.setItem('Authorization', Authorization);
    sessionStorage.setItem('institute_id', institute_data.institution_id);
    this.auth.changeAuthenticationKey(Authorization);
    this.auth.changeInstituteId(institute_data.institution_id);
    sessionStorage.setItem('about_us_image', institute_data.about_us_image);
    sessionStorage.setItem('about_us_text', institute_data.about_us_text);
    sessionStorage.setItem('accountId', institute_data.accountId);
    sessionStorage.setItem('alternate_email_id', institute_data.alternate_email_id);
    sessionStorage.setItem('biometric_attendance_feature', institute_data.biometric_attendance_feature);
    sessionStorage.setItem('courseType', institute_data.courseType);
    sessionStorage.setItem('course_structure_flag', institute_data.course_structure_flag);
    sessionStorage.setItem('enable_fee_payment_mandatory_student_creation', institute_data.enable_fee_payment_mandatory_student_creation);
    sessionStorage.setItem('enable_fee_templates', institute_data.enable_fee_templates);
    sessionStorage.setItem('enable_tax_applicable_fee_installments', institute_data.enable_tax_applicable_fee_installments);
    sessionStorage.setItem('exam_grading_system', institute_data.exam_grading_system);
    sessionStorage.setItem('fb_page_url', institute_data.fb_page_url);
    sessionStorage.setItem('fee_functionality', institute_data.fee_functionality);
    sessionStorage.setItem('fetaures_map', institute_data.fetaures_map);
    sessionStorage.setItem('inst_email', institute_data.inst_email);
    sessionStorage.setItem('inst_phone', institute_data.inst_phone);
    sessionStorage.setItem('inst_reg_code', institute_data.inst_reg_code);
    sessionStorage.setItem('inst_set_up', institute_data.inst_set_up);
    sessionStorage.setItem('institute_type', institute_data.institute_type);
    sessionStorage.setItem('institution_footer', institute_data.institution_footer);
    sessionStorage.setItem('institution_header1', institute_data.institution_header1);
    sessionStorage.setItem('institution_header2', institute_data.institution_header2);
    sessionStorage.setItem('institution_header3', institute_data.institution_header3);
    sessionStorage.setItem('institution_logo', institute_data.institution_logo);
    sessionStorage.setItem('institution_name', institute_data.institution_name);
    sessionStorage.setItem('institute_name', institute_data.institute_name);
    sessionStorage.setItem('is_campaign_message_approve_feature', institute_data.is_campaign_message_approve_feature);
    // sessionStorage.setItem('allow_sms_approve_feature', res.data.allow_sms_approve_feature);
    sessionStorage.setItem('is_main_branch', institute_data.is_main_branch);
    sessionStorage.setItem('is_student_bulk_upload_byClient', institute_data.is_student_bulk_upload_byClient);
    sessionStorage.setItem('is_student_mgmt_flag', institute_data.is_student_mgmt_flag);
    sessionStorage.setItem('login_student_id', institute_data.login_student_id);
    sessionStorage.setItem('login_teacher_id', institute_data.login_teacher_id);
    // sessionStorage.setItem('manual_student_disp_id', institute_data.manual_student_disp_id);
    sessionStorage.setItem('name', institute_data.name);
    // sessionStorage.setItem('online_payment_feature', institute_data.online_payment_feature);
    sessionStorage.setItem('password', institute_data.password);
    // sessionStorage.setItem('promoCode', institute_data.promoCode);
    sessionStorage.setItem('religion_feature', institute_data.religion_feature);
    sessionStorage.setItem('student_report_card_fee_module', institute_data.student_report_card_fee_module);
    sessionStorage.setItem('studwise_fee_mod_with_amt', institute_data.studwise_fee_mod_with_amt);
    // sessionStorage.setItem('tag_line', institute_data.tag_line);
    sessionStorage.setItem('test_feature', institute_data.test_feature);
    sessionStorage.setItem('testprepEnabled', institute_data.testprepEnabled);
    // sessionStorage.setItem('userCat', institute_data.userCat);
    // sessionStorage.setItem('userTimeGrp', institute_data.userTimeGrp);
    sessionStorage.setItem('userType', institute_data.userType);
    this.log.changeUserType(institute_data.userType);
    // sessionStorage.setItem('user_permission', institute_data.user_permission);
    // sessionStorage.setItem('user_type_name', institute_data.user_type_name);
    sessionStorage.setItem('username', institute_data.username);
    sessionStorage.setItem('userid', institute_data.userid);
    sessionStorage.setItem('message', institute_data.message);
    sessionStorage.setItem('name', institute_data.name);
    // sessionStorage.setItem('fb_page_url', institute_data.fb_page_url);
    sessionStorage.setItem('about_us_text', institute_data.about_us_text);
    // sessionStorage.setItem('mobile_no', institute_data.mobile_no);
    sessionStorage.setItem('inst_announcement', institute_data.inst_announcement);
    sessionStorage.setItem('logo_url', institute_data.logo_url);
    sessionStorage.setItem('permitted_roles', JSON.stringify(res.featureDivMapping));
    sessionStorage.setItem('is_exam_grad_feature', institute_data.is_exam_grad_feature);
    sessionStorage.setItem('enable_routing', institute_data.enable_routing);
    sessionStorage.setItem('enable_online_payment_feature', institute_data.enable_online_payment_feature);
    this.router.navigateByUrl('/');
  }

}
