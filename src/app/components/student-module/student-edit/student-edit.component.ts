import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { StudentForm } from '../../../model/student-add-form';
import { StudentFeeStructure } from '../../../model/student-fee-structure';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { CourseListService } from '../../../services/course-services/course-list.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import { FeeModel, StudentFeeService } from '../student_fee.service';



@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.scss']
})
export class StudentEditComponent implements OnInit, OnDestroy {

  @ViewChild('saveAndContinue') btnSaveAndContinue: ElementRef;
  @ViewChild('btnPdcPopUpAdd') btnPdcPopUpAdd: ElementRef;
  @ViewChild('btnPayment') btnPayment: ElementRef;

  JsonFlags = {
    isDisabled: false,
    formIsActive: false,
  }

  countryDetails: any = [];
  isConvertEnquiry: boolean = false;
  isNewInstitute: boolean = true;
  isNewInstituteEditor: boolean = false;
  quickAddStudent: boolean = false;
  additionalBasicDetails: boolean = false;
  isAssignBatch: boolean = false;
  isAcad: boolean = false;
  isProfessional: boolean = false;
  multiOpt: boolean = false;
  isDuplicateStudent: boolean = false;
  isUpdateFeeAndExit: boolean = false;
  removeImage: boolean = false;
  isBasicActive: boolean = true;
  isOtherActive: boolean = false;
  isFeeActive: boolean = false;
  isInventoryActive: boolean = false;
  // isConfigureFees: boolean = false;
  isPartialPayHistory: boolean = false;
  isEdit: boolean = true;
  isDefineFees: boolean = false;
  isNewInstallment: boolean = false;
  isDiscountApply: boolean = false;
  isPdcApply: boolean = false;
  isDiscountApplied: boolean = false;
  reverse: boolean = false;
  genPdcAck: boolean = false;
  sendPdcAck: boolean = false;
  isManualDisplayId: boolean = false;
  thumbnailAvailable: boolean = false;
  tableHeaderCheckbox: boolean = false;
  isFeePaymentUpdate: boolean = false;
  showFeeSection: boolean = false;
  isShareDetails: boolean = false;
  resultForUnAssigned: boolean = true;

  instituteList: any[] = [];
  standardList: any[] = [];
  courseList: any[] = [];
  batchList: any[] = [];
  slots: any[] = [];
  selectedSlots: any[] = [];
  customComponents: any[] = [];
  slotIdArr: any[] = [];
  uploadedFiles: any[] = [];
  school: any[] = [];
  feeTemplateStore: any[] = [];
  inventoryItemsArr: any[] = [];
  newPdcArr: any[] = [];
  chequePdcList: any[] = [];
  pdcStatus: any[] = [{ data_key: '1', data_value: 'Pending' }, { data_key: '2', data_value: 'dishonoured' }];
  studentPartialPaymentData: any[] = [];
  paymentStatusArr: any[] = [];
  allocatedInventoryHistory: any[] = [];
  allotInventoryArr: any[] = [];
  studentAssisnedBatches: any[] = [];
  academicYear: any[] = [];
  savedAssignedBatch: any[] = [];
  allocatedItem: any = [];
  subjectWiseInstallmentArray: any = [];
  taxEnableCheck: any = '1';
  feeTempSelected: any = "";
  defaultAcadYear: any = '-1';
  courseDropdown: any = null;
  enableBiometric: any = "";
  pdcSelectedForPayment: any;
  containerWidth: any = "200px";
  student_id: any;
  schedule_id: any = "";
  assignedBatch: string = "";
  studentImage: string = '';
  selectedSlotsString: string = '';
  selectedSlotsID: string = '';
  assignedBatchString: string = '';
  userImageEncoded: string = '';
  is_undo: string = "N";
  studentServerImage: string = '';
  studentName: string = "";
  key: string = 'name';
  service_tax: number = 0;
  totalAmountToPay: number = 0;
  paymentMode: number = 0;
  clonedFeeObject: FeeModel;
  feeObject: FeeModel;
  selectedInstallment: number = 0;
  academicYearFilter: any;
  instituteCountryDetObj: any = {};
  maxlength: number = 10;
  country_id: number = null;
  selectedFiles: any[] = [];
  customFileArr: any[] = [];
  category_id: number | string = "";
  uploadedFileData: any[] = [];
  downloadStudentReportAccess: boolean = false;
  is_tax_enabled: boolean ;
  tax_type_without_percentage : String;
  Payment_Modes: any =[];

  studentAddFormData: StudentForm = {
    student_name: "",
    student_sex: "",
    student_email: "",
    country_id: "",
    state_id: "",
    city_id: "",
    area_id: "",
    student_phone: "",
    student_curr_addr: "",
    dob: "",
    doj: moment().format('YYYY-MM-DD'),
    expiry_date: "",
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
    student_id: 0,
    country_id: ''
  };

  feeStructureForm: any = {
    studentArray: ["-1"],
    template_effective_date: moment().format('YYYY-MM-DD')
  };

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

  addInventory: any = {
    alloted_units: 0,
    item_id: -1,
    available_units: '',
    date_of_dispatch: '',
    name_of_courier_service: '',
    docket_id: '',
    date_of_delivery_of_sm: '',
  };

  cardAmountObject: any = {
    feeAmountInclTax: 0,
    feeAmountExclTax: 0,
    taxAmount: 0,
    discountAmount: 0,
    amountPaid: 0,
    amountDue: 0,
    additionalFees: 0
  };

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

  checkBoxGroup: any = {
    unpaidInstallment: true,
    paidInstallment: false,
    feeDiscouting: false,
    manageCheque: false,
    hideReconfigure: false,
  };

  // state and city list
  stateList: any[] = [];
  cityList: any[] = [];
  areaList: any[] = [];
  addArea:boolean = false;

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
    private feeService: StudentFeeService,
    private apiService: CourseListService,
    private productService: ProductService,
    private msgToast: MessageShowService,
    private httpService: HttpService
  ) {
    this.getInstType();
    this.getSettings();
    this.student_id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
     this.auth.showLoader();
    this.getPermissions();
    this.fetchDataForCountryDetails();
    this.enableBiometric = sessionStorage.getItem('biometric_attendance_feature');
    this. is_tax_enabled=sessionStorage.getItem('enable_tax_applicable_fee_installments')=="1"?true:false;
    this.tax_type_without_percentage=sessionStorage.getItem("tax_type_without_percentage");
    if (sessionStorage.getItem('editPdc') != "" && sessionStorage.getItem('editPdc') != null) {
      this.switchToView('feeDetails-icon');
    }
    else if (sessionStorage.getItem('editInv') != "" && sessionStorage.getItem('editInv') != null) {
      this.switchToView('inventory-icon');
    }
    else {
      this.updateStudentForm(this.student_id);
      this.fetchPrefillFormData();
    }
  }

  getPermissions() {
    if (sessionStorage.getItem('permissions')) {
      let permissions = JSON.parse(sessionStorage.getItem('permissions'));

      if (permissions.includes('714')) {
        this.checkBoxGroup.manageCheque = true;
        this.showFeeSection = false;
        this.checkBoxGroup.hideReconfigure = false;
      }
      if (permissions.includes('710')) {
        this.showFeeSection = true;
        this.checkBoxGroup.hideReconfigure = true;
      }
      if (permissions.includes('713')) {  //fee discount
        this.checkBoxGroup.feeDiscouting = true;
      }
      if (sessionStorage.getItem('permissions') == undefined
        || sessionStorage.getItem('permissions') == ''
        || sessionStorage.getItem('username') == 'admin') {
        this.checkBoxGroup.feeDiscouting = true;
        this.showFeeSection = true;
        this.checkBoxGroup.hideReconfigure = true;
        this.checkBoxGroup.manageCheque = true;
      }
    }

    if (sessionStorage.getItem('downloadStudentReportAccess') == 'true') {
      this.downloadStudentReportAccess = true;
    }

  }



  fetchDataForCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
      let defacult_Country = this.countryDetails.filter((country) => {
        return country.is_default == 'Y';
      })
      this.country_id = defacult_Country[0].id;
      this.maxlength = defacult_Country[0].country_phone_number_length;
    }
  }

  getStateList(){
    const url = `/api/v1/country/state?country_ids=${this.country_id}`
     this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if(res.result.length > 0){
          this.stateList = res.result[0].stateList;
          if(this.studentAddFormData.state_id != ""){
            this.getCityList();
          }
        }
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    )
  }

  // get city list as per state selection
  getCityList(){
    const url = `/api/v1/country/city?state_ids=${this.studentAddFormData.state_id}`
     this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if(res.result.length > 0){
          this.cityList = res.result[0].cityList;
          if(this.studentAddFormData.city_id != ""){
            this.getAreaList();
          }
        }
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    )
  }

  getAreaList(){
    const url = `/api/v1/cityArea/area/${this.pdcAddForm.institution_id}?city_ids=${this.studentAddFormData.city_id}`
     this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if(res.result&&res.result.length > 0){
          this.areaList = res.result[0].areaList;
        }
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    )
  }

  toggleAddArea(){
    if(this.addArea){
      this.addArea = false;
    }
    else{
      this.addArea = true;
    }
  }

  resetStateCityArea(){
    this.stateList = [];
    this.cityList = [];
    this.areaList = [];
    this.studentAddFormData.state_id = "";
    this.studentAddFormData.city_id = "";
    this.studentAddFormData.area_id = "";
    this.getStateList();
  }
  getNewCityList(){
    this.cityList = [];
    this.areaList = [];
    this.studentAddFormData.city_id = "";
    this.studentAddFormData.area_id = "";
    this.getCityList()
  }

  getNewAreaList(){
    this.areaList = [];
    this.getAreaList();
  }

  onChangeObj(event) {
    this.countryDetails.forEach(element => {
      if (element.id == event) {
        this.instituteCountryDetObj = element;
        console.log(this.instituteCountryDetObj);
        this.studentAddFormData.country_id = element.id;
        this.maxlength = this.instituteCountryDetObj.country_phone_number_length;
        this.country_id = element.id;
      }
    });
    this.resetStateCityArea();
  }

  // remove the object value from session
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

  /**
   * this function is used for navigation as student selected type
   * changed by laxmi
   */
  navigateTo(text) {

    let classArray = ['li-one', 'li-two', 'li-three', 'li-four'];
    classArray.forEach(function (className) {
      document.getElementById(className).classList.remove('active');
    });
    this.isBasicActive = false;
    this.isOtherActive = false;
    this.isFeeActive = false;
    this.isInventoryActive = false;

    switch (text) {
      case "studentForm": {
        document.getElementById('li-one').classList.add('active');
        this.isBasicActive = true;
        break;
      }
      case "kyc": {
        document.getElementById('li-two').classList.add('active');
        this.fetchCustomeComponents();
        this.getUploadedFileData();
        this.isOtherActive = true;
        break;
      }
      case "feeDetails": {
        document.getElementById('li-three').classList.add('active');
        this.updateStudentForm(this.student_id);
        this.updateStudentFeeDetails();
        this.fetchAcademicYears()
        this.isFeeActive = true;
        break;
      }
      case "inventory": {
        document.getElementById('li-four').classList.add('active');
        this.isInventoryActive = true;
        this.getAllocatedHistory();
        this.fetchInventoryList();
        break;
      }
    }
  }

  //get courses
  getCourseDropdown(id) {
    this.auth.showLoader();
    this.fetchService.getStudentCourseDetails(id).subscribe(
      res => {
        this.auth.hideLoader();
        this.courseDropdown = res;
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }

  //get all selected studnet fee installment
  studentFeeInstallment(userType) {
    this.closeMenu();
    let object = {
      student_ids: this.student_id,// string by ids common seperated
      institution_id: '',
      sendEmail: userType,
    }
    if (userType == 1) {
      object['user_role'] = this.paymentMode;
    }
    this.auth.showLoader();
    this.postService.getFeeInstallments(object).subscribe((res: any) => {
      this.auth.hideLoader();
      if (userType == -1) {
        let byteArr = this.commonServiceFactory.convertBase64ToArray(res.document);
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('hiddenAnchorTag2');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        document.body.appendChild(dwldLink);
        dwldLink.click();
      } else {
        this.isShareDetails = false;
        let obj = {
          type: 'success',
          title: "fee installement send on your mail successfully",
          body: ""
        }
        this.appC.popToast(obj);
      }
    },
      (err: any) => {
        this.auth.hideLoader();
        // this.commonService.showErrorMessage('error', '', err.error.message);
        let obj = {
          type: 'error',
          title: err.error.message,
          body: ""
        }
        this.appC.popToast(obj);
      })
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
    this.auth.showLoader();
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
    this.JsonFlags.isDisabled = false;
    this.auth.hideLoader();
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
        this.navigateTo("studentForm");
        break;
      }
      case "kyc-icon": {
        this.navigateTo("kyc");
        break;
      }
      case "feeDetails-icon": {
        this.navigateTo("feeDetails");
        break;
      }
      case "inventory-icon": {
        this.navigateTo("inventory");
        break;
      }
      default: {
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
     this.auth.showLoader();
    this.JsonFlags.isDisabled = true;
    this.prefill.getSchoolDetails().subscribe(
      data => { this.instituteList = data; },
      err => {
        let msg = err.error.message;
        this.auth.hideLoader();
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    );
    //  this.auth.showLoader(); -- student not used code
    // this.studentPrefillService.fetchAllFeeStructure().subscribe(
    //   res => {
    //     this.feeTemplateStore = res;
    //   }
    // )
    //  this.auth.showLoader();
    // this.studentPrefillService.getChequeStatus().subscribe(
    //   data => {
    //     this.pdcStatus = data;
    //   },
    //   err => {
    //     let msg = err.error.message;
    //     this.auth.hideLoader();
    //     let obj = {
    //       type: 'error',
    //       title: msg,
    //       body: ""
    //     }
    //     this.appC.popToast(obj);
    //   }
    // )
     this.auth.showLoader();
    this.prefill.getEnqStardards().subscribe(
      data => { this.standardList = data; },
      err => {
        let msg = err.error.message;
        this.auth.hideLoader();
        let obj = {
          type: 'error',
          title: msg,
          body: ""
        }
        this.appC.popToast(obj);
      }
    );

    this.fetchAcademicYears();

  }


  fetchAcademicYears() {
    if (!this.academicYear.length) {
       this.auth.showLoader();
      this.prefill.getAllFinancialYear().subscribe(
        (data: any) => {
          this.academicYear = data;
          this.academicYear.forEach(e => {
            if (e.default_academic_year == 1) {
              this.defaultAcadYear = e.inst_acad_year_id;
              // console.log(this.academicYearFilter)
              this.academicYearFilter = this.defaultAcadYear;
            }
          });
        },
        err => {
          let msg = err.error.message;
          this.auth.hideLoader();
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

  fetchCustomeComponents() {
     this.auth.showLoader();
    this.studentPrefillService.fetchCustomComponentById(this.student_id, undefined, 2).subscribe(
      data => {
        this.auth.hideLoader();
        if (data != null) {
          data.forEach(el => {
            let max_length = el.comp_length == 0 ? 100 : el.comp_length;
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
              value: el.enq_custom_value,
              comp_length: max_length
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
                value: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value,
                comp_length: max_length
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
                value: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value,
                comp_length: max_length
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
                comp_length: max_length
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
                value: el.enq_custom_value,
                comp_length: max_length
              }
            }
            this.customComponents.push(obj);
          });
        }
      },
      err => {
        let msg = err.error.message;
        this.auth.hideLoader();
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
          title: '',
          body: 'No course assigned for standard'
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
    this.auth.showLoader();
    this.studentAddFormData.assignedBatches = e.assignedBatches;
    this.studentAddFormData.batchJoiningDates = e.batchJoiningDates;
    this.studentAddFormData.assignedBatchescademicYearArray = e.assignedBatchescademicYearArray;
    this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray = e.assignedCourse_Subject_FeeTemplateArray;
    this.studentAddFormData.deleteCourse_SubjectUnPaidFeeSchedules = e.deleteCourse_SubjectUnPaidFeeSchedules;
    this.assignedBatchString = e.assignedBatchString;
    this.isAssignBatch = e.isAssignBatch;
    this.auth.hideLoader();
  }

  getSlots() {
    this.slots = [];
    this.auth.showLoader();
    this.studentPrefillService.fetchSlots().subscribe(
      res => {
        this.auth.hideLoader();
        res.forEach(el => {
          let obj = {
            label: el.slot_name,
            value: el,
            status: false
          }
          this.slots.push(obj);
        });
        this.updateSlotsByStudent();
        // console.log(this.slots);

      },
      err => {
        let msg = err.error.message;
        this.auth.hideLoader();
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

  fetchCourseFromMaster(student_id, country_id) {
    let id = "-1";
    if (id == null || id == '') {
      this.courseList = [];
    }
    else {
      /* Fetch Course Mapped to Master Course */
      if (this.isProfessional) {
        this.studentPrefillService.fetchCourseList(student_id).subscribe(
          res => {
            this.courseList = res;
          }
        )
      }
      /* fetch batch details */
      else {
        this.batchList = [];
         this.auth.showLoader();
        if (sessionStorage.getItem('enable_fee_template_country_wise') == '1') {
          country_id = '-1';
        }

        this.studentPrefillService.fetchStudentCourseDetails(this.student_id, '-1', country_id).subscribe(
          res => {
            // console.log(res);
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
              this.updateAssignedBatches(this.batchList);
              this.auth.hideLoader();
              // console.log(this.batchList);
            } else {
              this.JsonFlags.isDisabled = false;
            }
          },
          err => {
            let msg = err.error.message;
            this.auth.hideLoader();
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

  isDuplicateContactClose() {
    this.isDuplicateStudent = false;
  }

  registerDuplicateStudent(form: NgForm) {
    this.auth.showLoader();
    this.postService.quickEditStudent(this.studentAddFormData, this.student_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
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
            title: '',
            body: 'Failed to add student'
          }
          this.appC.popToast(alert);
          this.isDuplicateContactClose();
        }
      },
      err => {
        let msg = err.error.message;
        this.auth.hideLoader();
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
    this.router.navigate(['/view/students']);
  }

  clearFormAndRoute(form: NgForm) {
    let previousUrl: string = '';
    if (this.isConvertEnquiry) {
      this.router.navigate(['/view/enquiry']);
    }
    else {
      this.router.navigate(['/view/students']);
    }
  }


  /* =========================================================================================================================================== */
  /* =========================================================================================================================================== */
  /* ======================          Student basic details and custom component updaters         =============================================== */
  /* ======================== Methods to update Student details , custom component and dependencies ============================================ */
  /* =========================================================================================================================================== */

  addStudentDataAndFetchFee(values: NgForm) {
    if (this.isManualDisplayId) {
      if (this.studentAddFormData.student_disp_id.trim() != "") {
        this.studentQuickAdder(values);
      }
      else {
        let obj = {
          type: 'error',
          title: 'Student Roll Number Missing',
          body: "Please enter a valid roll number"
        };
        this.appC.popToast(obj);
      }
    }
    else {
      this.studentQuickAdder(values);
    }
  }

  updateStudentForm(id) {
    this.auth.showLoader();
    /* Fetching Student Details from server */
    this.fetchService.getStudentById(id).subscribe(
      (data: any) => {
        // console.log(data);
        this.auth.hideLoader();
        this.studentName = data.student_name;
        this.studentAddFormData = data;
        this.studentAddFormData.school_name = data.school_name;
        this.studentAddFormData.standard_id = data.standard_id;
        this.fetchCourseFromMaster(this.studentAddFormData.standard_id, this.studentAddFormData.country_id);
        this.countryDetails.forEach(element => {
          if (element.id == this.studentAddFormData.country_id) {
            this.instituteCountryDetObj = element;
            this.maxlength = this.instituteCountryDetObj.country_phone_number_length;
            this.country_id = element.id;
          }
        });
        if (this.studentAddFormData.assignedBatchescademicYearArray == null) {
          this.studentAddFormData.assignedBatchescademicYearArray = [];
          this.studentAddFormData.assignedCourse_Subject_FeeTemplateArray = [];
        }
        this.thumbnailAvailable = true;
        if (data.photo != null && data.photo != "") {
          this.studentServerImage = data.photo;
        }
        this.getStateList();  // fetch state according to country
        /* Fetch Student Fee Realated Data from Server and Allocate Selected Fees */
        this.auth.hideLoader();
        this.getCourseDropdown(id);
        let globalInactiveStudent = sessionStorage.getItem('global_search_edit_student');
        if (data.is_active == "Y") {
          this.JsonFlags.formIsActive = true;
        }
        else {
          if ((globalInactiveStudent == 'true' && data.is_active != 'Y')
            || (sessionStorage.getItem('editPdc') != "" && sessionStorage.getItem('editPdc') != null && data.is_active != 'Y')
            || (sessionStorage.getItem('editInv') != "" && sessionStorage.getItem('editInv') != null && data.is_active != 'Y')) {
            this.router.navigate(['/view/students']);
          }
        }
        /* For Batch Model Fetch the Student Batches */
        if (this.isProfessional) {
          /* Fetching the student Slots */
          this.getSlots();
          this.auth.showLoader();
          this.JsonFlags.isDisabled = true;
          this.studentPrefillService.fetchStudentBatchDetails(id).subscribe(
            data => {
              this.JsonFlags.isDisabled = false;
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
              this.auth.hideLoader();
            },
            err => {
              this.JsonFlags.isDisabled = false;
              let msg = err.error.message;
              this.auth.hideLoader();
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
        // else {
        //   this.studentPrefillService.fetchStudentCourseDetails(id, this.studentAddFormData.standard_id).subscribe(
        //     res => {
        //  this.JsonFlags.isDisabled = false;
        //       this.batchList = [];
        //       if (res.coursesList != null) {
        //         res.coursesList.forEach(el => {
        //           if (el.feeTemplateList != null && el.feeTemplateList.length != 0 && el.selected_fee_template_id == -1) {
        //             el.feeTemplateList.forEach(e => {
        //               if (e.is_default == 1) {
        //                 el.selected_fee_template_id = e.template_id;
        //               }
        //             })
        //           }
        //           if (el.academic_year_id == '-1') {
        //             el.academic_year_id = this.defaultAcadYear;
        //           }
        //           // console.log(el, 'update form el');
        //           let obj = {
        //             isSelected: el.isAssigned == "Y" ? true : false,
        //             data: el,
        //             assignDate: this.getAssignDate(el.created_date)
        //           }
        //           this.batchList.push(obj);
        //         });
        //       }
        //       this.updateAssignedBatches(this.batchList);
        //     },
        //     err => {
        //
        //       let msg = err.error.message;
        //       this.auth.hideLoader();
        //       let obj = {
        //         type: 'error',
        //         title: msg,
        //         body: ""
        //       }
        //       this.appC.popToast(obj);
        //     }
        //   );
        // }
      },
      err => {
        this.auth.hideLoader();
        let al = {
          type: "error",
          title: err.error.message,
          body: ""
        };
        this.appC.popToast(al);
      });
  }

  setImage(e) {
    if (e != null && e != "") {
      this.studentServerImage = e;
      this.thumbnailAvailable = false;
    }

  }

  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  formValidator(): boolean {

    if (this.studentAddFormData.student_phone != null && this.studentAddFormData.student_phone != "") {
      if (isNaN(this.studentAddFormData.student_phone) == false && this.commonServiceFactory.phonenumberCheck(this.studentAddFormData.student_phone, this.maxlength, this.country_id) == true) {
        if (this.studentAddFormData.parent_phone != null && this.studentAddFormData.parent_phone != "") {
          if (isNaN(this.studentAddFormData.parent_phone) == false && this.commonServiceFactory.phonenumberCheck(this.studentAddFormData.parent_phone, this.maxlength, this.country_id) == true) {
            if (this.studentAddFormData.guardian_phone != null && this.studentAddFormData.guardian_phone != "") {
              if (isNaN(this.studentAddFormData.guardian_phone) == false && this.commonServiceFactory.phonenumberCheck(this.studentAddFormData.guardian_phone, this.maxlength, this.country_id) == true) {
                return true;
              } else {
                this.commonServiceFactory.showErrorMessage('error', '', 'Please enter valid contact number');
                return false;
              }
            }
            return true;
          }
          else {
            this.commonServiceFactory.showErrorMessage('error', '', 'Please enter valid contact number');
            return false;
          }
        }
        return true;
      } else {
        this.commonServiceFactory.showErrorMessage('error', '', 'Please enter valid contact number');
        return false;
      }
    } else {
      this.commonServiceFactory.showErrorMessage('error', '', 'Please enter contact number');
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
            enq_custom_value: el.value,
            comp_length: el.comp_length,
            type: el.type,
            label: el.label
          }
          customArr.push(obj);
        }
        /* Checkbox Custom Component */
        else if (el.type == 2) {
          if (el.value == "Y" || el.value == true) {
            let obj = {
              component_id: el.id,
              enq_custom_id: el.data.enq_custom_id,
              enq_custom_value: "Y",
              comp_length: el.comp_length,
              type: el.type,
              label: el.label
            }
            customArr.push(obj);
          }
          else if (el.value == "N" || el.value == false) {
            let obj = {
              component_id: el.id,
              enq_custom_id: el.data.enq_custom_id,
              enq_custom_value: "N",
              comp_length: el.comp_length,
              type: el.type,
              label: el.label
            }
            customArr.push(obj);
          }
        }
        /* Date Type Custom Component */
        else if (el.type == 5 && el.value != "" && el.value != null && el.value != "Invalid date") {
          let obj = {
            component_id: el.id,
            enq_custom_id: el.data.enq_custom_id,
            enq_custom_value: moment(el.value).format("YYYY-MM-DD"),
            comp_length: el.comp_length,
            type: el.type,
            label: el.label
          }
          customArr.push(obj);
        }
      });

      let email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z.]{2,5}$/;
      if (this.studentAddFormData.student_email != null && this.studentAddFormData.student_email != "") {
        if (!email.test(this.studentAddFormData.student_email)) {
          let alert = {
            type: 'error',
            title: '',
            body: 'Please enter valid email id'
          }
          this.appC.popToast(alert);
          return;
        }
      }
      if (this.studentAddFormData.parent_email != null && this.studentAddFormData.parent_email != "") {
        if (!email.test(this.studentAddFormData.parent_email)) {
          let alert = {
            type: 'error',
            title: '',
            body: 'Please enter valid parent email id'
          }
          this.appC.popToast(alert);
          return;
        }
      }

      if (this.studentAddFormData.guardian_email != null && this.studentAddFormData.guardian_email != "") {
        if (!email.test(this.studentAddFormData.guardian_email)) {
          let alert = {
            type: 'error',
            title: '',
            body: 'Please enter valid guardian email id'
          }
          this.appC.popToast(alert);
          return;
        }
      }

      /* Get slot data and store on form */
      this.studentAddFormData.slot_id = this.selectedSlotsID;
      this.studentAddFormData.stuCustomLi = customArr;
      this.studentAddFormData.photo = this.studentServerImage;
      // this.studentAddFormData.country_id=this.instituteCountryDetObj.id;
      // console.log(this.studentAddFormData);
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
      this.auth.showLoader();
      // console.log(this.studentAddFormData);
      this.postService.quickEditStudent(this.studentAddFormData, this.student_id).subscribe(
        (res: any) => {
          this.auth.hideLoader();
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
              this.router.navigate(['/view/students']);
            }
            else {
              this.navigateTo('feeDetails');
              this.updateStudentFeeDetails();
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
            this.isDuplicateStudent = true;
            this.getCourseDropdown(this.student_id);
          }
        },
        err => {
          this.btnSaveAndContinue.nativeElement.disabled = false;
          let msg = err.error.message;
          this.auth.hideLoader();
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
        title: '',
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
    if(this.createInstitute.instituteName.trim()!=''){
      if((this.instituteList.filter(x=>x.school_name == this.createInstitute.instituteName.trim())).length == 0){
        this.prefill.createNewInstitute(this.createInstitute).subscribe(el => {
        if (el.message === "OK") {
          let alert = {
            type: 'success',
            title: '',
            body: 'Institution added successfully !'
          }
          this.appC.popToast(alert);
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
        
      }
    },
    err=>{
      let alert = {
        type: 'error',
        title: '',
        body: err.error.message
      }
      this.appC.popToast(alert);
    }
    );
    } else {
      let alert = {
        type: 'error',
        title: '',
        body: 'Institution name already exist!'
      }
      this.appC.popToast(alert);
    }
   } else {
      let alert = {
      type: 'info',
      title: '',
      body: 'Please enter institution name'
    }
    this.appC.popToast(alert);
  }
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
        el.new_school_name = el.school_name;
      }
    });
  }

  cancelEditInstitute(id) {
    let temp = this.instituteList.filter(el=> el.school_id == id);
    if(temp) {
      temp[0].edit = false;
      temp[0].new_school_name = temp[0].school_name;
    }
  }

  updateInstitute(id, school_name) {
    if(school_name.trim()!=''){
      this.postService.updateInstituteDetails(id, school_name).subscribe(
      res => {
        let alert = {
          type: 'success',
          title: '',
          body: 'Institution name updated successfully!'
        }
        this.appC.popToast(alert);
        this.fetchInstituteInfo();
      },
      err => {
        let alert = {
          type: 'error',
          title: '',
          body: err.error.message
        }
        this.appC.popToast(alert);
        this.fetchInstituteInfo();
      }
    )
  } else {
    let alert = {
      type: 'info',
      title: '',
      body: 'Please enter institution name'
    }
    this.appC.popToast(alert);
}
}

  deleteInstitute(id) {
    this.postService.deleteInstitute(id).subscribe(
      res => {
        let alert = {
          type: 'success',
          title: '',
          body: "Institute record deleted successfully"
        }
        this.appC.popToast(alert);
        this.fetchInstituteInfo();
      },
      err => {
        let alert = {
          type: 'error',
          title: '',
          body: 'This institute is already in used, so cannot be deleted'
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
      && this.studentAddFormData.student_phone.length == this.maxlength) {
      return true;
    }
    else {
      return false;
    }
  }

  // New Function For Discounting
  updateStudentFeeDetails() {
    this.flushDataAfterPayement();
    let is_archived = "";
    if (this.resultForUnAssigned && this.isFeeActive) {
      is_archived = "N";
    }
    else if (this.isFeeActive) {
      is_archived = "Y";
    }
    // console.log(is_archived);
    this.auth.showLoader();
    this.feeService.fetchStudentFeeSchedule(this.student_id, is_archived).subscribe(
      (res: FeeModel) => {
        this.auth.hideLoader();
        this.feeObject = res;
        this.clonedFeeObject = this.commonServiceFactory.keepCloning(res);
        if (res.customFeeSchedules != null && res.customFeeSchedules.length > 0) {
          this.showFeeSection = true;
          this.checkBoxGroup.feeDiscouting = true;
          this.checkBoxGroup.hideReconfigure = true;
          if (sessionStorage.getItem('enable_fee_template_country_wise') == '1') {
            this.setTemplateDetails(res.customFeeSchedules[0]);// if setting is enable then country symbol and details will change --laxmi
          }
          if (sessionStorage.getItem('permissions')) {
            let permissions = JSON.parse(sessionStorage.getItem('permissions'));
            if (permissions.includes('714')) {
              this.showFeeSection = true;
              this.checkBoxGroup.feeDiscouting = false;
              this.checkBoxGroup.hideReconfigure = false;
            }
            if ((permissions.includes('710'))) {
              this.showFeeSection = true;
              this.checkBoxGroup.hideReconfigure = true;
            }
            else {
              this.checkBoxGroup.hideReconfigure = false;
            }
            if (permissions.includes('713')) {  //fee discount
              this.checkBoxGroup.feeDiscouting = true;
            }
            if (sessionStorage.getItem('permissions') == undefined
              || sessionStorage.getItem('permissions') == ''
              || sessionStorage.getItem('username') == 'admin') {
              this.checkBoxGroup.feeDiscouting = true;
              this.showFeeSection = true;
              this.checkBoxGroup.hideReconfigure = true;
              this.checkBoxGroup.manageCheque = true;
            }


          }
          this.cardAmountObject = this.feeService.makeCardLayoutJson(res.customFeeSchedules, this.feeObject.registeredServiceTax, this.instituteCountryDetObj.id);
          this.cardAmountObject.discountAmount = this.cardAmountObject.discountAmount + res.studentwise_total_fees_discount;
          console.log('cardObject', this.cardAmountObject);
          let customFeeSchedules = this.feeService.uniqueConvertFeeJson(res.customFeeSchedules);
          this.subjectWiseInstallmentArray = this.feeService.categoriseCourseWise(customFeeSchedules, res.registeredServiceTax, this.instituteCountryDetObj.id);
          console.log('subjectWise', this.subjectWiseInstallmentArray);
          this.onPaidOrUnpaidCheckbox(this.instituteCountryDetObj.id);// tax is apllied as per stud assign template
        } else {
          this.showFeeSection = false;
          this.checkBoxGroup.hideReconfigure = false;
        }
      },
      err => {
        this.commonServiceFactory.showErrorMessage('error', err.error.message, '');
        this.auth.hideLoader();
      }
    )
  }


  setTemplateDetails(coutry_object) {
    this.countryDetails.forEach(element => {
      if (element.id == coutry_object.country_id) {
        this.instituteCountryDetObj = element;
      }
    });
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
    this.updateSelectedInstallment(event);
  }

  updateSelectedInstallment(event) {
    if (event) {
      this.selectedInstallment = this.selectedInstallment + 1;
    }
    else {
      this.selectedInstallment = this.selectedInstallment - 1;
    }
  }


  onPaidOrUnpaidCheckbox(country_id) {
    if (this.checkBoxGroup.unpaidInstallment && this.checkBoxGroup.paidInstallment) {
      let installment = this.commonServiceFactory.keepCloning(this.clonedFeeObject.customFeeSchedules);
      this.subjectWiseInstallmentArray = this.feeService.categoriseCourseWise(installment, this.clonedFeeObject.registeredServiceTax, country_id);
      return;
    }

    if (this.checkBoxGroup.unpaidInstallment) {
      let installment = this.commonServiceFactory.keepCloning(this.clonedFeeObject.customFeeSchedules);
      let unpaidInstallment = installment.filter(el => el.paid_full == "N");
      this.subjectWiseInstallmentArray = this.feeService.categoriseCourseWise(unpaidInstallment, this.clonedFeeObject.registeredServiceTax, country_id);
      return;
    }

    if (this.checkBoxGroup.paidInstallment) {
      let installment = this.commonServiceFactory.keepCloning(this.clonedFeeObject.customFeeSchedules);
      let unpaidInstallment = installment.filter(el => el.paid_full == "Y");
      this.subjectWiseInstallmentArray = this.feeService.categoriseCourseWise(unpaidInstallment, this.clonedFeeObject.registeredServiceTax, country_id);
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
    this.getPaymentModes();
  }

  getPaymentModes(){
    this.httpService.getData('/api/v1/masterData/type/PAYMENT_MODES').subscribe(
      (res:any)=>{
        console.log(res);
        this.Payment_Modes = res;
      },
      err=>{
        console.log(err);
      }
    )
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
          obj.pdc_cheque_id = el.cheque_id;
          this.paymentPopUpJson.pdcSelectedForm = obj;
          this.paymentPopUpJson.selectedPdcId = id;
          this.paymentPopUpJson.payingAmount = el.cheque_amount;
          obj.country_id = el.country_id;
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
    // console.log(JsonToSendOnServer);
    this.auth.showLoader();
    this.btnPayment.nativeElement.disabled = true;
    this.postService.payPartialFeeAmount(JsonToSendOnServer).subscribe(
      res => {
        this.btnPayment.nativeElement.disabled = false;
        this.auth.hideLoader();
        this.commonServiceFactory.showErrorMessage('success', '', 'Fee details has been updated');
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
        this.auth.hideLoader();
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
        this.commonServiceFactory.showErrorMessage('error', '', err.error.message);
      });
  }

  emailFeeReceipt(res) {
    this.fetchService.emailReceiptById(this.student_id, res.other).subscribe(
      res => {
        this.commonServiceFactory.showErrorMessage('success', '', 'Receipt has been sent to student/parent email ID');
      }
    )
  }

  downloadDocument(res) {
    let body = res;
    let byteArr = this.commonServiceFactory.convertBase64ToArray(body.document);
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
      this.commonServiceFactory.showErrorMessage('warning', '', 'Invalid payment amount');
      this.paymentPopUpJson.payingAmount = this.paymentPopUpJson.immutableAmount;
      this.paymentPopUpJson.pdcSelectedForm.cheque_amount = this.paymentPopUpJson.immutableAmount;
    }
    else {
      this.paymentPopUpJson.pdcSelectedForm.cheque_amount = Number(e);
    }

    // if (e > this.paymentPopUpJson.immutableAmount) {
    //   this.commonServiceFactory.showErrorMessage('warning', 'Invalid payment amount', '');
    //   this.paymentPopUpJson.payingAmount = this.paymentPopUpJson.immutableAmount;
    //   this.paymentPopUpJson.pdcSelectedForm.cheque_amount = this.paymentPopUpJson.immutableAmount;
    // } else if (e <= 0) {
    //   this.commonServiceFactory.showErrorMessage('warning', 'Invalid payment amount', '');
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
  openPartialPaymentHistor(data) {
    this.isPartialPayHistory = true;
    this.schedule_id = data.schedule_id;
  }

  closeHistory(event) {
    this.isPartialPayHistory = false;
    this.schedule_id = "";
  }

  /* Configure Fee -- commeneted by laxmi 21-02-20
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
  
   reCreateFeeAgain() {
    if (confirm("By changing the fee template, all existing fee schedule and transactions shall be discarded and archived. Are you sure you want to continue?")) {
      this.isConfigureFees = true;
      this.is_undo = 'Y';
      this.feeTemplateById = { feeTypeMap: "", customFeeSchedules: [], registeredServiceTax: "", studentArray: "", studentwise_total_fees_amount: "", studentwise_total_fees_balance_amount: "", studentwise_total_fees_amount_paid: "", studentwise_total_fees_discount: "", studentwise_fees_tax_applicable: "", no_of_installments: "", discount_fee_reason: "", template_name: "", template_id: "", template_effective_date: "", is_fee_schedule_created: "", is_fee_tx_done: "", is_undo: this.is_undo, is_fee_other_inst_created: "", is_delete_other_fee_types: "", chequeDetailsJson: "", payment_mode: "", remarks: "", paid_date: "", toCreate: false, is_cheque_details_required: "", reference_no: "", invoice_no: "", uiSelected: false };
      this.isDefineFees = false;
      this.isDiscountApplied = false;
    }
  }

  */

  getInstasllemttDetails(installment) {
    console.log(installment);
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
      this.auth.showLoader();
      this.studentPrefillService.getFeeStructureById(this.feeTempSelected, this.feeStructureForm).subscribe(
        res => {
          this.auth.hideLoader();
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
          // this.closeConfigureFees();
        },
        err => {
          let msg = err.error.message;
          this.auth.hideLoader();
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
        body: 'Please enter a valid date'
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


  sort(key) {
    this.key = key;
    if (key == 'due_date') {
      this.reverse = false;
    }
    else {
      this.reverse = !this.reverse;
    }
  }


  getPdcChequeList() {
    let obj = {
      cheque_status: this.pdcSearchObj.cheque_status == '' ? -1 : this.pdcSearchObj.cheque_status,
      student_id: this.student_id,
      cheque_date_from: this.pdcSearchObj.cheque_date_from == "Invalid date" ? '' : moment(this.pdcSearchObj.cheque_date_from).format('YYYY-MM-DD'),
      cheque_date_to: this.pdcSearchObj.cheque_date_to == "Invalid date" ? '' : moment(this.pdcSearchObj.cheque_date_to).format('YYYY-MM-DD')
    }
     this.auth.showLoader();
    this.pdcAddForm.country_id = this.instituteCountryDetObj.id;
    this.studentPrefillService.getPdcList(this.student_id, obj).subscribe(
      res => {
        this.auth.hideLoader();
        let temp: any[] = [];
        res.forEach(el => {
          let obj = { bank_name: el.bank_name, cheque_amount: el.cheque_amount, cheque_date: el.cheque_date, cheque_date_from: el.cheque_date_from, cheque_date_to: el.cheque_date_from, cheque_id: el.cheque_id, cheque_no: el.cheque_no, cheque_status: el.cheque_status, cheque_status_key: el.cheque_status_key, clearing_date: el.clearing_date, genAck: el.genAck, institution_id: el.institution_id, sendAck: el.sendAck, student_id: el.student_id, student_name: el.student_name, student_phone: el.student_phone, uiSelected: false, country_id: el.country_id };
          temp.push(obj);
        });
        this.chequePdcList = temp;
      }, error => {
        this.auth.hideLoader();
      }
    )
  }

  addNewPDCState() {
    //console.log(this.pdcAddForm);
    let obj = { bank_name: this.pdcAddForm.bank_name, cheque_amount: this.pdcAddForm.cheque_amount, cheque_date: moment(this.pdcAddForm.cheque_date).format("YYYY-MM-DD"), cheque_id: this.pdcAddForm.cheque_id, cheque_no: this.pdcAddForm.cheque_no, cheque_status: this.pdcAddForm.cheque_status, cheque_status_key: this.pdcAddForm.cheque_status_key, clearing_date: moment(this.pdcAddForm.clearing_date).format("YYYY-MM-DD"), institution_id: sessionStorage.getItem('institute_id'), student_id: this.student_id, country_id: this.pdcAddForm.country_id };
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
    this.btnPdcPopUpAdd.nativeElement.disabled = true;
    this.auth.showLoader();
    this.postService.addChequePdc(temp).subscribe(
      res => {
        this.auth.hideLoader();
        this.btnPdcPopUpAdd.nativeElement.disabled = false;
        this.chequePdcList = [];
        this.newPdcArr = [];
        this.pdcAddForm = { bank_name: '', cheque_amount: '', cheque_date: '', cheque_id: 0, cheque_no: '', cheque_status: '', cheque_status_key: 0, clearing_date: '', institution_id: sessionStorage.getItem('institute_id'), student_id: 0, country_id: '' };
        this.getPdcChequeList();
      },
      err => {
        this.auth.hideLoader();
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
      this.auth.showLoader();
      this.postService.deletePdcById(data.cheque_id).subscribe(
        res => {
          this.auth.hideLoader();
          this.chequePdcList.splice(i, 1);
        },
        err => {
          let msg = err.error.message;
          this.auth.hideLoader();
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
      let obj = { bank_name: el.bank_name, cheque_amount: el.cheque_amount, cheque_date: moment(el.cheque_date).format("YYYY-MM-DD"), cheque_id: el.cheque_id, cheque_no: el.cheque_no, cheque_status_key: el.cheque_status_key, clearing_date: moment(el.clearing_date).format("YYYY-MM-DD"), institution_id: sessionStorage.getItem('institute_id'), student_id: el.student_id, country_id: el.country_id };
       this.auth.showLoader();
      this.postService.updateFeeDetails(obj).subscribe(
        res => {
          this.auth.hideLoader();
          // this.pdcStatus.forEach(e => { if (e.cheque_status_key == el.cheque_status_key) { el.cheque_status = e.cheque_status } });
          this.getPdcChequeList();
          document.getElementById((el.student_id + el.cheque_id).toString()).classList.add('displayComp');
          document.getElementById((el.student_id + el.cheque_id).toString()).classList.remove('editComp');
        },
        err => {
          let msg = err.error.message;
          this.auth.hideLoader();
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
      this.commonServiceFactory.showErrorMessage('error', 'No PDC selected', '')
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
    this.auth.showLoader();
    this.postService.generateAcknowledge(chequeId, student_id, key).subscribe(
      res => {
        this.auth.hideLoader();
        if (key == 'Y') {
          // this.commonServiceFactory.showErrorMessage('success', 'Send Successfullly', '');
          this.commonServiceFactory.showErrorMessage('success', '', 'Acknowledgement receipt sent to ' + this.studentAddFormData.student_email);
        } else if (key == "undefined") {
          this.downloadDocument(res);
        }
      },
      err => {
        this.auth.hideLoader();
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
    this.auth.showLoader();
    this.studentPrefillService.fetchInventoryListById(this.student_id).subscribe(
      data => {
        this.auth.hideLoader();
        this.inventoryItemsArr = data;
      },
      err => {
        this.auth.hideLoader();
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
          this.appC.popToast({ type: "error", title: '', body: "Please enter allocated unit less than available units" });
          return;
        } else {
          if (this.addInventory.date_of_dispatch != '') {
            this.addInventory.date_of_dispatch = moment(this.addInventory.date_of_dispatch).format('YYYY-MM-DD')
          }
          if (this.addInventory.date_of_delivery_of_sm != '') {
            this.addInventory.date_of_delivery_of_sm = moment(this.addInventory.date_of_delivery_of_sm).format('YYYY-MM-DD')
          }
          let obj: any = {
            alloted_units: this.addInventory.alloted_units.toString(),
            institution_id: sessionStorage.getItem('institute_id'),
            item_id: this.addInventory.item_id,
            student_id: this.student_id,
            date_of_dispatch: this.addInventory.date_of_dispatch,
            name_of_courier_service: this.addInventory.name_of_courier_service,
            docket_id: this.addInventory.docket_id,
            date_of_delivery_of_sm: this.addInventory.date_of_delivery_of_sm,
          };
          this.auth.showLoader();
          this.postService.allocateInventory(obj).subscribe(
            res => {
              this.auth.hideLoader();
              this.appC.popToast({ type: "success", title: "", body: "Inventory Item Allocated Successfully" });
              this.addInventory = {
                alloted_units: 0,
                item_id: -1,
                available_units: '',
                date_of_dispatch: '',
                name_of_courier_service: '',
                docket_id: '',
                date_of_delivery_of_sm: '',
              };
              this.getAllocatedHistory();
              this.fetchInventoryList();
            },
            err => {
              this.auth.hideLoader();
              this.appC.popToast({ type: "error", title: '', body: err.error.message });
            }
          )

        }
      } else {
        this.appC.popToast({ type: "error", title: '', body: "Please enter valid unit to allocate" });
        return;
      }
    } else {
      this.appC.popToast({ type: "error", title: '', body: "Please enter inventory item to add" });
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
          this.appC.popToast({ type: "success", title: "Deleted Successfully", body: "Inventory deleted successfully" });
          this.getAllocatedHistory();
          this.fetchInventoryList();
        }
      )
    }
  }

  cancelStudentUpload() {
    this.router.navigate(['/view/students']);
  }

  studentAddedNotifier() {
    let msg = { type: 'success', title: 'Student Registered', body: 'Student details have been updated' };
    this.appC.popToast(msg);
    this.router.navigate(['/view/students']);
  }


  openMenu(index) {
    document.getElementById('menuList').classList.toggle('hide');
  }
  closeMenu() {
    document.getElementById('menuList').classList.add('hide');
  }

  storeFiles() {
    let manualUploadedFileList = (<HTMLInputElement>document.getElementById('uploadFileControl')).files;
    let filesArr = Array.from(manualUploadedFileList);
    this.selectedFiles = filesArr;
  }

  uploadHandler() {
    if (this.category_id != '') {
      if (this.selectedFiles.length == 0) {
        this.appC.popToast({ type: "error", body: "No file selected" })
        return
      }

      const path: string = "";
      let formData = new FormData();

      let arr = Array.from(this.selectedFiles)
      arr.map((ele, index) => {
        formData.append("files", ele);
      })
      const base = this.auth.getBaseUrl();
      const fileJson = { title: this.category_id, studentId: this.student_id, documentNumber: "" }
      const urlPostXlsDocument = base + `/users-file/uploadFile?fileJson=${JSON.stringify(fileJson)}`;
      const newxhr = new XMLHttpRequest();
      const auths: any = {
        userid: sessionStorage.getItem('userid'),
        userType: sessionStorage.getItem('userType'),
        password: sessionStorage.getItem('password'),
        institution_id: sessionStorage.getItem('institute_id'),
      }
      let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);

      newxhr.open("POST", urlPostXlsDocument, true);
      newxhr.setRequestHeader("x-proc-user-id", sessionStorage.getItem('userid'));
      newxhr.setRequestHeader("institute_id", sessionStorage.getItem('institute_id'));
      newxhr.setRequestHeader("Authorization", Authorization);
      newxhr.setRequestHeader("enctype", "multipart/form-data;");
      newxhr.setRequestHeader("keyName", path);
      newxhr.setRequestHeader("Accept", "application/json, text/javascript");
      newxhr.setRequestHeader("x-proc-inst-id", sessionStorage.getItem('institute_id'));
      newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      this.auth.showLoader();
      newxhr.onreadystatechange = () => {
        this.auth.hideLoader();
        if (newxhr.readyState == 4) {
          if (newxhr.status >= 200 && newxhr.status < 300) {
            let data = {
              type: 'success',
              title: "File uploaded successfully",
              body: newxhr.response.fileName
            }
            this.appC.popToast(data);
            this.getUploadedFileData();
          } else {
            let data = {
              type: 'info',
              title: "File upload Failed",
              body: newxhr.response.fileName
            }
            this.appC.popToast(data);
          }
        }
      }
      newxhr.send(formData);
    } else {
      if (this.selectedFiles.length == 0) {
        this.appC.popToast({ type: "error", body: "No file selected" })
        return
      }

    }
    this.category_id = '';
    (<HTMLInputElement>document.getElementById('uploadFileControl')).value = null;
  }

  getUploadedFileData() {
     this.auth.showLoader();
    const url = `/users-file/downloadFile?studentId=${this.student_id}`;
    this.productService.getUploadFileData(url).subscribe(
      (res: any) => {
        this.uploadedFileData = res;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }

  downloadFile(object) {
    const url = object.fileUrl;
    var hiddenDownload = <HTMLAnchorElement>document.getElementById('downloadFileClick');
    hiddenDownload.href = url;
    hiddenDownload.download = object.title;
    // hiddenDownload.download = this.getOriginalFileName(fileObj.res.file_name);
    hiddenDownload.click();
    this.updateDownloadCount(object);
  }

  updateDownloadCount(object) {
    this.auth.showLoader();
    const url = `/users-file/update-File-download-count/?studentId=${this.student_id}&id=${object.id}`;
    this.productService.getUploadFileData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }

  deletefile(id) {
    if (confirm('Are you sure, you want to delete file?')) {
    this.auth.showLoader();
    const url = `/users-file/delete-file/?studentId=${this.student_id}&id=${id}`;
    this.productService.deleteFile(url).subscribe(
      (res:any) => {
        this.appC.popToast({ type: "success", title: "", body: "File deleted successfully" });      
        if(res){
          this.getUploadedFileData();
        }
          this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }
  }
}
