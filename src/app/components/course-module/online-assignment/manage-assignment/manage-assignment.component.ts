import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService  } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
import * as moment from 'moment';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
  selector: 'app-manage-assignment',
  templateUrl: './manage-assignment.component.html',
  styleUrls: ['./manage-assignment.component.scss']
})
export class ManageAssignmentComponent implements OnInit {

  jsonFlag = {
   isProfessional: false,
   institute_id: '',
   showHideColumn: false,
   type: 'course'
 };

 studentListSettings = {};
 tagsListSettings = {};
 selectedStudentList: any[] = [];
 selectedTagsList: any[] = [];
 assignment_status: string = "Publish";

 tagList: any[] = [];
 masterCourseList: any[] = [];
 courseList: any[] = [];
 subjectList: any[] = [];

 batchList: any[] = [];
 facultyList: any[] = [];
 courseModelList: any[] = [];
 batchModelList: any[] = [];
 studentsList: any[] = [];
 topicList: any[] = [];
 subTopicList: any[] = [];

 hour = ['01 AM', '02 AM', '03 AM', '04 AM', '05 AM', '06 AM', '07 AM', '08 AM', '09 AM', '10 AM', '11 AM', '12 PM', '01 PM', '02 PM', '03 PM', '04 PM', '05 PM', '06 PM', '07 PM', '08 PM', '09 PM', '10 PM', '11 PM', '12 AM'];
 minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']

 assignmentDetails = {
   title: "",
   description: "",
   tags: [],
   marks: "1",
   mark: 0,
   lateSubmission : false,
   masterCourse: '-1',
   course: "-1",
   subject: "-1",
   batch: "-1",
   topic: "-1",
   subtopic: "-1",
   students: [],
   teacher: "-1",
   startDate: moment(new Date).format('YYYY-MM-DD'),
   startHr: "",
   startMin: "",
   endDate: moment(new Date).format('YYYY-MM-DD'),
   endHr: "",
   endMin: "",
   urlLists: [],
   attachmentId_array: []
 }


 addAttachment: boolean = false;
 showAttachments: boolean = true;
 showMarks: boolean = true;

 // File upload
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

 // Edit Assignment
 sectionName = '';
 editFileId = '';
 editAssignmentDetails: any;

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private router: Router,
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
    if(this.jsonFlag.isProfessional){
      this.getBatchList();
    }
    else{
      this.getMasterCourse();
    }
    this.getFacultyList();
    this.setMultiSelectSetting();

    let currentURL = window.location.href;
    if(currentURL.includes('create')){
      this.sectionName = 'Add';
    }
    else{
      this.sectionName = 'Edit';
      let splitURL = currentURL.split("/");
      this.editFileId = splitURL[splitURL.length - 1];
      this.getEditAssignmentDetails();
    }
  }

  getEditAssignmentDetails(){
    this.auth.showLoader();
    const url = `/api/v2/onlineAssignment/get/${this.jsonFlag.institute_id}/${this.editFileId}`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.editAssignmentDetails = res.result;
        this.setEditDetails();
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  setEditDetails(){

    this.assignmentDetails.title = this.editAssignmentDetails.title;
    this.assignmentDetails.description = this.editAssignmentDetails.description;
    for(let i = 0; i < this.editAssignmentDetails.tag_list.length; i++){
      this.selectedTagsList.push(this.editAssignmentDetails.tag_lis[i].tagId)
    }
    if(this.editAssignmentDetails.evaluation_required == "N"){
      this.assignmentDetails.marks = "1";
      this.showMarks = true;
    }
    else if(this.editAssignmentDetails.evaluation_required == "Y"){
      this.assignmentDetails.marks = "0";
      this.showMarks = false;
    }

    if(this.editAssignmentDetails.allow_assignment_late_submission == 'Y'){
      this.assignmentDetails.lateSubmission = true;
    }
    else{
      this.assignmentDetails.lateSubmission = false;
    }
    // for(let i = 0; i < .length; i++){
    //
    // }
    //

    this.assignmentDetails.masterCourse = this.editAssignmentDetails;
    this.assignmentDetails.course = this.editAssignmentDetails.course_id;
    this.assignmentDetails.subject = this.editAssignmentDetails.subject_id
    this.assignmentDetails.topic = this.editAssignmentDetails.topic_id;
    this.assignmentDetails.subtopic = this.editAssignmentDetails.sub_topic_id;
    this.assignmentDetails.students = [];
    this.assignmentDetails.teacher = this.editAssignmentDetails.teacher_id;

    this.assignmentDetails.startDate = moment(this.editAssignmentDetails.start_date).format('YYYY-MM-DD');
    this.assignmentDetails.startHr = this.editAssignmentDetails.start_time.split(':')[0];
    this.assignmentDetails.startMin = this.editAssignmentDetails.start_time.split(':')[1];
    this.assignmentDetails.endDate = moment(this.editAssignmentDetails.end_date).format('YYYY-MM-DD');
    this.assignmentDetails.endHr = this.editAssignmentDetails.end_time.split(':')[0];
    this.assignmentDetails.endMin = this.editAssignmentDetails.end_time.split(':')[1];
    this.assignmentDetails.urlLists = [];
    this.assignmentDetails.attachmentId_array = this.editAssignmentDetails.attachment_lists;
  }

  setMultiSelectSetting(){
    this.studentListSettings = {
      singleSelection: false,
      idField: 'student_id',
      textField: 'student_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      enableCheckAll: true
    };
    this.tagsListSettings = {
      singleSelection: false,
      idField: 'tagId',
      textField: 'tagName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      enableCheckAll: true
    };
    this.getTagList();
  }

  getBatchList(){
    this.auth.showLoader();
    const url = `/api/v1/batches/fetchCombinedBatchData/${this.jsonFlag.institute_id}/?standard_id=-1&subject_id=-1&assigned=Y`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.masterCourseList = res.standardLi;
        this.batchList = res.batchLi;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  updateCoursesList(){
      const url = `/api/v1/batches/fetchCombinedBatchData/${this.jsonFlag.institute_id}/?standard_id=${this.assignmentDetails.masterCourse}&subject_id=-1&assigned=Y`;
      this.auth.showLoader();
      this.httpService.getData(url).subscribe(
        res => {
          this.auth.hideLoader();
          let result: any;
          result = res;
          this.courseList = result.subjectLi;
          this.batchList = result.batchLi;
          this.auth.hideLoader();
          this.updateSubjectsList();
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
         }
      );
  }

  updateSubjectsList(){
    this.auth.showLoader();
    const url = `/api/v1/batches/fetchCombinedBatchData/${this.jsonFlag.institute_id}/?standard_id=${this.assignmentDetails.masterCourse}&subject_id=${this.assignmentDetails.course}&assigned=Y`;
    this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      res => {
        this.auth.hideLoader();
        let result: any;
        result = res;
        this.batchList = result.batchLi;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
       }
    );
  }

  getStudentsListForBatch(){
    this.auth.showLoader();
    const url = `/api/v1/studentBatchMap/batches/${this.assignmentDetails.batch}`;
    this.auth.showLoader();
    this.httpService.postData(url, null).subscribe(
      res => {
        this.auth.hideLoader();
        let result: any;
        result = res;
        this.studentsList = result;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
       }
    );
  }

  getMasterCourse(){
    this.auth.showLoader();
    const url = `/api/v1/courseMaster/fetch/${this.jsonFlag.institute_id}/all`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.courseModelList = res;
        this.masterCourseList = this.courseModelList;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getCourses(){
    for (let index = 0; index < this.masterCourseList.length; index++) {
      if(this.masterCourseList[index].master_course == this.assignmentDetails.masterCourse){
        this.courseList = this.masterCourseList[index].coursesList;
      }
    }
  }

  getSubjects(){
    this.getStudentsList();
    for (let index = 0; index < this.courseList.length; index++) {
      if(this.courseList[index].course_id == this.assignmentDetails.course){
        this.subjectList = this.courseList[index].batchesList;
      }
    }
  }

  getTopic(){
    this.getStudentsListForBatch();
    this.auth.showLoader();
    let url = "";
    if(this.jsonFlag.isProfessional){
      for(let i = 0; i < this.batchList.length; i++){
        if(this.batchList[i].batch_id == this.assignmentDetails.batch){
          url = `/api/v1/topic_manager/standards/-1/subjects/${this.batchList[i].subject_id}/topics`;
          break;
        }
      }
    }
    else{
      url = `/api/v1/topic_manager/standards/-1/subjects/${this.assignmentDetails.subject}/topics`;
    }

    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.topicList = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getSubTopic(){
    for (let index = 0; index < this.topicList.length; index++) {
      if(this.topicList[index].topicId == this.assignmentDetails.topic){
        this.subTopicList = this.topicList[index].subTopic;
      }
    }
  }

  getFacultyList(){
    this.auth.showLoader();
    const url = `/api/v1/teachers/all/${this.jsonFlag.institute_id}/?active=Y`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.facultyList = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getTagList(){
    this.auth.showLoader();
    const url = `/api/v2/tag_master/getAll/${this.jsonFlag.institute_id}`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.tagList = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getStudentsList(){
    let obj = {
    	course_id: this.assignmentDetails.course,
      master_course_name: this.assignmentDetails.masterCourse
    }
    this.auth.showLoader();
    const url = `/api/v1/studentBatchMap/manageBatchStudent/${this.jsonFlag.institute_id}`;
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.studentsList = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  saveAsDraft(){
    this.assignment_status = "Unpublish";
    for(let i = 0; i < this.selectedTagsList.length; i++){
      this.assignmentDetails.tags.push(this.selectedTagsList[i].tagId)
    }
    for(let i = 0; i < this.selectedStudentList.length; i++){
      this.assignmentDetails.students.push(this.selectedStudentList[i].student_id)
    }

    if(this.assignmentDetails.title.trim() != '' && this.assignmentDetails.title.trim() != null){
        if(this.assignmentDetails.masterCourse != '-1'){
            let lateSub = 'Y';
            if(!this.assignmentDetails.lateSubmission){
              lateSub = 'N';
            }

            let ev = 'N';
            let marks = 0;
            if(this.assignmentDetails.marks){
              marks = this.assignmentDetails.mark;
              ev = 'Y'
            }
            else{
              marks = 0;
            }

            let obj = {
              institute_id: this.jsonFlag.institute_id,
              category_id: "255",   // set by default // hardcoded // as saved in master table
              course_id: this.assignmentDetails.course,
              batch_id: "-1",
              subject_id: this.assignmentDetails.subject,
              topic_id: this.assignmentDetails.topic,
              sub_topic_id: this.assignmentDetails.subtopic,
              title: this.assignmentDetails.title,
              desc: this.assignmentDetails.description,
              start_date: this.assignmentDetails.startDate,
              end_date: this.assignmentDetails.endDate,
              start_time: this.assignmentDetails.startHr +":"+ this.assignmentDetails.startMin,
              end_time: this.assignmentDetails.endHr +":"+ this.assignmentDetails.endMin,
              allow_assignment_late_submission: lateSub,
              evaluation_marks: marks,
              evaluation_required: ev,
              file_id: "-1",
              teacher_id: this.assignmentDetails.teacher,
              assignment_status: this.assignment_status,
              tagId_array: this.assignmentDetails.tags,
              studentId_array: this.assignmentDetails.students,
              url_lists: this.assignmentDetails.urlLists,
              attachmentId_array: []
            }
            this.createOnlineAssignment(obj);
        }
        else{
          this.msgService.showErrorMessage('error', '', "Please select master course");
        }

    }
    else{
      this.msgService.showErrorMessage('error', '', "Please enter assignment title");
    }
  }

  saveAssignment(){
    for(let i = 0; i < this.selectedTagsList.length; i++){
      this.assignmentDetails.tags.push(this.selectedTagsList[i].tagId)
    }
    for(let i = 0; i < this.selectedStudentList.length; i++){
      this.assignmentDetails.students.push(this.selectedStudentList[i].student_id)
    }

    if(this.assignmentDetails.title.trim() != '' && this.assignmentDetails.title.trim() != null){
      if(this.assignmentDetails.startHr.trim() != '' && this.assignmentDetails.startMin.trim() != ''){
        if(this.assignmentDetails.masterCourse != '-1'){
          if(this.assignmentDetails.course != '-1'){
            if(this.selectedStudentList.length > 0){
              if(this.assignmentDetails.teacher != '-1'){

                let lateSub = 'Y';
                if(!this.assignmentDetails.lateSubmission){
                  lateSub = 'N';
                }

                let ev = 'N';
                let marks = 0;
                if(this.assignmentDetails.marks){
                  marks = this.assignmentDetails.mark;
                  ev = 'Y'
                }
                else{
                  marks = 0;
                }

                let obj = {
                  institute_id: this.jsonFlag.institute_id,
                  category_id: "255",   // set by default // hardcoded // as saved in master table
                  course_id: this.assignmentDetails.course,
                  batch_id: "-1",
                  subject_id: this.assignmentDetails.subject,
                  topic_id: this.assignmentDetails.topic,
                  sub_topic_id: this.assignmentDetails.subtopic,
                  title: this.assignmentDetails.title,
                  desc: this.assignmentDetails.description,
                  start_date: this.assignmentDetails.startDate,
                  end_date: this.assignmentDetails.endDate,
                  start_time: this.assignmentDetails.startHr +":"+ this.assignmentDetails.startMin,
                  end_time: this.assignmentDetails.endHr +":"+ this.assignmentDetails.endMin,
                  allow_assignment_late_submission: lateSub,
                  evaluation_marks: marks,
                  evaluation_required: ev,
                  file_id: "-1",
                  teacher_id: this.assignmentDetails.teacher,
                  assignment_status: this.assignment_status,
                  tagId_array: this.assignmentDetails.tags,
                  studentId_array: this.assignmentDetails.students,
                  url_lists: this.assignmentDetails.urlLists,
                  attachmentId_array: []
                }

                this.createOnlineAssignment(obj);
              }
              else{
                this.msgService.showErrorMessage('error', '', "Please select faculty");
              }
            }
            else{
              this.msgService.showErrorMessage('error', '', "Please select Student(s)");
            }
          }
          else{
            this.msgService.showErrorMessage('error', '', "Please select course");
          }
        }
        else{
          this.msgService.showErrorMessage('error', '', "Please select master course");
        }
      }
      else{
        this.msgService.showErrorMessage('error', '', "Please select assignment start time hrs & mins");
      }
    }
    else{
      this.msgService.showErrorMessage('error', '', "Please enter assignment title");
    }
  }

  createOnlineAssignment(obj){

    let formData = new FormData();

    formData.append("fileJson", JSON.stringify(obj));

    for(let i = 0; i <  this.selectedFiles.length; i++){
      formData.append("files", this.selectedFiles[i]);
    }

    let base = this.auth.getBaseUrl();
    let urlPostXlsDocument = base + "/api/v2/onlineAssignment/create";
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
            this.msgService.showErrorMessage('success', '', newxhr.response);
             this.router.navigate(['/view/course/online-assignment']);
          }
          else {
            this.msgService.showErrorMessage('error', '', newxhr.response);

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
          this.assignmentDetails.urlLists.push(obj)
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
    for (let index = 0; index < this.assignmentDetails.urlLists.length; index++) {
      if(this.assignmentDetails.urlLists[index].display_name == display_name){
        this.assignmentDetails.urlLists.splice(index, 1);
        break;
      }
    }
  }

  getEventHourFrom(e) {
    // this.assignmentDetails.startMin = "00";
    if (this.assignmentDetails.startHr != "" && this.assignmentDetails.startHr != null && this.assignmentDetails.startMin == "") {
      this.assignmentDetails.startMin = "00";
    }
    else if (this.assignmentDetails.endHr != "" && this.assignmentDetails.endHr != null && this.assignmentDetails.endMin == "") {
      this.assignmentDetails.endMin = "00";
    }
    if (this.assignmentDetails.startHr != "" && this.assignmentDetails.startHr != null && this.assignmentDetails.startMin != "" && this.assignmentDetails.startMin != null
      && this.assignmentDetails.endHr != "" && this.assignmentDetails.endHr != null && this.assignmentDetails.endMin != "" && this.assignmentDetails.endMin != null) {
      // this.getEventHourTo();
    }
  }

  toggleMarks(){
    if(this.assignmentDetails.marks == "0"){
      this.assignmentDetails.marks = "1";
      this.showMarks = true;
    }
    else if(this.assignmentDetails.marks == "1"){
      this.assignmentDetails.marks = "0";
      this.showMarks = false;
    }

  }

}
