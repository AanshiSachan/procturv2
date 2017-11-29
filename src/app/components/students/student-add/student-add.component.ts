import { Component, OnInit } from '@angular/core';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { StudentForm } from '../../../model/student-add-form';
import { SelectItem } from 'primeng/primeng';
import * as moment from 'moment';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';





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
    institution_id: sessionStorage.getItem('institute_id'), // "100123",
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
  private instituteList: any[] = [];
  private standardList: any[] = [];
  private courseList: any[] = [];
  private batchList: any[] = [];
  private isAssignBatch: boolean = false;
  private assignedBatch: string = "";
  private isAcad: boolean = false;
  private isProfessional: boolean = false;
  slots: any[] = [];
  langStatus: any[] = [];
  selectedSlots: any[] = [];
  multiOpt: boolean = false;
  selectedSlotsString: string = '';
  assignedBatchString: string = '';





  constructor(private studentPrefillService: AddStudentPrefillService, private prefill: FetchprefilldataService) {
    let institute_type = sessionStorage.getItem('institute_type');
    if (institute_type == 'LANG') {
      this.isProfessional = true;
    }
    else {
      this.isAcad = true;
    }
  }

  ngOnInit() {

    this.fetchPrefillFormData();

    if (this.isProfessional) {
      this.getSlots();
      this.getlangStudentStatus();
    }

  }

  /* Function to navigate through the Student Add Form on button Click Save/Submit*/
  navigateTo(text) {

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
        //console.log(id);
        this.navigateTo("studentForm");
        break;
      }
      case "kyc-icon": {
        //console.log(id);
        this.navigateTo("kyc");
        break;
      }
      case "feeDetails-icon": {
        //console.log(id);
        this.navigateTo("feeDetails");
        break;
      }
      case "inventory-icon": {
        //console.log(id);
        this.navigateTo("inventory");
        break;
      }
      default: {
        //console.log("some error has occured");
        this.navigateTo("studentForm");
        break;
      }
    }
  }


  /* Fetch and store the prefill data to be displayed on dropdown menu */
  fetchPrefillFormData() {

    this.studentPrefillService.fetchInventoryList().subscribe(data => {
      //console.log(data);
    });


    this.studentPrefillService.fetchCustomComponent().subscribe(data => {
      //console.log(data);
    });


    this.prefill.getSchoolDetails().subscribe(data => {
      //console.log(data);
      this.instituteList = data;
    });


    this.prefill.getEnqStardards().subscribe(data => {
      //console.log(data);
      this.standardList = data;
    });


    this.studentPrefillService.fetchBatchDetails().subscribe(data => {
      data.forEach(el => {
        let obj ={
          isSelected: false,
          data: el,
          assignDate: moment().format('YYYY-MM-DD')
        }
        this.batchList.push(obj);
      })
    });

  }


  /* Function to show/hide Addition Details Form section */
  toggleAdditionalBasicDetails() {
    this.additionalBasicDetails = !this.additionalBasicDetails;
  }


  /* Function to add Student Quickly without fees, kyc and inventory details */
  addStudentNow(ev) {
    //console.log(ev);
    this.quickAddStudent = ev;

    /* If Checked then hide save continue button and show submit button */
    if (this.quickAddStudent) {
      document.getElementById('form-continue').classList.add('hide');
      document.getElementById('form-submit').classList.remove('hide');
    }
    else {
      document.getElementById('form-continue').classList.remove('hide');
      document.getElementById('form-submit').classList.add('hide');
    }

  }


  /* Open batch assign popup */
  openAssignBatch() {
    this.isAssignBatch = true;
  }


  /* close batch assign popup */
  closeBatchAssign() {
    this.isAssignBatch = false;
  }


  /* align the user selected batch into input and update the data into array to be updated to server */
  assignBatch() {
    let batchString:any[] = [];
    //console.log(this.batchList); 
    this.batchList.forEach(el=> {
      if(el.isSelected){
        this.studentAddFormData.assignedBatches.push(el.data.batch_id.toString());
        this.studentAddFormData.batchJoiningDates.push(moment(el.assignDate).format('YYYY-MM-DD'));
        batchString.push(el.data.batch_name);
      }
    });
    if(batchString.length != 0){
      document.getElementById('assignCoursesParent').classList.add('has-value');
      this.assignedBatchString = batchString.join(',');
      this.closeBatchAssign();
    }
    else{
      this.closeBatchAssign();
    }
  }


  studentQuickAdder() {

    this.studentAddFormData.dob = moment(this.studentAddFormData.dob).format('YYYY-MM-DD');
    this.studentAddFormData.doj = moment(this.studentAddFormData.doj).format('YYYY-MM-DD');    


  }


  /* Customiized click detection strategy */
  inputClicked() {
    var nodelist = document.querySelectorAll('.form-ctrl');
    [].forEach.call(nodelist, (elm) => {
      elm.addEventListener('blur', function (event) {
        if (event.target.value != '') {
          event.target.parentNode.classList.add('has-value');
        } else {
          event.target.parentNode.classList.remove('has-value');
        }
      });
    });
  }




  getSlots() {
    this.studentPrefillService.fetchSlots().subscribe(
      res => {
        res.forEach(el => {
          let obj = {
            label: el.slot_name,
            value: el,
            status: false
          }
          this.slots.push(obj);
        });
       // console.log(this.slots);
      },
      err => { }
    )
  }





  getlangStudentStatus() {
    this.studentPrefillService.fetchLangStudentStatus().subscribe(
      res => {
        this.langStatus = res;
      },
      err => { }
    )
  }




  multiselectVisible(elid) {
    let targetid = elid + "multi";
    if (document.getElementById(targetid).classList.contains('hide')) {
      document.getElementById(targetid).classList.remove('hide');
    }
    else {
      document.getElementById(targetid).classList.add('hide');
    }
  }





  updateSlotSelected(data) {

    /* slot checked */
    if (data.status) {
      this.selectedSlots.push(data.value.slot_name);
      if (this.selectedSlots.length != 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      this.selectedSlotsString = this.selectedSlots.join(',');
    }
    /* slot unchecked */
    else {
      if (this.selectedSlots.length != 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else if(this.selectedSlots.length == 0) {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      var index = this.selectedSlots.indexOf(data.value.slot_name);
      if (index > -1) {
        this.selectedSlots.splice(index, 1);
      }
      this.selectedSlotsString = this.selectedSlots.join(',');
    }

  }





  fetchCourseFromMaster(id){
    this.studentPrefillService.fetchCourseList(id).subscribe(
      res => {
        this.courseList = res;
      }
    )

  }
}
