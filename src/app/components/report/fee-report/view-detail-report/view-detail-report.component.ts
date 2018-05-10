import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';

import { GetFeeService } from '../../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../../services/report-services/fee-services/postFee.service';

import * as moment from 'moment';

@Component({
  selector: 'view-detail-report',
  templateUrl: './view-detail-report.component.html',
  styleUrls: ['./view-detail-report.component.scss']
})
export class ViewDetailComponent implements OnChanges {

  @Input() feeData: any;
  @Output() closeButton = new EventEmitter<any>()

  constructor(private getter: GetFeeService, private putter: PostFeeService) { }

  ngOnChanges() {
    this.feeData;
    this.updateData();
  }


  updateData() {
    console.log(this.feeData);
  }

  closePopups() {
    this.closeButton.emit(null);
  }


}


