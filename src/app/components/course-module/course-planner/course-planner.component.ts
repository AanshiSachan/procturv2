import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {Pipe, PipeTransform} from '@angular/core'

@Component({
  selector: 'app-course-planner',
  templateUrl: './course-planner.component.html',
  styleUrls: ['./course-planner.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CoursePlannerComponent implements OnInit {

  isRippleLoad: boolean = false;
  isProfessional: boolean = false;
  activeModule: boolean = true;   //  true for class   // false for exam

  constructor(
    private auth: AuthenticatorService,
    private appC: AppComponent,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.checkForSessionStorage();
  }

  checkForSessionStorage(){  // while returning to course planner if it is from exam or class
    let isClass = sessionStorage.getItem('isClass');
    if(isClass != null && isClass != ""){
      isClass = JSON.parse(isClass);
        if(isClass){
          this.showMenuOf('class');
        }
        else{
          this.showMenuOf('exam');
        }
    }
    sessionStorage.setItem('isClass', "");
  }

  showMenuOf(activeModuleName){
    if(activeModuleName == 'class'){
      this.activeModule = true;
    }
    else if(activeModuleName == 'exam'){
      this.activeModule = false;
    }
  }




}
