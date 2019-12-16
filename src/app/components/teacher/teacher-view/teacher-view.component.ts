import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, Form, FormControl, FormGroup } from '@angular/forms';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';
import { isNumber } from 'util';
import { window } from 'ngx-bootstrap-custome/utils/facade/browser';
import * as moment from 'moment';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-teacher-view',
  templateUrl: './teacher-view.component.html',
  styleUrls: ['./teacher-view.component.scss']
})
export class TeacherViewComponent implements OnInit {

  selectedTeacherId;
  selectedTeacherInformation;
  batchesList: any;
  selectedBatch = "";
  selectedFromDate = "";
  selectedToDate = "";
  assignedBatchList: any = [];
  visitingBatchList: any = [];
  totalClassesTaken: number = 0;
  totalHourSpent: number = 0;
  visitingTotalClasses: number = 0;
  visitingTotalHour: number = 0;
  teacherTakenClasses: any;
  teacherTakenClassesPopUp: boolean = false;
  guestBatchList: any;
  assignedOrGuestPopUp = "";
  studentImage: string = '';
  containerWidth: any = "150px";
  containerHeight: any = "150px";
  readonly: any = true;
  advanceFilter: boolean = false;
  constructor(
    private route: Router,
    private ApiService: TeacherAPIService,
    private toastCtrl: AppComponent,
    private routeParam: ActivatedRoute
  ) {
    this.routeParam.params.subscribe(params => {
      this.selectedTeacherId = params['id'];
      // console.log(this.selectedTeacherId);

    });
  }

  ngOnInit() {
    this.getTeacherViewInfo();
    this.getAllBatchesInformation();
    this.getInfoFromDashBoard({ "batch_id": -1, "from_date": "", "to_date": "" });
    this.getInfoFromGuest({ "batch_id": -1, "from_date": "", "to_date": "" });
  }

  getTeacherViewInfo() {
    this.ApiService.getViewInfoOfTeacher(this.selectedTeacherId).subscribe(
      (data: any) => {
        this.studentImage = data.photo;
        this.selectedTeacherInformation = data;
      },
      error => {
        //console.log(error);
      }
    )
  }

  getAllBatchesInformation() {
    this.ApiService.getTeacherViewBatchesInfo().subscribe(
      data => {
        this.batchesList = data;
      },
      error => {
        //console.log(error);
      }
    )
  }

  searchTeacherInfo() {
    if (moment() < moment(this.selectedFromDate)) {
      this.messageNotifier('error', '', 'Please provide valid date');
      return;
    }
    if (moment() < moment(this.selectedToDate)) {
      this.messageNotifier('error', '', 'Please provide valid date');
      return;
    }
    let data: any = {};
    data.batch_id = this.selectedBatch;
    data.from_date = moment(this.selectedFromDate).format('YYYY-MM-DD');
    data.to_date = moment(this.selectedToDate).format('YYYY-MM-DD');
    this.getInfoFromDashBoard(data);
    this.getInfoFromGuest(data);
  }

  getInfoFromDashBoard(data) {
    this.assignedBatchList = [];
    this.ApiService.customizedTeacherSearchOnDashBoardView(data, this.selectedTeacherId).subscribe(
      data => {
        this.assignedBatchList = data;
        this.totalClassesTaken = this.getPerticularKeyValue(data, "total_teacher_classes", '');
        this.totalHourSpent = this.getPerticularKeyValue(data, 'total_hours', ' ');
      },
      error => {
        //console.log(error)
      }
    )
  }

  getInfoFromGuest(data) {
    this.visitingBatchList = [];
    this.ApiService.customizedTeacherSearchOnGuestBatchView(data, this.selectedTeacherId).subscribe(
      data => {
        this.visitingBatchList = data;
        this.visitingTotalClasses = this.getPerticularKeyValue(data, "total_teacher_classes", '');
        this.visitingTotalHour = this.getPerticularKeyValue(data, 'total_hours', ' ');
      },
      error => {
        //console.log(error)
      }
    )
  }

  cancelViewDetails() {
    this.route.navigateByUrl('/view/teacher');
  }

  getPerticularKeyValue(data, dataKey, splitOpearator) {
    let totalCount: number = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty(dataKey) && data[i][dataKey] != "" && data[i][dataKey] != null) {
        if (splitOpearator != "") {
          totalCount += Number(data[i][dataKey].split(' ')[0]);
        } else {
          totalCount += data[i][dataKey];
        }
      }
    }
    return totalCount;
  }

  exportDetailsInExcel() {
    //console.log("Excel");
  }

  printBtnClick() {
    window.print();
  }

  viewDetailOfBatch(row, i) {
    this.assignedOrGuestPopUp = "Assigned";
    this.teacherTakenClassesPopUp = true;
    this.getBatchDetailsInfo(row);
  }

  getBatchDetailsInfo(row) {
    let data: any = {};
    data.batch_id = row.batch_id;
    data.from_date = "";
    data.to_date = "";
    this.ApiService.viewBatchDetails(data, this.selectedTeacherId).subscribe(
      (data: any) => {
        this.teacherTakenClasses = data;
        //console.log(data);
      },
      error => {
        //console.log(error);
      }
    )
  }

  teacherTakenClassesPopupClose() {
    this.assignedOrGuestPopUp = "";
    this.teacherTakenClassesPopUp = false;
  }

  viewDetailOfVisitingBatch(row, i) {
    this.assignedOrGuestPopUp = "Guest";
    this.teacherTakenClassesPopUp = true;
    let data: any = {};
    data.batch_id = row.batch_id;
    data.from_date = "";
    data.to_date = "";
    this.ApiService.viewBatchDetails(data, this.selectedTeacherId).subscribe(
      (data: any) => {
        this.guestBatchList = data;
        //console.log(data);
      },
      error => {
        //console.log(error);
      }
    )
  }

  setImage(e) {
    this.studentImage = e;
  }

  toggleFilter() {
    if (this.advanceFilter == false) {
      this.advanceFilter = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.advanceFilter = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.toastCtrl.popToast(data);
  }

}
