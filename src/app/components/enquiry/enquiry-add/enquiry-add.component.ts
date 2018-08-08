import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { EnquiryCampaign } from '../../../model/enquirycampaign';
import { instituteInfo } from '../../../model/instituteinfo';
import { addEnquiryForm } from '../../../model/add-enquiry-form';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { LoginService } from '../../../services/login-services/login.service';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MultiBranchDataService } from '../../../services/multiBranchdata.service';


@Component({
  selector: 'app-enquiry-add',
  templateUrl: './enquiry-add.component.html',
  styleUrls: ['./enquiry-add.component.scss']
})
export class EnquiryAddComponent implements OnInit {

  isRippleLoad: boolean;
  isRegisterStudent: boolean;
  /* Variable Declarations */
  enqstatus: any = [];
  enqPriority: any = [];
  enqFollowType: any = [];
  enqAssignTo: any = [];
  enqStd: any = [];
  isProfessional: boolean = false;
  enqSub: any = [];
  enqScholarship: any = [];
  enqSub2: any = [];
  school: any = [];
  sourceLead: any = [];
  refferedBy: any = [];
  occupation: any = [];
  lastDetail: any = {
    name: '',
    enquiry_no: null,
    enquiry_creation_datetime: null,
  };
  enquiryConfirm: any = [];
  confimationPop: boolean = false;
  updatePop: boolean = false;
  newEnqData: addEnquiryForm = {
    name: "",
    phone: "",
    email: "",
    gender: "",
    phone2: "",
    email2: "",
    dob: null,
    curr_address: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    city: -1,
    area: -1,
    occupation_id: "-1",
    school_id: "-1",
    qualification: "",
    grade: "",
    enquiry_date: moment().format('YYYY-MM-DD'),
    standard_id: "-1",
    subject_id: "-1",
    referred_by: "-1",
    source_id: "-1",
    fee_committed: "",
    discount_offered: "",
    priority: "cold_call",
    enquiry: "",
    follow_type: "call",
    followUpDate: moment().format('YYYY-MM-DD'),
    religion: null,
    link: "",
    slot_id: null,
    closedReason: "",
    master_course_name: "",
    demo_by_id: "",
    status: "0",
    subjectIdArray: null,
    assigned_to: sessionStorage.getItem('userid'),
    followUpTime: "",
    lead_id: -1,
    enqCustomLi: [],
    source_instituteId: '-1',
    walkin_followUpDate: '',
    walkin_followUpTime: '',
    closing_reason_id: ''
  };
  additionDetails: boolean = false;
  todayDate: number = Date.now();
  isSourcePop: boolean = false;
  isInstitutePop: boolean = false;
  isReferPop: boolean = false;
  newEnquiryFormGroup: FormGroup;
  componentPrefill: any = [];
  componentListObject: any = {};
  emptyCustomComponent: any;
  componentRenderer: any = [];
  isCustomComponentValid: boolean = true;
  isCustomComponentStillValid: boolean = false;
  isFormValid: boolean = false;
  lastUpdated: any;
  errorMessage: any;
  submitError: boolean = false;
  addNextCheck: boolean = false;
  isEnquiryAdmin: boolean = false;
  busy: Subscription;
  isNewInstitute: boolean = true;
  private customComponents: any[] = [];
  instituteList: any;
  isNewSource: boolean = true;
  sourceList: any;
  isNewRefer: boolean = true;
  referList: any;
  minArr: any[] = ['', '00', '15', '30', '45'];
  hour: string = '';
  minute: string = '';
  meridian: string = ''
  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM']
  timeObj: any = {
    fhour: '',
    fminute: '',
    fmeridian: '',
    whour: '',
    wminute: '',
    wmeridian: '',
  };
  followUpTime: any = "";
  createInstitute = {
    instituteName: "",
    isActive: "Y"
  }
  createSource = {
    name: "",
    inst_id: sessionStorage.getItem('institute_id'),
  }
  createReferer = {
    name: "",
    inst_id: sessionStorage.getItem('institute_id')
  }
  isCityMandatory: any;
  cityListDataSource: any = [];
  areaListDataSource: any = [];
  course_standard_id: any = '-1';
  course_subject: any[] = [];
  course_mastercourse_id: any = '-1';
  course_course: any[] = [];
  isMainBranch: any = "N";
  branchesList: any = [];
  subBranchSelected: any = false;
  masterCourseData: any[] = [];
  selectedCourseIds: any = null;
  selectedSubjectIds: any = null;
  isEnquirySubmit: boolean = false;
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  constructor(private prefill: FetchprefilldataService, private router: Router,
    private appC: AppComponent, private poster: PostEnquiryDataService, private login: LoginService,
    private auth: AuthenticatorService, private multiBranchService: MultiBranchDataService
  ) {
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
      this.router.navigate(['/authPage']);
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  timeChange(ev, id) {
    if (id === 'followUpTime') {
      if (ev.split(' ')[0] != '') {
        this.timeObj.fhour = ev.split(' ')[0];
        this.timeObj.fmeridian = ev.split(' ')[1];
      }
      else {
        this.timeObj.fhour = '';
        this.timeObj.fmeridian = '';
      }
    }
    else {
      if (ev.split(' ')[0] != '') {
        this.timeObj.whour = ev.split(' ')[0];
        this.timeObj.wmeridian = ev.split(' ')[1];
      }
      else {
        this.timeObj.whour = '';
        this.timeObj.wmeridian = '';
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* OnInit Initialized */
  ngOnInit() {
    this.isCityMandatory = sessionStorage.getItem('enable_routing');
    this.isEnquiryAdministrator();
    this.fetchEnquiryPrefilledData();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));

    /* Model for Enquiry Data */
    this.newEnqData = {
      name: "",
      phone: "",
      email: "",
      gender: "",
      phone2: "",
      email2: "",
      curr_address: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      city: -1,
      area: -1,
      occupation_id: "-1",
      school_id: "-1",
      qualification: "",
      grade: "",
      master_course_name: "",
      enquiry_date: moment().format('YYYY-MM-DD'),
      standard_id: "-1",
      subject_id: "-1",
      subjectIdArray: null,
      referred_by: "-1",
      source_id: "-1",
      fee_committed: "",
      discount_offered: "",
      priority: "cold_call",
      enquiry: "",
      follow_type: "call",
      followUpDate: moment().format('YYYY-MM-DD'),
      religion: null,
      link: "",
      slot_id: null,
      closedReason: "",
      demo_by_id: "",
      status: "0",
      assigned_to: sessionStorage.getItem('userid'),
      followUpTime: "",
      lead_id: -1,
      enqCustomLi: [],
      source_instituteId: '-1',
      walkin_followUpDate: '',
      walkin_followUpTime: '',
      closing_reason_id: ''
    };

    // Multi Branch Check
    this.auth.isMainBranch.subscribe(
      (value: any) => {
        this.isMainBranch = value;
        if (this.isMainBranch == "Y") {
          this.newEnqData.source_instituteId = sessionStorage.getItem('institute_id');
          this.multiBranchInstituteFound(this.newEnqData.source_instituteId);
        }
      }
    );

    this.multiBranchService.subBranchSelected.subscribe(
      res => {
        this.subBranchSelected = res;
        if (this.subBranchSelected) {
          this.newEnqData.source_instituteId = sessionStorage.getItem('institute_id');
          const mainBranchId = sessionStorage.getItem('mainBranchId');
          if (mainBranchId != null) {
            this.multiBranchInstituteFound(mainBranchId);
          }
        }
      }
    )

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
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
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to fetch prefill data for form creation */
  fetchEnquiryPrefilledData() {

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
      err => { }
    );

    this.prefill.getAssignTo().subscribe(
      data => { this.enqAssignTo = data; },
      err => {
        //   console.log(err); 
      }
    );

    this.prefill.getEnqStardards().subscribe(
      data => { this.enqStd = data; },
      err => {
      }
    );

    this.prefill.getSchoolDetails().subscribe(
      data => {
        this.school = data;
        this.instituteList = this.school;

        this.instituteList.forEach(el => {
          el.edit = false;
        });
      },
      err => {
        //  console.log(err);
      }
    );

    this.prefill.getLeadSource().subscribe(
      data => {
        this.sourceLead = data;
        this.sourceList = this.sourceLead;
        this.sourceList.forEach(el => {
          el.edit = false;
        });
      },
      err => {
        //   console.log(err);
      }
    );

    this.prefill.getLeadReffered().subscribe(
      data => {
        this.refferedBy = data;
        this.referList = this.refferedBy;

        this.referList.forEach(el => {
          el.edit = false;
        });
      },
      err => {
        //  console.log(err);
      }
    );

    this.prefill.getOccupation().subscribe(
      data => { this.occupation = data; },
      err => {
        //   console.log(err); 
      }
    );

    this.prefill.fetchLastDetail().subscribe(
      data => {
        this.lastDetail = data;
      },
      err => {
        // console.log(err);
      }
    );

    this.prefill.getCityList().subscribe(
      data => {
        this.cityListDataSource = data;
      },
      err => {

      }
    )

    this.fetchCustomComponentData();

    if (!this.isProfessional) {
      this.fetchMasterCourseDetails();
    }

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
  fetchCustomComponentData() {
    this.customComponents = [];
    this.prefill.fetchCustomComponentEmpty()
      .subscribe(
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
                  value: el.enq_custom_value == "" ? false : true,
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
          this.emptyCustomComponent = this.componentListObject;
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
        data: el.toLowerCase(),
        checked: false
      }
      customPrefilled.push(obj);
    });

    return customPrefilled;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
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
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
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
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to Toggle visibility of additional details div */
  showAdditionDetails() {
    this.additionDetails = !this.additionDetails;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* On Phone Number input by user update model and fetch lead records if any */
  updatePhoneFetchRecords() {
    this.prefill.fetchLeadDetails(this.newEnqData.phone).subscribe(
      data => { this.updateForm(data) },
      err => { }
    );
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to fetch lead details on basis of the phone number provided by user */
  getLeadDetails() {
    //console.log(this.newEnqData.phone);
    if (this.validatePhone(this.newEnqData.phone)) {
      this.prefill.fetchLeadDetails(this.newEnqData.phone).subscribe(
        data => { this.updateForm(data) },
        err => {
          let data = {
            type: "error",
            title: "Unable to fetch lead",
            body: err.message
          }
          this.appC.popToast(data);
        }
      );
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to validate the number provided by user  and return data back to getLeadDetails*/
  validatePhone(num) {
    //console.log(num);
    if (num != null) {
      return this.newEnqData.phone.length === 10;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Update the form fields onn basis of the data retreived from getLeadDetails*/
  updateForm(data) {
    this.newEnqData.curr_address = data.address;
    this.newEnqData.assigned_to = data.assigned_to;
    this.newEnqData.city = data.city;
    this.newEnqData.email = data.email;
    this.newEnqData.gender = data.gender;
    this.newEnqData.name = data.name;
    this.newEnqData.referred_by = data.referred_by;
    this.newEnqData.source_id = data.source_id;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to fetch subject when user selects a standard from dropdown */
  fetchSubject(value) {
    if (value != null && value != '' && value != '-1') {
      this.newEnqData.subject_id = '-1';
      this.enqSub = [];
      this.newEnqData.standard_id = value;
      this.prefill.getEnqSubjects(this.newEnqData.standard_id).subscribe(
        data => {
          this.enqSub = data;
        }
      )
    }
    else {
      this.newEnqData.subject_id = '-1';
      this.newEnqData.subjectIdArray = null;
      this.enqSub = [];
    }

  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to clear the form data */
  clearFormData() {
    this.newEnqData = {
      name: "",
      phone: "",
      email: "",
      gender: "",
      phone2: "",
      email2: "",
      curr_address: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      city: "",
      occupation_id: "-1",
      school_id: "-1",
      qualification: "",
      grade: "",
      master_course_name: "",
      enquiry_date: moment().format('YYYY-MM-DD'),
      standard_id: "-1",
      subject_id: "-1",
      subjectIdArray: null,
      referred_by: "-1",
      source_id: "-1",
      fee_committed: "",
      discount_offered: "",
      priority: "cold_call",
      enquiry: "",
      follow_type: "call",
      followUpDate: moment().format('YYYY-MM-DD'),
      religion: null,
      link: "",
      slot_id: null,
      closedReason: "",
      demo_by_id: "",
      status: "0",
      assigned_to: sessionStorage.getItem('userid'),
      followUpTime: "",
      lead_id: -1,
      enqCustomLi: [],
      walkin_followUpDate: '',
      walkin_followUpTime: '',
      closing_reason_id: ''
    };
    this.course_standard_id = '-1'
    this.selectedSubjectIds = null;
    this.course_mastercourse_id = '-1';
    this.selectedCourseIds = null;
    this.enqSub = [];
    this.followUpTime = "";
    this.hour = '';
    this.minute = '';
    this.meridian = '';
    this.customComponents.forEach(el => {
      el.value = '';
    });
    this.fetchCustomComponentData();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateCustomComponent(v, comp) {
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
            obj.enq_custom_id = 0;
            obj.enq_custom_value = moment(e.value).format("YYYY-MM-DD");
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
              obj.enq_custom_id = 0;
              obj.enq_custom_value = e.value;
              tempArr.push(obj);
            }
          }
          else if (typeof e.value == 'boolean') {
            if (e.value) {
              let obj: any = {};
              obj.component_id = e.id;
              obj.enq_custom_id = 0;
              obj.enq_custom_value = "Y";
              tempArr.push(obj);
            }
            else {
              let obj: any = {};
              obj.component_id = e.id;
              obj.enq_custom_id = 0;
              obj.enq_custom_value = "N";
              tempArr.push(obj);
            }
          }
        }
      }
    });
    return tempArr;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  submitRegisterForm(form: NgForm) {
    this.isRegisterStudent = true;
    this.newEnqData.follow_type = "Walkin";
    this.submitForm(form);
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to submit validated form data */
  submitForm(form: NgForm) {
    //Validates if the custom component required fields are selected or not
    this.isEnquirySubmit = true;
    let customComponentValidator: boolean = this.customComponents.every(el => { return this.getCustomValid(el); });

    /* Validate the predefine required fields of the form */
    this.isFormValid = this.ValidateFormDataBeforeSubmit();

    // Validate If Area And City Settings is enable
    let validate = this.validateAreaAndCityFields();
    if (validate == false) {
      return;
    }

    /* Upload Data if the formData is valid */
    if (this.isFormValid && customComponentValidator) {
      if (this.validateTime()) {
        this.newEnqData.enqCustomLi = this.getCustomComponents();

        /* Check if user has entered any followup date time */
        if (this.hour != '') {
          this.newEnqData.followUpTime = this.hour + ":" + this.minute + " " + this.meridian;
        }

        /* is Main Branch No,sub Branch Selected */
        if (this.isMainBranch == "N" && this.subBranchSelected == false) {
          this.newEnqData.source_instituteId = '-1';
        }

        /* is Main Branch Yes,sub Branch Selected */
        else if (this.isMainBranch == "Y" && this.subBranchSelected == false) {
          this.newEnqData.source_instituteId = this.newEnqData.source_instituteId;
        }

        /* convert dob to standard format */
        this.newEnqData.dob = this.fetchDate(this.newEnqData.dob);
        this.newEnqData.enquiry_date = this.fetchDate(this.newEnqData.enquiry_date);
        this.newEnqData.followUpDate = this.fetchDate(this.newEnqData.followUpDate);

        if (this.newEnqData.follow_type == "Walkin") {
          this.newEnqData.walkin_followUpDate = moment(new Date()).format('YYYY-MM-DD');
          this.newEnqData.walkin_followUpTime = this.getFollowupTime();
        }


        if (!this.isProfessional) {
          let obj = {
            area: this.newEnqData.area,
            assigned_to: this.newEnqData.assigned_to,
            city: this.newEnqData.city,
            closedReason: this.newEnqData.closedReason,
            courseIdArray: this.selectedCourseIds,
            curr_address: this.newEnqData.curr_address,
            demo_by_id: this.newEnqData.demo_by_id,
            discount_offered: this.newEnqData.discount_offered,
            dob: this.newEnqData.dob,
            email: this.newEnqData.email,
            email2: this.newEnqData.email2,
            enqCustomLi: this.newEnqData.enqCustomLi,
            enquiry: this.newEnqData.enquiry,
            enquiry_date: this.newEnqData.enquiry_date,
            fee_committed: this.newEnqData.fee_committed,
            followUpDate: this.newEnqData.followUpDate,
            followUpTime: this.newEnqData.followUpTime,
            follow_type: this.newEnqData.follow_type,
            gender: this.newEnqData.gender,
            grade: this.newEnqData.grade,
            lead_id: this.newEnqData.lead_id,
            link: this.newEnqData.link,
            name: this.newEnqData.name,
            occupation_id: this.newEnqData.occupation_id,
            parent_email: this.newEnqData.parent_email,
            parent_name: this.newEnqData.parent_name,
            parent_phone: this.newEnqData.parent_phone,
            phone: this.newEnqData.phone,
            phone2: this.newEnqData.phone2,
            priority: this.newEnqData.priority,
            qualification: this.newEnqData.qualification,
            referred_by: this.newEnqData.referred_by,
            religion: this.newEnqData.religion,
            school_id: this.newEnqData.school_id,
            slot_id: this.newEnqData.slot_id,
            source_id: this.newEnqData.source_id,
            source_instituteId: this.newEnqData.source_instituteId,
            status: this.newEnqData.status,
            subjectIdArray: this.selectedSubjectIds,
            walkin_followUpDate: this.newEnqData.walkin_followUpDate,
            walkin_followUpTime: this.newEnqData.walkin_followUpTime
          }
          this.poster.postNewEnquiry(obj).subscribe(
            (data: any) => {
              this.isEnquirySubmit = false;
              this.enquiryConfirm = data;
              let instituteEnqId = data.generated_id;
              this.prefill.fetchLastDetail().subscribe(data => {
                this.lastDetail = data;
                if (this.isRegisterStudent) {
                  let obj: any = {
                    name: this.newEnqData.name,
                    phone: this.newEnqData.phone,
                    email: this.newEnqData.email,
                    gender: this.newEnqData.gender,
                    dob: moment(this.newEnqData.dob).format("YYYY-MM-DD"),
                    parent_email: this.newEnqData.parent_email,
                    school_name: this.newEnqData.school_id,
                    standard_id: this.newEnqData.standard_id,
                    parent_name: this.newEnqData.parent_name,
                    parent_phone: this.newEnqData.parent_phone,
                    enquiry_id: instituteEnqId,
                    institute_enquiry_id: instituteEnqId,
                    school_id: this.newEnqData.school_id
                  }
                  if (!this.isProfessional) {
                    obj.standard_id = this.course_standard_id;
                  } else {
                    obj.standard_id = this.course_mastercourse_id;
                  }
                  localStorage.setItem('studentPrefill', JSON.stringify(obj));
                  this.router.navigate(['/view/student/add']);
                }
                else {
                  if (this.addNextCheck) {
                    let msg = {
                      type: "success",
                      title: "New Enquiry Added",
                      body: "Your enquiry has been submitted"
                    }
                    //form.reset();
                    this.appC.popToast(msg);
                    this.clearFormData();
                  }
                  else {
                    this.openConfirmationPopup();
                    this.clearFormData();
                  }

                }
              },
                err => {

                });
            },
            err => {
              this.isEnquirySubmit = false;
              let data = {
                type: "error",
                title: "Error",
                body: err.error.message
              }
              this.appC.popToast(data);
            }
          );
        }
        else {
          this.poster.postNewEnquiry(this.newEnqData).subscribe(
            (data: any) => {
              this.isEnquirySubmit = false;
              this.enquiryConfirm = data;
              let instituteEnqId = data.generated_id;
              this.prefill.fetchLastDetail().subscribe(data => {
                this.lastDetail = data;
                if (this.isRegisterStudent) {
                  let obj = {
                    name: this.newEnqData.name,
                    phone: this.newEnqData.phone,
                    email: this.newEnqData.email,
                    gender: this.newEnqData.gender,
                    dob: moment(this.newEnqData.dob).format("YYYY-MM-DD"),
                    parent_email: this.newEnqData.parent_email,
                    school_name: this.newEnqData.school_id,
                    standard_id: this.newEnqData.standard_id,
                    parent_name: this.newEnqData.parent_name,
                    parent_phone: this.newEnqData.parent_phone,
                    enquiry_id: instituteEnqId,
                    institute_enquiry_id: instituteEnqId
                  }
                  localStorage.setItem('studentPrefill', JSON.stringify(obj));
                  this.router.navigate(['/view/student/add']);
                }
                else {
                  if (this.addNextCheck) {
                    let msg = {
                      type: "success",
                      title: "New Enquiry Added",
                      body: "Your enquiry has been submitted"
                    }
                    //form.reset();
                    this.appC.popToast(msg);
                    this.clearFormData();
                  }
                  else {
                    this.openConfirmationPopup();
                    this.clearFormData();
                  }

                }
              },
                err => {

                });
            },
            err => {
              this.isEnquirySubmit = false;
              let data = {
                type: "error",
                title: "Error",
                body: err.error.message
              }
              this.appC.popToast(data);
            }
          );
        }
      }
      else {
        this.isEnquirySubmit = false;
        let msg = {
          type: 'error',
          title: 'Invalid Time Input',
          body: 'Please select a valid time for follow up'
        }
        this.appC.popToast(msg);
      }
    }
    else {
      this.isEnquirySubmit = false;
      this.submitError = true;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
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
          let formattedNumber = ("0" + hour).slice(-2);
          hour = formattedNumber.toString();
        }
      }
    }

    return (hour + ":" + min + " " + mer);
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  fetchDate(e): string {
    if (e == null || e == '' || e == "Invalid date") {
      return '';
    }
    else {
      return moment(e).format('YYYY-MM-DD');
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  validateAreaAndCityFields() {
    if (this.isCityMandatory == 1) {
      if (this.newEnqData.city == '-1') {
        let msg = {
          type: 'error',
          title: 'City Is Mandatory',
          body: 'Please provide city details.'
        }
        this.appC.popToast(msg);
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
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
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getCustomValid(element): boolean {

    if (element.is_required == "Y" && element.value != "") {
      if (element.type == 5) {
        if (element.value != "" && element.value != null && element.value != "Invalid date") {
          return true;
        }
        else {
          let msg = {
            type: 'error',
            title: 'Required Details Not Filled On Academics Details',
            body: ''
          }
          this.appC.popToast(msg);
          return false;
        }
      }
      else {
        return true;
      }
    }
    else if (element.is_required == "Y" && element.value == "") {
      let msg = {
        type: 'error',
        title: 'Required Details Not Filled On Academics Details',
        body: ''
      }
      this.appC.popToast(msg);
      return false;
    }
    else if (element.is_required == "N") {
      return true;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Validate the Entire FormData Once Before Uploading= */
  ValidateFormDataBeforeSubmit(): boolean {
    if (
      this.newEnqData.phone == null || this.newEnqData.phone == "" ||
      this.newEnqData.name == null || this.newEnqData.name.trim() == "" ||
      this.newEnqData.enquiry_date == null || this.newEnqData.enquiry_date == "" ||
      this.newEnqData.source_id == "" || this.newEnqData.source_id == "-1") {

      if (this.newEnqData.phone == null || this.newEnqData.phone == "") {
        let msg = {
          type: 'error',
          title: 'Phone Number Is Mandatory',
          body: ''
        }
        this.appC.popToast(msg);
        return false;
      }

      else if (this.newEnqData.name == null || this.newEnqData.name.trim() == "") {
        let msg = {
          type: 'error',
          title: 'Enquirer Name Is Mandatory',
          body: ''
        }
        this.appC.popToast(msg);
        return false;
      }

      else if (this.newEnqData.enquiry_date == null || this.newEnqData.enquiry_date == "") {
        let msg = {
          type: 'error',
          title: 'Enquiry Date Is Mandatory',
          body: ''
        }
        this.appC.popToast(msg);
        return false;
      }

      else if (this.newEnqData.source_id == "" || this.newEnqData.source_id == "-1") {
        let msg = {
          type: 'error',
          title: 'Enquiry Source Is Mandatory',
          body: ''
        }
        this.appC.popToast(msg);
        return false;
      }
    }
    else {
      if (this.validateEnquiryDate()) {
        return true;
      }
      else {
        let msg = {
          type: 'error',
          title: 'Cannot Set Future Enquiry Date',
          body: ''
        }
        this.appC.popToast(msg);
        return false;
      }
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  validateEnquiryDate() {
    let a = moment();
    let b = moment(this.newEnqData.enquiry_date);
    let d = a.diff(b);
    if (d < 0) {
      return false;
    }
    else {
      return true;
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* fetch the data of last updated enquiry */
  updateLastUpdatedDetails() {
    this.prefill.fetchLastDetail().subscribe(data => {
      this.lastDetail = data;
    },
      err => {
        //  console.log(err);
      }
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to open confirmation popup on succesfull form submission  */
  openConfirmationPopup() {
    //  console.log("confirmation popup opened");
    this.confimationPop = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to close the confirmation popup */
  closePopUp() {
    // console.log("confirmation popup closed");
    this.confimationPop = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to open update popup */
  openUpdatePopup() {
    this.closePopUp();
    this.updatePop = true;
    // console.log("edit popup opened");
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Function to close update popup */
  closeUpdatePopup() {
    this.updatePop = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to open popup to add source */
  showAddSourcePops() {
    //console.log('clicked');
    this.isSourcePop = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to hide popup to add source */
  hideAddSourcePops() {
    this.isSourcePop = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to show popup for adding reference */
  showAddReferPops() {
    this.isReferPop = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to hide popup for adding reference */
  hideAddReferPops() {
    this.isReferPop = false;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Reload the Enquiry Form and clear data */
  reloadEnquiryForm() {
    this.clearFormData();
    this.closePopUp();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  customComponentUpdated(val, data) {
    this.componentListObject[data.component_id].enq_custom_value = val;
    // console.log(this.componentListObject);
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  navigateToEdit() {
    let val: any;
    this.prefill.fetchLastDetail().subscribe(el => {
      this.router.navigate(['/view/enquiry/edit/' + el.institute_enquiry_id]);
    }
    )
  }
  /* --------------------------------------------------------------------------------------------------------- */
  /* ---------------------------------------------- Institute Editor Logic ------------------------------------------------- */
  /* --------------------------------------------------------------------------------------------------------- */
  /* function to open popup to add institute */
  openAddInstitute() {
    this.isInstitutePop = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to hide popup to add institute */
  closeInstituteAdder() {
    this.isInstitutePop = false;
    this.isNewInstitute = false;
    this.createInstitute.instituteName = '';
    this.fetchInstituteInfo();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to set-unset isActive status for add institute */
  toggleInstituteActive(event) {
    if (event) {
      this.createInstitute.isActive = "Y";
    }
    else {
      this.createInstitute.isActive = "N";
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to add institute data to server */
  addInstituteData() {
    this.prefill.createNewInstitute(this.createInstitute).subscribe(
      el => {
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
      },
      err => {
        //console.log(err);
        let alert = {
          type: 'error',
          title: 'Failed To Add Institute',
          body: JSON.parse(err._body).message
        }
        this.appC.popToast(alert);
      }
    );
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
  /* close add new institute */
  closeAddInstitute() {
    this.isNewInstitute = false;
    document.getElementById('add-institute-icon').innerHTML = '+';
    this.createInstitute.instituteName = '';
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
        this.poster.updateInstituteDetails(id, el).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'institute Name Updated',
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
    this.poster.deleteInstitute(id).subscribe(
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
  /* --------------------------------------------------------------------------------------------------------- */
  /* ---------------------------------------------- Reference Editor Logic ------------------------------------------------- */
  /* --------------------------------------------------------------------------------------------------------- */
  /* function to open popup to add Reference */
  openAddRefer() {
    this.isReferPop = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to hide popup to add Reference */
  closeReferAdder() {
    this.isReferPop = false;
    this.isNewRefer = false;
    this.createReferer.name = '';
    this.fetchReferInfo();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to add Reference data to server */
  addReferData() {
    this.prefill.createReferer(this.createReferer).subscribe(
      el => {
        this.prefill.getLeadReffered().subscribe(
          res => {
            this.refferedBy = res;
            this.referList = this.refferedBy;
            this.referList.forEach(el => {
              el.edit = false;
            });
            this.closeAddRefer();

          }
        )
      },
      err => {

      }
    );
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* toggle visibility of new Reference form */
  toggleReferAdd() {
    let icon = document.getElementById('add-refer-icon').innerHTML;
    if (icon == '+') {
      this.isNewRefer = true;
      document.getElementById('add-refer-icon').innerHTML = '-';
    }
    else if (icon == '-') {
      this.isNewRefer = false;
      this.createReferer.name = '';
      document.getElementById('add-refer-icon').innerHTML = '+';
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* close add new Reference */
  closeAddRefer() {
    this.isNewRefer = false;
    document.getElementById('add-refer-icon').innerHTML = '+';
    this.createReferer.name = '';
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  fetchReferInfo() {
    this.prefill.getLeadReffered().subscribe(
      data => {
        this.refferedBy = data;
        this.referList = this.refferedBy;
        this.referList.forEach(el => {
          el.edit = false;
        });
      },
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  editRefer(id) {
    this.referList.forEach(el => {
      if (el.id == id) {
        el.edit = true;
      }
    });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  cancelEditRefer(id) {
    this.fetchReferInfo();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  updateRefer(id) {
    this.referList.forEach(el => {
      if (el.id == id) {
        let data = {
          id: id,
          name: el.name,
          inst_id: sessionStorage.getItem('institute_id')
        };
        this.poster.updateReferDetails(data).subscribe(
          res => {

            let alert = {
              type: 'success',
              title: 'Reference Updated',
            }
            this.appC.popToast(alert);
            this.fetchReferInfo();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Update Reference',
              body: 'There was an error processing your request'
            }
            this.appC.popToast(alert);
          }
        )
      }
    });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  deleteRefer(id) {
    this.referList.forEach(el => {
      if (el.id == id) {
        let data = {
          id: id,
          name: el.name,
          inst_id: sessionStorage.getItem('institute_id')
        };
        this.poster.deleteRefer(data).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'Reference Deleted',
            }
            this.appC.popToast(alert);
            this.fetchReferInfo();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Delete Reference',
              body: 'The requested referer is currently in use and cannot be deleted'
            }
            this.appC.popToast(alert);
          }
        )
      }
    });
  }
  /* --------------------------------------------------------------------------------------------------------- */
  /* ---------------------------------------------- Source Editor Logic ------------------------------------------------- */
  /* --------------------------------------------------------------------------------------------------------- */
  /* function to open popup to add Source */
  openAddSource() {
    this.isSourcePop = true;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to hide popup to add Source */
  closeSourceAdder() {
    this.isSourcePop = false;
    this.isNewSource = false;
    this.createSource.name = '';
    this.fetchSourceInfo();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* function to add Source data to server */
  addSourceData() {
    this.prefill.createSource(this.createSource).subscribe(
      el => {
        this.fetchSourceInfo();
        this.closeAddSource();
      },
      err => {

      }
    );
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* toggle visibility of new Source form */
  toggleSourceAdd() {

    let icon = document.getElementById('add-source-icon').innerHTML;
    if (icon == '+') {
      this.isNewSource = true;
      document.getElementById('add-source-icon').innerHTML = '-';
    }
    else if (icon == '-') {
      this.isNewSource = false;
      this.createSource.name = '';
      document.getElementById('add-source-icon').innerHTML = '+';
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* close add new Source */
  closeAddSource() {
    this.isNewSource = false;
    document.getElementById('add-source-icon').innerHTML = '+';
    this.createSource.name = '';
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Source fetch via API*/
  fetchSourceInfo() {
    this.prefill.getLeadSource().subscribe(
      data => {
        this.sourceLead = data;
        this.sourceList = this.sourceLead;
        this.sourceList.forEach(el => {
          el.edit = false;
        });
      },
      err => {
        this.sourceList = [];
      }
    )
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Source edit open*/
  editSource(id) {
    this.sourceList.forEach(el => {
      if (el.id == id) {
        el.edit = true;
      }
    });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Source edit cancel*/
  cancelEditSource(id) {
    this.fetchSourceInfo();
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Source update*/
  updateSource(id) {
    this.sourceList.forEach(el => {
      if (el.id == id) {
        let data = {
          id: id,
          name: el.name,
          inst_id: sessionStorage.getItem('institute_id')
        }
        this.poster.updateSourceDetails(data).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'Source Updated',
            }
            this.appC.popToast(alert);
            this.fetchSourceInfo();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Update Source',
              body: 'There was an error processing your request'
            }
            this.appC.popToast(alert);
          }
        )
      }
    });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  timeChanges(ev, id) {
    if (ev.split(' ')[0] != '') {
      this.hour = ev.split(' ')[0];
      this.meridian = ev.split(' ')[1];
    }
    else {
      this.hour = '';
      this.meridian = '';
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  /* Source delete*/
  deleteSource(id) {
    this.sourceList.forEach(el => {
      if (el.id == id) {
        let data = {
          id: id,
          name: el.name,
          inst_id: sessionStorage.getItem('institute_id')
        }
        this.poster.deleteSource(data).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'Source Deleted',
              body: 'Your request has been processed'
            }
            this.appC.popToast(alert);
            this.fetchSourceInfo();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Delete Source',
              body: 'The requested source is currently in use and cannot be deleted'
            }
            this.appC.popToast(alert);
          }
        )
      }
    });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  isEnquiryAdministrator() {
    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == '') {
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
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getLastAddName(): string {
    if (this.lastDetail != null) {
      return this.lastDetail.name;
    }
    else {
      return "";
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getLastEnqNum() {
    if (this.lastDetail != null) {
      return this.lastDetail.enquiry_no;
    }
    else {
      return "";
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getLastUpdateTime() {
    if (this.lastDetail != null) {
      return moment(this.lastDetail.enquiry_creation_datetime).fromNow();
    }
    else {
      return "";
    }
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  clearAddEnquiryDate() {
    this.newEnqData.enquiry_date = "";
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  clearAddFollowUpDate() {
    this.newEnqData.followUpDate = "";
    this.hour = '';
    this.minute = '';
    this.meridian = '';
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  onCitySelctionChanges(event) {
    this.areaListDataSource = [];
    if (event != -1) {
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

  // MultiBranch 
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
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  branchUpdated(e) {
    this.isRippleLoad = true;
    this.newEnqData.source_instituteId = e;
    this.prefill.fetchAssignedToData(e).subscribe(
      res => {
        this.isRippleLoad = false;
        this.enqAssignTo = res;
        this.newEnqData.assigned_to = "-1";
      },
      err => {
        this.isRippleLoad = false;
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
}
