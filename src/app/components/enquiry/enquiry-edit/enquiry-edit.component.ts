import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { updateEnquiryForm } from '../../../model/update-enquiry-form';
import { EnquiryCampaign } from '../../../model/enquirycampaign';
import { instituteInfo } from '../../../model/instituteinfo';
import { addEnquiryForm } from '../../../model/add-enquiry-form';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { LoginService } from '../../../services/login-services/login.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';
import { AppComponent } from '../../../app.component';
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';


@Component({
  selector: 'app-enquiry-edit',
  templateUrl: './enquiry-edit.component.html',
  styleUrls: ['./enquiry-edit.component.scss']
})
export class EnquiryEditComponent implements OnInit {

  /* Variable Declarations */
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
  confimationPop: boolean = false;
  updatePop: boolean = false;
  isProfessional: boolean = false;
  institute_enquiry_id: any = '';
  editEnqData: addEnquiryForm = {
    name: "",
    phone: "",
    email: "",
    dob: null,
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
    enquiry_date: moment().format('YYYY-MM-DD'),
    standard_id: "-1",
    subject_id: "-1",
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
    enqCustomLi: []
  };
  isUpdateComment: boolean = false;
  additionDetails: boolean = false;
  institute_id: any = "100123";
  todayDate: number = Date.now();
  isSourcePop: boolean = false;
  isInstitutePop: boolean = false;
  isRefferPop: boolean = false;
  newEnquiryFormGroup: FormGroup;
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
  busy: Subscription;
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


  // hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  // minArr: any[] = ['', '00', '15', '30', '45'];
  // meridianArr: any[] = ['', "AM", "PM"];
  // hour: string = ''; minute: string = ''; meridian: string = '';

  hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['', '00', '15', '30', '45'];
  meridianArr: any[] = ['', "AM", "PM"];
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

  // City And Area Changes
  isCityMandatory: any;
  cityListDataSource: any = [];
  areaListDataSource: any = [];



  /* Return to login if Auth fails else return to enqiury list if no row selected found, else store the rowdata to local variable */
  constructor(private prefill: FetchprefilldataService, private router: Router, private logger: Logger, private pops: PopupHandlerService,
    private poster: PostEnquiryDataService, private appC: AppComponent, private login: LoginService, private route: ActivatedRoute) {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    if (sessionStorage.getItem('Authorization') == null) {
      let data = {
        type: "error",
        title: "User not logged-in",
        body: "Please login to continue"
      }
      this.appC.popToast(data);
      this.router.navigateByUrl('/login');
    }
    else {
      this.institute_enquiry_id = this.route.snapshot.paramMap.get('id');
      this.fetchCommentData(this.route.snapshot.paramMap.get('id'));
    }
  }


  /* OnInit Initialized */
  ngOnInit() {
    this.isCityMandatory = JSON.parse(sessionStorage.getItem('institute_info')).enable_routing;
    this.isEnquiryAdministrator();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.FetchEnquiryPrefilledData();
    this.updateEnquiryData();
  }


  timeChanges(ev, id) {
    // debugger
    if (ev.split(' ')[0] != '') {
      this.hour = ev.split(' ')[0];
      this.meridian = ev.split(' ')[1];

      //console.log(this.hour + "" +this.meridian)
    }
    else {
      this.hour = '';
      this.meridian = '';
    }


  }
  /* set the enquiry feilds for Form */
  updateEnquiryData() {
    //debugger;
    this.institute_enquiry_id = this.route.snapshot.paramMap.get('id');
    this.fetchCommentData(this.route.snapshot.paramMap.get('id'));
    let id = this.institute_enquiry_id;
    this.prefill.fetchEnquiryByInstituteID(id)
      .subscribe(data => {
        this.editEnqData = data;
        //console.log(data);
        if (data.followUpTime != '') {
          let followUpDateTime = moment(data.followUpDate).format('YYYY-MM-DD') + " " + data.followUpTime;
          this.hour = moment(followUpDateTime).format('h');

          this.minute = moment(followUpDateTime).format('mm');

          this.meridian = moment(followUpDateTime).format('a').toString().toUpperCase();

        }
        this.updateCustomComponent(id);
        this.fetchSubject(this.editEnqData.standard_id);
        if (data.city != "" && data.city != null) {
          this.onCitySelctionChanges(data.city);
        }
      });
  }

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

    this.prefill.getCityList().subscribe(
      data => {
        this.cityListDataSource = data;
      },
      err => {
        console.log(err);
      }
    )

  }


  updateCustomComponent(id) {
    this.prefill.fetchCustomComponentById(id)
      .subscribe(
        data => {
          this.customComponents = [];
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
                prefilled_data: this.createPrefilledDataType4(el.prefilled_data.split(','), el.enq_custom_value.split(','), el.defaultValue),
                selected: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? this.getDefaultArr(el.defaultValue) : el.enq_custom_value.split(','),
                selectedString: (el.enq_custom_value.trim().split(',').length == 1 && el.enq_custom_value.trim().split(',')[0] == "") ? el.defaultValue : el.enq_custom_value,
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
                value: el.enq_custom_value == "N" ? false : true,
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
          this.emptyCustomComponent = this.componentListObject;
          //this.fillDefultDataInMultiSelect();
        },
        err => {
        });
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  getDefaultArr(d):any[]{
    let a:any[] = [];
    a.push(d);
    return a;
  }
  /* ============================================================================================================================ */
  /* ============================================================================================================================ */
  createPrefilledDataType4(dataArr: any[], selected: any[], def: string): any[] {
    let customPrefilled: any[] = [];
    debugger;
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
          checked: el == def
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
        data: el,
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







  /* Function to Toggle visibility of additional details div */
  showAdditionDetails() {
    this.additionDetails = !this.additionDetails;
  }




  /* Function to fetch subject when user selects a standard from dropdown */
  fetchSubject(value) {
    if (value != null && value != '' && value != '-1') {
      this.editEnqData.subject_id = '-1';
      this.enqSub = [];
      this.editEnqData.standard_id = value;
      this.prefill.getEnqSubjects(this.editEnqData.standard_id).subscribe(
        data => { this.enqSub = data; }
      )
    }
    else {
      this.editEnqData.subject_id = '-1';
      this.enqSub = [];
    }
  }


  validateAreaAndCityFields() {
    if (this.isCityMandatory == 1) {
      if (this.editEnqData.city == '-1') {
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



  /* Function to submit validated form data */
  submitForm() {

    //Validates if the custom component required fields are selected or not
    let customComponentValidator = this.validateCustomComponent();

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
        let id = this.institute_enquiry_id;
        if (this.hour != '') {
          this.editEnqData.followUpTime = this.hour + ":" + this.minute + " " + this.meridian;
        }
        this.editEnqData.enqCustomLi = this.getCustomComponents();
        this.poster.editFormUpdater(id, this.editEnqData).subscribe(
          data => {
            if (data.statusCode == 200) {
              let msg = {
                type: "success",
                title: "Enquiry edit successful",
                body: "Your enquiry has been successfully edited"
              }
              this.appC.popToast(msg);
              this.clearLocalAndRoute()
            }
            else if (data.statusCode != 200) {
              let msg = {
                type: "error",
                title: "Error",
                body: data.message
              }
              this.appC.popToast(msg);
            }
          },
          err => {
            let data = {
              type: "error",
              title: "Error updating Enquiry",
              body: "Enquiry(s) with specified contact no. already exist"
            }
            this.appC.popToast(data);
          }
        );
      }
      else {
        let msg = {
          type: 'error',
          title: 'Invalid Time Input',
          body: 'Please select a valid time for follow up'
        }
        this.appC.popToast(msg);
      }
    }
    /* Do Nothing if the formData is Still Invalid  */
    else {
      let msg = {
        type: 'error',
        title: 'Academic Details Imcomplete',
        body: 'Please fill all the required fields'
      }
      this.appC.popToast(msg);
    }
  }




  validateTime(): boolean {
    /* some time selected by user or nothing*/
    if ((this.hour != '' && this.minute != '' && this.meridian != '') || (this.hour == '' && this.minute == '' && this.meridian == '')) {
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
      let msg = {
        type: 'error',
        title: 'Required Details Not Filled On Academics Details',
        body: ''
      }
      this.appC.popToast(msg);
    }

    return temp;
  }

  /* Validate the Entire FormData Once Before Uploading= */
  ValidateFormDataBeforeSubmit(): boolean {
    if (
      this.editEnqData.name == null || this.editEnqData.name.trim() == "" ||
      this.editEnqData.enquiry_date == null || this.editEnqData.enquiry_date == "" ||
      this.editEnqData.source_id == "" || this.editEnqData.source_id == "-1") {

      if (this.editEnqData.name == null || this.editEnqData.name.trim() == "") {
        let msg = {
          type: 'error',
          title: 'Enquirer Name Is Mandatory',
          body: ''
        }
        this.appC.popToast(msg);
        return false;
      }

      else if (this.editEnqData.enquiry_date == null || this.editEnqData.enquiry_date == "") {
        let msg = {
          type: 'error',
          title: 'Enquiry Date Is Mandatory',
          body: ''
        }
        this.appC.popToast(msg);
        return false;
      }

      else if (this.editEnqData.source_id == "" || this.editEnqData.source_id == "-1") {
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
      enquiry_date: moment().format('YYYY-MM-DD'),
      standard_id: "-1",
      subject_id: "-1",
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
      enqCustomLi: []
    }
    this.customComponents.forEach(el => {
      el.value = '';
    });
  }



  clearLocalAndRoute() {
    this.clearFormData();
    localStorage.removeItem('institute_enquiry_id');
    this.router.navigateByUrl('/enquiry');
  }


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
    this.prefill.fetchCommentsForEnquiry(id).subscribe(res => {
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

  pushUpdatedEnquiry() {
    let id = this.institute_enquiry_id;
    this.updateFormData.comment = this.updateFormData.comment;
    this.poster.updateEnquiryForm(id, this.updateFormData)
      .subscribe(res => {
        let alert = {
          type: 'success',
          title: 'Enquiry Updated',
          body: 'Your enquiry has been successfully submitted'
        }
        this.appC.popToast(alert);
        this.fetchCommentData(this.route.snapshot.paramMap.get('id'));
        this.commentHandlerClose();
      },
        err => {
          let alert = {
            type: 'error',
            title: 'Failed To Update Enquiry',
            body: 'There was an error processing your request'
          }
          this.appC.popToast(alert);
        })

  }


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
    if (event != -1) {
      let obj = {
        city: event
      }
      this.prefill.getAreaList(obj).subscribe(
        res => {
          this.areaListDataSource = res;
        },
        err => {
          console.log(err);
        }
      )
    }
  }

}
