import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-fee-report-home',
  templateUrl: './fee-report-home.component.html',
  styleUrls: ['./fee-report-home.component.scss']
})
export class FeeReportHomeComponent implements OnInit {

  isProfessional: boolean = false;
  enable_online_payment_feature: number;


  constructor(private auth: AuthenticatorService) { }

  ngOnInit() {
    
    this.auth.institute_type.subscribe(
      res => {
        if (res == "Lang") {
          this.isProfessional = true;
        }
        else {
          this.isProfessional = false;
        }
      }
    )
    
  }

}
