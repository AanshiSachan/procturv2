import { Component, OnInit, ViewChild } from '@angular/core';
import { InstituteDetailService } from '../../services/institute-details/institute-details.service';
import { CommonServiceFactory } from '../../services/common-service';

@Component({
  selector: 'app-institute-details',
  templateUrl: './institute-details.component.html',
  styleUrls: ['./institute-details.component.scss']
})
export class InstituteDetailsComponent implements OnInit {

  isRippleLoad: boolean = false;
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
  showPrefix: boolean = false;

  constructor(
    private apiService: InstituteDetailService,
    private commonService: CommonServiceFactory
  ) { }

  ngOnInit() {
    this.commonService.removeSelectionFromSideNav();
    this.changeView('liGeneral', 'divGeneral');
    this.updatePrefillData();
  }

  updatePrefillData(): any {
    this.getInstituteDetails();
    // this.getInstituteLogoDetails();
    this.getInstituteKYCDetails();
    this.getOptionDetailsFromServer();
    this.getPlanDetailsFromServer();
    this.getStorageInformation();
  }


  getInstituteDetails() {
    this.apiService.getInstituDetailsAll().subscribe(
      res => {
        this.isRippleLoad = false;
        this.instituteDetailsAll = res;
        this.instDetails = Object.assign({}, res);
        if (this.instDetails.is_student_displayId_manual == 0) {
          this.showPrefix = true;
        }
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    );
  }

  // getInstituteLogoDetails() {
  //   this.apiService.getInstituteLogoDetailsFromServer().subscribe(
  //     res => {
  //       this.instituteLogoDetails = res;
  //     }, this.errorCallBack
  //   )

  // }

  getInstituteKYCDetails() {
    this.apiService.getKycTypeDetails().subscribe(
      res => {
        this.isRippleLoad = false;
        this.kycType = res;
      },
      err => {
        this.isRippleLoad = false;
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    );
  }

  getOptionDetailsFromServer() {
    this.apiService.getOptionDetails().subscribe(
      res => {
        this.isRippleLoad = false;
        this.instituteOptionDataSource = res;
      },
      err => {
        this.isRippleLoad = false;
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    );
  }

  getPlanDetailsFromServer() {
    this.apiService.getPlanDetails().subscribe(
      res => {
        this.isRippleLoad = false;
        this.planDetailDataSource = res;
      },
      err => {
        this.isRippleLoad = false;
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    );
  }


  updateAllDetails() {
    this.isRippleLoad = true;
    let dataToSend = this.formatDataJsonToSend();
    this.apiService.updateDetailsToServer(dataToSend).subscribe(
      res => {
        this.isRippleLoad = false;
        this.commonService.showErrorMessage('success', 'Updated Successfully', 'Details Updated Successfully');
      },
      err => {
        this.isRippleLoad = false;
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    )
  }


  getPaymentDeatils() {
    this.paymentTable = [];
    this.isRippleLoad = true;
    this.apiService.getPayementInfoFromServer().subscribe(
      res => {
        this.isRippleLoad = false;
        this.paymentTable = res;
        this.showAllocationPopup = true;
        this.openPopUpName = "PaymentHistory";
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    )
  }


  smsAllocationHistoryDeatils() {
    this.smsAllocation = [];
    this.isRippleLoad = true;
    this.apiService.getSmsInfoFromServer().subscribe(
      res => {
        this.isRippleLoad = false;
        this.smsAllocation = res;
        this.showAllocationPopup = true;
        this.openPopUpName = "SMSHistory";
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    )
  }


  downLoadLimitAllocationHistory() {
    this.limitTable = [];
    this.isRippleLoad = true;
    this.apiService.getDownloadLimitFromServer().subscribe(
      res => {
        this.isRippleLoad = false;
        this.limitTable = res;
        this.showAllocationPopup = true;
        this.openPopUpName = "DownloadLimit";
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    )
  }

  getStorageInformation() {
    this.apiService.getStorageLimitFromServer().subscribe(
      res => {
        this.storageInfo = res;
        this.storageInfo.storage_allocated = this.storageInfo.storage_allocated;
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    )
  }

  closeDeletePopup() {
    this.showAllocationPopup = false;
    this.openPopUpName = "";
  }

  changeKYCInformation(event) {
    for (let i = 0; i < this.kycType.length; i++) {
      if (this.kycType[i].data_key == event) {
        this.instDetails.kyc_document_name = this.kycType[i].kyc_document_name;
        this.instDetails.kyc_document = this.kycType[i].kyc_document;
        this.instDetails.kyc_document_type = this.kycType[i].kyc_document_type.toString();
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
      this.commonService.showErrorMessage('error', 'Error', 'Please check contact number');
      return
    }
    if (!(this.validateCaseSensitiveEmail(this.instDetails.admin_primary_email))) {
      this.commonService.showErrorMessage('error', 'Error', 'Please check email address');
      return
    }
    obj.admin_primary_phone = this.instDetails.admin_primary_phone;
    obj.admin_primary_email = this.instDetails.admin_primary_email;
    if (this.instDetails.student_id_type == null) {
      obj.student_id_type = "Automatic";
    } else {
      obj.student_id_type = this.instDetails.student_id_type;
    }
    if (this.instDetails.student_id_type == "Manual") {
      obj.student_id_prefix = '';
    } else {
      obj.student_id_prefix = this.instDetails.student_id_prefix;
    }                                       //Please check this case
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

  checkInputType(event) {
    if (event.target.id == "idManual") {
      this.showPrefix = false;
      this.instDetails.student_id_type = "Manual";
    } else {
      this.showPrefix = true;
      this.instDetails.student_id_type = "Automatic"
    }
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
    let arr: any = [];
    if (this.instDetails.hasOwnProperty('option_selected_id')) {
      if (this.instDetails.option_selected_id != null && this.instDetails.option_selected_id != "") {
        arr = this.instDetails.option_selected_id.split(',');
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (data[i].id == arr[i]) {
              obj.push(data[i]);
            }
          }
        }
      } else {
        return obj;
      }
    }
    return obj;
  }


  bindTableData() {
    this.instituteOptions = this.getOptionOfInstitute(this.instituteOptionDataSource);
    this.planDetail = this.getPlanOfInstitute(this.planDetailDataSource);
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

  // errorCallBack = (err) => {
  //   this.isRippleLoad = false;
  //console.log(err);
  //   this.messageToast('error', 'Error', err.error.message);
  // }

  validatePhoneNumber(data) {
    let check: boolean = false;
    if (data != "" && data != null) {
      if (isNaN(data) == false && data.length == 10) {
        check = true;
      } else {
        check = false;
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
