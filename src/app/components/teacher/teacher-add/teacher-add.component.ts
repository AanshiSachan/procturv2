import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-add',
  templateUrl: './teacher-add.component.html',
  styleUrls: ['./teacher-add.component.scss']
})
export class TeacherAddComponent implements OnInit {

  addTeacherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private teacherAPIService: TeacherAPIService,
    private route: Router 
  ) { }

  ngOnInit() {
    this.createAddTeacherForm();
  }


  createAddTeacherForm() {
    this.addTeacherForm = this.fb.group({
      teacher_name: ['', [Validators.required, Validators.maxLength(10)]],
      teacher_curr_addr: [''],
      teacher_phone: ['', [Validators.required, Validators.minLength(10)]],
      teacher_alt_phone: [''],
      teacher_standards: [''],
      teacher_email: [''],
      teacher_subjects: [''],
      hour_rate: [''],
      is_active: [true],
      is_allow_teacher_to_only_mark_attendance: [false],
      is_student_mgmt_flag: [true]
    })
  }

  addNewTeacherInfo() {
    debugger
    let formData = this.addTeacherForm.value;
    if (formData.hour_rate == "" || formData.hour_rate == null) {
      formData.hour_rate = 0;
    }
    if (localStorage.getItem('tempImg') != null || localStorage.getItem('tempImg') != "") {
      formData.photo = localStorage.getItem('tempImg');
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
    formData.attendance_device_id = "";
    formData.is_employee_to_be_create = "N";
    this.teacherAPIService.addNewTeacherDetails(formData).subscribe(
      data => {
        this.route.navigateByUrl('teacher');
      },
      err => {
        console.log(err);
      }
    )
  }

  /* Customiized click detection strategy */
  inputClickedCheck(ev) {
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

}
