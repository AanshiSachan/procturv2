import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { ToasterModule, Toast, ToasterService, ToasterConfig } from 'angular2-toaster';
import { LoaderHandlingService } from './services/loading-services/loader-handling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {


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

  public config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    limit: 1,
    timeout: 5000,
    mouseoverTimerStop: true,
  });



  isRippleLoad: boolean = true;


  constructor(toasterService: ToasterService, private router: Router, private load: LoaderHandlingService) {
    this.toasterService = toasterService;
  }



  ngOnInit() {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.isRippleLoad = true;
        console.log("NavigationStart");
      }
      else if(event instanceof NavigationEnd){
        this.isRippleLoad = false;
        console.log("NavigationEnd");
      }
      else if(event instanceof NavigationCancel){
        this.isRippleLoad = false;
        console.log("NavigationCancel");
      }
      else if(event instanceof NavigationError){
        this.isRippleLoad = false;
        console.log("NavigationError");
      }
    });
  }



  popToast(data) {
    var toast: Toast = {
      type: data.type,
      title: data.title,
      body: data.body
    };
    this.toasterService.pop(toast);
  }


  removeFullscreen() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    document.getElementById('login-center-block').classList.add('hide');

    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
  }

}

