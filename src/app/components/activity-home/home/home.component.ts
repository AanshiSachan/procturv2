import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
  AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
  SimpleChanges, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { MenuItem } from 'primeng/primeng';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isProfessional: boolean = false;
  isAdmin: boolean = false;

  isFeeActivity: boolean = false;
  isMonitorDashboard: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private appC: AppComponent, private login: LoginService, private rd: Renderer2, private cd: ChangeDetectorRef, private auth: AuthenticatorService) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.checkUserAccess();
  }

  checkUserAccess() {

    const permissionArray = sessionStorage.getItem('permissions');
    const userType = sessionStorage.getItem('userType');
    if (userType == '3') {
      this.isAdmin = false;
    }
    else if (userType == '0') {
      if (permissionArray == "" || permissionArray == null) {
        this.isAdmin = true;
        this.isFeeActivity = true;
      }
      else {
        let perm: any[] = JSON.parse(permissionArray);

        if (perm.indexOf('102') != -1) {
          this.isFeeActivity = true;
        }

      }
    }

  }

}
