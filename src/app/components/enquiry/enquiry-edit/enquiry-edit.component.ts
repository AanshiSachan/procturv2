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

  /* Popup Handler */
  confimationPop: boolean = false;
  updatePop: boolean = false;

  /* Form Support */
  editEnqData: addEnquiryForm = {
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

  /* Variable to store JSON.stringify value and update service for multi-component communication */
  rowDataJson: string = null;
  rowData: any;
  constructor(private prefill: FetchprefilldataService, private router: Router, private logger: Logger, private pops: PopupHandlerService) { }

  /* OnInit Initialized */
  ngOnInit() {

    this.FetchEnquiryPrefilledData();

    this.pops.currentRowJson.subscribe(data => this.rowDataJson = data);

    if (this.rowDataJson.length > 1) {
     
      this.rowData = JSON.parse(this.rowDataJson);
     
      this.updateEditFormPrefill(this.rowData);
     
      console.log(this.rowData.gender);
     
     
      /* Model for Enquiry Data */
      this.editEnqData = {
        name: this.rowData.name,
        phone: this.rowData.phone,
        email: this.rowData.email,
        gender: this.rowData.gender,
        phone2: this.rowData.phone2,
        email2: this.rowData.email2,
        curr_address: this.rowData.curr_address,
        parent_name: this.rowData.parent_name,
        parent_phone: this.rowData.parent_phone,
        parent_email: this.rowData.parent_email,
        city: this.rowData.city,
        occupation_id: this.rowData.occupation_id,
        school_id: this.rowData.school_id,
        qualification: this.rowData.qualification,
        grade: this.rowData.grade,
        enquiry_date: this.rowData.enquiry_date,
        standard_id: this.rowData.standard_id,
        subject_id: this.rowData.subject_id,
        referred_by: this.rowData.refferedBy,
        source_id: this.rowData.source_id,
        fee_committed: this.rowData.fee_committed,
        discount_offered: this.rowData.discount_offered,
        priority: this.rowData.priority,
        enquiry: this.rowData.enquiry,
        follow_type: this.rowData.follow_type,
        followUpDate: this.rowData.followUpDate,
        religion: this.rowData.religion,
        link: this.rowData.link,
        slot_id: this.rowData.slot_id,
        closedReason: this.rowData.closedReason,
        demo_by_id: this.rowData.demo_by_id,
        status: this.rowData.status,
        assigned_to: this.rowData.assigned_to,
        followUpTime: this.rowData.followUpTime,
        lead_id: this.rowData.lead_id,
        enqCustomLi: null
      };
    }
    else {
      alert("please select an enquiry from the list to edit details");
      this.router.navigate(['/enquiry'])
    }

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
      data => { this.lastDetail = data; },
      err => { console.log(err); }
    );
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
    []
  }
}
