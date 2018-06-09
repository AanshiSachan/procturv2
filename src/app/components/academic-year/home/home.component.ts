import { Component, OnInit } from '@angular/core';
import { AcademicyearService } from '../../../services/academicYearService/academicyear.service';
import { error } from 'selenium-webdriver';
import { LoginService } from '../../../services/login-services/login.service';
import { SlotApiService } from '../../../services/slot-service/slot.service';
import { DatePipe } from '@angular/common';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import * as moment from 'moment';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  academicYearDataSource: any = [];
  academicTableList: any = [];
  createNewAcademicYear: boolean = false;
  PageIndex: number = 1;
  studentdisplaysize: number = 10;
  totalRow: number;


  addAcademicYearTemplate: any = {
    inst_acad_year: "",
    desc: "",
    start_date: "",
    end_date: "",
    inst_id: "",
    created_date: "",
    default_academic_year: 0
  }

  constructor(
    private academicyearservice: AcademicyearService,
    private login: LoginService,
    private apiService: SlotApiService,
    private appC: AppComponent,
    private auth: AuthenticatorService,
  ) { }


  ngOnInit() {

    this.getAllAcademicFromServer();
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
    this.addAcademicYearTemplate.inst_id = sessionStorage.getItem('institute_id');
  }


  getAllAcademicFromServer() {
    this.academicyearservice.getServices().subscribe(
      (data: any) => {
        this.academicYearDataSource = data;
        this.totalRow = data.length;
        this.fetchTableDataByPage(this.PageIndex);
      },
      error => {
        let msg = {
          type: "error",
          title: "",
          body: "An Error Occured"
        }
        this.appC.popToast(msg);
      }
    )
  }


  addAcademicYearDetails() {
    let start_date_new = this.addAcademicYearTemplate.start_date;
    let end_date_new = this.addAcademicYearTemplate.end_date;
    let academic_year_new = this.addAcademicYearTemplate.inst_acad_year.toString().split("-");

    if (this.addAcademicYearTemplate.inst_acad_year.trim() == "" || this.addAcademicYearTemplate.desc.trim() == ""
      || this.addAcademicYearTemplate.start_date == "" || this.addAcademicYearTemplate.end_date === "" || this.addAcademicYearTemplate.start_date == null || this.addAcademicYearTemplate.end_date == null) {

      let acad = {
        type: "error",
        title: "Incorrect Details",
        body: "Please fill All The Required Details"
      }
      this.appC.popToast(acad);

    }

    else if (moment(start_date_new).date() > moment(end_date_new).date()) {
      let msg = {
        type: "error",
        title: "Incorrect Details",
        body: "Start date cannot be less than end date"
      }
      this.appC.popToast(msg);

    }

    else if (moment(start_date_new).date() == moment(end_date_new).date()) {
      {
        let acad = {
          type: "error",
          title: "Incorrect Details",
          body: "Start date and end date cannot be same"
        }

        this.appC.popToast(acad);
      }
    }
    else if (moment(start_date_new).get('year') > moment(end_date_new).get('year')) {
      let acad = {
        type: "error",
        title: "Incorrect Details",
        body: "Start year should be greater than end year"
      }
      this.appC.popToast(acad);
    }
    else if (academic_year_new[0] == academic_year_new[1]) {
      let acad = {
        type: "error",
        title: "Incorrect Details",
        body: "Start year and end year cannot be same"
      }
      this.appC.popToast(acad);
    }
    else {

      this.academicyearservice.addNewAcademicYear(this.addAcademicYearTemplate).subscribe(
        res => {
          let msg = {
            type: "success",
            title: "",
            body: "academic Year added successfully"
          }
          this.appC.popToast(msg);
          this.addAcademicYearTemplate = {
            inst_acad_year: "",
            desc: "",
            start_date: "",
            end_date: "",
            inst_id: this.addAcademicYearTemplate.inst_id,
            default_academic_year: 0
          }

          this.toggleCreateNewAcademicYear();
          this.getAllAcademicFromServer();
        },
        err => {
          let msg = {
            type: "error",
            title: "error",
            body: err.error.message

          }
          this.appC.popToast(msg);
        }
      )
    }

  }
  editRowTable(row, index) {
    
    document.getElementById(("row" + index).toString()).classList.remove('displayComp');
    document.getElementById(("row" + index).toString()).classList.add('editComp');
    
  }

  saveAcademicYearInformation(row2, index) {
    let start_date_new = row2.start_date
    let end_date_new = row2.end_date


    if (moment(start_date_new).date() > moment(end_date_new).date()) {
      let msg = {
        type: "error",
        title: "Incorrect Details",
        body: "Start date cannot be less than end date"
      }
      this.appC.popToast(msg);

    }
    else if (row2.academicyear == "" || row2.desc == "") {
      let msg = {
        type: "error",
        title: "Incorrect Details",
        body: "Fields cannot be empty"
      }
      this.appC.popToast(msg);

    }

    else if (moment(start_date_new).get('year') > moment(end_date_new).get('year')) {
      let acad = {
        type: "error",
        title: "Incorrect Details",
        body: "Start year should be greater than end year"
      }
      this.appC.popToast(acad);
    }

    else {

      let data = {
        inst_acad_year: row2.inst_acad_year,
        desc: row2.desc,
        start_date: row2.start_date,
        end_date: row2.end_date,
        inst_id: row2.inst_id,
        default_academic_year: row2.default_academic_year,
        created_date: row2.created_date
      }

      this.academicyearservice.editAcademicYear(data, row2.inst_acad_year_id).subscribe(
        res => {
          this.cancelEditRow(index);
          this.getAllAcademicFromServer();
        },
        error => {
          let acad = {
            type: "error",
            title: "Incorrect Details",
            body: error.error.message
          }
          this.appC.popToast(acad);
          this.getAllAcademicFromServer();
        })

    }
  }

  cancelEditRow(index) {
    document.getElementById(("row" + index).toString()).classList.add('displayComp');
    document.getElementById(("row" + index).toString()).classList.remove('editComp');
  }

  toggleCreateNewAcademicYear() {
    if (this.createNewAcademicYear == false) {
      this.createNewAcademicYear = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.createNewAcademicYear = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  // pagination functions

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.studentdisplaysize * (index - 1);
    this.academicTableList = this.getDataFromDataSource(startindex);

  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let t = this.academicYearDataSource.slice(startindex, startindex + this.studentdisplaysize);
    return t;
  }

  removeFullscreen() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
  }

  removeSelectionFromSideNav() {
    document.getElementById('lione').classList.remove('active');
    document.getElementById('litwo').classList.remove('active');
    document.getElementById('lithree').classList.remove('active');
    document.getElementById('lifour').classList.remove('active');
    document.getElementById('lifive').classList.remove('active');
    document.getElementById('lisix').classList.remove('active');
    document.getElementById('liseven').classList.remove('active');
    document.getElementById('lieight').classList.remove('active');
    document.getElementById('linine').classList.remove('active');
    document.getElementById('lizero').classList.remove('active');
    /* document.getElementById('liten').classList.remove('active');
    document.getElementById('lieleven').classList.remove('active'); */
  }

}
