import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { LoginService } from '../../../services/login-services/login.service';
import { MultiBranchDataService } from '../../../services/multiBranchdata.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, AfterViewInit {


  @ViewChild('divAdminTag') divAdminTag: ElementRef;
  @ViewChild('divMyAccountTag') divMyAccountTag: ElementRef;
  @ViewChild('divMasterTag') divMasterTag: ElementRef;
  @ViewChild('divProfileTag') divProfileTag: ElementRef;
  @ViewChild('divTeacherTag') divTeacherTag: ElementRef;
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

  permissionData: any[] = [];
  enquiryResult: any[] = [];
  studentResult: any[] = [];
  branchesList: any = [];
  userType: any = '';
  mainBranchId: any = "";
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

  globalSearchForm: any = {
    name: '',
    phone: '',
    instituteId: sessionStorage.getItem('institute_id'),
    start_index: '0',
    batch_size: '6'
  };

  jsonFlags = {
    isShowLead: false,
    isShowStudent: false,
    isShowModel: false,
    isShowFee: false,
    isShowLiveclass: false,
    isShowCommunicate: true,
    isShowLibrabry: false,
    isShoweStore: false,
    isShoweOnlineExam: false,
    isAdmin: false,
    isShowPowerBy: false,
    isShowExpense: false
  }


  constructor(
    private auth: AuthenticatorService,
    private log: LoginService,
    private router: Router,
    private fetchService: FetchprefilldataService,
    private multiBranchService: MultiBranchDataService,
    private commonService: CommonServiceFactory,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.settings = sessionStorage.getItem('is_exam_grad_feature');
    this.instituteName = sessionStorage.getItem('institute_name');
    this.userName = sessionStorage.getItem('name');
    this.instituteId = sessionStorage.getItem('institute_id');

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
  }

  ngAfterViewInit() {
    this.setActiveClassOnSideNav();
    // Patch added for specific institute to show only Home and Lead module
    // Added by Swapnil
    if (this.instituteId == "101317") {
      this.accessToHomeAndLead();
    }
  }



  hideForUsers() {
    if (sessionStorage.getItem('username') == 'admin' && sessionStorage.getItem('userType') == '0') {
      return true;
    }
    else {
      return false;
    }
  }
  // USER permission
  checkUserHadAccess() {
    // this.divProfileTag.nativeElement.style.display = 'none';
    const permissionArray = sessionStorage.getItem('permissions');
    const usertype = sessionStorage.getItem('userType');
    if (permissionArray == null || permissionArray == "") {
      if (usertype == '0') {
        this.jsonFlags.isAdmin = true;
        this.showAllFields();       // Swapnil
      }
      else if (usertype == '3') {
        this.jsonFlags.isAdmin = true;
        this.jsonFlags.isShowFee = false;
        this.hideAllFields();     // Swapnil
        this.teacherId = JSON.parse(sessionStorage.getItem('institute_info')).teacherId;
        this.setNativeElementValue(['divMyAccountTag'], '');
      }
    } else {
      if (permissionArray != undefined) {
        this.setNativeElementValue(['divMasterTag'], 'none');

        if (permissionArray.indexOf('503') != -1) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divTeacherTag.nativeElement.style.display = '';
          // this.setNativeElementValue(['divMasterTag', 'divTeacherTag'], '');      // Swapnil
          this.setNativeElementValue(['divMasterTag'], '');      // Swapnil
        }
        if (permissionArray.indexOf('506') != -1) {
          this.jsonFlags.isShowFee = true;
          this.setNativeElementValue(['divMasterTag'], '');       // Swapnil
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
        else {
          this.setNativeElementValue(['divSettingTag'], 'none');
        }

        if (permissionArray.indexOf('115') != -1) {
          // this.divManageFormTag.nativeElement.style.display = '';
          // this.divAreaAndMap.nativeElement.style.display = '';
          // this.setNativeElementValue(['divAreaAndMap'], '');       // Swapnil
        }
        if (permissionArray.indexOf('601') != -1) {
          // this.divManageUsers.nativeElement.style.display = '';
          this.setNativeElementValue(['divManageUsers'], '');       // Swapnil
        } else {
          this.setNativeElementValue(['divManageUsers'], 'none');
        }
        if (permissionArray.indexOf('508') != -1) {
          // this.setNativeElementValue(['divClassRoomTag'], '');          // Swapnil
          // this.divClassRoomTag.nativeElement.style.display = '';
        }
      }
    }
  }

  accessToHomeAndLead() {
    this.jsonFlags.isShowStudent = false;
    this.jsonFlags.isShowModel = false;
    this.jsonFlags.isShowFee = false;
    this.jsonFlags.isShowLiveclass = false;
    this.jsonFlags.isShowCommunicate = false;
    this.jsonFlags.isShowLibrabry = false;
    this.jsonFlags.isShoweStore = false;
    this.jsonFlags.isShoweOnlineExam = false;
    this.jsonFlags.isAdmin = false;
    this.jsonFlags.isShowPowerBy = false;
    this.jsonFlags.isShowLead = true;
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
        this.hasCourse(this.permissionData);
        this.hasProducts(this.permissionData);
      }

    }
    else if (userType == 3) {
      /* Teacher login detected */
      this.jsonFlags.isAdmin = false;
      this.teacherLoginFound();
    }

    // please dont chnage this  code from here
    // check these new feature is enable for institute or not
    this.isOnlineExamAllow(type); // check online test is enable or not
    this.isLiveClassesAllow(type);
    this.isElearnAllow();
    this.isLibraryFeatureAllow(permission); // check librabry feature
    this.isExpenseFeatureAllow();
  }

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
    let username = sessionStorage.getItem('username');
    if ((username == "admin" && this.instituteId == 100127) ||
      (username == "admin" && this.instituteId == 101077) ||
      (username == "admin" && this.instituteId == 101223) ||
      (username == "admin" && this.instituteId == 100058) ||
      (username == "admin" && this.instituteId == 100952) ||
      (username == "admin" && this.instituteId == 100135) ||
      (username == "admin" && this.instituteId == 101923) ||
      (permission && permission.indexOf('721') != -1)) {
      this.jsonFlags.isShowLibrabry = true;
    }
  }

  isExpenseFeatureAllow(){
    this.jsonFlags.isShowExpense = false;
    if (this.instituteId == 101238 ||
        this.instituteId == 101242 ||
        this.instituteId == 101008 ||
        this.instituteId == 101243 ||
        this.instituteId == 101244 ||
        this.instituteId == 100058 ||
        this.instituteId == 100127 ||
        this.instituteId == 100126) {
      this.jsonFlags.isShowExpense = true;
    }
  }

  isLiveClassesAllow(type) {
    this.jsonFlags.isShowLiveclass = false;
    // if user is not admin
    this.jsonFlags.isShowLiveclass = this.checkInstSetupType(type, 256);
    // if zoom is enable then also show live class // added by Swapnil
    let zoom = sessionStorage.getItem('is_zoom_enable');
    if(JSON.parse(zoom)){
      this.jsonFlags.isShowLiveclass = true;
    }

  }

  isElearnAllow() {
    // this senction is used for enable elearn feature
    this.jsonFlags.isShoweStore = false;
    if (sessionStorage.getItem('enable_eLearn_feature') == '1') {
      this.jsonFlags.isShoweStore = true;
      if((this.instituteId == 101884 || this.instituteId == 100057) && this.userType == 3){
        this.jsonFlags.isShoweStore = false;
      }
    }
  }

  isOnlineExamAllow(type) {
    if (this.jsonFlags.isAdmin) {// if user is admin
      this.jsonFlags.isShoweOnlineExam = this.checkInstSetupType(type, 4);
    }
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
    if (permissions.includes('110') || permissions.includes('115') || permissions.includes('722')) {
      this.jsonFlags.isShowLead = true;
    }

  }

  hasStudent(permissions) {
    this.jsonFlags.isShowStudent = false;
    if (permissions.includes('301') ||
      permissions.includes('302') ||
      permissions.includes('303')) {
      this.jsonFlags.isShowStudent = true;
    }
  }

  hasCourse(permissions) {
    this.jsonFlags.isShowModel = false;
    if (permissions.includes('401') || permissions.includes('402')
      || permissions.includes('403') || permissions.includes('404') ||
      permissions.includes('405') || permissions.includes('406') ||
      permissions.includes('501') || permissions.includes('502') ||
      permissions.includes('505') || permissions.includes('701') ||
      permissions.includes('704') || permissions.includes('702')) {
      this.jsonFlags.isShowModel = true;
    }
  }


  hasProducts(permissions) {
    this.jsonFlags.isShoweStore = false;
    if (this.isProfessional) {
      if (permissions.includes('401') || permissions.includes('402')
        || permissions.includes('403') || permissions.includes('404') ||
        permissions.includes('405') || permissions.includes('406') ||
        permissions.includes('501') || permissions.includes('502') ||
        permissions.includes('505') || permissions.includes('701') ||
        permissions.includes('704') || permissions.includes('702')) {
        this.jsonFlags.isShoweStore = true;
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
    if (this.log.logoutUser()) {
      this.multiBranchService.subBranchSelected.next(false);
      this.auth.clearStoredData();
      this.auth.changeAuthenticationKey(null);
      this.auth.changeInstituteId(null);
      this.log.changeSidenavStatus('unauthorized');
      sessionStorage.clear();

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
        sessionStorage.setItem('permissions', '');
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

  hasInventoryAccess() {

    if (sessionStorage.getItem('permissions') == '' && sessionStorage.getItem('userType') != '3') {
      return true;
    }
    else if ((sessionStorage.getItem('permissions')).includes('301')) {
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
    sessionStorage.setItem('enable_fee_template_country_wise', res.enable_fee_template_country_wise);
    sessionStorage.setItem('tax_type_without_percentage', res.tax_type);
    sessionStorage.setItem('tax_type_with_percentage', res.tax_type+"(%)");
    sessionStorage.setItem('enable_elearn_course_mapping_feature', res.enable_elearn_course_mapping_feature);
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
    this.router.navigate(['/view/leads'], { queryParams: { id: e.id } });
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
      else
        this.router.navigate(['/view/leads/enquiry/edit/' + d.data.id]); {
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
}
