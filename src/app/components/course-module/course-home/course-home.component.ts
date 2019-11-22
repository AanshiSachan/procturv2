import { Component, OnInit } from '@angular/core';
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
    isShowClassPlanner:false
  }

  constructor(   private auth: AuthenticatorService) { }

  ngOnInit() {
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
      if (perm.includes('114')) {
        this.jsonFlags.isShowFileManager = true;
      }

      if (perm.includes('701')) {
        this.jsonFlags.isShowClass = true;
      }
      if (perm.includes('702')) {
        this.jsonFlags.isShowExam = true;
      }
      if (perm.includes('704')) {
        this.jsonFlags.isShowClassPlanner = true;
      }
    }
  }

}
