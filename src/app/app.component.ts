import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { ToasterModule, Toast, ToasterService, ToasterConfig } from '../assets/imported_modules/angular2-toaster/angular2-toaster';
import { LoaderHandlingService } from './services/loading-services/loader-handling.service';
import { LoginService } from './services/login-services/login.service';
import { AuthenticatorService } from './services/authenticator.service';
import { FetchprefilldataService } from './services/fetchprefilldata.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  isloggedInAdmin: boolean;
  isSearchMore: boolean;
  @ViewChild('footer') footer: ElementRef;
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
  isMenuVisible: boolean = false;

  public config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right',
    limit: 1,
    timeout: 5000,
    mouseoverTimerStop: true,
  });

  helpLoader: boolean = false;
  enquiryResult: any[] = [];
  studentResult: any[] = [];
  searchResult: any[] = [];

  globalSearchForm: any = {
    name: '',
    phone: '',
    instituteId: sessionStorage.getItem('institute_id'),
    start_index: '-1',
    batch_size: '-1'
  }

  isRippleLoad: boolean = true;


  constructor(toasterService: ToasterService, private router: Router, private load: LoaderHandlingService, private log: LoginService, private fetchService: FetchprefilldataService, private titleService: Title, private auth: AuthenticatorService) {
    this.toasterService = toasterService;
  }



  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isRippleLoad = true;
        this.closeSearchArea();
        if (sessionStorage.getItem('Authorization') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
      else if (event instanceof NavigationEnd) {
        this.closeSearchArea();
        this.isRippleLoad = false;
      }
      else if (event instanceof NavigationCancel) {
        this.isRippleLoad = false;
        this.closeSearchArea();
        if (sessionStorage.getItem('Authorization') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
      else if (event instanceof NavigationError) {
        this.isRippleLoad = false;
        this.closeSearchArea();
        if (sessionStorage.getItem('Authorization') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
    });


    this.log.currentMenuState.subscribe(el => {
      this.isMenuVisible = el;
    })

    this.auth.currentInstituteId.subscribe(e => {
      if (e == null || e == undefined || e == '') {
        this.isloggedInAdmin = false;
      }
      else {
        let p = sessionStorage.getItem('permissions');
        let user = sessionStorage.getItem('userType')

        if(user == "0"){
          if (p == null || p == undefined || p == ''){
            this.isloggedInAdmin = true;
          }
          else{
            this.isloggedInAdmin = false
          }
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


  public removeFullscreen() {
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

  public searchViewMore(e) {
    if (e != null) {
      this.isSearchMore = true;
      this.filterGlobal(e.input);
    }
    else {
      this.closeSearchArea();
      this.searchResult = [];
      this.enquiryResult = [];
      this.studentResult = [];
    }
  }

  public closeSearchArea() {
    this.isSearchMore = false;
  }

  public filterGlobal(value) {
    if (value != null && value != undefined) {
      if (value.trim() != '' && value.length >= 4) {
        let obj = this.getSearchObject(value);

        /* Loading Shows */
        this.fetchService.globalSearch(obj).subscribe(
          res => {
            if (res.length != 0) {
              this.searchResult = res;
              this.enquiryResult = res.filter(e => e.source == "Enquiry");
              this.studentResult = res.filter(s => s.source == "Student");
            }
            else {
              let obj = {
                type: "info",
                title: "No Records Found",
                body: "Please try with a different keyword"
              }
              this.popToast(obj);
            }
          },
          err => {
          }
        )
      }
      else {

      }
    }

  }

  public getSearchObject(e): any {
    let obj = this.globalSearchForm;
    /* Name detected */
    if (isNaN(e)) {
      this.globalSearchForm.name = e;
      this.globalSearchForm.phone = '';
      return this.globalSearchForm;
    }
    /* Nmber detected */
    else {
      this.globalSearchForm.phone = e;
      this.globalSearchForm.name = '';
      return this.globalSearchForm;
    }
  }

  public studentSelected(s) {
    this.closeSearchArea();
    this.router.navigate(['/student'], { queryParams: { id: s.id } });
  }

  public enquirySelected(e) {
    this.closeSearchArea();
    this.router.navigate(['/enquiry'], { queryParams: { id: e.id } });
  }

  public performAction(a: string, data) {

    let d = data.id
    switch (a) {
      case 'studentEdit': {
        this.closeSearchArea();
        this.router.navigate(['/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentFee': {
        this.closeSearchArea();
        this.router.navigate(['/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentInventory': {
        this.closeSearchArea();
        this.router.navigate(['/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentLeave': {
        this.closeSearchArea();
        this.router.navigate(['/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentDelete': {
        this.closeSearchArea();
        this.router.navigate(['/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'enquiryEdit': {
        this.closeSearchArea();
        this.router.navigate(['/enquiry'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'enquiryUpdate': {
        this.closeSearchArea();
        this.router.navigate(['/enquiry'], { queryParams: { id: d, action: a } });
        break;
      }

    }
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  informFooter() {
    this.footer.nativeElement.classList.remove('hide');
  }

}
