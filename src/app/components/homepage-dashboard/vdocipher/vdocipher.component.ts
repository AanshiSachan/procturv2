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
  // public storageData: any = {  };
  @Input() storageData: any = {
    vDOCipher_allocated_bandwidth: 0,
    vDOCipher_allocated_storage: 0,
    vDOCipher_used_storage: 0,
    vDOCipher_used_bandwidth: 0
  }




  constructor(
    private router: Router,
    private fb: FormBuilder,
    private widgetService: WidgetService,
    private cd: ChangeDetectorRef
  ) {


  }

  ngOnInit() {
    // this.getStorageData();
    console.log('storageData', this.storageData);
    this.storageData.vDOCipher_allocated_bandwidth = (Number(this.storageData.vDOCipher_allocated_bandwidth) / 1024).toFixed(3);
    this.storageData.vDOCipher_used_bandwidth = (Number(this.storageData.vDOCipher_used_bandwidth) / 1024).toFixed(3);
    this.storageData.vDOCipher_allocated_storage = (Number(this.storageData.vDOCipher_allocated_storage) / 1024).toFixed(3);
    this.storageData.vDOCipher_used_storage = (Number(this.storageData.vDOCipher_used_storage) / 1024).toFixed(3);
  }


  getStorageData() {
    this.widgetService.getAllocatedStorageDetails().subscribe(
      res => {
        this.cd.markForCheck();
        this.storageData = res;
        console.log('res', res);
        this.storageData.vDOCipher_allocated_bandwidth = (Number(res.vDOCipher_allocated_bandwidth) / 1024).toFixed(3);
        this.storageData.vDOCipher_allocated_storage = (Number(res.vDOCipher_allocated_storage) / 1024).toFixed(3);
      },
      err => {
        //console.log(err);
      }
    )
  }
}
