import { Component, OnInit } from '@angular/core';

import { LoginService } from '../../../../services/login-services/login.service';
import { AppComponent } from '../../../../app.component';

import { GetFeeService } from '../../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../../services/report-services/fee-services/postFee.service';

import * as moment from 'moment';

@Component({
  selector: 'app-view-detail-report',
  templateUrl: './view-detail-report.component.html',
  styleUrls: ['./view-detail-report.component.scss']
})
export class ViewDetailComponent {

}

