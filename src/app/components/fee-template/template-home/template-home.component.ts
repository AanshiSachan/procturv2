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
import { LoginService } from '../../../services/login-services/login.service';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { ColumnSetting } from '../../shared/custom-table/layout.model';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { FeeStrucService } from '../../../services/feeStruc.service';
import 'rxjs/Rx';

@Component({
  selector: 'app-template-home',
  templateUrl: './template-home.component.html',
  styleUrls: ['./template-home.component.scss']
})
export class TemplateHomeComponent implements OnInit {

  isProfessional: boolean = false;
  source: any[] = [];
  selectedTemplate:any;
  isHeaderEdit:boolean = false;
  isEditFee:boolean = false;


  constructor(private router: Router, private appC: AppComponent, private login: LoginService, private fetchService: FeeStrucService) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.fetchPrefill();
  }


  fetchPrefill() {
    this.getFeeStructures();
  }


  getFeeStructures() {
    this.fetchService.fetchFeeStruc().subscribe(
      res => {
        this.source = res;        
      },
      err => {

      }
    )
  }

  editFee(fee){
    console.log(fee);
    this.selectedTemplate = fee;
    this.isEditFee = true;
  }

  closeFeeEditor(){
    this.isEditFee = false;
  }

  updateFeeTemplate(){
    
  }

}



