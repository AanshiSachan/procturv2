import {  Component, OnInit ,ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { LoginService } from '../../../services/login-services/login.service';

@Component({
  selector: 'proctur-widget',
  templateUrl: './proctur-widget.component.html',
  styleUrls: ['./proctur-widget.component.scss']
})
export class ProcturWidgetComponent implements OnInit {

  @Input() size: string;
  @ViewChild('popup') popup: ElementRef;
  isProfessional:boolean = false;

  constructor(private router: Router, private login: LoginService, private auth: AuthenticatorService) {
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

    this.size = this.size || '80%';
    this.popup.nativeElement.style.maxWidth = this.size;
  }

}
