import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as Highcharts from "highcharts";
import { ClassScheduleService } from '../../../../../services/course-services/class-schedule.service';
import { MessageShowService } from '../../../../../services/message-show.service';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { CourseListService } from '../../../../../services/course-services/course-list.service';
import { ExamService } from '../../../../../services/report-services/exam.service';

@Component({
  selector: 'app-course-wise',
  templateUrl: './course-wise.component.html',
  styleUrls: ['./course-wise.component.scss']
})
export class CourseWiseComponent implements OnInit {

  chartType: any = "1";
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false,
    type:'batch'
  };

  course_id: String;
  courseWiseReportList: any;
  course: any = "-1";

  masterCourse: any;
  masterCourseList: any;
  coursesList: any = [];

  reportJSON: any = {
    master_course_name: "",
    standard_id:  "",
    subject_id: "",
    from_date: "",
    to_date: ""
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private examdata: ExamService,
    private courseList: CourseListService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private classService: ClassScheduleService,
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
    if(this.jsonFlag.isProfessional){
      this.preRequiredDataForBatchModel();
    }
    else{
      this.masterCourse = sessionStorage.getItem('masterCourseForReport');
      this.updateCoursesList();
    }
    this.course_id = this.route.snapshot.paramMap.get('id');
    this.getCourseWiseReport();

  }

  ngOnInit() {
  }

  getCourseWiseReport(){
    this.jsonFlag.isRippleLoad = true;
    this.examdata.getCourseWiseReport(this.course_id).subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        this.courseWiseReportList = res;
        this.generateChartData(res);
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        this.jsonFlag.isRippleLoad = false;
      }
    );
  }

  updateCoursesList(){
    this.courseList.getCourseListFromServer().subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        this.masterCourseList = res;
        for(let i = 0; i < this.masterCourseList.length; i++){
          if(this.masterCourseList[i].master_course == this.masterCourse){
            this.coursesList = this.masterCourseList[i].coursesList;
            this.course = this.course_id;
          }
        }
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
        this.jsonFlag.isRippleLoad = false;
      }
    );
  }

  getExamReport(){
    this.course_id = this.course;
    this.getCourseWiseReport();
  }

  preRequiredDataForBatchModel(){
    let subjectId = sessionStorage.getItem('subejctIdForReport');
    this.masterCourse = sessionStorage.getItem('masterCourseForReport');
    this.jsonFlag.isRippleLoad = true;
    this.reportJSON.subject_id = subjectId;
    this.examdata.getAllExamReport(this.reportJSON).subscribe(
      res => {
        this.jsonFlag.isRippleLoad = false;
        this.coursesList = res;
        this.course = this.course_id
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        this.jsonFlag.isRippleLoad = false;
      }
    );
  }


  generateChartData(res) {
    let dateMap: any[] = [];
    let feeMap: any[] = [];
    let totalMarksMap: any = [];
    let subjectWiseMarks: any[] = [];
    let percentage: any[] = [];
    let subjectWiseDate: any[] = [];
    let subjectData: any[] = [];

    res.map(e => {
      dateMap.push(moment(e.exam_date).format('DD-MMM'));
      feeMap.push(e.avarage_marks);
      totalMarksMap.push(e.total_marks);

      if(!this.jsonFlag.isProfessional){
        percentage.push(e.course_level_percentage);
        subjectData.push(e.subject_name);
      }
      else{
        percentage.push(e.batch_marks_percentage);
        subjectData.push(e.batch_name);
      }
      // if(e.subject_wise_statatics.length > 0){
      //   subjectWiseMarks.push(e.subject_wise_statatics);
      //   subjectWiseDate.push(moment(e.exam_date).format('DD-MMM'))
      // }

    });

    this.createChart(dateMap, feeMap, totalMarksMap, percentage, subjectData);
    // this.subjectWiseChart(subjectWiseDate, feeMap, subjectWiseMarks);
  }

  createChart(d: any[], f: any[], t: any[], p: any[], s: any[]){
    let percentage = p;
    let total = t;
    let avg_marks = f;
    let subject = s;

    let isProfessional = this.jsonFlag.isProfessional;

    let minWidth = 1100;
    let dataLength = d.length;
    if(dataLength > 20 && dataLength < 35){
      minWidth = 1500;
    }
    if(dataLength > 35 && dataLength < 50){
      minWidth = 1700;
    }
    if(dataLength > 50 && dataLength < 75){
      minWidth = 2000;
    }
    if(dataLength > 75 && dataLength < 100){
      minWidth = 2500;
    }
    if(dataLength > 100 && dataLength < 150){
      minWidth = 3000;
    }
    if(dataLength > 150 && dataLength < 200){
      minWidth = 4000;
    }
    if(dataLength > 200){
      minWidth = 6000;
    }

    (Highcharts as any).chart('chartWrap', {
      chart : {
        type : 'spline',
         scrollablePlotArea: {
            minWidth: minWidth,
            scrollPositionX: 1
          }
        },
        title : {
          text : ''
        },
        xAxis : {
          type : 'datetime',
          labels: {
            overflow: 'justify'
          },
          title : {
            text : 'Date'
          },
          minPadding: 1,
          maxPadding: 1,
          categories: d
        },
        yAxis : {
          title : {
            text : 'Percentage (%)'
          },
          min : 0,
          max : 100
        },
        tooltip : {
          useHTML: true,
          shared: false,
          formatter : function () {
            var point = this.point
            let tool = '';
            if(!isProfessional){
              tool += 'Subject: ' + subject[point.index] + '';
            }
            else{
              tool += 'Batch: ' + subject[point.index] + '';
            }
            tool += '<br>'+'Total Marks: ' + total[point.index] + ' marks';
            tool += '<br>'+'Avg Marks: ' + avg_marks[point.index] + ' marks';
            tool += '<br>'+'Percentage: ' + percentage[point.index] + '%';
            return tool;
          },
        },
        series : [{
            name : '',
            type : "spline",
            marker: {
               radius: 5
             },
            showInLegend: false,
            data : p
        }]
    })
  }

  subjectWiseChart(d: any[], f: any[], s: any[]){

    const subjectWiseStats = s;
    let subjectName1 = "";
    let subjectName2 = "";
    let subjectName3 = "";
    let subjectName4 = "";
    let subject_series = [];
    for (let index = 0; index < s.length; index++) {
      for (let i = 0; i < s[index].length; i++) {
        if(subjectName1 == ""){
          subjectName1 = s[index][i]["subject_name"];
        }
        else if(subjectName1 != s[index][i]["subject_name"]){
          subjectName2 = s[index][i]["subject_name"];
        }
        else if(subjectName1 != s[index][i]["subject_name"] && subjectName2 != s[index][i]["subject_name"]){
          subjectName3 = s[index][i]["subject_name"];
        }
        else if(subjectName1 != s[index][i]["subject_name"] && subjectName2 != s[index][i]["subject_name"] && subjectName3 != s[index][i]["subject_name"]){
          subjectName4 = s[index][i]["subject_name"];
        }
      }
    }

    let subjectA = [];
    let subjectB = [];
    let subjectC = [];
    let subjectD = [];

    for (let index = 0; index < subjectWiseStats.length; index++) {
      for (let i = 0; i < subjectWiseStats[index].length; i++) {
        if(subjectName1 == subjectWiseStats[index][i]["subject_name"]){
          subjectA.push(subjectWiseStats[index][i]["subject_level_total_marks"]);
          subjectB.push(0);
          subjectC.push(0);
          subjectD.push(0);
        }
        if(subjectName2 == subjectWiseStats[index][i]["subject_name"]){
          subjectB.push(subjectWiseStats[index][i]["subject_level_total_marks"]);
          subjectA.push(0);
          subjectC.push(0);
          subjectD.push(0);
        }
        if(subjectName3 == subjectWiseStats[index][i]["subject_name"]){
          subjectC.push(subjectWiseStats[index][i]["subject_level_total_marks"]);
          subjectA.push(0);
          subjectB.push(0);
          subjectD.push(0);
        }
        if(subjectName4 == subjectWiseStats[index][i]["subject_name"]){
          subjectD.push(subjectWiseStats[index][i]["subject_level_total_marks"]);
          subjectA.push(0);
          subjectB.push(0);
          subjectC.push(0);
        }
      }
    }


    (Highcharts as any).chart('subjectWise', {
      chart: {
        renderTo : 'container',
        type: 'column',
      },
      scrollablePlotArea: {
          minWidth: 1800
      },
      title: {
          text: ''
      },
      xAxis: {
          categories: d,
          crosshair: true,
          title: {
              text: 'Date'
          },
          type : 'datetime',
          labels: {
            overflow: 'justify'
          },
      },
      yAxis : {
        title : {
          text : 'Percentage (%)'
        },
        min : 0,
        tickAmount: 5,
        visible: true,
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} marks</b></td></tr>',
          footerFormat: '</table>',
          shared: false,
          useHTML: true
      },
      series: [
        {
          "name": subjectName1,
          "data": subjectA
        },
        {
          "name": subjectName2,
          "data": subjectB
        },
        {
          "name": subjectName3,
          "data": subjectC
        },
        {
          "name": subjectName4,
          "data": subjectD
        }
      ],
    })
  }

}
