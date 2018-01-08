import { Component, OnInit } from '@angular/core';
import { AddStudentPrefillService } from '../../../services/student-services/add-student-prefill.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';
import { StudentForm } from '../../../model/student-add-form';
import { SelectItem } from 'primeng/primeng';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { Subscription } from 'rxjs';
import { LoginService } from '../../../services/login-services/login.service';
import 'rxjs/Rx';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.scss']
})
export class StudentEditComponent implements OnInit {

  private studentEditFormData: StudentForm = {
    student_name: "",
    student_sex: "",
    student_email: "",
    student_phone: "",
    student_curr_addr: "",
    dob: "",
    doj: moment().format('YYYY-MM-DD'), // "2017-10-25",
    school_name: "-1", // "943",
    student_class: "-1", // "1269",
    parent_name: "",
    parent_email: "",
    parent_phone: "",
    guardian_name: "",
    guardian_email: "",
    guardian_phone: "",
    is_active: "Y", // "Y",
    institution_id: sessionStorage.getItem('institute_id'), // "100123",
    assignedBatches: [], // ["5660", "2447", "4163", "3067"],
    fee_type: 0,
    fee_due_day: 0,
    batchJoiningDates: [], // ["2017-10-25", "2017-10-25", "2017-10-25", "2017-10-25"],
    comments: "",
    photo: null,

    student_disp_id: "",
    student_manual_username: null,
    social_medium: -1,
    attendance_device_id: "",
    religion: "",
    standard_id: "-1",
    subject_id: "-1",
    slot_id: null,
    language_inst_status: null,
    stuCustomLi: []
  };

  private quickAddStudent: boolean = false;
  private additionalBasicDetails: boolean = false;
  private isAssignBatch: boolean = false;
  private isAcad: boolean = false;
  private isProfessional: boolean = false;
  private multiOpt: boolean = false;
  private isDuplicateStudent: boolean = false;

  private instituteList: any[] = [];
  private standardList: any[] = [];
  private courseList: any[] = [];
  private batchList: any[] = [];
  private slots: any[] = [];
  private langStatus: any[] = [];
  private selectedSlots: any[] = [];
  private customComponents: any[] = [];
  private slotIdArr: any[] = [];
  uploadedFiles: any[] = [];

  private assignedBatch: string = "";
  private selectedSlotsString: string = '';
  private selectedSlotsID: string = '';
  private assignedBatchString: string = '';
  private userImageEncoded: string = '';
  removeImage: boolean = false;
  busyPrefill: Subscription;
  formIsActive: boolean = true;







  constructor(private studentPrefillService: AddStudentPrefillService, private fetchService: FetchStudentService, private prefill: FetchprefilldataService, private postService: PostStudentDataService, private router: Router, private login: LoginService, private appC: AppComponent) {

    if (localStorage.getItem('studentId') == null) {
      this.router.navigate(['/student']);
    }
    else {
      this.setInstituteType();
      this.busyPrefill = this.fetchPrefillFormData();
    }
  }





  
  ngOnInit() {
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));

    this.busyPrefill = this.fetchService.getStudentById(localStorage.getItem("studentId")).subscribe(
      res => {
        this.updateStudentEditForm(res);
      }
    )
  }






  setInstituteType() {
    let institute_type = sessionStorage.getItem('institute_type');
    if (institute_type == 'LANG') {
      this.isProfessional = true;
    }
    else {
      this.isAcad = true;
    }
  }





  updateStudentEditForm(ev) {
    this.studentEditFormData.student_name = ev.student_name;
    this.studentEditFormData.student_sex = ev.student_sex;
    this.studentEditFormData.student_email = ev.student_email;
    this.studentEditFormData.student_phone = ev.student_phone;
    this.studentEditFormData.student_curr_addr = ev.student_curr_addr;
    this.studentEditFormData.dob = ev.dob;
    this.studentEditFormData.doj = ev.doj;
    this.studentEditFormData.school_name = ev.school_name;
    this.studentEditFormData.student_class = ev.student_class;
    this.studentEditFormData.parent_name = ev.parent_name;
    this.studentEditFormData.parent_email = ev.parent_email;
    this.studentEditFormData.parent_phone = ev.parent_phone;
    this.studentEditFormData.guardian_name = ev.guardian_name;
    this.studentEditFormData.guardian_email = ev.guardian_email;
    this.studentEditFormData.guardian_phone = ev.guardian_phone;
    this.formIsActive = (ev.is_active == 'Y' ? true : false);
    this.studentEditFormData.is_active = ev.is_active;
    this.studentEditFormData.institution_id = sessionStorage.getItem('institute_id')
    this.studentEditFormData.assignedBatches = ev.batchesAssigned;
    this.studentEditFormData.fee_type = ev.fileType;
    this.studentEditFormData.fee_due_day = ev.fee_due_day;
    this.studentEditFormData.batchJoiningDates = ev.batches_joining_date;
    this.studentEditFormData.comments = ev.comments;
    this.studentEditFormData.photo = ev.photo;

    this.studentEditFormData.student_disp_id = ev.student_disp_id;
    this.studentEditFormData.student_manual_username = ev.student_manual_username;
    this.studentEditFormData.social_medium = ev.social_medium;
    this.studentEditFormData.attendance_device_id = ev.attendance_device_id;
    this.studentEditFormData.religion = ev.religion;
    this.studentEditFormData.standard_id = ev.standard_id;
    this.studentEditFormData.subject_id = ev.subject_id;
    this.studentEditFormData.slot_id = ev.slot_id;
    this.studentEditFormData.language_inst_status = ev.language_inst_status;
    if(ev.stuCustomLi !=null){
      ev.stuCustomLi.forEach(el => {
        this.customComponents.forEach(cc => {
          if(el.id == cc.id){

          }
        });
      });
    }
  }




  updateFormIsActive(ev){
    if(ev){
      this.studentEditFormData.is_active = "Y";
    }
    else{
      this.studentEditFormData.is_active = "N";
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
      this.router.navigate(['/comingsoon']);
      /* document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-three').classList.add('active');
      document.getElementById('li-four').classList.remove('active');
 
      document.getElementById('studentForm').classList.add('hide');
      document.getElementById('kyc').classList.add('hide');
      document.getElementById('feeDetails').classList.remove('hide');
      document.getElementById('inventory').classList.add('hide'); */

    }
    else if (text === "inventory") {
      this.router.navigate(['/comingsoon']);
      /* document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.add('active');
 
      document.getElementById('studentForm').classList.add('hide');
      document.getElementById('kyc').classList.add('hide');
      document.getElementById('feeDetails').classList.add('hide');
      document.getElementById('inventory').classList.remove('hide'); */

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

    let inventory = this.studentPrefillService.fetchInventoryList().subscribe(data => {
    });

    let institute = this.prefill.getSchoolDetails().subscribe(data => {
      this.instituteList = data;
    });


    let standard = this.prefill.getEnqStardards().subscribe(data => {
      this.standardList = data;
    });


    let batch = this.studentPrefillService.fetchBatchDetails().subscribe(data => {
      data.forEach(el => {
        let obj = {
          isSelected: false,
          data: el,
          assignDate: moment().format('YYYY-MM-DD')
        }
        this.batchList.push(obj);
      })
    });

    if (inventory != null && institute != null && standard != null && batch != null) {
      let customComp = this.studentPrefillService.fetchCustomComponent().subscribe(data => {
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
      });
      if (this.isProfessional) {
        this.busyPrefill = this.getSlots();
        this.busyPrefill = this.getlangStudentStatus();
      }
      //console.log(this.customComponents);
      return customComp;
    }
  }



  
  
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
      document.getElementById('form-kyc-continue').classList.add('hide');
      document.getElementById('form-kyc-submit').classList.remove('hide');
    }
    else {
      document.getElementById('form-continue').classList.remove('hide');
      document.getElementById('form-submit').classList.add('hide');
      document.getElementById('form-kyc-continue').classList.remove('hide');
      document.getElementById('form-kyc-submit').classList.add('hide');
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
    let batchString: any[] = [];
    //console.log(this.batchList); 
    this.batchList.forEach(el => {
      if (el.isSelected) {
        this.studentEditFormData.assignedBatches.push(el.data.batch_id.toString());
        this.studentEditFormData.batchJoiningDates.push(moment(el.assignDate).format('YYYY-MM-DD'));
        batchString.push(el.data.batch_name);
      }
    });
    if (batchString.length != 0) {
      document.getElementById('assignCoursesParent').classList.add('has-value');
      this.assignedBatchString = batchString.join(',');
      this.closeBatchAssign();
    }
    else {
      this.closeBatchAssign();
    }
  }


  studentQuickAdder(form: NgForm) {
    /* Both Form are Valid Else there seems to 
        be an error on custom component */
    if (form.valid && this.customComponentValid()) {

      let customArr = [];
      this.customComponents.forEach(el => {
        if (el.value != '' && (typeof el.value != 'boolean')) {
          let obj = {
            component_id: el.id,
            enq_custom_id: "0",
            enq_custom_value: el.value
          }
          customArr.push(obj);
        }
        else if (el.value != '' && (typeof el.value == 'boolean')) {
          if (el.value) {
            let obj = {
              component_id: el.id,
              enq_custom_id: "0",
              enq_custom_value: "Y"
            }
            customArr.push(obj);
          }
          else {
            let obj = {
              component_id: el.id,
              enq_custom_id: "0",
              enq_custom_value: "N"
            }
            customArr.push(obj);
          }
        }
        else if (el.value == '' && (el.type == 2)) {
          let obj = {
            component_id: el.id,
            enq_custom_id: "0",
            enq_custom_value: "N"
          }
          customArr.push(obj);
        }
      });

      /* Get slot data and store on form */
      this.studentEditFormData.slot_id = this.selectedSlotsID;
      this.studentEditFormData.stuCustomLi = customArr;
      this.studentEditFormData.photo = localStorage.getItem('tempImg');
      this.additionalBasicDetails = false;
      this.postService.quickEditStudent(this.studentEditFormData, localStorage.getItem("studentId")).subscribe(
        res => {

          let statusCode = res.statusCode;
          if (statusCode == 200) {
            let alert = {
              type: 'success',
              title: 'Student Details Submitted Successfully',
              body: ''
            }
            this.appC.popToast(alert);
            localStorage.removeItem('tempImg');
            form.reset();
            this.removeImage = true;
            document.getElementById('preview-img').src = '';
            this.clearFormAndMove();
          }
          else if (statusCode == 2) {
            let alert = {
              type: 'error',
              title: 'Contact Number In Use',
              body: 'An enquiry with the same contact number seems to exist'
            }
            form.reset();
            this.removeImage = true;
            this.appC.popToast(alert);
            this.isDuplicateContactOpen();
          }
        },
        err => {
          console.log(err);
        }
      );
    }
    else {
      let alert = {
        type: 'error',
        title: 'Required Fields not filled',
        body: 'Please fill all the required fields on other details'
      }
      this.appC.popToast(alert);

    }
  }


  customComponentValid(): boolean {

    function isValid(el) {
      if (el.is_required == "Y" && el.value != '') {
        return true;
      }
      else if (el.is_required == "N") {
        return true;
      }
      else {
        return false;
      }
    }

    return this.customComponents.every(isValid)


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




  getSlots() {
    return this.studentPrefillService.fetchSlots().subscribe(
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
    return this.studentPrefillService.fetchLangStudentStatus().subscribe(
      res => {
        this.langStatus = res;
      },
      err => { }
    )
  }




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





  updateSlotSelected(data) {
    /* slot checked */
    if (data.status) {
      this.slotIdArr.push(data.value.slot_id);
      this.selectedSlots.push(data.value.slot_name);
      if (this.selectedSlots.length != 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      this.selectedSlotsID = this.slotIdArr.join(',')
      this.selectedSlotsString = this.selectedSlots.join(',');
    }
    /* slot unchecked */
    else {
      if (this.selectedSlots.length != 0) {
        document.getElementById('slotwrapper').classList.add('has-value');
      }
      else if (this.selectedSlots.length == 0) {
        document.getElementById('slotwrapper').classList.remove('has-value');
      }
      var index = this.selectedSlots.indexOf(data.value.slot_name);
      if (index > -1) {
        this.selectedSlots.splice(index, 1);
      }
      this.selectedSlotsString = this.selectedSlots.join(',');

      var index2 = this.slotIdArr.indexOf(data.value.slot_id);
      if (index2 > -1) {
        this.slotIdArr.splice(index, 1);
      }
      this.selectedSlotsID = this.slotIdArr.join(',');
    }

  }



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


  fetchCourseFromMaster(id) {

    if (id == null || id == '') {
      this.courseList = [];
    }
    else {
      this.studentPrefillService.fetchCourseList(id).subscribe(
        res => {
          this.courseList = res;
        }
      )
    }

  }



  uploadHandler() {
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();
    let preview = document.getElementById('preview-img');

    reader.addEventListener("load", function () {
      preview.src = reader.result;
    }, false);
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        localStorage.setItem('tempImg', reader.result.split(',')[1]);
      }
    }
  }







  isDuplicateContactOpen() {
    this.isDuplicateStudent = true;
  }



  isDuplicateContactClose() {
    this.isDuplicateStudent = false;
  }



  registerDuplicateStudent(form: NgForm) {
    this.postService.quickAddStudent(this.studentEditFormData).subscribe(
      res => {
        let statusCode = res.statusCode;
        if (statusCode == 200) {
          let alert = {
            type: 'success',
            title: 'Student Details Submitted Successfully',
            body: ''
          }
          this.appC.popToast(alert);
          localStorage.removeItem('tempImg');
          form.reset();
          this.clearFormAndMove();
        }
        else {
          let alert = {
            type: 'error',
            title: 'Failed To Add Student',
            body: ''
          }
          this.appC.popToast(alert);
          this.isDuplicateContactClose();
        }
      },
      err => {
        console.log(err);
      }
    );

  }


  clearFormAndMove() {
    this.navigateTo('studentForm');
    this.studentEditFormData = {
      student_name: "",
      student_sex: "",
      student_email: "",
      student_phone: "",
      student_curr_addr: "",
      dob: "",
      doj: moment().format('YYYY-MM-DD'), // "2017-10-25",
      school_name: "-1", // "943",
      student_class: "-1", // "1269",
      parent_name: "",
      parent_email: "",
      parent_phone: "",
      guardian_name: "",
      guardian_email: "",
      guardian_phone: "",
      is_active: "Y", // "Y",
      institution_id: sessionStorage.getItem('institute_id'), // "100123",
      assignedBatches: [], // ["5660", "2447", "4163", "3067"],
      fee_type: 0,
      fee_due_day: 0,
      batchJoiningDates: [], // ["2017-10-25", "2017-10-25", "2017-10-25", "2017-10-25"],
      comments: "",
      photo: null,
      student_disp_id: "",
      student_manual_username: null,
      social_medium: -1,
      attendance_device_id: "",
      religion: "",
      standard_id: "-1",
      subject_id: "-1",
      slot_id: null,
      language_inst_status: null,
      stuCustomLi: []
    }
    this.removeImage = true;
    this.fetchPrefillFormData();
  }



  clearFormAndRoute(form: NgForm) {
    let previousUrl: string = '';
    this.studentEditFormData = {
      student_name: "",
      student_sex: "",
      student_email: "",
      student_phone: "",
      student_curr_addr: "",
      dob: "",
      doj: moment().format('YYYY-MM-DD'),
      school_name: "-1",
      student_class: "-1",
      parent_name: "",
      parent_email: "",
      parent_phone: "",
      guardian_name: "",
      guardian_email: "",
      guardian_phone: "",
      is_active: "Y",
      institution_id: sessionStorage.getItem('institute_id'),
      assignedBatches: [],
      fee_type: 0,
      fee_due_day: 0,
      batchJoiningDates: [],
      comments: "",
      photo: null,
      student_disp_id: "",
      student_manual_username: null,
      social_medium: -1,
      attendance_device_id: "",
      religion: "",
      standard_id: "-1",
      subject_id: "-1",
      slot_id: null,
      language_inst_status: null,
      stuCustomLi: []
    };
    form.reset();
    this.removeImage = true;
    this.router.navigate(['/student']);
  }



  clearDateoJoining() {
    this.studentEditFormData.doj = ''
  }


}
