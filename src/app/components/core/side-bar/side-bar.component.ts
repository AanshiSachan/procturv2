import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { MultiBranchDataService } from '../../../services/multiBranchdata.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, AfterViewChecked {

  logs: string = ''
  isLangInstitute: boolean = false;
  permissionData: any[] = [];
  userType: any = '';
  sideBar: boolean = false;
  searchBar: boolean = false;
  helpMenu: boolean = false;

  // From Header
  isProfessional: boolean = false;
  isResultDisplayed: boolean;
  instituteName: string;
  userName: string;
  menuToggler: boolean = false;
  // hasEnquiry: boolean = true;
  // hasStudent: boolean = true;
  // hasClass: boolean = true;
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
  };

  resultStat: any = 1;
  teacherId: any = 0;
  private userInput: string;
  branchesList: any = [];
  mainBranchId: any = "";
  isMainBranch: any = "N";
  showMainBranchBackBtn: boolean = false;
  checkAdmin: any = "";
  libraryRole: boolean = false;
  instituteId: any;
  activeSession: any;

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

  // Search inputValue
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('seachResult') seachResult: ElementRef;
  @ViewChild('form') form: any;

  @Output() searchViewMore = new EventEmitter<any>();
  @Output() enquiryUpdateAction = new EventEmitter<any>();
  @Output() hideSearchPopup = new EventEmitter<any>();
  @Output() changePassword = new EventEmitter<any>();

  constructor(
    private login: LoginService,
    private auth: AuthenticatorService,
    private log: LoginService,
    private router: Router,
    private fetchService: FetchprefilldataService,
    private multiBranchService: MultiBranchDataService,
    private commonService: CommonServiceFactory,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.log.currentUserType.subscribe(e => {
      if (e == '' || e == null || e == undefined) {
      }
      else {
        this.userType = e
      }
    });

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
    this.instituteId = sessionStorage.getItem('institute_id');

    const permissionArray = sessionStorage.getItem('permissions');
    let username = sessionStorage.getItem('username');
    if (((username == "admin" && this.instituteId == 100127) || (username == "admin" && this.instituteId == 100952)) || (permissionArray && permissionArray.indexOf('721') != -1)) {
      this.libraryRole = true;
    }

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

    this.checkInstituteType();

    this.checkManinBranch();
  }

  // USER permission
  checkUserHadAccess() {
    // this.divProfileTag.nativeElement.style.display = 'none';
    const permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == null || permissionArray == "") {
      if (sessionStorage.getItem('userType') == '0') {
        this.showAllFields();       // Swapnil
      }
      else if (sessionStorage.getItem('userType') == '3') {
        this.hideAllFields();     // Swapnil
        this.teacherId = JSON.parse(sessionStorage.getItem('institute_info')).teacherId;
        // this.divProfileTag.nativeElement.style.display = '';
        // this.setNativeElementValue(['divProfileTag'], '');    // Swapnil

        // this.divAdminTag.nativeElement.style.display = 'none';
        // this.divAcademicTag.nativeElement.style.display = 'none';
        // this.setNativeElementValue(['divAcademicTag'], 'none');     // Swapnil
      }
    } else {
      if (permissionArray != undefined) {
        // this.hideAllFields();       // Swapnil
        if (permissionArray.indexOf('503') != -1) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divTeacherTag.nativeElement.style.display = '';
          // this.setNativeElementValue(['divMasterTag', 'divTeacherTag'], '');      // Swapnil
          this.setNativeElementValue(['divMasterTag'], '');      // Swapnil
        }
        if (permissionArray.indexOf('506') != -1) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divFeeTag.nativeElement.style.display = '';
          this.setNativeElementValue(['divMasterTag', 'divFeeTag'], '');       // Swapnil
        }
        if (permissionArray.indexOf('507') != -1 && this.isProfessional) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divSlotTag.nativeElement.style.display = '';
          // this.setNativeElementValue(['divMasterTag', 'divSlotTag'], '');       // Swapnil
          this.setNativeElementValue(['divMasterTag'], '');       // Swapnil
        }
        if (permissionArray.indexOf('509') != -1) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divAcademicTag.nativeElement.style.display = '';
          // this.setNativeElementValue(['divMasterTag', 'divAcademicTag'], '');      // Swapnil
          this.setNativeElementValue(['divMasterTag'], '');      // Swapnil
        }
        if (permissionArray.indexOf('602') != -1) {
          // this.divSettingTag.nativeElement.style.display = '';
          // this.divMyAccountTag.nativeElement.style.display = '';
          this.setNativeElementValue(['divSettingTag', 'divMyAccountTag'], '');      // Swapnil
        }
        if (permissionArray.indexOf('603') != -1) {
          // this.divSettingTag.nativeElement.style.display = '';
          // this.divGeneralSettingTag.nativeElement.style.display = '';
          // this.setNativeElementValue(['divSettingTag', 'divGeneralSettingTag'], '');      // Swapnil
          this.setNativeElementValue(['divSettingTag'], '');      // Swapnil

        }
        if (permissionArray.indexOf('115') != -1) {
          // this.divManageFormTag.nativeElement.style.display = '';
          // this.divAreaAndMap.nativeElement.style.display = '';
          // this.setNativeElementValue(['divAreaAndMap'], '');       // Swapnil
        }
        if (permissionArray.indexOf('601') != -1) {
          // this.divManageUsers.nativeElement.style.display = '';
          this.setNativeElementValue(['divManageUsers'], '');       // Swapnil
        }
        if (permissionArray.indexOf('508') != -1) {
          // this.setNativeElementValue(['divClassRoomTag'], '');          // Swapnil
          // this.divClassRoomTag.nativeElement.style.display = '';
        }
      }
    }
  }

  showAllFields() {
    // let array = ['divMyAccountTag', 'divMasterTag', 'divTeacherTag', 'divFeeTag', 'divAcademicTag',
    //   'divSettingTag', 'divGeneralSettingTag', 'divManageFormTag', 'divManageUsers', 'divClassRoomTag'];
    let array = ['divMyAccountTag', 'divMasterTag', 'divFeeTag', 'divSettingTag', 'divManag'];
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
    // let array = ['divMyAccountTag', 'divMasterTag', 'divTeacherTag', 'divFeeTag',
    //   'divSlotTag', 'divAcademicTag', 'divSettingTag', 'divGeneralSettingTag', 'divManageFormTag',
    //   'divAreaAndMap', 'divManageUsers', 'divGradesTag', 'divClassRoomTag', 'divManageTag'];
    let array = ['divMyAccountTag', 'divMasterTag', 'divFeeTag', 'divSettingTag', 'divManageUsers'];
    this.setNativeElementValue(array, 'none');
  }

  setNativeElementValue(tagArray: any[], value) {
    console.log(tagArray)
    for (let index in tagArray) {
      // this[tagArray[index]].nativeElement.style.display = value;
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
          }
        }
      }
    )
  }

  ngAfterViewInit() {
    this.setActiveClassOnSideNav();
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


  createCustomSidenav() {
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
    if (e != '' && e != null && e != undefined) {
      this.userType = e;
      this.log.changeUserType(e);
    }

    let userType: any = this.userType;
    let permission: any = this.permissionData;
    /* Admin or Custom login */
    if (userType == 0) {
      /* admin detected */
      if (permission == null || permission == undefined || permission == '') {
        let hideArray = ['lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine', 'lieleone', 'litwelve'];
        hideArray.forEach(obj => {
          if (document.getElementById(obj)) {
            document.getElementById(obj).classList.remove('hide');
          }
        })
        document.getElementById('lizero').classList.remove('active');
        if (this.isProfessional || sessionStorage.getItem('enable_eLearn_feature') == '0') {
          document.getElementById('lieleone').classList.add('hide');
        }
      }
      /* custom user detected */
      else {
        /* array to store the user permissions, if the permission length is less than equal to one
        remove the first and last char and validate if its admin or not */
        this.hasEnquiry(this.permissionData);
        this.hasStudent(this.permissionData);
        this.hasCourse(this.permissionData);
        this.hasActivity(this.permissionData);
        this.hasEmployee(this.permissionData);
        this.hasReport(this.permissionData);
        this.hasInventory(this.permissionData);
        this.hasExpense(this.permissionData);
        this.hasCampaign(this.permissionData);
        this.hasProducts(this.permissionData);
      }
    }
    /* Teacher login detected */
    else if (userType == 3) {
      this.teacherLoginFound();
    }

    let username = sessionStorage.getItem('username');
    if ((username == "admin" && this.instituteId == 100127) || (username == "admin" && this.instituteId == 101077) || (permission && permission.indexOf('721') != -1)) {
      document.getElementById('liten').classList.remove('hide');
    }

  }

  /// loggedout user
  loggedout() {
    let hideArray = ['lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine'];
    hideArray.forEach(object => {
      if (document.getElementById(object)) {
        document.getElementById(object).classList.add('hide');
      }
    });
    document.getElementById('lizero').classList.add('active');
  }



  hasEnquiry(permissions) {
    if (permissions.includes('110') || permissions.includes('115')) {
      document.getElementById('lione').classList.remove('hide');
    }
    else {
      document.getElementById('lione').classList.add('hide');
    }
  }



  hasStudent(permissions) {
    if (permissions.includes('301') ||
      permissions.includes('302') ||
      permissions.includes('303')) {
      document.getElementById('litwo').classList.remove('hide');
    }
    else {
      document.getElementById('litwo').classList.add('hide');
    }
  }



  hasCourse(permissions) {
    if (permissions.includes('401') || permissions.includes('402')
      || permissions.includes('403') || permissions.includes('404') ||
      permissions.includes('405') || permissions.includes('406') ||
      permissions.includes('501') || permissions.includes('502') ||
      permissions.includes('505') || permissions.includes('701') ||
      permissions.includes('704') || permissions.includes('702')) {
      document.getElementById('lithree').classList.remove('hide');
    }
    else {
      document.getElementById('lithree').classList.add('hide');
    }
  }


  hasActivity(permissions) {
    if (permissions.includes('102') || permissions.includes('114') || permissions.includes('113')) {
      document.getElementById('lifour').classList.remove('hide');
    }
    else {
      document.getElementById('lifour').classList.add('hide');
    }
  }



  hasEmployee(permissions) {
    if (permissions.includes('118') || permissions.includes('119') || permissions.includes('120') || permissions.includes('121')) {
      document.getElementById('lifive').classList.remove('hide');
    }
    else {
      document.getElementById('lifive').classList.add('hide');
    }
  }



  hasReport(permissions) {

    if (permissions.includes('201') || permissions.includes('202') ||
      permissions.includes('203') || permissions.includes('204') ||
      permissions.includes('205') || permissions.includes('206') ||
      permissions.includes('207') || permissions.includes('208') ||
      permissions.includes('722')) {
      document.getElementById('lisix').classList.remove('hide');
    } else {
      document.getElementById('lisix').classList.add('hide');
    }
  }



  hasInventory(permissions) {
    if (permissions.includes('301')) {
      document.getElementById('liseven').classList.remove('hide');
    }
    else {
      document.getElementById('liseven').classList.add('hide');
    }
  }


  hasExpense(permissions) {
    if (permissions.includes('108') || permissions.includes('109')) {
      document.getElementById('lieight').classList.remove('hide');
    }
    else {
      document.getElementById('lieight').classList.add('hide');
    }
  }


  hasCampaign(permissions) {
    if (permissions.includes('115')) {
      document.getElementById('linine').classList.remove('hide');
    }
    else {
      document.getElementById('linine').classList.add('hide');
    }
  }

  hasProducts(permissions) {
    if (this.isProfessional) {
      if (permissions.includes('401') || permissions.includes('402')
        || permissions.includes('403') || permissions.includes('404') ||
        permissions.includes('405') || permissions.includes('406') ||
        permissions.includes('501') || permissions.includes('502') ||
        permissions.includes('505') || permissions.includes('701') ||
        permissions.includes('704') || permissions.includes('702')) {
        document.getElementById('lieleone').classList.remove('hide');
      }
      else {
        document.getElementById('lieleone').classList.add('hide');
      }
    }
  }


  hasExam(permissions) {
    if (permissions.includes('103') || permissions.includes('112') || permissions.includes('203') || permissions.includes('404')) {
      //document.getElementById('liten').classList.remove('hide');
    }
    else { }
  }
  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  /* Function to set the id for setActive function to act upon */
  toggler(id) {
    this.activeSession = id;
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
    let hideArray = ['lione', 'litwo', 'lifive', 'liseven', 'lieight', 'linine'];
    hideArray.forEach(object => {
      if (document.getElementById(object)) {
        document.getElementById(object).classList.add('hide');
      }
    });

    let removeArray = ['lithree', 'lifour', 'lisix'];
    removeArray.forEach(object => {
      if (document.getElementById(object)) {
        document.getElementById(object).classList.remove('hide');
      }
    });
  }

  RemoveActiveTabs() {
    let removeArray = ['lizero', 'lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine', 'liten', 'lieleone', 'litwelve'];
    removeArray.forEach(object => {
      if (document.getElementById(object)) {
        document.getElementById(object).classList.remove('active');
      }
    });
  }

  setActiveClassOnSideNav() {
    this.RemoveActiveTabs();
    let url: string = window.location.href;
    let pathLastURL = url.substring(url.lastIndexOf("/") + 1, url.length);
    let routesData = {
      'admin': 'lizero',
      'enquiry': 'lione',
      'student': 'litwo',
      'course': 'lithree',
      'activity': 'lifour',
      'reports': 'lisix',
      'inventory': 'liseven',
      'campaign': 'linine',
      'library': 'liten',
      'products': 'lieleone',
      'online-exam': 'litwelve'
    };
    if (document.getElementById(routesData[pathLastURL])) {
      this.activeSession = routesData[pathLastURL];
      document.getElementById(routesData[pathLastURL]).classList.add('active');
    }
  }

  showSubSection(id) {
    // for (let i = 0; i < 5; i++) {
    //   document.getElementsByClassName("side-section") && document.getElementsByClassName("side-section")[i].classList.remove('active-current-menu');
    // }
   if(document.getElementById(id)){
    document.getElementById(id).className = ' side-section';
    document.getElementById(id).classList.add('active-current-menu');
   }
     
    this.helpMenu = true;
    if (document.getElementById('blurBg'))
      {
        document.getElementById('blurBg').className = 'blur-background';
      }
  }

  // From Headers section
  showHelpMenu() {
    if (this.helpMenu) {
      this.helpMenu = false;
    }
    else {
      this.helpMenu = true;
    }
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
    document.getElementById('blurBg').className = 'normal-background';
    for (let i = 0; i < 5; i++) {
      document.getElementsByClassName("side-section")[i].classList.remove('active-current-menu');
      document.getElementsByClassName("side-section")[i].className = ' side-section';
    }

  }

  logout() {
    this.clearSearch();
    if (this.log.logoutUser()) {
      this.multiBranchService.subBranchSelected.next(false);
      this.router.navigateByUrl('/authPage');
    }
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
        this.getCountryData(data.institute_id);
        this.router.navigateByUrl('/authPage');
      },
      err => {

      }
    )
  }

  getCountryData(institute_id) {
    this.login.getInstituteCountryDetails(institute_id).subscribe(
      (res: any) => {
        let country_info = JSON.stringify(res);
        sessionStorage.setItem('country_data', btoa(country_info));
      },
      err => {
        console.log(err);
      }
    );
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
    sessionStorage.setItem('permissions', '');
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


  routerLink(route, id) {
    // for (let i = 0; i < 5; i++) {
    //   console.log(document.getElementsByClassName("side-section")[i].classList)
    //   // document.getElementsByClassName("side-section")[i].classList.remove('active-current-menu');
    // }
    this.sideBar = false;
    let totalCurrentClasses = document.getElementsByClassName("current-menu").length;
    let currentMenu = document.getElementsByClassName("current-menu") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < totalCurrentClasses; i++) {
      currentMenu[i].classList.remove('active-current-menu');
    }
    document.getElementById(id).className += ' remove-current-menu';
    document.getElementById('blurBg').className = 'normal-background';
    this.activeSession = null;
    this.router.navigate([route]);
  }

  viewTeacherProfile() {
    this.router.navigate(['/view/teacher/edit/', this.teacherId]);
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
    sessionStorage.setItem('enable_eLearn_feature', res.enable_eLearn_feature);//
    sessionStorage.setItem('open_enq_Visibility_feature', res.open_enq_Visibility_feature);
  }

  // closeSubMenu(){
  //   let totalExternalClasses = document.getElementsByClassName("external-menu").length;
  //   for(let i = 0; i < totalExternalClasses; i++){
  //     document.getElementsByClassName("external-menu")[i].style.display = "none";
  //   }
  // }


  // FOR Search
  showSearchBar() {
    this.searchBar = true;
    window.setTimeout(function () {
      document.getElementById("search_bar").focus();
    }, 550);
  }

  closeSearchBar() {
    this.searchBar = false;
  }

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

  selectedStudent(s) {
    this.closeSearch(false);
    this.router.navigate(['/view/students'], { queryParams: { id: s.id } });
    this.searchBar = false;
  }

  selectedEnquiry(e) {
    this.closeSearch(false);
    this.router.navigate(['/view/enquiry'], { queryParams: { id: e.id } });
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
    this.searchBar = false;
  }

  actionSelected(d) {
    this.closeSearch(false);
    if (d.data.source == "Student") {
      this.router.navigate(['/view/students'], { queryParams: { id: d.data.id, action: d.action } });
      this.searchBar = false;
    }
    else if (d.data.source == "Enquiry") {
      if (d.action == "enquiryUpdate") {
        this.enquiryUpdateAction.emit(d);
        this.searchBar = false;
      }
      else {
        this.router.navigate(['/view/enquiry'], { queryParams: { id: d.data.id, action: d.action } });
        this.searchBar = false;
      }
    }
  }

  openInNewTab(url: string) {
    window.open(url, "_blank");
    this.helpMenu = false;
  }
}
