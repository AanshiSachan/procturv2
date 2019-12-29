import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../../services/message-show.service';
import { getSMSService } from '../../../../services/report-services/get-sms.service';

@Component({
  selector: 'app-campaign-lead-sms',
  templateUrl: './campaign-lead-sms.component.html',
  styleUrls: ['./campaign-lead-sms.component.scss']
})
export class CampaignLeadSmsComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    isRippleLoad: false,
  };

  dateFilter = {
    from_date: moment(new Date()).format('YYYY-MM-DD'),
    to_date: ""
  };

  constructor(
    private _msgService: MessageShowService,
    private getSms: getSMSService,
  ) { }

  ngOnInit() {
    this.getSmsReport(this.dateFilter);

  }

  getSmsReport(obj) {
    this.jsonFlag.isRippleLoad = true;
    if (obj.start_index == 0) {
      return this.getSms.fetchSmsReport(obj).subscribe(
        (res: any) => {
          this.jsonFlag.isRippleLoad = false;

        },
        err => {
          this.jsonFlag.isRippleLoad = false;
        }
      )
    }
    else {
      return this.getSms.fetchSmsReport(obj).subscribe(
        (res: any) => {
          this.jsonFlag.isRippleLoad = false;
        }
      )
    }
  }

  fetchSmsByDate() {
    this.getSmsReport(this.dateFilter);
  }

  dateValidationForFuture(e) {
    //console.log(e);
    let today = moment(new Date);
    let selected = moment(e);
    let diff = moment(selected.diff(today))['_i'];
    if (diff <= 0) {

    }
    else {
      this.dateFilter.to_date = moment(new Date).format('YYYY-MM-DD');
      this.dateFilter.from_date = moment(new Date).format('YYYY-MM-DD');
      this._msgService.showErrorMessage(this._msgService.toastTypes.info, '', "Future date is not allowed");
    }
  }

}
