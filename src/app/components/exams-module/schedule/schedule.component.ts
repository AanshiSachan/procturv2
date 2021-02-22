import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import * as moment from 'moment';
import { CoursePlanner } from '../../course-module/course-planner/course-planner.model';
declare var $;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  editrecord: any = {
    master_course_name: '',
    batch_id: '-1',
    course_id: '-1',
    exam_type_id: '-1',
    date: '',
    time_to: '',
    time_from: '',
    class_room_id: '-1'
  };
  masterCourse: any = [];
  courseList: any = [];
  subjectList: any = [];
  fullResponse: any = [];
  ExamTypeData: any = [];
  classRoomData: any = [];
  filterShow: boolean = false;
  // Duration filter for course planner data
  filterDateInputs = {
    thisWeek: true,
    lastWeek: false,
    thisMonth: false,
    custom: false
  };
  coursePlannerFilters: CoursePlanner = new CoursePlanner();
  coursePlannerData: any = [];  // saved course planner fetched data
  allData: any = [];  // used for pagination purpose

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 20;
  totalCount: number = 0;
  sizeArr: any[] = [20, 50, 100, 150, 200, 500];
  inputElements = {
    standard_id: "-1"
  };
  isEdit: boolean = false;


  constructor(
    private auth: AuthenticatorService,
    private messageService: MessageShowService,
    private _httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getStandard();
  }

  toggleAddSchedule() {
    this.getExamType();
    this.getRooomDetails();
  }

  getRooomDetails() {
    this._httpService.getData('/api/v1/batchClassRoom/all/' + sessionStorage.getItem('institute_id')).subscribe(
      (res: any) => {
        this.classRoomData = res;
      },
      err => {
        console.log(err);
      }
    )
  }


  getStandard() {
    let url = "/api/v1/courseMaster/master-course-list/" + sessionStorage.getItem('institute_id') + '?is_active_not_expire=Y&sorted_by=course_name';

    let keys;
    this.auth.showLoader();
    this._httpService.getData(url).subscribe(
      (data: any) => {
        this.masterCourse = [];
        this.auth.hideLoader();
        this.fullResponse = data.result;
        keys = Object.keys(data.result);

        // console.log("keys", keys);
        // this.masterCourse = keys;
        for (let i = 0; i < keys.length; i++) {
          this.masterCourse.push(keys[i]);
        }


      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }

  updateCourseList(ev) {
    this.courseList = [];
    // this.auth.showLoader();
    let temp = this.fullResponse[this.editrecord.master_course_name];
    for (let i = 0; i < temp.length; i++) {
      this.courseList.push(temp[i]);
    }
  }

  updateSubjectList(event) {
    this.auth.showLoader();
    const url = "/api/v1/courseMaster/fetch/courses/" + sessionStorage.getItem('institute_id') + '/' + event;
    this._httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        //console.log('Subject', res);
        this.subjectList = res.batchesList;
      },
      err => {
        this.messageService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
        //console.log(err);
      }
    )
  }

  getExamType() {
    this._httpService.getData('/api/v1/courseExamSchedule/fetch-exam-type/' + sessionStorage.getItem('institute_id')).subscribe(
      (res: any) => {
        console.log(res);
        this.ExamTypeData = res.result;
      },
      err => {
        console.log(err);
      }
    )
  }

  saveData() {
    if (this.editrecord.master_course_name != '-1' && this.editrecord.master_course_name != '') {
      if (this.editrecord.exam_type_id != '' && this.editrecord.exam_type_id != '-1') {
        if (this.editrecord.course_id != '' && this.editrecord.course_id != '-1') {
          if (this.editrecord.batch_id != '' && this.editrecord.batch_id != '-1') {
            if (this.editrecord.date != '') {
              if (this.editrecord.time_from != '') {
                if (this.editrecord.time_to != '') {
                  let exam_type_data = this.ExamTypeData.filter(id => (this.editrecord.exam_type_id == id.exam_type_id));
                  console.log(exam_type_data);

                  if (exam_type_data && exam_type_data.length) {
                    let exma_Date = moment(exam_type_data[0].date).format('YYYY-MM-DD');
                    let create_date = moment(this.editrecord.date).format('YYYY-MM-DD');
                    if (moment(exma_Date).valueOf() >= moment(create_date).valueOf()) {
                      this.messageService.showErrorMessage('error', '', 'Exam schedule date must be after exam type date');
                    } else {
                      let obj = {
                        "inst_id": sessionStorage.getItem('institute_id'),
                        "course_id": this.editrecord.course_id,
                        "batch_id": this.editrecord.batch_id,
                        "exam_type_id": this.editrecord.exam_type_id,
                        "course_exam_date": moment(this.editrecord.date).format('YYYY-MM-DD'),
                        "exam_start_time": this.editrecord.time_from,
                        "exam_end_time": this.editrecord.time_to,
                        "exam_desc": "", // String
                        "duration": 60,
                        "room_no": this.editrecord.class_room_id  // String
                      }
                      this.isEdit ? this.updateExam(obj) : this.createExam(obj);
                    }
                  }
                } else {
                  this.messageService.showErrorMessage('error', '', 'Please enter Time to')
                }
              } else {
                this.messageService.showErrorMessage('error', '', 'Please enter Time from');
              }
            } else {
              this.messageService.showErrorMessage('error', '', 'Please select Date')
            }
          } else {
            this.messageService.showErrorMessage('error', '', 'Please select Subject')
          }
        } else {
          this.messageService.showErrorMessage('error', '', 'Please select Section')
        }
      } else {
        this.messageService.showErrorMessage('error', '', 'Please select Exam Name')
      }
    } else {
      this.messageService.showErrorMessage('error', '', 'Please select Standard')
    }
  }

  createExam(obj) {
    this._httpService.postData('/api/v1/courseExamSchedule/create-exam', obj).subscribe(
      (res: any) => {
        this.messageService.showErrorMessage('success', '', 'Exam schedule created successfully');
        $('#editCityArea').modal('hide');
      },
      (err: any) => {
        console.log(err);
        this.messageService.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  closePopup() {
    this.editrecord = {
      master_course_name: '',
      batch_id: '-1',
      course_id: '-1',
      exam_type_id: '-1',
      date: '',
      time_to: '',
      time_from: '',
      class_room_id: '-1'
    };
    this.isEdit = false;
  }

  updateExam(obj) {
    this._httpService.putData('/api/v1/courseExamSchedule/update-exam/' + this.editrecord.schedule_id, obj).subscribe(
      (res: any) => {
        this.messageService.showErrorMessage('success', '', 'Exam schedule updated successfully');
        $('#editCityArea').modal('hide');
        this.isEdit = true;
      },
      (err: any) => {
        console.log(err);
        this.messageService.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  toggleFilter() {
    this.filterShow = !this.filterShow;
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  updateFilterDateRange(e) {
    if (this.filterDateInputs.custom) {
      this.coursePlannerFilters.from_date = moment(e[0]).format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment(e[1]).format("YYYY-MM-DD");
    }
    this.getData();
  }

  updateDateFilter(inputDateFilter, e) {

    this.filterDateInputs.thisWeek = false;
    this.filterDateInputs.lastWeek = false;
    this.filterDateInputs.thisMonth = false;
    this.filterDateInputs.custom = false;

    if (inputDateFilter == 'custom') {   //  Custom
      this.openCalendar('customeDate');
      this.filterDateInputs.custom = true;
      e.currentTarget.checked = true;
    }
    else if (inputDateFilter == 'lastWeek') {     // Last week
      this.coursePlannerFilters.from_date = moment().subtract(1, 'weeks').startOf('isoWeek').format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment().subtract(1, 'weeks').endOf('isoWeek').format("YYYY-MM-DD");
      this.filterDateInputs.lastWeek = true;
      e.currentTarget.checked = true;
      this.getData();
    }
    else if (inputDateFilter == 'thisMonth') {     // This month
      this.coursePlannerFilters.from_date = moment().format("YYYY-MM-01");
      this.coursePlannerFilters.to_date = moment().format("YYYY-MM-") + moment().daysInMonth();
      this.filterDateInputs.thisMonth = true;
      e.currentTarget.checked = true;
      this.getData();
    }
    else if (inputDateFilter == 'thisWeek') {   // This Week
      this.coursePlannerFilters.from_date = moment().isoWeekday("Monday").format("YYYY-MM-DD");
      this.coursePlannerFilters.to_date = moment().weekday(7).format("YYYY-MM-DD");
      this.filterDateInputs.thisWeek = true;
      e.currentTarget.checked = true;
      this.getData();
    }

  }

  getData() {
    this.filterShow = false;
    // this.jsonFlag.showHideColumn = false;
    this.auth.showLoader();
    let obj: any = this.coursePlannerFilters;
    obj.institute_id = sessionStorage.getItem('institute_id');
    obj.from_date = moment(obj.from_date).format("YYYY-MM-DD");
    obj.to_date = moment(obj.to_date).format("YYYY-MM-DD");
    obj.isCancelled = "Y";
    obj.isCompleted = "Y";
    obj.isMarksUpdate = "Y";
    obj.isPending = "Y";
    obj.isUpcoming = "Y";
    obj.master_course_name = (obj.master_course_name == '-1') ? '' : obj.master_course_name;
    let url = "/api/v1/coursePlanner/category?type=exam";
    this._httpService.postData(url, obj).subscribe(
      res => {
        console.log(res)
        this.auth.hideLoader();
        this.allData = res;
        if (this.allData.length == 0) {
          this.messageService.showErrorMessage('info', '', "No result found");
        }
        else {
          this.totalCount = this.allData.length;
          this.pageIndex = 1;
          this.fectchTableDataByPage(this.pageIndex);
        }
      },
      err => {
        this.auth.hideLoader();
        this.messageService.showErrorMessage('error', '', err.error.message);
      }
    );
  }


  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.pageIndex--;
    this.fectchTableDataByPage(this.pageIndex);
  }

  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.coursePlannerData = this.getDataFromDataSource(startindex);
    console.log(this.coursePlannerData);
  }

  getDataFromDataSource(startindex) {
    let t = this.allData.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.pageIndex = 1;
    this.displayBatchSize = parseInt(num);
    this.getData();
  }

  EditExam(obj) {
    this.isEdit = true;
    this.toggleAddSchedule();
    $('#editCityArea').modal('show');
    this.editrecord = obj;
    this.editrecord.time_from = obj.start_time;
    this.editrecord.time_to = obj.end_time;
    this.editrecord.class_room_id = (obj.room_no != '') ? obj.room_no : '-1';
    this.updateCourseList(this.editrecord.master_course_name);
    this.updateSubjectList(this.editrecord.course_id);
  }


}
