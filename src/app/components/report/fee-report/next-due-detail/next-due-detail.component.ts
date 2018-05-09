import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';

import { GetFeeService } from '../../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../../services/report-services/fee-services/postFee.service';

import * as moment from 'moment';

@Component({
  selector: 'next-due-detail',
  templateUrl: './next-due-detail.component.html',
  styleUrls: ['./next-due-detail.component.scss']
})
export class NextDueDetailComponent implements OnChanges {

  @Input() feeData: any;
  @Output() closeButton = new EventEmitter<any>()

  constructor() { }

  ngOnChanges() {
    this.feeData;
    this.updateData();
  }


  updateData() {
    console.log(this.feeData);
  }

  closePopups(){
    this.closeButton.emit(null);
  }

}



