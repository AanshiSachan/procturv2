import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as moment from 'moment';

@Component({
  selector: 'app-campaign-reports-home',
  templateUrl: './campaign-reports-home.component.html',
  styleUrls: ['./campaign-reports-home.component.scss']
})
export class CampaignReportsHomeComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    isRippleLoad: false,
  };

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private auth: AuthenticatorService,
  ) { }

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
  }

}
