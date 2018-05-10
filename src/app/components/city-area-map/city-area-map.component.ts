import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login-services/login.service';
import { CityAreaService } from '../../services/area-city-service/area-city.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-city-area-map',
  templateUrl: './city-area-map.component.html',
  styleUrls: ['./city-area-map.component.scss']
})
export class CityAreaMapComponent implements OnInit {

  cityAreaListDataSource: any = [];
  cityAreaList: any = [];
  PageIndex: number = 1;
  studentdisplaysize: number = 10;
  totalRow: number;
  createNew: boolean = false;
  newCity = {
    city: '',
    area: '',
    branch: '-1'
  }
  isMultiBranch: any;
  branchesList: any = [];

  constructor(
    private login: LoginService,
    private apiService: CityAreaService,
    private appC: AppComponent
  ) {
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
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
          let data = {
            type: 'success',
            title: "Success",
            body: "Added Successfully."
          }
          this.appC.popToast(data);
          this.getCityAreaList();
          this.toggleCreateNewSlot();
        },
        err => {
          let data = {
            type: 'error',
            title: "Error",
            body: err.error.message
          }
          this.appC.popToast(data);
          //console.log(err);
        }
      )
    } else {
      let data = {
        type: 'error',
        title: "Error",
        body: "Please provide city name."
      }
      this.appC.popToast(data);
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
    let sessionData = JSON.parse(sessionStorage.getItem('institute_info')).is_main_branch;
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

  // Helper Functions

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
