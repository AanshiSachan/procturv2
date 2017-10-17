import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import {Subscription} from 'rxjs';
import 'rxjs/Rx';

import { EnquiryCampaign } from '../../../model/enquirycampaign';
import { instituteInfo } from '../../../model/instituteinfo';
import { addEnquiryForm } from '../../../model/add-enquiry-form';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';


import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';


@Component({
  selector: 'app-enquiry-add',
  templateUrl: './enquiry-add.component.html',
  styleUrls: ['./enquiry-add.component.scss']
})

export class EnquiryAddComponent implements OnInit{

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
  confimationPop: boolean= false; 
  updatePop: boolean= false;
  newEnqData: addEnquiryForm; 
  additionDetails:boolean = false; 
  institute_id: any = "100123";
  todayDate: number = Date.now();
  isSourcePop: boolean = false;
  isInstitutePop: boolean = false;
  isRefferPop: boolean = false;
  newEnquiryFormGroup: FormGroup;

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
  createReferer ={
    name: "",
    inst_id: this.institute_id
  }


  constructor(private prefill: FetchprefilldataService, private router: Router, private logger: Logger){}

  /* OnInit Initialized */
  ngOnInit() {
    
    this.FetchEnquiryPrefilledData();
    /* Model for Enquiry Data */
    this.newEnqData = {
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
  }
  
  /* Function for Toggling ng2-smart-table columns */
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
  FetchEnquiryPrefilledData(){
    this.prefill.getEnqStatus().subscribe(
      data => {this.enqstatus = data;},
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
      data => { this.enqAssignTo = data;},
      err => { console.log(err); }
    );
    this.prefill.getScholarPrefillData().subscribe(
      data => { 
        //console.log(data);
        data.forEach(el => {
          if(el.label == "Scholarship"){
            //console.log(el);
            this.enqScholarship = el.prefilled_data.split(',');
          }
          else if(el.label == "Subject2"){
            this.enqSub2 = el.prefilled_data.split(',');
          }
        })
      },
      err => { console.log(err); }
    );
    this.prefill.getEnqStardards().subscribe(
      data => { this.enqStd = data;},
      err => { console.log(err); }
    );
    this.prefill.getSchoolDetails().subscribe(
      data => { this.school = data;},
      err => { console.log(err); }
    );
    this.prefill.getLeadSource().subscribe(
      data => { this.sourceLead = data;},
      err => { console.log(err); }
    );
    this.prefill.getLeadReffered().subscribe(
      data => { this.refferedBy = data;},
      err => { console.log(err); }
    );
    this.prefill.getOccupation().subscribe(
      data => { this.occupation = data;},
      err => { console.log(err); }
    );
    this.prefill.fetchLastDetail().subscribe(
      data => { this.lastDetail = data;},
      err => { console.log(err); }
    );
  }

  /* Function to Toggle visibility of additional details div */
  showAdditionDetails(){
    this.additionDetails = !this.additionDetails;
  }

  /* Function to fetch lead details on basis of the phone number provided by user */
  getLeadDetails(){
    console.log(this.newEnqData.phone);
    if(this.validatePhone(this.newEnqData.phone)){
      this.prefill.fetchLeadDetails(this.newEnqData.phone).subscribe(
        data => { this.updateForm(data) },
        err => { alert(err.message); }
      )
    }
  }

  /* Function to validate the number provided by user  and return data back to getLeadDetails*/
  validatePhone(num){
    console.log(num);
    if(num != null){
      return this.newEnqData.phone.length === 10;
    }
    else{

      alert('please enter an input');
    }
  }

  /* Update the form fields onn basis of the data retreived from getLeadDetails*/
  updateForm(data){
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
  fetchSubject(value){
    //console.log(value);
    this.newEnqData.standard_id = value;
    this.prefill.getEnqSubjects(this.newEnqData.standard_id).subscribe(
      data => {this.enqSub = data; console.log(data);},
      err => { console.log(err); } 
    )
  }

  /* Function to clear the form data */
  clearFormData(){
    this.newEnqData = {
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

  /* Function to submit validated form data */
  submitForm(){
    this.prefill.postNewEnquiry(this.newEnqData).subscribe(
      data => { 
        this.lastDetail = data;
        if(data.statusCode == 200){
          this.openConfirmationPopup();
        }
       },
      err => { console.log(err); }
    )
  }

  /* Function to open confirmation popup on succesfull form submission  */
  openConfirmationPopup(){
    this.closeUpdatePopup();
    console.log("confirmation popup opened");
    this.confimationPop = true;
  }

  /* Function to close the confirmation popup */
  closePopUp(){
    console.log("confirmation popup closed");
    this.confimationPop = false;
  }

  /* function to open update popup */
  openUpdatePopup(){
    this.closePopUp();
    this.updatePop = true;
    console.log("edit popup opened");
  }

  /* Function to close update popup */
  closeUpdatePopup(){
    this.updatePop = false;
  }

  /* function to open popup to add source */
  showAddSourcePops(){
    //console.log('clicked');
    this.isSourcePop = true;
  }

  /* function to hide popup to add source */
  hideAddSourcePops(){
    this.isSourcePop = false;
  }

  /* function to add source on server */
  addSourceData(){
    if(this.createSource.name != ""){
      this.prefill.createSource(this.createSource).subscribe(
        data=>{
          alert(data.message); 
          this.prefill.getLeadSource().subscribe(
            data => 
            { 
            this.sourceLead = data;
            this.hideAddSourcePops();
          },
            err =>
             { 
              console.log(err);
              this.hideAddSourcePops(); 
            }
          );
        },
        err => {alert(err.message)}
      );
    }
    else{
      alert("please enter a valid input");
    }
  }

  /* function to open popup to add institute */
  openAddInstitute(){
    this.isInstitutePop = true;
  }

  /* function to hide popup to add institute */
  closeInstituteAdder(){
    this.isInstitutePop = false;
  }

  /* function to set-unset isActive status for add institute */
  toggleInstituteActive(event){
    if(event){
      this.createInstitute.isActive = "Y";
    }
    else{
      this.createInstitute.isActive = "N";
    }

  }
  
  /* function to add institute data to server */
  addInstituteData(){
    this.prefill.createNewInstitute(this.createInstitute).subscribe(el => {
      if(el.message === "OK"){
        this.prefill.getSchoolDetails().subscribe(
          data => { 
            this.school = data;
            alert('data added');
            this.closeInstituteAdder();
          },
          err => { 
            alert(err);
            this.closeInstituteAdder();
           }
        );
        alert("institute Added");
      }
      else{
        alert("Institute Name already exist!");
      }
    });
  }

  /* function to show popup for adding reference */
  showAddReferPops(){
    this.isRefferPop =  true;
  }

  /* function to hide popup for adding reference */
  hideAddReferPops(){
    this.isRefferPop =  false;
  }

  /* function to add new reference to server */
  addReferData(){
    if(this.createReferer.name != ""){
      this.prefill.createReferer(this.createReferer).subscribe(
        data =>{ 
          alert(data.message);
          this.prefill.getLeadReffered().subscribe(
            data => { this.refferedBy = data;},
            err => { console.log(err); }
          );
          this.hideAddReferPops();
        },
        err => { 
          alert(err.message);
          this.hideAddReferPops();
        }
      )
    }
    else{
      alert("please enter a valid input!");
    }
  }


  /* Reload the Enquiry Form and clear data */
  reloadEnquiryForm(){
    this.clearFormData();
    this.closePopUp();
  }


}
