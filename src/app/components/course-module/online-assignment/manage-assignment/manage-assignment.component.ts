import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService  } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
import * as moment from 'moment';
import { document } from 'ngx-bootstrap-custome/utils/facade/browser';
import { DomSanitizer } from '@angular/platform-browser';

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
   tags: "-1",
   marks: false,
   lateSubmission : false,
   masterCourse: '-1',
   course: "-1",
   subject: "-1",
   topic: "-1",
   subtopic: "-1",
   students: "-1",
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
 showMarks: boolean = false;

 // File upload
 urlDetails = {
   name: '',
   url: ''
 }
 upFile: any;
 selectedFiles: any[] = [];

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private auth: AuthenticatorService,
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
        this.batchList = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
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
    this.auth.showLoader();
    const url = `/api/v1/topic_manager/standards/-1/subjects/${this.assignmentDetails.subject}/topics`;
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


  createOnlineAssignment(){

    let obj = {
      institute_id: this.jsonFlag.institute_id,
      category_id: 255,   // set by default // hardcoded // as saved in master table
      course_id: "",
      batch_id: "",
      subject_id: "",
      topic_id: "",
      sub_topic_id: "",
      title: "",
      desc: "",
      start_date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      allow_assignment_late_submission: "",
      evaluation_marks: "",
      evaluation_required: "Y",
      file_id: "",
      teacher_id: "",
      assignment_status: "Unpublish",
      tagId_array: "",
      studentId_array: "",
      url_lists: "",
      attachmentId_array: ""
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

    // fileJson: {
    //   "institute_id":100058,
    //   "category_id":255,
    //   "course_id":526,
    //   "batch_id":-1,
    //   "subject_id":-1,  //send subject id if select subject
    //   "topic_id":-1, //send topic id if select topic
    //   "sub_topic_id":-1, //send sub-topic id if select sub topic
    //   "title":"Assignment test",
    //   "desc":null,
    //   "start_date":"2020-03-02",
    //   "end_date":null,
    //   "start_time":"1:00 PM",
    //   "end_time":null,
    //   "allow_assignment_late_submission":"N",
    //   "evaluation_marks":100,
    //   "file_id":"-1",
    //   "teacher_id":233,
    //   "assignment_status":"Unpublish",
    //   "tagId_array":[1,3,6],
    //   "studentId_array":[13702,15011,15031],
    //   "url_lists":[],
    //   "attachmentId_array":[]
    // }

  }

  uploadFile(){
    var fileTypes = ['jpg', 'jpeg', 'png', 'docs', 'pdf', 'doc', 'svg', 'txt'];  //acceptable file types
    const preview = (<HTMLInputElement>document.getElementById('uploadFileControl')).files[0];
    if (preview != null || preview != undefined) {
      let extension = preview.name.split('.').pop().toLowerCase(),  //file extension from input file
      isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
      if(isSuccess){
        var myReader: FileReader = new FileReader();
        let temp: any = {};
        myReader.readAsDataURL(preview);
        myReader.onloadend = () => {
          temp = {
            "fileName": preview.name,
            "file": myReader.result.split(',')[1],
            "file_extn": extension
          }
          this.selectedFiles.push(temp);
          this.msgService.showErrorMessage('success', '', "File uploaded successfully");
          (<HTMLInputElement>document.getElementById('uploadFileControl')).value = null;
        }
      }
      else{
        this.msgService.showErrorMessage('error', '', "Please check file type.");
      }
    }
    else {
      this.msgService.showErrorMessage('error', '', "No file selected");
    }
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
    let obj = {
      display_name: this.urlDetails.name,
      url: this.urlDetails.url
    }
    this.assignmentDetails.urlLists.push(obj)
    this.urlDetails.name = "";
    this.urlDetails.url = "";
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
    this.assignmentDetails.marks = !this.assignmentDetails.marks;
    this.showMarks = !this.showMarks
    }

}
