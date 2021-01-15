import { Component, OnInit } from '@angular/core';
import { role } from '../../../model/role_features';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-course-home',
  templateUrl: './course-home.component.html',
  styleUrls: ['./course-home.component.scss']
})
export class CourseHomeComponent implements OnInit {
  isLangInstitue: boolean = false;
  
  jsonFlags={
    isShowSetup:false,
    isShowFileManager:false,
    isShowArchiving:false,
    isShowModel:false,
    isShowClass:false,
    isShowExam:false,
    isShowClassPlanner:false,
    isShowEcourseMapping: false,
    isEcourseFileManager: false,
    isShowOnlineAssignment : false
  }
  role_feature = role.features;
  schoolModel: boolean = false;

  constructor(   private auth: AuthenticatorService) { 
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
    const permissionArray = sessionStorage.getItem('permissions');
    const permittedRoles = sessionStorage.getItem('permitted_roles');
    const userType = sessionStorage.getItem('userType');
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitue = true;
        } else {
          this.isLangInstitue = false;
        }
      }
    );

    this.checkPermissions();
    if (userType == '0' && (permissionArray == "" || permissionArray == null)) {
      this.jsonFlags.isShowEcourseMapping = true;
    }

    if (sessionStorage.getItem('enable_elearn_course_mapping_feature') == '1') {
      this.jsonFlags.isShowEcourseMapping = true;
    }

    if (this.role_feature.STUDY_MATERIAL_MENU && sessionStorage.getItem('enable_eLearn_feature') == '1') {
      this.jsonFlags.isEcourseFileManager = true;
    }

    this.jsonFlags.isShowOnlineAssignment =  false;
    if(sessionStorage.getItem('enable_online_assignment_feature') == '1') {
      this.jsonFlags.isShowOnlineAssignment = true;
    }
  }

  checkPermissions(){
   let perm = sessionStorage.getItem('permissions');
   let userType = sessionStorage.getItem('userType');
    if ((userType=='0')&&((perm == null || perm == undefined || perm == ''))){
      let array = Object.keys( this.jsonFlags);
      array.forEach((flag)=>{
        this.jsonFlags[flag]= true;
      })
    }
    else if((userType=='3')){
      this.jsonFlags.isShowModel = false;
      this.jsonFlags.isShowArchiving = false;
       let array = ['isShowFileManager','isShowExam','isShowClass','isShowClassPlanner'];

        array.forEach((flag)=>{
          this.jsonFlags[flag]=true;
        });         
    }
    else{
      this.jsonFlags.isShowModel = true;
      if (this.role_feature.STUDY_MATERIAL_MENU) {
        this.jsonFlags.isShowFileManager = true;
      }

      if (this.role_feature.CLASS_MENU) {
        this.jsonFlags.isShowClass = true;
      }
      if (this.role_feature.EXAMS_MENU) {
        this.jsonFlags.isShowExam = true;
      }
      if (this.role_feature.CLASS_MENU) {
        this.jsonFlags.isShowClassPlanner = true;
      }
    }
  }

}
