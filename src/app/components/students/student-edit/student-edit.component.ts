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
import 'rxjs/Rx';
import { StudentFeeStructure } from '../../../model/student-fee-structure';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { StudentFeeService, FeeModel } from '../student_fee.service';


@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.scss']
})
export class StudentEditComponent implements OnInit, OnDestroy {

  studentAddFormData: StudentForm = {
    student_name: "",
    student_sex: "",
    student_email: "",
    student_phone: "",
    student_curr_addr: "",
    dob: "",
    doj: moment().format('YYYY-MM-DD'),
    school_name: "-1",
    student_class_key: "",
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
    assignedCourse_Subject_FeeTemplateArray: [""],
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
    stuCustomLi: [],
    deleteCourse_SubjectUnPaidFeeSchedules: false
  };
  studentAddnMove: boolean;
  userHasFees: boolean;
  closeFee: boolean;
  formIsActive: boolean = false;
  studentImage: string = '';
  quickAddStudent: boolean = false;
  additionalBasicDetails: boolean = false;
  isAssignBatch: boolean = false;
  isAcad: boolean = false;
  isProfessional: boolean = false;
  multiOpt: boolean = false;
  isDuplicateStudent: boolean = false;
  isUpdateFeeAndExit: boolean = false;
  instituteList: any[] = [];
  standardList: any[] = [];
  courseList: any[] = [];
  batchList: any[] = [];
  slots: any[] = [];
  langStatus: any[] = [];
  selectedSlots: any[] = [];
  customComponents: any[] = [];
  slotIdArr: any[] = [];
  uploadedFiles: any[] = [];
  taxEnableCheck: any = '1';
  assignedBatch: string = "";
  selectedSlotsString: string = '';
  selectedSlotsID: string = '';
  assignedBatchString: string = '';
  userImageEncoded: string = '';
  isConvertEnquiry: boolean = false;
  isNewInstitute: boolean = true;
  isNewInstituteEditor: boolean = false;
  school: any[] = [];
  removeImage: boolean = false;
  isBasicActive: boolean = true;
  isOtherActive: boolean = false;
  isFeeActive: boolean = false;
  isInventoryActive: boolean = false;
  isConfigureFees: boolean = false;
  feeTempSelected: any = "";
  studentPartialPaymentData: any[] = [];
  isPartialPayHistory: boolean = false;
  feeStructureForm: any = {
    studentArray: ["-1"],
    template_effective_date: moment().format('YYYY-MM-DD')
  };
  is_undo: string = "N";
  studentServerImage: string = '';
  feeTemplateStore: any[] = [];
  inventoryItemsArr: any[] = [];
  newPdcArr: any[] = [];
  chequePdcList: any[] = [];
  pdcStatus: any[] = [];
  createInstitute = {
    instituteName: "",
    isActive: "Y"
  };
  pdcSearchObj = {
    cheque_status: '-1',
    student_id: '',
    cheque_date_from: '',
    cheque_date_to: ''
  };

  allocationForm: any = {
    alloted_units: "",
    item_id: "",
    student_id: 0,
    institution_id: sessionStorage.getItem('institute_id')
  };
  isEdit: boolean = true;
  containerWidth: any = "200px";
  feeTemplateById: StudentFeeStructure = {
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
    is_undo: this.is_undo,
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
  };
  student_id: any;
  service_tax: number = 0;
  paymentStatusArr: any[] = [];
  isDefineFees: boolean = false;
  isNewInstallment: boolean = false;
  isDiscountApply: boolean = false;
  isPdcApply: boolean = false;
  allocatedInventoryHistory: any[] = [];
  isDiscountApplied: boolean = false;
  key: string = 'name';
  reverse: boolean = false;
  allotInventoryArr: any[] = [];
  isRippleLoad: boolean = false;
  studentAssisnedBatches: any[] = [];
  genPdcAck: boolean = false;
  sendPdcAck: boolean = false;
  pdcSelectedForPayment: any;
  defaultAcadYear: any = '-1';
  courseDropdown: any = null;
  enableBiometric: any = "";
  academicYear: any[] = [];
  savedAssignedBatch: any[] = [];
  isManualDisplayId: boolean = false;
  studentName: string = "";
  addInventory: any = {
    alloted_units: 0,
    item_id: -1,
    available_units: ''
  };
  allocatedItem: any = [];
  thumbnailAvailable: boolean = false;

  @ViewChild('saveAndContinue') btnSaveAndContinue: ElementRef;
  @ViewChild('btnContinueDetailPage') btnContinueDetailPage: ElementRef;
  @ViewChild('btnPdcPopUpAdd') btnPdcPopUpAdd: ElementRef;
  @ViewChild('btnPayment') btnPayment: ElementRef;

  constructor(
    private studentPrefillService: AddStudentPrefillService,
    private prefill: FetchprefilldataService,
    private postService: PostStudentDataService,
    private router: Router,
    private route: ActivatedRoute,
    private appC: AppComponent,
    private fetchService: FetchStudentService,
    private auth: AuthenticatorService,
    private commonServiceFactory: CommonServiceFactory,
    private feeService: StudentFeeService
  ) {
    this.isRippleLoad = true;
    this.getInstType();
    this.getSettings();
    this.student_id = this.route.snapshot.paramMap.get('id');
    this.fetchPrefillFormData();
  }

  ngOnInit() {
    this.enableBiometric = sessionStorage.getItem('biometric_attendance_feature');
    if (sessionStorage.getItem('editPdc') != "" && sessionStorage.getItem('editPdc') != null) {
      this.switchToView('feeDetails-icon');
    }
    if (sessionStorage.getItem('editInv') != "" && sessionStorage.getItem('editInv') != null) {
      this.switchToView('inventory-icon');
    }

    this.updateStudentForm(this.student_id);
  }


  ngOnDestroy() {
    sessionStorage.setItem('editPdc', '');
    sessionStorage.setItem('editInv', '');

  }

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
      document.getElementById('li-four').classList.remove('active');
      document.getElementById('li-three').classList.add('active');      
      this.isBasicActive = false;
      this.isOtherActive = false;
      this.isFeeActive = true;
      this.isInventoryActive = false;
    }
    else if (text === "inventory") {
      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.add('active');
      this.isBasicActive = false;
      this.isOtherActive = false;
      this.isFeeActive = false;
      this.isInventoryActive = true;
      this.fetchInventoryList();
    }
  }

  getCourseDropdown(id) {
    this.fetchService.getStudentCourseDetails(id).subscribe(
      res => {
        this.courseDropdown = res;
      },
      err => {

      }
    )
  }

  getAssignDate(e): string {
    if (e == '' || e == null) {
      return moment().format('YYYY-MM-DD')
    }
    else {
      return moment(e).format('YYYY-MM-DD')
    }
  }

  updateSlotsByStudent() {
    if (this.studentAddFormData.slot_id != '' && this.studentAddFormData.slot_id != null) {
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

  getSlotName(e): string {
    let temp: string = '';
    this.slots.forEach(el => {
      if (el.value.slot_id == e) {
        temp = el.value.slot_name;
      }
    });
    return temp;
  }

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

    this.studentPrefillService.fetchAllFeeStructure().subscribe(
      res => {
        this.feeTemplateStore = res;
      }
    )

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

  getCustomComponentCheckboxValue(e): boolean {
    if (e == 'Y') {
      return true;
    }
    else {
      return false;
    }
  }

  getDefaultArr(d): any[] {
    let a: any[] = [];
    a.push(d);
    return a;
  }

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

  toggleAdditionalBasicDetails() {
    this.additionalBasicDetails = !this.additionalBasicDetails;
  }

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

  openAssignBatch() {
    this.isAssignBatch = true;
  }

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

  getSlots() {
    this.slots = [];
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
        console.log(this.slots);

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
            if (res.coursesList != null) {
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
          })
      }
    }

  }

  isDuplicateContactOpen() {
    this.isDuplicateStudent = true;
  }

  isDuplicateContactClose() {
    this.isDuplicateStudent = false;
  }

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

  clearFormAndMove() {
    this.router.navigate(['/view/student']);
  }

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
  /* ======================          Student basic details and custom component updaters         =============================================== */
  /* ======================== Methods to update Student details , custom component and dependencies ============================================ */
  /* =========================================================================================================================================== */

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

  updateStudentForm(id) {
    /* Fetching Student Details from server */
    this.fetchService.getStudentById(id).subscribe(
      (data: any) => {
        this.studentName = data.student_name;
        this.studentAddFormData = data;
        this.studentAddFormData.school_name = data.school_name;
        this.studentAddFormData.standard_id = data.standard_id;
        this.fetchCourseFromMaster(data.standard_id);
        if (this.studentAddFormData.assignedBatchescademicYearArray == null) {
          this.studentAddFormData.assignedBatchescademicYearArray = [];
          this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray = [];
        }
        this.thumbnailAvailable = true;
        this.studentServerImage = data.photo;
        /* Fetch Student Fee Realated Data from Server and Allocate Selected Fees */
        this.updateStudentFeeDetails();
        this.isRippleLoad = false;
        this.getCourseDropdown(id);
        let globalInactiveStudent = sessionStorage.getItem('global_search_edit_student');
        if (data.is_active == "Y") {
          this.formIsActive = true;
        }
        else {
          if ((globalInactiveStudent == 'true' && data.is_active != 'Y')
            || (sessionStorage.getItem('editPdc') != "" && sessionStorage.getItem('editPdc') != null && data.is_active != 'Y')
            || (sessionStorage.getItem('editInv') != "" && sessionStorage.getItem('editInv') != null && data.is_active != 'Y')) {
            this.router.navigate(['/view/student']);
          }
        }
        if (this.btnContinueDetailPage != undefined) {
          this.btnContinueDetailPage.nativeElement.disabled = true;
        }
        /* For Batch Model Fetch the Student Batches */
        if (this.isProfessional) {
          /* Fetching the student Slots */
          this.getSlots();
          this.studentPrefillService.fetchStudentBatchDetails(id).subscribe(
            data => {
              if (this.btnContinueDetailPage != undefined) {
                this.btnContinueDetailPage.nativeElement.disabled = false;
              }
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
              if (this.btnContinueDetailPage != undefined) {
                this.btnContinueDetailPage.nativeElement.disabled = false;
              }
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
              if (this.btnContinueDetailPage != undefined) {
                this.btnContinueDetailPage.nativeElement.disabled = false;
              }
              this.batchList = [];
              if (res.coursesList != null) {
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
                  // console.log(el, 'update form el');
                  let obj = {
                    isSelected: el.isAssigned == "Y" ? true : false,
                    data: el,
                    assignDate: this.getAssignDate(el.created_date)
                  }
                  this.batchList.push(obj);
                });
              }
              this.updateAssignedBatches(this.batchList);
            },
            err => {
              if (this.btnContinueDetailPage != undefined) {
                this.btnContinueDetailPage.nativeElement.disabled = false;
              }
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

  setImage(e) {
    this.studentServerImage = e;
    this.thumbnailAvailable = false;
  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  formValidator(): boolean {

    if (this.commonServiceFactory.validateName(this.studentAddFormData.student_name.trim())) {
      this.commonServiceFactory.showErrorMessage('error', 'Name Error', 'Special character are not allowed in name.');
      return false;
    }

    if (this.studentAddFormData.student_phone != null && this.studentAddFormData.student_phone != "") {
      if (isNaN(this.studentAddFormData.student_phone) == false && this.studentAddFormData.student_phone.trim().length == 10) {
        return true;
      } else {
        this.commonServiceFactory.showErrorMessage('error', 'Phone Number error', 'Please provide valid phone number');
        return false;
      }
    } else {
      this.commonServiceFactory.showErrorMessage('error', 'Error', 'Please provide contact number');
      return false;
    }

  }

  studentQuickAdder(form: NgForm) {

    let isCustomComponentValid: boolean = this.customComponents.every(el => { return this.getCustomValid(el); });

    /* Both Form are Valid Else there seems to 
        be an error on custom component */
    if (form.valid && isCustomComponentValid) {

      if (!this.formValidator()) {
        return false;
      }


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
            if (this.studentAddFormData.is_active == "N") {
              this.router.navigate(['/view/student']);
            }
            else {
              this.updateStudentFeeDetails();
              this.navigateTo('feeDetails');
            }

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
            this.getCourseDropdown(this.student_id);
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

  openInstituteAdder() {
    this.isNewInstituteEditor = true;
  }

  closeInstituteAdder() {
    this.isNewInstituteEditor = false;
  }

  /* close add new institute */
  closeAddInstitute() {
    this.isNewInstitute = false;
    document.getElementById('add-institute-icon').innerHTML = '+';
    this.createInstitute.instituteName = '';
  }

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

  editInstitute(id) {
    this.instituteList.forEach(el => {
      if (el.school_id == id) {
        el.edit = true;
      }
    });
  }

  cancelEditInstitute(id) {
    this.fetchInstituteInfo();
  }

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

  clearDateoJoining() {
    this.studentAddFormData.doj = ''
  }

  updateFormIsActive(ev) {
    if (ev) {
      this.studentAddFormData.is_active = "Y";
    }
    else {
      this.studentAddFormData.is_active = "N";
    }
  }

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

  validateName(): boolean {
    let regex = /[a-zA-Z .]+[a-zA-Z .]+/;
    if (regex.test(this.studentAddFormData.student_name)) {
      return true;
    }
    else {
      return false;
    }
  }

  validatePhone(): boolean {
    let regex = /[789][0-9]{9}/;
    if (regex.test(this.studentAddFormData.student_phone)) {
      return true;
    }
    else {
      return false;
    }
  }


  // New Function For Discounting

  subjectWiseInstallmentArray: any = [];
  cardAmountObject: any = {
    feeAmountInclTax: 0,
    feeAmountExclTax: 0,
    taxAmount: 0,
    discountAmount: 0,
    amountPaid: 0,
    amountDue: 0,
    additionalFees: 0
  };
  totalAmountToPay: number = 0;
  paymentPopUpJson: any = {
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
    genPdcAck: false,
    sendPdcAck: false
  };
  feeObject: FeeModel;
  tableHeaderCheckbox: boolean = false;
  isFeePaymentUpdate: boolean = false;
  checkBoxGroup: any = {
    unpaidInstallment: true,
    paidInstallment: false
  };
  clonedFeeObject: FeeModel;
  showFeeSection: boolean = false;

  updateStudentFeeDetails() {
    this.isRippleLoad = true;
    this.flushDataAfterPayement();
    this.feeService.fetchStudentFeeSchedule(this.student_id).subscribe(
      (res: FeeModel) => {
        this.isRippleLoad = false;
        this.feeObject = res;
        this.clonedFeeObject = this.commonServiceFactory.keepCloning(res);
        if (res.customFeeSchedules != null && res.customFeeSchedules.length > 0) {
          this.showFeeSection = true;
          this.cardAmountObject = this.feeService.makeCardLayoutJson(res.customFeeSchedules, this.feeObject.registeredServiceTax);
          this.cardAmountObject.discountAmount = this.cardAmountObject.discountAmount + res.studentwise_total_fees_discount;
          console.log('cardObject', this.cardAmountObject);
          let customFeeSchedules = this.feeService.uniqueConvertFeeJson(res.customFeeSchedules);
          this.subjectWiseInstallmentArray = this.feeService.categoriseCourseWise(customFeeSchedules, res.registeredServiceTax);
          console.log('subjectWise', this.subjectWiseInstallmentArray);
          this.onPaidOrUnpaidCheckbox();
        } else {
          this.showFeeSection = false;
        }
      },
      err => {
        this.commonServiceFactory.showErrorMessage('error', err.error.message, '');
        this.isRippleLoad = false;
      }
    )
  }

  openInstallmentListOfCourse(index, operation, event) {
    document.getElementById('idDownIcon' + index).classList.toggle('hide');
    document.getElementById('idUpIcon' + index).classList.toggle('hide');
    document.getElementById('installmentTable' + index).classList.toggle('hide');
    // if (operation == 'open') {
    //   document.getElementById('idDownIcon' + index).classList.add('hide');
    //   document.getElementById('idUpIcon' + index).classList.remove('hide');
    //   document.getElementById('installmentTable' + index).classList.remove('hide');
    // } else {
    //   document.getElementById('idDownIcon' + index).classList.remove('hide');
    //   document.getElementById('idUpIcon' + index).classList.add('hide');
    //   document.getElementById('installmentTable' + index).classList.add('hide');
    // }
    event.stopPropagation();
  }

  mainTAbleCheckboxClicked(event) {
    this.subjectWiseInstallmentArray = this.feeService.uiSelectionForCourse(this.subjectWiseInstallmentArray, 'uiSelected', event);
    if (event) {
      this.totalAmountToPay = Number(this.cardAmountObject.amountDue);
    } else {
      this.totalAmountToPay = 0;
    }
  }

  onCheckBoxSelection(event, operation, data) {
    if (event) {
      if (operation == "course") {
        data.installmentArray = this.feeService.changeUiSelectedKeyValue(data.installmentArray, 'uiSelected', true);
        this.totalAmountToPay = this.feeService.getTotalAmount(this.subjectWiseInstallmentArray);
      } else {
        this.totalAmountToPay = this.feeService.getTotalAmount(this.subjectWiseInstallmentArray);
        // this.subjectWiseInstallmentArray = this.feeService.checkForUiSelection(this.subjectWiseInstallmentArray);
      }
      this.tableHeaderCheckbox = this.feeService.checkHeaderTableSelection(this.subjectWiseInstallmentArray);
    } else {
      this.tableHeaderCheckbox = false;
      if (operation == "course") {
        data.installmentArray = this.feeService.changeUiSelectedKeyValue(data.installmentArray, 'uiSelected', false);
        this.totalAmountToPay = this.feeService.getTotalAmount(this.subjectWiseInstallmentArray);
      } else {
        this.totalAmountToPay = this.feeService.getTotalAmount(this.subjectWiseInstallmentArray);
        // this.subjectWiseInstallmentArray = this.feeService.checkForUiSelection(this.subjectWiseInstallmentArray);
      }
    }
  }

  onPaidOrUnpaidCheckbox() {
    if (this.checkBoxGroup.unpaidInstallment && this.checkBoxGroup.paidInstallment) {
      let installment = this.commonServiceFactory.keepCloning(this.clonedFeeObject.customFeeSchedules);
      this.subjectWiseInstallmentArray = this.feeService.categoriseCourseWise(installment, this.clonedFeeObject.registeredServiceTax);
      return;
    }

    if (this.checkBoxGroup.unpaidInstallment) {
      let installment = this.commonServiceFactory.keepCloning(this.clonedFeeObject.customFeeSchedules);
      let unpaidInstallment = installment.filter(el => el.paid_full == "N");
      this.subjectWiseInstallmentArray = this.feeService.categoriseCourseWise(unpaidInstallment, this.clonedFeeObject.registeredServiceTax);
      return;
    }

    if (this.checkBoxGroup.paidInstallment) {
      let installment = this.commonServiceFactory.keepCloning(this.clonedFeeObject.customFeeSchedules);
      let unpaidInstallment = installment.filter(el => el.paid_full == "Y");
      this.subjectWiseInstallmentArray = this.feeService.categoriseCourseWise(unpaidInstallment, this.clonedFeeObject.registeredServiceTax);
      return;
    }

    if (this.checkBoxGroup.paidInstallment == false && this.checkBoxGroup.unpaidInstallment == false) {
      this.subjectWiseInstallmentArray = [];
      return;
    }

  }

  openPaymentDetails($event) {
    $event.preventDefault();
    this.flushPaymentPopUpData();
    this.paymentPopUpJson.immutableAmount = this.totalAmountToPay;
    this.paymentPopUpJson.payingAmount = this.totalAmountToPay;
    this.isFeePaymentUpdate = true;
  }

  flushPaymentPopUpData() {
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
    this.isFeePaymentUpdate = false;
  }

  feePdcSelected(id) {
    let obj: any = {
      bank_name: '',
      cheque_amount: this.paymentPopUpJson.payingAmount,
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
          obj.pdc_cheque_id = el.pdc_cheque_id;
          this.paymentPopUpJson.pdcSelectedForm = obj;
          this.paymentPopUpJson.selectedPdcId = id;
          this.paymentPopUpJson.payingAmount = el.cheque_amount;
        }
      });
    }
  }

  payFeeInstallments() {
    // Validate if proper data is given or not
    let check: boolean = this.feeService.validatePaymentDetails(this.paymentPopUpJson);
    if (!check) {
      return;
    }
    // Confirmation if due date is last acad year
    let checkAcadYearPopUp: boolean = this.feeService.checkForLastYearInstallmentPayment(this.subjectWiseInstallmentArray);
    if (checkAcadYearPopUp) {
      if (confirm('You are about to update fee installment of last financial year. Are you sure you want to continue?')) {
        this.makePaymentForInstallment();
      } else {
        return;
      }
    } else {
      this.makePaymentForInstallment();
    }
  }

  makePaymentForInstallment() {
    let JsonToSendOnServer = this.feeService.makePaymentFinalJson(this.subjectWiseInstallmentArray, this.paymentPopUpJson);
    JsonToSendOnServer.student_id = this.student_id;
    console.log(JsonToSendOnServer);
    this.isRippleLoad = true;
    this.btnPayment.nativeElement.disabled = true;
    this.postService.payPartialFeeAmount(JsonToSendOnServer).subscribe(
      res => {
        this.btnPayment.nativeElement.disabled = false;
        this.isRippleLoad = false;
        this.commonServiceFactory.showErrorMessage('success', 'Fees Updated', 'Fee details has been updated');
        if (this.paymentPopUpJson.genFeeRecipt) {
          this.generateFeeRecipt(res);
        }
        if (this.paymentPopUpJson.emailFeeRecipt) {
          this.emailFeeReceipt(res);
        }
        this.flushDataAfterPayement();
        this.updateStudentFeeDetails();
      },
      err => {
        this.btnPayment.nativeElement.disabled = false;
        this.isRippleLoad = false;
        this.commonServiceFactory.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  generateFeeRecipt(res) {
    this.fetchService.getFeeReceiptById(this.student_id, res.other).subscribe(
      (res: any) => {
        this.downloadDocument(res);
      },
      err => {
        this.commonServiceFactory.showErrorMessage('error', 'Error', err.error.message);
      });
  }

  emailFeeReceipt(res) {
    this.fetchService.emailReceiptById(this.student_id, res.other).subscribe(
      res => {
        this.commonServiceFactory.showErrorMessage('success', 'Reciept Sent', 'Receipt has been sent to student/parent email ID');
      }
    )
  }

  downloadDocument(res) {
    let body = res;
    let byteArr = this.convertBase64ToArray(body.document);
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

  totalPartialChange(e) {
    e = Number(e.target.value);
    if (e == 0) {
      this.commonServiceFactory.showErrorMessage('warning', 'Invalid Payment Amount', '');
      this.paymentPopUpJson.payingAmount = this.paymentPopUpJson.immutableAmount;
      this.paymentPopUpJson.pdcSelectedForm.cheque_amount = this.paymentPopUpJson.immutableAmount;
    }
    else {
      this.paymentPopUpJson.pdcSelectedForm.cheque_amount = Number(e);
    }

    // if (e > this.paymentPopUpJson.immutableAmount) {
    //   this.commonServiceFactory.showErrorMessage('warning', 'Invalid Payment Amount', '');
    //   this.paymentPopUpJson.payingAmount = this.paymentPopUpJson.immutableAmount;
    //   this.paymentPopUpJson.pdcSelectedForm.cheque_amount = this.paymentPopUpJson.immutableAmount;
    // } else if (e <= 0) {
    //   this.commonServiceFactory.showErrorMessage('warning', 'Invalid Payment Amount', '');
    //   this.paymentPopUpJson.payingAmount = this.paymentPopUpJson.immutableAmount;
    //   this.paymentPopUpJson.pdcSelectedForm.cheque_amount = this.paymentPopUpJson.immutableAmount;
    // }
    // else {
    //   this.paymentPopUpJson.pdcSelectedForm.cheque_amount = Number(e);
    // }
  }

  paymentModeUpdate(e) {
    if (e == 'Cheque/PDC/DD No.') {
      this.paymentPopUpJson.pdcSelectedForm.cheque_amount = this.paymentPopUpJson.immutableAmount;
    } else {
      this.paymentPopUpJson.pdcSelectedForm.cheque_amount = 0;
    }
  }

  flushDataAfterPayement() {
    this.flushPaymentPopUpData();
    this.isFeePaymentUpdate = false;
    this.subjectWiseInstallmentArray = [];
    this.cardAmountObject = {
      feeAmountInclTax: 0,
      feeAmountExclTax: 0,
      taxAmount: 0,
      discountAmount: 0,
      amountPaid: 0,
      amountDue: 0
    };
    this.totalAmountToPay = 0;
  }

  emailFeeReciptInstallment(installmentData) {
    let obj: any = {
      other: installmentData.invoice_no
    }
    this.emailFeeReceipt(obj);
  }

  // Add Edit Discount PopUp

  openDiscountApply() {
    this.isDiscountApply = true;
  }

  onDiscountPopUpClose() {
    this.isDiscountApply = false;
    this.updateStudentFeeDetails();
  }

  // payment history pop up

  schedule_id: any = "";
  openPartialPaymentHistor(data) {
    this.isPartialPayHistory = true;
    this.schedule_id = data.schedule_id;
  }

  closeHistory(event) {
    this.isPartialPayHistory = false;
    this.schedule_id = "";
  }

  ////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  // Configure Fee

  configureFees($event) {
    $event.preventDefault();
    this.isConfigureFees = true;
    this.is_undo = "N";
  }

  closeConfigureFees() {
    this.isConfigureFees = false;
    this.feeStructureForm = {
      studentArray: ["-1"],
      template_effective_date: ""
    }
    this.feeTempSelected = "";
  }

  applyConfiguredFees($event) {
    $event.preventDefault();
    // this.isPaymentDetailsValid = false;
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
      is_undo: this.is_undo,
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
    };
    let dd = moment(this.feeStructureForm.template_effective_date).format('YYYY-MM-DD');
    /* success */
    if ((this.feeTempSelected != "" && this.feeTempSelected != null) && (dd != "" && dd != null && dd != "Invalid date")) {
      this.feeStructureForm.template_effective_date = dd;
      this.studentPrefillService.getFeeStructureById(this.feeTempSelected, this.feeStructureForm).subscribe(
        res => {
          this.feeTemplateById = res;
          this.feeTemplateById.template_effective_date = this.feeStructureForm.template_effective_date;
          this.feeTemplateById.template_id = this.feeTempSelected;
          this.isDefineFees = true;
          // this.isFeeApplied = true;
          res.customFeeSchedules.forEach(el => {
            el.due_date = new Date(el.due_date);
            /* Taxes Here */
            if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
              this.service_tax = res.registeredServiceTax;
              if (el.fee_type_name == "INSTALLMENT") {
                let tax = el.initial_fee_amount * (this.service_tax / 100);
                if (parseInt(el.initial_fee_amount) == parseInt(el.fees_amount)) {
                  el.initial_fee_amount = this.feeService.precisionRound(el.fees_amount - tax, -1);
                }
              }
              else {
                let tax = el.initial_fee_amount * (el.service_tax / 100);
              }
            }
            else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
              this.service_tax = 0;
            }
          });
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

  clearEffectiveDate($event) {
    $event.preventDefault();
    this.feeStructureForm.template_effective_date = '';
  }

  closeAllFeePops(event) {
    if (event) {
      this.isDefineFees = false;
      this.updateStudentFeeDetails();
    } else {
      if (confirm("All Changes made to fee template will be discarded!")) {
        this.isDefineFees = false;
        this.updateStudentFeeDetails();
      }
      else {

      }
    }
  }

  //Reconfigure Pop up

  reConfigureFees() {
    this.isDefineFees = true;
    this.feeTemplateById = this.feeObject;
  }

  reCreateFeeAgain() {
    if (confirm("By changing the fee template, all existing fee schedule and transactions shall be discarded and archived. Are you sure you want to continue?")) {
      this.isConfigureFees = true;
      this.is_undo = 'Y';
      this.feeTemplateById = { feeTypeMap: "", customFeeSchedules: [], registeredServiceTax: "", studentArray: "", studentwise_total_fees_amount: "", studentwise_total_fees_balance_amount: "", studentwise_total_fees_amount_paid: "", studentwise_total_fees_discount: "", studentwise_fees_tax_applicable: "", no_of_installments: "", discount_fee_reason: "", template_name: "", template_id: "", template_effective_date: "", is_fee_schedule_created: "", is_fee_tx_done: "", is_undo: this.is_undo, is_fee_other_inst_created: "", is_delete_other_fee_types: "", chequeDetailsJson: "", payment_mode: "", remarks: "", paid_date: "", toCreate: false, is_cheque_details_required: "", reference_no: "", invoice_no: "", uiSelected: false };
      this.isDefineFees = false;
      this.isDiscountApplied = false;
    }
  }

  sort(key) {
    this.key = key;
    if (key == 'due_date') {
      this.reverse = false;
    }
    else {
      this.reverse = !this.reverse;
    }
  }

  // PDC Cheque PopUp

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
  };

  getPdcChequeList() {
    let obj = {
      cheque_status: this.pdcSearchObj.cheque_status == '' ? -1 : this.pdcSearchObj.cheque_status,
      student_id: this.student_id,
      cheque_date_from: this.pdcSearchObj.cheque_date_from == "Invalid date" ? '' : moment(this.pdcSearchObj.cheque_date_from).format('YYYY-MM-DD'),
      cheque_date_to: this.pdcSearchObj.cheque_date_to == "Invalid date" ? '' : moment(this.pdcSearchObj.cheque_date_to).format('YYYY-MM-DD')
    }
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

  addNewPDCState() {
    //console.log(this.pdcAddForm);
    let obj = { bank_name: this.pdcAddForm.bank_name, cheque_amount: this.pdcAddForm.cheque_amount, cheque_date: moment(this.pdcAddForm.cheque_date).format("YYYY-MM-DD"), cheque_id: this.pdcAddForm.cheque_id, cheque_no: this.pdcAddForm.cheque_no, cheque_status: this.pdcAddForm.cheque_status, cheque_status_key: this.pdcAddForm.cheque_status_key, clearing_date: moment(this.pdcAddForm.clearing_date).format("YYYY-MM-DD"), institution_id: sessionStorage.getItem('institute_id'), student_id: this.student_id };
    if (this.validPdc(obj)) {
      this.newPdcArr.push(obj);
      this.addPdcDataToServer();
    }
  }

  addPdcDataToServer() {
    let temp: any[] = [];
    this.newPdcArr.forEach(e => {
      let obj = { cheque_no: e.cheque_no, bank_name: e.bank_name, cheque_date: e.cheque_date, student_id: this.student_id, clearing_date: e.clearing_date, institution_id: sessionStorage.getItem('institute_id'), cheque_amount: e.cheque_amount, genAck: this.genPdcAck === true ? "Y" : "N", sendAck: this.sendPdcAck === true ? "Y" : "N" };
      temp.push(obj);
    });
    this.newPdcArr = [];
    this.genPdcAck = false;
    this.sendPdcAck = false;
    this.btnPdcPopUpAdd.nativeElement.disabled = true;
    this.postService.addChequePdc(temp).subscribe(
      res => {
        this.btnPdcPopUpAdd.nativeElement.disabled = false;
        this.chequePdcList = [];
        this.newPdcArr = [];
        this.pdcAddForm = { bank_name: '', cheque_amount: '', cheque_date: '', cheque_id: 0, cheque_no: '', cheque_status: '', cheque_status_key: 0, clearing_date: '', institution_id: sessionStorage.getItem('institute_id'), student_id: 0 };
        this.getPdcChequeList();
      },
      err => {
        this.btnPdcPopUpAdd.nativeElement.disabled = false;
        this.commonServiceFactory.showErrorMessage('error', err.error.message, '');
        this.chequePdcList = [];
        this.getPdcChequeList();
      }
    )

  }

  editPDC(data) {
    document.getElementById((data.student_id + data.cheque_id).toString()).classList.remove('displayComp');
    document.getElementById((data.student_id + data.cheque_id).toString()).classList.add('editComp');
  }

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

  cancelEditPDC(data) {
    document.getElementById((data.student_id + data.cheque_id).toString()).classList.add('displayComp');
    document.getElementById((data.student_id + data.cheque_id).toString()).classList.remove('editComp');
    this.getPdcChequeList();
  }

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

  generateAck() {
    let selectedChqueId = this.getSelectedRow(this.chequePdcList);
    if (selectedChqueId != null && selectedChqueId != undefined && selectedChqueId.length > 0) {
      let chequeId = selectedChqueId.join(',');
      this.generateAcknowledgeAPi(chequeId, this.student_id, 'undefined');
    }
    else {
      this.commonServiceFactory.showErrorMessage('error', 'No PDC Selected', '')
    }
  }

  sendAck() {
    let selectedChqueId = this.getSelectedRow(this.chequePdcList);
    if (selectedChqueId != null && selectedChqueId != undefined && selectedChqueId.length > 0) {
      let chequeId = selectedChqueId.join(',');
      this.generateAcknowledgeAPi(chequeId, this.student_id, "Y");
    } else {
      this.commonServiceFactory.showErrorMessage('error', 'No PDC Selected', '')
    }
  }

  generateAcknowledgeAPi(chequeId, student_id, key) {
    this.isRippleLoad = true;
    this.postService.generateAcknowledge(chequeId, student_id, key).subscribe(
      res => {
        this.isRippleLoad = false;
        if (key == 'Y') {
          this.commonServiceFactory.showErrorMessage('success', 'Send Successfullly', '');
        } else if (key == "undefined") {
          this.downloadDocument(res);
        }
      },
      err => {
        this.isRippleLoad = false;
        this.commonServiceFactory.showErrorMessage('error', err.error.message, '');
      }
    )
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

  closePDCPop() {
    this.isPdcApply = false
  }

  // Inventory Functions

  getAllocatedUnits(obj): number {
    let count: number = 0;
    this.allocatedInventoryHistory.forEach(e => {
      if (e.item_name == obj.item_name && e.category_name == obj.category_name) {
        count += e.alloted_units;
      }
    });
    return count;
  }

  updateStudentAllocatedInventory() {
    // if (this.isFeeApplied) {
    //   this.asssignCustomizedFee(this.student_id);
    // }
    // else {
    this.studentAddedNotifier();
    // }
  }

  fetchInventoryList() {
    this.studentPrefillService.fetchInventoryListById(this.student_id).subscribe(
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
    if (this.addInventory.item_id != '-1') {
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
    } else {
      this.appC.popToast({ type: "error", title: "Error", body: "Please provide inventory item to add" });
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

  ////////////////////////////////////////////////

  cancelStudentUpload() {
    this.router.navigate(['/view/student']);
  }

  studentAddedNotifier() {
    let msg = { type: 'success', title: 'Student Registered', body: 'Student details have been updated' };
    this.appC.popToast(msg);
    this.router.navigate(['/view/student']);
  }

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

}
