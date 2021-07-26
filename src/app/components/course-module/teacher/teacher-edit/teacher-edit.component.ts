import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { HttpService } from '../../../../services/http.service';
import { AuthenticatorService, CommonServiceFactory } from '../../../..';
import { AppComponent } from '../../../../app.component';
import { TeacherAPIService } from '../../../../services/teacherService/teacherApi.service';
import { ProductService } from '../../../../services/products.service';
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
  containerWidth: any = "110px";
  containerHeight: any = "110px";
  @ViewChild('idCardUpload', { static: false }) idCardTeacher;
  @ViewChild('uploadedImage', { static: false }) idCardImg;
  @ViewChild('uploadImageAnchor', { static: false }) anchTag;
  enableBiometric: any = 0;
  instituteCountryDetObj: any = {};
  countryDetails: any = [];
  maxlength: number = 10;
  country_id: number = null;
  enable_ip_lock_feature: any = 'N';
  isShoweOnlineExam: boolean = false;
  standardSetting = {};
  subjectSetting = {};
  StandardData: any[] = [];
  subjectData: any[] = [];
  selectedFiles: any[] = [];
  uploadedFileData: any[] = [];
  teacher_user_id: any = 0;
  assigned_standard_subject_list: any[] = [];
  type:any='';

  imgPrefill = 'data:image/png;base64';
  imgFile: any = '';
  constructor(
    private route: Router,
    private ApiService: TeacherAPIService,
    private fb: FormBuilder,
    private toastCtrl: AppComponent,
    private routeParam: ActivatedRoute,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory,
    private httpService: HttpService,
    private productService: ProductService
  ) {
    this.routeParam.params.subscribe(params => {
      this.selectedTeacherId = params['id'];
    });
    console.log(this.selectedTeacherId);
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.type = 'batch';
        } else {
          this.type = 'course';
        }
      }
    )
    let type = Number(sessionStorage.getItem('institute_setup_type'));
    this.setMultiSelectSetting();
    this.fetchStandardAndSubjects();
    this.createEditTeacherForm();
    this.isOnlineExamAllow(type);
    this.fetchDataForCountryDetails();
    this.enable_ip_lock_feature = sessionStorage.getItem('enable_ip_lock_feature');
  }

  setMultiSelectSetting() {
    this.standardSetting = {
      singleSelection: false,
      idField: 'standard_id',
      textField: 'standard_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      enableCheckAll: true
    }
    this.subjectSetting = {
      singleSelection: false,
      idField: 'subject_id',
      textField: 'subject_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      enableCheckAll: true
    }
  }

  fetchStandardAndSubjects() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/standards/standard-subject-list/' + sessionStorage.getItem('institute_id') + '?is_active=Y&is_subject_required=true').subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.StandardData = res.result;
        if (this.selectedTeacherId) {
          this.getTeacherInfo();
          this.enableBiometric = sessionStorage.getItem('biometric_attendance_feature');
        }
      },
      err => {
        this.auth.hideLoader();
        if (this.selectedTeacherId) {
          this.getTeacherInfo();
          this.enableBiometric = sessionStorage.getItem('biometric_attendance_feature');
        }
        console.log(err);
      }
    )
  }

  getUploadedFileData() {
    this.auth.showLoader();
    const url = `/users-file/downloadFile?studentId=${this.teacher_user_id}`;
    this.productService.getUploadFileData(url).subscribe(
      (res: any) => {
        this.uploadedFileData = res;
        this.auth.hideLoader()
      },
      err => {
        this.auth.hideLoader()
      }
    )
  }

  downloadFile(object) {
    const url = object.fileUrl;
    var hiddenDownload = <HTMLAnchorElement>document.getElementById('downloadFileClick');
    hiddenDownload.href = url;
    hiddenDownload.download = object.title;
    // hiddenDownload.download = this.getOriginalFileName(fileObj.res.file_name);
    hiddenDownload.click();
    // this.updateDownloadCount(object);
  }

  deleteExistingUploadedfileAPI(id) {
    if (confirm('Are you sure, you want to delete file?')) {
      this.auth.showLoader();
      const url = `/users-file/delete-file/?studentId=${this.teacher_user_id}&id=${id}`;
      this.productService.deleteFile(url).subscribe(
        (res: any) => {
          this.messageToast("success", '', "File deleted successfully");
          if (res) {
            this.getUploadedFileData();
          }
          this.auth.hideLoader();
        },
        err => {
          this.auth.hideLoader();
        }
      )
    }
  }

  getSubjects(event) {
    this.subjectData = [];
    if (event) {
      this.editTeacherForm.patchValue({
        selectedSubjectList: ''
      })
      let object = event.filter((subject) => {
        let arr = this.StandardData.filter(obj => subject.standard_id == obj.standard_id);
        if (arr.length) {
          arr[0].subject_list.forEach(ele => {
            ele.standard_id = arr[0].standard_id;
            this.subjectData.push(ele);
            // Added by - Nalini Walunj
            // if we change course then selected student list should be clear and if we select same course then already selected students should be seleted
            let temp: any[] = [];
            for (var i = 0; i < this.subjectData.length; i++) {
              for (var j = 0; j < this.assigned_standard_subject_list.length; j++) {
                if (this.subjectData[i].subject_id == this.assigned_standard_subject_list[j].subject_id) {
                  let x = {
                    subject_id: '',
                    subject_name: ''
                  };
                  x.subject_id = this.assigned_standard_subject_list[j].subject_id;
                  x.subject_name = this.assigned_standard_subject_list[j].subject_name
                  temp.push(x)
                }
              }
            }
            this.editTeacherForm.patchValue({
              selectedSubjectList: temp
            })
          })
        }
      });
    }
  }

  // created by: Nalini Walunj
  // Below two functions are written to fetch country details from the session stored at the time of login of institute
  fetchDataForCountryDetails() {
    let countryCodeEncryptedData = sessionStorage.getItem('country_data');
    let temp = JSON.parse(countryCodeEncryptedData);
    if (temp.length > 0) {
      this.countryDetails = temp;
      let defacult_Country = this.countryDetails.filter((country) => {
        return country.is_default == 'Y';
      })      
      this.instituteCountryDetObj = defacult_Country[0];
      this.country_id = defacult_Country[0].id;
      this.maxlength = defacult_Country[0].country_phone_number_length;
      this.editTeacherForm.patchValue({
        country_id: defacult_Country[0].id
      });
    }
  }
  isOnlineExamAllow(type) {
    this.isShoweOnlineExam = this.checkInstSetupType(type, 4);
  }
  checkInstSetupType(value, role): boolean {
    if (value != 0) {
      var start = 2;
      var count = 1;
      while (start != value) {
        count++;
        start = start + 2;
      }
      var arr = [0, 0, 0, 0, 0, 0, 0, 0];
      var s = count.toString(2);
      var k = 0;
      for (var i = s.length - 1; i >= 0; i--) {
        arr[k] = parseInt(s.charAt(i));
        k++;
      }

      switch (role) {
        case 2:
          if (arr[0] == 1)
            return true;
          break;

        case 4:
          if (arr[1] == 1)
            return true;
          break;

        case 8:
          if (arr[2] == 1)
            return true;
          break;

        case 16:
          if (arr[3] == 1)
            return true;
          break;
        case 32:
          if (arr[4] == 1)
            return true;
          break;
        case 64:
          if (arr[5] == 1)
            return true;
          break;

        case 128:
          if (arr[6] == 1)
            return true;
          break;
        case 256:
          if (arr[7] == 1)
            return true;
          break;
        default: return false;
      }
      return false;

    }
    else {
      return false;
    }
  }
  onChangeObj(event) {
    for (let i = 0; i < this.countryDetails.length; i++) {
      if (this.countryDetails[i].id == event) {
        this.instituteCountryDetObj = this.countryDetails[i];
        this.maxlength = this.countryDetails[i].country_phone_number_length;
        this.country_id = this.countryDetails[i].id;
        this.editTeacherForm.patchValue({
          country_id: this.countryDetails[i].id
        });
        return;
      }
    }
  }

  getTeacherInfo() {
    this.auth.showLoader();
    this.ApiService.getSelectedTeacherInfo(this.selectedTeacherId).subscribe(
      (data: any) => {
        console.log("Dar", data);
        this.auth.hideLoader();
        this.selectedTeacherInfo = data;

        let setFormData = this.getFormFieldsdata(data);
        this.editTeacherForm.setValue(setFormData);
        this.studentImage = data.photo;
        this.setServerImg();
        this.hasIdCard = data.hasIDCard;
        this.teacher_user_id = data.user_id;
        this.getUploadedFileData();
      },
      error => {
        this.auth.hideLoader();
        console.log(error);
      }
    );
  }

  setServerImg() {
    if (this.studentImage === '' || this.studentImage === null) {
    }
    else {
      this.imgFile = "";
      const temp: any[] = [];
      temp[0] = this.imgPrefill;
      temp[1] = this.studentImage;
      this.imgFile = temp.join(',');
    }
  }


  createEditTeacherForm() {
    this.editTeacherForm = this.fb.group({
      teacher_name: ['', [Validators.required]],
      teacher_curr_addr: [''],
      country_id: '',
      teacher_phone: ['', [Validators.required]],
      teacher_alt_phone: [''],
      teacher_standards: [''],
      teacher_email: [''],
      teacher_subjects: [''],
      hour_rate: [''],
      attendance_device_id: [''],
      is_active: [true],
      allow_exam_desk_login: [false],
      is_allow_teacher_to_only_mark_attendance: [false],
      is_office_only_access: [false],
      is_student_mgmt_flag: [true],
      dob: [''],
      date_of_joining: [''],
      selectedStandardList: [],
      selectedSubjectList: [],
      title: ''
    })
  }

  uploadHandler() {
    if (this.editTeacherForm.value.title != '') {
      const preview = (<HTMLInputElement>document.getElementById('uploadFileControl')).files[0];
      if (preview != null || preview != undefined) {
        var myReader: FileReader = new FileReader();
        let temp: any = {};
        myReader.readAsDataURL(preview);
        myReader.onloadend = () => {
          temp = {
            "title": this.editTeacherForm.value.title,
            "fileName": preview.name,
            "encodedFile": (<string>myReader.result).split(',')[1]
          }
          this.selectedFiles.push(temp);
          this.messageToast('success', '', "File uploaded successfully");
          this.editTeacherForm.value.title = '';
          this.editTeacherForm.patchValue({
            title: '',
          });
          (<HTMLInputElement>document.getElementById('uploadFileControl')).value = null;
        }
      } else {
        this.messageToast('error', '', "No file selected");
      }
    } else {
      this.messageToast('error', '', "Document title is mandatory");
    }
  }

  deletefile(obj, id) {
    if (confirm('Are you sure, you want to delete file?')) {
      this.selectedFiles.splice(id, 1);
      this.messageToast('success', '', "File deleted successfully");
    }
  }

  getFormFieldsdata(data) {
    let dataToBind: any = {};
    dataToBind.teacher_name = data.teacher_name;
    dataToBind.teacher_curr_addr = data.teacher_curr_addr;
    dataToBind.teacher_phone = (data.teacher_phone.substring(data.teacher_phone.lastIndexOf("-") + 1, data.teacher_phone.length));
    dataToBind.teacher_alt_phone = '';
    if (data.teacher_alt_phone != "" || data.teacher_alt_phone != null) {
      dataToBind.teacher_alt_phone = (data.teacher_alt_phone.substring(data.teacher_alt_phone.lastIndexOf("-") + 1, data.teacher_alt_phone.length));
    }
    dataToBind.teacher_standards = data.teacher_standards;
    dataToBind.teacher_email = data.teacher_email;
    dataToBind.teacher_subjects = data.teacher_subjects;
    dataToBind.hour_rate = data.hour_rate;
    if (data.hour_rate == 0) {
      dataToBind.hour_rate = '';
    }
    dataToBind.is_active = false;
    if (data.is_active == "Y") {
      dataToBind.is_active = true;
    }
    dataToBind.allow_exam_desk_login = false;
    if (data.allow_exam_desk_login == "Y") {
      dataToBind.allow_exam_desk_login = true;
    }
    dataToBind.is_allow_teacher_to_only_mark_attendance = false;
    if (data.is_allow_teacher_to_only_mark_attendance == "Y") {
      dataToBind.is_allow_teacher_to_only_mark_attendance = true;
    }

    dataToBind.is_office_only_access = (data.is_office_only_access == 'Y') ? true : false;
    dataToBind.is_student_mgmt_flag = false;
    if (data.is_student_mgmt_flag == "1") {
      dataToBind.is_student_mgmt_flag = true;
    }
    dataToBind.attendance_device_id = data.attendance_device_id;
    dataToBind.country_id = data.country_id;
    // dataToBind.dob = '1998-2-2';
    // dataToBind.date_of_joining = '1998-2-2'
    dataToBind.date_of_joining = data.date_of_joining;
    dataToBind.dob = data.dob;
    dataToBind.dob = (dataToBind.dob != '' && dataToBind.dob != null) ? moment(data.dob).format("YYYY-MM-DD") : '';
    dataToBind.date_of_joining = (dataToBind.date_of_joining != '' && dataToBind.date_of_joining != null) ? moment(data.date_of_joining).format("YYYY-MM-DD") : '';
    this.country_id = data.country_id;
    let standatd_temp: any[] = [];
    let subject_temp: any[] = [];
    if (data.assigned_standard_subject_list && data.assigned_standard_subject_list.length) {
      data.assigned_standard_subject_list.forEach(element => {
        let x = {
          standard_id: '',
          standard_name: ''
        };
        x.standard_id = element.standard_id;
        x.standard_name = element.standard_name;
        if (element.subject_list && element.subject_list.length) {
          element.subject_list.forEach(sub => {
            let y = {
              subject_id: '',
              subject_name: ''
            };
            y.subject_id = sub.subject_id;
            y.subject_name = sub.subject_name;
            subject_temp.push(y);
          });
        }
        standatd_temp.push(x)
      });
    }
    this.assigned_standard_subject_list = subject_temp;
    this.getSubjects(this.assigned_standard_subject_list);
    dataToBind.selectedSubjectList = subject_temp;
    dataToBind.selectedStandardList = standatd_temp;
    dataToBind.title = '';
    console.log(dataToBind)
    return dataToBind;
  }

  getSelectedStandardAndSub(obj) {
    if (obj.selectedSubjectList && obj.selectedSubjectList.length) {
      obj.selectedSubjectList.forEach(element => {
        this.subjectData.forEach(ele => {
          if (ele.subject_id == element.subject_id) {
            element.standard_id = ele.standard_id;
          }
        })
      });
    }
    let jsontem = {};
    if (obj.selectedStandardList && obj.selectedStandardList.length) {
      obj.selectedStandardList.filter(temp => {
        this.StandardData.forEach(ele => {
          if (temp.standard_id == ele.standard_id) {
            let arr = [];
            if (obj.selectedSubjectList && obj.selectedSubjectList.length) {
              obj.selectedSubjectList.forEach(element => {
                if (element.standard_id == ele.standard_id) {
                  arr.push(element.subject_id);
                }
              });
              jsontem[temp.standard_id] = arr;
              arr = [];
            } else {
              jsontem[temp.standard_id] = [];
            }
          }
        })
      })
    }
    return jsontem;
  }

  addNewTeacherInfo() {
    let formData = this.editTeacherForm.value;
    formData.stadard_subject_id_map = this.getSelectedStandardAndSub(formData);
    if (!this.validateCaseSensitiveEmail(formData.teacher_email)) {
      this.messageToast('error', '', 'Please enter valid email address.');
      return;
    }
    let phoneCheck = this.commonService.phonenumberCheck(formData.teacher_phone, this.maxlength, this.country_id);
    if (phoneCheck == false) {
      this.messageToast('error', '', 'Please enter valid contact number.');
      return;
    }
    if (phoneCheck == 'noNumber') {
      this.messageToast('error', '', 'Please enter valid contact no.');
      return
    }
    if (formData.teacher_alt_phone != '' && formData.teacher_alt_phone != null) {
      if (!(this.commonService.phonenumberCheck(formData.teacher_alt_phone, this.maxlength, this.country_id))) {
        this.messageToast('error', '', 'Please enter valid alternate phone number.');
        return;
      }
    }
    if (formData.teacher_name == "" || formData.teacher_name == null) {
      this.messageToast('error', '', 'Teacher Name is required.');
      return;
    }
    if (formData.hour_rate == "" || formData.hour_rate == null) {
      formData.hour_rate = 0;
    }
    formData.photo = (this.studentImage != null && this.studentImage != "") ? this.studentImage : null;
    formData.is_student_mgmt_flag = (formData.is_student_mgmt_flag == true) ? 1 : 0;
    formData.is_active = (formData.is_active == true) ? "Y" : "N";
    formData.allow_exam_desk_login = (formData.allow_exam_desk_login == true) ? "Y" : "N";
    formData.is_allow_teacher_to_only_mark_attendance = (formData.is_allow_teacher_to_only_mark_attendance == true) ? 'Y' : 'N';

    formData.is_office_only_access = formData.is_office_only_access ? 'Y' : 'N';
    formData.is_employee_to_be_create = "N";
    formData.country_id = this.instituteCountryDetObj.id;
    formData.dob = (formData.dob != null && formData.dob != '') ? moment(formData.dob).format('YYYY-MM-DD') : '';
    formData.date_of_joining = (formData.date_of_joining != null && formData.date_of_joining != '') ? moment(formData.date_of_joining).format('YYYY-MM-DD') : '';
    // formData.is_office_only_access = formData.is_office_only_access ? 'Y' : 'N';
    if (this.selectedFiles.length) {
      formData.teacher_file_upload_list = this.selectedFiles;
    }
    delete formData["selectedSubjectList"];
    delete formData["selectedStandardList"];
    delete formData["title"];
    this.auth.showLoader();
    this.ApiService.addNewTeacherDetails(formData).subscribe(
      data => {
        this.auth.hideLoader();
        this.messageToast('success', '', 'Teacher added successfully.');
        this.route.navigateByUrl('/view/course/teacher');
      },
      err => {
        this.auth.hideLoader();
        this.messageToast('error', '', err.error.message);
      }
    )
  }

  addOrEditFun() {
    if (this.selectedTeacherId == undefined) {
      this.addNewTeacherInfo();
    }
    else {
      this.saveTeacherInfo();
    }
  }

  saveTeacherInfo() {
    let formData = this.editTeacherForm.value;
    formData.stadard_subject_id_map = this.getSelectedStandardAndSub(formData);
    if (!this.validateCaseSensitiveEmail(formData.teacher_email)) {
      this.messageToast('error', '', 'Please enter valid email address.');
      return;
    }
    let phoneCheck = this.commonService.phonenumberCheck(formData.teacher_phone, this.maxlength, this.country_id);
    if (phoneCheck == false) {
      this.messageToast('error', '', 'Please enter valid contact number.');
      return;
    }
    if (phoneCheck == 'noNumber') {
      this.messageToast('error', '', 'Please enter valid contact no.');
      return;
    }
    if (formData.teacher_alt_phone != '' && formData.teacher_alt_phone != null) {
      if (!(this.commonService.phonenumberCheck(formData.teacher_alt_phone, this.maxlength, this.country_id))) {
        this.messageToast('error', '', 'Please enter valid alternate phone number.');
        return;
      }
    }
    if (formData.teacher_name == "" || formData.teacher_name == null) {
      this.messageToast('error', '', 'Teacher Name is required.');
      return;
    }
    if (formData.hour_rate == "" || formData.hour_rate == null) {
      formData.hour_rate = "0";
    }
    formData.photo = (this.studentImage != null || this.studentImage != "") ? this.studentImage : null;
    formData.is_student_mgmt_flag = (formData.is_student_mgmt_flag == true) ? 1 : 0;
    formData.is_active = (formData.is_active == true) ? "Y" : 'N';
    formData.allow_exam_desk_login = (formData.allow_exam_desk_login == true) ? "Y" : "N";
    formData.is_allow_teacher_to_only_mark_attendance = (formData.is_allow_teacher_to_only_mark_attendance == true) ? 'Y' : 'N';

    formData.is_office_only_access = formData.is_office_only_access ? 'Y' : 'N';

    //this section is to handle id card

    if (sessionStorage.getItem('Id-card') != null || sessionStorage.getItem('Id-card') != undefined) {
      formData.id_file = sessionStorage.getItem('Id-card');
      formData.id_fileType = sessionStorage.getItem('imageType');
    } else {
      formData.id_file = null;
      formData.id_fileType = "";
    }
    formData.dob = moment(formData.dob).format('YYYY-MM-DD');
    formData.date_of_joining = moment(formData.date_of_joining).format('YYYY-MM-DD');
    if (this.selectedFiles.length) {
      formData.teacher_file_upload_list = this.selectedFiles;
    }
    formData.isDeleted = (Object.keys(formData.stadard_subject_id_map).length == 0) ? 'Y' : 'N';
    delete formData["selectedSubjectList"];
    delete formData["selectedStandardList"];
    delete formData["title"];
    this.auth.showLoader();
    this.ApiService.saveEditTeacherInformation(this.selectedTeacherInfo.teacher_id, formData).subscribe(
      data => {
        this.auth.hideLoader();
        this.messageToast('success', '', 'Details updated successfully.');
        if (sessionStorage.getItem('userType') == '3') {
          this.route.navigateByUrl('/view/dashboard/admin');
        } else {
          this.route.navigateByUrl('/view/course/teacher');
        }
      },
      err => {
        this.auth.hideLoader();
        this.messageToast('error', '', err.error.message);
      }
    );
  }

  onChangeIdCardUpload() {
    this.hasIdCard = 'Y';
    let fileBrowser = this.idCardTeacher.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      sessionStorage.setItem('imageType', fileBrowser.files[0].type.split('/')[1]);
      let reader = new FileReader();
      reader.readAsDataURL(fileBrowser.files[0]);
      reader.onload = () => {
        sessionStorage.setItem('Id-card', (<string>reader.result).split(',')[1]);
      }
    }
  }

  downloadIdCard() {
    this.auth.showLoader();
    this.ApiService.downloadDocument(this.selectedTeacherId).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        // this.idCardImg.nativeElement.src = 'data:image/png;base64,' + res.document;
        this.anchTag.nativeElement.href = 'data:image/png;base64,' + res.document;
        this.anchTag.nativeElement.download = res.docTitle;
        this.anchTag.nativeElement.click();
      },
      err => {
        this.auth.hideLoader();
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

  validateNumber(inputtxt, maxlength) {
    console.log(maxlength);
    console.log(inputtxt);
    if (inputtxt.length == maxlength) {
      return true;
    }
    else {
      return false;
    }
  }

  setImage(e) {
    this.studentImage = e;
    console.log(this.studentImage);
  }

  updateIdCard($event) {
    $event.preventDefault();
    this.idCardTeacher.nativeElement.click();
  }

  getFile() {
    document.getElementById("upfile").click();
  }

  // uploadHandler(ev) {
  //   console.log(ev);
  //   const file = ev[0];
  //   const fileData = this.readFile(file);
  // }


  readFile(file: any): any {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file[0]);
      reader.onloadend = () => {
        this.setImage((<string>reader.result).split(',')[1]);
        return (<string>reader.result).split(',')[1];
      };
    }
  }

}
