import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription, } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';

@Component({
  selector: 'core-header',
  templateUrl: './core-header.component.html',
  styleUrls: ['./core-header.component.scss']
})
export class CoreHeaderComponent implements OnInit {

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

  globalSearchForm: any = {
    name: '',
    phone: '',
    instituteId: sessionStorage.getItem('institute_id'),
    start_index: '0',
    batch_size: '5'
  }

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('seachResult') seachResult: ElementRef;
  @ViewChild('form') form: any;
  resultStat: any = 1;


  @Output() searchViewMore = new EventEmitter<any>();

  private userInput: string;

  constructor(private log: LoginService, private router: Router, private fetchService: FetchprefilldataService, private appC: AppComponent) {

  }

  ngOnInit() {

    this.log.currentInstitute.subscribe(res => {
      this.instituteName = res;
      this.updatePermissions();
    });

    this.log.currentUsername.subscribe(res => {
      this.userName = res;
    });

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


  checkUserHadAccess() {
    const permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == null || permissionArray == "") {
      this.showAllFields();
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
        if (permissionArray.indexOf('507') != -1) {
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
      }
    }
  }

  showAllFields() {
    document.getElementById('divAdminTag').classList.remove('hide');
    document.getElementById('divMyAccountTag').classList.remove('hide');
    document.getElementById('divMasterTag').classList.remove('hide');
    document.getElementById('divTeacherTag').classList.remove('hide');
    document.getElementById('divFeeTag').classList.remove('hide');
    document.getElementById('divSlotTag').classList.remove('hide');
    document.getElementById('divAcademicTag').classList.remove('hide');
    document.getElementById('divSettingTag').classList.remove('hide');
    document.getElementById('divGeneralSettingTag').classList.remove('hide');
    document.getElementById('divManageFormTag').classList.remove('hide');
    document.getElementById('divAreaAndMap').classList.remove('hide');
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
  }


  hasEnquiryAccess(): boolean {
    let permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null) {
      return true;
    }
    else {
      let data = JSON.parse(permissionArray);
      let id = 115;
      let id2 = 110;
      return (data.indexOf(id) == "-1" && data.indexOf(id2) == "-1")
    }
  }

  hasStudentAccess(): boolean {
    let permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null) {
      return true;
    }
    else {
      let data = JSON.parse(permissionArray);
      let id = 301;
      let id2 = 303;
      return (data.indexOf(id) == "-1" && data.indexOf(id2) == "-1")
    }
  }

  hasCourseAccess(): boolean {
    let permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == "" || permissionArray == null) {
      return true;
    }
    else {
      let data = JSON.parse(permissionArray);
      let id = 402;
      return (data.indexOf(id) == "-1")
    }
  }

  updatePermissions() {
    this.hasEnquiry = this.hasEnquiryAccess();
    this.hasStudent = this.hasStudentAccess();
    this.hasClass = this.hasCourseAccess();
  }

  triggerSearchBox($event) {
    $event.preventDefault();
    this.isResultDisplayed = true;
    this.seachResult.nativeElement.classList.add('searchView');
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
    this.router.navigate(['/student'], { queryParams: { id: s.id } });
  }

  selectedEnquiry(e) {
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

}
