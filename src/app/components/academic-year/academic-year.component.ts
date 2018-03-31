import { Component, OnInit } from '@angular/core';
import { AcademicyearService } from '../../services/academicYearService/academicyear.service';
import { error } from 'selenium-webdriver';
import { LoginService } from '../../services/login-services/login.service';
import { SlotApiService } from '../../services/slot-service/slot.service';
import { DatePipe } from '@angular/common';
import { AppComponent } from '../../app.component';
import { AuthenticatorService } from '../../services/authenticator.service';
import * as moment from 'moment';


@Component({
  selector: 'app-academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.scss']
})
export class AcademicYearComponent implements OnInit {

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
    inst_id: this.auth.getInstituteId(),
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
    if (this.addAcademicYearTemplate.inst_acad_year.trim() != "" && this.addAcademicYearTemplate.desc.trim() != ""
      && this.addAcademicYearTemplate.start_date != "" && this.addAcademicYearTemplate.end_date != "" && this.addAcademicYearTemplate.start_date != null && this.addAcademicYearTemplate.end_date != null) {

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
            inst_id: this.auth.getInstituteId(),
            default_academic_year: 0
          }
          this.getAllAcademicFromServer();
        },
        err => { }
      )
    }

    else {
      let acad = {
        type: "error",
        title: "Incorrect Details",
        body: "Please fill All The Required Details"
      }
      this.appC.popToast(acad);
    }

  }


  editRowTable(row, index) {
    document.getElementById(("row" + index).toString()).classList.remove('displayComp');
    document.getElementById(("row" + index).toString()).classList.add('editComp');
  }

  saveAcademicYearInformation(row, index) {

    let data = {
      inst_acad_year: row.inst_acad_year,
      desc: row.desc,
      start_date: row.start_date,
      end_date: row.end_date,
      inst_id: row.inst_id,
      default_academic_year: row.default_academic_year
    }
    this.academicyearservice.editAcademicYear(data, row.inst_acad_year_id).subscribe(
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
      }
    )
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
