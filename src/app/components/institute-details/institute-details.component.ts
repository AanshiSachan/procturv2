import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticatorService } from '../../services/authenticator.service';
import { CommonServiceFactory } from '../../services/common-service';
import { InstituteDetailService } from '../../services/institute-details/institute-details.service';
import { HttpService } from '../../services/http.service';

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
  showPrefix: boolean = false;
  createNewSlot: boolean = false;
  zoomDetails:any = [];
  zoomOBJ: any = {
    institute_id: sessionStorage.getItem('institute_id'),
    account_name : '',
    email_id : '',
    sdk_api_key : '',
    sdk_api_secret : '',
    jwt_access_token : '',
    jwt_api_key : '',
    jwt_api_secret : '',
    user_limit: ''
  }
  dividersObj = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  }
  singleDevice: any;

  constructor(
    private apiService: InstituteDetailService,
    private commonService: CommonServiceFactory,
    private auth:AuthenticatorService,
    private httpService: HttpService
  ) { }

  ngOnInit() {
    this.commonService.removeSelectionFromSideNav();
    this.updatePrefillData();
  }

  updatePrefillData(): any {

    this.getInstituteDetails();
    this.getInstituteKYCDetails();
    this.getOptionDetailsFromServer();
    this.getPlanDetailsFromServer();
    this.getStorageInformation();
    this.getZoomDetails();
  }


  getInstituteDetails() {
    this.apiService.getInstituDetailsAll().subscribe(
      res => {
        this.auth.hideLoader();
        this.instituteDetailsAll = res;
        this.instDetails = Object.assign({}, res);
        this.singleDevice = this.instDetails.single_device_login;
        if (this.instDetails.is_student_displayId_manual == 0) {
          this.showPrefix = true;
        }
        if(this.instDetails.enable_student_app_url == 1) {
          this.instDetails.enable_student_app_url = true;
        }
      },
      err => {
        this.auth.hideLoader();
        //console.log(err);
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  getInstituteKYCDetails() {
    this.apiService.getKycTypeDetails().subscribe(
      res => {
        this.auth.hideLoader();
        this.kycType = res;
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  getOptionDetailsFromServer() {
    this.apiService.getOptionDetails().subscribe(
      res => {
        this.auth.hideLoader();
        this.instituteOptionDataSource = res;
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  getPlanDetailsFromServer() {
    this.apiService.getPlanDetails().subscribe(
      res => {
        this.auth.hideLoader();
        this.planDetailDataSource = res;
        this.instituteOptions = this.getOptionOfInstitute(this.instituteOptionDataSource);
        this.planDetail = this.getPlanOfInstitute(this.planDetailDataSource);
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    );
  }


  updateAllDetails() {
    let dataToSend = this.formatDataJsonToSend();
    if(dataToSend){
      this.auth.showLoader();
      this.apiService.updateDetailsToServer(dataToSend).subscribe(
        res => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('success', '', 'Details updated successfully');
        },
        err => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }

  getPaymentDeatils() {
    this.paymentTable = [];
    this.auth.showLoader();
    this.apiService.getPayementInfoFromServer().subscribe(
      res => {
        this.auth.hideLoader();
        this.paymentTable = res;
        this.showAllocationPopup = true;
        this.openPopUpName = "PaymentHistory";
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
  }


  smsAllocationHistoryDeatils() {
    this.smsAllocation = [];
    this.auth.showLoader();
    this.apiService.getSmsInfoFromServer().subscribe(
      res => {
        this.auth.hideLoader();
        this.smsAllocation = res;
        this.showAllocationPopup = true;
        this.openPopUpName = "SMSHistory";
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
  }


  downLoadLimitAllocationHistory() {
    this.limitTable = [];
    this.auth.showLoader();
    this.apiService.getDownloadLimitFromServer().subscribe(
      res => {
        this.auth.hideLoader();
        this.limitTable = res;
        this.showAllocationPopup = true;
        this.openPopUpName = "DownloadLimit";
      },
      err => {
        this.auth.hideLoader();
        //console.log(err);
        this.commonService.showErrorMessage('error', '', err.error.message);
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
        this.auth.hideLoader();
        //console.log(err);
        this.commonService.showErrorMessage('error', '', err.error.message);
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
    obj.youtube_url = this.instDetails.youtube_url;
    obj.whatsapp_url = this.instDetails.whatsapp_url;
    obj.instagram_url = this.instDetails.instagram_url;
    obj.linkedin_url = this.instDetails.linkedin_url;
    obj.qna_doubt_url = this.instDetails.qna_doubt_url;
    obj.institute_short_code = this.instDetails.institute_short_code;
    obj.tag_line = this.instDetails.tag_line;
    obj.sms_shortcode = this.instDetails.sms_shortcode;
    obj.about_us_text = this.instDetails.about_us_text;
    obj.student_ios_app_url = this.instDetails.student_ios_app_url;
    obj.student_app_url = this.instDetails.student_app_url;
    obj.institute_testprep_logo = this.instDetails.institute_testprep_logo;
    obj.announcement = this.instDetails.announcement;
    obj.owner_name = this.instDetails.owner_name;
    obj.owner_primary_email = this.instDetails.owner_primary_email;
    obj.owner_secondary_email = this.instDetails.owner_secondary_email;
    obj.owner_primary_phone = this.instDetails.owner_primary_phone;
    obj.admin_name = this.instDetails.admin_name;
    obj.single_device_login = this.instDetails.single_device_login;
    obj.feedback_url = this.instDetails.feedback_url;
    obj.help_url = this.instDetails.help_url;
    obj.privacy_policy_url = this.instDetails.privacy_policy_url;
    obj.terms_and_condition_url = this.instDetails.terms_and_condition_url;
    if (!(this.validatePhoneNumber(this.instDetails.admin_primary_phone))) {
      this.commonService.showErrorMessage('error', '', 'Please check contact number');
      return
    }
    if (!(this.validateCaseSensitiveEmail(this.instDetails.admin_primary_email))) {
      this.commonService.showErrorMessage('error', '', 'Please check email address');
      return
    }
    obj.alternate_institute_primary_contact_numbers = this.instDetails.alternate_institute_primary_contact_numbers;
    if (this.instDetails.alternate_institute_primary_contact_numbers != null && this.instDetails.alternate_institute_primary_contact_numbers != 'NULL' && this.instDetails.alternate_institute_primary_contact_numbers != '') {
      if (!this.checkContactNoPattern(this.instDetails.alternate_institute_primary_contact_numbers)) {
        this.commonService.showErrorMessage('error', '', 'Please enter numbers only');
        return false;
      }
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
    obj.enable_faculty_all_file_access = 0;
    if(this.instDetails.enable_faculty_all_file_access) {
      obj.enable_faculty_all_file_access = 1;
    }

    obj.kyc_document_name = this.instDetails.kyc_document_name;
    obj.kyc_document = this.instDetails.kyc_document;
    obj.kyc_document_type = this.instDetails.kyc_document_type;
    (this.instDetails.enable_student_app_url) ? (obj.enable_student_app_url = 1 ) : (obj.enable_student_app_url = 0 );

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

  checkSingleDevice(event){
    console.log(event)
    console.log(this.singleDevice)
    if(this.singleDevice){
      this.instDetails.single_device_login = false;
    }
    else{
    this.instDetails.single_device_login = true;
    }
  }



  //check contact no pattern (comma seperator)
  checkContactNoPattern(pattern) {
    var regExPattern = /^[0-9]+(,[0-9]+)*$/;
    if (!(regExPattern.test(pattern))) {
      return false;
    }
    else {
      return true;
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

  toggleUpAndDownButton(index) {
    if (this.dividersObj[index] == true) {
      this.dividersObj[index] = false;
    }
    else {
      this.dividersObj[index] = true;
    }
  }

  uploadDocument() {
    this.uploadDoc.nativeElement.click();
  }

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
      var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,9})+$/;
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

  getZoomDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/meeting_manager/getAllZoomAccount/' + sessionStorage.getItem('institute_id')).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.zoomDetails = res.result;
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  
  validateZoomDetails(obj) {
    var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,9})+$/;
    if(obj.account_name.trim() != ''){
      if(obj.email_id.trim() != '' && reg.test(obj.email_id)){
        if(obj.sdk_api_key.trim() != ''){
          if(obj.sdk_api_secret.trim() != ''){
            if(obj.jwt_access_token.trim() != ''){
              if(obj.jwt_api_key.trim() != ''){
                if(obj.jwt_api_secret.trim() != ''){
                  if(obj.user_limit != '' && obj.user_limit > 0) {
                    return true;
                  } else {
                    this.commonService.showErrorMessage('error', '','User limit should be greater than 0');
                  }
                } else {
                  this.commonService.showErrorMessage('error','','Please enter JWT API Secret Key');
                  return false;
                }
              } else {
                this.commonService.showErrorMessage('error','','Please enter JWT API key');
                return false;
              }
            } else {
              this.commonService.showErrorMessage('error','','Please enter JWT Access Token');
              return false;
            }
          } else {
            this.commonService.showErrorMessage('error','','Please enter SDK secret key');
            return false;
          }
        } else{
          this.commonService.showErrorMessage('error','','Please enter SDK API key');
          return false;
        }
      } else {
        this.commonService.showErrorMessage('error','','Please enter valid Email ID');
        return false;
      }
    }else {
      this.commonService.showErrorMessage('error','','Please enter Account Name');
      return false;
    }
  }

  updateZoom(obj) {
    if(this.validateZoomDetails(obj)){
    this.auth.showLoader();
    this.httpService.putData('/api/v1/meeting_manager/updateZoomAccount', obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('success', '', 'Updated successfully');
        this.getZoomDetails();
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    );
    }
  }

  deleteZoom(id) {
    if(confirm('Do you really want to delete?')) {
    this.auth.showLoader();
    this.httpService.deleteData('/api/v1/meeting_manager/deleteZoomAccount/' +  id, '').subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('success', '', 'Deleted successfully');
        this.getZoomDetails();
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    );
    }
  }

  editZoom(id) {
    if (document.getElementById(("data" + id).toString()).classList) {
    document.getElementById(("data" + id).toString()).classList.remove('displayComp');
    document.getElementById(("data" + id).toString()).classList.add('editComp');
    }
  }

  cancelRow(id) {
    if (document.getElementById(("data" + id).toString()).classList) {
    document.getElementById(("data" + id).toString()).classList.remove('editComp');
    document.getElementById(("data" + id).toString()).classList.add('displayComp');
    }
    this.getZoomDetails();
  }

  ClearZoomJSON() {
    this.zoomOBJ = {
      institute_id: sessionStorage.getItem('institute_id'),
      email_id: '',
      account_name: '',
      sdk_api_key: '',
      sdk_api_secret: '',
      jwt_access_token: '',
      jwt_api_key: '',
      jwt_api_secret: '',
      user_limit: ''
    };
  }

  saveZoomDetails() {
    if(this.validateZoomDetails(this.zoomOBJ)){
    this.auth.showLoader();
    this.httpService.postData('/api/v1/meeting_manager/createZoomAccount', this.zoomOBJ).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('success', '', 'Created successfully');
        this.getZoomDetails();
        this.zoomOBJ = {
          institute_id: sessionStorage.getItem('institute_id'),
          email_id: '',
          account_name: '',
          sdk_api_key: '',
          sdk_api_secret: '',
          jwt_access_token: '',
          jwt_api_key: '',
          jwt_api_secret: '',
          user_limit: ''
        };
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    );
    }
  }

}
