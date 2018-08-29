import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login-services/login.service';
import { AuthenticatorService } from '../services/authenticator.service';
import { CommonServiceFactory } from '../services/common-service';
import { Title } from '../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html'
})
export class ComponentsComponent implements OnInit {

  isMenuVisible: boolean = false;
  isloggedInAdmin: boolean = false;
  changePasswordComp: boolean = false;
  institute_id: number = 0;
  enquiryUpdateComp: boolean = false;
  enquiryInfo: any = "";
  isSearchMoreComp: boolean = false;
  searchMoreData: any = "";

  constructor(
    private log: LoginService,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory,
    private title: Title
  ) { }

  ngOnInit() {

    this.log.currentMenuState.subscribe(el => {
      this.isMenuVisible = el;
    })

    this.isloggedInAdmin = this.commonService.checkUserIsAdmin();

    this.auth.currentInstituteId.subscribe(id => {
      if (id != null && id != "") {
        this.institute_id = id;
      }
    });

    this.checkTitleAndFavIcon();
  }

  // Change Password Pop up Section///

  changePasswordPopUp() {
    this.changePasswordComp = true;
  }

  closeChangePasswordPopup(event) {
    this.changePasswordComp = false;
  }

  /// Enquiry Update Pop Up Section////

  // Show Enquiry Update Pop Up
  updateEnquiryPopUp(event) {
    this.enquiryUpdateComp = true;
    this.enquiryInfo = event.data.id;
  }

  // Close Enquiry Pop Up
  closeEnquiryPopUp(event) {
    if (event == true) {
      this.enquiryUpdateComp = false;
    }
    this.enquiryInfo = null;
  }

  // Global Search Pop Up

  // Show All Search Data Pop UP
  searchViewMore(e) {
    if (e != null) {
      this.isSearchMoreComp = true;
      this.searchMoreData = e;
    } else {
      this.isSearchMoreComp = false;
    }
  }

  // Close ALl data pop up
  closeViewMorePopUp(event) {
    if (event == true) {
      this.isSearchMoreComp = false;
    }
    this.searchMoreData = null;
  }

  // Change Title once user refresh
  checkTitleAndFavIcon() {
    let title = sessionStorage.getItem('institute_title_web');
    if (title != undefined && title != "" && title != null) {
      this.title.setTitle(title);
    }
  }

}
