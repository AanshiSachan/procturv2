import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { HttpService } from '../../../../../services/http.service';
import { MessageShowService } from '../../../../../services/message-show.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  academicYearDataSource: any = [];
  academicTableList: any = [];
  varJson = {
    PageIndex: 1,
    studentdisplaysize: 10,
    totalRow: 0,
    createNewAcademicYear: false
  };
  type: string = '';

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
    private _http: HttpService,
    private msgService: MessageShowService,
    private auth: AuthenticatorService
  ) {
  }

  ngOnInit() {
    this.getAllAcademicFromServer();
    this.addAcademicYearTemplate.inst_id = sessionStorage.getItem('institute_id');
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.type = 'batch';
        } else {
          this.type = 'course';
        }
      }
    )
  }

  getAllAcademicFromServer() {
    this._http.getData("/api/v1/academicYear/all/" + sessionStorage.getItem('institute_id')).subscribe(
      (resp: any) => {
        this.academicYearDataSource = resp;
        this.varJson.totalRow = resp.length;
        this.fetchTableDataByPage(this.varJson.PageIndex);
      },
      (err) => {
        // this.isRippleLoad = false;
        this.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      });
  }

  addAcademicYearDetails() {
    let start_date_new = this.addAcademicYearTemplate.start_date;
    let end_date_new = this.addAcademicYearTemplate.end_date;
    let academic_year_new = this.addAcademicYearTemplate.inst_acad_year.toString().split("-");

    if (this.addAcademicYearTemplate.inst_acad_year.trim() == "" || this.addAcademicYearTemplate.desc.trim() == ""
      || this.addAcademicYearTemplate.start_date == "" || this.addAcademicYearTemplate.end_date === "" || this.addAcademicYearTemplate.start_date == null || this.addAcademicYearTemplate.end_date == null) {
      this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.dateTimeMessages.incorrectDetails, "Please fill All The Required Details");
    }
    else if (moment(start_date_new).valueOf() > moment(end_date_new).valueOf()) {
      this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.dateTimeMessages.incorrectDetails, "Start date cannot be less than end date");
    }
    else if (moment(start_date_new).valueOf() == moment(end_date_new).valueOf()) {
      {
        this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.dateTimeMessages.incorrectDetails, "Start date and end date cannot be same");
      }
    }
    else if (moment(start_date_new).get('year') > moment(end_date_new).get('year')) {
      this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.dateTimeMessages.incorrectDetails, "Start year should be greater than end year");
    }
    else if (academic_year_new[0] == academic_year_new[1]) {
      this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.dateTimeMessages.incorrectDetails, "Start year and end year cannot be same");
    }
    else {
      let obj = this.addAcademicYearTemplate;
      obj.start_date = moment(this.addAcademicYearTemplate.start_date).format("YYYY-MM-DD");
      obj.end_date = moment(this.addAcademicYearTemplate.end_date).format("YYYY-MM-DD");
      let url = "/api/v1/academicYear";
      this._http.postData(url, obj).subscribe((res) => {
        this.showErrorMessage(this.msgService.toastTypes.success, '', "academic Year added successfully");
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
      }, err => {
        this.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      });
    }
  }

  editRowTable(row, index) {
    this.addOrRemoveClass("row" + index, 'editComp', 'displayComp');
  }

  cancelEditRow(index) {
    this.addOrRemoveClass("row" + index, 'displayComp', 'editComp');
    this.getAllAcademicFromServer();
  }

  addOrRemoveClass(object: string, addClassObj: string, removeClassObj: string) {
    document.getElementById(object).classList.add(addClassObj);
    document.getElementById(object).classList.remove(removeClassObj);
  }

  saveAcademicYearInformation(row2, index) {
    let start_date_new = row2.start_date
    let end_date_new = row2.end_date

    if (moment(start_date_new).valueOf() > moment(end_date_new).valueOf()) {
      this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.dateTimeMessages.incorrectDetails, "Start date cannot be less than end date");
    }
    else if (row2.academicyear == "" || row2.desc == "") {
      this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.dateTimeMessages.incorrectDetails, "Fields cannot be empty");
    }
    else if (moment(start_date_new).get('year') > moment(end_date_new).get('year')) {
      this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.dateTimeMessages.incorrectDetails, "Start year should be greater than end year");
    }
    else {
      let data = {
        inst_acad_year: row2.inst_acad_year,
        desc: row2.desc,
        start_date:  moment(row2.start_date).format("YYYY-MM-DD"),
        end_date: moment(row2.end_date).format("YYYY-MM-DD"),
        inst_id: row2.inst_id,
        default_academic_year: row2.default_academic_year,
        created_date:moment(row2.created_date).format("DD-MM-YYYY") 
      }

      this._http.putData("/api/v1/academicYear/" + row2.inst_acad_year_id, data).subscribe(
        res => {
          this.cancelEditRow(index);
          this.getAllAcademicFromServer();
          this.showErrorMessage(this.msgService.toastTypes.success, '', 'Academic year updated successfully');
        },
        error => {
          this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.dateTimeMessages.incorrectDetails, error.error.message);
          this.getAllAcademicFromServer();
        });
    }
  }

  deleteAcademicYear(row) {
    let inst_id = row.inst_acad_year_id
    if (confirm('Are you sure, you want to delete?')) {
      this._http.deleteDataById("/api/v1/academicYear/" + row.inst_acad_year_id).subscribe(
        (data: any) => {
          this.showErrorMessage(this.msgService.toastTypes.success, '', 'Academic year deleted successfully');
          this.getAllAcademicFromServer();
        },
        (error: any) => {
          this.showErrorMessage(this.msgService.toastTypes.error, '', error.error.message);
        }
      )
    }
  }


  toggleCreateNewAcademicYear() {
    this.varJson.createNewAcademicYear = this.varJson.createNewAcademicYear == false ? true : false;
    document.getElementById('showCloseBtn').style.display = this.varJson.createNewAcademicYear == true ? '' : 'none';
    document.getElementById('showAddBtn').style.display = this.varJson.createNewAcademicYear == true ? 'none' : '';
  }

  // pagination functions
  fetchTableDataByPage(index) {
    this.varJson.PageIndex = index;
    let startindex = this.varJson.studentdisplaysize * (index - 1);
    this.academicTableList = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.varJson.PageIndex++;
    this.fetchTableDataByPage(this.varJson.PageIndex);
  }

  fetchPrevious() {
    if (this.varJson.PageIndex != 1) {
      this.varJson.PageIndex--;
      this.fetchTableDataByPage(this.varJson.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let t = this.academicYearDataSource.slice(startindex, startindex + this.varJson.studentdisplaysize);
    return t;
  }

  // toast function
  showErrorMessage(objType, massage, body) {
    this.msgService.showErrorMessage(objType, massage, body);
  }


}
