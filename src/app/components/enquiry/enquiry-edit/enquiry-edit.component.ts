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
    city: "",
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
  updateFormData: updateEnquiryForm = {
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
  minArr: any[] = ['', '00', '15', '30', '45'];
  meridianArr: any[] = ['', "AM", "PM"];
  hour: string = ''; minute: string = ''; meridian: string = '';






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
    this.isEnquiryAdministrator();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.busy = this.FetchEnquiryPrefilledData();
    this.updateEnquiryData();
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
          document.getElementById('hourpar').classList.add('has-value');
          this.minute = moment(followUpDateTime).format('mm');
          document.getElementById('minutepar').classList.add('has-value');
          this.meridian = moment(followUpDateTime).format('a').toString().toUpperCase();
          document.getElementById('meridianpar').classList.add('has-value');
        }
        this.updateCustomComponent(id);
        this.fetchSubject(this.editEnqData.standard_id);
      });
  }

  getCustomComponents(): any[] {
    let tempArr: any[] = [];
    this.customComponents.forEach(e => {
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
          if(e.value){
            let obj: any = {};
            obj.component_id = e.id;
            obj.enq_custom_id = 0;
            obj.enq_custom_value = "Y";
            tempArr.push(obj);
          }
          else{
            let obj: any = {};
            obj.component_id = e.id;
            obj.enq_custom_id = 0;
            obj.enq_custom_value = "N";
            tempArr.push(obj);
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

  updateCustomComponent(id) {
    this.prefill.fetchCustomComponentById(id)
      .subscribe(
        data => {
          //debugger
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
            this.customComponents.push(obj);
          });
          this.emptyCustomComponent = this.componentListObject;
        },
        err => {
        });
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



    return this.prefill.fetchCustomComponentById(this.institute_enquiry_id)
      .subscribe(
        data => {
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
            //console.log(obj);
          });
          this.emptyCustomComponent = this.componentListObject;
        },
        err => {
        });
  }




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




  /* Function to submit validated form data */
  submitForm() { 

    //Validates if the custom component required fields are selected or not
    let customComponentValidator = this.validateCustomComponent();

    /* Validate the predefine required fields of the form */
    this.isFormValid = this.ValidateFormDataBeforeSubmit();
    /* Upload Data if the formData is valid */
    if (this.isFormValid && customComponentValidator) {

      if (this.validateTime()) {
        let id = this.institute_enquiry_id;
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
    return temp;
  }


  /* Validate the Entire FormData Once Before Uploading= */
  ValidateFormDataBeforeSubmit(): boolean {

    if ((this.editEnqData.name == null || this.editEnqData.name == "") || (this.editEnqData.enquiry_date == null || this.editEnqData.enquiry_date == "" || this.editEnqData.source_id == "" || this.editEnqData.source_id == "-1")) {
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
      city: "",
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
      this.updateFormComments = res.comments;
      this.updateFormCommentsOn = res.commentedOn;
      this.updateFormCommentsBy = res.commentedBy;
    });

  }

  pushUpdatedEnquiry() {
    let id = this.institute_enquiry_id;
    this.updateFormData.comment = "Enquiry Updated. " + this.updateFormData.comment;
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

}
