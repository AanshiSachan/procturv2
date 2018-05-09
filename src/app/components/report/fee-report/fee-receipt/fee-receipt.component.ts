import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';

import { GetFeeService } from '../../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../../services/report-services/fee-services/postFee.service';

import * as moment from 'moment';

@Component({
  selector: 'fee-receipt-popup',
  templateUrl: './fee-receipt.component.html',
  styleUrls: ['./fee-receipt.component.scss']
})
export class FeeReceiptComponent {

}

