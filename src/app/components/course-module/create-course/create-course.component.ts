import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { role } from '../../../model/role_features';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  isLangInstitue: boolean = false;
  @ViewChild('liStandard',{static: false}) liStandard: ElementRef;
  @ViewChild('liSubject',{static: false}) liSubject: ElementRef;
  @ViewChild('liManageBatch',{static: false}) liManageBatch: ElementRef;
  @ViewChild('liClass',{static: false}) liClass: ElementRef;
  @ViewChild('liExam',{static: false}) liExam: ElementRef;
  @ViewChild('liTopic',{static: false}) liTopic: ElementRef;
  @ViewChild ('liEcourseMapping', {static: false}) liEcourseMapping: ElementRef;
  @ViewChild ('liRoutine', {static:false}) liRoutine: ElementRef;
  role_feature = role.features;
  jsonFlags = {
    classMenu: false,
    examMenu: false,
    liStandard: false,
    liSubject: false,
    liManageBatch: false
  }

  schoolModel: boolean = false;
  isFromSection: boolean = true;
  activeSession: any = '';
  constructor(
    private router: Router,
    private auth: AuthenticatorService
  ) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitue = true;
        } else {
          this.isLangInstitue = false;
        }
      }
    )
    // changes by Nalini - to handle school model conditions
    this.auth.schoolModel.subscribe(
      res => {
        this.schoolModel = false;
        if (res) {
          this.schoolModel = true;
        }
      }
    )
    this.checkInstituteType();
  }

  checkInstituteType() {
    if (this.isLangInstitue) {
      this.checkUserAcessForLang();
    } else {
      this.checkUserAcessForNotLang();
    }
  }


  checkWhichTabIsOpen() {
    if (this.router.url.includes('standardlist')) {
      this.switchActiveView('liStandard');
      this.isFromSection = true;
    } else if (this.router.url.includes('subject')) {
      this.switchActiveView('liSubject');
      this.isFromSection = true;
    } else if (this.router.url.includes('courselist')) {
      this.switchActiveView('liManageBatch');
      this.isFromSection = true;
    } else if (this.router.url.includes('exam')) {
      this.switchActiveView('liExam');
      this.isFromSection = false;
    } else if (this.router.url.includes('class')) {
      this.switchActiveView('liClass');
      this.isFromSection = false;
    } else if (this.router.url.includes('managebatch')) {
      this.switchActiveView('liManageBatch');
      this.isFromSection = true;
    }else if (this.router.url.includes('topic')) {
      this.switchActiveView('liTopic');
      this.isFromSection = true;
    } else if (this.router.url.includes('ecoursemapping')) {
      this.switchActiveView('liEcourseMapping');
      this.isFromSection = true;
    } else if(this.router.url.includes('routine')) {
      this.switchActiveView('liRoutine');
      this.isFromSection = true;
    }
  }

  switchActiveView(showId) {
    let lists =['liStandard','liSubject','liManageBatch','liExam', 'liEcourseMapping'];
    lists.forEach((object)=>{
      if(this[object]) {
        this[object].nativeElement.classList.remove('active');
      }
    })
    if(!this.isLangInstitue &&this.liTopic){
      this.liTopic.nativeElement.classList.remove('active');
    }
    setTimeout(() => {
      if(document.getElementById(showId) && document.getElementById(showId).classList){
          document.getElementById(showId).classList.add('active');
          this.activeSession = showId;
      }
    }, 500);
  }

  checkUserAcessForNotLang() {
    let userType: any = Number(sessionStorage.getItem('userType'));
    const permissionArray = sessionStorage.getItem('permissions');
    if (userType != 3) {
      if (permissionArray == "" || permissionArray == null) {
        this.showAllTabs();
        this.checkWhichTabIsOpen();
      } else {
        this.hideAllTabs();
        // if (permissionArray != null && permissionArray != "") {
          // Changes done by Nalini - To handle role based conditions
          this.isFromSection = false;
          if (this.role_feature.CLASS_MENU) {
            this.jsonFlags.liManageBatch = true;
            this.jsonFlags.liStandard = true;
            this.jsonFlags.liSubject = true;
            this.isFromSection = true;
            // this.router.navigateByUrl('/view/course/create/standardlist');
            // this.switchActiveView('liStandard');
            }
          if(this.role_feature.CLASS_MENU) {
            this.jsonFlags.classMenu = true;
            // if(!this.role_feature.SETUP_MENU) {
              // this.router.navigateByUrl('/view/course/create/class/home');
              // this.switchActiveView('liClass');
            // }
          }
          if(this.role_feature.EXAMS_MENU) {
            this.jsonFlags.examMenu = true;
            // if(!this.role_feature.CLASS_MENU && !this.role_feature.SETUP_MENU) {
              // this.router.navigateByUrl('/view/course/create/exam');
              // this.switchActiveView('liExam');
            // }
          }
          if(sessionStorage.getItem('isFromCoursePlanner') == 'true') {
            this.isFromSection = false;
          }
            // if(!this.role_feature.CLASS_MENU && !this.role_feature.EXAMS_MENU && !this.role_feature.SETUP_MENU) {
            //   this.switchActiveView('liTopic');
            //   this.router.navigateByUrl('/view/course/create/topic/home');
            // }
          // this.routeToSubTabs(permissionArray);
        }
    } else {
      this.teacherLoginFound();
    }
  }

  routeToSubTabs(data) {
    // if (this.role_feature.SETUP_MENU) {
    //   this.router.navigateByUrl('/view/course/create/standardlist');
    //   this.switchActiveView('liStandard');
    // } else if (data.indexOf('502') != -1) {
    //   this.router.navigateByUrl('/view/course/create/subject');
    //   this.switchActiveView('liSubject');
    // } else if (data.indexOf('505') != -1) {
    //   this.router.navigateByUrl('/view/course/create/courselist');
    //   this.switchActiveView('liManageBatch');
    // } else if (data.indexOf('701') >= 0 || this.role_feature.CLASS_MENU) {
    //   this.router.navigateByUrl('/view/course/create/class/home');
    //   this.switchActiveView('liClass');
    // } else if (data.indexOf('702') >= 0) {
    //   this.router.navigateByUrl('/view/course/create/exam');
    //   this.switchActiveView('liExam');
    // }
  }

  checkUserAcessForLang() {
    let userType: any = Number(sessionStorage.getItem('userType'));
    const permissionArray = sessionStorage.getItem('permissions');
    if (userType != 3) {
      if (permissionArray == "" || permissionArray == null) {
        this.showAllTabs();
        this.checkWhichTabIsOpen();
      } else {
        this.hideAllTabs();
        // if (permissionArray != null && permissionArray != "") {
          // Changes done by Nalini - To handle role based conditions
          this.isFromSection = true;
          if (this.role_feature.CLASS_MENU) {
            this.jsonFlags.liSubject = true;
            this.jsonFlags.liStandard = true;
            this.jsonFlags.liManageBatch = true;
            this.isFromSection = true;
            // this.router.navigateByUrl('/view/course/create/standardlist');
            // this.switchActiveView('liStandard');
            }
            if(this.role_feature.CLASS_MENU) {
              this.jsonFlags.classMenu = false;
              // this.isFromSection = false;
              // if(!this.role_feature.SETUP_MENU) {
              //   this.router.navigateByUrl('/view/course/create/class/home');
              //   this.switchActiveView('liClass');
              // }
            }
          if (this.role_feature.EXAMS_MENU) {
            this.jsonFlags.examMenu = true;
            // this.isFromSection = false;
            // if(!this.role_feature.SETUP_MENU && !this.role_feature.CLASS_MENU) {
            //   this.router.navigateByUrl('/view/course/create/exam');
            //   this.switchActiveView('liExam');
            // }
          }
          if(sessionStorage.getItem('isFromCoursePlanner') == 'true') {
            this.isFromSection = false;
          }
            // if(!this.role_feature.CLASS_MENU && !this.role_feature.EXAMS_MENU && !this.role_feature.SETUP_MENU) {
            //   this.switchActiveView('liTopic');
            //   this.router.navigateByUrl('/view/course/create/topic/home');
            // }
          // this.routeToSubTabsForLang(permissionArray);
        // }
      }
    } else {
      this.teacherLoginFound();
    }
  }

  // routeToSubTabsForLang(data) {
  //   if (data.indexOf('501') != -1) {
  //     this.router.navigateByUrl('/view/course/create/standardlist');
  //     this.switchActiveView('liStandard');
  //   } else if (data.indexOf('502') != -1) {
  //     this.router.navigateByUrl('/view/course/create/subject');
  //     this.switchActiveView('liSubject');
  //   } else if (data.indexOf('401') != -1) {
  //     this.router.navigateByUrl('/view/batch/create/managebatch');
  //     this.switchActiveView('liManageBatch');
  //   } else if (data.indexOf('402') >= 0 || this.role_feature.CLASS_MENU) {
  //     this.router.navigateByUrl('view/batch/create/class/home');
  //     this.switchActiveView('liClass');
  //   } else if (data.indexOf('404') >= 0) {
  //     this.router.navigateByUrl('/view/course/create/exam');
  //     this.switchActiveView('liExam');
  //   }
  // }

  showAllTabs() {
    // Changes done by Nalini - To show all tabs
    let array = Object.keys(this.jsonFlags);
      array.forEach((flag) => {
        this.jsonFlags[flag] = true;
      });
  }

  hideAllTabs() {
    // Changes done by Nalini - To hide all tabs
    let array = Object.keys(this.jsonFlags);
      array.forEach((flag) => {
        this.jsonFlags[flag] = false;
      });
  }

  teacherLoginFound() {
    this.hideAllTabs();
    // Changes done by Nalini - To handle role based conditions
    this.jsonFlags.liManageBatch = true;
    this.jsonFlags.classMenu = true;
    this.jsonFlags.examMenu = true;
    this.checkWhichTabIsOpen();
    // if (this.isLangInstitue) {
    //   this.router.navigateByUrl('/view/batch/create/managebatch');
    //   this.switchActiveView('liManageBatch');
    // } else {
    //   this.router.navigateByUrl('/view/course/create/courselist');
    //   this.switchActiveView('liManageBatch');
    // }
  }

}
