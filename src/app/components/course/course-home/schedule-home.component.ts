import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { StandardServices } from '../../../services/course-services/standard.service';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';


@Component({
  selector: 'app-schedule-home',
  templateUrl: './schedule-home.component.html',
  styleUrls: ['./schedule-home.component.scss']
})
export class ScheduleHomeComponent implements OnInit {

  no_standard_name: boolean = false;
  standardListDataSource;
  displayBatchSize = 10;
  standardList;
  PageIndex: number = 1;
  createNewStandard: boolean = false;
  newStandardDetails: any = {
    is_active: "Y",
    standard_name: ""
  }
  totalRow: number;

  constructor(
    private apiService: StandardServices,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.getAllStandardList();
  }


  getAllStandardList() {
    this.apiService.getAllStandardListFromServer().subscribe(
      (data: any) => {
        console.log(data); 3
        this.totalRow = data.length;
        this.standardListDataSource = data;
        this.fetchTableDataByPage(this.PageIndex);
      },
      error => {
        console.log(error);
        let data = {
          type: "error",
          title: "",
          body: "Please refresh the page."
        }
        this.toastCtrl.popToast(data);
      }
    )
  }

  /* Function to set the createNewStandard View On/Off */
  toggleCreateNewStandard() {
    if (this.createNewStandard == false) {
      this.createNewStandard = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.newStandardDetails = {
        is_active: "Y",
        standard_name: ""
      }
      this.no_standard_name = false;
      this.createNewStandard = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';    
    }
  }


  /* Function to create a New Standard */
  addNewStandard() {
    if (this.newStandardDetails.standard_name == "") {
      this.no_standard_name = true;
    } else {
      this.apiService.createNewStandard(this.newStandardDetails).subscribe(
        res => {
          let data = {
            type: "success",
            title: "Standard Added",
            body: "New Standard added Successfull!"
          }
          this.toastCtrl.popToast(data);
          document.getElementById('standard_name').value = "";
          this.getAllStandardList();
        },
        err => {
          let data = {
            type: "error",
            title: "",
            body: err.error.message
          }
          this.toastCtrl.popToast(data);
          console.log(err);
        })
    }
  }


  searchInList(element) {
    if (element.value != "" && element.value != null) {
      let searchData = this.standardListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.standardList = searchData;
      this.totalRow = searchData.length;
    } else {
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.standardListDataSource.length;
    }
  }

  editRow(id) {
    document.getElementById(("row" + id).toString()).classList.remove('displayComp');
    document.getElementById(("row" + id).toString()).classList.add('editComp');
  }

  cancelRow(id) {
    document.getElementById(("row" + id).toString()).classList.remove('editComp');
    document.getElementById(("row" + id).toString()).classList.add('displayComp');
    this.getAllStandardList();
  }

  updateRow(row, id) {
    debugger
    let data: any = {};
    data.is_active = row.is_active;
    data.standard_name = row.standard_name;
    data.institution_id = row.institution_id;
    console.log("data", data);
    this.apiService.updateStanadardRowData(data, row.standard_id).subscribe(
      data => {
        let msg = {
          type: "success",
          title: "Standard Updated",
          body: "Standard Updated Successfully!"
        }
        this.toastCtrl.popToast(msg);
        console.log(data);
        this.cancelRow(id);
      },
      error => {
        let data = {
          type: "error",
          title: "",
          body: error.error.message
        }
        this.toastCtrl.popToast(data);
        console.log(error);
      }
    )
  }

  // pagination functions 

  fetchTableDataByPage(index) {
    let startindex = this.displayBatchSize * (index - 1);
    this.standardList = this.getDataFromDataSource(startindex);
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
    let t = this.standardListDataSource.slice(startindex, startindex + this.displayBatchSize);
    return t;
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

  /* function to set-unset isActive status for add standard */
  toggleStandardActive(event) {
    if (event) {
      this.newStandardDetails.is_active = "Y";
    }
    else {
      this.newStandardDetails.is_active = "N";
    }
  }

}
