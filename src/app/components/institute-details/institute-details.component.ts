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
  showAllocationPopup: boolean = false;
  openPopUpName: any = '';
  smsAllocation: any = [];
  paymentTable: any = [];
  limitTable: any = [];
  storageInfo: any = {};

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
    this.getStorageInformation();
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
        this.paymentTable = res;
        this.showAllocationPopup = true;
        this.openPopUpName = "PaymentHistory";
      },
      this.errorCallBack
    )
  }


  smsAllocationHistoryDeatils() {
    this.apiService.getSmsInfoFromServer().subscribe(
      res => {
        console.log('sms', res);
        this.smsAllocation = res;
        this.showAllocationPopup = true;
        this.openPopUpName = "SMSHistory";
      },
      this.errorCallBack
    )
  }


  downLoadLimitAllocationHistory() {
    this.apiService.getDownloadLimitFromServer().subscribe(
      res => {
        console.log('limit', res);
        this.limitTable = res;
        this.showAllocationPopup = true;
        this.openPopUpName = "DownloadLimit";
      },
      this.errorCallBack
    )
  }

  getStorageInformation() {
    this.apiService.getStorageLimitFromServer().subscribe(
      res => {
        console.log('limit', res);
        this.storageInfo = res;
        this.storageInfo.storage_allocated = this.storageInfo.storage_allocated / 1024;
      },
      this.errorCallBack
    )
  }

  closeDeletePopup() {
    this.showAllocationPopup = false;
    this.openPopUpName = "";
  }

  changeKYCInformation(event) {
    debugger
    for (let i = 0; i < this.kycType.length; i++) {
      if (this.kycType[i].data_key == event) {
        this.instDetails.kyc_document_name = this.kycType[i].kyc_document_name;
        this.instDetails.kyc_document = this.kycType[i].kyc_document;
        this.instDetails.kyc_document_type = this.kycType[i].kyc_document_type;
      } else {
        this.instDetails.kyc_document_name = '';
        this.instDetails.kyc_document = '';
        this.instDetails.kyc_document_type = event;
      }
    }

  }

  formatDataJsonToSend() {
    let obj: any = {};
    obj.institute_logo = this.instDetails.institute_logo;
    obj.institute_header1 = this.instDetails.institute_header1;
    obj.institute_header2 = this.instDetails.institute_header2;
    obj.institute_header3 = this.instDetails.institute_header3;
    obj.institute_footer = this.instDetails.institute_footer;
    obj.fb_page_url = this.instDetails.fb_page_url;
    obj.website_url = this.instDetails.website_url;
    obj.institute_short_code = this.instDetails.institute_short_code;
    obj.tag_line = this.instDetails.tag_line;
    obj.about_us_text = this.instDetails.about_us_text;
    obj.institute_testprep_logo = this.instDetails.institute_testprep_logo;
    obj.announcement = this.instDetails.announcement;
    obj.owner_name = this.instDetails.owner_name;
    obj.owner_primary_email = this.instDetails.owner_primary_email;
    obj.owner_secondary_email = this.instDetails.owner_secondary_email;
    obj.owner_primary_phone = this.instDetails.owner_primary_phone;
    obj.admin_name = this.instDetails.admin_name;
    if (!(this.validatePhoneNumber(this.instDetails.admin_primary_phone))) {
      this.messageToast('error', 'Error', 'Please check contact number');
      return
    }
    if (!(this.validateCaseSensitiveEmail(this.instDetails.admin_primary_email))) {
      this.messageToast('error', 'Error', 'Please check email address');
      return
    }
    obj.admin_primary_phone = this.instDetails.admin_primary_phone;
    obj.admin_primary_email = this.instDetails.admin_primary_email;
    obj.student_id_prefix = this.instDetails.student_id_prefix;
    if (this.instDetails.student_id_type == null || this.instDetails.student_id_type == "") {
      obj.student_id_type = "Automatic";
    } else {                                                //Please check this case
      obj.student_id_type = "Manual";
    }
    if (this.instDetails.gst_in == "" || this.instDetails.gst_in == null) {
      obj.gst_in = '';
    } else {
      obj.gst_in = this.instDetails.gst_in;
    }

    obj.kyc_document_name = this.instDetails.kyc_document_name;
    obj.kyc_document = this.instDetails.kyc_document;
    obj.student_app_url = this.instDetails.student_app_url;
    obj.kyc_document_type = this.instDetails.kyc_document_type;

    return obj;
  }

  getPlanOfInstitute(data) {
    let obj = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == this.instDetails.plan_id) {
        obj.push(data[i]);
      }
    }
    return obj;
  }

  getOptionOfInstitute(data) {
    let obj = [];
    let arr = this.instDetails.option_selected_id.split(',')
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (data[i].id == arr[i]) {
          obj.push(data[i]);
        }
      }
    }
    return obj;
  }


  bindTableData() {
    debugger
    this.instituteOptions = this.getOptionOfInstitute(this.instituteOptionDataSource);
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

  errorCallBack = (err) => {
    console.log(err);
    this.messageToast('error', 'Error', err.error.message);
  }

  validatePhoneNumber(data) {
    let check: boolean = false;
    if (data != "" && data != null) {
      if (!isNaN(data) || data.length != 10) {
        check = false;
      } else {
        check = true;
      }
      return check;
    } else {
      return true;
    }
  }

  validateCaseSensitiveEmail(email) {
    if (email != '' && email != null) {
      var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (reg.test(email)) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return true;
    }
  }


}
