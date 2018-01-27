import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.scss']
})
export class TeacherEditComponent implements OnInit {

  selectedTeacherId;
  selectedTeacherInfo;
  editTeacherForm: FormGroup;
  @ViewChild('idCardUpload') idCardTeacher;
  @ViewChild('uploadedImage') uploadImg;

  constructor(
    private route: Router,
    private ApiService: TeacherAPIService,
    private fb: FormBuilder,
  ) {
    if (localStorage.getItem('teacherID')) {
      this.selectedTeacherId = localStorage.getItem('teacherID');
    } else {
      this.route.navigateByUrl('teacher');
    }
  }

  ngOnInit() {
    this.createEditTeacherForm();
    this.getTeacherInfo();
  }

  getTeacherInfo() {
    this.ApiService.getSelectedTeacherInfo(this.selectedTeacherId).subscribe(
      data => {
        console.log(data);
        this.selectedTeacherInfo = data;
        let setFormData = this.getFormFieldsdata(data);
        this.editTeacherForm.setValue(setFormData);
        console.log(this.editTeacherForm.value);
      },
      error => {
        console.log(error);
      }
    );
  }

  createEditTeacherForm() {
    this.editTeacherForm = this.fb.group({
      teacher_name: [null, [Validators.required, Validators.maxLength(10)]],
      teacher_curr_addr: [null],
      teacher_phone: [null, [Validators.required, Validators.minLength(10)]],
      teacher_alt_phone: [''],
      teacher_standards: [null],
      teacher_email: [null],
      teacher_subjects: [null],
      hour_rate: [null],
      is_active: [true],
      is_allow_teacher_to_only_mark_attendance: [false],
      is_student_mgmt_flag: [true]
    })
  }

  getFormFieldsdata(data) {
    let dataToBind: any = {};
    dataToBind.teacher_name = data.teacher_name;
    dataToBind.teacher_curr_addr = data.teacher_curr_addr;
    dataToBind.teacher_phone = data.teacher_phone;
    if (dataToBind.teacher_alt_phone == "" || dataToBind.teacher_alt_phone == null) {
      dataToBind.teacher_alt_phone = '';
    } else {
      dataToBind.teacher_alt_phone = dataToBind.teacher_alt_phone;
    }
    dataToBind.teacher_standards = data.teacher_standards;
    dataToBind.teacher_email = data.teacher_email;
    dataToBind.teacher_subjects = data.teacher_subjects;
    dataToBind.hour_rate = data.hour_rate;
    if (data.is_active == "Y") {
      dataToBind.is_active = true;
    }
    else {
      dataToBind.is_active = false;
    }
    if (data.is_allow_teacher_to_only_mark_attendance == "Y") {
      dataToBind.is_allow_teacher_to_only_mark_attendance = true;
    }
    else {
      dataToBind.is_allow_teacher_to_only_mark_attendance = false;
    }
    if (data.is_student_mgmt_flag == "1") {
      dataToBind.is_student_mgmt_flag = true;
    }
    else {
      dataToBind.is_student_mgmt_flag = false;
    }
    return dataToBind
  }

  saveTeacherInfo() {
    let formData = this.editTeacherForm.value;
    if (formData.hour_rate == "" || formData.hour_rate == null) {
      formData.hour_rate = "0";
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

    //this section is to handle id card 

    if (localStorage.getItem('Id-card') != null || localStorage.getItem('Id-card') != undefined) {
      formData.id_file = localStorage.getItem('Id-card');
      formData.id_fileType = localStorage.getItem('Id-card');
    } else {
      formData.id_file = null;
      formData.id_fileType = "";
    }
    formData.attendance_device_id = "";
    console.log(formData);
    this.ApiService.saveEditTeacherInformation(this.selectedTeacherInfo.teacher_id, formData).subscribe(
      data => {
        this.route.navigateByUrl('teacher');
      },
      err => {
        console.log(err);
      }
    )
  }

  onChangeIdCardUpload() {
    debugger
    let fileBrowser = this.idCardTeacher.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      localStorage.setItem('imageType', fileBrowser.files[0].type.split('/')[1]);
      let reader = new FileReader();
      reader.readAsDataURL(fileBrowser.files[0]);
      reader.onload = () => {
        localStorage.setItem('Id-card', reader.result.split(',')[1])
        this.uploadImg.nativeElement.src = reader.result;
      }
    }
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
