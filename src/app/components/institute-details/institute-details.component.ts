import { Component, OnInit } from '@angular/core';
import { InstituteDetailService } from '../../services/institute-details/institute-details.service';
import { AppComponent } from '../../app.component';
import { LoginService } from '../../services/login-services/login.service';

@Component({
  selector: 'app-institute-details',
  templateUrl: './institute-details.component.html',
  styleUrls: ['./institute-details.component.scss']
})
export class InstituteDetailsComponent implements OnInit {

  constructor(
    private apiService: InstituteDetailService,
    private appC: AppComponent,
    private login: LoginService,) { }
    instituteDetailsAll:any;
    instituteLogoDetails:any = [];
    kycType:any = [];
    instituteOptions:any = [];
    planDetail:any = [];



  ngOnInit() {
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.changeView('liGeneral', 'divGeneral');
    this.updatePrefillData();
  }

  updatePrefillData(): any {
    this.apiService.getInstituDetailsAll().subscribe(res => { this.instituteDetailsAll = res; } );
    this.apiService.getInstituteLogoDetailsFromServer().subscribe(res => { this.instituteLogoDetails = res; });
    this.apiService.getKycTypeDetails().subscribe(res => { this.kycType = res; });
    this.apiService.getOptionDetails().subscribe(res => { this.instituteOptions = res; });
    this.apiService.getPlanDetails().subscribe(res => { this.planDetail = res; });
  }

  messageToast(errorType, errorTitle, errorMeassage) {
    let data = {
      type: errorType,
      title: errorTitle,
      body: errorMeassage
    }
    this.appC.popToast(data);
  }

  removeFullscreen() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
  }

  removeSelectionFromSideNav() {
    document.getElementById('lione').classList.remove('active');
    document.getElementById('litwo').classList.remove('active');
    document.getElementById('lithree').classList.remove('active');
    document.getElementById('lifour').classList.remove('active');
    document.getElementById('lifive').classList.remove('active');
    document.getElementById('lisix').classList.remove('active');
    document.getElementById('liseven').classList.remove('active');
    document.getElementById('lieight').classList.remove('active');
    document.getElementById('linine').classList.remove('active');
    document.getElementById('liten').classList.remove('active');
    document.getElementById('lieleven').classList.remove('active');
  }

  changeView(lidiv, showView) {
    document.getElementById('divGeneral').classList.add('hideDivClass');
    document.getElementById('divPlanOption').classList.add('hideDivClass');
    document.getElementById('divAccount').classList.add('hideDivClass');
    document.getElementById('divAppDetail').classList.add('hideDivClass');
    document.getElementById('divImages').classList.add('hideDivClass');
    document.getElementById('liGeneral').classList.remove('active');
    document.getElementById('liPlan').classList.remove('active');
    document.getElementById('liAccount').classList.remove('active');
    document.getElementById('liApp').classList.remove('active');
    document.getElementById('liImages').classList.remove('active');
    document.getElementById(lidiv).classList.add('active');
    document.getElementById(showView).classList.remove('hideDivClass');
  }

}
