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
      this.jsonFlags.isShowSetup= true;
      this.jsonFlags.isShowFileManager = true;
    }else{
      if (perm.includes('114')) {
        this.jsonFlags.isShowFileManager = true;
      }
    }
  }

}
