import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import * as moment from 'moment';
import { addEnquiryForm } from '../../../model/add-enquiry-form';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { LoginService } from '../../../services/login-services/login.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MultiBranchDataService } from '../../../services/multiBranchdata.service';
import { ClosingReasonService } from '../../../services/closingReasons/closing-reason.service';
import { CommonServiceFactory } from '../../../services/common-service';

@Component({
  selector: 'app-enquiry-edit',
  templateUrl: './enquiry-edit.component.html',
  styleUrls: ['./enquiry-edit.component.scss']
})
export class EnquiryEditComponent implements OnInit {

  isConvertToStudent: boolean = false;
  /* Variable Declarations */
  countrySelected: string = "";
  countryList: any = [];
  enqstatus: any = [];
  enqPriority: any = [];
  enqFollowType: any = [];
  enqAssignTo: any = [];
  enqStd: any = [];
  enqSub: any = [];
  enqScholarship: any = [];
  enqSub2: any = [];
  school: any = [];
  sourceLead: any = [];
  refferedBy: any = [];
  occupation: any = [];
  lastDetail: any = [];
  confimationPop: boolean = false; res
  updatePop: boolean = false;
  isProfessional: boolean = false;
  institute_enquiry_id: any = '';
  editEnqData: addEnquiryForm = {
    name: "",
    country_id: "",
    phone: "",
    email: "",
    dob: '',
    gender: "",
    country: "",
    phone2: "",
    email2: "",
    curr_address: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    master_course_name: "",
    city: -1,
    area: -1,
    occupation_id: "-1",
    school_id: "-1",
    qualification: "",
    grade: "",
    enquiry_date: moment().format('YYYY-MM-DD'),
    standard_id: "-1",
    subject_id: "-1",
    subjectIdArray: null,
    referred_by: "-1",
    source_id: "-1",
    fee_committed: "",
    discount_offered: "",
    priority: "",
    enquiry: "",
    follow_type: "",
    followUpDate: "",
    religion: null,
    link: "",
    slot_id: null,
    closedReason: "",
    demo_by_id: "",
    status: "",
    assigned_to: "-1",
    followUpTime: "",
    lead_id: -1,
    enqCustomLi: [],
    source_instituteId: -1,
    walkin_followUpDate: '',
    walkin_followUpTime: '',
    courseIdArray: null,
    closing_reason_id: '-1',
    is_follow_up_time_notification: false
  };
  isUpdateComment: boolean = false;
  additionDetails: boolean = false;
  institute_id: any = "100123";
  todayDate: number = Date.now();
  isSourcePop: boolean = false;
  isInstitutePop: boolean = false;
  isRefferPop: boolean = false;
  componentPrefill: any = [];
  componentListObject: any = {};
  emptyCustomComponent: any;
  selectedComponent: any;
  componentRenderer: any = [];
  isCustomComponentValid: boolean = true;
  isFormValid: boolean = false;
  lastUpdated: any;
  errorMessage: any;
  submitError: boolean = false;
  addNextCheck: boolean = false;
  isEnquiryAdmin: boolean = false;
  updateFormComments: any[] = [];
  updateFormCommentsBy: any[] = [];
  updateFormCommentsOn: any[] = [];
  commentUpdater: any[] = [];
  private customComponents: any[] = [];
  /* Model for Enquiry Update Popup Form */
  updateFormData = {
    comment: "",
    status: "",
    statusValue: "",
    institution_id: sessionStorage.getItem('institute_id'),
    isEnquiryUpdate: "Y",
    closedReason: null,
    slot_id: null,
    priority: "",
    follow_type: "",
    followUpDate: "",
    commentDate: moment().format('YYYY-MM-DD'),
    followUpTime: "",
    isEnquiryV2Update: "N",
    isRegisterFeeUpdate: "N",
    amount: null,
    paymentMode: null,
    paymentDate: null,
    reference: null,

  }
  hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['', '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  meridianArr: any[] = ['', "AM", "PM"];
  hour: string = '';
  minute: string = '';
  meridian: string = ''
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  followUpTime: any = "";
  // City And Area Changes
  isCityMandatory: any;
  cityListDataSource: any = [];
  areaListDataSource: any = [];
  countryListDataSource: any = [];
  actualAssignee: any;
  isMainBranch: any = "N";
  branchesList: any = [];
  subBranchSelected: any = false;
  course_standard_id: any = '-1';
  course_subject: any[] = [];
  course_mastercourse_id: any = '-1';
  course_course: any[] = [];
  masterCourseData: any[] = [];
  isEnquirySubmit: boolean = false;
  closingReasonDataSource: any = [];
  closingReasonOpen: boolean = false;
  isNewRefer: boolean;
  instituteCountryDetObj: any = {};
  createNewReasonObj = {
    closing_desc: "",
    institution_id: this.service.institute_id
  };
  enquiryStatus: any = '0';
  walkintime: any = {
    hour: '',
    minute: ''
  }
  minuteArr: any[] = ['', '00', '15', '30', '45'];
  countryDetails: any=[];
  maxlength: any = 10;

  /* Return to login if Auth fails else return to enqiury list if no row selected found, else store the rowdata to local variable */
  constructor(
    private prefill: FetchprefilldataService,
    private router: Router,
    private pops: PopupHandlerService,
    private poster: PostEnquiryDataService,
    private login: LoginService,
    private route: ActivatedRoute,
    private auth: AuthenticatorService,
    private multiBranchService: MultiBranchDataService,
    private service: ClosingReasonService,
    private commonServiceFactory: CommonServiceFactory) {

    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

    if (sessionStorage.getItem('userid') == null) {
      this.showErrorMessage('error', 'User not logged-in', "Please login to continue");
      this.router.navigateByUrl('/login');
    }
    else {
      this.institute_enquiry_id = this.route.snapshot.paramMap.get('id');
      this.fetchCommentData(this.route.snapshot.paramMap.get('id'));
    }
  }


  /* OnInit Initialized */
  ngOnInit() {
    this.isCityMandatory = sessionStorage.getItem('enable_routing');
    this.isEnquiryAdministrator();
    this.FetchEnquiryPrefilledData();
    this.updateEnquiryData()

    // Multi Branch Check
    this.auth.isMainBranch.subscribe(
      (value: any) => {
        this.isMainBranch = value;
        if (this.isMainBranch == "Y") {
          this.editEnqData.source_instituteId = sessionStorage.getItem('institute_id');
          this.multiBranchInstituteFound(this.editEnqData.source_instituteId);
        }
      }
    );

    this.multiBranchService.subBranchSelected.subscribe(
      res => {
        this.subBranchSelected = res;
        if (this.subBranchSelected) {
          this.editEnqData.source_instituteId = sessionStorage.getItem('institute_id');
          const mainBranchID = sessionStorage.getItem('mainBranchId');
          if (mainBranchID != null) {
            this.multiBranchInstituteFound(mainBranchID);
          }
        }
      }
    )
    console.log(this.editEnqData);
    this.fetchDataForCountryDetails();
    this.checklengthOfCountry();
  }

  fetchDataForCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = atob(encryptedData);
    data = JSON.parse(data);
    if (data.length > 0) {
    this.countryDetails = data;
    console.log(this.countryDetails);
    }
  }

  checklengthOfCountry() {
    if (this.countryDetails.length <= 1) {
      this.countryDetails.forEach(element => {
        this.instituteCountryDetObj = element;
      }
      );
      this.editEnqData.country_id = this.instituteCountryDetObj.country_id;
      return true;
    }
    else {
      return false;
    }
  }
  onChangeObj(event) {
    console.log(event);
    this.countryDetails.forEach(element => {
      if (element.id == event) {
        this.instituteCountryDetObj = element;
        this.maxlength=this.instituteCountryDetObj.country_phone_number_length;
      }
    }
    );
  }

  timeChanges(ev, id) {
    // 
    if (ev.split(' ')[0] != '') {
      this.hour = ev.split(' ')[0];
      this.meridian = ev.split(' ')[1];

      //console.log(this.hour + "" +this.meridian)
    }
    else {
      this.hour = '';
      this.meridian = '';
    }
    this.notifyMeCheckBoxChangesDetect();

  }
  /* set the enquiry feilds for Form */
  updateEnquiryData() {
    this.institute_enquiry_id = this.route.snapshot.paramMap.get('id');
    this.fetchCommentData(this.route.snapshot.paramMap.get('id'));
    let id = this.institute_enquiry_id;
    this.prefill.fetchEnquiryByInstituteID(id).subscribe(
      data => {
        this.editEnqData = data;
        console.log(data);
        // this.editEnqData.country_id = this.instituteCountryDetObj.country_id;
        this.countryDetails.forEach(element => {
          if (element.id == this.editEnqData.country_id) {
            this.instituteCountryDetObj = element;
            this.maxlength=this.instituteCountryDetObj.country_phone_number_length;
          }
        }
        );
        this.enquiryStatus = data.status;
        if (this.editEnqData.courseIdArray != null && this.editEnqData.courseIdArray.length) {
          this.editEnqData.courseIdArray = this.editEnqData.courseIdArray.map(el => { return parseInt(el) });
        }
        if (this.editEnqData.subjectIdArray != null && this.editEnqData.subjectIdArray.length) {
          this.editEnqData.subjectIdArray = this.editEnqData.subjectIdArray.map(el => { return parseInt(el) });
        }
        this.actualAssignee = data.assigned_to;
        this.editEnqData.dob = this.editEnqData.dob == null ? null : this.editEnqData.dob;
        if (data.followUpTime != '' && data.followUpTime != null && data.followUpTime != " :") {
          let followUpDateTime = moment(data.followUpDate).format('YYYY-MM-DD') + " " + data.followUpTime;
          this.hour = moment(followUpDateTime).format('h');
          this.followUpTime = moment(followUpDateTime).format('h') + " " + moment(followUpDateTime).format('a').toString().toUpperCase();
          this.minute = moment(followUpDateTime).format('mm');
          this.meridian = moment(followUpDateTime).format('a').toString().toUpperCase();
        }

        if (data.walkin_followUpDate != "" && data.walkin_followUpDate != "Invalid date" && data.walkin_followUpDate != null) {
          this.editEnqData.walkin_followUpDate = data.walkin_followUpDate;
        }

        if (data.walkin_followUpTime != "" && data.walkin_followUpTime != null && data.walkin_followUpTime != ": ") {
          this.walkintime = this.breakTimeInToHrAndMin(data.walkin_followUpTime);
        }

        this.updateCustomComponent(id);
        this.fetchSubject(this.editEnqData.standard_id);
        if (!this.isProfessional) {
          this.prefill.getMasterCourseData().subscribe(
            (res: any) => {
              this.masterCourseData = res;
              if (this.editEnqData.courseIdArray != null && this.editEnqData.courseIdArray.length) {
                this.editEnqData.courseIdArray = this.editEnqData.courseIdArray.map(el => { return parseInt(el) });
              }
              this.courseMasterChange(this.editEnqData.master_course_name)
            });
        }
        else if (this.isProfessional) {

        }
        if (data.city != "" && data.city != null) {
          this.onCitySelctionChanges(data.city);
        }
        if (this.isMainBranch == 'Y' || this.subBranchSelected == true) {
          this.editEnqData.source_instituteId = sessionStorage.getItem('institute_id');
        }
      });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  fetchMasterCourseDetails() {
    this.prefill.getMasterCourseData().subscribe(
      (res: any) => {
        this.masterCourseData = res;
      });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getCustomComponents(): any[] {
    let tempArr: any[] = [];
    this.customComponents.forEach(e => {
      if (e.type == 5) {
        if (e.hasOwnProperty('value')) {
          let dd = moment(e.value).format("YYYY-MM-DD");
          if (dd != '' && dd != "Invalid date" && dd != null) {
            let obj: any = {};
            obj.component_id = e.id;
            obj.enq_custom_id = e.data.enq_custom_id;
            obj.enq_custom_value = moment(e.value).format("YYYY-MM-DD");
            obj.comp_length = e.comp_length;
            tempArr.push(obj);
          }
        }
      }
      else {
        if (e.hasOwnProperty('value')) {
          if (typeof e.value == 'string') {
            if (e.value.trim() != '') {
              let obj: any = {};
              obj.component_id = e.id;
              obj.enq_custom_id = e.data.enq_custom_id;
              obj.enq_custom_value = e.value;
              obj.comp_length = e.comp_length;
              tempArr.push(obj);
            }
          }
          else if (typeof e.value == 'boolean') {
            if (e.value) {
              let obj: any = {};
              obj.component_id = e.id;
              obj.enq_custom_id = e.data.enq_custom_id;
              obj.enq_custom_value = "Y";
              obj.comp_length = e.comp_length;
              tempArr.push(obj);
            }
            else {
              let obj: any = {};
              obj.component_id = e.id;
              obj.enq_custom_id = e.data.enq_custom_id;
              obj.enq_custom_value = "N";
              obj.comp_length = e.comp_length;
              tempArr.push(obj);
            }
          }
        }
      }
    });
    return tempArr;
  }

  fillCustomComponent(v, comp) {
    if (v) {
      this.customComponents.forEach(e => {
        if (e.id === comp.id) {
          e.value = v;
        }
      })
    }
    else {
      this.customComponents.forEach(e => {
        if (e.id === comp.id) {
          e.value = v;
        }
      })
    }
  }

  /* Function for Toggling Form Visibility */
  toggleForm(event) {
    let eleid = event.srcElement.id;
    //console.log(eleid);
    if (eleid == "openBasic") {
      var academic = document.getElementById('academicDetails').classList;
      academic.remove('active');
      var basic = document.getElementById('basicDetails').classList;
      basic.add('active');
    }
    else if (eleid == "closeBasic") {
      var basic = document.getElementById('basicDetails').classList;
      basic.remove('active');
      var academic = document.getElementById('academicDetails').classList;
      academic.add('active');
    }
    else if (eleid == "openAcademic") {
      var basic = document.getElementById('basicDetails').classList;
      //console.log(basic);
      basic.remove('active');
      var academic = document.getElementById('academicDetails').classList;
      //console.log(academic);
      academic.add('active');
    }
    else if (eleid == "closeAcademic") {
      var academic = document.getElementById('academicDetails').classList;
      academic.remove('active');
      var basic = document.getElementById('basicDetails').classList;
      basic.add('active');
    }
  }

  /* Function to fetch prefill data for form creation */
  FetchEnquiryPrefilledData() {

    this.prefill.getEnqStatus().subscribe(
      data => { this.enqstatus = data; },
      err => {
        //  console.log(err);
      }
    );

    this.prefill.getEnqPriority().subscribe(
      data => { this.enqPriority = data; },
      err => {
        //  console.log(err); 
      }
    );

    this.prefill.getFollowupType().subscribe(
      data => { this.enqFollowType = data },
      err => {
        //  console.log(err); 
      }
    );

    this.prefill.getAssignTo().subscribe(
      data => { this.enqAssignTo = data; },
      err => {
        // console.log(err);
      }
    );

    this.prefill.getEnqStardards().subscribe(
      data => { this.enqStd = data; },
      err => {
        //  console.log(err);
      }
    );

    this.prefill.getSchoolDetails().subscribe(
      data => { this.school = data; },
      err => {
        //  console.log(err);
      }
    );

    this.prefill.getLeadSource().subscribe(
      data => { this.sourceLead = data; },
      err => {
        //  console.log(err);
      }
    );

    this.prefill.getLeadReffered().subscribe(
      data => { this.refferedBy = data; },
      err => {
        //  console.log(err);
      }
    );

    this.prefill.getOccupation().subscribe(
      data => { this.occupation = data; },
      err => {
        //  console.log(err);
      }
    );

    this.prefill.fetchLastDetail().subscribe(
      data => {
        this.lastDetail = data;
        let createTime = new Date(data.enquiry_creation_datetime);
        this.lastUpdated = moment(createTime).fromNow();
      },
      err => {
        // console.log(err);
      }
    );

    this.prefill.getEnqCountry().subscribe(
      data => {
        this.countryList = data;
      },
      err => {
      }
    )

    this.prefill.getCityList().subscribe(
      data => {
        this.cityListDataSource = data;
      },
      err => {
        //console.log(err);
      }
    )

    this.getClosingReasons();

  }



  updateCustomComponent(id) {
    this.prefill.fetchCustomComponentById(id)
      .subscribe(
        data => {
          this.customComponents = [];
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
                  value: el.enq_custom_value == "Y" ? true : false,
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
          this.emptyCustomComponent = this.componentListObject;
        },
        err => {
        });
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


  /* Custom Compoenent array creater */
  createPrefilledData(dataArr: any[]): any[] {
    let customPrefilled: any[] = [];
    dataArr.forEach(el => {
      let obj = {
        displayName: el.toLowerCase(), // this is display label
        data: el,// this is key for select dropdwon 
        checked: false
      }
      customPrefilled.push(obj);
    });

    return customPrefilled;
  }




  /* if custom component is of type multielect then toggle the visibility of the dropdowm */
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






  /* if custom component is of type multielect then update the selected or unselected data*/
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







  /* Function to Toggle visibility of additional details div */
  showAdditionDetails() {
    this.additionDetails = !this.additionDetails;
  }




  /* Function to fetch subject when user selects a standard from dropdown */
  fetchSubject(value) {
    if (value != null && value != '' && value != '-1') {
      this.enqSub = [];
      this.editEnqData.standard_id = value;
      this.prefill.getEnqSubjects(this.editEnqData.standard_id).subscribe(
        data => {
          this.enqSub = data;
        }
      )
    }
    else {
      this.editEnqData.subject_id = '-1';
      this.editEnqData.subjectIdArray = [];
      this.enqSub = [];
    }
  }


  validateAreaAndCityFields() {
    if (this.isCityMandatory == 1) {
      if (this.editEnqData.city == '-1') {
        this.showErrorMessage('error', 'City Is Mandatory', 'Please provide city details');
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }


  submitRegisterForm() {
    this.isConvertToStudent = true;
    this.editEnqData.follow_type = "Walkin"
    this.editEnqData.walkin_followUpDate = moment(new Date()).format('YYYY-MM-DD');
    this.editEnqData.walkin_followUpTime = this.getFollowupTime();
    this.submitForm();
  }


  /* Function to submit validated form data */
  submitForm() {
    this.isEnquirySubmit = true;
    //Validates if the custom component required fields are selected or not
    let customComponentValidator = this.validateCustomComponent();

    /* Validate the predefine required fields of the form */
    this.isFormValid = this.ValidateFormDataBeforeSubmit();

    // Validate If Area And City Settings is enable
    let validate = this.validateAreaAndCityFields();
    if (validate == false) {
      return;
    }

    // Validate if closing reason is given for closed enquiry
    if (this.editEnqData.status == '1') {
      if (this.editEnqData.closing_reason_id == "0" || this.editEnqData.closing_reason_id == '-1') {
        this.showErrorMessage('error', 'Error', 'Please provide closing reason of enquiry.');
        return;
      }
    }

    /* Upload Data if the formData is valid */
    if (this.isFormValid && customComponentValidator) {

      if (this.validateTime()) {
        let id = this.institute_enquiry_id;
        if (this.hour != '') {
          this.editEnqData.followUpTime = this.hour + ":" + this.minute + " " + this.meridian;
        }
        this.editEnqData.enqCustomLi = this.getCustomComponents();
        this.editEnqData.dob = this.fetchDate(this.editEnqData.dob);
        this.editEnqData.enquiry_date = this.fetchDate(this.editEnqData.enquiry_date);
        this.editEnqData.followUpDate = this.fetchDate(this.editEnqData.followUpDate);

        /* isMainBranch,subBranchSelected */
        if (this.isMainBranch == "N" && this.subBranchSelected == false) {
          this.editEnqData.source_instituteId = '-1';
        }

        else if (this.isMainBranch == "Y" && this.subBranchSelected == false) {
          this.editEnqData.source_instituteId = this.editEnqData.source_instituteId;
        }

        if (this.isConvertToStudent == false) {
          if (this.editEnqData.walkin_followUpDate == "" || this.editEnqData.walkin_followUpDate == "Invalid date") {
            this.editEnqData.walkin_followUpDate = "";
          } else {
            this.editEnqData.walkin_followUpDate = moment(this.editEnqData.walkin_followUpDate).format('YYYY-MM-DD');
          }

          if (this.walkintime.hour == "" || this.walkintime.minute == "") {
            this.editEnqData.walkin_followUpTime = "";
          } else {
            if (this.walkintime.hour != "") {
              let time = this.walkintime.hour.split(' ');
              this.editEnqData.walkin_followUpTime = time[0] + ':' + this.walkintime.minute + " " + time[1];
            }
          }
        }

        if (this.editEnqData.follow_type == "Walkin") {
          if (this.editEnqData.walkin_followUpDate == "") {
            this.showErrorMessage('error', 'Error', 'Please provide walkin date for follow up type walkin');
            return;
          }

          if (this.editEnqData.walkin_followUpTime == "") {
            this.showErrorMessage('error', 'Error', 'Please provide walkin time for follow up type walkin');
            return;
          }
        }

        this.enquiryStatus = this.editEnqData.status;

        if (this.editEnqData.is_follow_up_time_notification == true) {
          this.editEnqData.is_follow_up_time_notification = 1
        }
        else {
          this.editEnqData.is_follow_up_time_notification = 0
        }
        this.poster.editFormUpdater(id, this.editEnqData).subscribe(
          (data: any) => {
            this.isEnquirySubmit = false;
            if (data.statusCode == 200) {
              this.showErrorMessage('success', "Enquiry edit successful", 'Your enquiry has been successfully edited');
              if (this.isConvertToStudent) {
                let obj: any = {
                  name: this.editEnqData.name,
                  phone: this.editEnqData.phone,
                  email: this.editEnqData.email,
                  gender: this.editEnqData.gender,
                  dob: this.fetchDate(this.editEnqData.dob),
                  parent_email: this.editEnqData.parent_email,
                  parent_name: this.editEnqData.parent_name,
                  parent_phone: this.editEnqData.parent_phone,
                  enquiry_id: this.institute_enquiry_id,
                  institute_enquiry_id: this.institute_enquiry_id,
                  school_id: this.editEnqData.school_id,
                  country_id:this.editEnqData.country_id
                }
                if (!this.isProfessional) {
                  obj.standard_id = this.editEnqData.standard_id;
                } else {
                  obj.standard_id = this.editEnqData.master_course_name;
                }

                sessionStorage.setItem('studentPrefill', JSON.stringify(obj));
                this.router.navigate(['/view/student/add']);
              }
              else {
                this.clearLocalAndRoute()
              }
            }
            else if (data.statusCode != 200) {
              this.showErrorMessage('error', "Error", data.message);
            }
          },
          err => {
            this.isEnquirySubmit = false;
            this.showErrorMessage('error', "Error updating Enquiry", err.error.message);

          }
        );
      }
      else {

        this.showErrorMessage('error', 'Invalid Time Input', 'Please select a valid time for follow up');
      }
    }
    /* Do Nothing if the formData is Still Invalid  */
    else {
      this.isEnquirySubmit = false;
    }
  }


  getFollowupTime(): any {
    let hour: any = parseInt(moment(new Date()).format('hh'));
    let min: any = moment(new Date()).format('mm');
    let mer: any = moment(new Date()).format('A');

    if (parseInt(min) % 5 != 0) {
      min = Math.ceil(parseInt(min) / 5) * 5;
      if (min >= 60) {
        min = '00';
        if (hour == 12) {
          hour = '1';
          if (mer == 'AM') {
            mer = 'PM';
          }
          else {
            mer = 'AM';
          }
        }
        else {
          hour += 1;
          let formattedNumber = (hour).slice(-2);
          hour = formattedNumber.toString();
        }
      }
    }

    return (hour + ":" + min + " " + mer);
  }



  fetchDate(e): string {
    if (e == null || e == '' || e == "Invalid date") {
      return '';
    }
    else {
      return moment(e).format('YYYY-MM-DD');
    }
  }


  validateTime(): boolean {
    /* some time selected by user or nothing*/
    if ((this.hour != '' && this.minute != '' && this.meridian != '') || (this.hour == '' && this.minute == '' && this.meridian == '')) {
      if (this.hour == "Invalid date") { this.hour = ''; }
      if (this.minute == "Invalid date") { this.minute = ''; }
      if (this.meridian == "INVALID DATE") { this.meridian = ''; }
      return true;
    }
    else {
      return false;
    }
  }


  validateCustomComponent(): boolean {

    let temp: boolean = true;

    this.customComponents.forEach(el => {
      //console.log(el);
      if (el.is_required == 'Y' && el.value == '') {
        if (temp) {
          temp = false;
        }
      }
    });

    if (!temp) {
      this.showErrorMessage('error', 'Required Details Not Filled On Academics Details', '');
    }

    return temp;
  }

  /* Validate the Entire FormData Once Before Uploading= */
  ValidateFormDataBeforeSubmit(): boolean {
    let phoneFlag = this.commonServiceFactory.validatePhone(this.editEnqData.phone, this.maxlength);
    // if (this.commonServiceFactory.valueCheck(this.editEnqData.name.trim())) {
    //   return this.showErrorMessage('error', 'Enquirer Name Is Mandatory', '');
    // }
    // else
    if (phoneFlag == 'noNumber' || phoneFlag == 'lessThanTen') {
      if (phoneFlag == 'noNumber') {
        return this.showErrorMessage('error', 'Phone Number Is Mandatory', '');
      }
      else {
        let msg = 'Enter '.concat( this.maxlength ).concat(' Digit Contact Number');
        return this.showErrorMessage('error', msg, '');
      }
    }
    else if (this.commonServiceFactory.checkValueType(this.editEnqData.enquiry_date)) {
      return this.showErrorMessage('error', 'Enquiry Date Is Mandatory', '');
    }

    else if (this.commonServiceFactory.sourceValueCheck(this.editEnqData.source_id)) {
      return this.showErrorMessage('error', 'Enquiry Source Is Mandatory', '');
    }
    else if (this.editEnqData.parent_phone != "" || this.editEnqData.parent_phone != null){
      let parentPhoneCheck = this.commonServiceFactory.validatePhone(this.editEnqData.parent_phone, this.maxlength);
      if (parentPhoneCheck == 'lessThanTen') {
          let msg = 'Enter '.concat( this.maxlength ).concat(' Digit Contact Number');
          return this.showErrorMessage('error', msg, '');
      }
      else{
        return true;
      }
    }
    else if (this.editEnqData.phone2 != "" || this.editEnqData.phone2 != null){
      let alternatePhoneCheck = this.commonServiceFactory.validatePhone(this.editEnqData.phone2, this.maxlength);
      if (alternatePhoneCheck == 'lessThanTen') {
          let msg = 'Enter '.concat( this.maxlength ).concat(' Digit Contact Number');
          return this.showErrorMessage('error', msg, '');
      }
      else{
        return true;
      }
    }
    else {
      if (this.validateEnquiryDate()) {
        return true;
      }
      else {
        return this.showErrorMessage('error', 'Cannot Set Future Enquiry Date', '');
      }
    }
  }

  showErrorMessage(objType, massage, body) {
    this.commonServiceFactory.showErrorMessage(objType, massage, body);
    return false;
  }

  validateEnquiryDate() {
    let a = moment();
    let b = moment(this.editEnqData.enquiry_date);
    let d = a.diff(b);
    if (d < 0) {
      return false;
    }
    else {
      return true;
    }
  }

  /* Function to store the data of Custom Component in to Base64 encoded array string */
  customComponentUpdated(val, data) {
    this.componentListObject[data.component_id].enq_custom_value = val;
  }




  /* Function to clear the form data */
  clearFormData() {
    this.editEnqData = {
      name: "",
      phone: "",
      email: "",
      gender: "",
      phone2: "",
      country: "",
      email2: "",
      curr_address: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      city: -1,
      area: -1,
      occupation_id: "-1",
      school_id: "-1",
      master_course_name: "",
      qualification: "",
      grade: "",
      enquiry_date: moment().format('YYYY-MM-DD'),
      dob: '',
      standard_id: "-1",
      subject_id: "-1",
      subjectIdArray: [],
      referred_by: "-1",
      source_id: "-1",
      fee_committed: "",
      discount_offered: "",
      priority: "",
      enquiry: "",
      follow_type: "",
      followUpDate: "",
      religion: null,
      link: "",
      slot_id: null,
      closedReason: "",
      demo_by_id: "",
      status: "",
      assigned_to: "-1",
      followUpTime: "",
      lead_id: -1,
      enqCustomLi: [],
      walkin_followUpDate: '',
      walkin_followUpTime: '',
      closing_reason_id: '-1'
    }
    this.course_standard_id = '-1'
    this.course_mastercourse_id = '-1';
    this.hour = '';
    this.minute = '';
    this.meridian = '';
    this.customComponents.forEach(el => {
      el.value = '';
    });
    this.walkintime = {
      hour: '',
      minute: ''
    };
  }



  clearLocalAndRoute() {
    this.clearFormData();
    sessionStorage.removeItem('institute_enquiry_id');
    this.router.navigateByUrl('/view/enquiry');
  }


  commentHandlerOpen() {
    this.isUpdateComment = true;
  }

  commentHandlerClose() {
    this.isUpdateComment = false;
    this.updateFormData = {
      comment: "",
      status: "",
      statusValue: "",
      institution_id: sessionStorage.getItem('institute_id'),
      isEnquiryUpdate: "Y",
      closedReason: null,
      slot_id: null,
      priority: "",
      follow_type: "",
      followUpDate: "",
      commentDate: moment().format('YYYY-MM-DD'),
      followUpTime: "",
      isEnquiryV2Update: "N",
      isRegisterFeeUpdate: "N",
      amount: null,
      paymentMode: null,
      paymentDate: null,
      reference: null,
    }
  }

  fetchCommentData(id) {
    this.prefill.fetchCommentsForEnquiry(id).subscribe((res: any) => {
      this.updateFormData.priority = res.priority;
      this.updateFormData.follow_type = res.follow_type;
      this.updateFormData.statusValue = res.statusValue;
      this.updateFormData.status = res.status;
      this.updateFormData.followUpDate = res.followUpDate;
      this.updateFormData.commentDate = moment().format('YYYY-MM-DD');
      if (res.comments != null) {
        this.updateFormComments = res.comments;
      }
      this.updateFormCommentsOn = res.commentedOn;
      this.updateFormCommentsBy = res.commentedBy;
    });

  }

  notifyMeCheckBoxChangesDetect() {
    if (this.editEnqData.followUpDate != "" && this.editEnqData.followUpDate != null) {
      if (this.hour != "" && this.meridian != "" && this.minute != "") {
        // Do nothing
      } else {
        this.editEnqData.is_follow_up_time_notification = false;
      }
    } else {
      this.editEnqData.is_follow_up_time_notification = false;
    }
  }

  pushUpdatedEnquiry() {
    let id = this.institute_enquiry_id;
    this.updateFormData.comment = this.updateFormData.comment;
    this.poster.updateEnquiryForm(id, this.updateFormData)
      .subscribe(res => {
        this.showErrorMessage('success', 'Enquiry Updated', 'Your enquiry has been successfully submitted')
        this.fetchCommentData(this.route.snapshot.paramMap.get('id'));
        this.commentHandlerClose();
      },
        err => {
          this.showErrorMessage('error', 'Failed To Update Enquiry', err.error.message);
        })

  }


  isEnquiryAdministrator() {
    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == undefined
      || sessionStorage.getItem('permissions') == '' || sessionStorage.getItem('username') == 'admin') {
      this.isEnquiryAdmin = true;
    }
    else {
      let permissions: any[] = [];
      permissions = JSON.parse(sessionStorage.getItem('permissions'));
      /* User has permission to view all enquiries */
      if (permissions.includes('115')) {
        this.isEnquiryAdmin = true;
      }
      /* User is not authorized as enquiry admin and see only enquiry assigned to him */
      else {
        this.isEnquiryAdmin = false;
      }
    }
  }





  clearEditEnquiryDate() {
    this.editEnqData.enquiry_date = "";
  }

  clearEditFollowUpDate() {
    this.editEnqData.followUpDate = "";
    this.hour = '';
    this.minute = '';
    this.meridian = '';
  }

   onCitySelctionChanges(event) {
    this.areaListDataSource = [];
    if (event != -1 && event != "" && event != null) {
      let obj = {
        city: event
      }
      this.prefill.getAreaList(obj).subscribe(
        res => {
          this.areaListDataSource = res;
        },
        err => {
          //console.log(err);
        }
      )
    }
  }

  multiBranchInstituteFound(id) {
    this.prefill.getAllSubBranches(id).subscribe(
      (res: any) => {
        this.branchesList = res;
      },
      err => {
        console.log(err);
      }
    )
  }


  branchUpdated(e) {
    this.editEnqData.source_instituteId = e;
    let sessid = sessionStorage.getItem('institute_id');
    this.prefill.fetchAssignedToData(e).subscribe(
      res => {
        this.enqAssignTo = res;
        if (sessid == e) {
          this.editEnqData.assigned_to = this.actualAssignee;
        }
        else {
          this.editEnqData.assigned_to = "-1";
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  courseMasterChange(e) {
    if (e != '-1') {
      this.masterCourseData.map(el => {
        if (el.master_course == e) {
          if (el.coursesList == null || el.coursesList.length == 0) {
            this.course_course = [];
          }
          else {
            this.course_course = el.coursesList;
          }
        }
      });
    }
    else {
      this.course_course = [];
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */



  // Closing Reason Pop Up Function

  getClosingReasons() {
    this.prefill.getClosingReasons().subscribe(
      res => {
        this.closingReasonDataSource = res;
      },
      err => {
        console.log(err);
      }
    )
  }


  closingReason() {
    this.closingReasonOpen = true;
  }

  closeClosingReason() {
    this.closingReasonOpen = false
  }

  toggleReferAdd() {
    let icon = document.getElementById('add-refer-icon').innerHTML;
    if (icon == '+') {
      this.isNewRefer = true;
      document.getElementById('add-refer-icon').innerHTML = '-';
    }
    else if (icon == '-') {
      this.isNewRefer = false;
      document.getElementById('add-refer-icon').innerHTML = '+';
    }
  }

  createNewReason() {
    if (this.createNewReasonObj.closing_desc == "") {
      this.showErrorMessage('error', '', "Closing reason can't be empty");
    }

    else {
      this.service.createReason(this.createNewReasonObj).subscribe(
        (data: any) => {
          this.showErrorMessage('success', '', 'Reason Created Successfully');
          this.getClosingReasons();
          this.isNewRefer = false;
          document.getElementById('add-refer-icon').innerHTML = '+';
          this.createNewReasonObj.closing_desc = ""
        },
        (error: any) => {
          this.errorMessage(error);
        }
      )
    }
  }

  editRowTable(row, index) {
    document.getElementById(("reason" + index).toString()).classList.remove('displayComp');
    document.getElementById(("reason" + index).toString()).classList.add('editComp');
  }

  saveInformation(row, index) {
    let obj = {
      closing_desc: row.closing_desc,
      institution_id: this.service.institute_id
    }
    if (row.closing_desc == "") {
      this.showErrorMessage('error', '', "Closing reason can't be empty");
    }
    else {
      this.service.updateClosingReason(obj, row.closing_reason_id).subscribe(
        (data: any) => {
          this.showErrorMessage('success', '', "Reason updated successfully");
          this.getClosingReasons();
        },
        err => {
          this.errorMessage(err);
        }
      )
    }
  }

  cancelEditRow(index) {
    document.getElementById(("reason" + index).toString()).classList.add('displayComp');
    document.getElementById(("reason" + index).toString()).classList.remove('editComp');
  }

  breakTimeInToHrAndMin(time) {
    let obj: any = {
      hour: '',
      minute: ''
    };
    obj.hour = time.split(':')[0] + " " + time.split(':')[1].split(' ')[1];
    obj.minute = time.split(':')[1].split(' ')[0];
    return obj;
  }

}
