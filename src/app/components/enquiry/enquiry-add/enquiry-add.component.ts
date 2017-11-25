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

  isNewInstitute: boolean = false;
  /* Institute List for edit and delete purpose */
  instituteList: any;

  isNewSource: boolean = false;
  /* Institute List for edit and delete purpose */
  sourceList: any;

  isNewRefer: boolean = false;
  /* Institute List for edit and delete purpose */
  referList: any;

  /* Model for Creating Institute */
  createInstitute = {
    instituteName: "",
    isActive: "Y"
  }

  /* Model for Creating Source */
  createSource = {
    name: "",
    inst_id: sessionStorage.getItem('institute_id'),
  }

  /* Model for Creating Reference */
  createReferer = {
    name: "",
    inst_id: sessionStorage.getItem('institute_id')
  }

  constructor(private prefill: FetchprefilldataService, private router: Router,
    private logger: Logger, private appC: AppComponent, private poster: PostEnquiryDataService) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
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
      status: "0",
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



    /* this.prefill.getScholarPrefillData().subscribe(
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
    ); */




    this.prefill.getEnqStardards().subscribe(
      data => { this.enqStd = data; },
      err => {
        //  console.log(err);
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
    let customComponentValidator = this.validateCustomComponent();

    /* Validate the predefine required fields of the form */
    this.isFormValid = this.ValidateFormDataBeforeSubmit();

    console.log(this.isFormValid && customComponentValidator);

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




  validateCustomComponent(): boolean {

    let temp = false;

    this.componentPrefill.forEach(el => {

      if (el.is_required == "Y") {
        /* Required Field not set */
        if (this.componentListObject[el.component_id].enq_custom_value == "") {
          this.isCustomComponentValid = false;
          this.newEnqData.enqCustomLi = [];
          let data = {
            type: "error",
            title: "Form Data Incomplete or Incorrect",
            body: "Please Select the required Fields in Academic Details"
          }
          this.appC.popToast(data);
        }
        /* Required field set push data */
        else if (this.componentListObject[el.component_id].enq_custom_value != "") {
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
      }
      else if (el.is_required == "N") {
        /* Not required field */
        if (typeof this.componentListObject[el.component_id].enq_custom_value == "boolean") {
          if (this.componentListObject[el.component_id].enq_custom_value) {
            this.componentListObject[el.component_id].enq_custom_value = "Y";
            this.newEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
            this.isCustomComponentStillValid = true;
          }
          else {
            this.componentListObject[el.component_id].enq_custom_value = "N";
            this.newEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
            this.isCustomComponentStillValid = true;
          }
        }
        else {
          this.newEnqData.enqCustomLi.push(this.componentListObject[el.component_id]);
          this.isCustomComponentStillValid = true;
        }
      }
    });
    return (this.isCustomComponentValid && this.isCustomComponentStillValid);
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








  /* function to show popup for adding reference */
  showAddReferPops() {
    this.isReferPop = true;
  }




  /* function to hide popup for adding reference */
  hideAddReferPops() {
    this.isReferPop = false;
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
    localStorage.setItem('institute_enquiry_id', val);
    this.router.navigate(['/enquiry/edit']);
  }





  /* --------------------------------------------------------------------------------------------------------- */
  /* ---------------------------------------------- Institute Editor Logic ------------------------------------------------- */
  /* --------------------------------------------------------------------------------------------------------- */

  /* function to open popup to add institute */
  openAddInstitute() {
    this.isInstitutePop = true;
  }

  /* function to hide popup to add institute */
  closeInstituteAdder() {
    this.isInstitutePop = false;
    this.isNewInstitute = false;
    this.createInstitute.instituteName = '';
    this.fetchInstituteInfo();
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

  /* close add new institute */
  closeAddInstitute() {
    this.isNewInstitute = false;
    document.getElementById('add-institute-icon').innerHTML = '+';
    this.createInstitute.instituteName = '';
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
        this.poster.updateInstituteDetails(id, el).subscribe(
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

  /* function to hide popup to add Reference */
  closeReferAdder() {
    this.isReferPop = false;
    this.isNewRefer = false;
    this.createReferer.name = '';
    this.fetchReferInfo();
  }


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



  /* close add new Reference */
  closeAddRefer() {
    this.isNewRefer = false;
    document.getElementById('add-refer-icon').innerHTML = '+';
    this.createReferer.name = '';
  }



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



  editRefer(id) {
    this.referList.forEach(el => {
      if (el.id == id) {
        el.edit = true;
      }
    });
  }



  cancelEditRefer(id) {
    this.fetchReferInfo();
  }



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
              body: 'There was an error processing your request'
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

  /* function to hide popup to add Source */
  closeSourceAdder() {
    this.isSourcePop = false;
    this.isNewSource = false;
    this.createSource.name = '';
    this.fetchSourceInfo();
  }




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



  /* close add new Source */
  closeAddSource() {
    this.isNewSource = false;
    document.getElementById('add-source-icon').innerHTML = '+';
    this.createSource.name = '';
  }


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
    )
  }


  /* Source edit open*/
  editSource(id) {
    this.sourceList.forEach(el => {
      if (el.id == id) {
        el.edit = true;
      }
    });
  }


  /* Source edit cancel*/
  cancelEditSource(id) {
    this.fetchSourceInfo();
  }


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
              body: 'There was an error processing your request'
            }
            this.appC.popToast(alert);
          }
        )
      }
    });
  }




}
