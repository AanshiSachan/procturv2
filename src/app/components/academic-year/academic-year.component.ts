import { Component, OnInit } from '@angular/core';
import { AcademicyearService } from '../../services/academicYearService/academicyear.service';
import { error } from 'selenium-webdriver';
import { LoginService } from '../../services/login-services/login.service';
import { SlotApiService } from '../../services/slot-service/slot.service';
import { DatePipe } from '@angular/common';
import { AppComponent } from '../../app.component';
@Component({
  selector: 'app-academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.scss']
})
export class AcademicYearComponent implements OnInit {

  academicDetails: any = [];
  slotTableList: any = [];
  createNewAcademicYear: boolean = false;
  PageIndex: number = 1;
  studentdisplaysize: number = 10;
  totalRow: number;
  slotsDataSource;

  addAcademicYearTemplate: any = {
    inst_acad_year: "2017",
    desc: "test academic",
    start_date: "2017-01-01",
    end_date: "2017-12-06",
    inst_id: "100057",
    default_academic_year: 0
  }

  constructor(private academicyearservice: AcademicyearService, private login: LoginService, private apiService: SlotApiService, private appC: AppComponent, ) { }


  ngOnInit() {
    this.getAllSlotsFromServer();
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  getAllSlotsFromServer() {
    this.academicyearservice.getServices().subscribe(
      (data: any) => {
        this.slotTableList = data;
      },
      error => {
        console.log(error);
      }
    )
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
  editRowTable(row, index) {
    document.getElementById(("row" + index).toString()).classList.remove('displayComp');
    document.getElementById(("row" + index).toString()).classList.add('editComp');
  }
  saveSlotInformation(row, index) {
    let data = { "row_desc": row.desc, "row_inst": row.inst_acad_year, "row_start": row.start_date, "row_end": row.end_date }
    this.apiService.updateSlotName(data).subscribe(
      data => {
        console.log(data);
        this.cancelEditRow(index);
        this.getAllSlotsFromServer();
      },
      error => {
        console.log(error);
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
    this.slotTableList = this.getDataFromDataSource(startindex);
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
    let t = this.slotsDataSource.slice(startindex, startindex + this.studentdisplaysize);
    return t;
  }

  addNewAcademicYear(acdYear, acdYearDesc, strtDate, endDate) {

    if (acdYear.value != "" && acdYear.value != null ) {
       //this.academicyearservice.addNewAcademicYear({ "inst_acad_year": acdYear.value.trim(), "desc":acdYearDesc.value.trim(), "start_date":strtDate.value.trim(), "end_date":endDate.value.trim() }).subscribe(
      //   data => {
      //     console.log(data);
      //     /*let msg = {
      //       type: 'success',
      //       title: "",
      //       body: "Slot added successfully."
      //     }
      //     this.appC.popToast(msg);
      //     console.log(data);
      //     /*acdYear.value = "";
      //     acdYearDesc.value= "";
      //     strtDate.value= "";
      //     endDate.value=""

      //     //this.getAllSlotsFromServer();*/
      //   },
      //   error => {
      //     console.log(error);
      //   }
      // )
    }
     else {
      let data = {
        type: 'error',
        title: "Error",
        body: "Please fill Academic Form."
      }
      this.appC.popToast(data);
      return;
    }

  }
}
