import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login-services/login.service';
import { CityAreaService } from '../../services/area-city-service/area-city.service';
import { MessageShowService } from '../../services/message-show.service';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-city-area-map',
  templateUrl: './city-area-map.component.html',
  styleUrls: ['./city-area-map.component.scss']
})
export class CityAreaMapComponent implements OnInit {

  newCity = {
    city: '',
    area: '',
    branch: '-1'
  }

  branchesList: any = [];
  cityAreaListDataSource: any = [];
  cityAreaList: any = [];

  PageIndex: number = 1;
  studentdisplaysize: number = 10;
  totalRow: number;
  createNew: boolean = false;
  isMultiBranch: any;

  constructor(
    private login: LoginService,
    private apiService: CityAreaService,
    private msgService: MessageShowService
  ) {
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  ngOnInit() {
    this.checkMainBranchOrSubBranch();
    this.getCityAreaList();
    if (this.isMultiBranch) {
      this.getAllBranchesList();
    }
  }

  getCityAreaList() {
    this.apiService.getAreaList().subscribe(
      (data: any) => {
        this.cityAreaListDataSource = data;
        this.totalRow = data.length;
        this.fetchTableDataByPage(this.PageIndex);
      },
      err => {
        //console.log(err);
      }
    )
  }

  getAllBranchesList() {
    this.apiService.getBranchList().subscribe(
      res => {
        this.branchesList = res;
      },
      err => {
        //console.log(err);
      }
    )
  }

  addNewCity() {
    if (this.newCity.city.trim() != "" && this.newCity.city != null) {
      let obj: any = {
        area: this.newCity.area,
        city: this.newCity.city,
        sub_branch_instId: this.newCity.branch
      }
      this.apiService.saveNewCity(obj).subscribe(
        res => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success,'',"Added Successfully");
          this.getCityAreaList();
          this.toggleCreateNewSlot();
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error,'', err.error.message);
          //console.log(err);
        }
      )
    } else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error,'',"Please enter city name");
    }
  }

  toggleCreateNewSlot() {
    if (this.createNew == false) {
      this.createNew = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.createNew = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
    this.newCity = {
      city: '',
      area: '',
      branch: '-1'
    }
  }

  checkMainBranchOrSubBranch() {
    let sessionData = sessionStorage.getItem('is_main_branch');
    if (sessionData == "Y") {
      this.isMultiBranch = true;
    } else {
      this.isMultiBranch = false;
    }
  }

  // pagination functions 

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.studentdisplaysize * (index - 1);
    this.cityAreaList = this.getDataFromDataSource(startindex);
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
    let t = this.cityAreaListDataSource.slice(startindex, startindex + this.studentdisplaysize);
    return t;
  }

}
