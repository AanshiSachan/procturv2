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
import * as Muuri from 'muuri/muuri';

@Component({
  selector: 'admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  isProfessional: boolean = false;
  grid: any;
  order: string[] = ['1', '2', '3', '4'];

  constructor(private router: Router, private fb: FormBuilder, private appC: AppComponent, private login: LoginService, private rd: Renderer2, private cd: ChangeDetectorRef) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.grid = new Muuri('.grid', {
      dragEnabled: true,
      layout: {
        fillGaps: false,
        rounding: true
      },
      layoutOnInit: false,
      sortData: {
        id: (item, element) => {
          // return parseFloat(element.getAttribute('data-id'));
          return this.order.indexOf(element.getAttribute('data-id'));
        }
      }
    });
    this.grid.sort('id');
    this.grid.on('dragEnd', (item, event) => {
      this.getOrder();
    });

  }

  getOrder() {
    this.order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
  }

  getDataId(text: String): number{
    let id: number;

    switch(text){
      case 'enquiry': {
        id = 1;
        break;
      }

      case 'fee': {
        id = 2;
        break;
      }

      case 'general': {
        id = 3;
        break;
      }

      case 'schedule': {
        id = 4;
        break;
      }
    }

    return id;
  }

  

}
