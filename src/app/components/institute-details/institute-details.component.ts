import { Component, OnInit, ViewChild } from '@angular/core';
import { InstituteDetailService } from '../../services/institute-details/institute-details.service';
import { AppComponent } from '../../app.component';
import { LoginService } from '../../services/login-services/login.service';

@Component({
  selector: 'app-institute-details',
  templateUrl: './institute-details.component.html',
  styleUrls: ['./institute-details.component.scss']
})
export class InstituteDetailsComponent implements OnInit {


  instituteDetailsAll: any;
  instituteLogoDetails: any = [];
  kycType: any = [];
  instituteOptions: any = [];
  instituteOptionDataSource: any = [];
  planDetail: any = [];
  planDetailDataSource: any = [];
  @ViewChild('idUploadDoc') uploadDoc;
  instDetails: any = {};

  constructor(
    private apiService: InstituteDetailService,
    private appC: AppComponent,
    private login: LoginService, ) { }

  ngOnInit() {
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.changeView('liGeneral', 'divGeneral');
    this.updatePrefillData();
  }

  updatePrefillData(): any {
    this.getInstituteDetails();
    this.getInstituteLogoDetails();
    this.getInstituteKYCDetails();
    this.getOptionDetailsFromServer();
    this.getPlanDetailsFromServer();
  }


  getInstituteDetails() {
    this.apiService.getInstituDetailsAll().subscribe(
      res => {
        console.log('Isnt', res);
        this.instituteDetailsAll = res;
        this.instDetails = Object.assign({}, res);
      },
      this.errorCallBack
    );
  }

  getInstituteLogoDetails() {
    this.apiService.getInstituteLogoDetailsFromServer().subscribe(
      res => {
        console.log('IsntLog', res);
        this.instituteLogoDetails = res;
      }, this.errorCallBack
    )

  }

  getInstituteKYCDetails() {
    this.apiService.getKycTypeDetails().subscribe(
      res => {
        this.kycType = res;
      }, this.errorCallBack
    );
  }

  getOptionDetailsFromServer() {
    this.apiService.getOptionDetails().subscribe(
      res => {
        this.instituteOptionDataSource = res;
        console.log('instoption', this.instituteOptions);
      }, this.errorCallBack
    );
  }

  getPlanDetailsFromServer() {
    this.apiService.getPlanDetails().subscribe(
      res => {
        this.planDetailDataSource = res;
        console.log('plan', this.instituteOptions);
      }, this.errorCallBack
    );
  }


  updateAllDetails() {
    debugger
    let dataToSend = this.formatDataJsonToSend();
    this.apiService.updateDetailsToServer(dataToSend).subscribe(
      res => {
        console.log('updated successfully', res);
        this.messageToast('success', 'Updated Successfully', 'Deatils Updated Successfully');
      },
      this.errorCallBack
    )
  }


  getPaymentDeatils() {
    this.apiService.getPayementInfoFromServer().subscribe(
      res => {
        console.log('payment', res);
      },
      this.errorCallBack
    )
  }


  smsAllocationHistoryDeatils() {
    this.apiService.getSmsInfoFromServer().subscribe(
      res => {
        console.log('sms', res);
      },
      this.errorCallBack
    )
  }


  downLoadLimitAllocationHistory() {
    this.apiService.getDownloadLimitFromServer().subscribe(
      res => {
        console.log('limit', res);
      },
      this.errorCallBack
    )
  }

  formatDataJsonToSend() {
    let obj: any = {};

    obj.institute_logo = '';
    obj.institute_header1 = '';
    obj.institute_header2 = '';
    obj.institute_header3 = '';
    obj.institute_footer = '';
    obj.fb_page_url = this.instDetails.fb_page_url;
    obj.website_url = this.instDetails.website_url;
    obj.institute_short_code = this.instDetails.institute_short_code;
    obj.tag_line = this.instDetails.tag_line;
    obj.about_us_text = this.instDetails.about_us_text;
    obj.institute_testprep_logo = '';
    obj.announcement = this.instDetails.announcement;
    obj.owner_name = this.instDetails.owner_name;
    obj.owner_primary_email = this.instDetails.owner_primary_email;
    obj.owner_secondary_email = this.instDetails.owner_secondary_email;
    obj.owner_primary_phone = this.instDetails.owner_primary_phone;
    obj.admin_name = this.instDetails.admin_name;
    // obj.admin_primary_phone = this.instDetails.admin_name; /// Missing
    // obj.admin_primary_email = '';
    obj.student_id_prefix = this.instDetails.student_id_prefix;
    // obj.student_id_type = this.instDetails.student_id_prefix;
    obj.gst_in = this.instDetails.gst_in;
    obj.kyc_document_name = '';
    obj.kyc_document = '';
    obj.student_app_url = this.instDetails.student_app_url;
    obj.kyc_document_type = '';

    return obj;
  }

  getPlanOfInstitute(data) {
    let obj = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].plan_id == this.instDetails.plan_id) {
        obj.push(data[i]);
      }
    }
    return obj;
  }

  bindTableData() {
    this.instituteOptions = this.getPlanOfInstitute(this.instituteOptionDataSource);
    this.planDetail = this.getPlanOfInstitute(this.planDetailDataSource);
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
    document.getElementById('lizero').classList.remove('active');
    document.getElementById('lione').classList.remove('active');
    document.getElementById('litwo').classList.remove('active');
    document.getElementById('lithree').classList.remove('active');
    document.getElementById('lifour').classList.remove('active');
    document.getElementById('lifive').classList.remove('active');
    document.getElementById('lisix').classList.remove('active');
    document.getElementById('liseven').classList.remove('active');
    document.getElementById('lieight').classList.remove('active');
    document.getElementById('linine').classList.remove('active');
    //document.getElementById('liten').classList.remove('active');
    //document.getElementById('lieleven').classList.remove('active');
  }

  changeView(lidiv, showView) {
    document.getElementById('divGeneral').classList.add('hideDivClass');
    document.getElementById('divPlanOption').classList.add('hideDivClass');
    document.getElementById('divAccount').classList.add('hideDivClass');
    document.getElementById('divAppDetail').classList.add('hideDivClass');
    // document.getElementById('divImages').classList.add('hideDivClass');
    document.getElementById('liGeneral').classList.remove('active');
    document.getElementById('liPlan').classList.remove('active');
    document.getElementById('liAccount').classList.remove('active');
    document.getElementById('liApp').classList.remove('active');
    // document.getElementById('liImages').classList.remove('active');
    document.getElementById(lidiv).classList.add('active');
    document.getElementById(showView).classList.remove('hideDivClass');
    if (showView == "divPlanOption") {
      this.bindTableData();
    }
  }


  uploadDocument() {
    this.uploadDoc.nativeElement.click();
  }

  errorCallBack(err) {
    console.log(err);
    this.messageToast('error', 'Error', err.error.messageToast);
  }

}
