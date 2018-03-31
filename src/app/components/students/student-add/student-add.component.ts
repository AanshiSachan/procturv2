import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import { StudentForm } from '../../../model/student-add-form';
import { StudentFeeStructure } from '../../../model/student-fee-structure';
import { SelectItem } from 'primeng/primeng';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Router, NavigationEnd } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { Subscription } from 'rxjs';
import { LoginService } from '../../../services/login-services/login.service';
import 'rxjs/Rx';
import 'rxjs/add/operator/filter';


@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss']
})
export class StudentAddComponent implements OnInit {

  isPartialPayment: boolean;
  userHasFees: boolean;
  closeFee: boolean;
  studentAddnMove: boolean;
  isPdcApply: boolean = false;
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
    student_id: 0
  }
  newPdcArr: any[] = [];
  pdcSelectedArr: any[] = [];
  pdcStatus: any[] = [];
  pdcSearchObj = {
    cheque_status: '-1',
    student_id: '',
    cheque_date_from: '',
    cheque_date_to: ''
  }

  pdcSelectedForPayment: any;

  pdcSelectedForm: any = {
    bank_name: '',
    cheque_amount: '',
    cheque_date: moment().format("YYYY-MM-DD"),
    cheque_no: '',
    pdc_cheque_id: ''
  }

  isPdcFeePaymentSelected: boolean = false;
  chequePdcList: any[] = [];

  private studentAddFormData: StudentForm = {
    student_name: "",
    student_sex: "",
    student_email: "",
    student_phone: "",
    student_curr_addr: "",
    dob: "",
    doj: moment().format('YYYY-MM-DD'),
    school_name: "-1",
    student_class: "",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    guardian_name: "",
    guardian_email: "",
    guardian_phone: "",
    is_active: "Y",
    institution_id: sessionStorage.getItem('institute_id'),
    assignedBatches: [],
    assignedBatchescademicYearArray: [""],
    fee_type: 0,
    fee_due_day: 0,
    batchJoiningDates: [],
    comments: "",
    photo: null,
    enquiry_id: "",
    student_disp_id: "",
    student_manual_username: null,
    social_medium: -1,
    attendance_device_id: "",
    religion: "",
    standard_id: "-1",
    subject_id: "-1",
    slot_id: null,
    language_inst_status: "admitted",
    stuCustomLi: []
  };

  formIsActive: boolean = true;
  isRippleLoad: boolean = false;
  private quickAddStudent: boolean = false; private additionalBasicDetails: boolean = false; private isAssignBatch: boolean = false; private isAcad: boolean = false;
  private isProfessional: boolean = false; private multiOpt: boolean = false; private isDuplicateStudent: boolean = false; private genPdcAck: boolean = false;
  private sendPdcAck: boolean = false; private instituteList: any[] = []; private standardList: any[] = []; private courseList: any[] = [];
  private batchList: any[] = []; private slots: any[] = []; private langStatus: any[] = []; private selectedSlots: any[] = [];
  private customComponents: any[] = []; private slotIdArr: any[] = []; private uploadedFiles: any[] = [];
  private assignedBatch: string = ""; private selectedSlotsString: string = ''; private selectedSlotsID: string = ''; private assignedBatchString: string = '';
  private userImageEncoded: string = ''; private busyPrefill: Subscription; private isConvertEnquiry: boolean = false; private isNewInstitute: boolean = true;
  private isNewInstituteEditor: boolean = false; private school: any[] = []; public removeImage: boolean = false; private userCustommizedFee: any[] = [];
  private isBasicActive: boolean = true; private isOtherActive: boolean = false; private isFeeActive: boolean = false; private isInventoryActive: boolean = false;
  private isConfigureFees: boolean = false; private feeTempSelected: any = ""; private isDiscountApplied: boolean = false;
  private discountReason: string = ''; private key: string = 'name'; private reverse: boolean = false; private allotInventoryArr: any[] = [];
  private taxEnableCheck: any = '1'; private isPaymentPdc: boolean = false; private otherFeeType: any[] = []; private instalmentTableData: any[] = [];
  private otherFeeTableData: any[] = []; private feeTemplateStore: any[] = []; private inventoryItemsArr: any[] = []; public containerWidth: any = "200px"
  public studentImage: string = ''; private isPaymentDetailsValid: boolean = false; private student_id: any = 0;
  private service_tax: number = 0; private totalFeePaid: number = 0; private paymentStatusArr: any[] = [];
  private isFeePaymentUpdate: boolean = false; private isDefineFees: boolean = false; private isFeeApplied: boolean = false; private isNewInstallment: boolean = false; private isDiscountApply: boolean = false;
  is_undo: string = "N"; isUpdateFeeAndExit: boolean = false; total_amt_tobe_paid:any = "";
  private addFeeInstallment: any = {
    amount_paid: '',
    amount_paid_inRs: null,
    balance_amount: 0,
    batch_id: 0,
    created_by: null,
    created_date: null,
    day_type: 0,
    days: 0,
    discount: 0,
    due_date: '',
    enquiry_counsellor_name: "",
    enquiry_id: 0,
    feeTypes: null,
    fee_date: null,
    fee_payment_edit_history: null,
    fee_type: null,
    fee_type_name: "INSTALLMENT",
    fee_type_tax_configured: 0,
    fees_amount: null,
    fineAmount: 0,
    fine_type: null,
    initial_fee_amount: 0,
    installment_no: null,
    installment_nos: "",
    invoice_no: 0,
    is_fee_receipt_generate: 0,
    is_paid: 0,
    is_referenced: "N",
    latest_due_date: "",
    onlinePaymentJson: null,
    paid_date: null,
    paid_full: "N",
    paymentDate: null,
    paymentMode: null,
    paymentModeAmountMap: null,
    payment_creation_date: null,
    payment_reference_id: 0,
    payment_status: 0,
    payment_tx_id: 0,
    pdc_cheque_id: -1,
    reference_no: null,
    remarks: null,
    scheduleType: null,
    schedule_id: 0,
    service_tax: 0,
    service_tax_applicable: "",
    student_category: "",
    student_disp_id: null,
    student_id: 0,
    student_name: null,
    student_phone: "",
    tax: 0,
    update_date: null,
    updated_by: null
  }
  private addFeeOther: any = {
    amount_paid: '',
    amount_paid_inRs: null,
    balance_amount: 0,
    batch_id: 0,
    created_by: null,
    created_date: null,
    day_type: 0,
    days: 0,
    discount: 0,
    due_date: moment().format("YYYY-MM-DD"),
    enquiry_counsellor_name: "",
    enquiry_id: 0,
    feeTypes: null,
    fee_date: null,
    fee_payment_edit_history: null,
    fee_type: null,
    fee_type_name: "",
    fee_type_tax_configured: 0,
    fees_amount: null,
    fineAmount: 0,
    fine_type: null,
    initial_fee_amount: 0,
    installment_no: null,
    installment_nos: "",
    invoice_no: 0,
    is_fee_receipt_generate: 0,
    is_paid: 0,
    is_referenced: "N",
    latest_due_date: "",
    onlinePaymentJson: null,
    paid_date: null,
    paid_full: "N",
    paymentDate: null,
    paymentMode: null,
    paymentModeAmountMap: null,
    payment_creation_date: null,
    payment_reference_id: 0,
    payment_status: 0,
    payment_tx_id: 0,
    pdc_cheque_id: -1,
    reference_no: null,
    remarks: null,
    scheduleType: null,
    schedule_id: 0,
    service_tax: null,
    service_tax_applicable: "",
    student_category: "",
    student_disp_id: null,
    student_id: 0,
    student_name: null,
    student_phone: "",
    tax: 0,
    update_date: null,
    updated_by: null
  }
  private feeStructureForm: any = {
    studentArray: ["-1"],
    template_effective_date: moment().format('YYYY-MM-DD')
  }
  private createInstitute = {
    instituteName: "",
    isActive: "Y"
  }
  private allocationForm: any = {
    alloted_units: "",
    item_id: "",
    student_id: 0,
    institution_id: sessionStorage.getItem('institute_id')
  }
  private feeTemplateById: StudentFeeStructure = {
    feeTypeMap: "",
    customFeeSchedules: [],
    registeredServiceTax: "",
    toCreate: "",
    studentArray: "",
    studentwise_total_fees_amount: "",
    studentwise_total_fees_balance_amount: "",
    studentwise_total_fees_amount_paid: "",
    studentwise_total_fees_discount: "",
    studentwise_fees_tax_applicable: "",
    no_of_installments: "",
    discount_fee_reason: "",
    template_name: "",
    template_id: "",
    template_effective_date: "",
    is_fee_schedule_created: "",
    is_fee_tx_done: "",
    is_undo: "",
    is_fee_other_inst_created: "",
    is_delete_other_fee_types: "",
    chequeDetailsJson: "",
    payment_mode: "",
    remarks: "",
    paid_date: "",
    is_cheque_details_required: "",
    reference_no: "",
    invoice_no: "",
    uiSelected: false
  }
  private discountApplyForm: any = {
    type: 'amount',
    value: null,
    reason: '',
    state: 'all'
  }

  totalFeeWithTax: number = 0;
  totalDicountAmount: number = 0;
  totalTaxAmount: number = 0;
  totalAmountPaid: number = 0;
  totalAmountDue: number = 0;
  totalPaidAmount: number = 0;

  
  partialPayObj: any = {
    chequeDetailsJson: {},
    paid_date: moment().format('YYYY-MM-DD'),
    paymentMode: "Cash",
    reference_no: '',
    remarks: "",
    studentFeeReportJsonList: [],
    student_id: this.student_id
  };

  studentFeeReportObj: any = {
    due_date: null,
    fee_schedule_id: 0,
    paid_full: "Y",
    previous_balance_amt: "",
    total_amt_paid: ""
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  constructor(
    private studentPrefillService: AddStudentPrefillService,
    private prefill: FetchprefilldataService,
    private postService: PostStudentDataService,
    private router: Router, private login: LoginService,
    private appC: AppComponent) {
    this.isRippleLoad = true
    this.getInstType();
    this.taxEnableCheck = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    //console.log(this.taxEnableCheck);
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  ngOnInit() {
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.busyPrefill = this.fetchPrefillFormData();
    if (this.isProfessional) {
      if (localStorage.getItem('studentPrefill') != null && localStorage.getItem('studentPrefill') != undefined) {
        this.busyPrefill = this.getSlots();
        this.busyPrefill = this.getlangStudentStatus();
        this.convertToStudentDetected();
      }
      this.busyPrefill = this.getSlots();
      this.busyPrefill = this.getlangStudentStatus();

      this.studentPrefillService.fetchBatchDetails().subscribe(data => {
        this.batchList = [];
        data.forEach(el => {
          let obj = {
            isSelected: false,
            data: el,
            assignDate: moment().format('YYYY-MM-DD')
          }
          this.batchList.push(obj);

        })
      });
    }
    else if (!this.isProfessional) {
      if (localStorage.getItem('studentPrefill') != null && localStorage.getItem('studentPrefill') != undefined) {
        this.busyPrefill = this.getSlots();
        this.busyPrefill = this.getlangStudentStatus();
        this.convertToStudentDetected();
      }
      this.isRippleLoad = true;
      this.studentPrefillService.fetchCourseMasterById(this.studentAddFormData.standard_id).subscribe(data => {
        this.batchList = [];
        data.coursesList.forEach(el => {
          let obj = {
            isSelected: false,
            data: el,
            assignDate: moment().format('YYYY-MM-DD')
          }
          this.batchList.push(obj);
        });
        this.isRippleLoad = false;
      });
    }
  }
  /* Navigate or check for submission */
  addStudentDataAndFetchFee(values: NgForm) {
    this.studentAddnMove = true;
    this.studentQuickAdder(values);
  }

  studentAddedGetFee(id) {
    this.isRippleLoad = true;
    this.studentPrefillService.fetchStudentFeeDetailById(id).subscribe(res => {
      if (res.customFeeSchedules != null) {
        this.isRippleLoad = false;
        this.allignStudentFeeView(res);
      }
      else if (res.customFeeSchedules == null) {
        this.isRippleLoad = false;

        this.feeTemplateById = {
          feeTypeMap: "",
          customFeeSchedules: [],
          registeredServiceTax: "",
          toCreate: "",
          studentArray: "",
          studentwise_total_fees_amount: "",
          studentwise_total_fees_balance_amount: "",
          studentwise_total_fees_amount_paid: "",
          studentwise_total_fees_discount: "",
          studentwise_fees_tax_applicable: "",
          no_of_installments: "",
          discount_fee_reason: "",
          template_name: "",
          template_id: "",
          template_effective_date: "",
          is_fee_schedule_created: "",
          is_fee_tx_done: "",
          is_undo: "",
          is_fee_other_inst_created: "",
          is_delete_other_fee_types: "",
          chequeDetailsJson: "",
          payment_mode: "Cash",
          remarks: "",
          paid_date: "",
          is_cheque_details_required: "",
          reference_no: "",
          invoice_no: "",
          uiSelected: false
        }
        this.navigateTo('feeDetails');
      }
    },
      err => {
        alert("error fetching student fees");
      });
  }

  allignStudentFeeView(data) {
    this.isPaymentDetailsValid = false;
    this.feeTemplateById = data;
    this.instalmentTableData = [];
    this.otherFeeTableData = [];
    this.totalFeePaid = 0;
    this.total_amt_tobe_paid = this.totalFeePaid;
    this.taxEnableCheck = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    this.isDefineFees = false;
    this.isFeeApplied = true;
    this.totalAmountPaid = data.studentwise_total_fees_amount;
    this.totalDicountAmount = data.studentwise_total_fees_discount;
    data.customFeeSchedules.forEach(el => {
      /* Taxes Here */
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        this.service_tax = data.registeredServiceTax;
        let tax = el.fees_amount - el.initial_fee_amount;
        this.totalTaxAmount += tax;
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        this.service_tax = 0;
        //let tax = el.fees_amount - el.initial_fee_amount;
        this.totalTaxAmount = 0;
      }
      if (el.is_referenced == "N") {
        this.totalAmountDue += el.fees_amount
      }
      else if (el.is_referenced == "Y") {
        this.totalPaidAmount += el.amount_paid;
      }
      this.totalFeeWithTax += parseInt(el.fees_amount);
      if (el.fee_type_name === "INSTALLMENT") {
        this.instalmentTableData.push(el);
      }
      else if (el.fee_type_name != "INSTALLMENT") {
        this.otherFeeTableData.push(el);
      }
    });
    this.totalFeeWithTax = this.totalFeeWithTax + this.totalDicountAmount;
    this.updateTableInstallment();
    this.createCustomFeeSchedule();
    this.navigateTo('feeDetails');
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getInstType() {
    let institute_type = sessionStorage.getItem('institute_type');
    if (institute_type == 'LANG') {
      this.isProfessional = true;
    }
    else {
      this.isAcad = true;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateMasterCourseList(id) {
    this.batchList = [];
    this.studentPrefillService.fetchCourseMasterById(id).subscribe(
      data => {
        data.coursesList.forEach(el => {
          let obj = {
            isSelected: false,
            data: el,
            assignDate: moment().format('YYYY-MM-DD')
          }
          this.batchList.push(obj);
        });
      },
      err => {
        let msg = {
          type: 'info',
          title: 'No Course Assigned For Standard',
          body: ''
        }
        this.appC.popToast(msg);
      });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to navigate through the Student Add Form on button Click Save/Submit*/
  navigateTo(text) {
    if (text === "studentForm") {
      if (this.student_id == 0 || this.student_id == null) {
        document.getElementById('li-one').classList.add('active');
        document.getElementById('li-two').classList.remove('active');
        document.getElementById('li-three').classList.remove('active');
        document.getElementById('li-four').classList.remove('active');
        this.isBasicActive = true;
        this.isOtherActive = false;
        this.isFeeActive = false;
        this.isInventoryActive = false;
      }
      else {
        let msg = {
          type: 'info',
          title: 'Student Details Already Saved',
          body: ''
        }
        this.appC.popToast(msg);
      }
    }
    else if (text === "kyc") {
      if (this.student_id == 0 || this.student_id == null) {
        document.getElementById('li-one').classList.remove('active');
        document.getElementById('li-two').classList.add('active');
        document.getElementById('li-three').classList.remove('active');
        document.getElementById('li-four').classList.remove('active');
        this.isBasicActive = false;
        this.isOtherActive = true;
        this.isFeeActive = false;
        this.isInventoryActive = false;
      }
      else {
        let msg = {
          type: 'info',
          title: 'Student Details Already Saved',
          body: ''
        }
        this.appC.popToast(msg);
      }
    }
    else if (text === "feeDetails") {
      if (this.student_id != 0 && this.student_id != null) {
        document.getElementById('li-one').classList.remove('active');
        document.getElementById('li-two').classList.remove('active');
        document.getElementById('li-three').classList.add('active');
        document.getElementById('li-four').classList.remove('active');
        this.isBasicActive = false;
        this.isOtherActive = false;
        this.isFeeActive = true;
        this.isInventoryActive = false;
      }
      else {
        let msg = {
          type: 'info',
          title: 'Student Details Not Saved',
          body: 'Please save the student details to allocate fee and inventory'
        }
        this.appC.popToast(msg);
      }
    }
    else if (text === "inventory") {
      if (this.student_id != 0 && this.student_id != null) {
        document.getElementById('li-one').classList.remove('active');
        document.getElementById('li-two').classList.remove('active');
        document.getElementById('li-three').classList.remove('active');
        document.getElementById('li-four').classList.add('active');
        this.isBasicActive = false;
        this.isOtherActive = false;
        this.isFeeActive = false;
        this.isInventoryActive = true;
      }
      else {
        let msg = {
          type: 'info',
          title: 'Student Details Not Saved',
          body: 'Please save the student details to allocate fee and inventory'
        }
        this.appC.popToast(msg);
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to navigate on icon click */
  switchToView(id) {

    switch (id) {
      case "studentForm-icon": {
        //console.log(id);
        this.navigateTo("studentForm");
        break;
      }
      case "kyc-icon": {
        //console.log(id);
        this.navigateTo("kyc");
        break;
      }
      case "feeDetails-icon": {
        //console.log(id);
        this.navigateTo("feeDetails");
        break;
      }
      case "inventory-icon": {
        //console.log(id);
        this.navigateTo("inventory");
        break;
      }
      default: {
        //console.log("some error has occured");
        this.navigateTo("studentForm");
        break;
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Fetch and store the prefill data to be displayed on dropdown menu */
  fetchPrefillFormData() {
    this.isRippleLoad = true;

    let inventory = this.studentPrefillService.fetchInventoryList().subscribe(
      data => {
        this.isRippleLoad = false;
        this.inventoryItemsArr = data;
      },
      err => {
        this.isRippleLoad = false;
      });

    //this.isRippleLoad = true;
    let institute = this.prefill.getSchoolDetails().subscribe(
      data => {
        this.instituteList = data;
      },
      err => {
        this.isRippleLoad = false;
      });

    this.getFeeStructue();

    let standard = this.prefill.getEnqStardards().subscribe(data => {
      this.standardList = data;
    });

    this.studentPrefillService.getChequeStatus().subscribe(
      data => {
        this.pdcStatus = data;
      }
    )

    if (inventory != null && institute != null && standard != null) {
      let customComp = this.studentPrefillService.fetchCustomComponent().subscribe(
        data => {
          console.log(data);
          data.forEach(el => {
            let obj = {
              data: el,
              id: el.component_id,
              is_required: el.is_required,
              is_searchable: el.is_searchable,
              label: el.label,
              prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
              selected: [],
              selectedString: '',
              type: el.type,
              value: el.enq_custom_value
            }
            if (el.type == 4) {
              obj = {
                data: el,
                id: el.component_id,
                is_required: el.is_required,
                is_searchable: el.is_searchable,
                label: el.label,
                prefilled_data: this.createPrefilledDataType4(el.prefilled_data.split(','), el.enq_custom_value.split(',')),
                selected: el.enq_custom_value.split(','),
                selectedString: el.enq_custom_value,
                type: el.type,
                value: el.enq_custom_value
              }
            }
            if (el.type == 2) {
              obj = {
                data: el,
                id: el.component_id,
                is_required: el.is_required,
                is_searchable: el.is_searchable,
                label: el.label,
                prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
                selected: [],
                selectedString: '',
                type: el.type,
                value: el.enq_custom_value == "" ? false : true,
              }
            }
            else if (el.type != 2 && el.type != 4) {
              obj = {
                data: el,
                id: el.component_id,
                is_required: el.is_required,
                is_searchable: el.is_searchable,
                label: el.label,
                prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
                selected: [],
                selectedString: '',
                type: el.type,
                value: el.enq_custom_value
              }
            }
            this.customComponents.push(obj);
          });
          this.isRippleLoad = false;
        },
        err => {
          this.isRippleLoad = false;
        }
      );

      //console.log(this.customComponents);
      return customComp;
    }

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  createPrefilledDataType4(dataArr: any[], selected: any[]): any[] {
    let customPrefilled: any[] = [];
    dataArr.forEach(el => {
      let obj = {
        data: el,
        checked: selected.includes(el)
      }
      customPrefilled.push(obj);
    });
    return customPrefilled;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  createPrefilledData(dataArr: any[]): any[] {
    let customPrefilled: any[] = [];
    dataArr.forEach(el => {
      let obj = {
        data: el,
        checked: false
      }
      customPrefilled.push(obj);
    });

    return customPrefilled;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to show/hide Addition Details Form section */
  toggleAdditionalBasicDetails() {
    this.additionalBasicDetails = !this.additionalBasicDetails;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Open batch assign popup */
  openAssignBatch() {
    this.isAssignBatch = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* close batch assign popup */
  closeBatchAssign() {
    this.isAssignBatch = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* align the user selected batch into input and update the data into array to be updated to server */
  assignBatch() {
    let batchString: any[] = [];
    this.studentAddFormData.assignedBatches = [];
    this.studentAddFormData.batchJoiningDates = [];
    this.studentAddFormData.assignedBatchescademicYearArray = [""];
    this.batchList.forEach(el => {
      if (el.isSelected) {
        if (this.isProfessional) {
          this.studentAddFormData.assignedBatches.push(el.data.batch_id.toString());
          this.studentAddFormData.batchJoiningDates.push(moment(el.assignDate).format('YYYY-MM-DD'));
          this.studentAddFormData.assignedBatchescademicYearArray.push("-1");
          batchString.push(el.data.batch_name);
        }
        else {
          this.studentAddFormData.assignedBatches.push(el.data.course_id.toString());
          this.studentAddFormData.batchJoiningDates.push(moment(el.assignDate).format('YYYY-MM-DD'));
          this.studentAddFormData.assignedBatchescademicYearArray.push("-1");
          batchString.push(el.data.course_name);
        }
      }
    });
    if (batchString.length != 0) {
      document.getElementById('assignCoursesParent').classList.add('has-value');
      this.assignedBatchString = batchString.join(',');
      this.closeBatchAssign();
    }
    else {
      this.closeBatchAssign();
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  formValidator(): boolean {
    if (this.studentAddFormData.student_name != "" && this.studentAddFormData.student_name != " "
      && this.studentAddFormData.student_phone != "" && this.studentAddFormData.student_phone != " "
      && this.studentAddFormData.student_phone.length == 10) {
      return true;
    }
    else {
      return false;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  studentQuickAdder(form: NgForm) {
    /* Both Form are Valid Else there seems to be an error on custom component */
    let isCustomComponentValid: boolean = this.customComponents.every(el => { return this.getCustomValid(el); });
    let formValid: boolean = this.formfullValidator();
    if (isCustomComponentValid && formValid) {
      //console.log("valid student generating Id Now");
      let customArr = [];
      this.customComponents.forEach(el => {
        /* Not Checkbox and value not empty */
        if (el.value != '' && el.type != 2) {
          let obj = {
            component_id: el.id,
            enq_custom_id: "0",
            enq_custom_value: el.value
          }
          customArr.push(obj);
        }
        /* Checkbox Custom Component */
        else if (el.type == 2) {
          if (el.value == "Y" || el.value == true) {
            let obj = {
              component_id: el.id,
              enq_custom_id: "0",
              enq_custom_value: "Y"
            }
            customArr.push(obj);
          }
          else if (el.value == "N" || el.value == false) {
            let obj = {
              component_id: el.id,
              enq_custom_id: "0",
              enq_custom_value: "N"
            }
            customArr.push(obj);
          }
        }
      });
      /* Get slot data and store on form */
      this.studentAddFormData.slot_id = this.selectedSlotsID;
      this.studentAddFormData.stuCustomLi = customArr;
      this.studentAddFormData.photo = this.studentImage;
      this.additionalBasicDetails = false;
      if (this.studentAddFormData.assignedBatches == null) {
        this.studentAddFormData.assignedBatchescademicYearArray = null;
      }
      if (this.studentAddFormData.assignedBatches != null) {
        this.studentAddFormData.assignedBatchescademicYearArray.reverse();
      }
      this.isRippleLoad = true;
      this.busyPrefill = this.postService.quickAddStudent(this.studentAddFormData).subscribe(
        res => {
          this.isRippleLoad = false;
          let statusCode = res.statusCode;
          if (statusCode == 200) {
            this.removeImage = true;
            this.student_id = res.generated_id;
            let msg = {
              type: 'success',
              title: 'Student Registered',
              body: 'Student details have been updated to database'
            }
            this.appC.popToast(msg);
            if (this.studentAddnMove) {
              this.studentAddedGetFee(res.generated_id);
            }
          }
          else if (statusCode == 2) {
            let alert = {
              type: 'error',
              title: 'Contact Number In Use',
              body: 'An enquiry with the same contact number seems to exist'
            }
            this.removeImage = true;
            this.appC.popToast(alert);
            this.isDuplicateContactOpen();
          }
        },
        err => {
          this.isRippleLoad = false;
          let alert = {
            type: 'error',
            title: 'Error Updating Student Details',
            body: ''
          }
          this.appC.popToast(alert);
        });
    }
    else {
      if (!isCustomComponentValid) {
        //console.log("invalid custom component");
        let alert = {
          type: 'error',
          title: 'Required Fields not filled',
          body: 'Please fill all the required fields on other details tab'
        }
        this.appC.popToast(alert);
      }
      else if (!formValid) {
        //console.log("invalid name number");
        let alert = {
          type: 'error',
          title: 'Personal Details Invalid/Incorrect',
          body: 'Please provide valid name and contact number on personal details tab'
        }
        this.appC.popToast(alert);
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  customComponentValid(): boolean {
    function isValid(el) {
      if (el.is_required == "Y" && el.value != '') {
        return true;
      }
      else if (el.is_required == "N") {
        return true;
      }
      else {
        return false;
      }
    }
    return this.customComponents.every(isValid)
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Customiized click detection strategy */
  inputClicked(ev) {

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

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getSlots() {
    return this.studentPrefillService.fetchSlots().subscribe(
      res => {
        res.forEach(el => {
          let obj = {
            label: el.slot_name,
            value: el,
            status: false
          }
          this.slots.push(obj);
        });
        // console.log(this.slots);
      },
      err => { }
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getlangStudentStatus() {
    return this.studentPrefillService.fetchLangStudentStatus().subscribe(
      res => {
        this.langStatus = res;
      },
      err => { }
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  multiselectVisible(elid) {
    let targetid = elid + "multi";
    if (elid != null && elid != '') {
      if (document.getElementById(targetid).classList.contains('hide')) {
        document.getElementById(targetid).classList.remove('hide');
      }
      else {
        document.getElementById(targetid).classList.add('hide');
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateSlotSelected(data) {
    /* slot checked */
    if (data.status) {
      this.slotIdArr.push(data.value.slot_id);
      this.selectedSlots.push(data.value.slot_name);
      if (this.selectedSlots.length != 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      this.selectedSlotsID = this.slotIdArr.join(',')
      this.selectedSlotsString = this.selectedSlots.join(',');
    }
    /* slot unchecked */
    else {
      if (this.selectedSlots.length != 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else if (this.selectedSlots.length == 0) {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      var index = this.selectedSlots.indexOf(data.value.slot_name);
      if (index > -1) {
        this.selectedSlots.splice(index, 1);
      }
      this.selectedSlotsString = this.selectedSlots.join(',');

      var index2 = this.slotIdArr.indexOf(data.value.slot_id);
      if (index2 > -1) {
        this.slotIdArr.splice(index, 1);
      }
      this.selectedSlotsID = this.slotIdArr.join(',');
    }

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateMultiSelect(data, id) {
    //debugger;
    this.customComponents.forEach(el => {
      if (el.id == id && el.type == 4) {
        el.prefilled_data.forEach(com => {
          //console.log(com);
          if (com.data == data.data) {
            /* Component checked */
            if (com.checked) {
              el.selected.push(com.data);
              if (el.selected.length != 0) {
                document.getElementById(id + 'wrapper').classList.add('has-value');
              }
              else {
                document.getElementById(id + 'wrapper').classList.remove('has-value');
              }
              el.selectedString = this.concatDataWithComma(el.selected);
              //el.value = el.selectedString;
            }
            /* Component unchecked */
            else {
              if (el.selected.length != 0) {
                document.getElementById(id + 'wrapper').classList.add('has-value');
              }
              else if (el.selected.length == 0) {
                document.getElementById(id + 'wrapper').classList.remove('has-value');
              }
              //console.log(com.selected);
              var index = el.selected.indexOf(data.data);
              if (index > -1) {
                el.selected.splice(index, 1);
              }
              el.selectedString = this.concatDataWithComma(el.selected);
              el.value = el.selectedString;
              /* var index2 = el.selected.indexOf(data.data);
                if (index2 > -1) {
                el.selected.splice(index, 1);
                }
                el.selectedString = el.selected.join(','); 
              */
            }
          }
        });
      }
    });

  }

  concatDataWithComma(data) {
    let test = "";
    if (data.length > 0) {
      for (let t = 0; t < data.length; t++) {
        if (data[t] !== "") {
          if (test != "") {
            test = test + "," + data[t];
          } else {
            test = test + data[t];
          }
        }
      }
    }
    return test;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  fetchCourseFromMaster(id) {

    if (id == null || id == '') {
      this.courseList = [];
    }
    else {
      this.studentPrefillService.fetchCourseList(id).subscribe(
        res => {
          this.courseList = res;
        }
      )
    }

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  isDuplicateContactOpen() {
    this.isDuplicateStudent = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  isDuplicateContactClose() {
    this.isDuplicateStudent = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  registerDuplicateStudent(form: NgForm) {
    this.postService.quickAddStudent(this.studentAddFormData).subscribe(
      res => {
        let statusCode = res.statusCode;
        if (statusCode == 200) {
          let alert = {
            type: 'success',
            title: 'Student Details Submitted Successfully',
            body: ''
          }
          this.appC.popToast(alert);

          form.reset();
          this.clearFormAndMove();
        }
        else {
          let alert = {
            type: 'error',
            title: 'Failed To Add Student',
            body: ''
          }
          this.appC.popToast(alert);
          this.isDuplicateContactClose();
        }
      },
      err => {
        console.log(err);
      }
    );

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  clearFormAndMove() {
    this.navigateTo('studentForm');
    this.studentAddFormData = {
      student_name: "",
      student_sex: "",
      student_email: "",
      student_phone: "",
      student_curr_addr: "",
      dob: "",
      doj: moment().format('YYYY-MM-DD'), // "2017-10-25",
      school_name: "-1", // "943",
      student_class: "", // "1269",
      parent_name: "",
      parent_email: "",
      parent_phone: "",
      guardian_name: "",
      guardian_email: "",
      guardian_phone: "",
      is_active: "Y", // "Y",
      institution_id: sessionStorage.getItem('institute_id'), // "100123",
      assignedBatches: [], // ["5660", "2447", "4163", "3067"],
      assignedBatchescademicYearArray: [""],
      fee_type: 0,
      fee_due_day: 0,
      batchJoiningDates: [], // ["2017-10-25", "2017-10-25", "2017-10-25", "2017-10-25"],
      comments: "",
      photo: null,
      enquiry_id: "",
      student_disp_id: "",
      student_manual_username: null,
      social_medium: -1,
      attendance_device_id: "",
      religion: "",
      standard_id: "-1",
      subject_id: "-1",
      slot_id: null,
      language_inst_status: null,
      stuCustomLi: []
    }
    this.removeImage = true;
    //document.getElementById('preview-img').src = '';
    this.fetchPrefillFormData();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  convertToStudentDetected() {
    this.isConvertEnquiry = true;
    let tempData = JSON.parse(localStorage.getItem('studentPrefill'));
    this.studentAddFormData.student_name = tempData.name;
    this.studentAddFormData.student_phone = tempData.phone;
    this.studentAddFormData.student_email = tempData.email;
    this.studentAddFormData.student_sex = tempData.gender;
    this.studentAddFormData.parent_name = tempData.parent_email;
    this.studentAddFormData.parent_phone = tempData.parent_name;
    this.studentAddFormData.parent_email = tempData.parent_phone;
    this.studentAddFormData.enquiry_id = tempData.enquiry_id;
    localStorage.removeItem('studentPrefill');
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  clearFormAndRoute(form: NgForm) {

    let previousUrl: string = '';
    this.studentAddFormData = {
      student_name: "",
      student_sex: "",
      student_email: "",
      student_phone: "",
      student_curr_addr: "",
      dob: "",
      doj: moment().format('YYYY-MM-DD'),
      school_name: "-1",
      student_class: "",
      parent_name: "",
      parent_email: "",
      parent_phone: "",
      guardian_name: "",
      guardian_email: "",
      guardian_phone: "",
      is_active: "Y",
      institution_id: sessionStorage.getItem('institute_id'),
      assignedBatches: [],
      assignedBatchescademicYearArray: [""],
      fee_type: 0,
      fee_due_day: 0,
      batchJoiningDates: [],
      comments: "",
      photo: null,
      enquiry_id: "",
      student_disp_id: "",
      student_manual_username: null,
      social_medium: -1,
      attendance_device_id: "",
      religion: "",
      standard_id: "-1",
      subject_id: "-1",
      slot_id: null,
      language_inst_status: null,
      stuCustomLi: []
    };
    form.reset();

    if (this.isConvertEnquiry) {
      this.router.navigate(['/enquiry']);
    }
    else {
      this.router.navigate(['/student']);
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  openInstituteAdder() {
    this.isNewInstituteEditor = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  closeInstituteAdder() {
    this.isNewInstituteEditor = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* close add new institute */
  closeAddInstitute() {
    this.isNewInstitute = false;
    document.getElementById('add-institute-icon').innerHTML = '+';
    this.createInstitute.instituteName = '';
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to add institute data to server */
  addInstituteData() {
    this.prefill.createNewInstitute(this.createInstitute).subscribe(el => {
      if (el.message === "OK") {
        this.prefill.getSchoolDetails().subscribe(
          data => {
            this.school = data;
            this.instituteList = this.school;
            this.instituteList.forEach(el => {
              el.edit = false;
            });

            this.closeAddInstitute();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Add Institute',
              body: 'There was an error processing your request'
            }
            this.appC.popToast(alert);
          }
        );
        // console.log("institute Added");
      }
      else {
        // console.log("Institute Name already exist!");
      }
    });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  fetchInstituteInfo() {
    this.prefill.getSchoolDetails().subscribe(
      data => {
        this.school = data;
        this.instituteList = this.school;
        this.instituteList.forEach(el => {
          el.edit = false;
        });
      },
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  editInstitute(id) {
    this.instituteList.forEach(el => {
      if (el.school_id == id) {
        el.edit = true;
      }
    });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  cancelEditInstitute(id) {
    this.fetchInstituteInfo();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateInstitute(id) {
    this.instituteList.forEach(el => {
      if (el.school_id == id) {
        this.postService.updateInstituteDetails(id, el).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'institute Name Update',
            }
            this.appC.popToast(alert);
            this.fetchInstituteInfo();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'We coudn\'t process your request',
              body: err.message
            }
            this.appC.popToast(alert);
            this.fetchInstituteInfo();
          }
        )
      }
    });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  deleteInstitute(id) {
    this.postService.deleteInstitute(id).subscribe(
      res => {
        let alert = {
          type: 'success',
          title: 'Institute Record Deleted',
          body: " The institute data has been removed from your account"
        }
        this.appC.popToast(alert);
        this.fetchInstituteInfo();
      },
      err => {
        let alert = {
          type: 'error',
          title: 'Your Delete Request Has Been Denied',
          body: "The requested institute is currently in use and cannot be deleted"
        }
        this.appC.popToast(alert);
        this.fetchInstituteInfo();
      }
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* toggle visibility of new institute form */
  toggleInstituteAdd() {

    let icon = document.getElementById('add-institute-icon').innerHTML;
    if (icon == '+') {
      this.isNewInstitute = true;
      document.getElementById('add-institute-icon').innerHTML = '-';
    }
    else if (icon == '-') {
      this.isNewInstitute = false;
      this.createInstitute.instituteName = '';
      document.getElementById('add-institute-icon').innerHTML = '+';
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  clearDateoJoining() {
    this.studentAddFormData.doj = ''
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateFormIsActive(ev) {
    if (ev) {
      this.studentAddFormData.is_active = "Y";
    }
    else {
      this.studentAddFormData.is_active = "N";
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  configureFees($event) {
    $event.preventDefault();
    this.isConfigureFees = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  applyConfiguredFees($event) {
    //debugger
    $event.preventDefault();
    this.isPaymentDetailsValid = false;
    this.feeTemplateById = {
      feeTypeMap: "",
      customFeeSchedules: [],
      registeredServiceTax: "",
      toCreate: "",
      studentArray: "",
      studentwise_total_fees_amount: "",
      studentwise_total_fees_balance_amount: "",
      studentwise_total_fees_amount_paid: "",
      studentwise_total_fees_discount: "",
      studentwise_fees_tax_applicable: "",
      no_of_installments: "",
      discount_fee_reason: "",
      template_name: "",
      template_id: "",
      template_effective_date: "",
      is_fee_schedule_created: "",
      is_fee_tx_done: "",
      is_undo: "",
      is_fee_other_inst_created: "",
      is_delete_other_fee_types: "",
      chequeDetailsJson: "",
      payment_mode: "Cash",
      remarks: "",
      paid_date: "",
      is_cheque_details_required: "",
      reference_no: "",
      invoice_no: "",
      uiSelected: false
    }
    this.instalmentTableData = [];
    this.otherFeeTableData = [];
    let dd = moment(this.feeStructureForm.template_effective_date).format('YYYY-MM-DD');
    /* success */
    if ((this.feeTempSelected != "" && this.feeTempSelected != null) && (dd != "" && dd != null && dd != "Invalid date")) {
      this.taxEnableCheck = sessionStorage.getItem('enable_tax_applicable_fee_installments');
      this.feeStructureForm.template_effective_date = dd;
      //console.log(this.feeTempSelected + "   " + this.feeStructureForm);
      this.studentPrefillService.getFeeStructureById(this.feeTempSelected, this.feeStructureForm).subscribe(
        res => {
          this.feeTemplateById = res;
          this.feeTemplateById.template_effective_date = this.feeStructureForm.template_effective_date;
          this.feeTemplateById.template_id = this.feeTempSelected;
          this.isDefineFees = true;
          this.isFeeApplied = true;
          if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
            this.service_tax = res.registeredServiceTax;
          }
          else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
            this.service_tax = 0;
          }
          res.customFeeSchedules.forEach(el => {
            /* Taxes Here */
            if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
              this.service_tax = res.registeredServiceTax;
              let tax = el.fees_amount - el.initial_fee_amount;
              this.totalTaxAmount += tax;
            }
            else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
              this.service_tax = 0;
              //let tax = el.fees_amount - el.initial_fee_amount;
              this.totalTaxAmount = 0;
            }
            if (el.is_referenced == "N") {
              this.totalAmountDue += el.fees_amount
            }
            else if (el.is_referenced == "Y") {
              this.totalPaidAmount += el.amount_paid;
            }
            this.totalFeeWithTax += parseInt(el.fees_amount);
            if (el.fee_type_name === "INSTALLMENT") {
              this.instalmentTableData.push(el);
            }
            else if (el.fee_type_name != "INSTALLMENT") {
              this.otherFeeTableData.push(el);
            }
          });
          this.totalFeeWithTax = this.totalFeeWithTax + this.totalDicountAmount;
          this.updateTableInstallment();
          this.closeConfigureFees();
        },
        err => {
          let msg = {
            type: 'error',
            title: 'Error',
            body: 'Please contact proctur support'
          }
          this.appC.popToast(msg);
        }
      );
    }
    /* fee id not found */
    else if ((this.feeTempSelected == "" || this.feeTempSelected == null)) {

      let msg = {
        type: 'error',
        title: 'No Template Selected',
        body: 'Please select a template from dropdown list'
      }
      this.appC.popToast(msg);

    }
    /* date invalid not selected */
    else if (dd == "" || dd == null || dd == "Invalid date") {
      let msg = {
        type: 'error',
        title: 'Invalid Date',
        body: 'Please provide a valid date'
      }
      this.appC.popToast(msg);
    }
    //this.studentPrefillService.getFeeStructureById(this.feeTempSelected, this.feeStructureForm);
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  paymentValueUpdate(bol, id) {
    if (bol) {
      this.feeTemplateById.customFeeSchedules[id].is_paid = 1;
      let value = this.feeTemplateById.customFeeSchedules[id].fees_amount;
      this.totalFeePaid += value;
    }
    else {
      this.feeTemplateById.customFeeSchedules[id].is_paid = 0;
      let value = this.feeTemplateById.customFeeSchedules[id].fees_amount;
      this.totalFeePaid -= value;
      if (this.totalFeePaid < 0) {
        this.totalFeePaid = 0;
        this.total_amt_tobe_paid = this.totalFeePaid;
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  clearEffectiveDate($event) {
    $event.preventDefault();
    this.feeStructureForm.template_effective_date = '';
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  closeConfigureFees() {
    //$event.preventDefault();
    this.isConfigureFees = false;
    this.feeStructureForm = {
      studentArray: ["-1"],
      template_effective_date: ""
    }
    this.feeTempSelected = "";
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getFeeStructue() {
    this.studentPrefillService.fetchAllFeeStructure().subscribe(
      res => {
        this.isRippleLoad = false;
        this.feeTemplateStore = res;
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  openPaymentDetails($event) {
    $event.preventDefault();
    this.feeTemplateById.paid_date = moment().format("YYYY-MM-DD");
    this.isFeePaymentUpdate = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  closePaymentDetails() {
    this.isFeePaymentUpdate = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  clearfeePaymentDate($event) {
    $event.preventDefault();
    this.feeTemplateById.paid_date = "";
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  validatePaymentDetails($event) {
    $event.preventDefault();
    /* Error */
    if (this.feeTemplateById.paid_date == "" && this.feeTemplateById.payment_mode == "") {
      let msg = {
        type: 'error',
        title: 'Payment Date and Mode Missing',
        body: 'Please fill in the payment date and mode of payment'
      }
      this.appC.popToast(msg);
    }
    /* Error */
    else if (this.feeTemplateById.paid_date != "" && this.feeTemplateById.payment_mode == "") {
      let msg = {
        type: 'error',
        title: 'Payment Mode Missing',
        body: 'Please fill in the mode of payment'
      }
      this.appC.popToast(msg);
    }
    /* Error */
    else if (this.feeTemplateById.paid_date == "" && this.feeTemplateById.payment_mode != "") {
      let msg = {
        type: 'error',
        title: 'Payment Date Missing',
        body: 'Please fill in the payment date '
      }
      this.appC.popToast(msg);
    }
    else {
      /* PDC data to be verified */
      if (this.feeTemplateById.payment_mode == 'Cheque/PDC/DD No.') {
        if (this.validatePdcObject()) {
          let obj = {
            chequeDetailsJson: {},
            customFeeSchedules: [],
            discount_fee_reason: "",
            is_delete_other_fee_types: 0,
            is_undo: this.is_undo,
            paid_date: "",
            payment_mode: "",
            reference_no: "",
            remarks: "",
            studentArray: [],
            studentwise_fees_tax_applicable: "",
            studentwise_total_fees_amount: "",
            studentwise_total_fees_discount: 0,
            template_effective_date: "",
            template_id: ""
          }
          this.isFeeApplied = true;
          this.isPaymentPdc = false;
          this.pdcSelectedForm.cheque_date = moment(this.pdcSelectedForm.cheque_date).format("YYYY-MM-DD");
          obj.chequeDetailsJson = this.pdcSelectedForm;
          obj.customFeeSchedules = this.getFeeStructure(this.feeTemplateById.customFeeSchedules);
          obj.discount_fee_reason = this.discountReason;
          obj.is_undo = this.is_undo;
          obj.paid_date = this.feeTemplateById.paid_date;
          obj.payment_mode = this.feeTemplateById.payment_mode;
          obj.reference_no = this.feeTemplateById.reference_no;
          obj.remarks = this.feeTemplateById.remarks;
          obj.studentArray.push(this.student_id);
          obj.studentwise_fees_tax_applicable = this.feeTemplateById.studentwise_fees_tax_applicable;
          obj.studentwise_total_fees_amount = this.feeTemplateById.studentwise_total_fees_amount;
          obj.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount;
          this.postService.allocateStudentFees(obj).subscribe(
            res => {
              let msg = {
                type: 'success',
                title: 'Fees Updated',
                body: 'Fee details has been updated'
              }
              this.appC.popToast(msg);
              this.pdcSelectedForm = {
                bank_name: '',
                cheque_amount: this.totalFeePaid,
                cheque_date: moment().format("YYYY-MM-DD"),
                cheque_no: '',
                pdc_cheque_id: ''
              }
              this.isFeeApplied = false;
              this.pdcSelectedForPayment = "";
              this.studentAddedGetFee(this.student_id);
              this.closePaymentDetails();
            },
            err => {
              let msg = {
                type: 'error',
                title: 'Incorrect PDC/Cheque Details',
                body: 'Cheque amount does not match the selected installment'
              }
              this.appC.popToast(msg);
            }
          );
        }
        else {
          let msg = {
            type: 'error',
            title: 'Incorrect PDC/Cheque Details',
            body: 'Please provide correct input for the cheque data'
          }
          this.appC.popToast(msg);
        }
      }
      else {
        let obj = {
          chequeDetailsJson: {},
          customFeeSchedules: [],
          discount_fee_reason: "",
          is_delete_other_fee_types: 0,
          is_undo: this.is_undo,
          paid_date: "",
          payment_mode: "",
          reference_no: "",
          remarks: "",
          studentArray: [],
          studentwise_fees_tax_applicable: "",
          studentwise_total_fees_amount: "",
          studentwise_total_fees_discount: 0,
          template_effective_date: "",
          template_id: ""
        }
        this.isFeeApplied = true;
        this.isPaymentPdc = false;
        obj.chequeDetailsJson = this.feeTemplateById.chequeDetailsJson;
        obj.customFeeSchedules = this.getFeeStructure(this.feeTemplateById.customFeeSchedules);
        obj.discount_fee_reason = this.discountReason;
        obj.is_undo = this.is_undo;
        obj.paid_date = this.feeTemplateById.paid_date;
        obj.payment_mode = this.feeTemplateById.payment_mode;
        obj.reference_no = this.feeTemplateById.reference_no;
        obj.remarks = this.feeTemplateById.remarks;
        obj.studentArray.push(this.student_id);
        obj.studentwise_fees_tax_applicable = this.feeTemplateById.studentwise_fees_tax_applicable;
        obj.studentwise_total_fees_amount = this.feeTemplateById.studentwise_total_fees_amount;
        obj.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount;
        this.postService.allocateStudentFees(obj).subscribe(
          res => {
            let msg = {
              type: 'success',
              title: 'Fees Updated',
              body: 'Fee details has been updated'
            }
            this.appC.popToast(msg);
            this.pdcSelectedForm = {
              bank_name: '',
              cheque_amount: this.totalFeePaid,
              cheque_date: moment().format("YYYY-MM-DD"),
              cheque_no: '',
              pdc_cheque_id: ''
            }
            this.isFeeApplied = false;
            this.pdcSelectedForPayment = "";
            this.studentAddedGetFee(this.student_id);
            this.closePaymentDetails();
          },
          err => {
            let msg = {
              type: 'error',
              title: 'Error Updating Fees',
              body: ''
            }
            this.appC.popToast(msg);
          }
        );
        this.closePaymentDetails();
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  addNewInstallmentFee() {
    debugger
    if (this.addFeeInstallment.due_date == "" || this.addFeeInstallment.due_date == null || isNaN(this.addFeeInstallment.initial_fee_amount) || this.addFeeInstallment.initial_fee_amount == "" || this.addFeeInstallment.initial_fee_amount <= 0) {
      if (this.addFeeInstallment.due_date == "" || this.addFeeInstallment.due_date == null) {
        let msg = {
          type: 'error',
          title: 'Invalid Date',
          body: 'Please select a due date'
        }
        this.appC.popToast(msg);
      }
      else if (isNaN(this.addFeeInstallment.initial_fee_amount) || this.addFeeInstallment.initial_fee_amount == "" || this.addFeeInstallment.initial_fee_amount <= 0) {
        let msg = {
          type: 'error',
          title: 'Invalid Amount',
          body: 'Please select valid installment amount'
        }
        this.appC.popToast(msg);
      }
    }
    else if (this.addFeeInstallment.due_date != "" && !isNaN(this.addFeeInstallment.initial_fee_amount)) {
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        this.addFeeInstallment.service_tax = this.feeTemplateById.registeredServiceTax;
        this.addFeeInstallment.due_date = moment(this.addFeeInstallment.due_date).format("YYYY-MM-DD");
        this.addFeeInstallment.fees_amount = parseInt(this.addFeeInstallment.initial_fee_amount) + (this.precisionRound(((this.addFeeInstallment.service_tax / 100) * parseInt(this.addFeeInstallment.initial_fee_amount)), -1));
        this.instalmentTableData.push(this.addFeeInstallment);
        this.addFeeInstallment = {
          amount_paid: '',
          amount_paid_inRs: null,
          balance_amount: 0,
          batch_id: 0,
          created_by: null,
          created_date: null,
          day_type: 0,
          days: 0,
          discount: 0,
          due_date: moment().format("YYYY-MM-DD"),
          enquiry_counsellor_name: "",
          enquiry_id: 0,
          feeTypes: null,
          fee_date: null,
          fee_payment_edit_history: null,
          fee_type: null,
          fee_type_name: "",
          fee_type_tax_configured: 0,
          fees_amount: 0,
          fineAmount: 0,
          fine_type: null,
          initial_fee_amount: 0,
          installment_no: null,
          installment_nos: "",
          invoice_no: 0,
          is_fee_receipt_generate: 0,
          is_paid: 0,
          is_referenced: "N",
          latest_due_date: "",
          onlinePaymentJson: null,
          paid_date: null,
          paid_full: "N",
          paymentDate: null,
          paymentMode: null,
          paymentModeAmountMap: null,
          payment_creation_date: null,
          payment_reference_id: 0,
          payment_status: 0,
          payment_tx_id: 0,
          pdc_cheque_id: -1,
          reference_no: null,
          remarks: null,
          scheduleType: null,
          schedule_id: 0,
          service_tax: null,
          service_tax_applicable: "",
          student_category: "",
          student_disp_id: null,
          student_id: 0,
          student_name: null,
          student_phone: "",
          tax: 0,
          update_date: null,
          updated_by: null
        }
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        this.addFeeInstallment.service_tax = 0;
        this.addFeeInstallment.due_date = moment(this.addFeeInstallment.due_date).format("YYYY-MM-DD");
        this.addFeeInstallment.fees_amount = parseInt(this.addFeeInstallment.initial_fee_amount) + (this.precisionRound(((this.addFeeInstallment.service_tax / 100) * parseInt(this.addFeeInstallment.initial_fee_amount)), -1));
        this.instalmentTableData.push(this.addFeeInstallment);
        this.addFeeInstallment = {
          amount_paid: '',
          amount_paid_inRs: null,
          balance_amount: 0,
          batch_id: 0,
          created_by: null,
          created_date: null,
          day_type: 0,
          days: 0,
          discount: 0,
          due_date: moment().format("YYYY-MM-DD"),
          enquiry_counsellor_name: "",
          enquiry_id: 0,
          feeTypes: null,
          fee_date: null,
          fee_payment_edit_history: null,
          fee_type: null,
          fee_type_name: "",
          fee_type_tax_configured: 0,
          fees_amount: 0,
          fineAmount: 0,
          fine_type: null,
          initial_fee_amount: 0,
          installment_no: null,
          installment_nos: "",
          invoice_no: 0,
          is_fee_receipt_generate: 0,
          is_paid: 0,
          is_referenced: "N",
          latest_due_date: "",
          onlinePaymentJson: null,
          paid_date: null,
          paid_full: "N",
          paymentDate: null,
          paymentMode: null,
          paymentModeAmountMap: null,
          payment_creation_date: null,
          payment_reference_id: 0,
          payment_status: 0,
          payment_tx_id: 0,
          pdc_cheque_id: -1,
          reference_no: null,
          remarks: null,
          scheduleType: null,
          schedule_id: 0,
          service_tax: null,
          service_tax_applicable: "",
          student_category: "",
          student_disp_id: null,
          student_id: 0,
          student_name: null,
          student_phone: "",
          tax: 0,
          update_date: null,
          updated_by: null
        }
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getTaxedAmount(amt, stat, i): number {
    if (this.instalmentTableData.length > 0) {

      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        let tax: number = 0;
        tax = this.precisionRound(((this.service_tax / 100) * amt), -1);
        this.instalmentTableData[i].tax = tax;
        return Math.floor(tax);
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        return 0;
      }
    }
    else {
      return 0;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateInitialAmount(amt, i) {
    if (this.instalmentTableData[i].service_tax_applicable === "Y" || this.instalmentTableData[i].service_tax_applicable === "") {
      this.instalmentTableData[i].initial_fee_amount = this.precisionRound(((100 * parseInt(amt)) / (100 + this.service_tax)), -1);
    }
    else if (this.instalmentTableData[i].service_tax_applicable === "N") {
      this.instalmentTableData[i].initial_fee_amount = parseInt(amt);
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getOtherTaxes(amt, stat, i): number {
    if (this.otherFeeTableData.length > 0) {
      if (stat === "Y" || stat === "") {
        let tax: number = 0;
        tax = this.precisionRound(((this.otherFeeTableData[i].service_tax / 100) * amt), -1);
        this.otherFeeTableData[i].tax = tax;
        return Math.floor(tax);
      }
      else if (stat === "N") {
        let tax: number = 0;
        this.otherFeeTableData[i].tax = tax;
        return Math.floor(tax);
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateAdditionalInitialAmount(amount, index) {
    if (this.otherFeeTableData[index].service_tax_applicable === "Y" || this.otherFeeTableData[index].service_tax_applicable === "") {
      this.otherFeeTableData[index].initial_fee_amount = this.precisionRound(((100 * parseInt(amount)) / (100 + this.otherFeeTableData[index].service_tax)), -1);
    }
    else if (this.otherFeeTableData[index].service_tax_applicable === "N") {
      this.otherFeeTableData[index].initial_fee_amount = parseInt(amount);
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getOtherFeesArray(): any[] {
    if (this.otherFeeType.length == 0) {
      let tempArr: any[] = [];
      let object = this.feeTemplateById.feeTypeMap;
      for (var key in object) {
        let obj = {
          id: '',
          value: ''
        }
        if (object.hasOwnProperty(key)) {
          obj.id = key;
          obj.value = object[key];
          tempArr.push(obj);
        }
      }
      this.otherFeeType = tempArr;
      return tempArr;
    }
    else {
      return this.otherFeeType;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  addNewOtherFee() {
    let otherFeesArr: any[] = this.otherFeeTableData;

    this.addFeeOther.due_date = moment(this.addFeeOther.due_date).format('YYYY-MM-DD');
    if (this.addFeeOther.fee_type == '' || this.addFeeOther.fee_type == null || this.addFeeOther.fee_type == undefined ||
      this.addFeeOther.due_date == '' || this.addFeeOther.due_date == null || this.addFeeOther.due_date == undefined || this.addFeeOther.due_date == 'invalid date' ||
      this.addFeeOther.initial_fee_amount == '' || this.addFeeOther.initial_fee_amount == null || this.addFeeOther.initial_fee_amount == 0) {
      if (this.addFeeOther.fee_type == '' || this.addFeeOther.fee_type == null || this.addFeeOther.fee_type == undefined) {
        let msg = {
          type: 'error',
          title: 'Invalid fee type',
          body: 'Please select a valid fee type'
        }
        this.appC.popToast(msg);
      }
      else if (this.addFeeOther.due_date == '' || this.addFeeOther.due_date == null || this.addFeeOther.due_date == undefined || this.addFeeOther.due_date == 'invalid date') {
        let msg = {
          type: 'error',
          title: 'Invalid Due Date',
          body: 'Please valid Date'
        }
        this.appC.popToast(msg);
      }
      else if (this.addFeeOther.initial_fee_amount == '' || this.addFeeOther.initial_fee_amount == null || this.addFeeOther.initial_fee_amount == 0) {
        let msg = {
          type: 'error',
          title: 'Invalid Amount',
          body: 'Please enter a valid fee amount'
        }
        this.appC.popToast(msg);
      }
      else {
      }
    }
    else {
      this.addFeeOther.due_date = moment(this.addFeeOther.due_date).format("YYYY-MM-DD");
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        this.addFeeOther.fees_amount = parseInt(this.addFeeOther.initial_fee_amount) + (this.precisionRound(((this.addFeeOther.service_tax / 100) * parseInt(this.addFeeOther.initial_fee_amount)), -1));
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        this.addFeeOther.service_tax = 0;
        this.addFeeOther.fees_amount = parseInt(this.addFeeOther.initial_fee_amount) + (this.precisionRound(((this.addFeeOther.service_tax / 100) * parseInt(this.addFeeOther.initial_fee_amount)), -1));
      }
      otherFeesArr.push(this.addFeeOther);
      this.clearOtherFees(otherFeesArr);
    }
  }

  clearOtherFees(arr: any[]) {
    this.otherFeeTableData = arr;
    this.addFeeOther = {
      amount_paid: '',
      amount_paid_inRs: null,
      balance_amount: 0,
      batch_id: 0,
      created_by: null,
      created_date: null,
      day_type: 0,
      days: 0,
      discount: 0,
      due_date: moment().format("YYYY-MM-DD"),
      enquiry_counsellor_name: "",
      enquiry_id: 0,
      feeTypes: null,
      fee_date: null,
      fee_payment_edit_history: null,
      fee_type: null,
      fee_type_name: "",
      fee_type_tax_configured: 0,
      fees_amount: 0,
      fineAmount: 0,
      fine_type: null,
      initial_fee_amount: 0,
      installment_no: null,
      installment_nos: "",
      invoice_no: 0,
      is_fee_receipt_generate: 0,
      is_paid: 0,
      is_referenced: "N",
      latest_due_date: "",
      onlinePaymentJson: null,
      paid_date: null,
      paid_full: "N",
      paymentDate: null,
      paymentMode: null,
      paymentModeAmountMap: null,
      payment_creation_date: null,
      payment_reference_id: 0,
      payment_status: 0,
      payment_tx_id: 0,
      pdc_cheque_id: -1,
      reference_no: null,
      remarks: null,
      scheduleType: null,
      schedule_id: 0,
      service_tax: null,
      service_tax_applicable: "N",
      student_category: "",
      student_disp_id: null,
      student_id: 0,
      student_name: null,
      student_phone: "",
      tax: 0,
      update_date: null,
      updated_by: null
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateOtherFeeData(e) {
    this.studentPrefillService.getFeeDetailsById(e).subscribe(
      el => {
        this.addFeeOther.initial_fee_amount = el.fee_amount;
        this.addFeeOther.fee_type_name = el.fee_type;
        this.addFeeOther.service_tax = el.fee_type_tax;
      },
      err => {

      }
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  precisionRound(number, precision) {
    let o = number.toFixed(1);
    let num = parseInt(o.toString().split('.')[0]);
    let deci = parseInt(o.toString().split('.')[1]);
    //console.log("number = " +num +" And Decimal = " +deci);
    if (deci == 0) {
      return num;
    }
    else if (deci != 0) {
      /* increment by 1 */
      if (deci > 5) {
        return num + 1;
      }
      /* return the same count */
      else {
        return num;
      }
    }
    /* var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor; */
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  createCustomFeeSchedule() {

    this.instalmentTableData.sort(function (d1, d2) {
      return moment(d1.due_date).unix() - moment(d2.due_date).unix();
    });
    for (var i = 0; i < this.instalmentTableData.length; i++) {
      this.instalmentTableData[i].installment_no = i + 1;
    }
    for (var i = 0; i < this.otherFeeTableData.length; i++) {
      this.otherFeeTableData[i].installment_no = this.instalmentTableData.length + i + 1;
    }
    this.userCustommizedFee = [];
    this.userCustommizedFee = this.instalmentTableData.concat(this.otherFeeTableData);
    let totalFee: number = 0;
    let feePaid: number = 0;
    this.userCustommizedFee.forEach(el => {
      el.due_date = moment(el.due_date).format("YYYY-MM-DD");
      totalFee += parseInt(el.fees_amount);



      if (el.is_paid == 1) {
        feePaid += parseInt(el.fees_amount);
      }
      let obj = {
        uiSelected: false,
        isPaid: el.paid_full == "Y" ? true : false
      }
      this.paymentStatusArr.push(obj);
    });
    this.feeTemplateById.studentwise_total_fees_amount = totalFee;
    this.feeTemplateById.studentwise_total_fees_amount_paid = feePaid
    this.feeTemplateById.studentwise_total_fees_balance_amount = totalFee - feePaid;
    this.feeTemplateById.customFeeSchedules = this.userCustommizedFee;
    this.isDefineFees = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */

  applyDiscountCustomFeeSchedule() {
    this.instalmentTableData.sort(function (d1, d2) {
      return moment(d1.due_date).unix() - moment(d2.due_date).unix();
    });
    for (var i = 0; i < this.instalmentTableData.length; i++) {
      this.instalmentTableData[i].installment_no = i + 1;
    }
    for (var i = 0; i < this.otherFeeTableData.length; i++) {
      this.otherFeeTableData[i].installment_no = this.instalmentTableData.length + i + 1;
    }
    this.userCustommizedFee = [];
    this.userCustommizedFee = this.instalmentTableData.concat(this.otherFeeTableData);
    this.feeTemplateById.customFeeSchedules = this.userCustommizedFee;
    this.isDefineFees = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */

  closeAllFeePops() {
    if (confirm("Any unsaved changes made to fee template will be discarded!")) {
      this.closeFee = true;
      this.setStudentFeeDetail();
    }
    else {

    }
  }


  getTaxAmounted(fee) {

    let amount = fee.initial_fee_amount;
    if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
      return this.precisionRound(((this.service_tax / 100) * amount), -1);
    }
    else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
      return 0;
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  setStudentFeeDetail() {
    this.totalFeeWithTax = 0;
    this.totalDicountAmount = 0;
    this.totalTaxAmount = 0;
    this.totalPaidAmount = 0;
    this.totalAmountPaid = 0;
    this.totalAmountDue = 0;

    /* Request from close popup */
    if (this.closeFee) {
      if(this.userHasFees){
        this.totalFeePaid = 0;      
        this.total_amt_tobe_paid = this.totalFeePaid;  
        this.isConfigureFees = false;
        this.instalmentTableData = [];
        this.isDefineFees = false;
        this.isFeeApplied = false;
        this.isDiscountApplied = false;
        this.discountReason = '';
        let res = this.studentPrefillService.getStoredFees();
        if(res != null){
          this.userHasFees = true;
          this.isRippleLoad = false;
          this.userHasFees = true;
          this.allignStudentFeeView(res);
        }
        else{
          this.totalFeePaid = 0;   
          this.total_amt_tobe_paid = this.totalFeePaid;     
          this.isConfigureFees = false;
          this.instalmentTableData = [];
          this.userHasFees = false;
          this.otherFeeTableData = [];
          this.isPaymentDetailsValid = false;
          this.isDefineFees = false;
          this.isFeeApplied = false;
          this.isDiscountApplied = false;
          this.discountReason = '';
        }
      }
      else{
        this.totalFeePaid = 0;     
        this.total_amt_tobe_paid = this.totalFeePaid;   
        this.isConfigureFees = false;
        this.instalmentTableData = [];
        this.userHasFees = false;
        this.otherFeeTableData = [];
        this.isPaymentDetailsValid = false;
        this.isDefineFees = false;
        this.isFeeApplied = false;
        this.isDiscountApplied = false;
        this.discountReason = '';
        this.isRippleLoad = false;
        this.navigateTo('feeDetails');        
      }
    }
    else {
      this.studentPrefillService.fetchStudentFeeDetailById(this.student_id).subscribe(res => {
        if (res.customFeeSchedules != null) {
          this.isRippleLoad = false;
          this.userHasFees = true;
          this.allignStudentFeeView(res);
        }
        else if (res.customFeeSchedules == null) {
          this.isConfigureFees = false;
          this.instalmentTableData = [];
          this.userHasFees = false;
          this.otherFeeTableData = [];
          this.isPaymentDetailsValid = false;
          this.isRippleLoad = false;
          this.navigateTo('feeDetails');
        }
      });
    }

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  sortTableByDate(i, event) {
    this.instalmentTableData[i].due_date = event;
    this.updateTableInstallment();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateTableInstallment() {
    this.instalmentTableData.sort(function (d1, d2) {
      return moment(d1.due_date).unix() - moment(d2.due_date).unix();
    });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  deleteInstallment(i) {
    this.instalmentTableData.splice(i, 1);
    this.updateTableInstallment();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  deleteOtherFee(i) {
    this.otherFeeTableData.splice(i, 1);
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  reConfigureFees() {
    this.deselectAllSelectedCheckbox();
    this.isDefineFees = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  reCreateFeeAgain() {
    this.closeAllFeePops();
    this.instalmentTableData = [];
    this.otherFeeTableData = [];
    this.isPaymentDetailsValid = false;
    this.isConfigureFees = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  cancelStudentUpload() {

    this.router.navigate(['/student']);

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  addNewStudentFullView() {
    let fee = this.feeTemplateById.customFeeSchedules;

    /* Payment Details Have been updated proceed to upload student */
    if (this.totalFeePaid == 0) {
      //console.log("payments valid proceeding to upload");
      this.addNewStudentFull();
    }

    /* Payment Details not found */
    else if (this.totalFeePaid != 0) {

      let isPaid = this.paymentStatusArr.every(function (element, index, array) {
        return (element.uiSelected === element.isPaid);
      })

      /* No Payment has been selected for updation */
      if (isPaid) {
        //console.log("payments not needed");
        this.addNewStudentFull();
      } /* Payment Selected For updation */
      else {
        //console.log("payments not found");
        this.isFeePaymentUpdate = true;
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  addNewStudentFull() {
    /* Inventory Allocated*/
    if (this.allotInventoryArr.length > 0) {
      this.allocateInventory(this.student_id);
    }
    /* Inventory is not defined but fee is defined*/
    else if (this.allotInventoryArr.length == 0 && this.isFeeApplied) {
      this.asssignCustomizedFee(this.student_id);
    }
    /* Inventory and fee both are not defined */
    else if (this.allotInventoryArr.length == 0 && !this.isFeeApplied) {
      this.studentAddedNotifier();
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  studentAdder() {

    /* Both Form are Valid Else there seems to be an error on custom component */
    let isCustomComponentValid: boolean = this.customComponents.every(el => { return this.getCustomValid(el); });
    let formValid: boolean = this.formfullValidator();
    //console.log(isCustomComponentValid);
    if (isCustomComponentValid && formValid) {
      //console.log("valid student generating Id Now");
      let customArr = [];
      this.customComponents.forEach(el => {
        if (el.value != '' && (typeof el.value != 'boolean')) {
          let obj = {
            component_id: el.id,
            enq_custom_id: "0",
            enq_custom_value: el.value
          }
          customArr.push(obj);
        }
        else if (el.value != '' && (typeof el.value == 'boolean')) {
          if (el.value) {
            let obj = {
              component_id: el.id,
              enq_custom_id: "0",
              enq_custom_value: "Y"
            }
            customArr.push(obj);
          }
          else {
            let obj = {
              component_id: el.id,
              enq_custom_id: "0",
              enq_custom_value: "N"
            }
            customArr.push(obj);
          }
        }
        else if (el.value == '' && (el.type == 2)) {
          let obj = {
            component_id: el.id,
            enq_custom_id: "0",
            enq_custom_value: "N"
          }
          customArr.push(obj);
        }
      });
      /* Get slot data and store on form */
      this.studentAddFormData.slot_id = this.selectedSlotsID;
      this.studentAddFormData.stuCustomLi = customArr;
      this.studentAddFormData.photo = this.studentImage;
      this.additionalBasicDetails = false;
      this.busyPrefill = this.postService.quickAddStudent(this.studentAddFormData).subscribe(
        res => {
          let statusCode = res.statusCode;
          if (statusCode == 200) {

            this.removeImage = true;
            this.student_id = res.generated_id;

            /* Inventory Allocated*/
            if (this.allotInventoryArr.length > 0) {
              this.allocateInventory(res.generated_id);
            }
            /* Inventory is not defined but fee is defined*/
            else if (this.allotInventoryArr.length == 0 && this.isFeeApplied) {
              this.asssignCustomizedFee(res.generated_id);
            }
            /* Inventory and fee both are not defined */
            else if (this.allotInventoryArr.length == 0 && !this.isFeeApplied) {
              this.studentAddedNotifier();
            }

          }
          else if (statusCode == 2) {
            let alert = {
              type: 'error',
              title: 'Contact Number In Use',
              body: 'An enquiry with the same contact number seems to exist'
            }
            this.removeImage = true;
            this.appC.popToast(alert);
            this.isDuplicateContactOpen();
          }
        },
        err => {
          // console.log(err);
        });
    }
    else {
      if (!isCustomComponentValid) {
        //console.log("invalid custom component");
        let alert = {
          type: 'error',
          title: 'Required Fields not filled',
          body: 'Please fill all the required fields on other details tab'
        }
        this.appC.popToast(alert);
      }
      else if (!formValid) {
        //console.log("invalid name number");
        let alert = {
          type: 'error',
          title: 'Personal Details Invalid/Incorrect',
          body: 'Please provide valid name and contact number on personal details tab'
        }
        this.appC.popToast(alert);
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getCustomValid(element): boolean {
    if (element.is_required == "Y" && element.value != "") {
      //console.log(element.is_required +" " +element.value);
      //console.log(element.is_required == "Y" && element.value != "");
      return true;
    }
    else if (element.is_required == "Y" && element.value == "") {
      //console.log(element.is_required +" " +element.value);
      //console.log(element.is_required == "Y" && element.value == "");
      return false;
    }
    else if (element.is_required == "N") {
      //console.log(element.is_required +" " +element.value)
      //console.log(element.is_required == "N");
      return true;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  formfullValidator() {

    if (this.studentAddFormData.student_name != "" && this.studentAddFormData.student_name != " "
      && this.studentAddFormData.student_phone != "" && this.validateName() && this.studentAddFormData.student_phone != " "
      && this.studentAddFormData.student_phone.length == 10) {
      return true;
    }
    else {
      return false;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  validateName(): boolean {
    let regex = /[a-zA-Z .]+[a-zA-Z .]+/;
    if (regex.test(this.studentAddFormData.student_name)) {
      return true;
    }
    else {
      return false;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  validatePhone(): boolean {
    let regex = /[789][0-9]{9}/;
    if (regex.test(this.studentAddFormData.student_phone)) {
      return true;
    }
    else {
      return false;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getTaxAmount(i) {
    let fee = this.feeTemplateById.customFeeSchedules[i];
    if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
      return this.precisionRound(((this.service_tax / 100) * fee.initial_fee_amount), -1);
    }
    else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
      return 0;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  allocateInventory(id) {

    let count: number = 0;
    let temp: any[] = [];
    this.allotInventoryArr.forEach(e => {
      let obj = {
        alloted_units: e.units_added,
        institution_id: sessionStorage.getItem('institute_id'),
        item_id: e.item_id,
        student_id: id
      }
      temp.push(obj);
    });
    this.postService.allocateStudentInventory(temp).subscribe(
      res => {
        if (this.isFeeApplied) {
          this.asssignCustomizedFee(id);
        }
        else {
          this.studentAddedNotifier();
        }
      },
      err => { }
    );
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  asssignCustomizedFee(id) {

    let obj = {
      chequeDetailsJson: {},
      customFeeSchedules: [],
      discount_fee_reason: "",
      is_delete_other_fee_types: 0,
      is_undo: "",
      paid_date: "",
      payment_mode: "",
      reference_no: "",
      remarks: "",
      studentArray: [],
      studentwise_fees_tax_applicable: "",
      studentwise_total_fees_amount: "",
      studentwise_total_fees_discount: 0,
      template_effective_date: "",
      template_id: ""
    }
    obj.customFeeSchedules = this.getFeeStructure(this.feeTemplateById.customFeeSchedules);
    //console.log(obj.customFeeSchedules);
    obj.discount_fee_reason = this.discountReason;
    obj.is_undo = 'N';
    obj.paid_date = this.feeTemplateById.paid_date;
    obj.payment_mode = this.feeTemplateById.payment_mode;
    obj.reference_no = this.feeTemplateById.reference_no;
    obj.remarks = this.feeTemplateById.remarks;
    obj.studentArray.push(id);
    obj.studentwise_fees_tax_applicable = this.feeTemplateById.studentwise_fees_tax_applicable;
    obj.studentwise_total_fees_amount = this.feeTemplateById.studentwise_total_fees_amount;
    obj.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount;
    this.postService.allocateStudentFees(obj).subscribe(
      res => {
        if (this.genPdcAck || this.sendPdcAck) {
          let feeid = res.generated_id;

          this.postService.generateFeeReceipt(id, feeid).subscribe(
            res => {
              this.studentAddedNotifier();
            },
            err => { }
          );
        }
        else {
          this.studentAddedNotifier();
        }
      },
      err => { }
    );
  }


  paymentModeUpdate(e) {
    if (e === 'Cheque/PDC/DD No.') {
      this.isPaymentPdc = true;
      this.pdcSelectedForm = {
        bank_name: '',
        cheque_amount: this.totalFeePaid,
        cheque_date: moment().format("YYYY-MM-DD"),
        cheque_no: '',
        pdc_cheque_id: ''
      }
    }
    else {
      this.isPaymentPdc = false;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  openDiscountApply() {
    this.isDiscountApply = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  closeDiscountApply() {
    this.isDiscountApply = false;
    this.discountApplyForm = {
      type: 'amount',
      value: null,
      reason: '',
      state: 'all'
    }
  }
  /* ============================================================================================================================ */
  deselectAllSelectedCheckbox() {
    this.totalFeePaid = 0;
    this.total_amt_tobe_paid = this.totalFeePaid;
    this.paymentStatusArr.forEach(e => { e.uiSelected = false; });
  }
  /* ============================================================================================================================ */
  applyDiscount() {
    this.deselectAllSelectedCheckbox();
    /* Form is correctly filled */
    if (this.discountApplyForm.type != '' && this.discountApplyForm.value > 0 && this.discountApplyForm.reason != '' && this.discountApplyForm.reason != ' ') {
      /* discount in form of amount */
      if (this.discountApplyForm.type === 'amount') {
        /* invalid discount amount provided */
        if (this.discountApplyForm.value > this.totalAmountDue) {
          let msg = {
            type: 'error',
            title: 'Invalid Discount Amount',
            body: 'Cannot provide discount more than the total amount due'
          }
          this.appC.popToast(msg);
        }
        /* valid total discount amount < total due */
        else {
          /* apply discount to all */
          if (this.discountApplyForm.state === 'all') {
            /* Stores the index of all unpaid installments */
            let installmentPaidArr: any[] = this.calculateLengthPaid(this.instalmentTableData);
            /* json for storing data for unpaid installments */
            let unPaidArr: any[] = [];
            installmentPaidArr.forEach(e => { unPaidArr.push(this.instalmentTableData[e]) });
            //console.log(unPaidArr);
            let discount = this.precisionRound((this.discountApplyForm.value / installmentPaidArr.length), -1);
            /* discount is applicable to all installments, then proceed else alert */
            if (unPaidArr.every(e => e.fees_amount > discount)) {
              installmentPaidArr.forEach(i => {
                this.instalmentTableData[i].fees_amount = this.precisionRound((this.instalmentTableData[i].fees_amount - discount) , -1);
                if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
                  this.instalmentTableData[i].initial_fee_amount = this.precisionRound(((this.instalmentTableData[i].fees_amount * 100) / (this.service_tax + 100)) , -1);
                }
                else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
                  this.instalmentTableData[i].initial_fee_amount = this.precisionRound(((this.instalmentTableData[i].fees_amount * 100) / (100)) , -1);
                }
              });
              this.isDiscountApplied = true;
              this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason) : moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason);
              this.applyDiscountCustomFeeSchedule();
              this.totalDicountAmount = this.totalDicountAmount + this.discountApplyForm.value;
              this.feeTemplateById.studentwise_total_fees_discount = this.totalDicountAmount;
              this.totalAmountDue = this.totalFeeWithTax - this.totalPaidAmount - this.totalDicountAmount;
              this.feeTemplateById.studentwise_total_fees_balance_amount = this.totalAmountDue;
              this.closeDiscountApply();
            }/* discount is not applicable to any one condition or multiple */
            else {
              //console.log(this.instalmentTableData);
              let msg = {
                type: 'error',
                title: 'Discount Not Applicable',
                body: 'Discount cannot be applied evenly to all installment'
              }
              this.appC.popToast(msg);
            }
          }
          /* apply to Last installment */
          else {
            /* Stores the index of all unpaid installments */
            let installmentPaidArr: any[] = this.calculateLengthPaid(this.instalmentTableData);
            /* json for storing data for unpaid installments */
            let lastUnPaid: any = this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]];
            if (lastUnPaid.fees_amount > this.discountApplyForm.value) {
              this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount = this.precisionRound((this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount - this.discountApplyForm.value) , -1);
              if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
                this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].initial_fee_amount = this.precisionRound((((this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount * 100) / (this.service_tax + 100))) , -1);
              }
              else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
                this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].initial_fee_amount = this.precisionRound((((this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount * 100) / (100))) , -1);
              }
              this.isDiscountApplied = true;
              this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason) : moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason);
              this.applyDiscountCustomFeeSchedule();
              this.totalDicountAmount = this.totalDicountAmount + this.discountApplyForm.value;
              this.feeTemplateById.studentwise_total_fees_discount = this.totalDicountAmount;
              this.totalAmountDue = this.totalFeeWithTax - this.totalPaidAmount - this.totalDicountAmount;
              this.feeTemplateById.studentwise_total_fees_balance_amount = this.totalAmountDue;
              this.closeDiscountApply();
            }
            /*  */
            else {
              let msg = {
                type: 'error',
                title: 'Unable To Process Request',
                body: 'The discount amount exceed the last installment amount'
              }
              this.appC.popToast(msg);

            }
          }
        }
      }
      /* discount in form of percentage */
      else {
        let discountValue = this.precisionRound(((this.discountApplyForm.value / 100) * this.totalAmountDue), -1);
        /* invalid discount amount provided */
        if (discountValue > this.totalAmountDue) {
          let msg = {
            type: 'error',
            title: 'Invalid Discount Amount',
            body: 'Cannot provide discount more than the total amount due'
          }
          this.appC.popToast(msg);
        }/* valid total discount amount < total due */
        else {
          /* apply discount to all */
          if (this.discountApplyForm.state === 'all') {
            /* Stores the index of all unpaid installments */
            let installmentPaidArr: any[] = this.calculateLengthPaid(this.instalmentTableData);
            /* json for storing data for unpaid installments */
            let unPaidArr: any[] = [];
            installmentPaidArr.forEach(e => { unPaidArr.push(this.instalmentTableData[e]) });
            //console.log(unPaidArr);
            let discount = this.precisionRound((discountValue / installmentPaidArr.length), -1);
            /* discount is applicable to all installments, then proceed else alert */
            if (unPaidArr.every(e => e.fees_amount > discount)) {
              installmentPaidArr.forEach(i => {
                this.instalmentTableData[i].fees_amount =  this.precisionRound((this.instalmentTableData[i].fees_amount - discount) , -1);
                if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
                  this.instalmentTableData[i].initial_fee_amount = this.precisionRound((((this.instalmentTableData[i].fees_amount * 100) / (this.service_tax + 100))) , -1);
                }
                else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
                  this.instalmentTableData[i].initial_fee_amount = this.precisionRound((((this.instalmentTableData[i].fees_amount * 100) / (100))) , -1);
                }
              });
              this.isDiscountApplied = true;
              this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason) : moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason);
              this.applyDiscountCustomFeeSchedule();
              this.totalDicountAmount = this.totalDicountAmount + discountValue;
              this.feeTemplateById.studentwise_total_fees_discount = this.totalDicountAmount;
              this.totalAmountDue = this.totalFeeWithTax - this.totalPaidAmount - this.totalDicountAmount;
              this.feeTemplateById.studentwise_total_fees_balance_amount = this.totalAmountDue;
              this.closeDiscountApply();
            }/* discount is not applicable to any one condition or multiple */
            else {
              //console.log(this.instalmentTableData);
              let msg = {
                type: 'error',
                title: 'Discount Not Applicable',
                body: 'Discount cannot be applied evenly to all installment'
              }
              this.appC.popToast(msg);
            }
          }
          /* apply to Last installment */
          else {
            /* Stores the index of all unpaid installments */
            let installmentPaidArr: any[] = this.calculateLengthPaid(this.instalmentTableData);
            /* json for storing data for unpaid installments */
            let lastUnPaid: any = this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]];
            /* discount applicable proceed, else throw error */
            if (lastUnPaid.fees_amount > discountValue) {
              this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount = this.precisionRound((this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount - discountValue) , -1);

              if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
                this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].initial_fee_amount = this.precisionRound((((this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount * 100) / (this.service_tax + 100))) , -1);
              }
              else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
                this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].initial_fee_amount = this.precisionRound((((this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount * 100) / (100))) , -1);
              }
              
              this.isDiscountApplied = true;
              this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason) : moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason);
              this.applyDiscountCustomFeeSchedule();
              this.totalDicountAmount = this.totalDicountAmount + discountValue;
              this.feeTemplateById.studentwise_total_fees_discount = this.totalDicountAmount;
              this.totalAmountDue = this.totalFeeWithTax - this.totalPaidAmount - this.totalDicountAmount;
              this.feeTemplateById.studentwise_total_fees_balance_amount = this.totalAmountDue;
              this.closeDiscountApply();
            }
            /* error */
            else {
              let msg = {
                type: 'error',
                title: 'Unable To Process Request',
                body: 'The discount amount exceed the last installment amount'
              }
              this.appC.popToast(msg);
            }
          }
        }

      }
    }
    /* Incomplete form data detected */
    else {
      let msg = {
        type: 'error',
        title: 'Incomplete Form',
        body: 'Please fill all the required fields indicated'
      }
      this.appC.popToast(msg);
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  calculateLengthPaid(arr: any[]): any[] {
    let temp: any[] = [];
    for (var i = 0; i < this.instalmentTableData.length; i++) {
      if (this.instalmentTableData[i].is_referenced == "N") {
        temp.push(i);
      }
    }

    return temp;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  sort(key) {
    this.key = key;
    if (key == 'due_date') {
      this.reverse = false;
    }
    else {
      this.reverse = !this.reverse;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getTotalDiscountAmount(): number {
    if (this.discountApplyForm.value == 0 || this.discountApplyForm.value == '') {
      return 0;
    }
    else {
      if (this.discountApplyForm.type === 'amount') {
        return this.discountApplyForm.value;
      }
      else if (this.discountApplyForm.type === 'percentage') {
        return this.precisionRound(((this.discountApplyForm.value / 100) * this.totalAmountDue), -1);
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  inventoryItemUpdated(value, index, total) {
    if (value > total) {
      let msg = {
        type: 'warning',
        title: 'Incorrect Quantity',
        body: 'The quantity allocated cannot be higher than total available units'
      }
      this.appC.popToast(msg);
      this.inventoryItemsArr[index].units_added = total;
      if (this.allotInventoryArr.findIndex(i => i.item_id === this.inventoryItemsArr[index].item_id) !== -1) {
        this.allotInventoryArr.splice(this.allotInventoryArr.findIndex(i => i.item_id === this.inventoryItemsArr[index].item_id), 1);
      }
      this.allotInventoryArr.push(this.inventoryItemsArr[index]);
      //console.log(this.allotInventoryArr);
    }
    else {
      if (value >= 1) {
        if (this.allotInventoryArr.findIndex(i => i.item_id === this.inventoryItemsArr[index].item_id) !== -1) {
          this.allotInventoryArr.splice(this.allotInventoryArr.findIndex(i => i.item_id === this.inventoryItemsArr[index].item_id), 1);
        }
        this.allotInventoryArr.push(this.inventoryItemsArr[index]);
        //console.log(this.allotInventoryArr);
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  studentAddedNotifier() {
    let msg = {
      type: 'success',
      title: 'Student Added',
      body: 'Student details have been updated to database'
    }
    this.appC.popToast(msg);
    this.router.navigate(['/student']);
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getPaidStatus(el): any {
    if (el.is_referenced == 'Y') {
      return 0;
    }
    else if (el.is_referenced == 'N' && el.is_paid == 1) {
      return 1;
    }
    else if (el.is_referenced == 'N' && el.is_paid == 0) {
      return 0;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getFeeStructure(fee: any[]): any[] {
    let temp: any[] = [];

    fee.forEach(el => {
      let obj = {
        fee_date: el.due_date,
        fee_type: el.fee_type_name === "INSTALLMENT" ? 0 : el.fee_type,
        fees_amount: el.fees_amount,
        initial_fee_amount: el.initial_fee_amount,
        is_paid: this.getPaidStatus(el),
        is_referenced: el.is_referenced,
        schedule_id: el.schedule_id,
        service_tax: el.service_tax,
        service_tax_applicable: el.service_tax_applicable,
      }
      temp.push(obj);
    })

    return temp;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  setImage(e) {
    //console.log(e);
    this.studentImage = e;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  addNewPDCState() {
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
      student_id: this.student_id
    }
    if (this.validPdc(obj)) {
      this.newPdcArr.push(obj);
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
        student_id: 0
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  validPdc(obj): boolean {
    if (obj.cheque_date == 'Invalid date' || obj.cheque_date == '' || obj.clearing_date == 'Invalid date' || obj.clearing_date == '' || obj.cheque_no.toString().length != 6 || obj.cheque_amount <= 0) {
      if (obj.cheque_date == 'Invalid date' || obj.cheque_date == '') {
        let msg = {
          type: 'error',
          title: 'Invalid Cheque Details',
          body: 'Please enter a valid cheque date'
        }
        this.appC.popToast(msg);
      }
      if (obj.clearing_date == 'Invalid date' || obj.clearing_date == '') {
        let msg = {
          type: 'error',
          title: 'Invalid Cheque Details',
          body: 'Please enter a valid cheque clearing date'
        }
        this.appC.popToast(msg);
      }
      if (obj.cheque_no.toString().length != 6) {
        let msg = {
          type: 'error',
          title: 'Invalid Cheque Details',
          body: 'Please enter a valid cheque number'
        }
        this.appC.popToast(msg);
      }
      if (obj.cheque_amount <= 0) {
        let msg = {
          type: 'error',
          title: 'Invalid Cheque Details',
          body: 'Please enter a valid amount'
        }
        this.appC.popToast(msg);
      }
      return false;
    }
    else {
      return true;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  deleteUnsavedPdc(i) {
    this.newPdcArr.splice(i, 1);
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getPdcChequeList() {
    //console.log(this.pdcSearchObj);
    let obj = {
      cheque_status: this.pdcSearchObj.cheque_status == '' ? -1 : this.pdcSearchObj.cheque_status,
      student_id: this.student_id,
      cheque_date_from: this.pdcSearchObj.cheque_date_from == "Invalid date" ? '' : moment(this.pdcSearchObj.cheque_date_from).format('YYYY-MM-DD'),
      cheque_date_to: this.pdcSearchObj.cheque_date_to == "Invalid date" ? '' : moment(this.pdcSearchObj.cheque_date_to).format('YYYY-MM-DD')
    }
    //console.log(obj);
    this.studentPrefillService.getPdcList(this.student_id, obj).subscribe(
      res => {
        let temp: any[] = [];
        res.forEach(el => {
          let obj = {
            bank_name: el.bank_name,
            cheque_amount: el.cheque_amount,
            cheque_date: el.cheque_date,
            cheque_date_from: el.cheque_date_from,
            cheque_date_to: el.cheque_date_from,
            cheque_id: el.cheque_id,
            cheque_no: el.cheque_no,
            cheque_status: el.cheque_status,
            cheque_status_key: el.cheque_status_key,
            clearing_date: el.clearing_date,
            genAck: el.genAck,
            institution_id: el.institution_id,
            sendAck: el.sendAck,
            student_id: el.student_id,
            student_name: el.student_name,
            student_phone: el.student_phone,
            uiSelected: false
          }
          temp.push(obj);
        });
        this.chequePdcList = temp;
      })

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  addPdcDataToServer() {
    let temp: any[] = [];
    this.newPdcArr.forEach(e => {
      let obj = {
        cheque_no: e.cheque_no,
        bank_name: e.bank_name,
        cheque_date: e.cheque_date,
        student_id: this.student_id,
        clearing_date: e.clearing_date,
        institution_id: sessionStorage.getItem('institute_id'),
        cheque_amount: e.cheque_amount,
        genAck: this.genPdcAck === true ? "Y" : "N",
        sendAck: this.sendPdcAck === true ? "Y" : "N"
      }
      temp.push(obj);
    });
    this.newPdcArr = [];
    this.genPdcAck = false;
    this.sendPdcAck = false;
    this.postService.addChequePdc(temp).subscribe(
      res => {
        this.chequePdcList = [];
        this.getPdcChequeList();
      },
      err => {
        this.chequePdcList = [];
        this.getPdcChequeList();
      }
    )

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  editPDC(data) {
    document.getElementById((data.student_id + data.cheque_id).toString()).classList.remove('displayComp');
    document.getElementById((data.student_id + data.cheque_id).toString()).classList.add('editComp');
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updatePDC(el) {
    if (this.validPdc(el)) {
      let obj = {
        bank_name: el.bank_name,
        cheque_amount: el.cheque_amount,
        cheque_date: moment(el.cheque_date).format("YYYY-MM-DD"),
        cheque_id: el.cheque_id,
        cheque_no: el.cheque_no,
        cheque_status_key: el.cheque_status_key,
        clearing_date: moment(el.clearing_date).format("YYYY-MM-DD"),
        institution_id: sessionStorage.getItem('institute_id'),
        student_id: el.student_id
      }
      this.postService.updateFeeDetails(obj).subscribe(
        res => {
          this.pdcStatus.forEach(e => { if (e.cheque_status_key == el.cheque_status_key) { el.cheque_status = e.cheque_status } });
          console.log(el.cheque_status);
          document.getElementById((el.student_id + el.cheque_id).toString()).classList.add('displayComp');
          document.getElementById((el.student_id + el.cheque_id).toString()).classList.remove('editComp');
        },
        err => {

        }
      )
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  deletePDC(data, i) {

    if (confirm("Are you sure,you want to delete the Cheque?")) {
      this.postService.deletePdcById(data.cheque_id).subscribe(
        res => {
          this.chequePdcList.splice(i, 1);
        },
        err => {

        }
      )
    }

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  cancelEditPDC(data) {
    document.getElementById((data.student_id + data.cheque_id).toString()).classList.add('displayComp');
    document.getElementById((data.student_id + data.cheque_id).toString()).classList.remove('editComp');
    this.pdcSelectedArr = [];
    this.getPdcChequeList();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  pdcSelected(obj) {
    if (obj.uiSelected) {
      this.pdcSelectedArr.push(obj.cheque_id);
    }
    else {
      var i = this.pdcSelectedArr.indexOf(obj.cheque_id);
      this.pdcSelectedArr.splice(i, 1);
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  generateAck() {
    this.postService.generateAcknowledge(this.pdcSelectedArr, this.student_id, "undefined").subscribe(
      res => {
      }
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  sendAck() {
    this.postService.sendAcknowledge(this.pdcSelectedArr, this.student_id).subscribe(
      res => {
      }
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  feePdcSelected(obj) {
    //console.log(obj);
    if (obj === '') {
      this.isPdcFeePaymentSelected = false;
      this.pdcSelectedForm = {
        bank_name: '',
        cheque_amount: this.totalFeePaid,
        cheque_date: moment().format("YYYY-MM-DD"),
        cheque_no: '',
        pdc_cheque_id: ''
      }
    }
    else {
      this.isPdcFeePaymentSelected = true;
      this.chequePdcList.forEach(el => {
        if (obj == el.cheque_id) {
          this.pdcSelectedForm = {
            bank_name: el.bank_name,
            cheque_amount: el.cheque_amount,
            cheque_date: el.cheque_date,
            cheque_no: el.cheque_no,
            pdc_cheque_id: el.cheque_id
          }
        }
      });
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  validatePdcObject(): boolean {
    if (this.pdcSelectedForm.bank_name.trim() == '' || this.pdcSelectedForm.cheque_date == 'Invalid date' || this.pdcSelectedForm.cheque_date == '' || this.pdcSelectedForm.cheque_no == '' || this.pdcSelectedForm.cheque_amount == '') {
      return false;
    }
    else {
      return true;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
    /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  downloadFeeReceipt(ins) {
    //this.fetchService.getFeeReceiptById(ins.display_invoice_no)
    console.log(ins);
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  emailFeeReceipt(ins) {
    //this.fetchService.emailReceiptById(ins.display_invoice_no)
    console.log(ins);
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  openPartialPayment(ins) {
    console.log(ins);
    this.totalFeePaid = ins.balance_amount;
    this.total_amt_tobe_paid = this.totalFeePaid;
    this.studentFeeReportObj = {
      due_date: ins.due_date,
      fee_schedule_id: ins.schedule_id,
      paid_full: this.getPaidFullVal(ins),
      previous_balance_amt: ins.balance_amount,
      total_amt_paid: ins.balance_amount
    }

    this.isPartialPayment = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  closePartialPayment() {
    this.totalFeePaid = 0;
    this.total_amt_tobe_paid = this.totalFeePaid;
    this.studentFeeReportObj = {
      due_date: null,
      fee_schedule_id: 0,
      paid_full: '',
      previous_balance_amt: "",
      total_amt_paid: ""
    }
    this.partialPayObj = {
      chequeDetailsJson: {},
      paid_date: moment().format('YYYY-MM-DD'),
      paymentMode: "Cash",
      reference_no: '',
      remarks: "",
      studentFeeReportJsonList: [],
      student_id: this.student_id
    };
    this.isPartialPayment = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getPaidFullVal(i): string {
    //let v = parseInt(i.balance_amount) - parseInt(i.amount_paid_inRs);
    return "Y";
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  payPartial() {
    /* Error */
    if (this.partialPayObj.paid_date == null && this.partialPayObj.paymentMode == null) {
      let msg = {
        type: 'error',
        title: 'Payment Date and Mode Missing',
        body: 'Please fill in the payment date and mode of payment'
      }
      this.appC.popToast(msg);
    }
    /* Error */
    else if (this.partialPayObj.paid_date != null && this.partialPayObj.paymentMode == null) {
      let msg = {
        type: 'error',
        title: 'Payment Mode Missing',
        body: 'Please fill in the mode of payment'
      }
      this.appC.popToast(msg);
    }
    /* Error */
    else if (this.partialPayObj.paid_date == null && this.partialPayObj.paymentMode != null) {
      let msg = {
        type: 'error',
        title: 'Payment Date Missing',
        body: 'Please fill in the payment date '
      }
      this.appC.popToast(msg);
    }
    else {
      /* PDC data to be verified */
      if (this.partialPayObj.paymentMode == 'Cheque/PDC/DD No.') {
        if (this.validatePdcObject()) {
          let obj = {
            chequeDetailsJson:{},
            paid_date: '',
            paymentMode: '',
            reference_no: "",
            remarks: "",
            studentFeeReportJsonList: [],
            student_id: this.student_id
          }

          this.isFeeApplied = true;
          this.isPaymentPdc = false;
          obj.chequeDetailsJson = this.pdcSelectedForm;
          obj.paid_date = moment(this.partialPayObj.paid_date).format("YYYY-MM-DD");
          obj.paymentMode = this.partialPayObj.paymentMode;
          obj.reference_no = this.partialPayObj.reference_no;
          obj.remarks = this.partialPayObj.remarks;
          obj.studentFeeReportJsonList.push(this.studentFeeReportObj);
          this.postService.payPartialFeeAmount(obj).subscribe(
            res => {
              let msg = {
                type: 'success',
                title: 'Fees Updated',
                body: 'Fee details has been updated'
              }
              this.appC.popToast(msg);
              this.isFeeApplied = false;
              this.pdcSelectedForPayment = "";
              this.studentAddedGetFee(this.student_id);
              this.closePartialPayment();
            },
            err => {
              let obj = {
                type: "error",
                title: "Failed To Update Partial Payment"
              }
            }
          );
        }
        else {
          let msg = {
            type: 'error',
            title: 'Incorrect PDC/Cheque Details',
            body: 'Please provide correct input for the cheque data'
          }
          this.appC.popToast(msg);
        }
      }
      else {
        let obj = {
          chequeDetailsJson:{},
          paid_date: '',
          paymentMode: '',
          reference_no: "",
          remarks: "",
          studentFeeReportJsonList: [],
          student_id: this.student_id
        }
        this.isFeeApplied = true;
        this.isPaymentPdc = false;
        //obj.chequeDetailsJson = this.partialPayObj.chequeDetailsJson;
        obj.paid_date = moment(this.partialPayObj.paid_date).format("YYYY-MM-DD");
        obj.paymentMode = this.partialPayObj.paymentMode;
        obj.reference_no = this.partialPayObj.reference_no;
        obj.remarks = this.partialPayObj.remarks;
        obj.studentFeeReportJsonList.push(this.studentFeeReportObj);
        this.postService.payPartialFeeAmount(obj).subscribe(
          res => {
            let msg = {
              type: 'success',
              title: 'Fees Updated',
              body: 'Fee details has been updated'
            }
            this.appC.popToast(msg);
            this.isFeeApplied = false;
            this.pdcSelectedForPayment = "";
            this.studentAddedGetFee(this.student_id);
            this.closePartialPayment();
          },
          err => {
            let obj = {
              type: "error",
              title: "Failed To Update Partial Payment"
            }
          }
        );
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */



}



@Pipe({ name: "sortBy" })
export class SortPipe {
  transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
      if (a[args] < b[args]) {
        return -1;
      } else if (a[args] > b[args]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}





/* 


*/