import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-data-setup-home',
  templateUrl: './data-setup-home.component.html',
  styleUrls: ['./data-setup-home.component.scss']
})
export class DataSetupHomeComponent implements OnInit {
  type: string = '';
  
  constructor(   private auth: AuthenticatorService) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.type = 'batch';
        } else {
          this.type = 'course';
        }
      }
    )
  }

}
