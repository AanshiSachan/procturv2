import {
  Component, OnInit, ViewChild, Input, Output,
  EventEmitter, HostListener, AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn, NgForm } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from '../../../../assets/imported_modules/multiselect-dropdown';
import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { instituteInfo } from '../../../model/instituteinfo';


@Component({
  selector: 'app-home',
  templateUrl: './inventory-home.component.html',
  styleUrls: ['./inventory-home.component.scss']
})
export class HomeComponent implements OnInit {

  sourceInventory: any[] = [];

  header: any = {
    list_name:{ id: 'inventory_item', title: 'Inventory Item', filter: false, show: true },
    referred_by: { id: 'category', title: 'Category', filter: false, show: true },
    source: { id: 'master_course', title: 'Master Course', filter: false, show: true },
    created_date: { id: 'course', title: 'Course', filter: false, show: true },
    status: { id: 'total_units', title: 'Total Units', filter: false, show: true },
    total_count: { id: 'available', title: 'Available Units', filter: false, show: true },
    success_count: { id: 'edit', title: 'Edit', filter: false, show: true },
    failure_count: { id: 'add_units', title: 'Add Units', filter: false, show: true },
    allow_sms: { id: 'delete', title: 'Delete', filter: false, show: true },

  };

  constructor() { }

  ngOnInit() {
  }

}
