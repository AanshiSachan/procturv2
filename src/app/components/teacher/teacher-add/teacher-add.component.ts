import { Component, OnInit} from '@angular/core';
import {FormGroup, Validators , FormBuilder} from '@angular/forms';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';


@Component({
  selector: 'app-teacher-add',
  templateUrl: './teacher-add.component.html',
  styleUrls: ['./teacher-add.component.scss']
})
export class TeacherAddComponent implements OnInit {

  addTeacherForm: FormGroup; 

  constructor(
    private fb : FormBuilder,
    private teacherAPIService : TeacherAPIService
  ) { }

  ngOnInit() {
    this.createAddTeacherForm();
  }


  createAddTeacherForm() {
    this.addTeacherForm = this.fb.group({
      teacher_name : ['',[Validators.required]],
      teacher_curr_addr : [''],
      teacher_phone : ['',[Validators.required , Validators.minLength(10)]],
      teacher_alt_phone : [''],
      teacher_standards : [''],
      teacher_email : [''],
      teacher_subjects : [''],
      hour_rate : [''],
      is_active: [''],
      is_allow_teacher_to_only_mark_attendance : [''],
      is_employee_to_be_create : ['']
    })
  }

  addNewTeacherInfo() {
    debugger
    let formData = this.addTeacherForm.value;
    if(formData.hour_rate == "" || formData.hour_rate == null){
      formData.hour_rate = 0 ;
    }
    if(localStorage.getItem('tempImg') != null || localStorage.getItem('tempImg') != ""){
      formData.photo = localStorage.getItem('tempImg');
    }
    else{
      formData.photo = null;
    }
    console.log(formData);
    // this.teacherAPIService.addNewTeacherDetails(formData).subscribe(
    //   data => {
    //     console.log(data);
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // )
  }

  getUploadedImage() {
    return (localStorage.getItem('tempImg'));
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
