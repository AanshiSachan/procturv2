import { Component, OnInit } from '@angular/core';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import {StudentForm} from '../../../model/student-add-form';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss']
})
export class StudentAddComponent implements OnInit {

  private studentAddFormData: StudentForm = {
    student_name: "", 
    student_sex: "",
    student_email: "", 
    student_phone: "",
    student_curr_addr: "",
    dob: "",
    doj: "", // "2017-10-25",
    school_name: "", // "943",
    student_class: "", // "1269",
    parent_name: "", 
    parent_email: "", 
    parent_phone: "", 
    guardian_name: "", 
    guardian_email: "",
    guardian_phone: "",
    is_active: "", // "Y",
    institution_id: "", // "100123",
    assignedBatches: [], // ["5660", "2447", "4163", "3067"],
    fee_type: 0, 
    fee_due_day: 0,
    batchJoiningDates: [], // ["2017-10-25", "2017-10-25", "2017-10-25", "2017-10-25"],
    comments: "", 
    photo: null,
    enquiry_id: "", 
    student_disp_id: "",
    student_manual_username: null,
    social_medium: -1,
    attendance_device_id: "",
    religion: "",
    standard_id: null,
    subject_id: null, 
    slot_id: null, 
    language_inst_status: null,
    stuCustomLi: []
  }
  private quickAddStudent: boolean = false;
  private additionalBasicDetails: boolean = false;
  private instituteList: any = [];
  private standardList: any = [];
  private batchList: any = [];
  private isAssignBatch: boolean = false;
  private assignedBatch:string = "";
  

  constructor(private studentPrefillService: AddStudentPrefillService, private prefill: FetchprefilldataService) { }

  ngOnInit() {

    this.fetchPrefillFormData();

  }

  /* Function to navigate through the Student Add Form on button Click Save/Submit*/
  navigateTo(text) {
    console.log(text);
    if (text === "studentForm") {

      document.getElementById('li-one').classList.add('active');
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.remove('active');

      document.getElementById('studentForm').classList.remove('hide');
      document.getElementById('kyc').classList.add('hide');
      document.getElementById('feeDetails').classList.add('hide');
      document.getElementById('inventory').classList.add('hide');
    }
    else if (text === "kyc") {

      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.add('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.remove('active');

      document.getElementById('studentForm').classList.add('hide');
      document.getElementById('kyc').classList.remove('hide');
      document.getElementById('feeDetails').classList.add('hide');
      document.getElementById('inventory').classList.add('hide');
    }
    else if (text === "feeDetails") {

      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-three').classList.add('active');
      document.getElementById('li-four').classList.remove('active');

      document.getElementById('studentForm').classList.add('hide');
      document.getElementById('kyc').classList.add('hide');
      document.getElementById('feeDetails').classList.remove('hide');
      document.getElementById('inventory').classList.add('hide');

    }
    else if (text === "inventory") {

      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.add('active');

      document.getElementById('studentForm').classList.add('hide');
      document.getElementById('kyc').classList.add('hide');
      document.getElementById('feeDetails').classList.add('hide');
      document.getElementById('inventory').classList.remove('hide');

    }
  }


  /* Function to navigate on icon click */
  switchToView(id) {
    switch (id) {
      case "studentForm-icon": {
        console.log(id);
        this.navigateTo("studentForm");
        break;
      }
      case "kyc-icon": {
        console.log(id);
        this.navigateTo("kyc");
        break;
      }
      case "feeDetails-icon": {
        console.log(id);
        this.navigateTo("feeDetails");
        break;
      }
      case "inventory-icon": {
        console.log(id);
        this.navigateTo("inventory");        
        break;
      }
      default: {
        console.log("some error has occured");
        break;
      }
    }
  }


  /* Fetch and store the prefill data to be displayed on dropdown menu */
  fetchPrefillFormData() {


    this.studentPrefillService.fetchInventoryList().subscribe(data => {
      console.log(data);
    });


    this.studentPrefillService.fetchCustomComponent().subscribe(data => {
      console.log(data);
    });


    this.prefill.getSchoolDetails().subscribe(data => {
      console.log(data);
      this.instituteList = data;
    });


    this.prefill.getEnqStardards().subscribe(data => {
      console.log(data);
      this.standardList = data;
    });


    this.studentPrefillService.fetchBatchDetails().subscribe(data => {
      console.log(data);
      this.batchList = data;
    });

  }


  /* Function to show/hide Addition Details Form section */
  toggleAdditionalBasicDetails() {
    this.additionalBasicDetails = !this.additionalBasicDetails;
  }


  /* Function to add Student Quickly without fees, kyc and inventory details */
  addStudentNow(ev){
    console.log(ev);
    this.quickAddStudent = ev;

    /* If Checked then hide save continue button and show submit button */
    if(this.quickAddStudent){
      document.getElementById('form-continue').classList.add('hide');
      document.getElementById('form-submit').classList.remove('hide');
    }
    else{
      document.getElementById('form-continue').classList.remove('hide');
      document.getElementById('form-submit').classList.add('hide');
    }

  }


  /* Open batch assign popup */
  openAssignBatch(){
    this.isAssignBatch = true;
  }


  /* close batch assign popup */
  closeBatchAssign(){
    this.isAssignBatch = false;
  }


  /* align the user selected batch into input and update the data into array to be updated to server */
  assignBatch(){}
}
