import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {Pipe, PipeTransform} from '@angular/core'

@Component({
  selector: 'app-course-planner',
  templateUrl: './course-planner.component.html',
  styleUrls: ['./course-planner.component.scss']
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
  }

  showMenuOf(activeModuleName){
    if(this.activeModule){
      this.activeModule = false;
    }
    else{
      this.activeModule = true;
    }
  }




}
