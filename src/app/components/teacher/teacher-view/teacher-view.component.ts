import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, Form, FormControl, FormGroup } from '@angular/forms';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';
import { isNumber } from 'util';
import { window } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';

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
  teacherTakenClasses;
  teacherTakenClassesPopUp: boolean = false;

  constructor(
    private route: Router,
    private ApiService: TeacherAPIService
  ) {
    if (localStorage.getItem('teacherID')) {
      this.selectedTeacherId = localStorage.getItem('teacherID');
    } else {
      this.route.navigateByUrl('teacher');
    }
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
        console.log(data);
        this.selectedTeacherInformation = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getAllBatchesInformation() {
    this.ApiService.getTeacherViewBatchesInfo().subscribe(
      data => {
        console.log(data);
        this.batchesList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  searchTeacherInfo() {
    console.log(this.selectedBatch, this.selectedFromDate, this.selectedToDate);
    let data: any = {};
    data.batch_id = this.selectedBatch;
    data.from_date = this.selectedFromDate;
    data.to_date = this.selectedToDate;
    this.getInfoFromDashBoard(data);
    this.getInfoFromGuest(data);
  }

  getInfoFromDashBoard(data) {
    this.ApiService.customizedTeacherSearchOnDashBoardView(data, this.selectedTeacherId).subscribe(
      data => {
        console.log(data);
        this.assignedBatchList = data;
        this.totalClassesTaken = this.getPerticularKeyValue(data, "total_teacher_classes", '');
        this.totalHourSpent = this.getPerticularKeyValue(data, 'total_hours', ' ');
      },
      error => {
        console.log(error)
      }
    )
  }

  getInfoFromGuest(data) {
    this.ApiService.customizedTeacherSearchOnGuestBatchView(data, this.selectedTeacherId).subscribe(
      data => {
        console.log(data);
        this.visitingBatchList = data;
      },
      error => {
        console.log(error)
      }
    )
  }

  cancelViewDetails() {
    this.route.navigateByUrl('teacher');
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
    console.log("Excel");
  }

  printBtnClick() {
    window.print();
  }

  viewDetailOfBatch(row, i) {
    this.getBatchDetailsInfo(row);
    this.teacherTakenClassesPopUp = true;
  }

  getBatchDetailsInfo(row) {
    let data: any = {};
    data.batch_id = row.batch_id;
    data.from_date = "";
    data.to_date = "";
    this.ApiService.viewBatchDetails(data, this.selectedTeacherId).subscribe(
      data => {
        this.teacherTakenClasses = data;
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  teacherTakenClassesPopupClose() {
    this.teacherTakenClassesPopUp = false;
  }

  /* Customiized click detection strategy */
  inputClickedCheck(ev) {
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });
        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
    }
  }

}
