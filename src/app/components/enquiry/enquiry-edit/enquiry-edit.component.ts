import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';


import { EnquiryCampaign } from '../../../model/enquirycampaign';
import { instituteInfo } from '../../../model/instituteinfo';
import { addEnquiryForm } from '../../../model/add-enquiry-form';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { PopupHandlerService } from '../../../services/enquiry-services/popup-handler.service';
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';


@Component({
  selector: 'app-enquiry-edit',
  templateUrl: './enquiry-edit.component.html',
  styleUrls: ['./enquiry-edit.component.scss']
})
export class EnquiryEditComponent implements OnInit {

  /* Variable Declarations */
  /* Prefill Field Value for Form*/
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

  customComponentArr: any = [];
  temporaryCustomComponentObjStore: any = {
    component_id : null,
    component_value: null
  }

  /* Popup Handler */
  confimationPop: boolean = false;
  updatePop: boolean = false;

  /* Form Support */
  editEnqData = {
    name: null,
    phone: null,
    email: null,
    gender: null,
    phone2: null,
    email2: null,
    curr_address: null,
    parent_name: null,
    parent_phone: null,
    parent_email: null,
    city: null,
    occupation_id: null,
    school_id: null,
    qualification: null,
    grade: null,
    enquiry_date: moment().format('YYYY-MM-DD'),
    standard_id: null,
    subject_id: null,
    referred_by: null,
    source_id: null,
    fee_committed: null,
    discount_offered: null,
    priority: null,
    enquiry: null,
    follow_type: null,
    followUpDate: null,
    religion: null,
    link: null,
    slot_id: null,
    closedReason: null,
    demo_by_id: null,
    status: null,
    assigned_to: null,
    followUpTime: null,
    lead_id: null,
    enqCustomLi: null
  };
  additionDetails: boolean = false;
  institute_id: any = "100123";
  todayDate: number = Date.now();

  isSourcePop: boolean = false;
  isInstitutePop: boolean = false;
  isRefferPop: boolean = false;

  /* Model for Creating Institute */
  createInstitute = {
    instituteName: "",
    isActive: "N"
  }

  /* Model for Creating Source */
  createSource = {
    name: "",
    inst_id: this.institute_id,
  }

  /* Model for Creating Reference */
  createReferer = {
    name: "",
    inst_id: this.institute_id
  }

  standard_id: number = 0;



























  /* Return to login if Auth fails else return to enqiury list if no row selected found, else store the rowdata to local variable */
  constructor(private prefill: FetchprefilldataService, private router: Router, private logger: Logger, private pops: PopupHandlerService, private poster: PostEnquiryDataService) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigateByUrl('/login');
    }
    else {
      if (localStorage.getItem('institute_enquiry_id') == null) {
        alert('please select a row to edit');
        this.router.navigateByUrl('/enquiry');
      }
      else {
        this.updateEnquiryData();
      }
    }
  }


  /* OnInit Initialized */
  ngOnInit() {
    this.FetchEnquiryPrefilledData();
  }


  /* set the enquiry feilds for Form */
  updateEnquiryData() {
    let id = localStorage.getItem('institute_enquiry_id');
    this.prefill.fetchEnquiryByInstituteID(id)
      .subscribe(data => {
        this.editEnqData = data;
        this.fetchSubject(this.editEnqData.standard_id);
      });
  }


  /* Function for Toggling Form Visibility */
  toggleForm(event) {
    let eleid = event.srcElement.id;
    console.log(eleid);
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
      console.log(basic);
      basic.remove('active');
      var academic = document.getElementById('academicDetails').classList;
      console.log(academic);
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
      err => { console.log(err); }
    );


    this.prefill.getEnqPriority().subscribe(
      data => { this.enqPriority = data; },
      err => { console.log(err); }
    );


    this.prefill.getFollowupType().subscribe(
      data => { this.enqFollowType = data },
      err => { console.log(err); }
    );


    this.prefill.getAssignTo().subscribe(
      data => { this.enqAssignTo = data; },
      err => { console.log(err); }
    );


    this.prefill.getScholarPrefillData().subscribe(
      data => {
        //console.log(data);
        data.forEach(el => {
          if (el.label == "Scholarship") {
            //console.log(el);
            this.enqScholarship = el.prefilled_data.split(',');
          }
          else if (el.label == "Subject2") {
            this.enqSub2 = el.prefilled_data.split(',');
          }
        })
      },
      err => { console.log(err); }
    );


    this.prefill.getEnqStardards().subscribe(
      data => {
        this.enqStd = data; //console.log(this.enqStd) 
      },
      err => { console.log(err); }
    );


    this.prefill.getSchoolDetails().subscribe(
      data => {
        this.school = data; //console.log(this.school); 
      },
      err => { console.log(err); }
    );


    this.prefill.getLeadSource().subscribe(
      data => { this.sourceLead = data; },
      err => { console.log(err); }
    );


    this.prefill.getLeadReffered().subscribe(
      data => { this.refferedBy = data; },
      err => { console.log(err); }
    );


    this.prefill.getOccupation().subscribe(
      data => { this.occupation = data; },
      err => { console.log(err); }
    );


    this.prefill.fetchLastDetail().subscribe(
      data => { this.lastDetail = data; },
      err => { console.log(err); }
    );


    this.prefill.fetchCustomComponent().subscribe(data => {

      data.forEach(el => {
/*         this.customComponentObj.component_id = el.component_id;
        this.customComponentObj.component_value = ""
        this.customComponentArr.push(this.customComponentObj); */
        //console.log(el);

        let customElement = "";

        /* detect type of input  example Case taken for select*/
        if (el.type == 1) {
          // this is a text input
          customElement += '<div class=\"field-wrapper has-value\"><input type=\"text\" value=\"\" id=\"' + el.component_id + '\" class=\"form-ctrl\" [(ngModel)]=\"\" name=\"' + el +'\" required enquiryInput/><label for=\"' + el.component_id + '\">' + el.label + '</label>';
        }

        else if (el.type == 2) {
          // this is a checkbox
          customElement += '<br><div class=\"field-checkbox-wrapper\"><input type=\"checkbox\" value=\"\" class=\"form-checkbox\" id=\"\"><label for=\"' + el.label + '\">' + el.label + '</label></div>';
        }

        else if (el.type == 3) {
          // this is a select list
          customElement += '<div class=\"field-wrapper has-value\"><select id=\"\" class=\"form-ctrl\" required name=\"\" ng-reflect-name=\"\" ng-reflect-model=\"' +this.temporaryCustomComponentObjStore +'\" ng-reflect-model-change=\"updateCustomComponent($event)\" enquiryInput><option value=\"\"></option>';

          let customArr = el.prefilled_data.split(",");
          let tempObj = {
            component_id: el.component_id,
            component_value: ""
          };
          //console.log(customArr);
          customArr.forEach(ob => {
            tempObj.component_value = ob;
            console.log(tempObj);
            customElement += '<option value=\"' +tempObj +'\">' +ob +'</option>';
          });
          customElement += '</select><label for=\"\">' + el.label + '</label></div>';
          console.log(customElement);
        }

        else if (el.type == 4) {
          //this is a select multiselect list 
          customElement += '<div class=\"field-wrapper has-value\"><select id=\"\" class=\"form-ctrl\" required name=\"\" multiple enquiryInput><option value=\"\"></option>';
          let customArr = el.prefilled_data.split(",");
          console.log(customArr);
          customArr.forEach(ob => {
            customElement += '<option value=\"' +ob +'\">' +ob +'</option>';
          });
          customElement += '</select><label for=\"\">' + el.label + '</label></div>';
        }

        /* update the HTML DOM */
        console.log(customElement);
        document.getElementById('custom-component-section').innerHTML += customElement;
      });
    });

  }



  /* Function to Toggle visibility of additional details div */
  showAdditionDetails() {
    this.additionDetails = !this.additionDetails;
  }



  /* Function to fetch subject when user selects a standard from dropdown */
  fetchSubject(value) {
    console.log(value);
    this.prefill.getEnqSubjects(this.editEnqData.standard_id).subscribe(
      data => {
        this.enqSub = data;
        console.log(data);
      },
      err => { //console.log(err); 
      }
    );
  }



  /* Function to clear the form data */
  clearFormData() {
    this.editEnqData = {
      name: null,
      phone: null,
      email: null,
      gender: null,
      phone2: null,
      email2: null,
      curr_address: null,
      parent_name: null,
      parent_phone: null,
      parent_email: null,
      city: null,
      occupation_id: null,
      school_id: null,
      qualification: null,
      grade: null,
      enquiry_date: null,
      standard_id: null,
      subject_id: null,
      referred_by: null,
      source_id: null,
      fee_committed: null,
      discount_offered: null,
      priority: null,
      enquiry: null,
      follow_type: null,
      followUpDate: null,
      religion: null,
      link: null,
      slot_id: null,
      closedReason: null,
      demo_by_id: null,
      status: null,
      assigned_to: null,
      followUpTime: null,
      lead_id: null,
      enqCustomLi: null
    };
  }



  /* Update the  prefill form data to the view */
  updateEditFormPrefill(data) {
  }


  /* Submit the form and return the status code for function performed */
  submitForm() {
    console.log(this.editEnqData);
    let id = localStorage.getItem('institute_enquiry_id');
    this.poster.editFormUpdater(id, this.editEnqData)
      .subscribe(
      data => { console.log(data); },
      err => { alert(err) })
  }

  validateFormBeforeSubmittion() {

  }


  formSubmittedPopupHandler() { }


  updateCustomComponent(val){
    console.log(val);
  }
}
