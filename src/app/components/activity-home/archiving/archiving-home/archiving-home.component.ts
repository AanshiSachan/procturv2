import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-archiving-home',
  templateUrl: './archiving-home.component.html',
  styleUrls: ['./archiving-home.component.scss']
})
export class ArchivingHomeComponent implements OnInit {

  isProfessional: boolean;

  constructor(private auth: AuthenticatorService) {
    
  }

  ngOnInit() {
    
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

  }

}
