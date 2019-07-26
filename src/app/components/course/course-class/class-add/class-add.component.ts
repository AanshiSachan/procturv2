import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LoginService } from '../../../../services/login-services/login.service';
import { ClassScheduleService } from '../../../../services/course-services/class-schedule.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { CheckableSettings } from '@progress/kendo-angular-treeview';
import { of } from 'rxjs/observable/of';
import { TopicListingService } from '../../../../services/course-services/topic-listing.service';
import { Observable } from 'rxjs/Observable';
import { TreeItemLookup } from '@progress/kendo-angular-treeview';


@Component({
  selector: 'app-class-add',
  templateUrl: './class-add.component.html',
  styleUrls: ['./class-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ClassAddComponent implements OnInit {
  public checkedKeys: any[] = [];
  customTable: any = [];
  courseModelStdList: any[] = [];
  courseModelSubList: any[] = [];
  courseModelBatchList: any[] = [];
  subBranch: any[] = [];
  masterCourse: any[] = [];
  teachers: any[] = [];
  instituteSetting: any[] = [];
  courseList: any[] = [];
  subjectListDataSource: any = [];
  fetchedCourseData: any = [];
  teacherListDataSource: any = [];
  customListDataSource: any = [];
  classScheduleArray: any = [];
  selectedDateArray: any = [];
  selctedScheduledClass: any = [];
  weekDaysSelected: any = [];
  weekDays: any = [];
  weekDaysTable: any = [];
  canceLClassTable: any = [];
  extraClassTable: any = [];
  hourArr: any[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  meridianArr: any[] = ["AM", "PM"];
  times: any[] = ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM']
  addClassDetails = {
    batch_id: '',
    subject_id: '',
    subject_name: '',
    start_hour: '12 PM',
    start_minute: '00',
    start_meridian: '',
    end_hour: '1 PM',
    end_minute: '00',
    end_meridian: '',
    teacher_id: '',
    teacher_name: '',
    class_desc: '',
    room_no: '',
    custom_class_type: 'Regular',
    duration: ''
  }

  customRec = {
    start_hour: '',
    start_minute: '',
    start_meridian: '',
    end_hour: '',
    end_minute: '',
    end_meridian: '',
    radioEndDate: {
      radioEndDateSelection: false,
      radioDate: '',
    },
    radioOn: {
      radioONSelection: false,
      radioOnDate: '',
    },
    radioAfter: {
      radioAfterSelection: false,
      occurenceValue: ''
    }
  }
  addDates = {
    selectedDate: '',
    error: '',
  }
  timepicker: any = {
    universalStartTime: {
      hour: '',
      minute: '',
      meridian: ''
    },
    universalEndTime: {
      hour: '',
      minute: '',
      meridian: ''
    },
  }
  fetchMasterCourseModule: any = {
    master_course: "-1",
    requested_date: moment().format("YYYY-MM-DD"),
    inst_id: sessionStorage.getItem('institute_id'),
    course_id: "-1"
  }
  fetchMasterBatchModule: any = {
    standard_id: "-1",
    subject_id: "-1",
    batch_id: '-1',
    inst_id: sessionStorage.getItem('institute_id'),
    assigned: "N"
  }

  custom = {
    date: moment().format("YYYY-MM-DD"),
    start_hour: '12 PM',
    start_minute: '00',
    end_hour: '1 PM',
    end_minute: '00',
    desc: '',
  }
  addExtraClass = {
    date: moment().format("YYYY-MM-DD"),
    start_hour: '12 PM',
    start_minute: '00',
    end_hour: '1 PM',
    end_minute: '00',
    desc: '',
  }

  mainStartTime = {
    hour: '12 PM',
    minute: '00',
  }
  mainEndTime = {
    hour: '1 PM',
    minute: '00',
  }

  cancelRowSelected: any = '';
  courseStartDate: any = '';
  courseEndDate: any = '';
  selectedClassFrequency: any = 'WEEK';
  courseModelBatch: any;
  batchDetails: any;
  messages: any;
  batchFrequency: any = '1';
  showPopUp: boolean = false;
  showPopUpRecurence: boolean = false;
  showPopUpCancellation: boolean = false;
  isProfessional: boolean = false;
  isRippleLoad: boolean = false;
  isClassFormFilled: boolean = false;
  createCustomSchedule: boolean = false;
  showCancelWeeklyBtn: boolean = false;
  showWarningPopup: boolean = false;
  cancelWeeklySchedulePop: boolean = false;
  IsTopicSelectedMode: string = 'add';
  subject_name='';

  weeklyScheduleCan = {
    date: moment().format("YYYY-MM-DD"),
    cancel_note: '',
    is_notified: true
  }

  // Topic listing variables
  selectedSubId: any;
  selectedRow: any;
  topicBox: boolean = true;
  selectAllTopics: boolean = false;
  addLinkStatus: string = '';

  public get checkableSettings(): CheckableSettings {
    return {
      checkChildren: true,
      checkParents: true,
      enabled: true,
      mode: 'multiple',
      checkOnClick: false
    };
  }

  public topicsData: any;
  public children;
  public hasChildren;
  public isExpanded;

  multiClickDisabled: boolean = false;
  coursePlannerStatus: any;

  constructor(
    private router: Router,
    private login: LoginService,
    private classService: ClassScheduleService,
    private topicService: TopicListingService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private cd: ChangeDetectorRef
  ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.messages = this.msgService.object;
    /* Prerequiste loaded */
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    /* fetching prefilled data */
    this.fetchPrefillData();
    if (!this.isProfessional) {
      this.checkForEditMode();
    }
    this.switchActiveView();
    this.checkForCoursePlannerRoute();
  }

  checkForCoursePlannerRoute(){
    this.coursePlannerStatus = sessionStorage.getItem('isFromCoursePlanner')
  }
  public handleChecking(itemLookup: TreeItemLookup): void {
    let subTopic = itemLookup.item.dataItem.subTopic;
    let arrayIndex = this.checkedKeys.indexOf(itemLookup.item.dataItem.topicId);
    if (arrayIndex > -1) {
      // this.checkedKeys.splice(arrayIndex, 1);
      let subTopic = itemLookup.item.dataItem.subTopic;
      subTopic.length ? this.removeNLevelTopic(subTopic) : '';
    } else {
      // this.checkedKeys.push(itemLookup.item.dataItem.topicId);
      if (subTopic.length)
        this.AddNLevelTopic(subTopic);
    }
    this.cd.markForCheck();
  }

  removeNLevelTopic(subTopics) {
    if (subTopics.length == 0) {
      let arrayIndex = this.checkedKeys.indexOf(subTopics.topicId);
      this.checkedKeys.splice(arrayIndex, 1);
      return;
    }
    else {
      subTopics.forEach((object) => {
        let arrayIndex = this.checkedKeys.indexOf(object.topicId);
        if (arrayIndex>-1) {
          this.checkedKeys.splice(arrayIndex, 1);
        }
        if (object.subTopic.length) {
          this.removeNLevelTopic(object.subTopic);
        }
      });
    }
    this.cd.markForCheck();
  }

  AddNLevelTopic(subTopics) {
    if (subTopics.length == 0) {
      this.checkedKeys.push(subTopics.topicId);
      return;
    }
    else {
      subTopics.forEach((object) => {
        let arrayIndex = this.checkedKeys.indexOf(object.topicId);
        if (arrayIndex == -1) {
          this.checkedKeys.push(object.topicId);
        }
        if (object.subTopic.length) {
          this.AddNLevelTopic(object.subTopic);
        }
      });
    }
  }



  checkForEditMode() {
    let str = sessionStorage.getItem('editClass');
    if (str == "" || str == null || str == undefined) {
      return;
    }
    let data = JSON.parse(str);
    if (data == "" || data == null || data == undefined) {
      return false;
    } else {
      this.fetchMasterCourseModule = {
        master_course: data.master_course,
        requested_date: moment(data.id).format("YYYY-MM-DD"),
        inst_id: sessionStorage.getItem('institute_id'),
        course_id: data.course_id
      }
      this.getCustomList();
      this.getTeacherList();
      this.updateCourseList(this.fetchMasterCourseModule.master_course);
      setTimeout(() => {
        this.getAllSubjectListFromServer(this.fetchMasterCourseModule);
      }, 300);
      sessionStorage.setItem('editClass', '');
    }
  }


  fetchPrefillData() {
    this.isRippleLoad = true;
    /* Batch Model */
    if (this.isProfessional) {
      this.classService.getStandardSubjectList(this.fetchMasterBatchModule.standard_id, this.fetchMasterBatchModule.subject_id, this.fetchMasterBatchModule.assigned).subscribe(
        res => {
          this.courseModelBatch = res;
          if (this.fetchMasterBatchModule.standard_id == '-1' && this.fetchMasterBatchModule.subject_id == '-1') {
            this.courseModelStdList = res.standardLi;
            this.courseModelBatchList = res.batchLi;
            this.courseModelSubList = [];
          }
          else if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.subject_id == '-1') {
            this.courseModelBatchList = res.batchLi;
            this.courseModelSubList = res.subjectLi;
          }
          else if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.subject_id != '-1') {
            this.courseModelStdList = res.standardLi;
            this.courseModelBatchList = res.batchLi;
          }
        }
      );

      this.getWeekOfDaysFromServer();

    }/* Course Model */
    else {
      /* Get in class schedule || course planner || Time Table */
      this.classService.getAllSubBranches().subscribe(
        res => {
          this.subBranch = res;
        },
        err => { }
      );
      /* Get in class schedule || course planner || Time Table*/
      this.classService.getAllMasterCourse().subscribe(
        res => {
          this.masterCourse = res;
        },
        err => { }
      );
      /* Get in class schedule || Time Table*/
      this.classService.getAllTeachers().subscribe(
        res => {
          this.teachers = res;
        },
        err => { }
      );
    }


    return this.classService.getInstituteSettings().subscribe(
      res => {
        this.isRippleLoad = false;
        this.instituteSetting = res;
      },
      err => { }
    )

  }


  updateCourseList(ev) {
    this.isRippleLoad = true;
    this.isClassFormFilled = false;
    this.classService.getCourseFromMasterById(ev).subscribe(
      res => {
        if (res.coursesList) {
          this.courseList = res.coursesList;
          this.isRippleLoad = false;
        }
        else {
          this.courseList = [];
          this.isRippleLoad = false;
        }
      },
      err => {
        this.courseList = [];
        this.isRippleLoad = false;
      }
    )
  }


  submitMasterCourse() {
    if (this.fetchMasterCourseModule.master_course == '-1' || this.fetchMasterCourseModule.course_id == '-1' ||
      this.fetchMasterCourseModule.requested_date == '' || this.fetchMasterCourseModule.requested_date == 'Invalid date'
      || this.fetchMasterCourseModule.requested_date == null) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide all mandatory details');

      return;
    }
    else {
      if (moment(this.courseStartDate).format("YYYY-MM-DD") <= moment(this.fetchMasterCourseModule.requested_date).format("YYYY-MM-DD") && moment(this.fetchMasterCourseModule.requested_date).format("YYYY-MM-DD") <= moment(this.courseEndDate).format("YYYY-MM-DD")) {
        this.isClassFormFilled = true;
        this.fetchMasterCourseModule.requested_date = moment(this.fetchMasterCourseModule.requested_date).format("YYYY-MM-DD");
        this.getAllSubjectListFromServer(this.fetchMasterCourseModule);
        this.getCustomList();
        this.getTeacherList();
      } else {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provides date in between course start and end date');
        return;
      }
    }
  }


  updateSubjectList(ev) {
    this.isRippleLoad = true;
    this.isClassFormFilled = false;
    this.fetchMasterBatchModule.subject_id = '-1';
    this.classService.getStandardSubjectList(ev, this.fetchMasterBatchModule.subject_id, this.fetchMasterBatchModule.assigned).subscribe(
      res => {
        this.isRippleLoad = false;
        this.courseModelBatch = res;
        if (ev == '-1') {
          if (this.fetchMasterBatchModule.subject_id == "-1") {
            this.courseModelStdList = res.standardLi;
            this.courseModelBatchList = res.batchLi;
            this.fetchMasterBatchModule.batch_id = "-1";
            this.fetchMasterBatchModule.subject_id = "-1";
            this.courseModelSubList = [];
          }
          else {
            this.courseModelBatchList = res.batchLi;
            this.fetchMasterBatchModule.batch_id = "-1";
            this.fetchMasterBatchModule.subject_id = "-1";
            this.courseModelSubList = [];
          }
        }
        else if (ev != '-1') {
          if (this.fetchMasterBatchModule.subject_id == '-1') {
            this.fetchMasterBatchModule.batch_id = "-1";
            this.fetchMasterBatchModule.subject_id = "-1";
            this.courseModelBatchList = res.batchLi;
            this.courseModelSubList = res.subjectLi;
          }
          else if (this.fetchMasterBatchModule.subject_id != '-1') {
            this.fetchMasterBatchModule.batch_id = "-1";
            this.fetchMasterBatchModule.subject_id = "-1";
            this.courseModelBatchList = res.batchLi;
            this.courseModelSubList = res.subjectLi;
          }
        }
      }
    );
  }


  submitMasterBatch() {
    /* standard selected */
    // this.scheduleSelection('1');
    if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.standard_id != -1 && this.fetchMasterBatchModule.standard_id != undefined) {

      /* subject selected  */
      if (this.fetchMasterBatchModule.subject_id != '-1' && this.fetchMasterBatchModule.subject_id != undefined) {

        /* batch selected */
        /* Success */
        /*  */
        if (this.fetchMasterBatchModule.batch_id != '-1' && this.fetchMasterBatchModule.batch_id != undefined) {
          this.batchDetected(this.fetchMasterBatchModule.batch_id);
        }
        /* batch not selected */
        /* Error */
        /*  */
        else if (this.fetchMasterBatchModule.batch_id == '-1' || this.fetchMasterBatchModule.batch_id == undefined) {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.batchMsg.notSelect, 'Please select valid input');

        }
      }
      /* subject not selected */
      else if (this.fetchMasterBatchModule.subject_id == '-1' || this.fetchMasterBatchModule.subject_id == undefined) {

        this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.batchMsg.inValid, 'Please select valid input');
      }
    }
    /* standard not selected */
    else if (this.fetchMasterBatchModule.standard_id == '-1' || this.fetchMasterBatchModule.standard_id == undefined) {

      /* subject selected  */
      if (this.fetchMasterBatchModule.subject_id != '-1' && this.fetchMasterBatchModule.subject_id != undefined) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.batchMsg.notStandard, 'Please select valid input');
      }
      /* subject not selected  */
      else if (this.fetchMasterBatchModule.subject_id == '-1' || this.fetchMasterBatchModule.subject_id == undefined) {
        /* batch selected */
        /* Success */
        /*  */

        if (this.fetchMasterBatchModule.batch_id != '-1' && this.fetchMasterBatchModule.batch_id != undefined) {
          this.batchDetected(this.fetchMasterBatchModule.batch_id);
        }
        /* batch not selected */
        /* Error */
        /*  */
        else if (this.fetchMasterBatchModule.batch_id == '-1' || this.fetchMasterBatchModule.batch_id == undefined) {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, this.messages.batchMsg.selectAll, 'Please select valid input');
        }
      }
    }
  }


  filterSubjectBatches(ev) {
    this.isRippleLoad = true;
    this.classService.getStandardSubjectList(this.fetchMasterBatchModule.standard_id, ev, this.fetchMasterBatchModule.assigned).subscribe(
      res => {
        this.isRippleLoad = false;
        this.courseModelBatch = res;
        if (this.fetchMasterBatchModule.standard_id == '-1' && this.fetchMasterBatchModule.subject_id == '-1') {

          this.courseModelStdList = res.standardLi;
          this.courseModelBatchList = res.batchLi;
          this.courseModelSubList = [];
        }
        else if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.subject_id == '-1') {

          this.courseModelBatchList = res.batchLi;
          this.courseModelSubList = res.subjectLi;
        }
        else if (this.fetchMasterBatchModule.standard_id != '-1' && this.fetchMasterBatchModule.subject_id != '-1') {

          this.courseModelBatchList = res.batchLi;
        }
        else {
        }
      },
      err => {

      }
    )
  }


  batchUpdated(ev) {
    this.isClassFormFilled = false;
    /* standard not selected */
    if (this.fetchMasterBatchModule.standard_id == '-1' || this.fetchMasterBatchModule.standard_id == undefined || this.fetchMasterBatchModule.standard_id == null) {
      /* subject not selected */
      if (this.fetchMasterBatchModule.subject_id == '-1' || this.fetchMasterBatchModule.subject_id == undefined ||
        this.fetchMasterBatchModule.subject_id == null) {
        /* batch not selected */
        if (this.fetchMasterBatchModule.batch_id == '-1' || this.fetchMasterBatchModule.batch_id == undefined || this.fetchMasterBatchModule.batch_id == null) {

        }/* batch selected */
        else {

        }
      }
    }
    /* standard selected */
    else {
      /* subject not selected */
      if (this.fetchMasterBatchModule.subject_id == '-1' || this.fetchMasterBatchModule.subject_id == undefined || this.fetchMasterBatchModule.subject_id == null) {
        /* batch not selected */
        if (this.fetchMasterBatchModule.batch_id == '-1' || this.fetchMasterBatchModule.batch_id == undefined || this.fetchMasterBatchModule.batch_id == null) {
        }/* batch selected */
        else {
        }
      }
      /* subject selected */
      else {
        /* batch not selected */
        if (this.fetchMasterBatchModule.batch_id == '-1' || this.fetchMasterBatchModule.batch_id == undefined || this.fetchMasterBatchModule.batch_id == null) {
        }/* batch selected */
        else {
        }
      }
    }
  }


  getMasterCourse(): string {
    if (this.isProfessional) {
      /* Only Batch selected */
      if (this.fetchMasterBatchModule.standard_id == '-1' || this.fetchMasterBatchModule.standard_id == undefined) {
        let temp: string;
        this.courseModelBatchList.forEach(e => {
          if (e.batch_id == this.fetchMasterBatchModule.batch_id) {
            temp = e.batch_name;
          }
        })
        return temp;
      }/* Both std subject and batch selected */
      else {
        let temp: string;
        this.courseModelStdList.forEach(e => {
          if (e.standard_id == this.fetchMasterBatchModule.standard_id) {
            temp = e.standard_name;
          }
        })
        return temp;
      }
    }
    else {
      let temp: string;
      this.masterCourse.forEach(e => {
        if (e.master_course == this.fetchMasterCourseModule.master_course) {
          temp = e.master_course;
        }
      });
      return temp;
    }
  }


  getCourseName() {
    if (this.isProfessional) {
      let temp: string = '';
      this.courseModelSubList.forEach(e => { if (e.subject_id == this.fetchMasterBatchModule.subject_id) { temp = e.subject_name } });
      return temp;
    }
    else {
      let temp: string = '';
      this.courseList.forEach(e => { if (e.course_id == this.fetchMasterCourseModule.course_id) { temp = e.course_name } });
      return temp;
    }
  }


  batchDetected(id) {
    this.isRippleLoad = true;
    this.classService.getBatchDetailsById(id).subscribe(
      res => {
        this.isRippleLoad = false;
        this.isClassFormFilled = true;
        this.batchDetails = this.keepCloning(res);
        this.calculateFieldForTables(res);
      },
      err => {
        //console.log(err);
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
      }
    );
  }


  updateClassFrequency(ev) {
    if (ev == "OTHER") {
      this.createCustomSchedule = true;
    } else {
      this.createCustomSchedule = false;
    }
  }


  getAllSubjectListFromServer(data) {
    this.isClassFormFilled = true;
    this.isRippleLoad = true;
    this.fetchMasterCourseModule.requested_date = moment(this.fetchMasterCourseModule.requested_date).format('YYYY-MM-DD');
    this.classService.getAllSubjectlist(this.fetchMasterCourseModule).subscribe(
      res => {
        this.fetchedCourseData = res;
        this.isRippleLoad = false;
        this.subjectListDataSource = this.getSubjectList(res);
        this.classScheduleArray = this.constructJSONForTable(res);
      },
      err => {
        //console.log(err);
        this.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
      }
    )
  }

  constructJSONForTable(data) {
    let courseScheduleList = [];
    let batchesList = [];
    let arr: any = [];
    batchesList = data.coursesList[0].batchesList;
    if (data.coursesList[0].courseClassSchdList != null) {
      courseScheduleList = data.coursesList[0].courseClassSchdList;
      for (let i = 0; i < courseScheduleList.length; i++) {
        for (let j = 0; j < batchesList.length; j++) {
          if (courseScheduleList[i].batch_id == batchesList[j].batch_id) {
            let obj: any = {};
            obj.class_schedule_id = courseScheduleList[i].class_schedule_id;
            obj.custom_class_type = courseScheduleList[i].custom_class_type;
            obj.start_time = courseScheduleList[i].start_time;
            obj.end_time = courseScheduleList[i].end_time;
            obj.duration = courseScheduleList[i].duration;
            obj.subject_name = courseScheduleList[i].subject_name;
            obj.subject_id = courseScheduleList[i].subject_id;
            obj.teacher_id = courseScheduleList[i].alloted_teacher_id;
            obj.batch_id = courseScheduleList[i].batch_id;
            obj.class_desc = courseScheduleList[i].class_desc;
            obj.room_no = courseScheduleList[i].room_no;
            obj.course_id = data.coursesList[0].course_id;
            obj.start_date = moment(data.coursesList[0].start_date).format('YYYY-MM-DD');
            obj.end_date = moment(data.coursesList[0].end_date).format('YYYY-MM-DD');
            obj.is_attendance_marked = courseScheduleList[i].is_attendance_marked;
            obj.topics_covered = courseScheduleList[i].topics_covered;
            arr.push(obj);
          }
        }
      }
    }
    return arr;
  }


  getClassSchedule(data) {
    let obj: any = [];
    if (data.courseClassSchdList != null) {
      obj = data.courseClassSchdList;
    }
    return obj;
  }

  getCustomList() {
    this.isRippleLoad = true;
    this.classService.getCustomClassListFromServer().subscribe(
      res => {
        this.isRippleLoad = false;
        this.customListDataSource = res;
      },
      err => {
        //console.log(err);
        this.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
      }
    )
  }

  getTeacherList() {
    this.isRippleLoad = true;
    this.classService.getAllActiveTeachersList().subscribe(
      res => {
        this.isRippleLoad = false;
        this.teacherListDataSource = res;
      },
      err => {
        //console.log(err);
        this.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
      }
    )
  }


  clearClassScheduleForm() {
    this.addClassDetails = {
      batch_id: '',
      subject_id: '',
      subject_name: '',
      start_hour: '12 PM',
      start_minute: '00',
      start_meridian: '',
      end_hour: '1 PM',
      end_minute: '00',
      end_meridian: '',
      teacher_id: '',
      teacher_name: '',
      class_desc: '',
      room_no: '',
      custom_class_type: 'Regular',
      duration: ''
    }
    this.checkedKeys = [];
    this.selectAllTopics = false;
    // this.topicsData = "";
  }


  onSubjectSelection(event) {
    this.subjectListDataSource.forEach(
      ele => {
        if (ele.subject_id == event) {
          this.addClassDetails.teacher_id = ele.teacher_id;
          return;
        }
      }
    )
  }

  topicListing() {
    if (this.addClassDetails.subject_id == '' || this.addClassDetails.subject_id == null || this.addClassDetails.subject_id == '-1') {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please Select Subject');
      return;
    }
    else {
      if (!this.isRippleLoad) {
        this.isRippleLoad = true;
        this.topicService.getAllTopicsSubTopics(this.addClassDetails.subject_id).subscribe(
          res => {
            let temp: any;
            temp = res;
            if (temp != null && temp.length != 0) {
              this.topicBox = false;
              console.log(res);
              this.isRippleLoad = false;
              this.topicsData = res;

              let subjectName = "";
              this.subjectListDataSource.forEach(
                ele => {
                  if (ele.subject_id == this.addClassDetails.subject_id) {
                    subjectName = ele.subject_name;
                  }
                }
              )
              document.getElementById("topicSubName").innerHTML = subjectName;
              this.children = (dataItem: any) => of(dataItem.subTopic);
              this.hasChildren = (item: any) => item.subTopic && item.subTopic.length > 0;
            }
            else {
              this.isRippleLoad = false;
              this.msgService.showErrorMessage(this.msgService.toastTypes.info, 'Info', "No topics available to Link");
            }

          },
          err => {
            this.isRippleLoad = false;
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
          }
        )
      }
    }
  }

  topicListingForAlreadyLinkedTopics(row, subject_id, preSelectedTopics) {
    this.addLinkStatus = '';
    this.selectedSubId = subject_id;
    this.selectedRow = row;
    this.topicsData = []
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.topicService.getAllTopicsSubTopics(subject_id).subscribe(
        res => {
          let temp: any;
          temp = res;
          if (temp != null && temp.length != 0) {
            this.checkedKeys = [];
            this.topicBox = false;
            console.log(res);
            this.isRippleLoad = false;
            this.topicsData = res;
            let array = this.selectedRow.topics_covered.split("|"); //add selected array data
            array.forEach((value) => {
              if (value != " " || value != "0") {
                this.checkedKeys.push(Number(value));
              }
            })

            this.subject_name = this.selectedRow.subject_name
            this.children = (dataItem: any) => of(dataItem.subTopic);
            this.hasChildren = (item: any) => item.subTopic && item.subTopic.length > 0;
          }
          else {
            this.isRippleLoad = false;
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', "No topics available to Link");
          }

        },
        err => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
        }
      )
    }
  }

  checkAllTopics() {
    if (this.selectAllTopics) {
      this.checkedKeys = [];
      this.topicsData.forEach(
        ele => {
          this.checkedKeys.push(ele.topicId)
        }
      )
      // this.topicsData.forEach(function(entry){
      // console.log(entry.topicName)
      // } );
      //
      // const iterate = (obj) => {
      //     Object.keys(obj).forEach(key => {
      //
      //     console.log(`key: ${key}, value: ${obj[key]}`)
      //
      //     if (typeof obj[key] === 'object') {
      //             iterate(obj[key])
      //         }
      //     })
      // }

    }
    else {
      this.checkedKeys = [];
    }
  }

  saveTopic() {

    if (this.selectedSubId != null && this.selectedSubId != undefined && this.selectedSubId != "") {
      let temp = this.checkedKeys;
      this.selectedRow.topics_covered = temp.join("|");
      let topicsName = [];
      this.checkedKeys.forEach(
        ele => {
          this.topicsData.forEach(
            e => {
              if (ele == e)
                topicsName.push(e.topicName)
            }
          )
        }
      )
      this.checkedKeys = [];
      this.selectedSubId = "";
      this.selectedRow = "";
    } else {
      if (this.checkedKeys.length > 0) {
        this.addLinkStatus = 'linked';
      }
      else {
        this.addLinkStatus = '';
      }
    }
    this.topicBox = true;
  }

  closeAlert() {
    this.checkedKeys = [];
    this.topicBox = true;
    this.selectedSubId = "";
  }


  addClassSchedule() {
    this.addLinkStatus = ''
    let obj: any = {};
    if (this.addClassDetails.subject_id == '' || this.addClassDetails.subject_id == null || this.addClassDetails.subject_id == '-1') {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please Select Subject');
      return;
    } else {
      obj.subject_id = this.addClassDetails.subject_id;
    }
    obj.class_schedule_id = 0;
    if (this.addClassDetails.custom_class_type == "" || this.addClassDetails.custom_class_type == null) {
      obj.custom_class_type = "Regular";
    } else {
      obj.custom_class_type = this.addClassDetails.custom_class_type;
    }

    this.timeChanges(this.addClassDetails.start_hour, "addClassDetails.start_hour");
    this.timeChanges(this.addClassDetails.end_hour, "addClassDetails.end_hour");
    if (this.addClassDetails.start_hour == "" && this.addClassDetails.start_minute == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide correct start time');
      return
    }
    if (this.addClassDetails.end_hour == "" && this.addClassDetails.end_minute == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide correct end time');
      return
    }
    let startTime = moment(this.addClassDetails.start_hour + ':' + this.addClassDetails.start_minute + this.addClassDetails.start_meridian, 'h:mma');
    let endTime = moment(this.addClassDetails.end_hour + ':' + this.addClassDetails.end_minute + this.addClassDetails.end_meridian, 'h:mma');
    if (!(startTime.isBefore(endTime))) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide correct start time and end time');
      this.convertTimeToBindableFormat();
      return
    } else {
      obj.start_time = this.addClassDetails.start_hour + ':' + this.addClassDetails.start_minute + ' ' + this.addClassDetails.start_meridian;
      obj.end_time = this.addClassDetails.end_hour + ':' + this.addClassDetails.end_minute + ' ' + this.addClassDetails.end_meridian;
    }
    startTime = this.convertIntoFullClock(this.addClassDetails.start_hour, this.addClassDetails.start_minute, this.addClassDetails.start_meridian);
    endTime = this.convertIntoFullClock(this.addClassDetails.end_hour, this.addClassDetails.end_minute, this.addClassDetails.end_meridian);
    obj.duration = this.getDifference(startTime, endTime);
    obj.subject_name = this.getValueFromArray(this.subjectListDataSource, 'subject_id', obj.subject_id, 'subject_name');
    if (this.addClassDetails.teacher_id == "" || this.addClassDetails.teacher_id == '-1') {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide correct teacher name');
      this.convertTimeToBindableFormat();
      return
    } else {
      obj.teacher_id = Number(this.addClassDetails.teacher_id);
    }
    obj.batch_id = this.getBatchID(obj.subject_id);
    obj.class_desc = this.addClassDetails.class_desc;
    obj.room_no = this.addClassDetails.room_no;
    let topicsName = [];
    this.checkedKeys.forEach(
      ele => {
        this.topicsData.forEach(
          e => {
            if (ele == e.topicId)
              topicsName.push(e.topicName)
          }
        )
      }
    )
    console.log(topicsName)
    let tempKeys = this.checkedKeys;
    obj.topics_covered = tempKeys.join("|");
    this.classScheduleArray.push(obj);
    this.checkedKeys = [];
    this.clearClassScheduleForm();
  }

  convertTimeToBindableFormat() {
    this.addClassDetails.start_hour = this.addClassDetails.start_hour + ' ' + this.addClassDetails.start_meridian;
    this.addClassDetails.start_meridian = "";
    this.addClassDetails.end_hour = this.addClassDetails.end_hour + ' ' + this.addClassDetails.end_meridian;
    this.addClassDetails.end_meridian = "";
  }

  timeChanges(data, name) {
    let time = data.split(' ');
    if (name == "addClassDetails.start_hour") {
      this.addClassDetails.start_hour = time[0];
      this.addClassDetails.start_meridian = time[1];
    } else if (name == "addClassDetails.end_hour") {
      this.addClassDetails.end_hour = time[0];
      this.addClassDetails.end_meridian = time[1];
    }
  }

  getBatchID(subject_id) {
    for (let i = 0; i < this.subjectListDataSource.length; i++) {
      if (this.subjectListDataSource[i].subject_id == subject_id) {
        return this.subjectListDataSource[i].batch_id;
      }
    }
  }


  convertIntoFullClock(hr, min, meridian) {
    let result: any = '';
    if (meridian == "AM") {
      if (hr == "12") {
        hr = "00";
      }
      result = hr + ':' + min;
    } else {
      if (hr == "12") {
        hr = "12";
      } else {
        hr = Number(hr) + 12;
      }
      result = hr + ':' + min;
    }
    return result;
  }


  getDifference(startTime, endTime) {
    let start = moment.utc(startTime, "HH:mm");
    let end = moment.utc(endTime, "HH:mm");
    if (end.isBefore(start))
      end.add(1, 'day');
    let d: any = moment.duration(end.diff(start));
    return d._milliseconds / 60000;
  }


  getValueFromArray(data, key, compareVal, getKey) {
    let result: any = '';
    for (let i = 0; i < data.length; i++) {
      if (data[i][key] == compareVal) {
        result = data[i][getKey];
      }
    }
    return result;
  }

  onCourseListSelection(event) {
    if (event != '-1') {
      for (let i = 0; i < this.courseList.length; i++) {
        if (this.courseList[i].course_id == event) {
          this.courseStartDate = this.courseList[i].start_date;
          this.courseEndDate = this.courseList[i].end_date;
        }
      }
    } else {
      this.courseStartDate = '';
      this.courseEndDate = '';
    }
  }


  cancelCourseClicked(rowData) {
    this.showPopUpCancellation = true;
    this.cancelRowSelected = rowData;
  }

  cancelCourseSchedule() {
    let dataTosend = this.makeCancelClassJson();
    if (dataTosend == false) {
      return false;
    }
    if (dataTosend != undefined) {
      this.isRippleLoad = true;
      this.classService.cancelClassSchedule(dataTosend).subscribe(
        res => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Success', 'Class Cancelled Successfull');
          this.showPopUpCancellation = false;
          this.getAllSubjectListFromServer(this.fetchMasterCourseModule);
        },
        err => {
          //console.log(err);
          this.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
        }
      )
    }
  }

  makeCancelClassJson() {
    let text = (<HTMLInputElement>document.getElementById('idTexboxReason')).value;
    if (text == "" || text == null || text == undefined) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide cancellation reason');
      return false;
    }
    let chkbxValue: any = (<HTMLInputElement>document.getElementById('idChkbxEnable')).checked;
    if (chkbxValue == true) {
      chkbxValue = "Y";
    } else {
      chkbxValue = "N";
    }
    let obj: any = {};
    obj.batch_id = this.cancelRowSelected.batch_id;
    obj.cancelSchd = [
      {
        cancel_note: text,
        schd_id: this.cancelRowSelected.class_schedule_id,
        is_notified: chkbxValue
      }
    ];
    return obj;
  }


  sendReminder() {
    if (confirm("Are you sure, You want to notify?")) {
      let obj: any = {};
      obj.course_id = this.fetchedCourseData.coursesList[0].course_id;
      obj.requested_date = moment(this.fetchedCourseData.requested_date).format('YYYY-MM-DD');
      this.classService.sendReminderToServer(obj).subscribe(
        res => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Success', 'Reminder Notification sent successfully');
        },
        err => {
          //console.log(err);
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
        }
      )
    };

  }

  saveCourseSchedule() {
    if (this.classScheduleArray.length == 0) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'No Schedule to create/update');
      return;
    }
    let obj = this.makeJsonForCourseSave();
    this.isRippleLoad = true;
    this.classService.saveDataOnServer(obj).subscribe(
      res => {
        this.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Saved', 'Your class added successfully');
        this.getAllSubjectListFromServer(this.fetchMasterCourseModule);
        // this.router.navigate(['/view/course/class']);
      },
      err => {
        this.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
      }
    )

  }

  removeRowFromSchedule(index, row) {
    if (confirm("Are you sure you want to delete?")) {
      this.classScheduleArray.splice(index, 1);
    }
  }


  makeJsonForCourseSave() {
    let obj: any = {};
    obj.master_course = this.getValueFromArray(this.masterCourse, 'master_course', this.fetchMasterCourseModule.master_course, 'master_course');
    obj.requested_date = moment(this.fetchMasterCourseModule.requested_date).format("YYYY-MM-DD");
    obj.course_id = this.fetchMasterCourseModule.course_id;
    obj.coursesList = [];
    let temp: any = {};
    temp.course_id = this.fetchMasterCourseModule.course_id;
    temp.courseClassSchdList = [];
    for (let i = 0; i < this.classScheduleArray.length; i++) {
      let test: any = {};
      test.alloted_teacher_id = this.classScheduleArray[i].teacher_id;
      test.batch_id = this.classScheduleArray[i].batch_id;
      test.class_desc = this.classScheduleArray[i].class_desc;
      test.class_schedule_id = this.classScheduleArray[i].class_schedule_id;
      test.custom_class_type = this.classScheduleArray[i].custom_class_type;
      test.duration = this.classScheduleArray[i].duration;
      test.room_no = this.classScheduleArray[i].room_no;
      test.start_time = this.classScheduleArray[i].start_time;
      test.end_time = this.classScheduleArray[i].end_time;
      test.topics_covered = this.classScheduleArray[i].topics_covered;
      temp.courseClassSchdList.push(test);
    }
    obj.coursesList.push(temp);
    return obj;
  }

  getSubjectList(data) {
    let obj = {};
    for (let i = 0; i < data.coursesList.length; i++) {
      if (data.coursesList[i].course_id == this.fetchMasterCourseModule.course_id) {
        return data.coursesList[i].batchesList;
      }
    }
  }

  weeklyScheduleChange($event, row) {
    this.selctedScheduledClass = row;
    this.selctedScheduledClass.startTime = this.setChangesOnTime(this.selctedScheduledClass.start_time);
    this.selctedScheduledClass.endTime = this.setChangesOnTime(this.selctedScheduledClass.end_time);
    let selectedValue = $event.target.value;
    if (selectedValue == 1) {

    } else if (selectedValue == 2) {
      this.selectedDatesOption();
    } else {
      this.customRecurrence();
    }
  }


  setChangesOnTime(data) {
    let obj: any = {};
    let time = data.split(':');
    obj.hour = time[0] + ' ' + time[1].split(' ')[1];
    obj.minute = time[1].split(' ')[0];
    return obj;
  }

  convertTimeToHourMinMeridian(data) {
    let obj: any = {};
    let time = data.split(':');
    obj.hour = time[0];
    obj.minute = time[1].split(' ')[0];
    obj.meridian = time[1].split(' ')[1];
    return obj;
  }


  selectedDatesOption() {
    this.showPopUp = true;
    this.selectedDateArray = [];
  }

  customRecurrence() {
    this.getWeeklyScheduleData()
    this.showPopUpRecurence = true;
  }

  //////// POPUP /////////////////////////

  getWeeklyScheduleData() {
    this.classService.getWeeklySchedule(this.selctedScheduledClass.batch_id).subscribe(
      (res: any) => {
        if (res.weekSchd && (res.weekSchd.length > 0)) {
          this.selctedScheduledClass.startTime = this.getNewTimeFormatJson(res.weekSchd[0].start_time);
          this.selctedScheduledClass.endTime = this.getNewTimeFormatJson(res.weekSchd[0].end_time);
          res.weekSchd.forEach(element => {
            document.getElementById('idDay-' + element.day_of_week).classList.remove('l-text');
            document.getElementById('idDay-' + element.day_of_week).classList.add('p-text');
          });
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  closePopup() {
    this.showPopUpRecurence = false;
    this.showPopUp = false;
    this.showPopUpCancellation = false;
    if (!this.isProfessional) {
      this.getAllSubjectListFromServer(this.fetchMasterCourseModule);
    }
  }

  onWeekDaysSelection(event) {
    if ((document.getElementById(event.target.id).classList).contains('l-text')) {
      document.getElementById(event.target.id).classList.remove('l-text');
      document.getElementById(event.target.id).classList.add('p-text');
    } else {
      document.getElementById(event.target.id).classList.add('l-text');
      document.getElementById(event.target.id).classList.remove('p-text');
    }
  }

  radioButtonClick($event) {
    this.clearSelection();
    if ($event.target.id == "idCourseEndDate") {
      this.customRec.radioEndDate.radioEndDateSelection = true;
    } else if ($event.target.id == "idOn") {
      this.customRec.radioOn.radioONSelection = true;
    } else {
      this.customRec.radioAfter.radioAfterSelection = true;
    }
  }

  clearSelection() {
    this.customRec.radioEndDate.radioEndDateSelection = false;
    this.customRec.radioEndDate.radioDate = '';
    this.customRec.radioOn.radioONSelection = false;
    this.customRec.radioOn.radioOnDate = '';
    this.customRec.radioAfter.radioAfterSelection = false;
    this.customRec.radioAfter.occurenceValue = '';
  }


  addDateToArray() {
    if (this.addDates.selectedDate != "" && this.addDates.selectedDate != undefined && this.addDates.selectedDate != null) {
      let obj: any = new Object;
      obj.selectedDate = moment(this.addDates.selectedDate).format("YYYY-MM-DD");
      obj.error = '';
      this.selectedDateArray.push(obj);
      this.addDates.selectedDate = '';
      this.addDates.error = '';
    }
  }

  removeDateToArray(index, row) {
    if (confirm("Are you sure you want to delete?")) {
      this.selectedDateArray.splice(index, 1);
    }
  }


  saveCustomRecurrences() {
    this.weekDaysSelected = this.getSelectedDaysOfWeek();
    if (this.weekDaysSelected.length == 0) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide days of week');
      return;
    }
    if (this.selctedScheduledClass.startTime.hour == "" || this.selctedScheduledClass.startTime.minute == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide valid start time');
      return false;
    }
    if (this.selctedScheduledClass.endTime.hour == "" || this.selctedScheduledClass.endTime.minute == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide valid end time');
      return false;
    }
    this.multiClickDisabled = true;
    this.isRippleLoad = true;
    let JsonToSend = this.makeJsonForRecurrence();
    this.classService.saveCustomRecurrenceToServer(JsonToSend).subscribe(
      res => {
        this.showPopUpRecurence = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Saved', 'Saved Successfully');
        this.isRippleLoad = false;
        this.multiClickDisabled = false;
      },
      err => {
        //console.log(err);
        this.isRippleLoad = false;
        this.multiClickDisabled = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
      }
    )

  }

  getSelectedDaysOfWeek() {
    let arr = [];
    let elementArray = document.getElementsByClassName('p-text');
    for (let t = 0; t < elementArray.length; t++) {
      arr.push(elementArray[t].id.split('-')[1].trim());
    }
    return arr;
  }


  saveSelectedDateSchedule() {
    if (!this.validateAllFields()) {
      return;
    };
    let jsonToSend = this.makeJsonOFSelectedDate();
    this.classService.selectedDateScheduleToServer(jsonToSend).subscribe(
      res => {
        this.checkDatesOverLapping(res);
      },
      err => {
        //console.log(err);
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
      }
    )
  }

  checkDatesOverLapping(response) {
    for (let i = 0; i < Object.keys(response.copyClassScheduleDatesMapStatusMsg).length; i++) {
      for (let t = 0; t < this.selectedDateArray.length; t++) {
        let key = Object.keys(response.copyClassScheduleDatesMapStatusMsg)[i];
        if (this.selectedDateArray[t].selectedDate == key) {
          this.selectedDateArray[t].error = response.copyClassScheduleDatesMapStatusMsg[key];
        }
      }
    }
  }

  validateAllFields() {
    if (this.selctedScheduledClass.startTime.hour == "" || this.selctedScheduledClass.startTime.minute == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide valid start time');
      return false;
    }
    if (this.selctedScheduledClass.endTime.hour == "" || this.selctedScheduledClass.endTime.minute == "") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide valid end time');
      return false;
    }
    if (this.selctedScheduledClass.subject_id == "-1" || this.selctedScheduledClass.subject_id == " ") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide subject name');
      return false;
    }
    if (this.selctedScheduledClass.teacher_id == "-1" || this.selctedScheduledClass.teacher_id == " ") {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide teacher name');
      return false;
    }
    return true;
  }

  makeJsonOFSelectedDate() {
    let obj: any = {};
    obj.course_id = Number(this.fetchMasterCourseModule.course_id);
    obj.courseClassSchdList = [];
    let test: any = {};
    test.batch_id = this.selctedScheduledClass.batch_id.toString();
    test.start_time = this.selctedScheduledClass.startTime.hour.split(' ')[0] + ':' + this.selctedScheduledClass.startTime.minute + ' ' + this.selctedScheduledClass.startTime.hour.split(' ')[1];
    test.end_time = this.selctedScheduledClass.endTime.hour.split(' ')[0] + ':' + this.selctedScheduledClass.endTime.minute + ' ' + this.selctedScheduledClass.endTime.hour.split(' ')[1];
    test.class_desc = this.selctedScheduledClass.class_desc;
    test.duration = this.getDifference(test.start_time, test.end_time);
    test.room_no = this.selctedScheduledClass.room_no;
    test.class_schedule_id = 0;
    test.alloted_teacher_id = this.selctedScheduledClass.teacher_id;
    test.custom_class_type = this.selctedScheduledClass.custom_class_type;
    obj.courseClassSchdList.push(test);
    obj.reqDateList = this.getSelectedDatesFromArray();
    return obj;
  }

  getSelectedDatesFromArray() {
    let arr: any = [];
    if (this.selectedDateArray.length != 0) {
      for (let t = 0; t < this.selectedDateArray.length; t++) {
        if (this.selectedDateArray[t].selectedDate != "" && this.selectedDateArray[t].selectedDate != null) {
          arr.push(this.selectedDateArray[t].selectedDate);
        }
      }
    } else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide date');
      return
    }
    return arr;
  }

  makeJsonForRecurrence() {
    let startTime = this.selctedScheduledClass.startTime.hour.split(' ')[0] + ':' + this.selctedScheduledClass.startTime.minute + ' ' + this.selctedScheduledClass.startTime.hour.split(' ')[1];
    let endTime = this.selctedScheduledClass.endTime.hour.split(' ')[0] + ':' + this.selctedScheduledClass.endTime.minute + ' ' + this.selctedScheduledClass.endTime.hour.split(' ')[1];
    let duration = this.getDifference(startTime, endTime);
    let obj: any = {};
    obj.batch_id = this.selctedScheduledClass.batch_id;
    obj.weekSchd = [];
    for (let t = 0; t < this.weekDaysSelected.length; t++) {
      let test: any = {};
      test.day_of_week = Number(this.weekDaysSelected[t]);
      test.start_time = startTime;
      test.end_time = endTime;
      test.duration = duration;
      obj.weekSchd.push(test);
    }
    obj.course_id = this.selctedScheduledClass.course_id;
    obj.start_date = moment(this.selctedScheduledClass.start_date).format("YYYY-MM-DD");
    obj.end_date = moment(this.selctedScheduledClass.end_date).format("YYYY-MM-DD");
    obj.requested_date = moment(this.fetchMasterCourseModule.requested_date).format("YYYY-MM-DD");
    obj.courseClassSchdList = [{
      class_schedule_id: this.selctedScheduledClass.class_schedule_id
    }]
    return obj;
  }

  /* =================================Batch Model=========================================================== */

  getWeekOfDaysFromServer() {
    this.classService.getWeekOfDays().subscribe(
      res => {
        this.weekDays = this.addKeyInData(res);
      },
      err => {
        //console.log(err);
      }
    )
  }

  calculateFieldForTables(data) {
    this.customTable = [];
    this.weekDaysTable = [];
    this.extraClassTable = [];
    this.canceLClassTable = [];
    this.batchFrequency = "1";
    this.scheduleSelection(this.batchFrequency);
    if (data.cancelSchd != null) {
      this.canceLClassTable = data.cancelSchd;
    }
    if (data.extraSchd != null) {
      this.extraClassTable = data.extraSchd;
    }
    if (data.weekSchd != null) {
      if (data.weekSchd.length > 0) {
        this.makeJsonForWeekTable(data.weekSchd);
      } else {
        this.weekDays.forEach(element => {
          element.uiSelected = false;
        });
        this.weekDaysTable = this.weekDays;
      }
    } else {
      this.weekDays.forEach(element => {
        element.uiSelected = false;
      });
      this.weekDaysTable = this.weekDays;
    }
    if (data.otherSchd != null) {
      if (data.otherSchd.length > 0) {
        this.customTable = data.otherSchd;
        this.batchFrequency = "2";
        // this.scheduleSelection(this.batchFrequency);
      }
    }
  }

  scheduleSelection(event) {
    this.batchFrequency = event;
    // this.custom.date = event == '2' ? moment().format("YYYY-MM-DD") : '';
  }


  /// Week Section////

  makeJsonForWeekTable(data) {
    this.showCancelWeeklyBtn = false;
    this.weekDaysTable = this.weekDays;
    for (let i = 0; i < this.weekDaysTable.length; i++) {
      for (let t = 0; t < data.length; t++) {
        if (data[t].day_of_week == this.weekDaysTable[i].data_key) {
          this.showCancelWeeklyBtn = true;
          this.weekDaysTable[i].uiSelected = true;
          this.weekDaysTable[i].day_of_week = data[t].day_of_week;
          this.weekDaysTable[i].data_value = this.weekDays[i].data_value;
          this.weekDaysTable[i].schd_id = data[t].schd_id;
          this.weekDaysTable[i].duration = data[t].duration;
          this.weekDaysTable[i].start_time = this.getNewTimeFormatJson(data[t].start_time);
          this.weekDaysTable[i].end_time = this.getNewTimeFormatJson(data[t].end_time);
        }
      }
    }
  }

  updateWeeklySchedule() {
    if (this.batchDetails.otherSchd != null) {
      if (this.batchDetails.otherSchd.length > 0) {
        this.showWarningPopup = true;
      } else {
        this.createWeeklySchedule();
      }
    } else {
      this.createWeeklySchedule();
    }
  }

  createWeeklySchedule() {
    let data = this.prepareJSONDATA();

    // if (this.custom.date == '') {
    //   data.request_date = moment(this.batchDetails.batch_start_date).format("YYYY-MM-DD");
    // }
    // else {
    //   if (moment(this.custom.date).valueOf() < moment(this.batchDetails.batch_start_date).valueOf()) {
    //     this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'selected date should be greater than or equal to batch start date ' + moment(this.batchDetails.batch_start_date).format("DD-MMM-YYYY"));
    //     return;
    //   } else {
    //     data.request_date = moment(this.custom.date).format("YYYY-MM-DD");
    //   }
    // }

    if (data == false) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please specify at least one day to create a schedule');
      return;
    }
    if (this.batchDetails.weekSchd != null) {
      if (this.batchDetails.weekSchd.length > 0) {
        this.serverCallPUT(data);
      } else {
        this.serverCallPOST(data);
      }
    } else {
      this.serverCallPOST(data);
    }
  }

  prepareJSONDATA() {
    let obj: any = {};
    let seletected = false;
    obj.batch_id = this.batchDetails.batch_id;
    obj.class_freq = "WEEK";
    obj.weekSchd = [];
    for (let i = 0; i < this.weekDaysTable.length; i++) {
      if (this.weekDaysTable[i].uiSelected == true) {
        seletected = true;
        let test: any = {};
        test.day_of_week = this.weekDaysTable[i].data_key;
        let startTime = moment(this.createTimeInFormat(this.weekDaysTable[i].start_time.hour, this.weekDaysTable[i].start_time.minute, 'comp'), 'h:mma');
        let endTime = moment(this.createTimeInFormat(this.weekDaysTable[i].end_time.hour, this.weekDaysTable[i].end_time.minute, 'comp'), 'h:mma');
        if (!(startTime.isBefore(endTime))) {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide correct start time and end time');
          return
        } else {
          test.start_time = this.createTimeInFormat(this.weekDaysTable[i].start_time.hour, this.weekDaysTable[i].start_time.minute, '');
          test.end_time = this.createTimeInFormat(this.weekDaysTable[i].end_time.hour, this.weekDaysTable[i].end_time.minute, '');
        }
        startTime = this.convertToFullTimeFormat(this.weekDaysTable[i].start_time.hour, this.weekDaysTable[i].start_time.minute);
        endTime = this.convertToFullTimeFormat(this.weekDaysTable[i].end_time.hour, this.weekDaysTable[i].end_time.minute);
        test.duration = this.getDifference(startTime, endTime);
        obj.weekSchd.push(test);
      }
    }
    if (seletected == false) {
      return false;
    } else {
      return obj;
    }
  }

  applyButtonClick() {
    let startTime = moment(this.createTimeInFormat(this.mainStartTime.hour, this.mainStartTime.minute, 'comp'), 'h:mma');
    let endTime = moment(this.createTimeInFormat(this.mainEndTime.hour, this.mainEndTime.minute, 'comp'), 'h:mma');
    if (!(startTime.isBefore(endTime))) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide correct start time and end time');
      return
    } else {
      for (let t = 0; t < this.weekDaysTable.length; t++) {
        this.weekDaysTable[t].start_time.hour = this.mainStartTime.hour;
        this.weekDaysTable[t].start_time.minute = this.mainStartTime.minute;
        this.weekDaysTable[t].end_time.hour = this.mainEndTime.hour;
        this.weekDaysTable[t].end_time.minute = this.mainEndTime.minute;
      }
    }
  }

  cancelWeeklyScheduledClass() {
    this.cancelWeeklySchedulePop = true;
  }

  closeWeeklySchedulePopup() {
    this.cancelWeeklySchedulePop = false;
  }

  cancelWeeklySchedule() {
    let notify: any = "";
    if (this.weeklyScheduleCan.is_notified == true) {
      notify = "Y";
    } else {
      notify = "N";
    }
    let obj = {
      batch_id: this.batchDetails.batch_id,
      class_freq: 'WEEK',
      requested_date: '',
      cancelSchd: [{
        cancel_note: this.weeklyScheduleCan.cancel_note,
        class_date: moment(this.weeklyScheduleCan.date).format('YYYY-MM-DD'),
        schd_id: 0,
        is_notified: notify,
      }]
    }

    this.classService.cancelClassSchedule(obj).subscribe(
      res => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Cancelled', 'Class schedule cancelled successfully');
        this.cancelWeeklySchedulePop = false;
        this.updateTableDataAgain();
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
        //console.log(err);
      }
    )
  }

  /// Custom Section////


  addNewCustomClass() {
    let obj: any = {};
    obj.class_date = moment(this.custom.date).format("YYYY-MM-DD");
    if (moment(this.custom.date).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide valid date');
      return
    }
    let startTime = moment(this.createTimeInFormat(this.custom.start_hour, this.custom.start_minute, 'comp'), 'h:mma');
    let endTime = moment(this.createTimeInFormat(this.custom.end_hour, this.custom.end_minute, 'comp'), 'h:mma');
    if (!(startTime.isBefore(endTime))) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide correct start time and end time');
      return
    } else {
      obj.start_time = this.createTimeInFormat(this.custom.start_hour, this.custom.start_minute, '');
      obj.end_time = this.createTimeInFormat(this.custom.end_hour, this.custom.end_minute, '');
    }

    obj.note = this.custom.desc;
    obj.batch_id = this.batchDetails.batch_id;
    obj.schd_id = 0;
    this.customTable.push(obj);
    this.custom = {
      date: moment().format("YYYY-MM-DD"),
      start_hour: '12 PM',
      start_minute: '00',
      end_hour: '1 PM',
      end_minute: '00',
      desc: '',
    }
  }


  deleteFromCustomTable(row, index) {
    if (confirm("Are you sure you want to delete?")) {
      this.customTable.splice(index, 1);
    }
  }

  updateCustomClass() {
    if (this.batchDetails.weekSchd != null) {
      if (this.batchDetails.weekSchd.length > 0) {
        this.showWarningPopup = true;
      } else {
        this.createCustomClasses();
      }
    } else {
      this.createCustomClasses();
    }
  }

  makeJsonForCustomClass() {
    let obj: any = {};
    obj.batch_id = this.batchDetails.batch_id.toString();
    obj.class_freq = "OTHER";
    obj.otherSchd = [];
    if (this.customTable.length > 0) {
      for (let i = 0; i < this.customTable.length; i++) {
        let t: any = {};
        t.class_date = moment(this.customTable[i].class_date).format('YYYY-MM-DD');
        t.start_time = this.customTable[i].start_time;
        t.end_time = this.customTable[i].end_time;
        t.note = this.customTable[i].note;
        t.schd_id = this.customTable[i].schd_id;
        let testStart: any = this.convertTimeToHourMinMeridian(t.start_time);
        let testStart1: any = this.convertTimeToHourMinMeridian(t.end_time);
        let start = this.convertIntoFullClock(testStart.hour, testStart.minute, testStart.meridian);
        let end = this.convertIntoFullClock(testStart1.hour, testStart1.minute, testStart1.meridian);
        t.duration = this.getDifference(start, end);
        obj.otherSchd.push(t);
      }
    }
    return obj;
  }

  createCustomClasses() {
    let obj = this.makeJsonForCustomClass();
    if (this.batchDetails.otherSchd != null) {
      if (this.batchDetails.otherSchd.length > 0) {
        this.serverCallPUT(obj);
      } else {
        this.serverCallPOST(obj);
      }
    } else {
      this.serverCallPOST(obj);
    }
  }

  serverCallPUT(data) {
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.classService.createCustomBatchPUT(data).subscribe(
        res => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Updated', 'Details Updated Successfully');
          this.showWarningPopup = false;
          this.updateTableDataAgain();
        },
        err => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
          //console.log(err);
        }
      )
    }
  }

  serverCallPOST(data) {
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.classService.createWeeklyBatchPost(data).subscribe(
        res => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Updated', 'Details Updated Successfully');
          this.showWarningPopup = false
          this.isRippleLoad = false;
          this.updateTableDataAgain();
        },
        err => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
          //console.log(err);
        }
      )
    }
  }

  notifyOfCustomClass(data, index) {
    if (confirm('Are you sure u want to send Regular(Custom) Class Schedule SMS to the batch?')) {
      this.notifyExtraClassCancel(data, "OTHER");
    }
  }

  cancelClassOfCustomClass(row, index) {
    this.showPopUpCancellation = true;
    this.cancelRowSelected = row;
  }

  ///// Extra Class Section //////////////
  addNewExtraClass() {
    let obj: any = {};
    obj.class_date = moment(this.addExtraClass.date).format("YYYY-MM-DD");
    let startTime = moment(this.createTimeInFormat(this.addExtraClass.start_hour, this.addExtraClass.start_minute, 'comp'), 'h:mma');
    let endTime = moment(this.createTimeInFormat(this.addExtraClass.end_hour, this.addExtraClass.end_minute, 'comp'), 'h:mma');
    if (!(startTime.isBefore(endTime))) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide correct start time and end time');
      return
    } else {
      obj.start_time = this.createTimeInFormat(this.addExtraClass.start_hour, this.addExtraClass.start_minute, '');
      obj.end_time = this.createTimeInFormat(this.addExtraClass.end_hour, this.addExtraClass.end_minute, '');
    }
    obj.note = this.addExtraClass.desc;
    obj.batch_id = this.batchDetails.batch_id;
    obj.schd_id = 0;
    this.extraClassTable.push(obj);
    this.addExtraClass = {
      date: moment().format("YYYY-MM-DD"),
      start_hour: '12 PM',
      start_minute: '00',
      end_hour: '1 PM',
      end_minute: '00',
      desc: '',
    }
  }

  updateExtraClass() {
    let data = this.makeJsonForExtraClass();


    if (this.batchDetails.extraSchd != null) {
      if (this.batchDetails.extraSchd.length > 0) {
        this.serverCallPUT(data);
      } else {
        this.serverCallPOST(data);
      }
    } else {
      this.serverCallPOST(data);
    }
  }

  makeJsonForExtraClass() {
    let obj: any = {};
    obj.batch_id = this.batchDetails.batch_id;
    obj.class_freq = "EXTRA";
    obj.extraSchd = [];
    if (this.extraClassTable.length > 0) {
      for (let i = 0; i < this.extraClassTable.length; i++) {
        let t: any = {};
        t.class_date = moment(this.extraClassTable[i].class_date).format('YYYY-MM-DD');
        t.start_time = this.extraClassTable[i].start_time;
        t.end_time = this.extraClassTable[i].end_time;
        t.note = this.extraClassTable[i].note;
        t.schd_id = this.extraClassTable[i].schd_id;
        let testStart: any = this.convertTimeToHourMinMeridian(t.start_time);
        let testStart1: any = this.convertTimeToHourMinMeridian(t.end_time);
        let start = this.convertIntoFullClock(testStart.hour, testStart.minute, testStart.meridian);
        let end = this.convertIntoFullClock(testStart1.hour, testStart1.minute, testStart1.meridian);
        t.duration = this.getDifference(start, end);
        obj.extraSchd.push(t);
      }
    }
    return obj;
  }

  cancelExtraClassSchedule(row) {
    this.showPopUpCancellation = true;
    this.cancelRowSelected = row;
  }

  notifyExtraClassSchedule(row) {
    if (confirm("Are you sure you want to send Extra Class Schedule SMS to the batch?")) {
      this.notifyExtraClassCancel(row, "week");
    }
  }

  deleteExtraClassSchedule(row, index) {
    if (confirm("Are you sure you want to delete?")) {
      this.extraClassTable.splice(index, 1);
    }
  }

  /// Cancel Class /////
  notifyOfCancelClass(row) {
    if (confirm("Are you sure, You want to notify?")) {
      let is_exam_schedule: any = '';
      if (row.hasOwnProperty('is_exam_schedule')) {
        is_exam_schedule = row.is_exam_schedule;
      } else {
        is_exam_schedule = "N";
      }
      let data = {
        batch_id: row.batch_id,
        class_schedule_id: row.schd_id,
        is_exam_schedule: is_exam_schedule
      };
      this.classService.notifyCancelledClassSchedule(data).subscribe(
        res => {
          this.updateTableDataAgain();
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Notified', 'Notification Sent');
        },
        err => {
          //console.log(err);
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
        }
      )
    }
  }

  /// Cancellation POpup /////////

  cancelBatchSchedule() {
    let data = this.makeJSONToSendBatchDet();
    if (data == false) {
      return;
    }
    this.classService.cancelClassSchedule(data).subscribe(
      res => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Notified', 'Cancelled Successfully');
        this.showPopUpCancellation = false;
        this.updateTableDataAgain();
      },
      err => {
        //console.log(err);
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
      }
    )
  }


  makeJSONToSendBatchDet() {
    let text = (<HTMLInputElement>document.getElementById('idTexboxReason')).value;
    if (text == "" || text == null || text == undefined) {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', 'Please provide cancellation reason');
      return false;
    }
    let chkbxValue: any = (<HTMLInputElement>document.getElementById('idChkbxEnable')).checked;
    if (chkbxValue == true) {
      chkbxValue = "Y";
    } else {
      chkbxValue = "N";
    }
    let obj: any = {};
    obj.batch_id = this.cancelRowSelected.batch_id;
    obj.class_freq = this.cancelRowSelected.freq;
    obj.cancelSchd = [
      {
        cancel_note: text,
        is_notified: chkbxValue,
        schd_id: this.cancelRowSelected.schd_id,
      }
    ];
    return obj;
  }

  // Common function for notification///
  notifyExtraClassCancel(row, type) {
    this.classService.sendNotification(row.schd_id, type).subscribe(
      res => {
        //console.log(res);
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Notified', 'Notification Sent');
      },
      err => {
        //console.log(err);
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Error', err.error.message);
      }
    )
  }

  ////////////////////////////

  showHideCommonSection() {
    if (this.batchFrequency == "1") {
      if (this.batchDetails.weekSchd != null) {
        if (this.batchDetails.weekSchd.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      if (this.batchDetails.otherSchd != null) {
        if (this.batchDetails.otherSchd.length > 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }


  closeWarningPopUp() {
    this.showWarningPopup = false;
  }

  addKeyInData(data) {
    data.forEach(element => {
      element.uiSelected = '';
      element.schd_id = '';
      element.duration = '';
      element.day_of_week = '';
      element.start_time = {
        hour: '12 PM',
        minute: '00',
      };
      element.end_time = {
        hour: '1 PM',
        minute: '00',
      };
    });
    return data;
  }

  createTimeInFormat(hrMeri, minute, format) {
    let time = hrMeri.split(' ');
    if (format == "comp") {
      let t = time[0] + ":" + minute + time[1];
      return t;
    } else {
      let t = time[0] + ":" + minute + " " + time[1];
      return t;
    }
  }

  getNewTimeFormatJson(data) {
    let time: any = {};
    time.hour = data.split(':')[0] + " " + data.split(' ')[1];
    time.minute = data.split(':')[1].split(' ')[0];
    return time;
  }

  convertToFullTimeFormat(hr, min) {
    let result: any = "";
    let hour: any;
    let time = hr.split(' ');
    if (time[1] == "AM") {
      if (time[0] == "12") {
        hour = "00";
      } else {
        hour = time[0];
      }
      result = hour + ":" + min;
      return result;
    } else {
      if (time[0] != "12") {
        hour = Number(time[0]) + 12;
      } else {
        hour = Number(time[0]);
      }
      result = hour + ":" + min;
      return result;
    }
  }

  updateTableDataAgain() {
    this.batchDetected(this.fetchMasterBatchModule.batch_id);
  }

  keepCloning(objectpassed) {
    if (objectpassed === null || typeof objectpassed !== 'object') {
      return objectpassed;
    }
    let temporaryStorage = objectpassed.constructor();
    for (var key in objectpassed) {
      temporaryStorage[key] = this.keepCloning(objectpassed[key]);
    }
    return temporaryStorage;
  }

  // change by laxmi
  switchActiveView() {
    let classArray = ['liStandard', 'liSubject', 'liExam', 'liManageBatch'];
    classArray.forEach((classname) => {
      document.getElementById(classname).classList.remove('active');
    });
    document.getElementById('liClass').classList.add('active');
  }


  hidePastClass() {
    if (moment().format('YYYY-MM-DD') <= moment(this.fetchMasterCourseModule.requested_date).format('YYYY-MM-DD')) {
      return true;
    } else {
      return false;
    }
  }

}
