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

  private quickAddStudent: boolean = false;
  private additionalBasicDetails: boolean = false;
  private isAssignBatch: boolean = false;
  private isAcad: boolean = false;
  private isProfessional: boolean = false;
  private multiOpt: boolean = false;
  private isDuplicateStudent: boolean = false;

  private instituteList: any[] = [];
  private standardList: any[] = [];
  private courseList: any[] = [];
  private batchList: any[] = [];
  private slots: any[] = [];
  private langStatus: any[] = [];
  private selectedSlots: any[] = [];
  private customComponents: any[] = [];
  private slotIdArr: any[] = [];
  uploadedFiles: any[] = [];

  private assignedBatch: string = "";
  private selectedSlotsString: string = '';
  private selectedSlotsID: string = '';
  private assignedBatchString: string = '';
  private userImageEncoded: string = '';
  busyPrefill: Subscription;
  private isConvertEnquiry: boolean = false;
  private isNewInstitute: boolean = true;
  private isNewInstituteEditor: boolean = false;
  school: any[] = [];
  removeImage: boolean = false;
  userCustommizedFee: any[] = [];
  isBasicActive: boolean = true;
  isOtherActive: boolean = false;
  isFeeActive: boolean = false;
  isInventoryActive: boolean = false;
  isConfigureFees: boolean = false;
  feeTempSelected: any = "";
  addFeeInstallment: any = {
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
  addFeeOther: any = {
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
  otherFeeType: any[] = [];
  feeStructureForm: any = {
    studentArray: ["-1"],
    template_effective_date: moment().format('YYYY-MM-DD')
  }
  instalmentTableData: any[] = [];
  otherFeeTableData: any[] = [];
  feeTemplateStore: any[] = [];
  inventoryItemsArr: any[] = [];
  createInstitute = {
    instituteName: "",
    isActive: "Y"
  }
  containerWidth: any = "200px"
  allocationForm: any = {
    alloted_units: "",
    item_id: "",
    student_id: 0,
    institution_id: sessionStorage.getItem('institute_id')
  }
  studentImage: string = '';
  isPaymentDetailsValid: boolean = false;
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
  student_id: any;
  service_tax: number = 0;
  totalFeePaid: number = 0;
  paymentStatusArr: any[] = [];
  isFeePaymentUpdate: boolean = false;
  isDefineFees: boolean = false;
  isFeeApplied: boolean = false;
  isNewInstallment: boolean = false;
  isDiscountApply: boolean = false;
  discountApplyForm: any = {
    type: 'amount',
    value: null,
    reason: '',
    state: 'all'
  }

  isDiscountApplied: boolean = false;
  discountReason: string = '';
  key: string = 'name'; //set default
  reverse: boolean = false;
  allotInventoryArr: any[] = [];

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  constructor(
    private studentPrefillService: AddStudentPrefillService,
    private prefill: FetchprefilldataService,
    private postService: PostStudentDataService,
    private router: Router, private login: LoginService,
    private appC: AppComponent) {
    this.getInstType();
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
      this.studentPrefillService.fetchCourseMasterById(this.studentAddFormData.standard_id).subscribe(data => {
        data.coursesList.forEach(el => {
          let obj = {
            isSelected: false,
            data: el,
            assignDate: moment().format('YYYY-MM-DD')
          }
          this.batchList.push(obj);
        })
      });
    }
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

  updateMasterCourseList(id) {
    this.batchList = [];
    this.studentPrefillService.fetchCourseMasterById(id).subscribe(data => {
      data.coursesList.forEach(el => {
        let obj = {
          isSelected: false,
          data: el,
          assignDate: moment().format('YYYY-MM-DD')
        }
        this.batchList.push(obj);
      })
    });
  }
  /* ============================================================================================================================ */
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
    let inventory = this.studentPrefillService.fetchInventoryList().subscribe(
      data => {
        this.inventoryItemsArr = data;

      });

    let institute = this.prefill.getSchoolDetails().subscribe(data => {
      this.instituteList = data;
    });
    this.getFeeStructue();
    let standard = this.prefill.getEnqStardards().subscribe(data => {
      this.standardList = data;
    });
    this.studentPrefillService.fetchBatchDetails().subscribe(data => {
      data.forEach(el => {
        let obj = {
          isSelected: false,
          data: el,
          assignDate: moment().format('YYYY-MM-DD')
        }
        this.batchList.push(obj);
      })
    });
    if (inventory != null && institute != null && standard != null) {
      let customComp = this.studentPrefillService.fetchCustomComponent().subscribe(data => {
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
          this.customComponents.push(obj);
        });
      });
      //console.log(this.customComponents);
      return customComp;
    }
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

    //console.log(this.batchList); 
    this.batchList.forEach(el => {
      if (el.isSelected) {
        if (this.isProfessional) {
          this.studentAddFormData.assignedBatches.push(el.data.batch_id.toString());
          this.studentAddFormData.batchJoiningDates.push(moment(el.assignDate).format('YYYY-MM-DD'));
          batchString.push(el.data.batch_name);
        }
        else {
          this.studentAddFormData.assignedBatches.push(el.data.course_id.toString());
          this.studentAddFormData.batchJoiningDates.push(moment(el.assignDate).format('YYYY-MM-DD'));
          batchString.push("(" + el.data.master_course + "||" + el.data.course_name + ")");
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
    /* Both Form are Valid Else there seems to 
        be an error on custom component */
    if (form.valid && this.customComponentValid() && this.formValidator()) {
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
            this.removeImage = true;
            this.clearFormAndMove();
          }
          else if (statusCode == 2) {
            let alert = {
              type: 'error',
              title: 'Contact Number In Use',
              body: 'An enquiry with the same contact number seems to exist'
            }
            form.reset();
            this.removeImage = true;
            //document.getElementById('preview-img').src = '';
            this.appC.popToast(alert);
            this.isDuplicateContactOpen();
          }
        },
        err => {
          console.log(err);
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
    this.customComponents.forEach(el => {
      if (el.id == id) {
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
              //console.log(com.selected);
              el.selectedString = el.selected.join(',');
              el.value = el.selectedString;
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
              el.selectedString = el.selected.join(',');
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
      payment_mode: "",
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
      this.feeStructureForm.template_effective_date = dd;
      //console.log(this.feeTempSelected + "   " + this.feeStructureForm);
      this.studentPrefillService.getFeeStructureById(this.feeTempSelected, this.feeStructureForm).subscribe(
        res => {
          this.feeTemplateById = res;
          this.feeTemplateById.template_effective_date = this.feeStructureForm.template_effective_date;
          this.feeTemplateById.template_id = this.feeTempSelected;
          this.isDefineFees = true;

          this.isFeeApplied = true;
          /* this.feeTemplateById.paid_date = moment().format("YYYY-MM-DD"); */
          if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
            this.service_tax = res.registeredServiceTax;
          }
          else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
            this.service_tax = 0;

          }
          res.customFeeSchedules.forEach(el => {
            if (el.fee_type_name === "INSTALLMENT") {
              this.instalmentTableData.push(el);
            }
            else {
              this.otherFeeTableData.push(el);
            }
          });
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
    if (this.feeTemplateById.paid_date == "" && this.feeTemplateById.payment_mode == "") {
      let msg = {
        type: 'error',
        title: 'Payment Date and Mode Missing',
        body: 'Please fill in the payment date and mode of payment'
      }
      this.appC.popToast(msg);
    }
    else if (this.feeTemplateById.paid_date != "" && this.feeTemplateById.payment_mode == "") {
      let msg = {
        type: 'error',
        title: 'Payment Mode Missing',
        body: 'Please fill in the mode of payment'
      }
      this.appC.popToast(msg);
    }
    else if (this.feeTemplateById.paid_date == "" && this.feeTemplateById.payment_mode != "") {
      let msg = {
        type: 'error',
        title: 'Payment Date Missing',
        body: 'Please fill in the payment date '
      }
      this.appC.popToast(msg);
    }
    else {
      this.isPaymentDetailsValid = true;
      this.paymentStatusArr.forEach(el => { el.isPaid = el.uiSelected });
      this.feeTemplateById.paid_date = moment(this.feeTemplateById.paid_date).format("YYYY-MM-DD");
      this.feeTemplateById.studentwise_total_fees_amount_paid = this.totalFeePaid;
      this.feeTemplateById.studentwise_total_fees_balance_amount = this.feeTemplateById.studentwise_total_fees_amount - this.feeTemplateById.studentwise_total_fees_amount_paid - this.feeTemplateById.studentwise_total_fees_discount;
      this.closePaymentDetails();
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  addNewInstallmentFee() {
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
      if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0') {
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
      else if (sessionStorage.getItem('enable_tax_applicable_fee_installments') == '1') {
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
      if (stat === "Y" || stat === "") {
        let tax: number = 0;
        tax = this.precisionRound(((this.service_tax / 100) * amt), -1);
        this.instalmentTableData[i].tax = tax;
        return Math.floor(tax);
      }
      else if (stat === "N") {
        let tax: number = 0;
        this.instalmentTableData[i].tax = tax;
        return Math.floor(tax);
      }
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
        console.log(this.addFeeOther.fee_type);
        console.log(this.addFeeOther.due_date);
        console.log(this.addFeeOther.initial_fee_amount);
      }
    }
    else {
      this.addFeeOther.due_date = moment(this.addFeeOther.due_date).format("YYYY-MM-DD");
      this.addFeeOther.fees_amount = parseInt(this.addFeeOther.initial_fee_amount) + (this.precisionRound(((this.addFeeOther.service_tax / 100) * parseInt(this.addFeeOther.initial_fee_amount)), -1));
      this.otherFeeTableData.push(this.addFeeOther);
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
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
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
    if (confirm("All Changes made to fee template will be discarded!")) {
      this.isDefineFees = false;
      this.totalFeePaid = 0;
      this.isFeeApplied = false;
      this.userCustommizedFee = [];
      this.paymentStatusArr = [];
      this.instalmentTableData = [];
      this.otherFeeTableData = [];
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
        payment_mode: "",
        remarks: "",
        paid_date: "",
        is_cheque_details_required: "",
        reference_no: "",
        invoice_no: "",
        uiSelected: false
      }
      this.feeStructureForm = {
        studentArray: ["-1"],
        template_effective_date: moment().format('YYYY-MM-DD')
      }

      this.isDiscountApplied = false;
      this.discountReason = '';

    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  sortTableByDate(i) {
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
    console.log(i);
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
    if (this.isPaymentDetailsValid) {
      //console.log("payments valid proceeding to upload");
      this.addNewStudentFull();
    }/* Payment Details not found */
    else {
      let isPaid = this.paymentStatusArr.every(function (element, index, array) {
        return (element.uiSelected === element.isPaid);
      })
      //console.log(isPaid);
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
    //console.log("validate student form and generate id");
    this.studentAdder();
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
      && this.studentAddFormData.student_phone != "" && this.validateName() && this.validatePhone() && this.studentAddFormData.student_phone != " "
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
    console.log(obj.customFeeSchedules);
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
        this.studentAddedNotifier();
      },
      err => { }
    );

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
  /* ============================================================================================================================ */
  applyDiscount() {
    /* Form is correctly filled */
    if (this.discountApplyForm.type != '' && this.discountApplyForm.value > 0 && this.discountApplyForm.reason != '' && this.discountApplyForm.reason != ' ') {
      /* discount in form of amount */
      if (this.discountApplyForm.type === 'amount') {

        /* invalid discount amount provided */
        if (this.discountApplyForm.value > this.feeTemplateById.studentwise_total_fees_balance_amount) {
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
            let discount = this.precisionRound((this.discountApplyForm.value / installmentPaidArr.length), -1);
            /* discount is applicable to all installments, then proceed else alert */
            if (unPaidArr.every(e => e.fees_amount > discount)) {
              installmentPaidArr.forEach(i => {
                this.instalmentTableData[i].fees_amount = this.instalmentTableData[i].fees_amount - discount;
              });
              this.isDiscountApplied = true;
              this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason) : moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason);
              this.applyDiscountCustomFeeSchedule();
              this.feeTemplateById.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount + this.discountApplyForm.value;
              this.feeTemplateById.studentwise_total_fees_balance_amount = this.feeTemplateById.studentwise_total_fees_amount - this.feeTemplateById.studentwise_total_fees_amount_paid - this.feeTemplateById.studentwise_total_fees_discount;
              console.log(this.feeTemplateById);

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
              this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount = this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount - this.discountApplyForm.value;
              this.isDiscountApplied = true;
              this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason) : moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason);
              this.applyDiscountCustomFeeSchedule();
              this.feeTemplateById.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount + this.discountApplyForm.value;
              this.feeTemplateById.studentwise_total_fees_balance_amount = this.feeTemplateById.studentwise_total_fees_amount - this.feeTemplateById.studentwise_total_fees_amount_paid - this.feeTemplateById.studentwise_total_fees_discount;
              console.log(this.feeTemplateById);
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
      }/* discount in form of percentage */
      else {

        let discountValue = this.precisionRound(((this.discountApplyForm.value / 100) * this.feeTemplateById.studentwise_total_fees_amount), -1);
        console.log(discountValue);
        /* invalid discount amount provided */
        if (discountValue > this.feeTemplateById.studentwise_total_fees_balance_amount) {
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
                this.instalmentTableData[i].fees_amount = this.instalmentTableData[i].fees_amount - discount;
              });
              this.isDiscountApplied = true;
              this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason) : moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason);
              this.applyDiscountCustomFeeSchedule();
              this.feeTemplateById.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount + discountValue;
              this.feeTemplateById.studentwise_total_fees_balance_amount = this.feeTemplateById.studentwise_total_fees_amount - this.feeTemplateById.studentwise_total_fees_amount_paid - this.feeTemplateById.studentwise_total_fees_discount;

              console.log(this.feeTemplateById);
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

              this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount = this.instalmentTableData[installmentPaidArr[installmentPaidArr.length - 1]].fees_amount - discountValue;
              this.isDiscountApplied = true;
              this.discountReason = this.discountReason.length > 0 ? this.discountReason + '?' + moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason) : moment().format('DD-MMM-YYYY hh:mm:ss' + "#" + this.discountApplyForm.value + "#" + this.discountApplyForm.reason);
              this.applyDiscountCustomFeeSchedule();
              this.feeTemplateById.studentwise_total_fees_discount = this.feeTemplateById.studentwise_total_fees_discount + discountValue;
              this.feeTemplateById.studentwise_total_fees_balance_amount = this.feeTemplateById.studentwise_total_fees_amount - this.feeTemplateById.studentwise_total_fees_amount_paid - this.feeTemplateById.studentwise_total_fees_discount;
              console.log(this.feeTemplateById);
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
    }/* Incomplete form data detected */
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
      if (this.instalmentTableData[i].is_paid == 0) {
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
        return this.precisionRound(((this.discountApplyForm.value / 100) * this.feeTemplateById.studentwise_total_fees_balance_amount), -1);
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
      title: 'Student Registered',
      body: 'Student details have been updated to database'
    }
    this.appC.popToast(msg);
    this.router.navigate(['/student']);
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
        is_paid: el.is_paid,
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
    console.log(e);
    this.studentImage = e;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */


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


