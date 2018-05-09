import { Component, OnInit } from '@angular/core';

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
export class NextDueDetailComponent {

}

