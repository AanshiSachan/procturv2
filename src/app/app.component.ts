import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { ToasterModule, Toast, ToasterService, ToasterConfig } from '../assets/imported_modules/angular2-toaster/angular2-toaster';
import { LoaderHandlingService } from './services/loading-services/loader-handling.service';
import { LoginService } from './services/login-services/login.service';
import { FetchprefilldataService } from './services/fetchprefilldata.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {


  isSearchMore: boolean;
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


  constructor(toasterService: ToasterService, private router: Router,
    private load: LoaderHandlingService, private log: LoginService, private fetchService: FetchprefilldataService) {
    this.toasterService = toasterService;
  }



  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isRippleLoad = true;
        if (sessionStorage.getItem('Authorization') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
      else if (event instanceof NavigationEnd) {
        this.isRippleLoad = false;
      }
      else if (event instanceof NavigationCancel) {
        this.isRippleLoad = false;
        if (sessionStorage.getItem('Authorization') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
      else if (event instanceof NavigationError) {
        this.isRippleLoad = false;
        if (sessionStorage.getItem('Authorization') != null) {
          this.log.changeSidenavStatus('authorized');
        }
      }
    });

    this.log.currentMenuState.subscribe(el => {
      this.isMenuVisible = el;
    })
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

  searchViewMore(e) {
    if(e != null){
      this.isSearchMore = true;
      this.filterGlobal(e.input);
    }
    else{
      this.closeSearchArea();
      this.searchResult = [];
      this.enquiryResult = [];
      this.studentResult = [];
    }
  }

  closeSearchArea() {
    this.isSearchMore = false;
  }

  filterGlobal(value) {
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

  getSearchObject(e): any {
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

  studentSelected(s) {
    this.closeSearchArea();
    this.router.navigate(['/student'], { queryParams: { id: s.id } });
  }

  enquirySelected(e) {
    this.closeSearchArea();
    this.router.navigate(['/enquiry'], { queryParams: { id: e.id } });
  }

}

