import { Component, OnInit, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { AppComponent } from '../../app.component';
import { FetchprefilldataService } from '../../services/fetchprefilldata.service';
import { Router } from '@angular/router';
import { CommonServiceFactory } from '../../services/common-service';

@Component({
  selector: 'app-global-search-popup',
  templateUrl: './global-search-popup.component.html',
  styleUrls: ['./global-search-popup.component.scss']
})
export class GlobalSearchPopupComponent implements OnInit, OnChanges {

  globalSearchForm: any = {
    name: '',
    phone: '',
    instituteId: sessionStorage.getItem('institute_id'),
    start_index: '-1', batch_size: '-1'
  };
  searchResult: any[] = [];
  enquiryResult: any[] = [];
  studentResult: any[] = [];
  hasEnquiry: boolean = false;
  hasStudent: boolean = false;

  @Input() eventData: any = "";
  @Output() closeViewMorePopUp = new EventEmitter<any>(null);
  @Output() enquiryUpdateAction = new EventEmitter<any>(null);

  constructor(
    private appC: AppComponent,
    private fetchService: FetchprefilldataService,
    private router: Router,
    private commonService: CommonServiceFactory
  ) {
    this.checkAccessControl();
  }

  ngOnInit() {
  }

  checkAccessControl() {
    if (this.commonService.checkUserHadPermission('115') || this.commonService.checkUserHadPermission('110')) {
      this.hasEnquiry = true;
    }

    if (this.commonService.checkUserHadPermission('301') || this.commonService.checkUserHadPermission('303')) {
      this.hasStudent = true;
    }
  }

  ngOnChanges() {
    this.eventData;
    if (this.eventData != null && this.eventData != "") {
      this.fetchGlobalSearchDetails(this.eventData.input);
    }
  }

  fetchGlobalSearchDetails(value) {
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
              this.messageNotifier("info", "No Records Found", "Please try with a different keyword");
            }
          },
          err => {
            this.messageNotifier('error', 'Error', err.error.message);
          }
        )
      }
      else {

      }
    }
  }

  public studentSelected(s) {
    this.closeSearchArea();
    this.router.navigate(['/view/student'], { queryParams: { id: s.id } });
  }

  public performAction(a: string, data) {

    let d = data.id
    switch (a) {
      case 'studentEdit': {
        this.closeSearchArea();
        this.router.navigate(['/view/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentFee': {
        this.closeSearchArea();
        this.router.navigate(['/view/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentInventory': {
        this.closeSearchArea();
        this.router.navigate(['/view/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentLeave': {
        this.closeSearchArea();
        this.router.navigate(['/view/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'studentDelete': {
        this.closeSearchArea();
        this.router.navigate(['/view/student'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'enquiryEdit': {
        this.closeSearchArea();
        this.router.navigate(['/view/enquiry'], { queryParams: { id: d, action: a } });
        break;
      }
      case 'enquiryUpdate': {
        this.closeSearchArea();
        let obj = {
          action: a,
          data: data
        }
        this.enquiryUpdateAction.emit(obj);
        break;
      }

    }
  }

  public enquirySelected(e) {
    this.closeSearchArea();
    this.router.navigate(['/view/enquiry'], { queryParams: { id: e.id } });
  }

  closeSearchArea() {
    this.closeViewMorePopUp.emit(true);
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

  messageNotifier(type, title, message) {
    let obj = {
      type: type,
      title: title,
      body: message
    };
    this.appC.popToast(obj);
  }

}
