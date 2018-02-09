import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { LoginService } from '../../services/login-services/login.service';
import { InstituteSettingService } from '../../services/institute-setting-service/institute-setting-service';
import { document } from '../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';

@Component({
  selector: 'app-institute-settings',
  templateUrl: './institute-settings.component.html',
  styleUrls: ['./institute-settings.component.scss']
})
export class InstituteSettingsComponent implements OnInit {


  isRippleLoad: boolean = false;
  isLangInst: boolean = false;
  instituteSettingDet: any = {
    sms_notification: '',
    email_notification: '',
    sms_status_report: '',
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
    },
    fee_dues_daily_notification: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    fee_dues_interval_notification: {
      student: '',
      parent: '',
      gaurdian: '',
    },
    pre_fee_dues_interval_notification: {
      student: '',
      parent: '',
      gaurdian: '',
    },
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
      admin: '',
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
    },
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
    emailids_for_report: '',
    enable_online_payment_email_notification: '',
    enable_online_payment_sms_notification: '',
    online_payment_notify_emailIds: '',
    online_payment_notify_mobiles: ''
  };

  constructor(
    private appC: AppComponent,
    private login: LoginService,
    private apiService: InstituteSettingService
  ) {
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  ngOnInit() {
    this.changeView('divSMSContent');
    this.checkInstitutionType();
    this.getSettingFromServer();
  }


  changeView(showView) {
    document.getElementById('divSMSContent').classList.add('hideDivClass');
    document.getElementById('divExamReport').classList.add('hideDivClass');
    document.getElementById('divFeeContent').classList.add('hideDivClass');
    document.getElementById('divReportContent').classList.add('hideDivClass');
    document.getElementById('divMiscContent').classList.add('hideDivClass');
    document.getElementById(showView).classList.remove('hideDivClass');
  }


  getSettingFromServer() {
    this.isRippleLoad = true;
    this.apiService.getInstituteSettingFromServer().subscribe(
      res => {
        this.isRippleLoad = false;
        console.log(res);
        this.fillJSONData(res);
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  saveAllSettings() {
    let dataToSend: any = {};
    dataToSend = this.constructJsonToSend();
    console.log(dataToSend);
    this.isRippleLoad = true;
    this.apiService.saveSettingsToServer(dataToSend).subscribe(
      res => {
        this.isRippleLoad = false;
        console.log(res);
        this.messageToast('success', 'Saved', "All your setting saved successfully");
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  cancelAllSettings() {
    this.getSettingFromServer();
  }

  constructJsonToSend() {
    let obj: any = Object.assign({}, this.instituteSettingDet);
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
    obj.absent_attendance_in_a_month_threshold = this.convertBoolenToNumber(this.instituteSettingDet.absent_attendance_in_a_month_threshold);
    obj.gst_enabled = this.convertBoolenToNumber(this.instituteSettingDet.gst_enabled);
    obj.pdc_reminder_setting = this.convertBoolenToNumber(this.instituteSettingDet.pdc_reminder_setting);
    obj.pdc_reminder_setting = this.convertBoolenToNumber(this.instituteSettingDet.pdc_reminder_setting);
    obj.student_report_card_fee_module = this.convertBoolenToNumber(this.instituteSettingDet.student_report_card_fee_module);
    obj.tax_payable_on_reverse_charge_basis = this.convertBoolenToNumber(this.instituteSettingDet.tax_payable_on_reverse_charge_basis);
    obj.home_work_feature_enable = this.convertBoolenToNumber(this.instituteSettingDet.home_work_feature_enable);
    if (this.checkDropDownSelection(this.instituteSettingDet.pre_enquiry_follow_up_reminder_time) == false) {
      return;
    }
    if (this.checkDropDownSelection(this.instituteSettingDet.post_enquiry_follow_up_reminder_time) == false) {
      return;
    }
    obj.daily_account_summary = this.convertBoolenToNumber(this.instituteSettingDet.daily_account_summary);
    obj.allow_simple_registration = this.convertBoolenToNumber(this.instituteSettingDet.allow_simple_registration);
    obj.enable_online_payment_email_notification = this.convertBoolenToNumber(this.instituteSettingDet.enable_online_payment_email_notification);
    obj.enable_online_payment_sms_notification = this.convertBoolenToNumber(this.instituteSettingDet.enable_online_payment_sms_notification);
    return obj;
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
    this.instituteSettingDet.exam_min_marks = data.exam_min_marks;
    this.instituteSettingDet.exam_average_marks = data.exam_average_marks;
    this.instituteSettingDet.exam_max_marks = data.exam_max_marks;
    this.instituteSettingDet.exam_rank = data.exam_rank;
    this.instituteSettingDet.rank_to_send_for_marks_sms = data.rank_to_send_for_marks_sms;
    this.instituteSettingDet.rank_no_for_marks_sms = data.rank_no_for_marks_sms;
    this.enableRankSpecifier();
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
    this.instituteSettingDet.inst_enquiry_handler_no = data.inst_enquiry_handler_no;
    this.instituteSettingDet.pre_enquiry_follow_up_reminder_time = data.pre_enquiry_follow_up_reminder_time;
    this.instituteSettingDet.post_enquiry_follow_up_reminder_time = data.post_enquiry_follow_up_reminder_time;
    this.instituteSettingDet.allow_simple_registration = data.allow_simple_registration;
    this.instituteSettingDet.virtual_host_url = data.virtual_host_url;
    this.instituteSettingDet.daily_account_summary = data.daily_account_summary;
    this.instituteSettingDet.emailids_for_report = data.emailids_for_report;
    this.instituteSettingDet.enable_online_payment_email_notification = data.enable_online_payment_email_notification;
    this.instituteSettingDet.enable_online_payment_sms_notification = data.enable_online_payment_sms_notification;
    this.instituteSettingDet.online_payment_notify_emailIds = data.online_payment_notify_emailIds;
    this.instituteSettingDet.online_payment_notify_mobiles = data.online_payment_notify_mobiles;
  }

  checkDropDownSelection(data) {
    if (data == "-1") {
      this.messageToast('error', 'Error', 'You have selected wrong option in DropDown')
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
    debugger
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

  enableRankSpecifier() {
    this.instituteSettingDet.rank_to_send_for_marks_sms = document.getElementById('enableRank').checked;
    if (this.instituteSettingDet.rank_to_send_for_marks_sms) {
      document.getElementById('inputSpecifyRank').removeAttribute('readonly');
    } else {
      document.getElementById('inputSpecifyRank').setAttribute('readonly', true);
    }
  }

  fillTableCheckboxValue(dataJSON, res) {
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

  checkInstitutionType() {
    if (sessionStorage.getItem('institute_type') == "LANG") {
      this.isLangInst = true;
    } else {
      this.isLangInst = false;
    }
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

  messageToast(errorType, errorTitle, errorMeassage) {
    let data = {
      type: errorType,
      title: errorTitle,
      body: errorMeassage
    }
    this.appC.popToast(data);
  }

  /* Customiized click detection strategy */
  inputClickedCheck(ev) {
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });
        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
    }
  }

}
