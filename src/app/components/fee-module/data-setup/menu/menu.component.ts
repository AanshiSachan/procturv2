import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  moduleState :any;

  constructor(private auth: AuthenticatorService) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') { ///batch 
          this.moduleState = 'Batch';
        } else { ///course
          this.moduleState = 'Course';
        }
      }
    )
  }

}
