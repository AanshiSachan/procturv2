import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.scss']
})
export class TeacherEditComponent implements OnInit {

  selectedTeacherId;
  selectedTeacherInfo;
  hasIdCard: string = 'N';
  editTeacherForm: FormGroup;
  studentImage: string = '';
  containerWidth: any = "200px";
  @ViewChild('idCardUpload') idCardTeacher;
  @ViewChild('uploadedImage') idCardImg;
  @ViewChild('uploadImageAnchor') anchTag;
  enableBiometric: any = 0;

  constructor(
    private route: Router,
    private ApiService: TeacherAPIService,
    private fb: FormBuilder,
    private toastCtrl: AppComponent
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
    this.enableBiometric = sessionStorage.getItem('biometric_attendance_feature');
  }

  getTeacherInfo() {
    this.ApiService.getSelectedTeacherInfo(this.selectedTeacherId).subscribe(
      (data: any) => {
        this.selectedTeacherInfo = data;
        let setFormData = this.getFormFieldsdata(data);
        this.editTeacherForm.setValue(setFormData);
        this.studentImage = data.photo;
        this.hasIdCard = data.hasIDCard;
      },
      error => {
        console.log(error);
      }
    );
  }

  createEditTeacherForm() {
    this.editTeacherForm = this.fb.group({
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

  getFormFieldsdata(data) {
    let dataToBind: any = {};
    dataToBind.teacher_name = data.teacher_name;
    dataToBind.teacher_curr_addr = data.teacher_curr_addr;
    dataToBind.teacher_phone = data.teacher_phone;
    if (data.teacher_alt_phone == "" || data.teacher_alt_phone == null) {
      dataToBind.teacher_alt_phone = '';
    } else {
      dataToBind.teacher_alt_phone = data.teacher_alt_phone;
    }
    dataToBind.teacher_standards = data.teacher_standards;
    dataToBind.teacher_email = data.teacher_email;
    dataToBind.teacher_subjects = data.teacher_subjects;
    dataToBind.hour_rate = data.hour_rate;
    if (data.hour_rate == 0) {
      dataToBind.hour_rate = '';
    }
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
    dataToBind.attendance_device_id = data.attendance_device_id;
    return dataToBind
  }

  saveTeacherInfo() {
    let formData = this.editTeacherForm.value;
    if (!this.validateCaseSensitiveEmail(formData.teacher_email)) {
      this.messageToast('error', 'Error', 'Please provide valid email address.');
      return;
    }
    if (!(this.validateNumber(formData.teacher_phone))) {
      this.messageToast('error', 'Error', 'Please provide valid phone number.');
      return;
    }
    if (formData.teacher_alt_phone != '' && formData.teacher_alt_phone != null) {
      if (!(this.validateNumber(formData.teacher_alt_phone))) {
        this.messageToast('error', 'Error', 'Please provide valid alternate phone number.');
        return;
      }
    }
    if (formData.hour_rate == "" || formData.hour_rate == null) {
      formData.hour_rate = "0";
    }
    if (this.studentImage != null || this.studentImage != "") {
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

    //this section is to handle id card 

    if (localStorage.getItem('Id-card') != null || localStorage.getItem('Id-card') != undefined) {
      formData.id_file = localStorage.getItem('Id-card');
      formData.id_fileType = localStorage.getItem('imageType');
    } else {
      formData.id_file = null;
      formData.id_fileType = "";
    }

    this.ApiService.saveEditTeacherInformation(this.selectedTeacherInfo.teacher_id, formData).subscribe(
      data => {
        this.messageToast('success', 'Updated', 'Details Updated Successfully.');
        this.route.navigateByUrl('teacher');
      },
      err => {
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  onChangeIdCardUpload() {
    this.hasIdCard = 'Y';
    let fileBrowser = this.idCardTeacher.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      localStorage.setItem('imageType', fileBrowser.files[0].type.split('/')[1]);
      let reader = new FileReader();
      reader.readAsDataURL(fileBrowser.files[0]);
      reader.onload = () => {
        localStorage.setItem('Id-card', reader.result.split(',')[1]);
      }
    }
  }

  downloadIdCard() {
    this.ApiService.downloadDocument(this.selectedTeacherId).subscribe(
      (res: any) => {
        // this.idCardImg.nativeElement.src = 'data:image/png;base64,' + res.document;
        this.anchTag.nativeElement.href = 'data:image/png;base64,' + res.document;
        this.anchTag.nativeElement.download = res.docTitle;
        this.anchTag.nativeElement.click();
      },
      err => {
        this.messageToast('error', 'Error', err.error.message);
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
    if (email != "" && email != null) {
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

  updateIdCard($event) {
    $event.preventDefault();
    this.idCardTeacher.nativeElement.click();
  }

}
