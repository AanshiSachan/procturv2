import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService  } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
declare var $;
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { DomSanitizer } from '@angular/platform-browser';

class fileObj {
  private fileName: string;
  private fileType: string;
  private fileSize: any;

  constructor(fileName: string, fileType: string, fileSize: any) {
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileSize = this.getSizeMB(fileSize);
  }
  public getSizeMB(size: any): string {
    return size + "KB";
  }
  public getSize(): any {
    return this.fileSize;
  }
}

@Component({
  selector: 'app-review-assignment',
  templateUrl: './review-assignment.component.html',
  styleUrls: ['./review-assignment.component.scss']
})
export class ReviewAssignmentComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    showHideColumn: false,
    type: 'course'
  };

  studentList: any[]= [];
  tempStudentList: any[] = [];
  reviewAssignmentId: any;

  isAllSelected: boolean = false;
  selectedRowGroup: any[] = [];
  selectedRow: number;
  rowSelectedCount: number = 0;
  rowSelectedId: any[] = [];

  // file upload
  customFileArr: fileObj[] = [];
  tempFileArray: any;
  tempArr: any[] = [];
  urlDetails = {
    name: '',
    url: ''
  }
  upFile: any;
  selectedFiles: any[] = [];
  fileArray: any[] = [];


  // url upload
  bulkUrlList: any[] = [];
  uploadFiles: any;
  UploadUrlDetails = {
    name: '',
    url: ''
  }
  // status update
  editStatus = {
    evaluation_marks: 0,
    evaluation_required: "",
    file_id: "",
    student_comment: "",
    student_display_id: "",
    student_email: "",
    student_id: "",
    student_marks: "",
    student_name: "",
    student_phone: "",
    student_status: "Open",
    teacher_comment: "",
    teacher_status: "Open"
  };
  editStudentAttachments = {
    urlList: [],
    attachmentList: []
  };
  editTeacherAttachments = {
    urlList: [],
    attachmentList: []
  };
  removedAttchedDocsIds: any[] = []
  facultyAttachments: any[] = [];
  facultyUrlList: any[] = [];

  assignmentDetails: any;

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private cd: ChangeDetectorRef,
  ) {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
          this.jsonFlag.type='batch';
        } else {
          this.jsonFlag.isProfessional = false;
          this.jsonFlag.type='course';
        }
      }
    )
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');

  }

  ngOnInit() {
    let currentURL = window.location.href;
    let splitURL = currentURL.split("/");
    this.reviewAssignmentId = splitURL[splitURL.length - 1];
    this.getStudentsList();
    this.getAssignmentDetails();
  }

  getAssignmentDetails(){
    this.auth.showLoader();
    const url = `/api/v2/onlineAssignment/get/${this.jsonFlag.institute_id}/${this.reviewAssignmentId}`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.assignmentDetails = res.result;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getStudentsList(){

    let obj = {
      "institute_id": this.jsonFlag.institute_id,
    	"file_id": this.reviewAssignmentId,
    	"student_status":null,
    	"teacher_status":null
    }

    this.auth.showLoader();
    const url = `/api/v2/onlineAssignment/getStudentsDetail`;
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.studentList = res.result;
        this.tempStudentList = res.result;
        for(let i; i < this.studentList.length; i++){
          this.studentList[i].uiSelected = false;
        }
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  updateStatus(student){
    this.editStudentAttachments.urlList = [];
    this.editStudentAttachments.attachmentList = [];
    this.editStatus.evaluation_marks = student.evaluation_marks;
    this.editStatus.evaluation_required = student.evaluation_required;
    this.editStatus.file_id = student.file_id;
    this.editStatus.student_comment = student.student_comment;
    this.editStatus.student_display_id = student.student_display_id;
    this.editStatus.student_email = student.student_email;
    this.editStatus.student_id = student.student_id;
    this.editStatus.student_marks = student.student_marks;
    this.editStatus.student_name = student.student_name;
    this.editStatus.student_phone = student.student_phone;
    this.editStatus.student_status = student.student_status;
    this.editStatus.teacher_comment = student.teacher_comment;
    this.editStatus.teacher_status = student.teacher_status;

    this.auth.showLoader();
    const url = `/api/v2/onlineAssignment/studentAttachmentsDetail/${this.jsonFlag.institute_id}/${this.editStatus.student_id}/${this.reviewAssignmentId}`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        $('#updateStudent').modal('show');
        if(res.result.student_attachment && res.result.student_attachment != null){
          for(let i = 0; i < res.result.student_attachment.length; i++){
            if(res.result.student_attachment[i].attachment_name == 'URL'){
              this.editStudentAttachments.urlList.push(res.result.student_attachment[i])
            }
            else{
              this.editStudentAttachments.attachmentList.push(res.result.student_attachment[i])
            }
          }
        }
        if(res.result.teacher_attachment && res.result.teacher_attachment != null){
          for(let i = 0; i < res.result.teacher_attachment.length; i++){
            if(res.result.teacher_attachment[i].attachment_name == 'URL'){
              this.editTeacherAttachments.urlList.push(res.result.teacher_attachment[i])
            }
            else{
              this.editTeacherAttachments.attachmentList.push(res.result.teacher_attachment[i])
            }
          }
        }

      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )

  }

  updateUpdateFile(files){
    const preview = (<HTMLInputElement>document.getElementById('updateUploadFile')).files[0];
    if (preview != null || preview != undefined) {
      setTimeout(() => {
        let manualUploadedFileList = (<HTMLInputElement>document.getElementById('updateUploadFile')).files;
        let filesArr = Array.from(manualUploadedFileList);
        this.facultyAttachments.push(filesArr[0]);
        (<HTMLInputElement>document.getElementById('updateUploadFile')).value = null;
      }, 500)
    }
    else{
      this.msgService.showErrorMessage('error', '', "No file selected");
    }
  }

  removeNewlyAddedFile(fileName){
    for (let index = 0; index < this.facultyAttachments.length; index++) {
      if(this.facultyAttachments[index].name == fileName){
        this.facultyAttachments.splice(index, 1);
        break;
      }
    }
  }

  updateUploadURL(){
    if(this.UploadUrlDetails.name.trim() != ''){
      if(this.UploadUrlDetails.url.trim() != ''){
        if(this.isUrlValid(this.UploadUrlDetails.url.trim())){
          let obj = {
            display_name: this.UploadUrlDetails.name,
            url: this.UploadUrlDetails.url
          }
          this.facultyUrlList.push(obj)
          this.UploadUrlDetails.name = "";
          this.UploadUrlDetails.url = "";
        }
        else{
          this.msgService.showErrorMessage('error', '', "Please enter valid URL");
        }
      }
      else{
        this.msgService.showErrorMessage('error', '', "Please enter URL");
      }
    }
    else{
      this.msgService.showErrorMessage('error', '', "Please enter URL name");
    }
  }

  removeUpdateLink(attachment_display_name){
    for (let index = 0; index < this.editTeacherAttachments.urlList.length; index++) {
      if(this.editTeacherAttachments.urlList[index].attachment_display_name == attachment_display_name){
        this.editTeacherAttachments.urlList.splice(index, 1);
        break;
      }
    }
  }

  removeNewlyAddedLink(display_name){
    for (let index = 0; index < this.facultyUrlList.length; index++) {
      if(this.facultyUrlList[index].display_name == display_name){
        this.facultyUrlList.splice(index, 1);
        break;
      }
    }
  }

  updateStudentStatus(){

    let obj = {
      "file_id": this.reviewAssignmentId,
      "institute_id": this.jsonFlag.institute_id,
      "studentId_array":[this.editStatus.student_id],
      "category_id": "255",
      "url_lists": this.facultyUrlList,
      "attachmentId_array": this.removedAttchedDocsIds,
      "teacher_comment": this.editStatus.teacher_comment,
      "teacher_status": this.editStatus.teacher_status,
      "marks": this.editStatus.evaluation_marks,
    }
    console.log(obj)

    let formData = new FormData();

    formData.append("fileJson", JSON.stringify(obj));

    for(let i = 0; i <  this.facultyAttachments.length; i++){
      formData.append("files", this.facultyAttachments[i]);
    }

    let base = this.auth.getBaseUrl();
    let urlPostXlsDocument = base + "/api/v2/onlineAssignment/updateStudentAssignment";
    let newxhr = new XMLHttpRequest();
    let auths: any = {
      userid: sessionStorage.getItem('userid'),
      userType: sessionStorage.getItem('userType'),
      password: sessionStorage.getItem('password'),
      institution_id: sessionStorage.getItem('institute_id'),
    }

    let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);

    newxhr.open("POST", urlPostXlsDocument, true);
    newxhr.setRequestHeader("Authorization", Authorization);
    newxhr.setRequestHeader("enctype", "multipart/form-data;");
    newxhr.setRequestHeader("Accept", "application/json, text/javascript");
    newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      newxhr.onreadystatechange = () => {
        if (newxhr.readyState == 4) {
          if (newxhr.status >= 200 && newxhr.status < 300) {
            // this.msgService.showErrorMessage('success', '', newxhr.response.message);
            this.msgService.showErrorMessage('success', '', 'Updated successfully');
            $('#updateStudent').modal('hide');

            this.editStatus.evaluation_marks = 0;
            this.editStatus.evaluation_required = "";
            this.editStatus.file_id = "";
            this.editStatus.student_comment = "";
            this.editStatus.student_display_id = "";
            this.editStatus.student_email = "";
            this.editStatus.student_id = "";
            this.editStatus.student_marks = "";
            this.editStatus.student_name = "";
            this.editStatus.student_phone = "";
            this.editStatus.student_status = "Open";
            this.editStatus.teacher_comment = "";
            this.editStatus.teacher_status = "Open";


            this.editStudentAttachments.urlList = [];
            this.editStudentAttachments.attachmentList = [];
            this.editTeacherAttachments.urlList = [];
            this.editTeacherAttachments.attachmentList = [];
            this.removedAttchedDocsIds = []
            this.facultyAttachments = [];
            this.facultyUrlList = [];

            this.getStudentsList();
          }
          else {
            this.msgService.showErrorMessage('error', '', newxhr.response.message);

          }
        }
      }
      newxhr.send(formData);

  }

  removeFacultyAttachment(id){
    for (let index = 0; index < this.editTeacherAttachments.attachmentList.length; index++) {
      if(this.editTeacherAttachments.attachmentList[index].attachment_id == id){
        this.editTeacherAttachments.attachmentList.splice(index, 1);
        this.removedAttchedDocsIds.push(id);
        break;
      }
    }
  }

  bulkUpload(){
    if(this.rowSelectedId.length > 0){
      $('#bulk').modal('show');
    }
    else{
      this.msgService.showErrorMessage("error", '', "No student(s) selected" );
    }
  }

  uploadAttachments(){
    let obj = {
       "file_id": this.reviewAssignmentId,
       "institute_id": this.jsonFlag.institute_id,
       "studentId_array": this.rowSelectedId,
       "category_id": "255",
       "url_lists": this.bulkUrlList,
       "attachmentId_array":[]
    }

    let formData = new FormData();

    formData.append("fileJson", JSON.stringify(obj));

    for(let i = 0; i <  this.selectedFiles.length; i++){
      formData.append("files", this.selectedFiles[i]);
    }

    let base = this.auth.getBaseUrl();
    let urlPostXlsDocument = base + "/api/v2/onlineAssignment/uploadAssignmentSolution";
    let newxhr = new XMLHttpRequest();
    let auths: any = {
      userid: sessionStorage.getItem('userid'),
      userType: sessionStorage.getItem('userType'),
      password: sessionStorage.getItem('password'),
      institution_id: sessionStorage.getItem('institute_id'),
    }

    let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);

    newxhr.open("POST", urlPostXlsDocument, true);
    newxhr.setRequestHeader("Authorization", Authorization);
    newxhr.setRequestHeader("enctype", "multipart/form-data;");
    newxhr.setRequestHeader("Accept", "application/json, text/javascript");
    newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      newxhr.onreadystatechange = () => {
        if (newxhr.readyState == 4) {
          if (newxhr.status >= 200 && newxhr.status < 300) {
            console.log(newxhr.response);
            console.log(newxhr);
            this.msgService.showErrorMessage('success', '', 'Solution uploaded successfully');
            $('#bulk').modal('hide');
          }
          else {
            this.msgService.showErrorMessage('error', '', newxhr.response.message);

          }
        }
      }
      newxhr.send(formData);

  }

  fillFiles(files) {
    const preview = (<HTMLInputElement>document.getElementById('uploadFileControl')).files[0];
    if (preview != null || preview != undefined) {
      setTimeout(() => {
        let manualUploadedFileList = (<HTMLInputElement>document.getElementById('uploadFileControl')).files;
        let filesArr = Array.from(manualUploadedFileList);
        this.selectedFiles.push(filesArr[0]);
        this.customFileArr = this.generateFilePreview(filesArr);
        (<HTMLInputElement>document.getElementById('uploadFileControl')).value = null;
      }, 500)
    }
    else{
      this.msgService.showErrorMessage('error', '', "No file selected");
    }

  }

  getName(file: string): string {
    return file.split(".")[0];
  }

  getType(file: string): string {
    let str = file.substring(file.lastIndexOf(".") + 1, file.length);
    return str;
  }

  generateFilePreview(fileList: any[]): fileObj[] {
    let size = fileList.length;
    let tempArr: fileObj[] = [];
    this.tempArr = tempArr
    let file;
    if (size > 0) {
      for (let i = 0; i < size; i++) {
        file = fileList[i];
        tempArr.push(new fileObj(this.getName(file.name), this.getType(file.name), file.size));
      }
    }
    let obj = {
      fileName: this.tempArr[0].fileName,
      fileType: this.tempArr[0].fileType
    };
    this.fileArray.push(obj);
    return tempArr;
  }

  removeFile(fileName){
    for (let index = 0; index < this.selectedFiles.length; index++) {
      if(this.selectedFiles[index].fileName == fileName){
        this.selectedFiles.splice(index, 1);
        break;
      }
    }
  }

  uploadURL(){
    if(this.urlDetails.name.trim() != ''){
      if(this.urlDetails.url.trim() != ''){
        if(this.isUrlValid(this.urlDetails.url.trim())){
          let obj = {
            display_name: this.urlDetails.name,
            url: this.urlDetails.url
          }
          this.bulkUrlList.push(obj)
          this.urlDetails.name = "";
          this.urlDetails.url = "";
        }
        else{
          this.msgService.showErrorMessage('error', '', "Please enter valid URL");
        }
      }
      else{
        this.msgService.showErrorMessage('error', '', "Please enter URL");
      }
    }
    else{
      this.msgService.showErrorMessage('error', '', "Please enter URL name");
    }
  }

  isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
  }

  removeLink(display_name){
    for (let index = 0; index < this.bulkUrlList.length; index++) {
      if(this.bulkUrlList[index].display_name == display_name){
        this.bulkUrlList.splice(index, 1);
        break;
      }
    }
  }

  selectAllRows(ev) {
    this.cd.reattach();
    this.cd.markForCheck();
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.target.checked) {
        this.studentList.forEach(x => x.uiSelected = ev.target.checked);
        this.rowSelectedCount = this.studentList.length;
        this.getSelectedRows();
    }
    else {
        this.studentList.forEach(x => x.uiSelected = ev.target.checked);
        this.rowSelectedCount = 0;
        this.getSelectedRows();
    }
    this.cd.detectChanges();
    this.cd.detach();
  }

  getSelectedRows() {
    this.rowSelectedId = [];
    this.studentList.forEach(e => {
        if (e.uiSelected) {
            this.rowSelectedId.push(e.student_id);
        }
    });
  }

  isAllChecked(): boolean {
    return this.studentList.every(_ => _.uiSelected);
  }

  removeFromSelectedArr(id): any[] {
    return this.rowSelectedId.filter(e => e != id);
  }

  rowCheckboxChange(eve) {
    this.cd.markForCheck();
    let status = eve.uiSelected;
    /* if the checkbox is already checked uncheck it and perform operation */
    if (status == false) {
        eve.uiSelected = false;
        this.rowSelectedCount--;
        this.rowSelectedId = this.removeFromSelectedArr(eve.student_id);
    }
    else if (status == true) {
        eve.uiSelected = true;
        this.rowSelectedCount++;
        this.rowSelectedId.push(eve.student_id);
    }
    this.isAllChecked();
    this.getSelectedRows();
  }

  // Download files
  downloadFile(object){
    let obj = {
      'institute_id': this.jsonFlag.institute_id,
      'attachmentId_array': [object.attachment_id]
    }
    this.auth.showLoader();
    const url = `/api/v2/onlineAssignment/downloadFile`;
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        var result = res.result;


        var hiddenDownloader = document.getElementById('downloadFile');
        hiddenDownloader.setAttribute('href', result.body)
        hiddenDownloader.setAttribute('target', '_blank');
        hiddenDownloader.click();

        // if (result.data != '' && result.data != null) {
        //     var blob = new Blob([result.data]);
        //     let fileUrl = (window.URL.createObjectURL(blob));
        //     if (fileUrl != null) {
        //       var file = object.attachment_display_name + '.' + object.extension;
        //     }
        // }
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )

  }

}
