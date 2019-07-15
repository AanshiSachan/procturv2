import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { MultiBranchDataService } from '../../../services/multiBranchdata.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';


@Component({
  selector: 'core-sidednav',
  templateUrl: './core-sidednav.component.html',
  styleUrls: ['./core-sidednav.component.scss']
})

export class CoreSidednavComponent implements OnInit, AfterViewInit {

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
    // private login: LoginService,
    private auth: AuthenticatorService,
    private log: LoginService,
    private router: Router,
    private fetchService: FetchprefilldataService,
    private multiBranchService: MultiBranchDataService,
    private commonService: CommonServiceFactory
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
    if(((username == "admin" && this.instituteId == 100127) || (username == "admin" && this.instituteId == 100952)) || permissionArray.indexOf('721') != -1){
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
    this.divProfileTag.nativeElement.style.display = 'none';
    const permissionArray = sessionStorage.getItem('permissions');
    if (permissionArray == null || permissionArray == "") {
      if (sessionStorage.getItem('userType') == '0') {
        this.showAllFields();
      }
      else if (sessionStorage.getItem('userType') == '3') {
        this.hideAllFields();
        this.teacherId = JSON.parse(sessionStorage.getItem('institute_info')).teacherId;
        // this.divProfileTag.nativeElement.style.display = '';
        this.setNativeElementValue(['divProfileTag'], '');

        // this.divAdminTag.nativeElement.style.display = 'none';
        // this.divAcademicTag.nativeElement.style.display = 'none';
        this.setNativeElementValue(['divAcademicTag'], 'none');
      }
    } else {
      if (permissionArray != undefined) {
        this.hideAllFields();
        if (permissionArray.indexOf('503') != -1) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divTeacherTag.nativeElement.style.display = '';
          this.setNativeElementValue(['divMasterTag', 'divTeacherTag'], '');
        }
        if (permissionArray.indexOf('506') != -1) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divFeeTag.nativeElement.style.display = '';
          this.setNativeElementValue(['divMasterTag', 'divFeeTag'], '');
        }
        if (permissionArray.indexOf('507') != -1 && this.isProfessional) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divSlotTag.nativeElement.style.display = '';
          this.setNativeElementValue(['divMasterTag', 'divSlotTag'], '');
        }
        if (permissionArray.indexOf('509') != -1) {
          // this.divMasterTag.nativeElement.style.display = '';
          // this.divAcademicTag.nativeElement.style.display = '';
          this.setNativeElementValue(['divMasterTag', 'divAcademicTag'], '');
        }
        if (permissionArray.indexOf('602') != -1) {
          // this.divSettingTag.nativeElement.style.display = '';
          // this.divMyAccountTag.nativeElement.style.display = '';
          this.setNativeElementValue(['divSettingTag', 'divMyAccountTag'], '');
        }
        if (permissionArray.indexOf('603') != -1) {
          // this.divSettingTag.nativeElement.style.display = '';
          // this.divGeneralSettingTag.nativeElement.style.display = '';
          this.setNativeElementValue(['divSettingTag', 'divGeneralSettingTag'], '');
        }
        if (permissionArray.indexOf('115') != -1) {
          // this.divManageFormTag.nativeElement.style.display = '';
          // this.divAreaAndMap.nativeElement.style.display = '';
          this.setNativeElementValue(['divAreaAndMap'], '');
        }
        if (permissionArray.indexOf('601') != -1) {
          // this.divManageUsers.nativeElement.style.display = '';
          this.setNativeElementValue(['divManageUsers'], '');
        }
        if (permissionArray.indexOf('508') != -1) {
          this.setNativeElementValue(['divClassRoomTag'], '');
          // this.divClassRoomTag.nativeElement.style.display = '';
        }
      }
    }
  }

  showAllFields() {
    // this.divAdminTag.nativeElement.style.display = '';
    // this.divMyAccountTag.nativeElement.style.display = '';
    // this.divMasterTag.nativeElement.style.display = '';
    // this.divTeacherTag.nativeElement.style.display = '';
    // this.divFeeTag.nativeElement.style.display = '';
    // this.divAcademicTag.nativeElement.style.display = '';
    // this.divSettingTag.nativeElement.style.display = '';
    // this.divGeneralSettingTag.nativeElement.style.display = '';
    // this.divManageFormTag.nativeElement.style.display = '';
    // this.divManageUsers.nativeElement.style.display = '';
    // this.divClassRoomTag.nativeElement.style.display = '';
    let array = ['divMyAccountTag', 'divMasterTag', 'divTeacherTag', 'divFeeTag', 'divAcademicTag',
      'divSettingTag', 'divGeneralSettingTag', 'divManageFormTag', 'divManageUsers', 'divClassRoomTag'];
    this.setNativeElementValue(array, '');
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
    // this.divAdminTag.nativeElement.style.display = 'none';
    // this.divMyAccountTag.nativeElement.style.display = 'none';
    // this.divMasterTag.nativeElement.style.display = 'none';
    // this.divTeacherTag.nativeElement.style.display = 'none';
    // this.divFeeTag.nativeElement.style.display = 'none';

    // this.divSlotTag.nativeElement.style.display = 'none';
    // this.divAcademicTag.nativeElement.style.display = 'none';
    // this.divSettingTag.nativeElement.style.display = 'none';
    // this.divGeneralSettingTag.nativeElement.style.display = 'none';
    // this.divManageFormTag.nativeElement.style.display = 'none';

    // this.divAreaAndMap.nativeElement.style.display = 'none';
    // this.divManageUsers.nativeElement.style.display = 'none';
    // this.divGradesTag.nativeElement.style.display = 'none';
    // this.divClassRoomTag.nativeElement.style.display = 'none';
    // this.divManageTag.nativeElement.style.display = 'none';
    let array = ['divMyAccountTag', 'divMasterTag', 'divTeacherTag', 'divFeeTag',
      'divSlotTag', 'divAcademicTag', 'divSettingTag', 'divGeneralSettingTag', 'divManageFormTag',
      'divAreaAndMap', 'divManageUsers', 'divGradesTag', 'divClassRoomTag', 'divManageTag'];
    this.setNativeElementValue(array, 'none');
  }

  setNativeElementValue(tagArray: any[], value) {

    for (let index in tagArray) {
      this[tagArray[index]].nativeElement.style.display = value;
    }

  }

  checkManinBranch(){

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
        document.getElementById('lione').classList.remove('hide');
        document.getElementById('litwo').classList.remove('hide');
        document.getElementById('lithree').classList.remove('hide');
        document.getElementById('lifour').classList.remove('hide');
        document.getElementById('lifive').classList.remove('hide');
        document.getElementById('lisix').classList.remove('hide');
        document.getElementById('liseven').classList.remove('hide');
        document.getElementById('lieight').classList.remove('hide');
        document.getElementById('linine').classList.remove('hide');
        document.getElementById('lizero').classList.remove('active');
        // document.getElementById('liten').classList.remove('hide');
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
      }
    }
    /* Teacher login detected */
    else if (userType == 3) {
      this.teacherLoginFound();
    }

    let username = sessionStorage.getItem('username');
    if((username == "admin" && this.instituteId == 100127) || (username == "admin" && this.instituteId == 101077) || p.indexOf('721') != -1){
      document.getElementById('liten').classList.remove('hide');
    }

  }



  loggedout() {
    document.getElementById('lione').classList.add('hide');
    document.getElementById('litwo').classList.add('hide');
    document.getElementById('lithree').classList.add('hide');
    document.getElementById('lifour').classList.add('hide');
    document.getElementById('lifive').classList.add('hide');
    document.getElementById('lisix').classList.add('hide');
    document.getElementById('liseven').classList.add('hide');
    document.getElementById('lieight').classList.add('hide');
    document.getElementById('linine').classList.add('hide');
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
    if (permissions.includes('301') || permissions.includes('302') || permissions.includes('303')) {
      document.getElementById('litwo').classList.remove('hide');
    }
    else {
      document.getElementById('litwo').classList.add('hide');
    }
  }



  hasCourse(permissions) {
    if (permissions.includes('401') || permissions.includes('402') || permissions.includes('403') || permissions.includes('404') || permissions.includes('405') || permissions.includes('406') || permissions.includes('501') || permissions.includes('502') || permissions.includes('505') || permissions.includes('701') || permissions.includes('704') || permissions.includes('702') || permissions.includes('404')) {
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
    if (permissions.includes('201') || permissions.includes('202') || permissions.includes('203') || permissions.includes('204') || permissions.includes('205') || permissions.includes('206') || permissions.includes('207') || permissions.includes('208')) {
      document.getElementById('lisix').classList.remove('hide');
    }
    else {
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


  hasExam(permissions) {
    if (permissions.includes('103') || permissions.includes('112') || permissions.includes('203') || permissions.includes('404')) {
      //document.getElementById('liten').classList.remove('hide');
    }
    else { }
  }

  /* Function to set the id for setActive function to act upon */
  toggler(id) {
    this.RemoveActiveTabs();
    if (id === 'lione' || id === 'li1') {
      id = 'lione';
      document.getElementById('lione').classList.add('active');
    }
    else if (id === 'litwo' || id === 'li2') {
      id = 'litwo';
      document.getElementById('litwo').classList.add('active');
    }
    else if (id === 'lithree' || id === 'li3') {
      id = 'lithree';
      document.getElementById('lithree').classList.add('active');
    }
    else if (id === 'lifour' || id === 'li4') {
      id = 'lifour';
      document.getElementById('lifour').classList.add('active');
    }
    else if (id === 'lifive' || id === 'li5') {
      id = 'lifive';
      document.getElementById('lifive').classList.add('active');
    }
    else if (id === 'lisix' || id === 'li6') {
      id = 'lisix';
      document.getElementById('lisix').classList.add('active');
    }
    else if (id === 'liseven' || id === 'li7') {
      id = 'liseven';
      document.getElementById('liseven').classList.add('active');
    }
    else if (id === 'lieight' || id === 'li8') {
      id = 'lieight';
      document.getElementById('lieight').classList.add('active');
    }
    else if (id === 'linine' || id === 'li9') {
      id = 'linine';
      document.getElementById('linine').classList.add('active');
    }
    else if (id === 'liten' || id === 'liX') {
      id = 'liten';
      document.getElementById('liten').classList.add('active');
    }
    else if (id === 'lizero' || id === 'li0') {
      id = 'lizero';
      document.getElementById('lizero').classList.add('active');
    }
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
    document.getElementById('lione').classList.add('hide');
    document.getElementById('litwo').classList.add('hide');
    document.getElementById('lifive').classList.add('hide');
    document.getElementById('liseven').classList.add('hide');
    document.getElementById('lieight').classList.add('hide');
    document.getElementById('linine').classList.add('hide');

    document.getElementById('lithree').classList.remove('hide');
    document.getElementById('lifour').classList.remove('hide');
    document.getElementById('lisix').classList.remove('hide');
  }

  RemoveActiveTabs() {
    document.getElementById('lizero').classList.remove('active');
    document.getElementById('lione').classList.remove('active');
    document.getElementById('litwo').classList.remove('active');
    document.getElementById('lithree').classList.remove('active');
    document.getElementById('lifour').classList.remove('active');
    document.getElementById('lifive').classList.remove('active');
    document.getElementById('lisix').classList.remove('active');
    document.getElementById('liseven').classList.remove('active');
    document.getElementById('lieight').classList.remove('active');
    document.getElementById('linine').classList.remove('active');
    document.getElementById('liten').classList.remove('active');
    /* document.getElementById('liten').classList.add('active');
      document.getElementById('lieleven').classList.remove('active'); */
  }

  setActiveClassOnSideNav() {
    this.RemoveActiveTabs();
    let url: string = window.location.href;
    if (url.includes('admin')) {
      document.getElementById('lizero').classList.add('active');
    } else if (url.includes('enquiry')) {
      document.getElementById('lione').classList.add('active');
    } else if (url.includes('student')) {
      document.getElementById('litwo').classList.add('active');
    } else if (url.includes('course')) {
      document.getElementById('lithree').classList.add('active');
    } else if (url.includes('activity')) {
      document.getElementById('lifour').classList.add('active');
    } else if (url.includes('reports')) {
      document.getElementById('lisix').classList.add('active');
    } else if (url.includes('inventory')) {
      document.getElementById('liseven').classList.add('active');
    } else if (url.includes('campaign')) {
      document.getElementById('linine').classList.add('active');
    } else if (url.includes('library')) {
      document.getElementById('liten').classList.add('active');
    }
  }


  // From Headers section
  showHelpMenu(){
    if(this.helpMenu){
      this.helpMenu = false;
    }
    else{
      this.helpMenu = true;
    }
    this.sideBar = false;
    this.searchBar = false;
  }

  showMenu(){
    this.sideBar = true;
    this.helpMenu = false;
    this.searchBar = false;
    let totalExternalClasses = document.getElementsByClassName("external-menu").length;
    let externalMenu = document.getElementsByClassName("external-menu") as HTMLCollectionOf<HTMLElement>;
    for(let i = 0; i < totalExternalClasses; i++){
      externalMenu[i].style.display = "none";
    }
  }

  closeMenu(){
    this.sideBar = false;
    this.searchBar = false;
    this.helpMenu = false;
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
    for(let i = 0; i < totalExternalClasses; i++){
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

  changeIcon(id){
    document.getElementById(id+"_icon").setAttribute( 'src', "./assets/images/sidebar/sideMenu/"+id+"_color.svg");
  }

  showSubMenu(id){
    if(document.getElementById(id).style.display == 'block'){
      document.getElementById(id).style.display = "none";
      // document.getElementById(id+"_current").classList.remove('active-current-menu');
      // document.getElementById(id+"_icon").setAttribute( 'src', "./assets/images/sidebar/sideMenu/"+id+".svg");
      // document.getElementById(id+"icon").src = "./assets/images/sidebar/sideMenu/"+id+".svg";
      return;
    }
    else{
      let totalExternalClasses = document.getElementsByClassName("external-menu").length;
      let externalMenu = document.getElementsByClassName("external-menu") as HTMLCollectionOf<HTMLElement>;
      for(let i = 0; i < totalExternalClasses; i++){
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
      document.getElementById(id).style.display = "block";
    }
  };


  routerLink(route){
    this.sideBar = false;
    let totalCurrentClasses = document.getElementsByClassName("current-menu").length;
    let currentMenu = document.getElementsByClassName("current-menu") as HTMLCollectionOf<HTMLElement>;
    for(let i = 0; i < totalCurrentClasses; i++){
      currentMenu[i].classList.remove('active-current-menu');
    }
    this.router.navigate([route]);
  }

  viewTeacherProfile() {
    this.router.navigate(['/view/teacher/edit/', this.teacherId]);
  }

  fillSessionStorageCommonFields(res){
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

  // closeSubMenu(){
  //   let totalExternalClasses = document.getElementsByClassName("external-menu").length;
  //   for(let i = 0; i < totalExternalClasses; i++){
  //     document.getElementsByClassName("external-menu")[i].style.display = "none";
  //   }
  // }


  // FOR Search
  showSearchBar(){
    this.searchBar = true;
    window.setTimeout(function ()
    {
      document.getElementById("search_bar").focus();
    }, 550);
  }

  closeSearchBar(){
    this.searchBar = false;
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
    this.router.navigate(['/view/student'], { queryParams: { id: s.id } });
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
      this.router.navigate(['/view/student'], { queryParams: { id: d.data.id, action: d.action } });
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

  openInNewTab(url: string){
    window.open(url, "_blank");
    this.helpMenu = false;
  }

}
