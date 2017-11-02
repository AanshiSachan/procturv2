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
  editEnqData: addEnquiryForm = {
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
  };
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




  /* Return to login if Auth fails else return to enqiury list if no row selected found, else store the rowdata to local variable */
  constructor(private prefill: FetchprefilldataService, private router: Router, private logger: Logger, private pops: PopupHandlerService, private poster: PostEnquiryDataService, private appC: AppComponent) {
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
      if (localStorage.getItem('institute_enquiry_id') == null) {
        let data = {
          type: "error",
          title: "Record Not Found",
          body: "Please select a row to edit"
        }
        this.appC.popToast(data);
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
      data => { this.enqStd = data; },
      err => { console.log(err); }
    );



    this.prefill.getSchoolDetails().subscribe(
      data => { this.school = data; },
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
      data => {
        this.lastDetail = data;
        let createTime = new Date(data.enquiry_creation_datetime);
        this.lastUpdated = moment(createTime).fromNow();
      },
      err => { console.log(err); }
    );



    this.prefill.fetchCustomComponent()
      .subscribe(
      data => {
        //console.log(data);
        data.forEach(el => {
          let temp = {
            component_id: el.component_id,
            enq_custom_id: "0",
            enq_custom_value: ""
          }
          let index = el.component_id.toString();
          //console.log(index)
          this.componentListObject[index] = temp;
          let dataArr = el.prefilled_data.split(',');
          el.prefilled_data = dataArr
          this.componentPrefill.push(el);
        });
        this.emptyCustomComponent = this.componentListObject;
      },
      err => {
        console.log("error");
      });
  }





  /* Function to Toggle visibility of additional details div */
  showAdditionDetails() {
    this.additionDetails = !this.additionDetails;
  }




  /* Function to fetch subject when user selects a standard from dropdown */
  fetchSubject(value) {
    //console.log(value);
    this.editEnqData.standard_id = value;
    this.prefill.getEnqSubjects(this.editEnqData.standard_id).subscribe(
      data => { this.enqSub = data; console.log(data); },
      err => { console.log(err); }
    )
  }




  /* Function to submit validated form data */
  submitForm() {

    //Validates if the custom component required fields are selected or not
    this.componentPrefill.forEach(el => {
      /* Required Field not set */
      if (el.is_required == "Y" && this.componentListObject[el.component_id].enq_custom_value == "") {
        this.isCustomComponentValid = false;
        let data = {
          type: "error",
          title: "Form Data Incomplete or Incorrect",
          body: "Please Select the required Fields in Academic Details"
        }
        this.appC.popToast(data);
      }
      /* Required field set push data */
      else if (el.is_required == "Y" && this.componentListObject[el.component_id].enq_custom_value != "") {

        if (typeof this.componentListObject[el.component_id].enq_custom_value == "boolean") {
          if (this.componentListObject[el.component_id].enq_custom_value) {
            this.componentListObject[el.component_id].enq_custom_value = "Y";
            this.editEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
            this.isCustomComponentValid = true;
          }
          else {
            this.componentListObject[el.component_id].enq_custom_value = "N";
            this.editEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
            this.isCustomComponentValid = true;
          }
        }
        else {
          this.editEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
          this.isCustomComponentValid = true;
        }
      }
      /* Not required field */
      else if (el.is_required == "N") {
        if (typeof this.componentListObject[el.component_id].enq_custom_value == "boolean") {
          if (this.componentListObject[el.component_id].enq_custom_value) {
            this.componentListObject[el.component_id].enq_custom_value = "Y";
            this.editEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
            this.isCustomComponentValid = true;
          }
          else {
            this.componentListObject[el.component_id].enq_custom_value = "N";
            this.editEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
            this.isCustomComponentValid = true;
          }
        }
        else {
          this.editEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
          this.isCustomComponentValid = true;
        }
      }
    });

    /* Validate the predefine required fields of the form */
    this.isFormValid = this.ValidateFormDataBeforeSubmit();

    /* Upload Data if the formData is valid */
    if (this.isFormValid && this.isCustomComponentValid) {
      this.poster.postNewEnquiry(this.editEnqData).subscribe(
        data => {
          //console.log(data); 
          if (this.addNextCheck) {
            console.log(this.addNextCheck);
            let msg = {
              type: "success",
              title: "New Enquiry Added",
              body: "Your enquiry has been submitted"
            }
            this.appC.popToast(msg);
            this.clearFormData();
          }
          else {
            console.log(this.addNextCheck);
            this.prefill.fetchLastDetail().subscribe(el =>
              data => {
                this.lastDetail = data;
                let createTime = new Date(data.enquiry_creation_datetime);
                this.lastUpdated = moment(createTime).fromNow();
              }
            );
            this.clearFormData();
          }
        },
        err => {
          let data = {
            type: "error",
            title: "Error Posting New Enquiry",
            body: err.message
          }
          this.appC.popToast(data);
        }
      );
    }
    /* Do Nothing if the formData is Still Invalid  */
    else {
      this.editEnqData.enqCustomLi = [];
      this.submitError = true;

    }
  }



  /* Validate the Entire FormData Once Before Uploading= */
  ValidateFormDataBeforeSubmit(): boolean {

    if ((this.editEnqData.name == null || this.editEnqData.name == "") || (this.editEnqData.phone == null || this.editEnqData.phone == "") || (this.editEnqData.enquiry_date == null || this.editEnqData.enquiry_date == "")) {
      return false;
    }
    else {
      return true;
    }
  }



  /* Function to store the data of Custom Component in to Base64 encoded array string */
  customComponentUpdated(val, data) {
    this.componentListObject[data.component_id].enq_custom_value = val;
    console.log(this.componentListObject);
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



}
