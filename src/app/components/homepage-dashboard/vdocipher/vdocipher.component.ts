import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
  AfterViewInit, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
  SimpleChanges, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import 'rxjs/Rx';
import { WidgetService } from '../../../services/widget.service';


@Component({
  selector: 'app-vdocipher',
  templateUrl: './vdocipher.component.html',
  styleUrls: ['./vdocipher.component.scss']
})
export class VdocipherComponent implements OnInit {
  @Input() storageData: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private widgetService: WidgetService,
    private cd: ChangeDetectorRef
  ) {


  }

  ngOnInit() {
  }

}