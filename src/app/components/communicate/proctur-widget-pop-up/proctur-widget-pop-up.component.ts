import {  Component, OnInit ,ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-proctur-widget-pop-up',
  templateUrl: './proctur-widget-pop-up.component.html',
  styleUrls: ['./proctur-widget-pop-up.component.scss']
})
export class ProcturWidgetPopUpComponent implements OnInit {

  @Input() size: string;
  @ViewChild('popup',{static: false}) popup: ElementRef;
  isProfessional:boolean = false;

  constructor(private router: Router,  private auth: AuthenticatorService) { }

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
