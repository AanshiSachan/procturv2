import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import * as moment from 'moment';

@Component({
  selector: 'app-leads-home',
  templateUrl: './leads-home.component.html',
  styleUrls: ['./leads-home.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadsHomeComponent implements OnInit {

  enquiryDate: any[] = [];

  jsonFlag = {
    isProfessional: false,
    isRippleLoad: false
  };
  enquiryStatus: any[] = [];
  totalEnquiryCount: number;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private auth: AuthenticatorService,
    private enquire: FetchenquiryService,
    private prefill: FetchprefilldataService,
  ) {
    this.enquiryDate[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.enquiryDate[1] = new Date();
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    )
    // this.fetchenquiry();
  }

  fetchenquiry(){
    let obj = {
        updateDateFrom: moment().date(1).format("YYYY-MM-DD"),
        updateDateTo: moment().format("YYYY-MM-DD")
    }
    this.jsonFlag.isRippleLoad = true;
    this.enquire.fetchEnquiryWidgetView(obj).subscribe(
      res => {
        let result: any;
        result = res;
        this.enquiryStatus = result.statusMap;
        this.totalEnquiryCount = result.totalcount;
        console.log(res)
        this.jsonFlag.isRippleLoad = false;
      },
      err => {
        this.jsonFlag.isRippleLoad = false;
      }
    );
  }

  getEnqStartDate() {
      this.cd.markForCheck();
      let date = moment().date(1).format("YYYY-MM-DD");
      return this.enquiryDate[0];
  }

  getEnqEndDate() {
      this.cd.markForCheck();
      return this.enquiryDate[1];
  }

  updateEnqChartByDate(e) {
      this.cd.markForCheck();
      let obj = {
          updateDateFrom: moment(e[0]).format("YYYY-MM-DD"),
          updateDateTo: moment(e[1]).format("YYYY-MM-DD")
      }
      this.jsonFlag.isRippleLoad = true;
      this.enquire.fetchEnquiryWidgetView(obj).subscribe(
          (res: any) => {
            this.jsonFlag.isRippleLoad = false;
              this.cd.markForCheck();
              let result: any;
              result = res;
              this.enquiryStatus = result.statusMap;
              this.totalEnquiryCount = result.totalcount;
          }
      )
  }

  openCalendar(id) {
      document.getElementById(id).click();
  }
}
