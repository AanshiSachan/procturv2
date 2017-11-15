import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/Router'
import {trigger, animate, style, group, animateChild, query, stagger, transition} from '@angular/animations';
import {ToasterModule, Toast, ToasterService, ToasterConfig} from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  /* animations: [ routerTransition ], */
})
export class AppComponent {

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
  public config : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    limit: 1,
    timeout: 5000,
    mouseoverTimerStop: true,
  });
  constructor(toasterService: ToasterService) {
    this.toasterService = toasterService;
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

