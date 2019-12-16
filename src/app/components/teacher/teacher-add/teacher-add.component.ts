import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-teacher-add',
  templateUrl: './teacher-add.component.html',
  styleUrls: ['./teacher-add.component.scss']
})
export class TeacherAddComponent implements OnInit {

  addTeacherForm: FormGroup;
  studentImage: string = '';
  containerWidth: any = "200px"
  enableBiometric: any = 0;

  constructor(
    private fb: FormBuilder,
    private teacherAPIService: TeacherAPIService,
    private route: Router,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.createAddTeacherForm();
    this.enableBiometric = sessionStorage.getItem('biometric_attendance_feature');
  }


  createAddTeacherForm() {
    this.addTeacherForm = this.fb.group({
      teacher_name: ['', [Validators.required]],
      teacher_curr_addr: [''],
      teacher_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      teacher_alt_phone: [''],
      teacher_standards: [''],
      teacher_email: [''],
      teacher_subjects: [''],
      hour_rate: [''],
      attendance_device_id: [''],
      is_active: [true],
      is_allow_teacher_to_only_mark_attendance: [false],
      is_student_mgmt_flag: [true]
    })
  }

  addNewTeacherInfo() {
    let formData = this.addTeacherForm.value;
    if (!this.validateCaseSensitiveEmail(formData.teacher_email)) {
      this.messageToast('error', '', 'Please provide valid email address.');
      return;
    }
    if (!(this.validateNumber(formData.teacher_phone))) {
      this.messageToast('error', '', 'Please provide valid phone number.');
      return;
    }
    if (formData.teacher_alt_phone != '' && formData.teacher_alt_phone != null) {
      if (!(this.validateNumber(formData.teacher_alt_phone))) {
        this.messageToast('error', '', 'Please provide valid alternate phone number.');
        return;
      }
    }
    if (formData.hour_rate == "" || formData.hour_rate == null) {
      formData.hour_rate = 0;
    }
    if (this.studentImage != null && this.studentImage != "") {
      formData.photo = this.studentImage;
    }
    else {
      formData.photo = null;
    }
    if (formData.is_student_mgmt_flag == true) {
      formData.is_student_mgmt_flag = 1;
    } else {
      formData.is_student_mgmt_flag = 0;
    }
    if (formData.is_active == true) {
      formData.is_active = "Y";
    } else {
      formData.is_active = "N";
    }
    if (formData.is_allow_teacher_to_only_mark_attendance == true) {
      formData.is_allow_teacher_to_only_mark_attendance = "Y";
    } else {
      formData.is_allow_teacher_to_only_mark_attendance = "N";
    }
    formData.is_employee_to_be_create = "N";
    this.teacherAPIService.addNewTeacherDetails(formData).subscribe(
      data => {
        this.messageToast('success', 'Added', 'Faculty Added Successfully.');
        this.route.navigateByUrl('/view/teacher');
      },
      err => {
        this.messageToast('error', '', err.error.message);
      }
    )
  }

  messageToast(errorType, errorTitle, errorMeassage) {
    let data = {
      type: errorType,
      title: errorTitle,
      body: errorMeassage
    }
    this.toastCtrl.popToast(data);
  }

  validateCaseSensitiveEmail(email) {
    if (email != '' && email != null) {
      var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (reg.test(email)) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return true;
    }
  }

  validateNumber(inputtxt) {
    let phoneno = /^\d{10}$/;
    if ((inputtxt.match(phoneno))) {
      return true;
    }
    else {
      return false;
    }
  }

  setImage(e) {
    this.studentImage = e;
  }

}
