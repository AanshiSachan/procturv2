import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';

import { EnquiryCampaign } from '../../../model/enquirycampaign';
import { instituteInfo } from '../../../model/instituteinfo';
import { FetchenquiryService } from '../../../services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { EnquiryConfirmModalComponent } from '../../custom/enquiry-confirm-modal/enquiry-confirm-modal.component';

import { Observable } from 'rxjs/Rx';
import {Subscription} from 'rxjs';
import 'rxjs/Rx';

@Component({
  selector: 'app-enquiry-add',
  templateUrl: './enquiry-add.component.html',
  styleUrls: ['./enquiry-add.component.scss']
})

export class EnquiryAddComponent implements OnInit{

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
  addFormData = {
    name: null,
    phone: null,
    email: null,
    gender: null,
    address: null,
    city: null,
    institute_name: null,
    standard: null,
    subject: null,
    qualification: null,
    board:  null,
    yearOfPassing: null,
    percentGPA: null,
    percentGPA_MS: null,
    enquiryDate: null,
    enquiryStatus: null,
    enquiryPriority: null,
    followType: null,
    followUp: null,
    source: null,
    reffered: null,
    assignedTo: null,
    remarks: null,
  };

  constructor(private prefill: FetchprefilldataService, private router: Router, private logger: Logger, private adfilterFB: FormBuilder){
  }

  ngOnInit() {
    this.FetchEnquiryPrefilledData();
  }

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
      data => { this.enqAssignTo = data; },
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
  getLeadDetails(){
   if(this.addFormData.phone != null){
    let data = this.prefill.fetchLeadDetails(this.addFormData.phone);
   }
   else{
    alert("Please enter the phone number to fetch details")
   }
  }
  clearFormData(){}
  openConfirmationPopup(){
    this.closeUpdatePopup();
    console.log("confirmation popup opened");
    this.confimationPop = true;
  }
  closePopUp(){
    console.log("confirmation popup closed");
    this.confimationPop = false;
  }
  openUpdatePopup(){
    this.closePopUp();
    this.updatePop = true;
    console.log("edit popup opened");
  }
  closeUpdatePopup(){
    this.updatePop = false;
  }
}
