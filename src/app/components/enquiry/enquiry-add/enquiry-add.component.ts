import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';


@Component({
  selector: 'app-enquiry-add',
  templateUrl: './enquiry-add.component.html',
  styleUrls: ['./enquiry-add.component.scss']
})
export class EnquiryAddComponent implements OnInit {

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
  newEnqData: addEnquiryForm;
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
  componentRenderer: any = [];
  isCustomComponentValid: boolean = true;
  isFormValid: boolean = false;
  lastUpdated: any;
  errorMessage: any;
  submitError: boolean = false;
  addNextCheck: boolean = false;

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



  constructor(private prefill: FetchprefilldataService, private router: Router,
    private logger: Logger, private appC: AppComponent, private poster: PostEnquiryDataService) {

  }



  /* OnInit Initialized */
  ngOnInit() {

    this.FetchEnquiryPrefilledData();
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
        //   console.log(err); 
      }
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
      err => {
        //  console.log(err);
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
        //   console.log(err);
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
        //   console.log(err); 
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
        //console.log("error");
      }
    );
  }





  /* Function to Toggle visibility of additional details div */
  showAdditionDetails() {
    this.additionDetails = !this.additionDetails;
  }





  /* On Phone Number input by user update model and fetch lead records if any */
  updatePhoneFetchRecords() {
    this.prefill.fetchLeadDetails(this.newEnqData.phone).subscribe(
      data => { this.updateForm(data) },
      err => { }
    );
  }





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





  /* Function to validate the number provided by user  and return data back to getLeadDetails*/
  validatePhone(num) {
    //console.log(num);
    if (num != null) {
      return this.newEnqData.phone.length === 10;
    }
  }




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




  /* Function to fetch subject when user selects a standard from dropdown */
  fetchSubject(value) {
    //console.log(value);
    this.newEnqData.standard_id = value;
    this.prefill.getEnqSubjects(this.newEnqData.standard_id).subscribe(
      data => {
      this.enqSub = data;
        // console.log(data); 
      },
      err => {
        //  console.log(err); 
      }
    )
  }




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
            this.newEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
            this.isCustomComponentValid = true;
          }
          else {
            this.componentListObject[el.component_id].enq_custom_value = "N";
            this.newEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
            this.isCustomComponentValid = true;
          }
        }
        else {
          this.newEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
          this.isCustomComponentValid = true;
        }
      }
      /* Not required field */
      else if (el.is_required == "N") {
        if (typeof this.componentListObject[el.component_id].enq_custom_value == "boolean") {
          if (this.componentListObject[el.component_id].enq_custom_value) {
            this.componentListObject[el.component_id].enq_custom_value = "Y";
            this.newEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
            this.isCustomComponentValid = true;
          }
          else {
            this.componentListObject[el.component_id].enq_custom_value = "N";
            this.newEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
            this.isCustomComponentValid = true;
          }
        }
        else {
          this.newEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
          this.isCustomComponentValid = true;
        }
      }
    });

    /* Validate the predefine required fields of the form */
    this.isFormValid = this.ValidateFormDataBeforeSubmit();

    /* Upload Data if the formData is valid */
    if (this.isFormValid && this.isCustomComponentValid) {
      this.poster.postNewEnquiry(this.newEnqData).subscribe(
        data => {
          //console.log(data); 
          if (this.addNextCheck) {
            //  console.log(this.addNextCheck);
            let msg = {
              type: "success",
              title: "New Enquiry Added",
              body: "Your enquiry has been submitted"
            }
            this.appC.popToast(msg);
            this.clearFormData();
          }
          else {
            // console.log(this.addNextCheck);
            this.prefill.fetchLastDetail().subscribe(el =>
              data => {
                this.lastDetail = data;
                let createTime = new Date(data.enquiry_creation_datetime);
                this.lastUpdated = moment(createTime).fromNow();
              }
            );
            this.openConfirmationPopup();
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
      this.newEnqData.enqCustomLi = [];
      this.submitError = true;

    }
  }





  /* Validate the Entire FormData Once Before Uploading= */
  ValidateFormDataBeforeSubmit(): boolean {

    if ((this.newEnqData.name == null || this.newEnqData.name == "") || (this.newEnqData.phone == null || this.newEnqData.phone == "") || (this.newEnqData.enquiry_date == null || this.newEnqData.enquiry_date == "")) {
      return false;
    }
    else {
      return true;
    }
  }





  /* fetch the data of last updated enquiry */
  updateLastUpdatedDetails() {
    this.prefill.fetchLastDetail().subscribe(el =>
      data => {
        this.lastDetail = data;
        let createTime = new Date(data.enquiry_creation_datetime);
        this.lastUpdated = moment(createTime).fromNow();
      },
      err => {
        //  console.log(err);
      }
    )
  }





  /* Function to open confirmation popup on succesfull form submission  */
  openConfirmationPopup() {
    //  console.log("confirmation popup opened");
    this.confimationPop = true;
  }





  /* Function to close the confirmation popup */
  closePopUp() {
    // console.log("confirmation popup closed");
    this.confimationPop = false;
  }





  /* function to open update popup */
  openUpdatePopup() {
    this.closePopUp();
    this.updatePop = true;
    // console.log("edit popup opened");
  }





  /* Function to close update popup */
  closeUpdatePopup() {
    this.updatePop = false;
  }




  /* function to open popup to add source */
  showAddSourcePops() {
    //console.log('clicked');
    this.isSourcePop = true;
  }




  /* function to hide popup to add source */
  hideAddSourcePops() {
    this.isSourcePop = false;
  }




  /* function to add source on server */
  addSourceData() {
    if (this.createSource.name != "") {
      this.prefill.createSource(this.createSource).subscribe(
        data => {
          // console.log(data.message);
          this.prefill.getLeadSource().subscribe(
            data => {
              this.sourceLead = data;
              this.hideAddSourcePops();
            },
            err => {
              //  console.log(err);
              this.hideAddSourcePops();
            }
          );
        },
        err => {
          //  console.log(err.message) 
        }
      );
    }
    else {
      // console.log("please enter a valid input");
    }
  }




  /* function to open popup to add institute */
  openAddInstitute() {
    this.isInstitutePop = true;
  }




  /* function to hide popup to add institute */
  closeInstituteAdder() {
    this.isInstitutePop = false;
  }




  /* function to set-unset isActive status for add institute */
  toggleInstituteActive(event) {
    if (event) {
      this.createInstitute.isActive = "Y";
    }
    else {
      this.createInstitute.isActive = "N";
    }

  }




  /* function to add institute data to server */
  addInstituteData() {
    this.prefill.createNewInstitute(this.createInstitute).subscribe(el => {
      if (el.message === "OK") {
        this.prefill.getSchoolDetails().subscribe(
          data => {
            this.school = data;
            // console.log('data added');
            this.closeInstituteAdder();
          },
          err => {
            // console.log(err);
            this.closeInstituteAdder();
          }
        );
        // console.log("institute Added");
      }
      else {
        // console.log("Institute Name already exist!");
      }
    });
  }




  /* function to show popup for adding reference */
  showAddReferPops() {
    this.isRefferPop = true;
  }




  /* function to hide popup for adding reference */
  hideAddReferPops() {
    this.isRefferPop = false;
  }




  /* function to add new reference to server */
  addReferData() {
    if (this.createReferer.name != "") {
      this.prefill.createReferer(this.createReferer).subscribe(
        data => {
          // console.log(data.message);
          this.prefill.getLeadReffered().subscribe(
            data => { this.refferedBy = data; },
            err => {
              //  console.log(err); 
            }
          );
          this.hideAddReferPops();
        },
        err => {
          // console.log(err.message);
          this.hideAddReferPops();
        }
      )
    }
    else {
      // console.log("please enter a valid input!");
    }
  }




  /* Reload the Enquiry Form and clear data */
  reloadEnquiryForm() {
    this.clearFormData();
    this.closePopUp();
  }



  customComponentUpdated(val, data) {
    this.componentListObject[data.component_id].enq_custom_value = val;
    // console.log(this.componentListObject);
  }




  navigateToEdit(val) {
    // console.log(val);
  }


}
