import { Component, OnInit } from '@angular/core';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { AuthenticatorService } from '../../services/authenticator.service';
import { CommonServiceFactory } from '../../services/common-service';
import { InstituteSettingService } from '../../services/institute-setting-service/institute-setting.service';
import { MessageShowService } from '../../services/message-show.service';
import { HttpService } from '../../services/http.service';
@Component({
  selector: 'app-institute-settings',
  templateUrl: './institute-settings.component.html',
  styleUrls: ['./institute-settings.component.scss']
})
export class InstituteSettingsComponent implements OnInit {

  enable_vdoCipher_feature: any = '0';
  isLangInst: boolean = false;
  student_expiry_notifctn: boolean;
  others_expiry_notifctn: boolean;
  minArr: any[] = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '55'];
  meridianArr: any[] = ["AM", "PM"];
  times: any[] = ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];

  instituteSettingDet: any = {
    sms_notification: '',
    email_notification: '',
    sms_status_report: '',
    new_student_addmission_email_notification: '',
    new_student_addmission_sms_notification: '',
    student_reg_notification: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    sms_teacher_registration: {
      teacher: '',
      admin: '',
    },
    exam_schedule_notification: {
      student: '',
      parent: '',
      gaurdian: '',
      teacher: '',
      admin: '',
    },
    extra_class_schedule_notification: {
      student: '',
      parent: '',
      gaurdian: '',
      teacher: '',
      admin: '',
    },
    student_exam_marks_notification: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: ''
    },
    cancel_class_schedule_notification: {
      student: '',
      parent: '',
      gaurdian: '',
      teacher: '',
      admin: '',
    },
    sms_absent_notification: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    birthday_sms: {
      student: '',
      parent: '',
      gaurdian: '',
      teacher: '',
      admin: ''
    },
    birthday_daily_schedule: "",
    fee_dues_daily_notification: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    fee_dues_daily_schedule: "",
    fee_dues_interval_notification: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    fee_dues_interval: '',
    fee_dues_interval_schedule: "",
    pre_fee_dues_interval_notification: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    pre_fee_dues_interval: '',
    pre_fee_dues_interval_schedule: "",
    student_fee_dues_notification: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    enquiry_notification: {
      student: '',
      admin: '',
    },
    fee_payment_notification: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    alumni_birthday_sms: {
      student: '',
      parent: '',
      gaurdian: '',
      teacher: '',
      admin: '',
    },
    alumni_birthday_daily_schedule: {
      hour: '',
      minute: '',
    },
    regular_class_notification: {
      student: '',
      parent: '',
      gaurdian: '',
      teacher: '',
      admin: '',
    },
    ptm_notification: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    home_work_status_notification: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    student_file_share_notifn: {
      student: '',
    },
    cheque_bounce_sms_notifn: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    home_work_assignment_notification: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    topics_covered_notification: {
      student: '',
      parent: '',
      gaurdian: '',
      teacher: '',
      admin: '',
    },
    biometric_first_in_time_sms: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    biometric_every_out_time_sms: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    biometric_late_sms: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    biometric_absent_sms: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    biometric_in_out_sms: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    lib_send_sms_for_book_issued: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    lib_send_sms_for_book_returned: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    lib_send_sms_on_due_date: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    lib_send_sms_pre_due_date: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    lib_send_sms_post_due_date: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    lib_send_sms_for_book_marked_lost: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    lib_send_sms_for_book_marked_scrapped: {
      student: '',
      parent: '',
      gaurdian: '',
      admin: '',
    },
    enable_exam_marks_not_update_notification: {
      teacher: '',
      admin: '',
      other: false
    },
    enable_exam_attendance_not_marked_notification: {
      teacher: '',
      admin: '',
      other: false
    },
    enable_class_attendance_not_marked_notification: {
      teacher: '',
      admin: '',
      other: false
    },
    enable_exam_attendance_not_marked_daily_notification: {
      teacher: '',
      admin: '',
      other: false
    },
    enable_class_attendance_not_marked_daily_notification: {
      teacher: '',
      admin: '',
      other: false
    },
    live_class_attendance_absent_notification: {
      student: '',
      parent: '',
      gaurdian: ''
    },
    live_class_attendance_partial_present_notification: {
      student: '',
      parent: '',
      gaurdian: ''
    },
    live_class_attendance_stat_notification: {
      teacher: '',
      admin: ''
    },
    live_class_attendance_threshold: '',
    live_class_attendance_notification: '-1',
    exam_min_marks: '',
    exam_average_marks: '',
    exam_max_marks: '',
    exam_rank: '',
    rank_to_send_for_marks_sms: '',
    rank_no_for_marks_sms: '',
    is_exam_grad_feature: '',
    test_buffer_duration: '',
    absent_attendance_in_a_month_threshold: '',
    fee_receipt_invoice_pattern: '',
    phone_no_fee_receipt: '',
    inst_service_tax_no: '',
    inst_pan_no: '',
    gst_enabled: '',
    gst_no: '',
    cgst: '',
    sgst: '',
    inst_fee_activity_email_recipients: '',
    pdc_reminder_setting: '',
    pdc_reminder_sent_on: '',
    student_report_card_fee_module: '',
    student_wise_fee_fine_amount: '',
    service_tax_percentage: '',
    sbc_tax: '',
    kkc_tax: '',
    cin: '',
    service_code: '',
    tax_payable_on_reverse_charge_basis: '',
    state_code: '',
    accounting_code: '',
    home_work_feature_enable: '',
    inst_enquiry_handler_no: '',
    pre_enquiry_follow_up_reminder_time: '',
    post_enquiry_follow_up_reminder_time: '',
    allow_simple_registration: '',
    virtual_host_url: '',
    daily_account_summary: '',
    teacher_monthly_report: '',
    emailids_for_report: '',
    emailid_for_teacher_report: '',
    enable_online_payment_email_notification: '',
    enable_online_payment_sms_notification: '',
    online_payment_notify_emailIds: '',
    online_payment_notify_mobiles: '',
    allow_fee_due_amount_in_notification: '',
    due_date_in_fee_receipt: '',
    discount_amount_in_fee_receipt: '',
    balance_amount_in_fee_receipt: '',
    show_counseller_name_in_fee_receipt: '',
    biometric_late_sms_buffer: 0,
    biometric_class_in_time_buffer_in_min: 0,
    biometric_class_out_time_buffer_in_min: 0,

    user_registration_otp_via_sms: '',
    user_registration_otp_via_email: '',
    enable_justDial_routing_report: '',
    emailIds_for_justDail_ext_lead: '',
    enable_teacher_for_multiple_class: '',
    enable_elearn_course_mapping_feature: '',
    enable_counsellor_number_to_enquirer_in_sms: '',
    //course/batch expiry notification
    course_or_batch_expiry_notification: '',
    course_or_batch_expiry_notification_before_no_days: '',
    course_or_batch_expiry_notification_contact_no: '',
    //student expiry notifctn
    enable_student_expiry_notification: '',
    student_expiry_notification_before_no_days: '',
    student_expiry_notification_contact_no: '',

    first_sms_low_balance_threshold: '0',
    second_sms_low_balance_threshold: '0',
    sms_low_balance_alert_contact_number: '',


    lib_issue_for_days: '',
    lib_due_date_fine_per_day: '',
    jwt_secret_key: '',
    product_purchase_multiple_email: '',
    product_purchase_multiple_mobile: '',
    class_attendance_not_marked_notification_contact_number: '',
    class_attendance_not_marked_daily_notification_contact_number: '',
    exam_attendance_not_marked_notification_contact_number: '',
    exam_attendance_not_marked_daily_notification_contact_number: '',
    exam_marks_not_update_notification_contact_number: '',
    vat_percentage: '',
    enable_send__website_url_in_student_credentail: '',
    summaryReportDownloadOptions: '',
    student_study_material_visibility: '',
    notification_for_studymaterial_upload: '',
    enable_student_app_offline_video_download: '',
    enable_assign_to_feature: '',
    feedback_email_ids: ''
  };
  onlinePayment: any = '0';
  test_series_feature: any = '0';
  instituteName: any = '';
  biometricSetting: number = 0;
  menuList: string[] = ['liSMS', 'liExamRep', 'liFee', 'liReport', 'liMisc', 'liBio', 'liLib', 'liExceptioneport', 'liAccess', 'lieStore', 'liLive'];
  contenTDiv: string[] = ['divSMSContent', 'divExceptioneport', 'divExamReport', 'divFeeContent', 'divReportContent', 'divMiscContent', 'divBioMetricContent', 'divLibraryContent', 'divAccessControl', 'divLiveClassContent', 'diveStoreContent'];

  IPJson: any = {
    'institute_id': sessionStorage.getItem('institute_id'),
    'ip_address': '',
    'floor_details': null,
    'description': null
  };
  enable_ip_lock_feature: any = '';
  IPDetails: any[] = [];
  ipAddress: any = '';

  // Library Role
  libraryRole: boolean = false;
  instituteId: any;
  instituteTaxType : String;
  show_vdocipher_video_ready_sms_to_admin: boolean = false;
  reportFor = {
    enquiry: false,
    admissions: false,
    fees: false,
  };
  constructor(
    private apiService: InstituteSettingService,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory,
    private msgSrvc: MessageShowService,
    private httpService: HttpService
  ) {
    this.commonService.removeSelectionFromSideNav();
  }

  ngOnInit() {
    this.instituteName = sessionStorage.getItem('institute_name');
    this.instituteId = sessionStorage.getItem('institute_id');
    this.onlinePayment = sessionStorage.getItem('enable_online_payment_feature');
    this.biometricSetting = Number(sessionStorage.getItem('biometric_attendance_feature'));
    this.instituteTaxType = sessionStorage.getItem("tax_type_without_percentage") == 'Vat' ? 'Vat' : 'GST';
    this.enable_ip_lock_feature = sessionStorage.getItem('enable_ip_lock_feature');
    this.enable_vdoCipher_feature = sessionStorage.getItem('enable_vdoCipher_feature');
    console.log(this.enable_ip_lock_feature);

    this.checkInstitutionType();
    this.getSettingFromServer();
    this.libraryRoleSetting();
    this.getIPAllDetails();
    this.getIP();
    if ((sessionStorage.getItem('enable_vdoCipher_feature') == '1') && (sessionStorage.getItem('enable_vimeo_feature') == '1')) {
      this.show_vdocipher_video_ready_sms_to_admin = true;
    }
  }

  libraryRoleSetting() {
    const permissionArray = sessionStorage.getItem('permissions');
    let username = sessionStorage.getItem('username');
    if (((username == "admin" && this.instituteId == 100127) ||
      (username == "admin" && this.instituteId == 100058) ||
      (username == "admin" && this.instituteId == 101077)) ||
      permissionArray.indexOf('721') != -1) {
      this.libraryRole = true;
    }
  }

  changeView(lidiv, showView) {
    this.hideAndRemoveClass();
    document.getElementById(lidiv).classList.add('active');
    document.getElementById(showView).scrollIntoView(true);
    if (showView == "divExamReport") {
      this.enableRankSpecifier()
    }
  }

  hideAndRemoveClass() {
    this.menuList.map(
      ele => {
        if (document.getElementById(ele)) { document.getElementById(ele).classList.remove('active'); }
      }
    );
  }


  getSettingFromServer() {
    this.auth.showLoader();
    this.apiService.getInstituteSettingFromServer().subscribe(
      res => {
        this.auth.hideLoader();
        this.test_series_feature = res.test_series_feature;
        this.fillJSONData(res);
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  saveAllSettings() {
    let dataToSend: any = {};
    if (this.instituteSettingDet.gst_enabled) {
      if (this.instituteSettingDet.gst_no == "" || this.instituteSettingDet.gst_no == null) {
        this.commonService.showErrorMessage('error', '', "Please specify " + this.instituteTaxType + " NO.");
        return;
      }
    }
    dataToSend = this.constructJsonToSend();
    if (dataToSend) {
      this.auth.showLoader();
      this.apiService.saveSettingsToServer(dataToSend).subscribe(
        res => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('success', '', "All your setting saved successfully");
        },
        err => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }

  cancelAllSettings() {
    this.getSettingFromServer();
  }

  constructJsonToSend() {
    let obj: any = Object.assign({}, this.instituteSettingDet);
    this.calculateCGSTAndSGSTFromVat(obj);
    obj.sms_notification = this.convertBoolenToNumber(this.instituteSettingDet.sms_notification);
    obj.email_notification = this.convertBoolenToNumber(this.instituteSettingDet.email_notification);
    obj.sms_status_report = this.convertBoolenToNumber(this.instituteSettingDet.sms_status_report);
    obj.student_reg_notification = this.getSumOfTableField(this.instituteSettingDet.student_reg_notification);
    obj.sms_teacher_registration = this.getSumOfTableField(this.instituteSettingDet.sms_teacher_registration);
    obj.exam_schedule_notification = this.getSumOfTableField(this.instituteSettingDet.exam_schedule_notification);
    obj.extra_class_schedule_notification = this.getSumOfTableField(this.instituteSettingDet.extra_class_schedule_notification);
    obj.student_exam_marks_notification = this.getSumOfTableField(this.instituteSettingDet.student_exam_marks_notification);
    obj.exam_schedule_notification = this.getSumOfTableField(this.instituteSettingDet.exam_schedule_notification);
    obj.extra_class_schedule_notification = this.getSumOfTableField(this.instituteSettingDet.extra_class_schedule_notification);
    obj.student_exam_marks_notification = this.getSumOfTableField(this.instituteSettingDet.student_exam_marks_notification);
    obj.cancel_class_schedule_notification = this.getSumOfTableField(this.instituteSettingDet.cancel_class_schedule_notification);
    obj.sms_absent_notification = this.getSumOfTableField(this.instituteSettingDet.sms_absent_notification);
    obj.birthday_sms = this.getSumOfTableField(this.instituteSettingDet.birthday_sms);
    obj.fee_dues_daily_notification = this.getSumOfTableField(this.instituteSettingDet.fee_dues_daily_notification);
    obj.fee_dues_interval_notification = this.getSumOfTableField(this.instituteSettingDet.fee_dues_interval_notification);
    obj.pre_fee_dues_interval_notification = this.getSumOfTableField(this.instituteSettingDet.pre_fee_dues_interval_notification);
    obj.student_fee_dues_notification = this.getSumOfTableField(this.instituteSettingDet.student_fee_dues_notification);
    obj.enquiry_notification = this.getSumOfTableField(this.instituteSettingDet.enquiry_notification);
    obj.fee_payment_notification = this.getSumOfTableField(this.instituteSettingDet.fee_payment_notification);
    obj.alumni_birthday_sms = this.getSumOfTableField(this.instituteSettingDet.alumni_birthday_sms);
    obj.regular_class_notification = this.getSumOfTableField(this.instituteSettingDet.regular_class_notification);
    obj.ptm_notification = this.getSumOfTableField(this.instituteSettingDet.ptm_notification);
    obj.home_work_status_notification = this.getSumOfTableField(this.instituteSettingDet.home_work_status_notification);
    obj.student_file_share_notifn = this.getSumOfTableField(this.instituteSettingDet.student_file_share_notifn);
    obj.cheque_bounce_sms_notifn = this.getSumOfTableField(this.instituteSettingDet.cheque_bounce_sms_notifn);
    obj.home_work_assignment_notification = this.getSumOfTableField(this.instituteSettingDet.home_work_assignment_notification);
    obj.topics_covered_notification = this.getSumOfTableField(this.instituteSettingDet.topics_covered_notification);
    obj.exam_min_marks = this.convertBoolenToNumber(this.instituteSettingDet.exam_min_marks);
    obj.exam_average_marks = this.convertBoolenToNumber(this.instituteSettingDet.exam_average_marks);
    obj.exam_max_marks = this.convertBoolenToNumber(this.instituteSettingDet.exam_max_marks);
    obj.exam_rank = this.convertBoolenToNumber(this.instituteSettingDet.exam_rank);
    obj.rank_to_send_for_marks_sms = this.convertBoolenToNumber(this.instituteSettingDet.rank_to_send_for_marks_sms);
    obj.is_exam_grad_feature = this.convertBoolenToNumber(this.instituteSettingDet.is_exam_grad_feature);
    obj.absent_attendance_in_a_month_threshold = this.instituteSettingDet.absent_attendance_in_a_month_threshold;
    obj.gst_enabled = this.convertBoolenToNumber(this.instituteSettingDet.gst_enabled);
    obj.pdc_reminder_setting = this.convertBoolenToNumber(this.instituteSettingDet.pdc_reminder_setting);
    obj.student_report_card_fee_module = this.convertBoolenToNumber(this.instituteSettingDet.student_report_card_fee_module);
    obj.tax_payable_on_reverse_charge_basis = this.convertBoolenToNumber(this.instituteSettingDet.tax_payable_on_reverse_charge_basis);
    obj.home_work_feature_enable = this.convertBoolenToNumber(this.instituteSettingDet.home_work_feature_enable);
    obj.absenteeism_report_flag = this.convertBoolenToNumber(this.instituteSettingDet.absenteeism_report_flag);
    obj.pre_enquiry_follow_up_reminder_time = (this.instituteSettingDet.pre_enquiry_follow_up_reminder_time);
    obj.post_enquiry_follow_up_reminder_time = (this.instituteSettingDet.post_enquiry_follow_up_reminder_time);


    obj.enable_counsellor_number_to_enquirer_in_sms = this.convertBoolenToNumber(this.instituteSettingDet.enable_counsellor_number_to_enquirer_in_sms);
    obj.course_or_batch_expiry_notification = this.convertBoolenToNumber(this.instituteSettingDet.course_or_batch_expiry_notification);
    obj.course_or_batch_expiry_notification_before_no_days = this.instituteSettingDet.course_or_batch_expiry_notification_before_no_days;
    obj.course_or_batch_expiry_notification_contact_no = this.instituteSettingDet.course_or_batch_expiry_notification_contact_no;
    if (this.instituteSettingDet.course_or_batch_expiry_notification) {
      if (this.instituteSettingDet.course_or_batch_expiry_notification_contact_no != '' && this.instituteSettingDet.course_or_batch_expiry_notification_contact_no != null) {
        if (!(this.checkContactNoPattern(this.instituteSettingDet.course_or_batch_expiry_notification_contact_no))) {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', 'Please enter numbers only');
          return false;
        }
      }
    }
    if (this.instituteSettingDet.product_purchase_multiple_mobile && this.instituteSettingDet.product_purchase_multiple_mobile != '' && !(this.checkContactNoPattern(this.instituteSettingDet.product_purchase_multiple_mobile))) {
      this.commonService.showErrorMessage('error', '', 'Please check contact number');
      return
    }
    obj.product_purchase_multiple_mobile = this.instituteSettingDet.product_purchase_multiple_mobile;
    obj.product_purchase_multiple_email = this.instituteSettingDet.product_purchase_multiple_email;

    obj.enable_assign_to_feature = this.convertBoolenToNumber(this.instituteSettingDet.enable_assign_to_feature);
    obj.feedback_email_ids = this.instituteSettingDet.feedback_email_ids;

    obj.student_expiry_notification_before_no_days = this.instituteSettingDet.student_expiry_notification_before_no_days;
    obj.student_expiry_notification_contact_no = this.instituteSettingDet.student_expiry_notification_contact_no;
    obj.enable_student_expiry_notification = this.sendExpiryNotifctnKeys();
    if (this.instituteSettingDet.enable_student_expiry_notification == 16 || this.instituteSettingDet.enable_student_expiry_notification == 18) {
      if (this.instituteSettingDet.student_expiry_notification_contact_no != null && this.instituteSettingDet.student_expiry_notification_contact_no != '') {
        if (!(this.checkContactNoPattern(this.instituteSettingDet.student_expiry_notification_contact_no))) {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', 'Please enter numbers only')
          return false;
        }
      }
    }
    obj.class_attendance_not_marked_notification_contact_number = this.instituteSettingDet.class_attendance_not_marked_notification_contact_number;
    obj.class_attendance_not_marked_daily_notification_contact_number = this.instituteSettingDet.class_attendance_not_marked_daily_notification_contact_number;
    obj.exam_attendance_not_marked_notification_contact_number = this.instituteSettingDet.exam_attendance_not_marked_notification_contact_number;
    obj.exam_attendance_not_marked_daily_notification_contact_number = this.instituteSettingDet.exam_attendance_not_marked_daily_notification_contact_number
    obj.exam_marks_not_update_notification_contact_number = this.instituteSettingDet.exam_marks_not_update_notification_contact_number;

    if (this.instituteSettingDet.class_attendance_not_marked_notification_contact_number != null && this.instituteSettingDet.class_attendance_not_marked_notification_contact_number != '') {
      if (!(this.checkContactNoPattern(this.instituteSettingDet.class_attendance_not_marked_notification_contact_number))) {
        this.commonService.showErrorMessage('error', '', 'Please enter numbers only');
        return false;
      }
    }

    if (this.instituteSettingDet.class_attendance_not_marked_daily_notification_contact_number != null && this.instituteSettingDet.class_attendance_not_marked_daily_notification_contact_number != '') {
      if (!(this.checkContactNoPattern(this.instituteSettingDet.class_attendance_not_marked_daily_notification_contact_number))) {
        this.commonService.showErrorMessage('error', '', 'Please enter numbers only');
        return false;
      }
    }

    if (this.instituteSettingDet.exam_attendance_not_marked_notification_contact_number != null && this.instituteSettingDet.exam_attendance_not_marked_notification_contact_number != '') {
      if (!(this.checkContactNoPattern(this.instituteSettingDet.exam_attendance_not_marked_notification_contact_number))) {
        this.commonService.showErrorMessage('error', '', 'Please enter numbers only');
        return false;
      }
    }

    if (this.instituteSettingDet.exam_attendance_not_marked_daily_notification_contact_number != null && this.instituteSettingDet.exam_attendance_not_marked_daily_notification_contact_number != '') {
      if (!(this.checkContactNoPattern(this.instituteSettingDet.exam_attendance_not_marked_daily_notification_contact_number))) {
        this.commonService.showErrorMessage('error', '', 'Please enter numbers only');
        return false;
      }
    }

    if (this.instituteSettingDet.exam_marks_not_update_notification_contact_number != null && this.instituteSettingDet.exam_marks_not_update_notification_contact_number != '') {
      if (!(this.checkContactNoPattern(this.instituteSettingDet.exam_marks_not_update_notification_contact_number))) {
        this.commonService.showErrorMessage('error', '', 'Please enter numbers only');
        return false;
      }
    }


    obj.first_sms_low_balance_threshold = this.instituteSettingDet.first_sms_low_balance_threshold != null && this.instituteSettingDet.first_sms_low_balance_threshold != '' && this.instituteSettingDet.first_sms_low_balance_threshold != 0 ? this.instituteSettingDet.first_sms_low_balance_threshold : 0;
    obj.second_sms_low_balance_threshold = this.instituteSettingDet.second_sms_low_balance_threshold != null && this.instituteSettingDet.second_sms_low_balance_threshold != '' && this.instituteSettingDet.second_sms_low_balance_threshold != 0 ? this.instituteSettingDet.second_sms_low_balance_threshold : 0;
    obj.sms_low_balance_alert_contact_number = this.instituteSettingDet.sms_low_balance_alert_contact_number != '' && this.instituteSettingDet.sms_low_balance_alert_contact_number != null ? this.instituteSettingDet.sms_low_balance_alert_contact_number : null;
    if (obj.first_sms_low_balance_threshold != null && obj.second_sms_low_balance_threshold != null) {
      if (obj.second_sms_low_balance_threshold > obj.first_sms_low_balance_threshold) {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('info', '', 'Threshold SMS 2 cannnot be greater than Threshold SMS 1');
        return false;
      }
    } // sms_low_balance_alert_contact_number key by default coming as 'NULL' string from backend
    if (this.instituteSettingDet.sms_low_balance_alert_contact_number != null && this.instituteSettingDet.sms_low_balance_alert_contact_number != 'NULL' && this.instituteSettingDet.sms_low_balance_alert_contact_number != '') {
      if (!this.checkContactNoPattern(this.instituteSettingDet.sms_low_balance_alert_contact_number)) {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', 'Please enter numbers only');
        return false;
      }
    }
    // if (this.checkDropDownSelection(this.instituteSettingDet.pre_enquiry_follow_up_reminder_time) == false) {
    //   this.auth.hideLoader();
    //   return;
    // }
    // if (this.checkDropDownSelection(this.instituteSettingDet.post_enquiry_follow_up_reminder_time) == false) {
    //   this.auth.hideLoader();
    //   return;
    // }
    obj.daily_account_summary = this.convertBoolenToNumber(this.instituteSettingDet.daily_account_summary);
    if (this.instituteSettingDet.daily_account_summary || this.instituteSettingDet.daily_account_summary == '1') {
      obj.summaryReportDownloadOptions = this.getSumOfTableFieldForReport(this.reportFor);
    }
    obj.teacher_monthly_report = this.convertBoolenToNumber(this.instituteSettingDet.teacher_monthly_report);
    obj.allow_simple_registration = this.convertBoolenToNumber(this.instituteSettingDet.allow_simple_registration);
    obj.enable_online_payment_email_notification = this.convertBoolenToNumber(this.instituteSettingDet.enable_online_payment_email_notification);
    obj.enable_online_payment_sms_notification = this.convertBoolenToNumber(this.instituteSettingDet.enable_online_payment_sms_notification);
    obj.user_registration_otp_via_sms = this.convertBoolenToNumber(this.instituteSettingDet.user_registration_otp_via_sms);
    obj.user_registration_otp_via_email = this.convertBoolenToNumber(this.instituteSettingDet.user_registration_otp_via_email);
    obj.enable_justDial_routing_report = this.convertBoolenToNumber(this.instituteSettingDet.enable_justDial_routing_report);
    obj.enable_teacher_for_multiple_class = this.convertBoolenToNumber(this.instituteSettingDet.enable_teacher_for_multiple_class);
    obj.enable_elearn_course_mapping_feature = this.convertBoolenToNumber(this.instituteSettingDet.enable_elearn_course_mapping_feature);
    obj.enable_class_attendance_not_marked_notification = this.getSumOfTableField(this.instituteSettingDet.enable_class_attendance_not_marked_notification);
    obj.enable_exam_attendance_not_marked_notification = this.getSumOfTableField(this.instituteSettingDet.enable_exam_attendance_not_marked_notification);
    obj.enable_exam_marks_not_update_notification = this.getSumOfTableField(this.instituteSettingDet.enable_exam_marks_not_update_notification);
    obj.enable_exam_attendance_not_marked_daily_notification = this.getSumOfTableField(this.instituteSettingDet.enable_exam_attendance_not_marked_daily_notification);
    obj.enable_class_attendance_not_marked_daily_notification = this.getSumOfTableField(this.instituteSettingDet.enable_class_attendance_not_marked_daily_notification);

    obj.live_class_attendance_absent_notification = this.getSumOfTableField(this.instituteSettingDet.live_class_attendance_absent_notification);
    obj.live_class_attendance_partial_present_notification = this.getSumOfTableField(this.instituteSettingDet.live_class_attendance_partial_present_notification);
    obj.live_class_attendance_stat_notification = this.getSumOfTableField(this.instituteSettingDet.live_class_attendance_stat_notification);


    if (obj.phone_no_fee_receipt != "" && obj.phone_no_fee_receipt != null) {
      if (this.validatePhoneNumber(obj.phone_no_fee_receipt)) {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', 'Please enter valid contact number.');
        return;
      }
    }
    obj.fee_dues_interval = this.instituteSettingDet.fee_dues_interval;
    obj.pre_fee_dues_interval = this.instituteSettingDet.pre_fee_dues_interval;
    obj.allow_fee_due_amount_in_notification = this.convertBoolenToNumber(this.instituteSettingDet.allow_fee_due_amount_in_notification);
    obj.due_date_in_fee_receipt = this.convertBoolenToNumber(this.instituteSettingDet.due_date_in_fee_receipt);
    obj.discount_amount_in_fee_receipt = this.convertBoolenToNumber(this.instituteSettingDet.discount_amount_in_fee_receipt);
    obj.balance_amount_in_fee_receipt = this.convertBoolenToNumber(this.instituteSettingDet.balance_amount_in_fee_receipt);
    obj.show_counseller_name_in_fee_receipt = this.convertBoolenToNumber(this.instituteSettingDet.show_counseller_name_in_fee_receipt);
    obj.alumni_birthday_daily_schedule = this.convertTimeToSend(this.instituteSettingDet.alumni_birthday_daily_schedule);

    obj.biometric_first_in_time_sms = this.getSumOfTableField(this.instituteSettingDet.biometric_first_in_time_sms);
    obj.biometric_every_out_time_sms = this.getSumOfTableField(this.instituteSettingDet.biometric_every_out_time_sms);
    obj.biometric_late_sms = this.getSumOfTableField(this.instituteSettingDet.biometric_late_sms);
    obj.biometric_absent_sms = this.getSumOfTableField(this.instituteSettingDet.biometric_absent_sms);
    obj.biometric_in_out_sms = this.getSumOfTableField(this.instituteSettingDet.biometric_in_out_sms);
    obj.biometric_late_sms_buffer = this.instituteSettingDet.biometric_late_sms_buffer;
    obj.biometric_class_in_time_buffer_in_min = this.instituteSettingDet.biometric_class_in_time_buffer_in_min;
    obj.biometric_class_out_time_buffer_in_min = this.instituteSettingDet.biometric_class_out_time_buffer_in_min;


    obj.lib_send_sms_for_book_issued = this.getSumOfTableField(this.instituteSettingDet.lib_send_sms_for_book_issued);
    obj.lib_send_sms_for_book_returned = this.getSumOfTableField(this.instituteSettingDet.lib_send_sms_for_book_returned);
    obj.lib_send_sms_on_due_date = this.getSumOfTableField(this.instituteSettingDet.lib_send_sms_on_due_date);
    obj.lib_send_sms_pre_due_date = this.getSumOfTableField(this.instituteSettingDet.lib_send_sms_pre_due_date);
    obj.lib_send_sms_post_due_date = this.getSumOfTableField(this.instituteSettingDet.lib_send_sms_post_due_date);
    obj.lib_send_sms_for_book_marked_lost = this.getSumOfTableField(this.instituteSettingDet.lib_send_sms_for_book_marked_lost);
    obj.lib_send_sms_for_book_marked_scrapped = this.getSumOfTableField(this.instituteSettingDet.lib_send_sms_for_book_marked_scrapped);

    obj.lib_issue_for_days = this.instituteSettingDet.lib_issue_for_days;
    obj.lib_due_date_fine_per_day = this.instituteSettingDet.lib_due_date_fine_per_day;
    obj.new_student_addmission_email_notification = this.instituteSettingDet.new_student_addmission_email_notification;
    obj.new_student_addmission_sms_notification = this.instituteSettingDet.new_student_addmission_sms_notification;
    obj.enable_send__website_url_in_student_credentail = this.convertBoolenToNumber(this.instituteSettingDet.enable_send__website_url_in_student_credentail);
    obj.student_study_material_visibility = this.convertBoolenToNumber(this.instituteSettingDet.student_study_material_visibility);
    obj.notification_for_studymaterial_upload = this.convertBoolenToNumber(this.instituteSettingDet.notification_for_studymaterial_upload);
    obj.enable_student_app_offline_video_download = this.convertBoolenToNumber(this.instituteSettingDet.enable_student_app_offline_video_download);
    obj.vdocipher_video_ready_sms_to_admin = this.convertBoolenToNumber(this.instituteSettingDet.vdocipher_video_ready_sms_to_admin);
    if (this.checkPhoneValidation(this.instituteSettingDet.new_student_addmission_sms_notification) == false) {
      this.commonService.showErrorMessage('error', '', 'Please enter valid contact number.');
    } else {
      return obj;
    }
  }

  checkPhoneValidation(data) {
    let check;
    if (data) {
      data = data.split(',');
      for (let i = 0; i < data.length; i++) {
        if (data[i] != null && data[i] != "") {
          if (data[i].length != 10 || data[i].match(/^[A-Za-z]+$/)) {
            check = false;
            break;
          } else {
            check = true;
          }
        }
      }
      return check;
    }
  }

  convertTimeToSend(data) {
    let time = data.hour.split(' ')[0] + ':' + data.minute + ' ' + data.hour.split(' ')[1];
    return time;
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
  sendExpiryNotifctnKeys() {
    if (this.student_expiry_notifctn && !this.others_expiry_notifctn) {
      this.instituteSettingDet.enable_student_expiry_notification = 2;
    }
    else if (!this.student_expiry_notifctn && this.others_expiry_notifctn) {
      this.instituteSettingDet.enable_student_expiry_notification = 16;
    }
    else if (this.student_expiry_notifctn && this.others_expiry_notifctn) {
      this.instituteSettingDet.enable_student_expiry_notification = 18;
    }
    else {
      this.instituteSettingDet.enable_student_expiry_notification = 0;
    }
    return this.instituteSettingDet.enable_student_expiry_notification;
  }

  fillJSONData(data) {
    this.instituteSettingDet.sms_notification = data.sms_notification;
    this.instituteSettingDet.email_notification = data.email_notification;
    this.instituteSettingDet.sms_status_report = data.sms_status_report;
    this.fillTableCheckboxValue(this.instituteSettingDet.student_reg_notification, data.student_reg_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.sms_teacher_registration, data.sms_teacher_registration);
    this.fillTableCheckboxValue(this.instituteSettingDet.exam_schedule_notification, data.exam_schedule_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.extra_class_schedule_notification, data.extra_class_schedule_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.student_exam_marks_notification, data.student_exam_marks_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.cancel_class_schedule_notification, data.cancel_class_schedule_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.sms_absent_notification, data.sms_absent_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.birthday_sms, data.birthday_sms);
    this.fillTableCheckboxValue(this.instituteSettingDet.fee_dues_daily_notification, data.fee_dues_daily_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.fee_dues_interval_notification, data.fee_dues_interval_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.pre_fee_dues_interval_notification, data.pre_fee_dues_interval_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.student_fee_dues_notification, data.student_fee_dues_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.enquiry_notification, data.enquiry_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.fee_payment_notification, data.fee_payment_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.alumni_birthday_sms, data.alumni_birthday_sms);
    this.fillTableCheckboxValue(this.instituteSettingDet.regular_class_notification, data.regular_class_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.ptm_notification, data.ptm_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.home_work_status_notification, data.home_work_status_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.student_file_share_notifn, data.student_file_share_notifn);
    this.fillTableCheckboxValue(this.instituteSettingDet.cheque_bounce_sms_notifn, data.cheque_bounce_sms_notifn);
    this.fillTableCheckboxValue(this.instituteSettingDet.home_work_assignment_notification, data.home_work_assignment_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.topics_covered_notification, data.topics_covered_notification);

    this.fillTableCheckboxValue(this.instituteSettingDet.biometric_first_in_time_sms, data.biometric_first_in_time_sms);
    this.fillTableCheckboxValue(this.instituteSettingDet.biometric_every_out_time_sms, data.biometric_every_out_time_sms);
    this.fillTableCheckboxValue(this.instituteSettingDet.biometric_late_sms, data.biometric_late_sms);
    this.fillTableCheckboxValue(this.instituteSettingDet.biometric_absent_sms, data.biometric_absent_sms);
    this.fillTableCheckboxValue(this.instituteSettingDet.biometric_in_out_sms, data.biometric_in_out_sms);
    this.instituteSettingDet.biometric_late_sms_buffer = data.biometric_late_sms_buffer;
    this.instituteSettingDet.biometric_class_in_time_buffer_in_min = data.biometric_class_in_time_buffer_in_min;
    this.instituteSettingDet.biometric_class_out_time_buffer_in_min = data.biometric_class_out_time_buffer_in_min;

    this.instituteSettingDet.enable_assign_to_feature = data.enable_assign_to_feature;
    this.instituteSettingDet.feedback_email_ids = data.feedback_email_ids;
    this.instituteSettingDet.exam_min_marks = data.exam_min_marks;
    this.instituteSettingDet.exam_average_marks = data.exam_average_marks;
    this.instituteSettingDet.exam_max_marks = data.exam_max_marks;
    this.instituteSettingDet.exam_rank = data.exam_rank;
    this.instituteSettingDet.rank_to_send_for_marks_sms = data.rank_to_send_for_marks_sms;
    this.instituteSettingDet.rank_no_for_marks_sms = data.rank_no_for_marks_sms;
    this.instituteSettingDet.is_exam_grad_feature = data.is_exam_grad_feature;
    this.instituteSettingDet.test_buffer_duration = data.test_buffer_duration;
    this.instituteSettingDet.absent_attendance_in_a_month_threshold = data.absent_attendance_in_a_month_threshold;
    this.instituteSettingDet.fee_receipt_invoice_pattern = data.fee_receipt_invoice_pattern;
    this.instituteSettingDet.phone_no_fee_receipt = data.phone_no_fee_receipt;
    this.instituteSettingDet.inst_service_tax_no = data.inst_service_tax_no;
    this.instituteSettingDet.inst_pan_no = data.inst_pan_no;
    this.instituteSettingDet.gst_enabled = data.gst_enabled;
    this.instituteSettingDet.gst_no = data.gst_no;
    this.instituteSettingDet.cgst = data.cgst;
    this.instituteSettingDet.sgst = data.sgst;
    this.instituteSettingDet.vat_percentage = data.vat_percentage;
    this.instituteSettingDet.inst_fee_activity_email_recipients = data.inst_fee_activity_email_recipients;
    this.instituteSettingDet.pdc_reminder_setting = data.pdc_reminder_setting;
    this.instituteSettingDet.pdc_reminder_sent_on = data.pdc_reminder_sent_on;
    this.instituteSettingDet.student_report_card_fee_module = data.student_report_card_fee_module;
    this.instituteSettingDet.student_wise_fee_fine_amount = data.student_wise_fee_fine_amount;
    this.instituteSettingDet.service_tax_percentage = data.service_tax_percentage;
    this.instituteSettingDet.sbc_tax = data.sbc_tax;
    this.instituteSettingDet.kkc_tax = data.kkc_tax;
    this.instituteSettingDet.cin = data.cin;
    this.instituteSettingDet.service_code = data.service_code;
    this.instituteSettingDet.tax_payable_on_reverse_charge_basis = data.tax_payable_on_reverse_charge_basis;
    this.instituteSettingDet.state_code = data.state_code;
    this.instituteSettingDet.accounting_code = data.accounting_code;
    this.instituteSettingDet.home_work_feature_enable = data.home_work_feature_enable;
    this.instituteSettingDet.absenteeism_report_flag = data.absenteeism_report_flag;
    this.instituteSettingDet.inst_enquiry_handler_no = data.inst_enquiry_handler_no;
    this.instituteSettingDet.pre_enquiry_follow_up_reminder_time = data.pre_enquiry_follow_up_reminder_time;
    this.instituteSettingDet.post_enquiry_follow_up_reminder_time = data.post_enquiry_follow_up_reminder_time;
    this.instituteSettingDet.allow_simple_registration = data.allow_simple_registration;
    this.instituteSettingDet.virtual_host_url = data.virtual_host_url;
    this.instituteSettingDet.daily_account_summary = data.daily_account_summary;
    if (data.daily_account_summary || data.daily_account_summary == '1') {
      // this.instituteSettingDet.summaryReportDownloadOptions =  data.summaryReportDownloadOptions;
      this.fillSummaryReport(data.summaryReportDownloadOptions)
    }
    this.instituteSettingDet.teacher_monthly_report = data.teacher_monthly_report;
    this.instituteSettingDet.emailids_for_report = data.emailids_for_report;
    this.instituteSettingDet.emailid_for_teacher_report = data.emailid_for_teacher_report;
    this.instituteSettingDet.enable_online_payment_email_notification = data.enable_online_payment_email_notification;
    this.instituteSettingDet.enable_online_payment_sms_notification = data.enable_online_payment_sms_notification;
    this.instituteSettingDet.product_purchase_multiple_email = data.product_purchase_multiple_email;
    this.instituteSettingDet.online_payment_notify_mobiles = data.online_payment_notify_mobiles;
    this.instituteSettingDet.online_payment_notify_emailIds = data.online_payment_notify_emailIds;
    this.instituteSettingDet.product_purchase_multiple_mobile = data.product_purchase_multiple_mobile;
    this.instituteSettingDet.new_student_addmission_email_notification = data.new_student_addmission_email_notification;
    this.instituteSettingDet.new_student_addmission_sms_notification = data.new_student_addmission_sms_notification;
    this.instituteSettingDet.fee_dues_interval = data.fee_dues_interval;
    this.instituteSettingDet.pre_fee_dues_interval = data.pre_fee_dues_interval;
    this.instituteSettingDet.allow_fee_due_amount_in_notification = data.allow_fee_due_amount_in_notification;
    this.instituteSettingDet.due_date_in_fee_receipt = data.due_date_in_fee_receipt;
    this.instituteSettingDet.balance_amount_in_fee_receipt = data.balance_amount_in_fee_receipt;
    this.instituteSettingDet.show_counseller_name_in_fee_receipt = data.show_counseller_name_in_fee_receipt;
    this.instituteSettingDet.discount_amount_in_fee_receipt = data.discount_amount_in_fee_receipt;
    this.instituteSettingDet.user_registration_otp_via_sms = data.user_registration_otp_via_sms;
    this.instituteSettingDet.user_registration_otp_via_email = data.user_registration_otp_via_email;
    this.instituteSettingDet.enable_justDial_routing_report = data.enable_justDial_routing_report;
    this.instituteSettingDet.enable_teacher_for_multiple_class = data.enable_teacher_for_multiple_class;
    this.instituteSettingDet.enable_elearn_course_mapping_feature = data.enable_elearn_course_mapping_feature;
    this.instituteSettingDet.emailIds_for_justDail_ext_lead = data.emailIds_for_justDail_ext_lead;
    this.fillTimeInHrAndMinute(this.instituteSettingDet.alumni_birthday_daily_schedule, data.alumni_birthday_daily_schedule);

    this.fillTableCheckboxValue(this.instituteSettingDet.lib_send_sms_for_book_issued, data.lib_send_sms_for_book_issued);
    this.fillTableCheckboxValue(this.instituteSettingDet.lib_send_sms_for_book_returned, data.lib_send_sms_for_book_returned);
    this.fillTableCheckboxValue(this.instituteSettingDet.lib_send_sms_on_due_date, data.lib_send_sms_on_due_date);
    this.fillTableCheckboxValue(this.instituteSettingDet.lib_send_sms_pre_due_date, data.lib_send_sms_pre_due_date);
    this.fillTableCheckboxValue(this.instituteSettingDet.lib_send_sms_post_due_date, data.lib_send_sms_post_due_date);
    this.fillTableCheckboxValue(this.instituteSettingDet.lib_send_sms_for_book_marked_lost, data.lib_send_sms_for_book_marked_lost);
    this.fillTableCheckboxValue(this.instituteSettingDet.lib_send_sms_for_book_marked_scrapped, data.lib_send_sms_for_book_marked_scrapped);



    this.fillTableCheckboxValue(this.instituteSettingDet.enable_class_attendance_not_marked_notification, data.enable_class_attendance_not_marked_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.enable_exam_attendance_not_marked_notification, data.enable_exam_attendance_not_marked_notification)
    this.fillTableCheckboxValue(this.instituteSettingDet.enable_exam_marks_not_update_notification, data.enable_exam_marks_not_update_notification)
    this.fillTableCheckboxValue(this.instituteSettingDet.enable_exam_attendance_not_marked_daily_notification, data.enable_exam_attendance_not_marked_daily_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.enable_class_attendance_not_marked_daily_notification, data.enable_class_attendance_not_marked_daily_notification);

    this.fillTableCheckboxValue(this.instituteSettingDet.live_class_attendance_absent_notification, data.live_class_attendance_absent_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.live_class_attendance_partial_present_notification, data.live_class_attendance_partial_present_notification);
    this.fillTableCheckboxValue(this.instituteSettingDet.live_class_attendance_stat_notification, data.live_class_attendance_stat_notification);

    this.instituteSettingDet.live_class_attendance_notification = data.live_class_attendance_notification;
    this.instituteSettingDet.live_class_attendance_threshold = data.live_class_attendance_threshold;

    this.instituteSettingDet.lib_issue_for_days = data.lib_issue_for_days;
    this.instituteSettingDet.lib_due_date_fine_per_day = data.lib_due_date_fine_per_day;

    this.instituteSettingDet.enable_counsellor_number_to_enquirer_in_sms = data.enable_counsellor_number_to_enquirer_in_sms;

    this.instituteSettingDet.course_or_batch_expiry_notification = data.course_or_batch_expiry_notification;
    this.instituteSettingDet.course_or_batch_expiry_notification_before_no_days = data.course_or_batch_expiry_notification_before_no_days;
    this.instituteSettingDet.course_or_batch_expiry_notification_contact_no = data.course_or_batch_expiry_notification_contact_no;

    this.instituteSettingDet.enable_student_expiry_notification = data.enable_student_expiry_notification;
    this.setStudentNotificationKeys(this.instituteSettingDet.enable_student_expiry_notification);
    this.instituteSettingDet.student_expiry_notification_before_no_days = data.student_expiry_notification_before_no_days;
    this.instituteSettingDet.student_expiry_notification_contact_no = data.student_expiry_notification_contact_no;
    this.instituteSettingDet.first_sms_low_balance_threshold = data.first_sms_low_balance_threshold;
    this.instituteSettingDet.second_sms_low_balance_threshold = data.second_sms_low_balance_threshold;
    this.instituteSettingDet.sms_low_balance_alert_contact_number = (data.sms_low_balance_alert_contact_number == null || data.sms_low_balance_alert_contact_number == 'NULL') ? null : data.sms_low_balance_alert_contact_number;
    this.instituteSettingDet.jwt_secret_key = data.jwt_secret_key;

    this.instituteSettingDet.class_attendance_not_marked_notification_contact_number = data.class_attendance_not_marked_notification_contact_number;
    this.instituteSettingDet.class_attendance_not_marked_daily_notification_contact_number = data.class_attendance_not_marked_daily_notification_contact_number;
    this.instituteSettingDet.exam_attendance_not_marked_notification_contact_number = data.exam_attendance_not_marked_notification_contact_number;
    this.instituteSettingDet.exam_attendance_not_marked_daily_notification_contact_number = data.exam_attendance_not_marked_daily_notification_contact_number;
    this.instituteSettingDet.exam_marks_not_update_notification_contact_number = data.exam_marks_not_update_notification_contact_number;

    if (this.instituteSettingDet.class_attendance_not_marked_daily_notification_contact_number != '' && this.instituteSettingDet.class_attendance_not_marked_daily_notification_contact_number != null) {
      this.instituteSettingDet.enable_class_attendance_not_marked_daily_notification.other = true;
    }
    if (this.instituteSettingDet.class_attendance_not_marked_notification_contact_number != '' && this.instituteSettingDet.class_attendance_not_marked_notification_contact_number != null) {
      this.instituteSettingDet.enable_class_attendance_not_marked_notification.other = true;
    }
    if (this.instituteSettingDet.exam_attendance_not_marked_notification_contact_number != '' && this.instituteSettingDet.exam_attendance_not_marked_notification_contact_number != null) {
      this.instituteSettingDet.enable_exam_attendance_not_marked_notification.other = true;
    }
    if (this.instituteSettingDet.exam_attendance_not_marked_daily_notification_contact_number != '' && this.instituteSettingDet.exam_attendance_not_marked_daily_notification_contact_number != null) {
      this.instituteSettingDet.enable_exam_attendance_not_marked_daily_notification.other = true;
    }
    if (this.instituteSettingDet.exam_marks_not_update_notification_contact_number != '' && this.instituteSettingDet.exam_marks_not_update_notification_contact_number != null) {
      this.instituteSettingDet.enable_exam_marks_not_update_notification.other = true;
    }
    this.instituteSettingDet.vat_percentage = data.cgst + data.sgst;
    this.instituteSettingDet.enable_send__website_url_in_student_credentail = data.enable_send__website_url_in_student_credentail;
    this.instituteSettingDet.student_study_material_visibility = data.student_study_material_visibility;
    this.instituteSettingDet.notification_for_studymaterial_upload = data.notification_for_studymaterial_upload;
    this.instituteSettingDet.enable_student_app_offline_video_download = data.enable_student_app_offline_video_download;
    this.instituteSettingDet.vdocipher_video_ready_sms_to_admin = data.vdocipher_video_ready_sms_to_admin;
    if (this.instituteSettingDet.virtual_host_url == '' && this.instituteSettingDet.enable_send__website_url_in_student_credentail == 1) {
      this.instituteSettingDet.virtual_host_url = 'web.proctur.com';
    }
  }


  fillTimeInHrAndMinute(dataJson, res) {
    if (res) {
      let time = res.split(':');
      dataJson.hour = time[0] + " " + time[1].split(' ')[1];
      dataJson.minute = time[1].split(' ')[0];
    }

  }
  // notification for student expiry and its cases --> created by Anushka
  setStudentNotificationKeys(key) {
    if (key == 2) { //student
      this.student_expiry_notifctn = true;
      this.others_expiry_notifctn = false;
    }
    else if (key == 16) { //others
      this.student_expiry_notifctn = false;
      this.others_expiry_notifctn = true;

    }
    else if (key == 18) { //both
      this.student_expiry_notifctn = true;
      this.others_expiry_notifctn = true;
    }
    else if (key == 0) {
      this.student_expiry_notifctn = false;
      this.others_expiry_notifctn = false;
    }
    this.instituteSettingDet.enable_student_expiry_notification = key;
  }


  checkDropDownSelection(data) {
    if (data == "-1") {
      this.commonService.showErrorMessage('error', '', 'You have selected wrong option in DropDown')
      return false;
    } else {
      return true;
    }
  }

  convertBoolenToNumber(data) {
    if (data) {
      return 1;
    } else {
      return 0;
    }
  }

  getSumOfTableField(data) {
    let total: number = 0;
    for (let i = 0; i < Object.keys(data).length; i++) {
      if (Object.keys(data)[i] == 'student' && data.student == true) {
        total = total + 2;
      } else if (Object.keys(data)[i] == 'parent' && data.parent == true) {
        total = total + 4;
      } else if (Object.keys(data)[i] == 'gaurdian' && data.gaurdian == true) {
        total = total + 32;
      } else if (Object.keys(data)[i] == 'teacher' && data.teacher == true) {
        total = total + 8;
      } else if (Object.keys(data)[i] == 'admin' && data.admin == true) {
        total = total + 16;
      }
    }
    return total;
  }

  getSumOfTableFieldForReport(data) {
    let total: number = 0;
    for (let i = 0; i < Object.keys(data).length; i++) {
      if (Object.keys(data)[i] == 'enquiry' && data.enquiry == true) {
        total = total + 8;
      }
      else if (Object.keys(data)[i] == 'admissions' && data.admissions == true) {
        total = total + 2;
      }
      else if (Object.keys(data)[i] == 'fees' && data.fees == true) {
        total = total + 4;
      }
    }
    return total;
  }
  fillSummaryReport(key) {
    // this.instituteSettingDet.summaryReportDownloadOptions
    if (key == 8) { //student
      this.reportFor.enquiry = true;
    }
    else if (key == 2) { //student
      this.reportFor.admissions = true;
    }
    else if (key == 4) { //student
      this.reportFor.fees = true;
    }
    else if (key == 10) { //others
      this.reportFor.enquiry = true;
      this.reportFor.admissions = true;
    }
    else if (key == 6) { //both
      this.reportFor.admissions = true;
      this.reportFor.fees = true;
    }
    else if (key == 12) { //both
      this.reportFor.enquiry = true;
      this.reportFor.fees = true;
    }
    else if (key == 14) { //both
      this.reportFor.enquiry = true;
      this.reportFor.fees = true;
      this.reportFor.admissions = true;
    }
  }
  enableRankSpecifier() {
    let data = document.getElementById('enableRank').checked;
    if (data) {
      document.getElementById('inputSpecifyRank').removeAttribute('readonly');
    } else {
      document.getElementById('inputSpecifyRank').setAttribute('readonly', true);
    }
  }



  fillTableCheckboxValue(dataJSON, res) {
    // console.log(res);
    if (res) {
      res = parseInt(res);
      if (res > 0) {
        let count: number = 1;
        let i: number = 2;
        while (i != res) {
          i = i + 2;
          count++;
        }
        let binaryConversion = count.toString(2);
        let binaryArray: number[] = [0, 0, 0, 0, 0];
        let k = 0;
        for (let p = binaryConversion.length - 1; p >= 0; p--) {
          binaryArray[k] = parseInt(binaryConversion[p]);
          k++;
        }

        if (dataJSON.hasOwnProperty('student')) {
          if (binaryArray[0] == 1) {
            dataJSON.student = true;
          } else {
            dataJSON.student = false;
          }
        }

        if (dataJSON.hasOwnProperty('parent')) {
          if (binaryArray[1] == 1) {
            dataJSON.parent = true;
          } else {
            dataJSON.parent = false;
          }
        }

        if (dataJSON.hasOwnProperty('teacher')) {
          if (binaryArray[2] == 1) {
            dataJSON.teacher = true;
          } else {
            dataJSON.teacher = false;
          }
        }

        if (dataJSON.hasOwnProperty('admin')) {
          if (binaryArray[3] == 1) {
            dataJSON.admin = true;
          } else {
            dataJSON.admin = false;
          }
        }

        if (dataJSON.hasOwnProperty('gaurdian')) {
          if (binaryArray[4] == 1) {
            dataJSON.gaurdian = true;
          } else {
            dataJSON.gaurdian = false;
          }
        }

      }
    }

  }


  validatePhoneNumber(data) {
    let check: boolean = false;
    if (data) {
      let number: any = data.split(',');
      for (let i = 0; i < data.length; i++) {
        if (data[i] != "" && data[i] != null) {
          if (!isNaN(data[i]) || data[i].length != 10) {
            check = false;
            console.log(check);
            break;
          } else {
            check = true;
          }
        }
      }
      return check;
    } else {
      return true;
    }
  }


  checkInstitutionType() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInst = true;
        } else {
          this.isLangInst = false;
        }
      }
    )
  }
  calculateCGSTAndSGSTFromVat(data) {
    if (this.instituteTaxType == 'Vat') {
      data.cgst = Math.floor(this.instituteSettingDet.vat_percentage / 2);
      data.sgst = this.instituteSettingDet.vat_percentage - data.cgst;
    }
    }

  saveIPDetails() {
    if (this.validateIp()) {
      this.auth.showLoader();
      this.httpService.postData('/api/v2/ipAddress/create', this.IPJson).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.msgSrvc.showErrorMessage('success', '', res.message);
          this.getIPAllDetails();
          this.IPJson = {
            ip_address: '',
            floor_details: '',
            description: '',
            'institute_id': sessionStorage.getItem('institute_id'),
          };
        },
        err => {
          this.auth.hideLoader();
          this.msgSrvc.showErrorMessage('error', '', err.error.message);
        }
      );
    } else {
      this.msgSrvc.showErrorMessage('info', '', 'Please enter valid IP Address');
    }
  }

  validateIp() {
    const regExPattern = /^[0-9]+(.[0-9]+)*$/;
    if ((this.IPJson.ip_address.trim() == '') || !(regExPattern.test(this.IPJson.ip_address.trim()))) {
      return false;
    } else {
      return true;
    }
  }

  getIPAllDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v2/ipAddress/getAll/' + sessionStorage.getItem('institute_id')).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.IPDetails = res.result;
      },
      err => {
        this.auth.hideLoader();
        this.msgSrvc.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  updateIp(obj) {
    console.log(obj);
    this.auth.showLoader();
    this.httpService.putData('/api/v2/ipAddress/update', obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgSrvc.showErrorMessage('success', '', res.message);
        this.getIPAllDetails();
      },
      err => {
        this.auth.hideLoader();
        this.msgSrvc.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  deleteIp(id) {
    if (confirm('Do you really want to delete?')) {
      this.auth.showLoader();
      this.httpService.deleteData('/api/v2/ipAddress/delete/' + sessionStorage.getItem('institute_id') + '/' + id, '').subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.msgSrvc.showErrorMessage('success', '', res.message);
          this.getIPAllDetails();
        },
        err => {
          this.auth.hideLoader();
          this.msgSrvc.showErrorMessage('error', '', err.error.message);
        }
      );
    }
  }

  editIP(id) {
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
    this.getIPAllDetails();
  }

  getIP() {
    this.apiService.getIPAddress().subscribe(
      (res: any) => {
        this.ipAddress = res.ip;
      });
  }

}
