import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';
import { StudentForm } from '../../../model/student-add-form';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { LoginService } from '../../../services/login-services/login.service';
import 'rxjs/Rx';
import { StudentFeeStructure } from '../../../model/student-fee-structure';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';


@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.scss']
})
export class StudentEditComponent implements OnInit, OnDestroy {

  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* ==================================================        variable declarations      ====================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  private studentAddFormData: StudentForm = { student_name: "", student_sex: "", student_email: "", student_phone: "", student_curr_addr: "", dob: "", doj: moment().format('YYYY-MM-DD'), school_name: "-1", student_class_key: "", parent_name: "", parent_email: "", parent_phone: "", guardian_name: "", guardian_email: "", guardian_phone: "", is_active: "Y", institution_id: sessionStorage.getItem('institute_id'), assignedBatches: [], assignedBatchescademicYearArray: [""], assignedCourse_Subject_FeeTemplateArray: [""], fee_type: 0, fee_due_day: 0, batchJoiningDates: [], comments: "", photo: null, enquiry_id: "", student_disp_id: "", student_manual_username: null, social_medium: -1, attendance_device_id: "", religion: "", standard_id: "-1", subject_id: "-1", slot_id: null, language_inst_status: "admitted", stuCustomLi: [], deleteCourse_SubjectUnPaidFeeSchedules: false };
  private pdcAddForm: any = { bank_name: '', cheque_amount: '', cheque_date: '', cheque_id: 0, cheque_no: '', cheque_status: '', cheque_status_key: 0, clearing_date: '', institution_id: sessionStorage.getItem('institute_id'), student_id: 0 }; studentAddnMove: boolean; studentServerImage: string = ''; newPdcArr: any[] = []; pdcSelectedArr: any[] = []; selectedCheque: any; partialPaySelected: any; isPartialPayment: boolean; userHasFees: boolean; closeFee: boolean; formIsActive: boolean = false; studentImage: string = ''; private quickAddStudent: boolean = false; private additionalBasicDetails: boolean = false;
  private isAssignBatch: boolean = false; private isAcad: boolean = false; private isProfessional: boolean = false; private multiOpt: boolean = false; private isDuplicateStudent: boolean = false; isUpdateFeeAndExit: boolean = false; private instituteList: any[] = []; private standardList: any[] = []; private courseList: any[] = []; private batchList: any[] = []; private slots: any[] = []; private langStatus: any[] = []; private selectedSlots: any[] = []; private customComponents: any[] = []; private slotIdArr: any[] = []; uploadedFiles: any[] = []; private taxEnableCheck: any = '1'; private assignedBatch: string = ""; private selectedSlotsString: string = ''; private selectedSlotsID: string = ''; private assignedBatchString: string = ''; private userImageEncoded: string = '';
  private isConvertEnquiry: boolean = false; private isNewInstitute: boolean = true; private isNewInstituteEditor: boolean = false; school: any[] = []; removeImage: boolean = false; userCustommizedFee: any[] = []; isBasicActive: boolean = true; isOtherActive: boolean = false; isFeeActive: boolean = false; isInventoryActive: boolean = false; isConfigureFees: boolean = false; feeTempSelected: any = ""; studentPartialPaymentData: any[] = []; isPartialPayHistory: boolean = false; feeStructureForm: any = { studentArray: ["-1"], template_effective_date: moment().format('YYYY-MM-DD') }; instalmentTableData: any[] = []; otherFeeTableData: any[] = []; feeTemplateStore: any[] = []; inventoryItemsArr: any[] = []; createInstitute = { instituteName: "", isActive: "Y" };
  is_undo: string = "N"; pdcStatus: any[] = []; pdcSearchObj = { cheque_status: '-1', student_id: '', cheque_date_from: '', cheque_date_to: '' }; chequePdcList: any[] = []; allocationForm: any = { alloted_units: "", item_id: "", student_id: 0, institution_id: sessionStorage.getItem('institute_id') }; isPaymentDetailsValid: boolean = false; isEdit: boolean = true; total_amt_tobe_paid: any = ""; pdcSelectedForm: any = { bank_name: '', cheque_amount: '', cheque_date: moment().format("YYYY-MM-DD"), cheque_no: '', pdc_cheque_id: '' }; isPdcFeePaymentSelected: boolean = false; containerWidth: any = "200px"; installmentMarkedForPayment: any[] = [];
  feeTemplateById: StudentFeeStructure = { feeTypeMap: "", customFeeSchedules: [], registeredServiceTax: "", toCreate: "", studentArray: "", studentwise_total_fees_amount: "", studentwise_total_fees_balance_amount: "", studentwise_total_fees_amount_paid: "", studentwise_total_fees_discount: "", studentwise_fees_tax_applicable: "", no_of_installments: "", discount_fee_reason: "", template_name: "", template_id: "", template_effective_date: "", is_fee_schedule_created: "", is_fee_tx_done: "", is_undo: this.is_undo, is_fee_other_inst_created: "", is_delete_other_fee_types: "", chequeDetailsJson: "", payment_mode: "", remarks: "", paid_date: "", is_cheque_details_required: "", reference_no: "", invoice_no: "", uiSelected: false }; student_id: any; service_tax: number = 0; totalFeePaid: number = 0; paymentStatusArr: any[] = [];
  isFeePaymentUpdate: boolean = false; isDefineFees: boolean = false; isFeeApplied: boolean = false; isNewInstallment: boolean = false; isDiscountApply: boolean = false; isPdcApply: boolean = false; allocatedInventoryHistory: any[] = []; isDiscountApplied: boolean = false; discountReason: string = ''; key: string = 'name'; reverse: boolean = false; allotInventoryArr: any[] = []; isRippleLoad: boolean = false; studentAssisnedBatches: any[] = []; genPdcAck: boolean = false; sendPdcAck: boolean = false; isPaymentPdc: boolean = false; pdcSelectedForPayment: any; totalFeeWithTax: number = 0; totalDicountAmount: number = 0; totalTaxAmount: number = 0; totalPaidAmount: number = 0; totalAmountPaid: number = 0; totalInitalAmount: number = 0; totalAmountDue: number = 0; defaultAcadYear: any = '-1';
  partialPayObj: any = { chequeDetailsJson: {}, paid_date: moment().format('YYYY-MM-DD'), paymentMode: "Cash", reference_no: '', remarks: "", studentFeeReportJsonList: [], student_id: this.student_id }; studentFeeReportObj: any = { due_date: null, fee_schedule_id: 0, paid_full: "Y", previous_balance_amt: "", total_amt_paid: "" }; courseDropdown: any = null; enableBiometric: any = ""; academicYear: any[] = []; savedAssignedBatch: any[] = []; isManualDisplayId: boolean = false;
  studentName: string = "";

  addInventory: any = {
    alloted_units: 0,
    item_id: -1,
    available_units: ''
  };
  allocatedItem: any = [];

  @ViewChild('saveAndContinue') btnSaveAndContinue: ElementRef;


  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* ==================================================        constructor      ====================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  constructor(
    private studentPrefillService: AddStudentPrefillService,
    private prefill: FetchprefilldataService,
    private postService: PostStudentDataService,
    private router: Router,
    private route: ActivatedRoute,
    private login: LoginService,
    private appC: AppComponent,
    private fetchService: FetchStudentService,
    private auth: AuthenticatorService,
    private commonServiceFactory: CommonServiceFactory

  ) {
    this.isRippleLoad = true;
    this.getInstType();
    this.getSettings();
    this.student_id = this.route.snapshot.paramMap.get('id');
    this.fetchPrefillFormData();
  }



  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* ==================================================          Lifecycle Hook         ======================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  ngOnInit() {
    this.enableBiometric = sessionStorage.getItem('biometric_attendance_feature');
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    if (sessionStorage.getItem('editPdc') != "" && sessionStorage.getItem('editPdc') != null) {
      this.switchToView('feeDetails-icon');
    }
    if (sessionStorage.getItem('editInv') != "" && sessionStorage.getItem('editInv') != null) {
      this.switchToView('inventory-icon');
    }

    this.updateStudentForm(this.route.snapshot.paramMap.get('id'));
  }


  ngOnDestroy() {
    sessionStorage.setItem('editPdc', '');
    sessionStorage.setItem('editInv', '');

  }



  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* ============================================         General & Prefilling Data Methods         ============================================ */
  /* =================================== These methods are used for filling up dropdown and states for other methods =========================== */
  /* =========================================================================================================================================== */

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getInstType() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
          this.isAcad = false;
        } else {
          this.isProfessional = false;
          this.isAcad = true;
        }
      }
    )
  }

  /* ============================================================================================================================ */
  /* Function to navigate through the Student Add Form on button Click Save/Submit*/
  navigateTo(text) {
    if (text === "studentForm") {
      document.getElementById('li-one').classList.add('active');
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.remove('active');
      this.isBasicActive = true;
      this.isOtherActive = false;
      this.isFeeActive = false;
      this.isInventoryActive = false;
    }
    else if (text === "kyc") {
      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.add('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.remove('active');
      this.isBasicActive = false;
      this.isOtherActive = true;
      this.isFeeActive = false;
      this.isInventoryActive = false;
    }
    else if (text === "feeDetails") {
      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-three').classList.add('active');
      document.getElementById('li-four').classList.remove('active');
      this.isBasicActive = false;
      this.isOtherActive = false;
      this.isFeeActive = true;
      this.isInventoryActive = false;
    }
    else if (text === "inventory") {
      this.deselectAllSelectedCheckbox();
      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.add('active');
      this.isBasicActive = false;
      this.isOtherActive = false;
      this.isFeeActive = false;
      this.isInventoryActive = true;
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getCourseDropdown(id) {
    this.fetchService.getStudentCourseDetails(id).subscribe(
      res => {
        this.courseDropdown = res;
      },
      err => {

      }
    )
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getAssignDate(e): string {
    if (e == '' || e == null) {
      return moment().format('YYYY-MM-DD')
    }
    else {
      return moment(e).format('YYYY-MM-DD')
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateSlotsByStudent() {
    if (this.studentAddFormData.slot_id != '') {
      this.selectedSlotsID = this.studentAddFormData.slot_id;
      this.slotIdArr = this.selectedSlotsID.split(',');
      this.slotIdArr.forEach(e => {
        let i: string = this.getSlotName(e);
        this.selectedSlots.push(i);
      });
      this.selectedSlotsString = this.selectedSlots.join(',');
    }
  }

  /* ============================================================================================================================ */
  /* we need to update the batch array on the updating student object manually as this data is received empty from server */
  /* ============================================================================================================================ */
  updateAssignedBatches(arr: any[]) {
    let batchString: any[] = [];
    this.studentAddFormData.assignedBatches = [];
    this.studentAddFormData.batchJoiningDates = [];
    this.studentAddFormData.assignedBatchescademicYearArray = [];
    this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray = [];
    let temp: any[] = [];
    let tempDate: any[] = [];
    arr.forEach(el => {
      if (el.isSelected) {
        if (this.isProfessional) {
          temp.push(el.data.batch_id.toString());
          tempDate.push(moment(el.assignDate).format('YYYY-MM-DD'));
          batchString.push(el.data.batch_name);
          this.studentAddFormData.assignedBatchescademicYearArray.push(el.data.academic_year_id);
          this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray.push(el.data.selected_fee_template_id);
        }
        else {
          temp.push(el.data.course_id.toString());
          tempDate.push(moment(el.assignDate).format('YYYY-MM-DD'));
          batchString.push(el.data.course_name);
          this.studentAddFormData.assignedBatchescademicYearArray.push(el.data.academic_year_id);
          this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray.push(el.data.selected_fee_template_id);
        }
      }
    });
    this.studentAddFormData.assignedBatches = temp;
    this.studentAddFormData.batchJoiningDates = tempDate;
    this.assignedBatchString = batchString.join(',');
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getSlotName(e): string {
    let temp: string = '';
    this.slots.forEach(el => {
      if (el.value.slot_id == e) {
        temp = el.value.slot_name;
      }
    });
    return temp;
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

  getSettings() {
    let mid = sessionStorage.getItem('manual_student_disp_id');
    if (mid == '1') { this.isManualDisplayId = true; };
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Fetch and store the prefill data to be displayed on dropdown menu */
  fetchPrefillFormData() {

    this.fetchInventoryList();

    this.prefill.getSchoolDetails().subscribe(
      data => { this.instituteList = data; },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    );

    this.getAllocatedHistory();

    this.getFeeStructue();

    this.studentPrefillService.getChequeStatus().subscribe(
      data => {
        this.pdcStatus = data;
      },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    )

    this.getPdcChequeList();

    this.prefill.getEnqStardards().subscribe(
      data => { this.standardList = data; },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    );

    this.prefill.getAllFinancialYear().subscribe(
      (data: any) => {
        this.academicYear = data;
        this.academicYear.forEach(e => {
          if (e.default_academic_year == 1) {
            this.defaultAcadYear = e.inst_acad_year_id;
          }
        });
      },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    )

    this.studentPrefillService.fetchCustomComponentById(this.student_id).subscribe(
      data => {
        if (data != null) {
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
                prefilled_data: this.createPrefilledDataType4(el.prefilled_data.split(','), el.enq_custom_value.split(','), el.defaultValue.split(',')),
                selected: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? this.getDefaultArr(el.defaultValue) : el.enq_custom_value.split(','),
                selectedString: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value,
                type: el.type,
                value: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value
              }
            }
            if (el.type == 3) {
              obj = {
                data: el,
                id: el.component_id,
                is_required: el.is_required,
                is_searchable: el.is_searchable,
                label: el.label,
                prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
                selected: [],
                selectedString: "",
                type: el.type,
                value: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value
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
                value: this.getCustomComponentCheckboxValue(el.enq_custom_value),
              }
            }
            else if (el.type != 2 && el.type != 4 && el.type != 3) {
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
        }
      },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      });
  }

  /* ============================================================================================================================ */
  getCustomComponentCheckboxValue(e): boolean {
    if (e == 'Y') {
      return true;
    }
    else {
      return false;
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getDefaultArr(d): any[] {
    let a: any[] = [];
    a.push(d);
    return a;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  createPrefilledDataType4(dataArr: any[], selected: any[], def: any[]): any[] {
    let customPrefilled: any[] = [];
    if (selected.length != 0 && selected[0] != "") {
      dataArr.forEach(el => {
        let obj = {
          data: el,
          checked: selected.includes(el)
        }
        customPrefilled.push(obj);
      });
    }
    else {
      dataArr.forEach(el => {
        let obj = {
          data: el,
          checked: def.indexOf(el) != -1
        }
        customPrefilled.push(obj);
      });
    }
    return customPrefilled;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  createPrefilledData(dataArr: any[]): any[] {
    let customPrefilled: any[] = [];
    dataArr.forEach(el => {
      let obj = {
        data: el.toLowerCase(),
        checked: false
      }
      //console.log(obj)
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
  updateMasterCourseList(id) {
    this.batchList = [];
    this.studentPrefillService.fetchCourseMasterById(id).subscribe(
      (data: any) => {
        data.coursesList.forEach(el => {
          if (el.feeTemplateList != null && el.feeTemplateList.length != 0 && el.selected_fee_template_id == -1) {
            el.feeTemplateList.forEach(e => {
              if (e.is_default == 1) {
                el.selected_fee_template_id = e.template_id;
              }
            })
          }
          if (el.academic_year_id == '-1') {
            el.academic_year_id = this.defaultAcadYear;
          }
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
  /* Open batch assign popup */
  openAssignBatch() {
    this.isAssignBatch = true;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* close batch assign popup */
  closeBatchAssign() {
    /* batch has been already selected */
    if (this.studentAddFormData.assignedBatches != null && this.studentAddFormData.assignedBatches.length != 0) {
      for (let i in this.batchList) {
        if (this.isProfessional) {
          /* course has been assigned */
          if (this.studentAddFormData.assignedBatches.includes(this.batchList[i].data.batch_id.toString())) {
            this.batchList[i].isSelected = true;
          }
          else {
            this.batchList[i].isSelected = false;
          }
        }
        else {
          /* course has been assigned */
          if (this.studentAddFormData.assignedBatches.includes(this.batchList[i].data.course_id.toString())) {
            this.batchList[i].isSelected = true;
          }
          else {
            this.batchList[i].isSelected = false;
          }
        }
      }
      this.isAssignBatch = false;
    }
    else if (this.studentAddFormData.assignedBatches == null || this.studentAddFormData.assignedBatches.length == 0) {
      for (let i in this.batchList) {
        this.batchList[i].isSelected = false;
      }
      this.isAssignBatch = false;
    }
  }

  /* ============================================================================================================================ */
  /* align the user selected batch into input and update the data into array to be updated to server */
  /* ============================================================================================================================ */
  getassignedBatchList(e) {
    this.studentAddFormData.assignedBatches = e.assignedBatches;
    this.studentAddFormData.batchJoiningDates = e.batchJoiningDates;
    this.studentAddFormData.assignedBatchescademicYearArray = e.assignedBatchescademicYearArray;
    this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray = e.assignedCourse_Subject_FeeTemplateArray;
    this.studentAddFormData.deleteCourse_SubjectUnPaidFeeSchedules = e.deleteCourse_SubjectUnPaidFeeSchedules;
    this.assignedBatchString = e.assignedBatchString;
    this.isAssignBatch = e.isAssignBatch;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getSlots() {
    this.studentPrefillService.fetchSlots().subscribe(
      res => {
        res.forEach(el => {
          let obj = {
            label: el.slot_name,
            value: el,
            status: false
          }
          this.slots.push(obj);
        });
        this.getlangStudentStatus();
        // console.log(this.slots);
      },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    )
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getlangStudentStatus() {
    this.studentPrefillService.fetchLangStudentStatus().subscribe(
      res => {
        this.langStatus = res;
        this.updateSlotsByStudent();
      },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
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
    this.customComponents.forEach(el => {
      if (el.id == id) {
        let x = []
        let y = el.prefilled_data;
        y.forEach(e => {
          if (e.checked) {
            x.push(e.data)
          }
        });
        el.selected = x;
        el.selectedString = el.selected.join(',');
        el.value = el.selectedString;
      }
    });
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
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
    console.log(id);
    if (id == null || id == '') {
      this.courseList = [];
    }
    else {
      /* Fetch Course Mapped to Master Course */
      if (this.isProfessional) {
        this.studentPrefillService.fetchCourseList(id).subscribe(
          res => {
            this.courseList = res;
          }
        )
      }
      /* fetch batch details */
      else {
        this.batchList = [];
        this.studentPrefillService.fetchStudentCourseDetails(this.student_id, id).subscribe(
          res => {
            console.log(res);
            res.coursesList.forEach(el => {
              if (el.feeTemplateList != null && el.feeTemplateList.length != 0 && el.selected_fee_template_id == -1) {
                el.feeTemplateList.forEach(e => {
                  if (e.is_default == 1) {
                    el.selected_fee_template_id = e.template_id;
                  }
                })
              }
              if (el.academic_year_id == '-1') {
                el.academic_year_id = this.defaultAcadYear;
              }
              let obj = {
                isSelected: el.isAssigned == "Y" ? true : false,
                data: el,
                assignDate: this.getAssignDate(el.created_date)
              }
              this.batchList.push(obj);
            });
            console.log(this.batchList);
          },
          err => {
            let msg = err.error.message;
            this.isRippleLoad = false;
            let obj = {
              type: 'error',
              title: msg,
              body: ""
            }
            this.appC.popToast(obj);
          })
      }
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
    this.postService.quickEditStudent(this.studentAddFormData, this.student_id).subscribe(
      (res: any) => {
        let statusCode = res.statusCode;
        if (statusCode == 200) {
          let alert = {
            type: 'success',
            title: 'Student details updated successfully',
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
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
        //console.log(err);
      }
    );
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  clearFormAndMove() {
    this.router.navigate(['/view/student']);
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  clearFormAndRoute(form: NgForm) {
    let previousUrl: string = '';
    if (this.isConvertEnquiry) {
      this.router.navigate(['/view/enquiry']);
    }
    else {
      this.router.navigate(['/view/student']);
    }
  }

  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */

  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* ======================          Student basic details and custom component updaters         =============================================== */
  /* ======================== Methods to update Student details , custom component and dependencies ============================================ */
  /* =========================================================================================================================================== */

  /* ============================================================================================================================ */
  /* Initializer for student admission process */
  /* ============================================================================================================================ */
  addStudentDataAndFetchFee(values: NgForm) {
    this.studentAddnMove = true;
    if (this.isManualDisplayId) {
      if (this.studentAddFormData.student_disp_id.trim() != "") {
        this.studentQuickAdder(values);
      }
      else {
        let obj = {
          type: 'error',
          title: 'Student Roll Number Missing',
          body: "Please provide a valid roll number"
        };
        this.appC.popToast(obj);
      }
    }
    else {
      this.studentQuickAdder(values);
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateStudentForm(id) {
    /* Fetching Student Details from server */
    this.fetchService.getStudentById(id).subscribe(
      (data: any) => {
        this.studentName = data.student_name;
        this.studentAddFormData = data;
        this.studentAddFormData.school_name = data.school_name;
        this.studentAddFormData.student_class = data.student_class_key;
        this.fetchCourseFromMaster(data.standard_id);
        if (this.studentAddFormData.assignedBatchescademicYearArray == null) {
          this.studentAddFormData.assignedBatchescademicYearArray = [];
          this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray = [];
        }
        this.studentServerImage = data.photo;
        /* Fetch Student Fee Realated Data from Server and Allocate Selected Fees */
        this.updateStudentFeeDetails();
        this.isRippleLoad = false;
        this.getCourseDropdown(id);
        if (data.is_active == "Y") {
          this.formIsActive = true;
        }
        /* For Batch Model Fetch the Student Batches */
        if (this.isProfessional) {
          /* Fetching the student Slots */
          this.getSlots();
          this.studentPrefillService.fetchStudentBatchDetails(id).subscribe(
            data => {
              this.batchList = [];
              data.forEach(el => {
                if (el.feeTemplateList != null && el.feeTemplateList.length != 0 && el.selected_fee_template_id == -1) {
                  el.feeTemplateList.forEach(e => {
                    if (e.is_default == 1) {
                      el.selected_fee_template_id = e.template_id;
                    }
                  })
                }
                if (el.academic_year_id == '-1') {
                  el.academic_year_id = this.defaultAcadYear;
                }
                let obj = {
                  isSelected: el.isAssigned == "Y" ? true : false,
                  data: el,
                  assignDate: this.getAssignDate(el.created_date)
                }
                this.batchList.push(obj);
              });
              this.updateAssignedBatches(this.batchList);
            },
            err => {
              let msg = err.error.message;
              this.isRippleLoad = false;
              let obj = {
                type: 'error',
                title: msg,
                body: ""
              }
              this.appC.popToast(obj);
              //alert("Error Fetching Student Batch");
            }
          );

        }
        /* For Course Model fetch the Student Courses */
        else {
          this.studentPrefillService.fetchStudentCourseDetails(id, this.studentAddFormData.standard_id).subscribe(
            res => {
              res.coursesList.forEach(el => {
                if (el.feeTemplateList != null && el.feeTemplateList.length != 0 && el.selected_fee_template_id == -1) {
                  el.feeTemplateList.forEach(e => {
                    if (e.is_default == 1) {
                      el.selected_fee_template_id = e.template_id;
                    }
                  })
                }
                if (el.academic_year_id == '-1') {
                  el.academic_year_id = this.defaultAcadYear;
                }
                console.log(el, 'update form el');
                let obj = {
                  isSelected: el.isAssigned == "Y" ? true : false,
                  data: el,
                  assignDate: this.getAssignDate(el.created_date)
                }
                this.batchList.push(obj);
              });
              this.updateAssignedBatches(this.batchList);
            },
            err => {
              let msg = err.error.message;
              this.isRippleLoad = false;
              let obj = {
                type: 'error',
                title: msg,
                body: ""
              }
              this.appC.popToast(obj);
            }
          );
        }
      },
      err => {
        let al = {
          type: "error",
          title: err.error.message,
          body: ""
        };
        this.appC.popToast(al);
      });
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  formValidator(): boolean {
    if ((!this.commonServiceFactory.checkValueType(this.studentAddFormData.student_name.trim()))
      && this.commonServiceFactory.validatePhone(this.studentAddFormData.student_phone.trim())
    ) {
      return true;
    }
    else {
      return false;
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  studentQuickAdder(form: NgForm) {

    let isCustomComponentValid: boolean = this.customComponents.every(el => { return this.getCustomValid(el); });

    /* Both Form are Valid Else there seems to 
        be an error on custom component */
    if (form.valid && isCustomComponentValid && this.formValidator()) {
      let customArr = [];

      this.customComponents.forEach(el => {
        /* Not Checkbox and value not empty */
        if (el.value != '' && el.type != 2 && el.type != 5) {
          let obj = {
            component_id: el.id,
            enq_custom_id: el.data.enq_custom_id,
            enq_custom_value: el.value
          }
          customArr.push(obj);
        }
        /* Checkbox Custom Component */
        else if (el.type == 2) {
          if (el.value == "Y" || el.value == true) {
            let obj = {
              component_id: el.id,
              enq_custom_id: el.data.enq_custom_id,
              enq_custom_value: "Y"
            }
            customArr.push(obj);
          }
          else if (el.value == "N" || el.value == false) {
            let obj = {
              component_id: el.id,
              enq_custom_id: el.data.enq_custom_id,
              enq_custom_value: "N"
            }
            customArr.push(obj);
          }
        }
        /* Date Type Custom Component */
        else if (el.type == 5 && el.value != "" && el.value != null && el.value != "Invalid date") {
          let obj = {
            component_id: el.id,
            enq_custom_id: el.data.enq_custom_id,
            enq_custom_value: moment(el.value).format("YYYY-MM-DD")
          }
          customArr.push(obj);
        }

      });
      /* Get slot data and store on form */
      this.studentAddFormData.slot_id = this.selectedSlotsID;
      this.studentAddFormData.stuCustomLi = customArr;
      this.studentAddFormData.photo = this.studentServerImage;
      this.additionalBasicDetails = false;
      if (this.studentAddFormData.assignedBatches == null || this.studentAddFormData.assignedBatches.length == 0) {
        this.studentAddFormData.assignedBatches = null
        this.studentAddFormData.assignedBatchescademicYearArray = null;
        this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray = null;
      }
      else if (this.studentAddFormData.assignedBatches != null && this.studentAddFormData.assignedBatches.length != 0) {
        this.studentAddFormData.assignedBatchescademicYearArray;
        this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray;
      }
      this.btnSaveAndContinue.nativeElement.disabled = true;
      this.postService.quickEditStudent(this.studentAddFormData, this.student_id).subscribe(
        (res: any) => {
          this.btnSaveAndContinue.nativeElement.disabled = false;
          let statusCode = res.statusCode;
          if (statusCode == 200) {
            let alert = {
              type: 'success',
              title: 'Student details updated successfully',
              body: ''
            }
            this.appC.popToast(alert);
            this.updateStudentFeeDetails();
            this.navigateTo('feeDetails');
            //this.studentAddedGetFee(this.student_id);
          }
          else if (statusCode == 2) {
            let alert = {
              type: 'error',
              title: 'Contact Number In Use',
              body: 'An enquiry with the same contact number seems to exist'
            }
            form.reset();
            this.removeImage = true;
            this.appC.popToast(alert);
            this.isDuplicateContactOpen();
          }
        },
        err => {
          this.btnSaveAndContinue.nativeElement.disabled = false;
          let msg = err.error.message;
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: msg,
            body: ""
          }
          this.appC.popToast(obj);
        }
      );
    }
    else {
      let alert = {
        type: 'error',
        title: 'Required Fields not filled',
        body: 'Please fill all the required fields'
      }
      this.appC.popToast(alert);

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
        //console.log("institute Added");
      }
      else {
        //console.log("Institute Name already exist!");
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
  getCustomValid(element): boolean {
    if (element.is_required == "Y" && element.value != "") {
      if (element.type == 5) {
        if (element.value != "" && element.value != null && element.value != "Invalid date") {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    }
    else if (element.is_required == "Y" && element.value == "") {
      return false;
    }
    else if (element.is_required == "N") {
      return true;
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  formfullValidator() {
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






  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  studentAddedGetFee(id) {
    this.isRippleLoad = true;
    this.studentPrefillService.fetchStudentFeeDetailById(id).subscribe(
      res => {
        if (res.customFeeSchedules != null) {
          this.isRippleLoad = false;
          this.discountReason = res.discount_fee_reason;
          this.allignStudentFeeView(res);
        }
        else if (res.customFeeSchedules == null) {
          this.isRippleLoad = false;
          this.feeTemplateById = { feeTypeMap: "", customFeeSchedules: [], registeredServiceTax: "", toCreate: "", studentArray: "", studentwise_total_fees_amount: "", studentwise_total_fees_balance_amount: "", studentwise_total_fees_amount_paid: "", studentwise_total_fees_discount: "", studentwise_fees_tax_applicable: "", no_of_installments: "", discount_fee_reason: "", template_name: "", template_id: "", template_effective_date: "", is_fee_schedule_created: "", is_fee_tx_done: "", is_undo: "", is_fee_other_inst_created: "", is_delete_other_fee_types: "", chequeDetailsJson: "", payment_mode: "Cash", remarks: "", paid_date: "", is_cheque_details_required: "", reference_no: "", invoice_no: "", uiSelected: false };
          this.navigateTo('feeDetails');
        }
      },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      });
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  allignStudentFeeView(data) {
    this.isPaymentDetailsValid = false;
    this.feeTemplateById = data;
    this.instalmentTableData = [];
    this.otherFeeTableData = [];
    this.totalFeePaid = 0;
    this.totalDicountAmount = data.studentwise_total_fees_discount;
    this.total_amt_tobe_paid = this.totalFeePaid;
    this.taxEnableCheck = sessionStorage.getItem('enable_tax_applicable_fee_installments');
    this.isDefineFees = false;
    this.isFeeApplied = true;
    if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
      this.service_tax = data.registeredServiceTax;
    }
    else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
      this.service_tax = 0;
    }
    data.customFeeSchedules.forEach(el => {
      if (el.fee_type_name === "INSTALLMENT") {
        this.instalmentTableData.push(el);
      }
      else {
        this.otherFeeTableData.push(el);
      }
    });
    this.updateTableInstallment();
    this.createCustomFeeSchedule();
    this.navigateTo('feeDetails');
  }

  /* ============================================================================================================================ */
  /* If by any chance if duplicate fee is created on backend we need to convert it into unique non repeating structure */
  /* ============================================================================================================================ */
  uniqueConvertFeeJson(res: any[]): any[] {
    let unique = {};
    let distinct = [];
    for (let i in res) {
      if (typeof (unique[res[i].schedule_id]) == "undefined") {
        distinct.push(res[i]);
      }
      unique[res[i].schedule_id] = 0;
    }
    return distinct;
  }

  /* ============================================================================================================================ */
  /* Whenever any changes are made to the fee structure then we need to invoke this method to recalculate amounts on the basis of fee stored on the server */
  /* ============================================================================================================================ */
  updateStudentFeeDetails() {
    this.deselectAllSelectedCheckbox();
    this.installmentMarkedForPayment = []; this.isRippleLoad = true;
    this.totalFeeWithTax = 0; this.totalDicountAmount = 0; this.totalTaxAmount = 0;
    this.totalInitalAmount = 0; this.totalPaidAmount = 0; this.totalAmountPaid = 0;
    this.totalAmountDue = 0; this.totalFeePaid = 0; this.total_amt_tobe_paid = 0;
    this.instalmentTableData = []; this.otherFeeTableData = []; this.userCustommizedFee = [];
    this.isConfigureFees = false; this.isDefineFees = false; this.isFeeApplied = false;
    this.isDiscountApplied = false; this.discountReason = '';

    this.fetchService.fetchStudentFeeDetailById(this.student_id).subscribe(
      res => {
        this.paymentStatusArr = [];
        this.isRippleLoad = false;
        if (res.customFeeSchedules != null) {
          res.customFeeSchedules = this.uniqueConvertFeeJson(res.customFeeSchedules);
          this.totalAmountPaid = res.studentwise_total_fees_amount;
          this.service_tax = res.registeredServiceTax;
          this.discountReason = res.discount_fee_reason;
          if (res.studentwise_total_fees_discount == null) {
            this.totalDicountAmount = 0;
          }
          else if (res.studentwise_total_fees_discount != null) {
            this.totalDicountAmount = res.studentwise_total_fees_discount;
          }

          this.userHasFees = true;
          this.convertCustomizedfee(res.customFeeSchedules);
          this.feeStructureForm.studentArray.push(this.student_id);
          this.feeStructureForm.template_effective_date = res.template_effective_date;

          this.userCustommizedFee = res.customFeeSchedules;
          this.discountReason = res.discount_fee_reason;
          this.userCustommizedFee.forEach(el => {

            el.fees_amount = this.precisionRound(el.fees_amount, -1);
            el.initial_fee_amount = this.precisionRound(el.initial_fee_amount, -1);

            el.due_date = moment(el.due_date).format("YYYY-MM-DD");

            /* Taxes Here */
            if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
              if (el.fee_type_name == "INSTALLMENT") {
                let tax = el.initial_fee_amount * (this.service_tax / 100);
                this.totalTaxAmount += this.precisionRound(tax, -1);
                if (parseInt(el.initial_fee_amount) == parseInt(el.fees_amount)) {
                  el.initial_fee_amount = this.precisionRound(el.fees_amount - tax, -1);
                }
              }
              else {
                let tax = el.initial_fee_amount * (el.service_tax / 100);
                this.totalTaxAmount += this.precisionRound(tax, -1);
              }
            }
            else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
              this.service_tax = 0;
              this.totalTaxAmount = 0;
            }

            if (el.is_referenced == "N") {
              this.totalAmountDue += el.fees_amount
            }

            /* AMount Paid */
            else if (el.is_referenced == "Y") {
              /* Partial Paid */
              if (el.is_partially_paid == 1) {
                this.totalPaidAmount += el.amount_paid;
                this.totalAmountDue += el.balance_amount
              }
              /* Fully Paid */
              else if (el.is_partially_paid == 0) {
                this.totalPaidAmount += el.amount_paid;
              }
            }

            this.totalInitalAmount += parseInt(el.initial_fee_amount);
            this.totalFeeWithTax += parseInt(el.fees_amount);

            let obj = {
              uiSelected: el.is_referenced == "Y" ? true : false,
              isPaid: el.is_referenced == "Y" ? true : false
            }

            this.paymentStatusArr.push(obj);

          });

          this.totalFeeWithTax = this.totalFeeWithTax + this.totalDicountAmount;
          this.feeTemplateById = res;
        }
        else {
          this.totalFeePaid = 0; this.total_amt_tobe_paid = this.totalFeePaid; this.isConfigureFees = false;
          this.instalmentTableData = []; this.userHasFees = false; this.instalmentTableData = [];
          this.userCustommizedFee = []; this.otherFeeTableData = []; this.isPaymentDetailsValid = false;
          this.isDefineFees = false; this.isFeeApplied = false; this.isDiscountApplied = false; this.discountReason = '';
          this.feeTemplateById = { feeTypeMap: "", customFeeSchedules: [], registeredServiceTax: "", toCreate: "", studentArray: "", studentwise_total_fees_amount: "", studentwise_total_fees_balance_amount: "", studentwise_total_fees_amount_paid: "", studentwise_total_fees_discount: "", studentwise_fees_tax_applicable: "", no_of_installments: "", discount_fee_reason: "", template_name: "", template_id: "", template_effective_date: "", is_fee_schedule_created: "", is_fee_tx_done: "", is_undo: this.is_undo, is_fee_other_inst_created: "", is_delete_other_fee_types: "", chequeDetailsJson: "", payment_mode: "", remarks: "", paid_date: "", is_cheque_details_required: "", reference_no: "", invoice_no: "", uiSelected: false };
        }
      },
      err => {
        this.isRippleLoad = false;
        let obj = {
          type: "error",
          title: "Error Fetching Fee Details, Please refresh"
        }
      }
    );
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  convertCustomizedfee(arr: any[]) {
    this.instalmentTableData = [];
    this.otherFeeTableData = [];
    arr.forEach(el => {
      if (el.fee_type_name === "INSTALLMENT") {
        this.instalmentTableData.push(el);
      }
      else {
        this.otherFeeTableData.push(el);
      }
    });
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getTemplateName(id): any {
    let temp: any;
    this.feeTemplateStore.forEach(el => { if (el.template_id == id) { temp = el.template_name } });
    return temp;
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
  getTaxAmounted(fee) {
    if (fee.fee_type_name == "INSTALLMENT") {
      let amount = fee.initial_fee_amount;
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        return this.precisionRound(((this.service_tax / 100) * amount), -1);
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        return 0;
      }
    }
    else {
      let amount = fee.initial_fee_amount;
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        return this.precisionRound(((fee.service_tax / 100) * amount), -1);
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        return 0;
      }
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
    $event.preventDefault();
    this.isPaymentDetailsValid = false;
    this.feeTemplateById = { feeTypeMap: "", customFeeSchedules: [], registeredServiceTax: "", toCreate: "", studentArray: "", studentwise_total_fees_amount: "", studentwise_total_fees_balance_amount: "", studentwise_total_fees_amount_paid: "", studentwise_total_fees_discount: "", studentwise_fees_tax_applicable: "", no_of_installments: "", discount_fee_reason: "", template_name: "", template_id: "", template_effective_date: "", is_fee_schedule_created: "", is_fee_tx_done: "", is_undo: this.is_undo, is_fee_other_inst_created: "", is_delete_other_fee_types: "", chequeDetailsJson: "", payment_mode: "", remarks: "", paid_date: "", is_cheque_details_required: "", reference_no: "", invoice_no: "", uiSelected: false };
    this.instalmentTableData = []; this.otherFeeTableData = []; this.totalDicountAmount = 0; this.discountReason = "";
    let dd = moment(this.feeStructureForm.template_effective_date).format('YYYY-MM-DD');
    /* success */
    if ((this.feeTempSelected != "" && this.feeTempSelected != null) && (dd != "" && dd != null && dd != "Invalid date")) {
      this.feeStructureForm.template_effective_date = dd;
      //console.log(this.feeTempSelected + "   " + this.feeStructureForm);
      this.studentPrefillService.getFeeStructureById(this.feeTempSelected, this.feeStructureForm).subscribe(
        res => {
          this.feeTemplateById = res;
          this.feeTemplateById.template_effective_date = this.feeStructureForm.template_effective_date;
          this.feeTemplateById.template_id = this.feeTempSelected;
          this.isDefineFees = true;
          this.isFeeApplied = true;
          res.customFeeSchedules.forEach(el => {
            el.due_date = new Date(el.due_date);
            /* Taxes Here */
            if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
              this.service_tax = res.registeredServiceTax;
              if (el.fee_type_name == "INSTALLMENT") {
                let tax = el.initial_fee_amount * (this.service_tax / 100);
                this.totalTaxAmount += this.precisionRound(tax, -1);
                if (parseInt(el.initial_fee_amount) == parseInt(el.fees_amount)) {
                  el.initial_fee_amount = this.precisionRound(el.fees_amount - tax, -1);
                }
              }
              else {
                let tax = el.initial_fee_amount * (el.service_tax / 100);
                this.totalTaxAmount += this.precisionRound(tax, -1);
              }
            }
            else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
              this.service_tax = 0;
              this.totalTaxAmount = 0;
            }

            if (el.is_referenced == "N") {
              this.totalAmountDue += el.fees_amount
            }
            else if (el.is_referenced == "Y") {
              this.totalPaidAmount += el.amount_paid;
            }
            this.totalInitalAmount += parseInt(el.initial_fee_amount);
            this.totalFeeWithTax += parseInt(el.fees_amount);
          });
          this.splitCustomizedFee();
          this.totalFeeWithTax = this.totalFeeWithTax + this.totalDicountAmount;
          this.updateTableInstallment();
          this.closeConfigureFees();
        },
        err => {
          let msg = err.error.message;
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: msg,
            body: ""
          }
          this.appC.popToast(obj);
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
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  paymentValueUpdate(bol, id) {
    if (bol) {
      var index = this.installmentMarkedForPayment.indexOf(id);
      if (index > -1) {
        this.installmentMarkedForPayment.splice(index, 1);
      }
      this.installmentMarkedForPayment.push(id);
      this.feeTemplateById.customFeeSchedules[id].is_paid = 1;
      let value = this.feeTemplateById.customFeeSchedules[id].fees_amount;
      this.totalFeePaid += value;
    }
    else {
      var index = this.installmentMarkedForPayment.indexOf(id);
      if (index > -1) {
        this.installmentMarkedForPayment.splice(index, 1);
      }
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
        this.feeTemplateStore = res;
      }
    )
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  openPaymentDetails($event) {
    $event.preventDefault();
    this.feeTemplateById.paid_date = moment().format("YYYY-MM-DD");
    this.feeTemplateById.payment_mode = "Cash";
    this.total_amt_tobe_paid = this.totalFeePaid;
    this.isFeePaymentUpdate = true;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  openPaymentDetailsAndExit($event) {
    $event.preventDefault();
    this.feeTemplateById.paid_date = moment().format("YYYY-MM-DD");
    this.isFeePaymentUpdate = true;
    this.isUpdateFeeAndExit = true;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  closePaymentDetails() {
    this.isFeePaymentUpdate = false;
    this.isPaymentPdc = false;
    this.genPdcAck = false;
    this.sendPdcAck = false;
    this.feeTemplateById.payment_mode = "Cash";
    this.feeTemplateById.paid_date = moment().format("YYYY-MM-DD");
    this.pdcSelectedForm = { bank_name: '', cheque_amount: '', cheque_date: moment().format("YYYY-MM-DD"), cheque_no: '', pdc_cheque_id: '' };
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  clearfeePaymentDate($event) {
    $event.preventDefault();
    this.feeTemplateById.paid_date = "";
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  validatePdcObject(): boolean {
    if (this.pdcSelectedForm.bank_name == '' || this.pdcSelectedForm.bank_name == ' ' || this.pdcSelectedForm.cheque_date == 'Invalid date'
      || this.pdcSelectedForm.cheque_date == '' || this.pdcSelectedForm.bank_name == ' ' || this.pdcSelectedForm.cheque_no == '' || this.pdcSelectedForm.cheque_amount == ''
    ) {
      return false;
    }
    else {
      return true;
    }
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
      if (deci >= 5) {
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
  fetchDiscountData(e) {
    this.discountReason = e.reason;
    this.instalmentTableData = e.installment;

    this.isDiscountApplied = true;
    this.applyDiscountCustomFeeSchedule();
    this.totalDicountAmount = this.totalDicountAmount + parseInt(e.value);
    this.feeTemplateById.studentwise_total_fees_discount = this.totalDicountAmount;
    this.totalAmountDue = this.totalFeeWithTax - this.totalPaidAmount - this.totalDicountAmount;
    this.feeTemplateById.studentwise_total_fees_balance_amount = this.totalAmountDue;

    this.updateDiscount();
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  closeDiscountApply() {
    this.isDiscountApply = false;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateDiscount() {
    let obj = { customFeeSchedules: [], discount_fee_reason: "", is_delete_other_fee_types: 0, is_undo: this.is_undo, studentArray: [], studentwise_fees_tax_applicable: "", studentwise_total_fees_amount: "", studentwise_total_fees_discount: 0, template_effective_date: "", template_id: "" };
    this.isFeeApplied = true;
    this.isPaymentPdc = false;
    obj.customFeeSchedules = this.getFeeStructure(this.feeTemplateById.customFeeSchedules);
    obj.discount_fee_reason = this.discountReason;
    obj.is_undo = this.is_undo;
    obj.studentArray.push(this.student_id);
    obj.studentwise_fees_tax_applicable = this.feeTemplateById.studentwise_fees_tax_applicable;
    obj.studentwise_total_fees_amount = this.totalAmountDue.toString();
    obj.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount;
    obj.template_effective_date = moment(this.feeTemplateById.template_effective_date).format("YYYY-MM-DD");
    obj.template_id = this.feeTemplateById.template_id;

    this.postService.allocateStudentFees(obj).subscribe(
      res => {
        let msg = { type: 'success', title: 'Discount Applied', body: '' }
        this.appC.popToast(msg);
        this.pdcSelectedForm = { bank_name: '', cheque_amount: this.totalFeePaid, cheque_date: moment().format("YYYY-MM-DD"), cheque_no: '', pdc_cheque_id: '' };
        this.isFeeApplied = false;
        this.pdcSelectedForPayment = "";
        this.updateStudentFeeDetails();
        this.closeDiscountApply();
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
    if (confirm("All Changes made to fee template will be discarded!")) {
      this.closeFee = true;
      this.updateStudentFeeDetails();
    }
    else {

    }
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
  reConfigureFees() {
    this.deselectAllSelectedCheckbox();
    this.isDefineFees = true;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  reCreateFeeAgain() {
    if (confirm("By changing the fee template, all existing fee schedule and transactions shall be discarded and archived. Are you sure you want to continue?")) {
      this.isConfigureFees = true;
      this.totalFeePaid = 0;
      this.total_amt_tobe_paid = this.totalFeePaid;
      this.is_undo = 'Y';
      this.paymentStatusArr = [];
      this.feeTemplateById = { feeTypeMap: "", customFeeSchedules: [], registeredServiceTax: "", studentArray: "", studentwise_total_fees_amount: "", studentwise_total_fees_balance_amount: "", studentwise_total_fees_amount_paid: "", studentwise_total_fees_discount: "", studentwise_fees_tax_applicable: "", no_of_installments: "", discount_fee_reason: "", template_name: "", template_id: "", template_effective_date: "", is_fee_schedule_created: "", is_fee_tx_done: "", is_undo: this.is_undo, is_fee_other_inst_created: "", is_delete_other_fee_types: "", chequeDetailsJson: "", payment_mode: "", remarks: "", paid_date: "", toCreate: false, is_cheque_details_required: "", reference_no: "", invoice_no: "", uiSelected: false };
      this.userCustommizedFee = []; this.instalmentTableData = []; this.otherFeeTableData = []; this.isPaymentDetailsValid = false; this.isDefineFees = false; this.isFeeApplied = false; this.isDiscountApplied = false; this.discountReason = '';
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  paymentModeUpdate(e) {
    //
    if (e === 'Cheque/PDC/DD No.') {
      this.isPaymentPdc = true;
      this.pdcSelectedForm = {
        bank_name: '',
        cheque_amount: this.total_amt_tobe_paid,
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
  asssignCustomizedFee(id) {
    let obj = { chequeDetailsJson: {}, customFeeSchedules: [], discount_fee_reason: "", is_delete_other_fee_types: 0, is_undo: this.is_undo, paid_date: "", payment_mode: "", reference_no: "", remarks: "", studentArray: [], studentwise_fees_tax_applicable: "", studentwise_total_fees_amount: "", studentwise_total_fees_discount: 0, template_effective_date: "", template_id: "" };
    if (this.feeTemplateById.payment_mode == 'Cheque/PDC/DD No.') {
      this.pdcSelectedForm.cheque_date = moment(this.pdcSelectedForm.cheque_date).format("YYYY-MM-DD");
      obj.chequeDetailsJson = this.pdcSelectedForm;
      obj.customFeeSchedules = this.getFeeStructure(this.feeTemplateById.customFeeSchedules);
      obj.discount_fee_reason = this.discountReason;
      obj.is_undo = this.is_undo;
      obj.paid_date = this.feeTemplateById.paid_date;
      obj.payment_mode = this.feeTemplateById.payment_mode;
      obj.reference_no = this.feeTemplateById.reference_no;
      obj.remarks = this.feeTemplateById.remarks;
      obj.studentArray.push(id);
      obj.studentwise_fees_tax_applicable = this.feeTemplateById.studentwise_fees_tax_applicable;
      obj.studentwise_total_fees_amount = this.feeTemplateById.studentwise_total_fees_amount;
      obj.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount;
      this.postService.allocateStudentFees(obj).subscribe(
        (res: any) => {
          if (this.genPdcAck || this.sendPdcAck) {
            if (this.genPdcAck) {
              let doc = res;
              let yr = doc.otherDetails.financial_year;
              let id = doc.other;
              let link = document.getElementById("payMultiReciept");
              this.fetchService.getFeeReceiptById(this.student_id, id, yr).subscribe(
                (res: any) => {
                  let body = res;
                  let byteArr = this.convertBase64ToArray(body.document);
                  let format = body.format;
                  let fileName = body.docTitle;
                  let file = new Blob([byteArr], { type: 'application/pdf' });
                  let url = URL.createObjectURL(file);
                  if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
                    link.setAttribute("href", url);
                    link.setAttribute("download", fileName);
                    link.click();
                  }
                },
                e => {
                  let msg = JSON.parse(e._body).message;
                  this.isRippleLoad = false;
                  let obj = {
                    type: 'error',
                    title: msg,
                    body: ""
                  }
                  this.appC.popToast(obj);
                });
            }
            if (this.sendPdcAck) {
              let doc = res;
              let yr = doc.otherDetails.financial_year;
              let id = doc.other;
              this.fetchService.emailReceiptById(this.student_id, id, yr).subscribe(
                res => {
                  let obj = {
                    type: "success",
                    title: "Reciept Sent",
                    body: "Receipt has been sent to student/parent email ID"
                  }
                  this.appC.popToast(obj);
                }
              )
            }
          }
          else {
            this.studentAddedNotifier();
          }
        },
        err => {
          let msg = err.error.message;
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: msg,
            body: ""
          }
          this.appC.popToast(obj);
        }
      );
    }
    else {
      obj.customFeeSchedules = this.getFeeStructure(this.feeTemplateById.customFeeSchedules);
      obj.discount_fee_reason = this.discountReason;
      obj.is_undo = this.is_undo;
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
          this.studentAddedNotifier();
        },
        err => {
          let msg = err.error.message;
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: msg,
            body: ""
          }
          this.appC.popToast(obj);
        }
      );
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  openDiscountApply() {
    this.deselectAllSelectedCheckbox();
    this.isDiscountApply = true;
  }


  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  deselectAllSelectedCheckbox() {
    this.totalFeePaid = 0;
    this.total_amt_tobe_paid = this.totalFeePaid;
    this.installmentMarkedForPayment = [];
    this.paymentStatusArr.forEach(e => { e.uiSelected = false; });
    this.feeTemplateById.customFeeSchedules.forEach(e => {
      if (e.is_referenced == "N") {
        e.is_paid = 0;
      }
    });
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
      if (el.due_date == null) {
        el.due_date = moment().format("YYYY-MM-DD");
      }
      let obj = {
        fee_date: moment(el.due_date).format("YYYY-MM-DD"),
        fee_type: el.fee_type_name === "INSTALLMENT" ? 0 : el.fee_type,
        fees_amount: el.fees_amount,
        initial_fee_amount: el.initial_fee_amount,
        is_paid: this.getPaidStatus(el),
        is_referenced: el.is_referenced,
        schedule_id: el.schedule_id,
        service_tax: el.service_tax,
        service_tax_applicable: el.service_tax_applicable,
        student_fee_template_mapping_id: el.student_fee_template_mapping_id
      }
      temp.push(obj);
    });
    //console.log(temp);
    return temp;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getFeeDiscountStructure(fee: any[]): any[] {
    let temp: any[] = [];

    fee.forEach(el => {
      //console.log(el);
      let obj = {
        fee_date: moment(el.due_date).format("YYYY-MM-DD"),
        fee_type: el.fee_type_name === "INSTALLMENT" ? 0 : el.fee_type,
        fees_amount: el.fees_amount,
        initial_fee_amount: el.initial_fee_amount,
        is_paid: this.getPaidStatus(el),
        service_tax: el.service_tax,
        service_tax_applicable: el.service_tax_applicable,
      }
      temp.push(obj);
    });
    //console.log(temp);
    return temp;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  addNewPDCState() {
    //console.log(this.pdcAddForm);
    let obj = { bank_name: this.pdcAddForm.bank_name, cheque_amount: this.pdcAddForm.cheque_amount, cheque_date: moment(this.pdcAddForm.cheque_date).format("YYYY-MM-DD"), cheque_id: this.pdcAddForm.cheque_id, cheque_no: this.pdcAddForm.cheque_no, cheque_status: this.pdcAddForm.cheque_status, cheque_status_key: this.pdcAddForm.cheque_status_key, clearing_date: moment(this.pdcAddForm.clearing_date).format("YYYY-MM-DD"), institution_id: sessionStorage.getItem('institute_id'), student_id: this.student_id };
    if (this.validPdc(obj)) {
      this.newPdcArr.push(obj);
      this.addPdcDataToServer();
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  validPdc(obj): boolean {
    if (obj.cheque_date == 'Invalid date' || obj.cheque_date == '' || obj.cheque_no.toString().length != 6 || obj.cheque_amount <= 0) {
      if (obj.cheque_date == 'Invalid date' || obj.cheque_date == '') {
        let msg = { type: 'error', title: 'Invalid Cheque Details', body: 'Please enter a valid cheque date' };
        this.appC.popToast(msg);
      }
      if (obj.cheque_no.toString().length != 6) {
        let msg = { type: 'error', title: 'Invalid Cheque Details', body: 'Please enter a valid cheque number' };
        this.appC.popToast(msg);
      }
      if (obj.cheque_amount <= 0) {
        let msg = { type: 'error', title: 'Invalid Cheque Details', body: 'Please enter a valid amount' };
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
          let obj = { bank_name: el.bank_name, cheque_amount: el.cheque_amount, cheque_date: el.cheque_date, cheque_date_from: el.cheque_date_from, cheque_date_to: el.cheque_date_from, cheque_id: el.cheque_id, cheque_no: el.cheque_no, cheque_status: el.cheque_status, cheque_status_key: el.cheque_status_key, clearing_date: el.clearing_date, genAck: el.genAck, institution_id: el.institution_id, sendAck: el.sendAck, student_id: el.student_id, student_name: el.student_name, student_phone: el.student_phone, uiSelected: false };
          temp.push(obj);
        });
        this.chequePdcList = temp;
      }
    )

  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  addPdcDataToServer() {
    let temp: any[] = [];
    this.newPdcArr.forEach(e => {
      let obj = { cheque_no: e.cheque_no, bank_name: e.bank_name, cheque_date: e.cheque_date, student_id: this.student_id, clearing_date: e.clearing_date, institution_id: sessionStorage.getItem('institute_id'), cheque_amount: e.cheque_amount, genAck: this.genPdcAck === true ? "Y" : "N", sendAck: this.sendPdcAck === true ? "Y" : "N" };
      temp.push(obj);
    });
    this.newPdcArr = [];
    this.genPdcAck = false;
    this.sendPdcAck = false;
    this.postService.addChequePdc(temp).subscribe(
      res => {
        this.chequePdcList = [];
        this.newPdcArr = [];
        this.pdcAddForm = { bank_name: '', cheque_amount: '', cheque_date: '', cheque_id: 0, cheque_no: '', cheque_status: '', cheque_status_key: 0, clearing_date: '', institution_id: sessionStorage.getItem('institute_id'), student_id: 0 };
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
      let obj = { bank_name: el.bank_name, cheque_amount: el.cheque_amount, cheque_date: moment(el.cheque_date).format("YYYY-MM-DD"), cheque_id: el.cheque_id, cheque_no: el.cheque_no, cheque_status_key: el.cheque_status_key, clearing_date: moment(el.clearing_date).format("YYYY-MM-DD"), institution_id: sessionStorage.getItem('institute_id'), student_id: el.student_id };
      this.postService.updateFeeDetails(obj).subscribe(
        res => {
          this.pdcStatus.forEach(e => { if (e.cheque_status_key == el.cheque_status_key) { el.cheque_status = e.cheque_status } });
          document.getElementById((el.student_id + el.cheque_id).toString()).classList.add('displayComp');
          document.getElementById((el.student_id + el.cheque_id).toString()).classList.remove('editComp');
        },
        err => {
          let msg = err.error.message;
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: msg,
            body: ""
          }
          this.appC.popToast(obj);
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
          let msg = err.error.message;
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: msg,
            body: ""
          }
          this.appC.popToast(obj);
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

  /* ============================================================================================================================ */
  closePDCPop() {
    this.selectedCheque = null;
    this.isPdcApply = false
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  generateAck() {
    let selectedChqueId = this.getSelectedRow(this.chequePdcList);
    if (selectedChqueId != null && selectedChqueId != undefined && selectedChqueId.length > 0) {
      let chequeId = selectedChqueId.join(',');
      this.isRippleLoad = true;
      this.postService.generateAcknowledge(chequeId, this.student_id, "undefined").subscribe(
        res => {
          this.isRippleLoad = false;
          let byteArr = this.convertBase64ToArray(res.document);
          let format = res.format;
          let fileName = res.docTitle;
          let file = new Blob([byteArr], { type: 'data/pdf' });
          let url = URL.createObjectURL(file);
          let dwldLink = document.getElementById('hiddenAnchorAck');
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", fileName);
          document.body.appendChild(dwldLink);
          dwldLink.click();
        },
        err => {
          this.isRippleLoad = false;
          let msg = JSON.parse(err._body).message;
          let obj = {
            type: 'error',
            title: msg,
            body: ""
          }
          this.appC.popToast(obj);
        }
      )
    }
    else {
      let obj = {
        type: "error",
        title: "No PDC Selected",
        body: ""
      }
      this.appC.popToast(obj);
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  sendAck() {
    let selectedChqueId = this.getSelectedRow(this.chequePdcList);
    if (selectedChqueId != null && selectedChqueId != undefined && selectedChqueId.length > 0) {
      let chequeId = selectedChqueId.join(',');
      this.isRippleLoad = true;
      this.postService.generateAcknowledge(chequeId, this.student_id, "Y").subscribe(
        res => {
          this.isRippleLoad = false;
          let msg = { type: 'success', title: 'Send Successfullly', body: '' };
          this.appC.popToast(msg);
        },
        err => {
          this.isRippleLoad = false;
          let msg = err.error.message;
          let obj = { type: 'error', title: msg, body: "" };
          this.appC.popToast(obj);
        }
      )
    } else {
      let obj = {
        type: "error",
        title: "No PDC Selected",
        body: ""
      }
      this.appC.popToast(obj);
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  setImage(e) {
    this.studentServerImage = e;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  printFee() {
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  feePdcSelected(obj) {
    if (obj === '') {
      this.isPdcFeePaymentSelected = false;
      this.pdcSelectedForm = { bank_name: '', cheque_amount: this.totalFeePaid, cheque_date: moment().format("YYYY-MM-DD"), cheque_no: '', pdc_cheque_id: '' };
    }
    else {
      this.chequePdcList.forEach(el => {
        if (obj == el.cheque_id) {
          this.pdcSelectedForm = { bank_name: el.bank_name, cheque_amount: el.cheque_amount, cheque_date: moment(el.cheque_date).format("YYYY-MM-DD"), cheque_no: el.cheque_no, pdc_cheque_id: el.cheque_id };
          this.isPdcFeePaymentSelected = true;
        }
      });
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Converts base64 string into a byte[] */
  convertBase64ToArray(val) {

    var binary_string = window.atob(val);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  downloadFeeReceipt(ins) {
    let yr: any;
    let link = document.getElementById("downloadEditFeeReciept" + ins.invoice_no);

    if (ins.financial_year == null) {
      ins.financial_year = this.defaultAcadYear
    }
    this.academicYear.forEach(e => {
      if (ins.financial_year == e.inst_acad_year_id) {
        yr = e.inst_acad_year
      }
    });

    this.fetchService.getFeeReceiptById(this.student_id, ins.invoice_no, yr).subscribe(
      (res: any) => {
        let body = res;
        let byteArr = this.convertBase64ToArray(body.document);
        let format = body.format;
        let fileName = body.docTitle;
        let file = new Blob([byteArr], { type: 'application/pdf' });
        let url = URL.createObjectURL(file);
        if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
          link.setAttribute("href", url);
          link.setAttribute("download", fileName);
          link.click();
        }
      },
      err => {
        let msg = JSON.parse(err._body).message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    )

  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  emailFeeReceipt(ins) {
    let yr: any;

    if (ins.financial_year == null) {
      ins.financial_year = this.defaultAcadYear
    }
    this.academicYear.forEach(e => {
      if (ins.financial_year == e.inst_acad_year_id) {
        yr = e.inst_acad_year
      }
    });

    this.fetchService.emailReceiptById(this.student_id, ins.invoice_no, yr).subscribe(
      (res: any) => {
        let body = res;
        let obj = {
          type: "success",
          title: "Reciept Sent",
          body: "Receipt has been sent to student/parent email ID"
        }
        this.appC.popToast(obj);
      }
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  openPartialPayment(ins) {
    this.partialPaySelected = ins;
    this.totalFeePaid = ins.balance_amount;
    this.total_amt_tobe_paid = this.totalFeePaid;
    this.isPartialPayment = true;
    //this.deselectAllSelectedCheckbox();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  closePartialPayment() {
    this.isPaymentPdc = false;
    this.feeTemplateById.payment_mode = "Cash";
    this.feeTemplateById.paid_date = moment().format("YYYY-MM-DD");
    this.isFeePaymentUpdate = false;
    this.partialPayObj.paymentMode = "Cash";
    this.totalFeePaid = 0;
    this.partialPaySelected = null;
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
  getPaidFullVal(): string {
    if (this.partialPaySelected.balance_amount > this.total_amt_tobe_paid) {
      return "N"
    } else {
      return "Y";
    }
  }

  validateLastAcadYear() {
    let acadConfirmation: boolean = false;
    if (this.installmentMarkedForPayment.length > 0) {
      for (let i = 0; i < this.installmentMarkedForPayment.length; i++) {
        let t = this.installmentMarkedForPayment[i];
        if (this.feeTemplateById.customFeeSchedules[t].due_date != "" && this.feeTemplateById.customFeeSchedules[t].due_date != null) {
          if (moment(this.feeTemplateById.customFeeSchedules[t].due_date).format('YYYY-MM-DD') <= moment('2018-03-31').format('YYYY-MM-DD')) {
            acadConfirmation = true;
            break;
          } else {
            acadConfirmation = false;
          }
        }
      }
    }
    return acadConfirmation;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  payPartial() {
    /* Error */
    if (this.feeTemplateById.paid_date == null && this.feeTemplateById.payment_mode == null) {
      let msg = { type: 'error', title: 'Payment Date and Mode Missing', body: 'Please fill in the payment date and mode of payment' };
      this.appC.popToast(msg);
    }
    /* Error */
    else if (this.feeTemplateById.paid_date != null && this.feeTemplateById.payment_mode == null) {
      let msg = { type: 'error', title: 'Payment Mode Missing', body: 'Please fill in the mode of payment' };
      this.appC.popToast(msg);
    }
    /* Error */
    else if (this.feeTemplateById.paid_date == null && this.feeTemplateById.payment_mode != null) {
      let msg = { type: 'error', title: 'Payment Date Missing', body: 'Please fill in the payment date ' };
      this.appC.popToast(msg);
    }
    else {
      let acadConfirmation: boolean = this.validateLastAcadYear();
      if (acadConfirmation) {
        if (confirm('You are about to update fee installment of last financial year. Are you sure you want to continue?')) {
          this.makePaymentCall();
        }
      } else {
        this.makePaymentCall();
      }
    }
  }

  makePaymentCall() {
    /* PDC data to be verified */
    if (this.feeTemplateById.payment_mode == 'Cheque/PDC/DD No.') {
      if (this.validatePdcObject()) {
        let obj = { chequeDetailsJson: {}, paid_date: "", paymentMode: "", reference_no: "", remarks: "", studentFeeReportJsonList: [], student_id: this.student_id, };
        this.pdcSelectedForm.cheque_date = moment(this.pdcSelectedForm.cheque_date).format("YYYY-MM-DD");
        obj.chequeDetailsJson = this.pdcSelectedForm;
        obj.paid_date = moment(this.feeTemplateById.paid_date).format("YYYY-MM-DD");
        obj.paymentMode = this.feeTemplateById.payment_mode;
        obj.reference_no = this.feeTemplateById.reference_no;
        obj.remarks = this.feeTemplateById.remarks;
        this.isFeeApplied = true;
        this.isPaymentPdc = false;
        obj.studentFeeReportJsonList = this.getStudentFeeReportJsonList();
        this.isRippleLoad = true;
        this.postService.payPartialFeeAmount(obj).subscribe(
          res => {
            if (this.genPdcAck || this.sendPdcAck) {
              if (this.genPdcAck) {
                let doc = res;
                let yr = doc.otherDetails.financial_year;
                let id = doc.other;
                let link = document.getElementById("payMultiReciept");
                this.fetchService.getFeeReceiptById(this.student_id, id, yr).subscribe(
                  (res: any) => {
                    let body = res;
                    let byteArr = this.convertBase64ToArray(body.document);
                    let format = body.format;
                    let fileName = body.docTitle;
                    let file = new Blob([byteArr], { type: 'application/pdf' });
                    let url = URL.createObjectURL(file);
                    if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
                      link.setAttribute("href", url);
                      link.setAttribute("download", fileName);
                      link.click();
                    }
                  },
                  e => {
                    let msg = JSON.parse(e._body).message;
                    this.isRippleLoad = false;
                    let obj = {
                      type: 'error',
                      title: msg,
                      body: ""
                    }
                    this.appC.popToast(obj);
                  });
              }
              if (this.sendPdcAck) {
                let doc = res;
                let yr = doc.otherDetails.financial_year;
                let id = doc.other;
                this.fetchService.emailReceiptById(this.student_id, id, yr).subscribe(
                  res => {
                    let obj = {
                      type: "success",
                      title: "Reciept Sent",
                      body: "Receipt has been sent to student/parent email ID"
                    }
                    this.appC.popToast(obj);
                  }
                )
              }
            }
            this.getPdcChequeList();
            this.updateStudentFeeDetails();
            this.isRippleLoad = false;
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
            this.closePaymentDetails();
          },
          err => {
            let msg = err.error.message;
            this.isRippleLoad = false;
            let obj = {
              type: 'error',
              title: msg,
              body: ""
            }
            this.appC.popToast(obj);
            this.pdcSelectedForm = {
              bank_name: '',
              cheque_amount: this.totalFeePaid,
              cheque_date: moment().format("YYYY-MM-DD"),
              cheque_no: '',
              pdc_cheque_id: ''
            }
            this.isFeeApplied = false;
            this.pdcSelectedForPayment = "";
            this.isFeePaymentUpdate = false;
            this.feeTemplateById.payment_mode = "Cash";
            this.feeTemplateById.paid_date = moment().format("YYYY-MM-DD");
          }
        );
      }
      else {
        let msg = { type: 'error', title: 'Incorrect PDC/Cheque Details', body: 'Please provide correct input for the cheque data' };
        this.appC.popToast(msg);
      }
    }
    else {
      let obj = { chequeDetailsJson: {}, paid_date: "", paymentMode: "", reference_no: "", remarks: "", studentFeeReportJsonList: [], student_id: this.student_id, };
      obj.paid_date = moment(this.feeTemplateById.paid_date).format("YYYY-MM-DD");
      obj.paymentMode = this.feeTemplateById.payment_mode;
      obj.reference_no = this.feeTemplateById.reference_no;
      obj.remarks = this.feeTemplateById.remarks;
      this.isFeeApplied = true;
      this.isPaymentPdc = false;
      obj.studentFeeReportJsonList = this.getStudentFeeReportJsonList();
      this.isRippleLoad = true;
      this.postService.payPartialFeeAmount(obj).subscribe(
        res => {
          if (this.genPdcAck || this.sendPdcAck) {
            if (this.genPdcAck) {
              let doc = res;
              let yr = doc.otherDetails.financial_year;
              let id = doc.other;
              let link = document.getElementById("payMultiReciept");
              this.fetchService.getFeeReceiptById(this.student_id, id, yr).subscribe(
                (res: any) => {
                  let body = res;
                  let byteArr = this.convertBase64ToArray(body.document);
                  let format = body.format;
                  let fileName = body.docTitle;
                  let file = new Blob([byteArr], { type: 'application/pdf' });
                  let url = URL.createObjectURL(file);
                  if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
                    link.setAttribute("href", url);
                    link.setAttribute("download", fileName);
                    link.click();
                  }
                },
                e => {
                  let msg = JSON.parse(e._body).message;
                  this.isRippleLoad = false;
                  let obj = {
                    type: 'error',
                    title: msg,
                    body: ""
                  }
                  this.appC.popToast(obj);
                });
            }
            if (this.sendPdcAck) {
              let doc = res;
              let yr = doc.otherDetails.financial_year;
              let id = doc.other;
              this.fetchService.emailReceiptById(this.student_id, id, yr).subscribe(
                res => {
                  let obj = {
                    type: "success",
                    title: "Reciept Sent",
                    body: "Receipt has been sent to student/parent email ID"
                  }
                  this.appC.popToast(obj);
                }
              )
            }
          }
          this.updateStudentFeeDetails();
          this.isRippleLoad = false;
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
          this.getPdcChequeList();
          this.closePaymentDetails();
        },
        err => {
          let msg = err.error.message;
          this.isRippleLoad = false;
          let obj = {
            type: 'error',
            title: msg,
            body: ""
          }
          this.appC.popToast(obj);
        }
      );

    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  payOnePartial() {
    /* Error */
    if (this.partialPayObj.paid_date == null && this.partialPayObj.paymentMode == null) {
      let msg = { type: 'error', title: 'Payment Date and Mode Missing', body: 'Please fill in the payment date and mode of payment' };
      this.appC.popToast(msg);
    }
    /* Error */
    else if (this.partialPayObj.paid_date != null && this.partialPayObj.paymentMode == null) {
      let msg = { type: 'error', title: 'Payment Mode Missing', body: 'Please fill in the mode of payment' };
      this.appC.popToast(msg);
    }
    /* Error */
    else if (this.partialPayObj.paid_date == null && this.partialPayObj.paymentMode != null) {
      let msg = { type: 'error', title: 'Payment Date Missing', body: 'Please fill in the payment date ' };
      this.appC.popToast(msg);
    }
    else {
      /* PDC data to be verified */
      if (this.partialPayObj.paymentMode == 'Cheque/PDC/DD No.') {
        if (this.validatePdcObject()) {
          let obj = { chequeDetailsJson: {}, paid_date: "", paymentMode: "", reference_no: "", remarks: "", studentFeeReportJsonList: [], student_id: this.student_id, };
          this.pdcSelectedForm.cheque_date = moment(this.pdcSelectedForm.cheque_date).format("YYYY-MM-DD");
          obj.chequeDetailsJson = this.pdcSelectedForm;
          this.studentFeeReportObj = {
            due_date: this.partialPaySelected.due_date,
            fee_schedule_id: this.partialPaySelected.schedule_id,
            paid_full: this.getPaidFullVal(),
            previous_balance_amt: this.partialPaySelected.balance_amount,
            total_amt_paid: this.total_amt_tobe_paid
          }
          obj.paid_date = moment(this.partialPayObj.paid_date).format("YYYY-MM-DD");
          obj.paymentMode = this.partialPayObj.paymentMode;
          obj.reference_no = this.partialPayObj.reference_no;
          obj.remarks = this.partialPayObj.remarks;
          this.isFeeApplied = true;
          this.isPaymentPdc = false;
          obj.studentFeeReportJsonList.push(this.studentFeeReportObj);
          this.isRippleLoad = true;
          this.postService.payPartialFeeAmount(obj).subscribe(
            res => {
              if (this.genPdcAck || this.sendPdcAck) {
                if (this.genPdcAck) {
                  let doc = res;
                  let yr = doc.otherDetails.financial_year;
                  let id = doc.other;
                  let link = document.getElementById("payMultiReciept");
                  this.fetchService.getFeeReceiptById(this.student_id, id, yr).subscribe(
                    (res: any) => {
                      let body = res;
                      let byteArr = this.convertBase64ToArray(body.document);
                      let format = body.format;
                      let fileName = body.docTitle;
                      let file = new Blob([byteArr], { type: 'application/pdf' });
                      let url = URL.createObjectURL(file);
                      if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
                        link.setAttribute("href", url);
                        link.setAttribute("download", fileName);
                        link.click();
                      }
                    },
                    e => {
                      let msg = JSON.parse(e._body).message;
                      this.isRippleLoad = false;
                      let obj = {
                        type: 'error',
                        title: msg,
                        body: ""
                      }
                      this.appC.popToast(obj);
                    });
                }
                if (this.sendPdcAck) {
                  let doc = res;
                  let yr = doc.otherDetails.financial_year;
                  let id = doc.other;
                  this.fetchService.emailReceiptById(this.student_id, id, yr).subscribe(
                    res => {
                      let obj = {
                        type: "success",
                        title: "Reciept Sent",
                        body: "Receipt has been sent to student/parent email ID"
                      }
                      this.appC.popToast(obj);
                    }
                  )
                }
              }
              this.updateStudentFeeDetails();
              this.isRippleLoad = false;
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
              this.getPdcChequeList();
              this.closePartialPayment();
            },
            err => {
              this.isRippleLoad = false;
              let msg = err.error.message;
              this.isRippleLoad = false;
              let obj = {
                type: 'error',
                title: msg,
                body: ""
              }
              this.appC.popToast(obj);
              this.pdcSelectedForm = {
                bank_name: '',
                cheque_amount: this.totalFeePaid,
                cheque_date: moment().format("YYYY-MM-DD"),
                cheque_no: '',
                pdc_cheque_id: ''
              }
              this.isFeeApplied = false;
              this.pdcSelectedForPayment = "";
              this.isFeePaymentUpdate = false;
              this.feeTemplateById.payment_mode = "Cash";
              this.feeTemplateById.paid_date = moment().format("YYYY-MM-DD");
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
        let obj = { chequeDetailsJson: {}, paid_date: "", paymentMode: "", reference_no: "", remarks: "", studentFeeReportJsonList: [], student_id: this.student_id, };

        this.studentFeeReportObj = {
          due_date: this.partialPaySelected.due_date,
          fee_schedule_id: this.partialPaySelected.schedule_id,
          paid_full: this.getPaidFullVal(),
          previous_balance_amt: this.partialPaySelected.balance_amount,
          total_amt_paid: this.total_amt_tobe_paid
        }

        obj.paid_date = moment(this.partialPayObj.paid_date).format("YYYY-MM-DD");
        obj.paymentMode = this.partialPayObj.paymentMode;
        obj.reference_no = this.partialPayObj.reference_no;
        obj.remarks = this.partialPayObj.remarks;
        this.isFeeApplied = true;
        this.isPaymentPdc = false;
        obj.studentFeeReportJsonList.push(this.studentFeeReportObj);
        this.isRippleLoad = true;
        this.postService.payPartialFeeAmount(obj).subscribe(
          res => {
            if (this.genPdcAck || this.sendPdcAck) {
              if (this.genPdcAck) {
                let doc = res;
                let yr = doc.otherDetails.financial_year;
                let id = doc.other;
                let link = document.getElementById("payMultiReciept");
                this.fetchService.getFeeReceiptById(this.student_id, id, yr).subscribe(
                  (res: any) => {
                    let body = res;
                    let byteArr = this.convertBase64ToArray(body.document);
                    let format = body.format;
                    let fileName = body.docTitle;
                    let file = new Blob([byteArr], { type: 'application/pdf' });
                    let url = URL.createObjectURL(file);
                    if (link.getAttribute('href') == "" || link.getAttribute('href') == null) {
                      link.setAttribute("href", url);
                      link.setAttribute("download", fileName);
                      link.click();
                    }
                  },
                  e => {
                    let msg = JSON.parse(e._body).message;
                    this.isRippleLoad = false;
                    let obj = {
                      type: 'error',
                      title: msg,
                      body: ""
                    }
                    this.appC.popToast(obj);
                  });
              }
              if (this.sendPdcAck) {
                let doc = res;
                let yr = doc.otherDetails.financial_year;
                let id = doc.other;
                this.fetchService.emailReceiptById(this.student_id, id, yr).subscribe(
                  res => {
                    let obj = {
                      type: "success",
                      title: "Reciept Sent",
                      body: "Receipt has been sent to student/parent email ID"
                    }
                    this.appC.popToast(obj);
                  }
                )
              }
            }
            this.updateStudentFeeDetails();
            this.isRippleLoad = false;
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
            this.getPdcChequeList();
            this.closePartialPayment();
          },
          err => {
            let msg = err.error.message;
            this.isRippleLoad = false;
            let obj = {
              type: 'error',
              title: msg,
              body: ""
            }
            this.appC.popToast(obj);
          }
        );
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  totalPartialChange(e, v) {
    if (v == "payone") {
      if (e > this.totalFeePaid) {
        let obj = { type: "warning", title: "Invalid Payment Amount", body: "" };
        this.appC.popToast(obj);
        this.total_amt_tobe_paid = this.totalFeePaid;
        this.pdcSelectedForm.cheque_amount = this.totalFeePaid;
      }
      else {
        this.pdcSelectedForm.cheque_amount = this.total_amt_tobe_paid;
      }
    }
    else if (v == "pay") {
      if (e > this.totalFeePaid) {
        let obj = { type: "warning", title: "Invalid Payment Amount", body: "" };
        this.appC.popToast(obj);
        this.total_amt_tobe_paid = this.totalFeePaid;
        this.pdcSelectedForm.cheque_amount = this.totalFeePaid;
      }
      else {
        this.pdcSelectedForm.cheque_amount = this.total_amt_tobe_paid;
      }
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  splitCustomizedFee() {
    this.instalmentTableData = [];
    this.otherFeeTableData = [];
    this.feeTemplateById.customFeeSchedules.forEach(el => {
      el.due_date = new Date(el.due_date);
      if (el.fee_type_name === "INSTALLMENT") {
        this.instalmentTableData.push(el);
      }
      else if (el.fee_type_name != "INSTALLMENT") {
        this.otherFeeTableData.push(el);
      }
    });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */

  fetchCustomFeeSchedule(e) {
    this.isRippleLoad = true;
    this.userCustommizedFee = e;
    this.totalTaxAmount = 0;
    this.totalInitalAmount = 0;
    this.totalFeeWithTax = 0;
    this.totalAmountDue = 0;
    this.totalPaidAmount = 0;
    this.totalFeePaid = 0;

    this.userCustommizedFee.forEach(el => {
      el.due_date = moment(el.due_date).format("YYYY-MM-DD");
      el.fees_amount = parseInt(el.fees_amount);
      el.initial_fee_amount = parseInt(el.initial_fee_amount);

      /* Taxes Here */
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        if (el.fee_type_name == "INSTALLMENT") {
          let tax = el.initial_fee_amount * (this.service_tax / 100);
          this.totalTaxAmount += this.precisionRound(tax, -1);
          if (parseInt(el.initial_fee_amount) == parseInt(el.fees_amount)) {
            el.initial_fee_amount = this.precisionRound(el.fees_amount - tax, -1);
          }
        }
        else {
          let tax = el.initial_fee_amount * (el.service_tax / 100);
          this.totalTaxAmount += this.precisionRound(tax, -1);
          if (parseInt(el.initial_fee_amount) == parseInt(el.fees_amount)) {
            el.initial_fee_amount = this.precisionRound(el.fees_amount - tax, -1);
          }
        }
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        this.service_tax = 0;
        this.totalTaxAmount = 0;
      }

      if (el.is_referenced == "N") {
        this.totalAmountDue += el.fees_amount
      }

      /* AMount Paid */
      else if (el.is_referenced == "Y") {
        /* Partial Paid */
        if (el.is_partially_paid == 1) {
          this.totalPaidAmount += el.amount_paid;
          this.totalAmountDue += el.balance_amount
        }
        /* Fully Paid */
        else if (el.is_partially_paid == 0) {
          this.totalPaidAmount += el.amount_paid;
        }
      }

      this.totalInitalAmount += parseInt(el.initial_fee_amount);
      this.totalFeeWithTax += parseInt(el.fees_amount);

      let obj = {
        uiSelected: el.is_referenced == "Y" ? true : false,
        isPaid: el.is_referenced == "Y" ? true : false
      }

      this.paymentStatusArr.push(obj);

    });

    this.totalFeeWithTax = this.totalFeeWithTax + this.totalDicountAmount;

    this.feeTemplateById.studentwise_total_fees_amount = this.totalFeeWithTax;
    this.feeTemplateById.studentwise_total_fees_amount_paid = this.totalPaidAmount;
    this.feeTemplateById.studentwise_total_fees_balance_amount = this.totalFeeWithTax - this.totalPaidAmount;
    this.feeTemplateById.customFeeSchedules = this.userCustommizedFee;

    let obj = { customFeeSchedules: [], discount_fee_reason: "", is_delete_other_fee_types: 0, is_undo: this.is_undo, studentArray: [], studentwise_fees_tax_applicable: "", studentwise_total_fees_amount: "", studentwise_total_fees_discount: 0, template_effective_date: "", template_id: "" };

    this.isFeeApplied = true;
    this.isPaymentPdc = false;
    obj.customFeeSchedules = this.getFeeStructure(this.userCustommizedFee);
    obj.discount_fee_reason = this.discountReason;
    obj.is_undo = this.is_undo;
    obj.studentArray.push(this.student_id);
    obj.studentwise_fees_tax_applicable = this.feeTemplateById.studentwise_fees_tax_applicable;
    obj.studentwise_total_fees_amount = this.totalAmountDue.toString();
    obj.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount;
    obj.template_effective_date = moment(this.feeTemplateById.template_effective_date).format("YYYY-MM-DD");
    obj.template_id = this.feeTemplateById.template_id;

    this.postService.allocateStudentFees(obj).subscribe(
      res => {
        this.splitCustomizedFee();
        this.updateStudentFeeDetails();
        this.userHasFees = true;
        this.isRippleLoad = false;
        this.isDefineFees = false;
      },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    );

  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  createCustomFeeSchedule() {
    this.isRippleLoad = true;

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
    this.totalTaxAmount = 0;
    this.totalInitalAmount = 0;
    this.totalFeeWithTax = 0;
    this.totalAmountDue = 0;
    this.totalPaidAmount = 0;
    this.totalFeePaid = 0;

    this.userCustommizedFee.forEach(el => {
      el.due_date = moment(el.due_date).format("YYYY-MM-DD");
      el.fees_amount = parseInt(el.fees_amount);
      el.initial_fee_amount = parseInt(el.initial_fee_amount);

      /* Taxes Here */
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
        if (el.fee_type_name == "INSTALLMENT") {
          let tax = el.initial_fee_amount * (this.service_tax / 100);
          this.totalTaxAmount += this.precisionRound(tax, -1);
          if (parseInt(el.initial_fee_amount) == parseInt(el.fees_amount)) {
            el.initial_fee_amount = this.precisionRound(el.fees_amount - tax, -1);
          }
        }
        else {
          let tax = el.initial_fee_amount * (el.service_tax / 100);
          this.totalTaxAmount += this.precisionRound(tax, -1);
          if (parseInt(el.initial_fee_amount) == parseInt(el.fees_amount)) {
            el.initial_fee_amount = this.precisionRound(el.fees_amount - tax, -1);
          }
        }
      }
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
        this.service_tax = 0;
        this.totalTaxAmount = 0;
      }

      if (el.is_referenced == "N") {
        this.totalAmountDue += el.fees_amount
      }

      /* AMount Paid */
      else if (el.is_referenced == "Y") {
        /* Partial Paid */
        if (el.is_partially_paid == 1) {
          this.totalPaidAmount += el.amount_paid;
          this.totalAmountDue += el.balance_amount
        }
        /* Fully Paid */
        else if (el.is_partially_paid == 0) {
          this.totalPaidAmount += el.amount_paid;
        }
      }

      this.totalInitalAmount += parseInt(el.initial_fee_amount);
      this.totalFeeWithTax += parseInt(el.fees_amount);

      let obj = {
        uiSelected: el.is_referenced == "Y" ? true : false,
        isPaid: el.is_referenced == "Y" ? true : false
      }

      this.paymentStatusArr.push(obj);

    });

    this.totalFeeWithTax = this.totalFeeWithTax + this.totalDicountAmount;

    this.feeTemplateById.studentwise_total_fees_amount = this.totalFeeWithTax;
    this.feeTemplateById.studentwise_total_fees_amount_paid = this.totalPaidAmount;
    this.feeTemplateById.studentwise_total_fees_balance_amount = this.totalFeeWithTax - this.totalPaidAmount;
    this.feeTemplateById.customFeeSchedules = this.userCustommizedFee;

    let obj = { customFeeSchedules: [], discount_fee_reason: "", is_delete_other_fee_types: 0, is_undo: this.is_undo, studentArray: [], studentwise_fees_tax_applicable: "", studentwise_total_fees_amount: "", studentwise_total_fees_discount: 0, template_effective_date: "", template_id: "" };

    this.isFeeApplied = true;
    this.isPaymentPdc = false;
    obj.customFeeSchedules = this.getFeeStructure(this.userCustommizedFee);
    obj.discount_fee_reason = this.discountReason;
    obj.is_undo = this.is_undo;
    obj.studentArray.push(this.student_id);
    obj.studentwise_fees_tax_applicable = this.feeTemplateById.studentwise_fees_tax_applicable;
    obj.studentwise_total_fees_amount = this.totalAmountDue.toString();
    obj.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount;
    obj.template_effective_date = moment(this.feeTemplateById.template_effective_date).format("YYYY-MM-DD");
    obj.template_id = this.feeTemplateById.template_id;

    this.postService.allocateStudentFees(obj).subscribe(
      res => {
        this.splitCustomizedFee();
        this.updateStudentFeeDetails();
        this.userHasFees = true;
        this.isRippleLoad = false;
        this.isDefineFees = false;
      },
      err => {
        let msg = err.error.message;
        this.isRippleLoad = false;
        let obj = { type: 'error', title: msg, body: "" };
        this.appC.popToast(obj);
      }
    );
  }

  getStudentFeeReportJsonList(): any[] {
    let temp: any[] = [];
    let total = this.total_amt_tobe_paid;
    let remaining = 0;

    /* only installment whose checkboxes have been checked */
    this.installmentMarkedForPayment.forEach(e => {
      /* e gives the index of the fee installment on the array */
      let paid = 0;
      let previous = 0;
      let full = "N";
      /*  */
      if (this.feeTemplateById.customFeeSchedules[e].is_referenced == "Y") {
        previous = this.feeTemplateById.customFeeSchedules[e].balance_amount;

        /* balance amount less than total */
        if (this.feeTemplateById.customFeeSchedules[e].balance_amount < total) {
          //fees_amount
          paid = this.feeTemplateById.customFeeSchedules[e].balance_amount;
          remaining = total - this.feeTemplateById.customFeeSchedules[e].balance_amount;
          total = remaining;
          full = "Y";
        }

        /* balance is equal to total */
        else if (this.feeTemplateById.customFeeSchedules[e].balance_amount == total) {
          paid = this.feeTemplateById.customFeeSchedules[e].balance_amount;
          remaining = 0;
          total = remaining;
          full = "Y";
        }

        /* balance is less than total */
        else if (this.feeTemplateById.customFeeSchedules[e].balance_amount > total) {
          paid = total;
          remaining = 0;
          total = remaining;
          full = "N";
        }
      }
      else if (this.feeTemplateById.customFeeSchedules[e].is_referenced == "N") {
        previous = this.feeTemplateById.customFeeSchedules[e].fees_amount;

        /*  amount less than total */
        if (this.feeTemplateById.customFeeSchedules[e].fees_amount < total) {
          paid = this.feeTemplateById.customFeeSchedules[e].fees_amount;
          remaining = total - this.feeTemplateById.customFeeSchedules[e].fees_amount;
          total = remaining;
          full = "Y";
        }

        /* amount is equal to total */
        else if (this.feeTemplateById.customFeeSchedules[e].fees_amount == total) {
          paid = this.feeTemplateById.customFeeSchedules[e].fees_amount;
          remaining = 0;
          total = remaining;
          full = "Y";
        }

        /* amount is more than total */
        else if (this.feeTemplateById.customFeeSchedules[e].fees_amount > total) {
          paid = total;
          remaining = 0;
          total = remaining;
          full = "N";
        }
      }

      let obj = {
        due_date: moment(this.feeTemplateById.customFeeSchedules[e].due_date).format("YYYY-MM-DD"),
        fee_schedule_id: this.feeTemplateById.customFeeSchedules[e].schedule_id,
        paid_full: full,
        previous_balance_amt: previous,
        total_amt_paid: paid,
      }
      if (obj.total_amt_paid != 0) {
        temp.push(obj);
      }
    })
    return temp;
  }


  getPartialPaymentHistory(inst) {
    this.studentPartialPaymentData = [];
    this.fetchService.getStudentPartialPaymentHistory(this.student_id, inst.schedule_id).subscribe(
      res => {
        console.log(res);
        this.studentPartialPaymentData = res;
        this.isPartialPayHistory = true;
      },
      err => { }
    )
  }

  closeHistory(event) {
    this.isPartialPayHistory = false;
  }

  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */

  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* ==================================================          Student Inventory Methods         ======================================================== */
  /* ========================  These methods are used to allocate, deallocate Inventory and the adjoining methods  ===================== */
  /* =========================================================================================================================================== */

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getAllocatedUnits(obj): number {
    let count: number = 0;
    this.allocatedInventoryHistory.forEach(e => {
      if (e.item_name == obj.item_name && e.category_name == obj.category_name) {
        count += e.alloted_units;
      }
    });
    return count;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  cancelStudentUpload() {
    this.router.navigate(['/view/student']);
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  studentAddedNotifier() {
    let msg = { type: 'success', title: 'Student Registered', body: 'Student details have been updated' };
    this.appC.popToast(msg);
    this.router.navigate(['/view/student']);
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateStudentAllocatedInventory() {
    if (this.isFeeApplied) {
      this.asssignCustomizedFee(this.student_id);
    }
    else {
      this.studentAddedNotifier();
    }
  }

  fetchInventoryList() {
    this.studentPrefillService.fetchInventoryList().subscribe(
      data => {
        this.isRippleLoad = false;
        this.inventoryItemsArr = data;
      },
      err => {
        this.isRippleLoad = false;
        let msg = err.error.message;
        let obj = { type: 'error', title: msg, body: "" };
        this.appC.popToast(obj);
      }
    );
  }

  onInventoryItemSelction() {
    let temp: any = this.inventoryItemsArr.filter(
      el => el.item_id == this.addInventory.item_id
    );
    this.addInventory.available_units = temp[0].available_units;
  }

  allocateInventoryToStudent() {
    if (this.addInventory.alloted_units > 0) {
      if (this.addInventory.alloted_units > this.addInventory.available_units) {
        this.appC.popToast({ type: "error", title: "Error", body: "Please provide allocated unit less than available units" });
        return;
      } else {
        let obj: any = {
          alloted_units: this.addInventory.alloted_units.toString(),
          institution_id: sessionStorage.getItem('institute_id'),
          item_id: this.addInventory.item_id,
          student_id: this.student_id
        };
        this.isRippleLoad = true;
        this.postService.allocateInventory(obj).subscribe(
          res => {
            this.isRippleLoad = false;
            this.appC.popToast({ type: "success", title: "Allocated Inventory", body: "Inventory Item Allocated Successfully" });
            this.addInventory = {
              alloted_units: 0,
              item_id: -1,
              available_units: ''
            };
            this.getAllocatedHistory();
            this.fetchInventoryList();
          },
          err => {
            this.isRippleLoad = false;
            this.appC.popToast({ type: "error", title: "Error", body: err.error.message });
          }
        )

      }
    } else {
      this.appC.popToast({ type: "error", title: "Error", body: "Please provide valid unit to allocate" });
      return;
    }
  }

  getAllocatedHistory() {
    this.allocatedItem = [];
    this.postService.getAllocatedHistory(this.student_id).subscribe(
      res => {
        this.allocatedItem = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  deleteInventory(data) {
    data.allocation_id
    if (confirm('Are you sure, you want to delete inventory?')) {
      this.postService.deleteInventory(data.allocation_id).subscribe(
        res => {
          this.appC.popToast({ type: "success", title: "Deleted Successfully", body: "Deleted Successfully Inventory" });
          this.getAllocatedHistory();
          this.fetchInventoryList();
        }
      )
    }
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateCompleteInventory(i) {
    if (i == (this.allotInventoryArr.length - 1)) {
    }
  }


  getSelectedRow(data) {
    const tmp = [];
    if (data.length > 0) {
      data.filter(
        ele => {
          if (ele.uiSelected == true) {
            tmp.push(ele.cheque_id)
          }
        }
      )
      return tmp;
    } else {
      return [];
    }
  }

  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */


}
