import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isProfessional: boolean = false;

  constructor(
    private auth: AuthenticatorService,
    private router: Router
  ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
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
