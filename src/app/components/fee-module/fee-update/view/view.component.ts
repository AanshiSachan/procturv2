import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { CommonServiceFactory } from '../../../../services/common-service';
import * as moment from 'moment';
import { FetchStudentService } from '../../../../services/student-services/fetch-student.service';
import { StudentFeeService } from '../../../../components/student-module/student_fee.service';
import { PostStudentDataService } from '../../../../services/student-services/post-student-data.service';
import { ConfirmDialogModule } from 'primeng/primeng';
declare var $;


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  academicYrList: any = [];
  institute_id: string;
  student_id: number
  schoolModel: boolean = false;
  isProfessional: boolean;
  academic_yr_id: number = -1;
  stdFeeDataList: any = [];
  masterSelected: boolean = false;
  paymentModes: any = [];
  t_p_amount: number = 0;
  t_d_amount: number = 0;
  paymentPopUpJson: any = {
    immutable_amount: 0,
    paying_amount: 0,
    paid_date: moment().format('YYYY-MM-DD'),
    payment_mode: 'Cash',
    reference_no: '',
    remarks: "",
    receipt_no: '',
    update_reason: '',
    selectedPdcId: '',
    due_amount: 0,
    pdcSelectedForm: {
      bank_name: '',
      cheque_amount: 0,
      cheque_date: moment().format("YYYY-MM-DD"),
      cheque_no: '',
      pdc_cheque_id: ''
    },
    genPdcAck: false,
    sendPdcAck: false,
    genFeeRecipt: false,
    emailFeeRecipt: false
  };
  t_selected_install: number;
  chequePdcList: any = [];
  pdcAddForm: any = {
    bank_name: '',
    cheque_amount: '',
    cheque_date: '',
    cheque_id: 0,
    cheque_no: '',
    cheque_status: '',
    cheque_status_key: 0,
    clearing_date: '',
    institution_id: sessionStorage.getItem('institute_id'),
    student_id: 0,
    country_id: -1
  };
  isAllChequeSelected: boolean = false;
  countryDetails: any = [];
  newPdcArr: any = [];
  genPdcAck: boolean;
  sendPdcAck: boolean;
  discountInstallList: any = [];
  max_disc_apply: number = 0;
  discountReasonList: any = [];
  discountPopUpForm: any = {
    type: "1",
    value: 0,
    reason: "-1",
    discountAmount: 0
  };
  discHistoryList: any = [];
  isAddPDC: boolean;
  activeSession: any = '';
  pdcStatus: any[] = [{ data_key: '1', data_value: 'Pending' }, { data_key: '2', data_value: 'dishonoured' }];
  isTemplateLinkWithCourseAndStandard: boolean = false;
  currencySymbol: String = ""
  searchElement: any;
  sectionList: any[];
  standardSectionMap: any = [];
  courseList: any = [];
  masterCourseList: any = [];
  batchList: any = [];
  standardList: any = [];
  feeTypeList: any = [];
  addInstall: any = {
    acad_yr_id: -1,
    f_type_id: -1,
    f_amount: 0,
    d_date: moment().format('YYYY-MM-DD'),
    standard_id: -1,
    course_id: -1,
    master_course: '',
    subject_id: -1,
    f_schld_id: -1,
    immutable_due_date: ''
  }
  totalDiscountApplied: any;
  isDiscountRemove: boolean = false;
  paidInstallArr: any = [];
  student_country_id: number = -1;
  is_tax_enabled: boolean = false;
  isUpdateInstall: boolean = false;
  isUpdatePaidInstall: boolean = false;
  stdAssignedCorseList
  paymentMode: number = 0;
  isSelectedAllPaidInstall: boolean = false;
  isAddInstallClicked: boolean = false;
  isUpdatePaymentClicked: boolean = false;
  isApplyDiscClicked: boolean = false;
  isRemoveDiscClicked: boolean = false;
  isUpdateInstallClicked: boolean = false;
  fullDiscountInstallArr: any = [];


  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory,
    private fetchService: FetchStudentService,
    private feeService: StudentFeeService,
    private postService: PostStudentDataService,

  ) {
    this.institute_id = sessionStorage.getItem("institute_id");
    this.isTemplateLinkWithCourseAndStandard = sessionStorage.getItem("is_fee_struct_linked") == 'true'
    this.activeSession = 'History';
    this.is_tax_enabled = sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1';
  }

  ngOnInit(): void {
    this.schoolModel = this.auth.schoolModel.value;
    this.institute_id = sessionStorage.getItem("institute_id");
    this.route.params.subscribe(routeParams => {
      this.student_id = routeParams.std_id;
      this.fetchAcademicYearList();
    });
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
  }
  fetchAcademicYearList() {
    this.auth.showLoader();
    this.academicYrList = [];
    this.chequePdcList = [];
    this.discHistoryList = [];
    let url = "/api/v1/academicYear/all/" + this.institute_id;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.academicYrList = res;
        this.academic_yr_id = Number(sessionStorage.getItem('selected_acad_yr'));
        // this.fetchDefaultAY();
        this.fetchStdFeeData(this.academic_yr_id);
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');

      }
    )
  }
  fetchDefaultAY() {
    this.academic_yr_id = -1;
    if (this.academicYrList != null) {
      for (let data of this.academicYrList) {
        if (data.default_academic_year == 1) {
          this.academic_yr_id = data.inst_acad_year_id;
          break;
        }
      }
    }
  }
  fetchStdFeeData(academic_yr) {
    this.chequePdcList = [];
    this.discHistoryList = [];
    this.auth.showLoader();
    let url = "/api/v1/studentWise/fee/" + this.institute_id + "/students/" + this.student_id + "/" + academic_yr;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.stdFeeDataList = res.result;
        this.currencySymbol = this.stdFeeDataList.currency_code;
        this.student_country_id = this.stdFeeDataList.country_id;
        this.checkUncheckAll();
        this.academic_yr_id = academic_yr;
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        this.stdFeeDataList = [];
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');

      }
    )

  }
  checkUncheckAll() {
    this.paidInstallArr = [];
    this.fullDiscountInstallArr = [];
    for (var i = 0; i < this.stdFeeDataList.a_install_li.length; i++) {
      let data = this.stdFeeDataList.a_install_li[i];
      if (this.stdFeeDataList.a_install_li[i].p_status != 'Y') {
        this.stdFeeDataList.a_install_li[i].isSelected = this.masterSelected;
      } else {
        this.stdFeeDataList.a_install_li[i].isSelected = false;
        this.paidInstallArr.push(this.stdFeeDataList.a_install_li[i].f_schld_id)
      }
      if ((data.initial_amount + data.tax_amount) == data.disc_amount) {
        this.fullDiscountInstallArr.push(this.stdFeeDataList.a_install_li[i].f_schld_id);
      }
    }
  }
  openPaymentPopup() {
    if (this.validatePaymentPopup()) {
      this.isUpdatePaidInstall = false;
      $('#updateinstModal').modal('show');
      this.getPaymentModes();
    }
  }
  validatePaymentPopup() {
    this.flushPaymentPopUpData();
    let is_intall_not_selected = true;
    let t_amount: number = 0;
    let t_selected_install: number = 0;
    for (let data of this.stdFeeDataList.a_install_li) {
      if (data.isSelected) {
        is_intall_not_selected = false;
        t_amount += data.d_amount;
        t_selected_install++;
      }
      this.t_p_amount = t_amount;
      this.paymentPopUpJson.paying_amount = t_amount;
      this.paymentPopUpJson.immutable_amount = t_amount;
      this.t_selected_install = t_selected_install;
    }
    if (is_intall_not_selected) {
      this.commonService.showErrorMessage('info', '', 'Please select at least one installment!');
      return;
    }
    return true;
  }

  getPaymentModes() {
    this.http.getData('/api/v1/masterData/type/PAYMENT_MODES').subscribe(
      (res: any) => {
        console.log(res);
        this.paymentModes = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  doPayment() {
    this.auth.showLoader();
    this.isUpdatePaymentClicked = true;
    let is_valid_payment: boolean = this.feeService.validatePaymentDetailsV2(this.paymentPopUpJson);
    if (!is_valid_payment) {
      this.isUpdatePaymentClicked = false;
      this.auth.hideLoader();
      return;
    }
    let obj = this.preparedPaymentPayload();
    this.postService.payPartialFeeAmount(obj).subscribe(
      res => {
        // this.btnPayment.nativeElement.disabled = false;
        this.auth.hideLoader();
        this.commonService.showErrorMessage('success', '', 'Fee details has been updated');
        if (this.paymentPopUpJson.genFeeRecipt) {
          this.generateFeeRecipt(res);
        }
        if (this.paymentPopUpJson.emailFeeRecipt) {
          this.emailFeeReceipt(res);
        }
        this.flushPaymentPopUpData();
        this.fetchStdFeeData(this.academic_yr_id);
      },
      err => {
        // this.btnPayment.nativeElement.disabled = false;
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
    this.isUpdatePaymentClicked = false;
  }
  preparedPaymentPayload() {
    let obj = {
      chequeDetailsJson: {},
      paid_date: "",
      paymentMode: "",
      reference_no: "",
      remarks: "",
      studentFeeReportJsonList: [],
      student_id: this.student_id,
    };
    let seletectedInstall: any = [];
    for (let data of this.stdFeeDataList.a_install_li) {
      if (data.isSelected) {
        seletectedInstall.push(data);
      }
    }
    if (this.paymentPopUpJson.payment_mode == "Cheque/PDC/DD No." && this.paymentPopUpJson.pdcSelectedForm != '') {
      this.paymentPopUpJson.pdcSelectedForm.cheque_date = moment(this.paymentPopUpJson.pdcSelectedForm.cheque_date).format('YYYY-MM-DD');
      this.paymentPopUpJson.pdcSelectedForm.pdc_cheque_id = this.paymentPopUpJson.pdcSelectedForm.pdc_cheque_id;
      obj.chequeDetailsJson = this.paymentPopUpJson.pdcSelectedForm;
    } else {
      obj.chequeDetailsJson = {};
    }
    obj.paid_date = moment(this.paymentPopUpJson.paid_date).format('YYYY-MM-DD');
    obj.paymentMode = this.paymentPopUpJson.payment_mode;
    obj.reference_no = this.paymentPopUpJson.reference_no;
    obj.remarks = this.paymentPopUpJson.remarks;
    obj.studentFeeReportJsonList = this.makePaymentInstallList(seletectedInstall, this.paymentPopUpJson.paying_amount);
    return obj;

  }
  makePaymentInstallList(selectedinstallArray, t_paid_amount) {
    let install: any = [];
    selectedinstallArray = selectedinstallArray.sort((f, s) => {
      return f.install_no - s.install_no
    })

    selectedinstallArray.forEach(element => {
      if (t_paid_amount > 0) {
        let obj: any = {
          due_date: '',
          fee_schedule_id: '',
          paid_full: 'N',
          previous_balance_amt: 0,
          total_amt_paid: 0,
        };
        if (element.d_amount < t_paid_amount) {
          obj.previous_balance_amt = element.d_amount;
          obj.total_amt_paid = element.d_amount;
          obj.paid_full = 'Y';
          t_paid_amount = t_paid_amount - element.d_amount;
        }
        else if (element.d_amount > t_paid_amount) {
          obj.previous_balance_amt = element.d_amount;
          obj.total_amt_paid = t_paid_amount;
          obj.paid_full = "N";
          t_paid_amount = 0;
        }
        else if (element.d_amount == t_paid_amount) {
          obj.previous_balance_amt = element.d_amount;
          obj.total_amt_paid = t_paid_amount;
          obj.paid_full = 'Y';
          t_paid_amount = 0;
        }
        obj.due_date = moment(element.d_date).format('YYYY-MM-DD');
        obj.fee_schedule_id = element.f_schld_id;
        install.push(obj);
      }
    });
    console.log(install);
    return install;
  }
  getPdcChequeList(payment_mode) {
    this.chequePdcList = [];
    if (payment_mode == 'Cheque/PDC/DD No.') {
      let obj = {
        cheque_status: '',
        student_id: this.student_id,
        cheque_date_from: '',
        cheque_date_to: ''
      }
      this.auth.showLoader();
      // this.pdcAddForm.country_id = this.instituteCountryDetObj.id;
      let url = "/api/v1/student_cheque/getAll/" + this.institute_id + "/" + this.student_id
      this.http.postData(url, obj).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          let temp: any[] = [];
          res.forEach(el => {
            let obj = { bank_name: el.bank_name, cheque_amount: el.cheque_amount, cheque_date: el.cheque_date, cheque_date_from: el.cheque_date_from, cheque_date_to: el.cheque_date_from, cheque_id: el.cheque_id, cheque_no: el.cheque_no, cheque_status: el.cheque_status, cheque_status_key: el.cheque_status_key, clearing_date: el.clearing_date, genAck: el.genAck, institution_id: el.institution_id, sendAck: el.sendAck, student_id: el.student_id, student_name: el.student_name, student_phone: el.student_phone, isSelected: false, country_id: el.country_id };
            temp.push(obj);
          });
          this.chequePdcList = temp;
          if (this.chequePdcList.length == 0) {
            this.commonService.showErrorMessage('info', '', 'No cheque available!');
          }
        },
        err => {
          this.chequePdcList = [];
          this.commonService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }
  feePdcSelected(id) {
    let obj: any = {
      bank_name: '',
      cheque_amount: this.paymentPopUpJson.paying_amount,
      cheque_date: moment().format("YYYY-MM-DD"),
      cheque_no: '',
      pdc_cheque_id: ''
    };
    if (id === '') {
      this.paymentPopUpJson.pdcSelectedForm = obj;
      this.paymentPopUpJson.selectedPdcId = '';
    }
    else {
      this.chequePdcList.forEach(el => {
        if (id == el.cheque_id) {
          obj.bank_name = el.bank_name;
          obj.cheque_amount = el.cheque_amount;
          obj.cheque_date = moment(el.cheque_date).format("YYYY-MM-DD");
          obj.cheque_no = el.cheque_no;
          obj.pdc_cheque_id = el.cheque_id;
          this.paymentPopUpJson.pdcSelectedForm = obj;
          this.paymentPopUpJson.selectedPdcId = id;
          this.paymentPopUpJson.paying_amount = el.cheque_amount;
          obj.country_id = el.country_id;
          return;
        }
      });
    }
  }

  generateFeeRecipt(res) {
    this.fetchService.getFeeReceiptById(this.student_id, res.other).subscribe(
      (res: any) => {
        this.downloadDocument(res);
      },
      err => {
        this.commonService.showErrorMessage('error', '', err.error.message);
      });
  }

  emailFeeReceipt(res) {
    this.fetchService.emailReceiptById(this.student_id, res.other).subscribe(
      res => {
        this.commonService.showErrorMessage('success', '', 'Receipt has been sent to student/parent email ID');
      }
    )
  }

  downloadDocument(res) {
    let body = res;
    let byteArr = this.commonService.convertBase64ToArray(body.document);
    let fileName = body.docTitle;
    let file = new Blob([byteArr], { type: 'application/pdf' });
    let url = URL.createObjectURL(file);
    let link = document.getElementById("payMultiReciept");
    if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.click();
      link.setAttribute("href", "");
    }
  }
  flushPaymentPopUpData() {
    $('#updateinstModal').modal('hide');
    this.paymentPopUpJson = {
      immutableAmount: 0,
      paying_amount: 0,
      paid_date: moment().format('YYYY-MM-DD'),
      payment_mode: 'Cash',
      reference_no: '',
      remarks: "",
      selectedPdcId: '',
      pdcSelectedForm: {
        bank_name: '',
        cheque_amount: 0,
        cheque_date: moment().format("YYYY-MM-DD"),
        cheque_no: '',
        pdc_cheque_id: ''
      },
      genFeeRecipt: false,
      emailFeeRecipt: false
    }
    // this.isFeePaymentUpdate = false;
  }
  isOverdue(due_date): boolean {
    return due_date < moment().format("YYYY-MM-DD");
  }
  fetchCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
      this.pdcAddForm.country_id = this.student_country_id;

    }
  }
  addCheque() {
    this.newPdcArr = [];
    let obj = {
      bank_name: this.pdcAddForm.bank_name,
      cheque_amount: this.pdcAddForm.cheque_amount,
      cheque_date: moment(this.pdcAddForm.cheque_date).format("YYYY-MM-DD"),
      cheque_id: this.pdcAddForm.cheque_id,
      cheque_no: this.pdcAddForm.cheque_no,
      cheque_status: this.pdcAddForm.cheque_status,
      cheque_status_key: this.pdcAddForm.cheque_status_key,
      clearing_date: moment(this.pdcAddForm.clearing_date).format("YYYY-MM-DD"),
      institution_id: sessionStorage.getItem('institute_id'),
      student_id: this.student_id,
      country_id: this.pdcAddForm.country_id
    };
    if (this.validPdc(obj)) {
      this.newPdcArr.push(obj);
      this.addPdcDataToServer();
    }
  }

  addPdcDataToServer() {
    let temp: any[] = [];
    this.newPdcArr.forEach(e => {
      let obj = { cheque_no: e.cheque_no, bank_name: e.bank_name, cheque_date: e.cheque_date, student_id: this.student_id, clearing_date: e.clearing_date, institution_id: sessionStorage.getItem('institute_id'), cheque_amount: e.cheque_amount, genAck: this.genPdcAck === true ? "Y" : "N", sendAck: this.sendPdcAck === true ? "Y" : "N", country_id: e.country_id };
      temp.push(obj);
    });
    this.newPdcArr = [];
    this.genPdcAck = false;
    this.sendPdcAck = false;
    this.auth.showLoader();
    this.postService.addChequePdc(temp).subscribe(
      res => {
        this.auth.hideLoader();
        this.chequePdcList = [];
        this.newPdcArr = [];
        this.pdcAddForm = { bank_name: '', cheque_amount: '', cheque_date: '', cheque_id: 0, cheque_no: '', cheque_status: '', cheque_status_key: 0, clearing_date: '', institution_id: sessionStorage.getItem('institute_id'), student_id: 0, country_id: '' };
        this.getPdcChequeList('Cheque/PDC/DD No.');
        $('#chequeModal').modal('hide');

      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', err.error.message, '');
        this.chequePdcList = [];
        this.getPdcChequeList('Cheque/PDC/DD No.');
      }
    )

  }
  validPdc(obj): boolean {
    if (obj.cheque_date == 'Invalid date' || obj.cheque_date == '' || obj.cheque_no.toString().length != 6 || obj.cheque_amount <= 0) {
      if (obj.cheque_date == 'Invalid date' || obj.cheque_date == '') {
        this.commonService.showErrorMessage('error', '', "Please enter a valid cheque date");
      }
      if (obj.cheque_no.toString().length != 6) {
        this.commonService.showErrorMessage('error', '', "Please enter a valid cheque number");
      }
      if (obj.cheque_amount <= 0) {
        this.commonService.showErrorMessage('error', '', "Please enter a valid amount");
      }
      return false;
    }
    else {
      return true;
    }
  }
  openDiscountPopup() {
    if (this.validateDiscountPopup()) {
      this.isDiscountRemove = false;
      this.clearDiscPopUpData();
      $('#discountInstallModel').modal('show');
      this.fetchDiscountReason();
    }

  }
  validateDiscountPopup() {
    this.discountInstallList = [];
    let is_intall_not_selected = true;
    let max_disc_apply: number = 0;
    for (let data of this.stdFeeDataList.a_install_li) {
      if (data.isSelected) {
        // if (data.f_type != "INSTALLMENT") {
        //   this.commonService.showErrorMessage('info', '', 'You can only apply discount on fee type Installment!');
        //   return;
        // }
        is_intall_not_selected = false;
        max_disc_apply += data.d_amount;
        this.discountInstallList.push(data);
      }
      this.max_disc_apply = max_disc_apply;
    }
    if (is_intall_not_selected) {
      this.commonService.showErrorMessage('info', '', 'Please select at least one installment!');
      return;
    }
    return true;
  }
  fetchDiscountReason() {
    this.auth.showLoader();
    let url = "/api/v1/discount/reason/master/all/" + this.institute_id;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.discountReasonList = res;
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', error.error.message);

      }
    )

  }
  onDiscountTypeChange(event) {
    this.discountPopUpForm.value = 0;
    this.discountPopUpForm.discountAmount = 0;
    if (this.discountPopUpForm.type == "3") {
      let val = 0;
      for (let data of this.discountInstallList) {
        val += this.isDiscountRemove?data.disc_amount:data.d_amount;
      }
      this.discountPopUpForm.value = val;
      this.discountPopUpForm.discountAmount = val;
    }
  }

  onDiscountAmountChange(event) {
    event = Number(event)
    if (event < 0) {
      this.commonService.showErrorMessage('error', '', 'Please enter valid discount amount!');
      this.discountPopUpForm.value = 0;
      this.discountPopUpForm.discountAmount = 0;
      return
    }
    if (this.discountPopUpForm.type == "2") {
      if (event > 100) {
        this.commonService.showErrorMessage('error', '', 'Please enter valid discount percentage');
        this.discountPopUpForm.value = 0;
        this.discountPopUpForm.discountAmount = 0;
        return;
      }
      this.discountPopUpForm.discountAmount = Math.floor(Number((this.stdFeeDataList.initial_amount * event) / 100));
    } else {
      this.discountPopUpForm.discountAmount = Number(this.discountPopUpForm.value);
    }
  }
  applyDiscount() {
    this.isApplyDiscClicked = true;
    this.auth.showLoader();
    let unpaidAmount = this.max_disc_apply;
    let isValid: boolean = this.feeService.checkDiscountValidations(this.discountPopUpForm, unpaidAmount, 'add');
    if (!isValid) {
      this.auth.hideLoader();
      this.isApplyDiscClicked = false;
      return false;
    }
    // Condition For discount satisfy now apply discount
    let discountInstllmentList = this.feeService.makeDiscountingJSONV2(this.discountInstallList, this.discountPopUpForm);
    if (!discountInstllmentList) {
      this.auth.hideLoader();
      this.isApplyDiscClicked = false;
      return false;
    }
    let jsonToSend: any = {
      student_id: this.student_id,
      discountInstllmentList: discountInstllmentList
    }
    this.feeService.addDiscountToStudent(jsonToSend).subscribe(
      res => {
        this.commonService.showErrorMessage('success', '', 'Discount applied successfully!');
        this.clearDiscPopUpData();
        this.fetchStdFeeData(this.academic_yr_id);
        this.getDiscountHistoryDetails();
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
    this.isApplyDiscClicked = false;
  }
  clearDiscPopUpData() {
    $('#discountInstallModel').modal('hide');
    this.discountPopUpForm = {
      type: "1",
      value: 0,
      reason: "-1",
      discountAmount: 0
    };
  }
  getDiscountHistoryDetails() {
    this.discHistoryList = [];
    if (this.academic_yr_id < 0) {
      this.commonService.showErrorMessage('info', '', 'Please select academic year!');
      return;
    }
    this.auth.showLoader();
    this.feeService.getDiscountHistoryV2(this.student_id, this.academic_yr_id).subscribe(
      (res: any) => {
        this.discHistoryList = res != null ? res.discountInstllmentList : this.discHistoryList;
        this.checkAnyInstallIsPaid();
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
  }
  checkAnyInstallIsPaid() {
    for (let data of this.discHistoryList) {
      if (this.paidInstallArr.includes(data.fee_schedule_id)) {
        data.is_paid = true;
      } else {
        data.is_paid = false;
      }
      if (this.fullDiscountInstallArr.includes(data.fee_schedule_id)) {
        data.is_paid = false;
      }
    }
  }
  addPDCPopUp() {
    this.isAddPDC = true;
    $('#chequeModal').modal('show');
    this.fetchCountryDetails();

  }
  deletePDC(data) {
    this.auth.showLoader();
    if (confirm("Are you sure,you want to delete the Cheque?")) {
      this.postService.deletePdcById(data.cheque_id).subscribe(
        res => {
          this.getPdcChequeList('Cheque/PDC/DD No.');
          this.auth.hideLoader();
        },
        err => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }
  editPDC(data) {
    this.isAddPDC = false;
    this.pdcAddForm = {
      bank_name: data.bank_name,
      cheque_amount: data.cheque_amount,
      cheque_date: moment(data.cheque_date,).format("YYYY-MM-DD"),
      cheque_id: data.cheque_id,
      cheque_no: data.cheque_no,
      cheque_status: data.cheque_status,
      cheque_status_key: data.cheque_status_key,
      clearing_date: '',
      institution_id: sessionStorage.getItem('institute_id'),
      student_id: this.student_id,
      country_id: data.country_id
    };
    $('#chequeModal').modal('show');

  }
  updateCheque() {
    this.auth.showLoader();
    let el = this.pdcAddForm;
    if (this.validPdc(el)) {
      let obj = { bank_name: el.bank_name, cheque_amount: el.cheque_amount, cheque_date: moment(el.cheque_date).format("YYYY-MM-DD"), cheque_id: el.cheque_id, cheque_no: el.cheque_no, cheque_status_key: el.cheque_status_key, clearing_date: moment(el.clearing_date).format("YYYY-MM-DD"), institution_id: sessionStorage.getItem('institute_id'), student_id: el.student_id, country_id: el.country_id };
      this.postService.updateFeeDetails(obj).subscribe(
        res => {
          this.auth.hideLoader();
          this.getPdcChequeList('Cheque/PDC/DD No.');
          $('#chequeModal').modal('hide');
        },
        err => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', err.error.message);
        }
      )
    }
  }
  closePDCPopUp() {
    $('#chequeModal').modal('hide');
    this.pdcAddForm = {
      bank_name: '',
      cheque_amount: '',
      cheque_date: '',
      cheque_id: 0,
      cheque_no: '',
      cheque_status: '',
      cheque_status_key: 0,
      clearing_date: '',
      institution_id: sessionStorage.getItem('institute_id'),
      student_id: 0,
      country_id: ''
    };
  }
  downloadFeeReceipt(receipt_no) {
    this.auth.showLoader();
    this.fetchService.getFeeReceiptById(this.student_id, receipt_no).subscribe(
      (res: any) => {
        this.downloadDocument(res);
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      });
  }
  generatePDCAck() {
    let selectedChqueId = this.getSelectedRow(this.chequePdcList);
    if (selectedChqueId.length > 0) {
      this.fetchPDCAcknowledge(selectedChqueId.join(','), this.student_id, 'undefined');
    }
    else {
      this.commonService.showErrorMessage('error', '', 'No PDC is selected!')
    }
  }

  sendPDCAckOverEmail() {
    let selectedChqueId = this.getSelectedRow(this.chequePdcList);
    if (selectedChqueId.length > 0) {
      this.fetchPDCAcknowledge(selectedChqueId.join(','), this.student_id, "Y");
    } else {
      this.commonService.showErrorMessage('error', 'No PDC is selected!', '')
    }
  }

  fetchPDCAcknowledge(cheque_id, student_id, key) {
    this.auth.showLoader();
    this.postService.generateAcknowledge(cheque_id, student_id, key).subscribe(
      res => {
        this.auth.hideLoader();
        if (key == 'Y') {
          this.commonService.showErrorMessage('success', '', 'Sent successfullly!');
        } else if (key == "undefined") {
          this.downloadDocument(res);
        }
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', err.error.message, '');
      }
    )
  }
  getSelectedRow(data) {
    const temp = [];
    if (data != null && data.length > 0) {
      data.filter(
        element => {
          if (element.isSelected) {
            temp.push(element.cheque_id)
          }
        }
      )
    }
    return temp;
  }
  selectAllChequeList() {
    if (this.chequePdcList != null) {
      for (let data of this.chequePdcList) {
        data.isSelected = this.isAllChequeSelected;
      }
    }
  }
  fetchFilterData() {
    if (this.schoolModel) {
      this.fetchStandardAndSection();
    } else if (!this.isProfessional) {
      this.fetchMCAndCourse();
    } else {
      this.fetchStandard();
    }
  }
  fetchStandard() {
    let url = "/api/v1/standards/standard-subject-list/" + this.institute_id + '?is_active=Y';
    this.auth.showLoader();
    this.http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.standardList = data.result;
      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }
  fetchBatch(standard_id) {
    let url = "/api/v1/batches/" + this.institute_id + "/standard/" + standard_id;
    this.auth.showLoader();
    this.http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.batchList = data.result;
      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }
  fetchMCAndCourse() {
    this.auth.showLoader();
    const url = "/api/v1/courseMaster/fetch/" + this.institute_id + "/all?isActiveNotExpire=Y";
    this.http.getData(url).subscribe(
      res => {
        this.masterCourseList = res;
        this.auth.hideLoader();
      },
      err => {
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');
        this.auth.hideLoader();
      }
    );
  }

  fetchCoursesList(master_course) {
    for (let data of this.masterCourseList) {
      if (data.master_course == master_course) {
        this.courseList = data.coursesList;
        return;
      }
    }
  }
  fetchStandardAndSection() {
    let url = "/api/v1/courseMaster/standard-section-list/" + this.institute_id;
    this.auth.showLoader();
    this.http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.standardSectionMap = data.result;
        this.addInstall.stnd_id = this.addInstall.stnd_id;
      },
      (error: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');
      }
    )
  }
  fetchSectionList(standard_id) {
    this.sectionList = [];
    for (let data of this.standardSectionMap) {
      if (data.standard_id == standard_id) {
        this.sectionList = data.section_list;
        break;
      }
    }
  }
  getInstituteFeeTypes() {
    this.auth.showLoader();
    let url = "/api/v1/batchFeeSched/feeType/" + this.institute_id;
    this.http.getData(url).subscribe(
      res => {
        this.auth.hideLoader();
        this.feeTypeList = res;
        this.addInstall.f_type_id = this.addInstall.f_type_id;

      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
  }
  openAddInstallmentPopup() {
    this.isAddInstallClicked = false;
    $('#installmentModal').modal('show');
    this.closeAddInstallPopup(true)
    this.isUpdateInstall = false;
    this.fetchFilterData();
    this.getInstituteFeeTypes();
    this.addInstall.acad_yr_id = this.academic_yr_id;
  }
  closeAddInstallPopup(isAdd) {
    if (!isAdd)
      $('#installmentModal').modal('hide');
    this.addInstall = {
      academic_yr_id: -1,
      f_type_id: -1,
      f_amount: 0,
      d_date: moment().format('YYYY-MM-DD'),
      standard_id: -1,
      course_id: -1,
      master_course: '',
      immutable_due_date: ''

    }
  }
  addNewInstall() {
    this.isAddInstallClicked = true;
    if (this.schoolModel)
      this.addInstall.standard_id = this.stdFeeDataList.stnd_id;
    if (this.validateInputDataForAddInstall(false)) {
      let obj: any = {
        d_date: moment(this.addInstall.d_date).format('YYYY-MM-DD'),
        t_amount: this.addInstall.f_amount,
        f_type_id: this.addInstall.f_type_id,
        ay_id: this.addInstall.acad_yr_id,
        inst_id: this.institute_id,
      }
      if (this.isTemplateLinkWithCourseAndStandard) {
        if (this.schoolModel) {
          obj.stnd_id = this.addInstall.standard_id;
        } else if (!this.schoolModel && !this.isProfessional) {
          obj.c_id = this.addInstall.course_id;
        }
        else if (this.isProfessional) {
          obj.sub_id = this.addInstall.course_id;
        }
      }
      let url = "/api/v1/studentWise/fee/add/installment/" + this.student_id;
      this.auth.showLoader();
      this.http.postData(url, obj).subscribe(
        (data: any) => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('success', '', "Installment added successfully!");
          this.fetchStdFeeData(this.academic_yr_id);
          this.closeAddInstallPopup(false);
        },
        (error: any) => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', error.error.message);
        }
      )
    }
    this.isAddInstallClicked = false;
  }
  validateInputDataForAddInstall(isUpdate) {
    if (this.addInstall.acad_yr_id <= 0) {
      this.commonService.showErrorMessage('info', '', 'Please select valid academic Yr!');
      return;
    }
    if (this.addInstall.f_type_id <= 0) {
      this.commonService.showErrorMessage('info', '', 'Please select valid fee type!');
      return;
    }
    if (this.addInstall.f_amount <= 0) {
      this.commonService.showErrorMessage('info', '', 'Please enter valid amount!');
      return;
    } if (!this.addInstall.d_date) {
      this.commonService.showErrorMessage('info', '', 'Please select valid due date!');
      return;
    }
    let username = sessionStorage.getItem('username');
    if (username != 'admin') {
      if (isUpdate) {
        if (!this.isFutureDate(this.addInstall.d_date, this.addInstall.immutable_due_date)) {
          this.commonService.showErrorMessage('info', '', 'Due date should be greater than or equal to current due date!');
          return;
        }
      } else {
        if (this.isPastDate(moment(this.addInstall.d_date).format("YYYY-MM-DD"))) {
          this.commonService.showErrorMessage('info', '', 'Due date should be greater than or equal to current date!');
          return;
        }
      }
    }
    if (this.isTemplateLinkWithCourseAndStandard) {
      if (this.schoolModel && this.addInstall.standard_id <= 0) {
        this.commonService.showErrorMessage('info', '', 'Please select valid standard');
        return;
      } else if (!this.schoolModel && !this.isProfessional && this.addInstall.course_id <= 0) {
        this.commonService.showErrorMessage('info', '', 'Please select valid course!');
        return;
      }
      else if (this.isProfessional && this.addInstall.subject_id <= 0) {
        this.commonService.showErrorMessage('info', '', 'Please select valid Batch!');
        return;
      }
    }
    return true;
  }
  isPastDate(due_date): boolean {
    return due_date < moment().format("YYYY-MM-DD");
  }
  isFutureDate(date1, date2): boolean {
    return moment(date1).format("YYYY-MM-DD") >= moment(date2).format("YYYY-MM-DD");
  }
  removeDiscountPopup(data) {
    this.isDiscountRemove = true;
    this.isRemoveDiscClicked = false;
    $('#discountInstallModel').modal('show');
    this.fetchDiscountReason();
    this.validateRemoveDiscountPopup(data.fee_schedule_id);
  }
  validateRemoveDiscountPopup(f_schld_id) {
    this.discountInstallList = [];
    for (let data of this.stdFeeDataList.a_install_li) {
      if (data.f_schld_id == f_schld_id) {
        this.discountInstallList.push(data);
        this.totalDiscountApplied = data.disc_amount;
        break;
      }
    }
  }
  removeDiscountAction() {
    this.isRemoveDiscClicked = true;
    this.auth.showLoader();
    if (this.discountPopUpForm.discountAmount > this.totalDiscountApplied) {
      this.commonService.showErrorMessage('error', '', 'Discount Amount should not be greater than discount given to student!');
      this.auth.hideLoader();
      this.isRemoveDiscClicked = false;
      return false;
    }
    let isValid: boolean = this.feeService.checkDiscountValidations(this.discountPopUpForm, this.totalDiscountApplied, 'remove');
    if (!isValid) {
      this.auth.hideLoader();
      this.isRemoveDiscClicked = false;
      return;
    }
    let installmentList = this.feeService.makeRemoveDiscountJsonV2(this.discountInstallList, this.discountPopUpForm);
    if (!installmentList) {
      this.auth.hideLoader();
      this.isRemoveDiscClicked = false;
      return;
    }
    let jsonToSend: any = {
      student_id: Number(this.student_id),
      discountInstllmentList: installmentList
    };
    this.feeService.addDiscountToStudent(jsonToSend).subscribe(
      res => {
        this.clearDiscPopUpData();
        this.commonService.showErrorMessage('success', '', 'Discount removed successfully!');
        this.fetchStdFeeData(this.academic_yr_id);
        this.getDiscountHistoryDetails();
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
    this.isRemoveDiscClicked = false;
  }
  editPaidInstall(data) {
    this.isUpdatePaidInstall = true;
    this.t_p_amount = data.p_amount;
    this.getPaymentModes();
    this.paymentPopUpJson = {
      immutable_amount: data.p_amount,
      paying_amount: data.p_amount,
      paid_date: moment(data.p_date).format('YYYY-MM-DD'),
      payment_mode: data.p_method,
      reference_no: '',
      remarks: data.p_remarks,
      receipt_no: data.f_rec_no,
      f_schld_id: data.f_schld_id,
      f_tx_id: data.f_tx_id,
      due_amount: this.getDueAmount(data.f_schld_id),
      selectedPdcId: '',
      pdcSelectedForm: {
        bank_name: '',
        cheque_amount: 0,
        cheque_date: moment().format("YYYY-MM-DD"),
        cheque_no: '',
        pdc_cheque_id: ''
      },
      genPdcAck: false,
      sendPdcAck: false,
      genFeeRecipt: false,
      emailFeeRecipt: false
    };
    this.t_d_amount = this.paymentPopUpJson.due_amount;
    $('#updateinstModal').modal('show');
  }
  updatePaidInstall(data) {
    this.auth.showLoader();
    let obj = {
      feeSchedule_TxLst: [{
        schedule_id: data.f_schld_id,
        payment_tx_id: data.f_tx_id,
        amount_paid: 0,
        balance_amount: 1721
      }],
      fee_receipt_update_reason: this.paymentPopUpJson,
      financial_year: data.financial_yr,
      invoice_no: data.f_rec_no,
      old_invoice_no: data.f_rec_no,
      paid_date: moment(this.paymentPopUpJson.paid_date).format("YYYY-MM-DD"),
      paymentMode: this.paymentPopUpJson.paid_date,
      reference_no: this.paymentPopUpJson.paid_date,
      remarks: this.paymentPopUpJson.paid_date,
      student_id: this.student_id
    }
    let url = "/api/v1/studentWise/fee/add/installment/" + this.student_id;
    this.http.postData(url, obj).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('success', '', "Installment added successfully!");
        this.fetchStdFeeData(this.academic_yr_id);
        this.closeAddInstallPopup(false);
      },
      (error: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', error.error.message);
      }
    )
  }
  editInstallPopUp(data) {
    this.isUpdateInstall
    this.isUpdateInstall = true;
    $('#installmentModal').modal('show');
    if (this.feeTypeList.length <= 0)
      this.getInstituteFeeTypes();
    this.addInstall = {
      acad_yr_id: this.academic_yr_id,
      f_type_id: data.f_type_id,
      f_amount: data.d_amount,
      d_date: moment(data.d_date).format('YYYY-MM-DD'),
      course_id: data.c_id,
      subject_id: data.sub_id,
      f_schld_id: data.f_schld_id,
      immutable_due_date: moment(data.d_date).format('YYYY-MM-DD')
    }
    if (this.isProfessional) {
      this.addInstall.course_id = data.sub_id;
    }
    if (this.schoolModel) {
      this.addInstall.standard_id = this.stdFeeDataList.stnd_id;
    }
  }
  updateInstall() {
    this.isUpdateInstallClicked = true;
    if (this.validateInputDataForAddInstall(true)) {
      let obj: any = {
        d_date: moment(this.addInstall.d_date).format('YYYY-MM-DD'),
        t_amount: this.addInstall.f_amount,
        f_type_id: this.addInstall.f_type_id,
        ay_id: this.addInstall.acad_yr_id,
        inst_id: this.institute_id,
        f_schld_id: this.addInstall.f_schld_id,
      }
      if (this.isTemplateLinkWithCourseAndStandard) {
        if (this.schoolModel) {
          obj.stnd_id = this.addInstall.standard_id
        } else if (!this.schoolModel && !this.isProfessional) {
          obj.c_id = this.addInstall.course_id;
        }
        else if (this.isProfessional) {
          obj.sub_id = this.addInstall.course_id;
        }
      }
      let url = "/api/v1/studentWise/fee/update/installment/" + this.student_id;
      this.auth.showLoader();
      this.http.putData(url, obj).subscribe(
        (data: any) => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('success', '', "Installment updated successfully!");
          this.fetchStdFeeData(this.academic_yr_id);
          this.closeAddInstallPopup(false);
        },
        (error: any) => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', error.error.message);
        }
      )
    }
    this.isUpdateInstallClicked = false;
  }
  deleteInstall(data) {
    let msg = "";
    if (data.p_amount > 0) {
      msg = "Do you want to delete this installment?\n\nNote:- This installment is partially paid. If you delete this installment then Amount Paid and Discount Applied Amount will not delete!";
    } else {
      msg = "Do you want to delete this installment?\n\nNote:- If you delete this installment then Discount applied on installment will also delete!";
    }
    if (confirm(msg)) {
      let obj: any = {}
      let url = "/api/v1/studentWise/fee/delete/installment/" + this.student_id + "/" + data.f_schld_id + "/" + this.academic_yr_id
      this.auth.showLoader();
      this.http.deleteData(url, obj).subscribe(
        (data: any) => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('success', '', "Installment deleted successfully!");
          this.fetchStdFeeData(this.academic_yr_id);
          this.getDiscountHistoryDetails();
        },
        (error: any) => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', error.error.message);
        }
      )
    }
  }
  getDueAmount(f_schld_id) {
    for (let data of this.stdFeeDataList.a_install_li) {
      if (data.f_schld_id == f_schld_id) {
        return data.d_amount;
      }
    }
  }
  closeShareFeeReceiptPopUp() {
    $('#sendModal').modal('hide');
  }

  checkSelectedInstallments() {
    let is_intall_not_selected = true;
    for (let data of this.stdFeeDataList.p_install_li) {
      if (data.isSelected) {
        is_intall_not_selected = false;
        break;
      }
    }
    if (is_intall_not_selected) {
      this.commonService.showErrorMessage('info', '', 'Please select at least one installment!');
      return;
    }
    $('#sendModal').modal('show');
  }

  studentFeeInstallment(userType) {
    let object = {
      student_ids: this.student_id,// string by ids common seperated
      institution_id: '',
      sendEmail: userType,
      academic_year_id: [String(this.academic_yr_id)]
    }
    object['user_role'] = this.paymentMode;
    this.auth.showLoader()
    this.postService.getFeeInstallments(object).subscribe((res: any) => {
      this.auth.hideLoader()
      if (userType == -1) {
        let byteArr = this.commonService.convertBase64ToArray(res.document);
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        const dwldLink = document.createElement('a');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      } else {
        $('#sendModal').modal('hide');
        this.commonService.showErrorMessage('success', '', 'fee installement send on your mail successfully');
      }
    },
      (err: any) => {
        this.auth.hideLoader()
        this.commonService.showErrorMessage('error', '', err.error.message);
      })
  }
  calFinalDueAmount(data) {
    if (data == '') {
      data = 0;
      this.paymentPopUpJson.paying_amount = 0;
    }
    if (data > this.t_p_amount) {
      this.commonService.showErrorMessage('info', '', "You can not increase paid amount!");
      return;
    }
    this.paymentPopUpJson.due_amount = this.t_d_amount + (this.t_p_amount - data);
  }
  selectAllPaidInstall() {
    for (var i = 0; i < this.stdFeeDataList.p_install_li.length; i++) {
      this.stdFeeDataList.p_install_li[i].isSelected = this.isSelectedAllPaidInstall;
    }
  }
}

