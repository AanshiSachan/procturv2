import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, Form, FormControl, FormGroup } from '@angular/forms';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';

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
  assignedBatchList:any =[] ;
  visitingBatchList:any =[] ;

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
    this.getAllBatchesInformation()
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
