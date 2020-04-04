import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { MessageShowService } from '../../services/message-show.service';
import { AuthenticatorService } from './../../services/authenticator.service';
declare var $;

@Component({
  selector: 'app-city-area-map',
  templateUrl: './city-area-map.component.html',
  styleUrls: ['./city-area-map.component.scss']
})
export class CityAreaMapComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: ''
  };

  filter = {
    country_ids: "-1",
    state_ids: "-1",
    city_ids: "-1",
    is_active: true
  };

  editrecord: any;
  editAreaName: string = '';
  editIsActiveStatus: boolean = true;
  countryStateAreaList: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];

  areaSearchInput: any;
  tempArealist: any[] = [];
  addArea: boolean = false;
  deleteAreaId: any = '';

  selectedData = {
    country: '',
    state: '',
    city:''
  };

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 100;
  totalCount: number = 0;
  sizeArr: any[] = [20, 50, 100, 150, 200, 500];
  startindex: number = 0;

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private auth:AuthenticatorService
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
  }

  ngOnInit() {
    this.getCountryList();
    this.searchArea();
  }


  // get all country list
  getCountryList(){
    let defaultCountryList = sessionStorage.getItem('country_data')
    this.countryList = JSON.parse(defaultCountryList);
    let defaultCountry = this.countryList.filter(item =>
      Object.keys(item).some(
        k => item.is_default == 'Y')
    );
    this.filter.country_ids = defaultCountry[0].id;  //  set default country ID
    this.getStateList();
  }

  // get state list as per country selection
  getStateList(){
    this.stateList = [];
    this.cityList = [];
    this.filter.state_ids = '-1';
    this.filter.city_ids = '-1';   // reset state and city once Country change
    const url = `/api/v1/country/state?country_ids=${this.filter.country_ids}`
    this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if(res.result.length > 0){
          this.stateList = res.result[0].stateList;
        }
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  // get city list as per state selection
  getCityList(){
    this.cityList = [];
    this.filter.city_ids = '-1';
    const url = `/api/v1/country/city?state_ids=${this.filter.state_ids}`
    this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if(res.result.length > 0){
          this.cityList = res.result[0].cityList;
        }
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  searchArea(){  //get default institute all country, state, city & area.
    this.countryStateAreaList = [];
    let is_active_status = this.filter.is_active ? 'Y' : 'N';
    const url = `/api/v1/cityArea/area/view/${this.jsonFlag.institute_id}?country_ids=${this.filter.country_ids}&state_ids=${this.filter.state_ids}&city_ids=${this.filter.city_ids}&is_active=${is_active_status}`;
    this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.countryStateAreaList = res.result;
        this.tempArealist = res.result;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
      }
    )
  }

  searchDatabase(){   // quick search
    this.countryStateAreaList = this.tempArealist;
    if (this.areaSearchInput == undefined || this.areaSearchInput == null) {
      this.areaSearchInput = "";
    }
    else {
      this.countryStateAreaList = this.tempArealist.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.areaSearchInput.toLowerCase()))
      );
    }
  }

  editArea(record){
    this.editrecord = record;
    this.editAreaName = this.editrecord.area;
    this.editIsActiveStatus = (this.editrecord.is_active == 'Y') ? true : false;
  }

  updateArea(){
    // use trim
    if(this.editAreaName.trim().length > 0){
      let obj = {
        "area": this.editAreaName,
        "main_branch_instId": this.jsonFlag.institute_id,
        "city_id": this.editrecord.city_id,
        "is_active": 'Y'
      };
      obj.is_active = this.editIsActiveStatus ? 'Y' : 'N';
      const url = `/api/v1/cityArea/area/update/${this.editrecord.id}`
      this.auth.showLoader();
      this.httpService.putData(url, obj).subscribe(
        (res: any) => {
          this.auth.hideLoader();
          this.editAreaName = '';
          this.editIsActiveStatus = true;
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', res.message);
          $('#editCityArea').modal('hide');
          this.searchArea();
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
        }
      )
    }
    else{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please enter Area name');
    }
  }

  setDeleteAreaId(areaId){
    this.deleteAreaId = areaId;
  }

  deleteArea(){
    const url = `/api/v1/cityArea/area/delete/${this.jsonFlag.institute_id}/${this.deleteAreaId}`
    this.auth.showLoader();
    this.httpService.deleteData(url, null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', res.message);
        this.deleteAreaId = '';
        $('#deleteModal').modal('hide');
        this.searchArea();
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      }
    )
  }

  toggleAddArea(){
    if(this.addArea){
      this.addArea = false;
    }
    else{
      this.addArea = true;
      this.selectedData.country = this.filter.country_ids;
      this.selectedData.state = this.filter.state_ids;
      this.selectedData.city = this.filter.city_ids;
    }
  }
}
