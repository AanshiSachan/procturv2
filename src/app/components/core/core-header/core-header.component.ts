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
  settings:string = "";
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

  constructor(private log: LoginService, private router: Router, private fetchService: FetchprefilldataService, private appC: AppComponent) {
  }

  ngOnInit() {

    this.settings = JSON.parse(sessionStorage.getItem('institute_info')).is_exam_grad_feature;
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
    document.getElementById('divGradesTag').classList.remove('hide');
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
    document.getElementById('divGradesTag').classList.remove('hide');
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
    document.getElementById('divGradesTag').classList.remove('hide');
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

}
