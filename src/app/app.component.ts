import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ToasterModule, Toast, ToasterService, ToasterConfig } from '../assets/imported_modules/angular2-toaster/angular2-toaster';
import { LoginService } from './services/login-services/login.service';
import { CommonServiceFactory } from './services/common-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isRippleLoad: boolean = true;

  /* Toaster handlers */
  /* ToasterConfig ==> {
    animation: 'fade', 'flyLeft', 'flyRight', 'slideDown', and 'slideUp'
    limit: number
    tapToDismiss: false
    showCloseButton: true === or else ==== 'warning': true, 'error': false'
    newestOnTop: false
    timeout: 2000
    mouseoverTimerStop: false
  } */

  private toasterService: ToasterService;
  public config: ToasterConfig = new ToasterConfig({ positionClass: 'toast-top-right', limit: 1, timeout: 5000, mouseoverTimerStop: true, });
  isloggedInAdmin: boolean = false;

  /* Variable for Zendesk */
  ticketId = "";
  addReportPopup: boolean = false;
  closechatbot: boolean = true;

  constructor(
    toasterService: ToasterService,
    private router: Router,
    private log: LoginService,
    private commonService: CommonServiceFactory
  ) {
    this.toasterService = toasterService;
  }


  ngOnInit() {
    this.routerEvents();
    this.isloggedInAdmin = this.commonService.checkUserIsAdmin();
  }

  // Router Event Ripple

  routerEvents() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isRippleLoad = true;
        if (sessionStorage.getItem('userid') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
      else if (event instanceof NavigationEnd) {
        this.isRippleLoad = false;
      }
      else if (event instanceof NavigationCancel) {
        this.isRippleLoad = false;
        if (sessionStorage.getItem('userid') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
      else if (event instanceof NavigationError) {
        this.isRippleLoad = false;
        if (sessionStorage.getItem('userid') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
    });
  }

  public popToast(data) {
    var toast: Toast = {
      type: data.type,
      title: data.title,
      body: data.body
    };
    this.toasterService.pop(toast);
  }

  handler(f) {
    let flag: any = f;

    if (flag.hasOwnProperty('ticket')) {
      this.addReportPopup = true;
      this.ticketId = flag.ticket.id;
      this.closechatbot = false;
    }
    else {
      this.closechatbot = false;
    }
  }

  closeReportPopup() {
    this.addReportPopup = false;
  }

}
