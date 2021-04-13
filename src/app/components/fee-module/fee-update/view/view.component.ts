import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { CommonServiceFactory } from '../../../../services/common-service';
import * as moment from 'moment';
import { FetchStudentService } from '../../../../services/student-services/fetch-student.service';
import { StudentFeeService } from '../../../../components/student-module/student_fee.service';
import { PostStudentDataService } from '../../../../services/student-services/post-student-data.service';
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
  paymentPopUpJson: any = {
    immutable_amount: 0,
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
    country_id: ''
  };
  selectAllChequeList: boolean = false;
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
  pdcStatus: any[] = [{ data_key: '1', data_value: 'Pending' }, { data_key: '2', data_value: 'dishonoured' }];
  isTemplateLinkWithCourseAndStandard: boolean=false;
  currencySymbol:String="INR"

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory,
    private fetchService: FetchStudentService,
    private feeService: StudentFeeService,
    private postService: PostStudentDataService,

  ) {
    this.student_id = +this.route.snapshot.paramMap.get('std_id');
    this.institute_id = sessionStorage.getItem("institute_id");
    this.isTemplateLinkWithCourseAndStandard = sessionStorage.getItem("is_fee_struct_linked")=='true'
    this.fetchAcademicYearList();

  }

  ngOnInit(): void {
    this.schoolModel = this.auth.schoolModel.value;
    this.institute_id = sessionStorage.getItem("institute_id");
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
    let url = "/api/v1/academicYear/all/" + this.institute_id;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.academicYrList = res;
        this.fetchDefaultAY();
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
    this.academic_yr_id = academic_yr;
    this.auth.showLoader();
    let url = "/api/v1/studentWise/fee/" + this.institute_id + "/students/" + this.student_id + "/" + academic_yr;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.stdFeeDataList = res.result;
        this.checkUncheckAll();
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
    for (var i = 0; i < this.stdFeeDataList.a_install_li.length; i++) {
      if (this.stdFeeDataList.a_install_li[i].p_status != 'Y') {
        this.stdFeeDataList.a_install_li[i].isSelected = this.masterSelected;
      } else {
        this.stdFeeDataList.a_install_li[i].isSelected = false;
      }
    }
  }
  openPaymentPopup() {
    if (this.validatePaymentPopup()) {
      $('#updateinstModal').modal('show');
      this.getPaymentModes();

    }
  }
  validatePaymentPopup() {
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
    debugger
    let is_valid_payment: boolean = this.feeService.validatePaymentDetailsV2(this.paymentPopUpJson);
    if (!is_valid_payment) {
      return;
    }
    let obj = this.preparedPaymentPayload();
    this.postService.payPartialFeeAmount(obj).subscribe(
      res => {
        // this.btnPayment.nativeElement.disabled = false;
        $('#updateinstModal').modal('hide');
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
  makePaymentForInstallment() {
    // let JsonToSendOnServer = this.feeService.makePaymentFinalJson(this.subjectWiseInstallmentArray, this.paymentPopUpJson);
    // JsonToSendOnServer.student_id = this.student_id;
    // console.log(JsonToSendOnServer);
    this.auth.showLoader();
    //this.btnPayment.nativeElement.disabled = true;
    let JsonToSendOnServer;
    this.postService.payPartialFeeAmount(JsonToSendOnServer).subscribe(
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
        //  this.flushDataAfterPayement();
        // this.updateStudentFeeDetails();
      },
      err => {
        // this.btnPayment.nativeElement.disabled = false;
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
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
      payingAmount: 0,
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
  fetchDataForCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
      let defacult_Country = this.countryDetails.filter((country) => {
        return country.is_default == 'Y';
      })
    }
  }
  addCheque() {
    debugger
    //console.log(this.pdcAddForm);
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
      $('#discountInstallModel').modal('show');
      this.fetchDiscountReason();
    }

  }
  validateDiscountPopup() {
    let is_intall_not_selected = true;
    let max_disc_apply: number = 0;
    for (let data of this.stdFeeDataList.a_install_li) {
      if (data.isSelected) {
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
      if (event >= 100) {
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
    // common validation on the bais of amount and reason id
    debugger;
    this.auth.showLoader();
    let unpaidAmount = this.max_disc_apply;
    let isValid: boolean = this.feeService.checkDiscountValidations(this.discountPopUpForm, unpaidAmount, 'add');
    if (!isValid) {
      this.auth.hideLoader();
      return false;
    }
    // Condition For discount satisfy now apply discount
    let jsonToSend: any = {
      student_id: this.student_id,
      discountInstllmentList: this.feeService.makeDiscountingJSONV2(this.discountInstallList, this.discountPopUpForm)
    }
    this.feeService.addDiscountToStudent(jsonToSend).subscribe(
      res => {
        this.commonService.showErrorMessage('success', '', 'Discount applied successfully!');
        $('#discountInstallModel').modal('hide');
        this.fetchStdFeeData(this.academic_yr_id);
        this.clearDiscPopUpData();
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
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
    this.feeService.getDiscountHistory(this.student_id).subscribe(
      (res: any) => {
        this.discHistoryList = res != null ? res.discountInstllmentList : this.discHistoryList;
      },
      err => {
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
  }
  addPDCPopUp() {
    this.isAddPDC = true;
    $('#chequeModal').modal('show');

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
    debugger
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
    debugger
    this.auth.showLoader();
    let el=this.pdcAddForm;
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
  closePDCPopUp(){
    $('#chequeModal').modal('hide');
    this.pdcAddForm= {
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
}
