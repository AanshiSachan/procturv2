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

  @ViewChild('chartWrap') chartWrap: ElementRef;
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
  coursesList: any;

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
    }
    this.course_id = this.route.snapshot.paramMap.get('id');
    this.getCourseWiseReport();
    this.updateCoursesList();
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
    let standard_id = sessionStorage.getItem('subejctIdForReport');
    this.masterCourse = sessionStorage.getItem('masterCourseForReport');
    this.jsonFlag.isRippleLoad = true;
    this.classService.getStandardSubjectList(standard_id, "-1", "Y").subscribe(
      res => {
        this.coursesList = res.subjectLi;
        this.jsonFlag.isRippleLoad = false;
      },
      err => {
        this.jsonFlag.isRippleLoad = false;
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
       }
    );
  }


  generateChartData(res) {
    let dateMap: any[] = [];
    let feeMap: any[] = [];
    let totalMarksMap: any = [];
    let subjectWiseMarks: any[] = [];

    res.map(e => {
      dateMap.push(moment(e.exam_date).format('DD-MMM'));
      feeMap.push(e.avarage_marks);
      totalMarksMap.push(e.total_marks);
      subjectWiseMarks.push(e.subject_wise_statatics)
    });

    this.createChart(dateMap, feeMap, totalMarksMap);
    this.subjectWiseChart(dateMap, feeMap,subjectWiseMarks);
  }

  createChart(d: any[], f: any[], t: any[]){

    (Highcharts as any).chart('chartWrap', {
      chart : {
          renderTo : 'container',
           height: "33%",
          type : 'spline',
          // scrollablePlotArea: {
          //     minWidth: 100
          // }
        },
        title : {
          text : ''
        },
        xAxis : {
          type : 'datetime',
          labels: {
            overflow: 'justify'
          },
          // min: 10,
          scrollbar: {
              enabled: true
          },
          title : {
            text : 'Date'
          },
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
          // shared: true,
          useHTML: true,
          formatter : function () {
            var point = this.point
            let tool = '';
            tool += 'Avg Marks: ' + this.y + ' marks';
            for(let i = 0; i < t.length; i++){
              tool += '<br>'+'Total Marks: ' + t[this.point.index] + ' marks';
              break;
            }
            return tool;
          },
          positioner: function(labelWidth, labelHeight, point) {
              var tooltipX = point.plotX + 0;
              var tooltipY = point.plotY - 50;
              return {
                  x: tooltipX,
                  y: tooltipY
              };
          }

        },
        plotOptions : {
          area : {
            lineWidth : 1,
            marker : {
              enabled : false,
              states : {
                hover : {
                  enabled : true,
                  radius : 2
                }
              }
            },
            shadow : false,
            states : {
              hover : {
                lineWidth : 1
              }
            }
          },
          series: {
            pointWidth: 20
          }
        },

        series : [{
            name : '',
            type : "spline",
            marker: {
               radius: 5
             },
            showInLegend: false,
            data : f
          }]
    })
  }


  subjectWiseChart(d: any[], f: any[], s: any[]){
    let subjectA = [];
    let subjectB = [];
    let subjectC = [];
    let subjectD = [];
    let subjectName1;
    let subjectName2;
    let subjectName3;
    let subjectName4;

    for(let i = 0; i < s.length; i++){
      if(s[i][0] != undefined){
        subjectA.push(s[i][0].subject_level_total_marks);
        subjectName1 = s[i][0].subject_name;
      }
      if(s[i][1] != undefined){
        subjectB.push(s[i][1].subject_level_total_marks);
        subjectName2 = s[i][1].subject_name;
      }
      if(s[i][2] != undefined){
        subjectC.push(s[i][2].subject_level_total_marks);
        subjectName3 = s[i][2].subject_name;
      }
      if(s[i][3] != undefined){
        subjectD.push(s[i][3].subject_level_total_marks);
        subjectName4 = s[i][3].subject_name;
      }
    }

    let subject_series = [];
    if(subjectA.length > 0) {
      let subject = {
        name: subjectName1,
        data: subjectA
      };
      subject_series.push(subject);
    }
    if(subjectB.length > 0) {
      let subject = {
        name: subjectName2,
        data: subjectB
      };
      subject_series.push(subject);
    }
    if(subjectC.length > 0) {
      let subject = {
        name: subjectName3,
        data: subjectC
      };
      subject_series.push(subject);
    }
    if(subjectD.length > 0) {
      let subject = {
        name: subjectName4,
        data: subjectD
      };
      subject_series.push(subject);
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
      yAxis: {
          min: 0,
          visible: true,
          tickAmount: 5,
          title: {
              text: 'Marks'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} marks</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
      plotOptions: {
        series: {
          pointWidth: 20
        }
      },
      series: subject_series,
    })
  }

}
