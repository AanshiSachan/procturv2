import { Component, OnInit } from '@angular/core';
import { MessageShowService } from '../../services/message-show.service';
import { HttpService  } from '../../services/http.service';
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
    institute_id: '',
  };

  filter = {
    country_ids: "-1",
    state_ids: "-1",
    city_ids: "-1",
    is_active: true
  };

  editrecord: any;
  editAreaName = '';
  countryStateAreaList: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];

  areaSearchInput: any;
  tempArealist: any[] = [];
  addArea: boolean = false;

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 100;
  totalCount: number = 0;
  sizeArr: any[] = [20, 50, 100, 150, 200, 500];
  startindex: number = 0;

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
  }

  ngOnInit() {
    this.searchArea();
    this.getCountryList();
  }


  // get all country list
  getCountryList(){
    let defaultCountryList = sessionStorage.getItem('country_data')
    this.countryList = JSON.parse(defaultCountryList);
    this.filter.country_ids = '1';  //  default country as India
    this.getStateList();

  }

  // get state list as per country selection
  getStateList(){
    this.stateList = [];
    this.cityList = [];
    this.filter.state_ids = '-1';
    this.filter.city_ids = '-1';   // reset state and city once Country change
    const url = `/api/v1/country/state?country_ids=${this.filter.country_ids}`
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.stateList = res.result[0].stateList;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  // get city list as per state selection
  getCityList(){
    this.cityList = [];
    const url = `/api/v1/country/city?state_ids=${this.filter.state_ids}`
    this.httpService.getData(url).subscribe(
      (res: any) => {
        if(res.result.length > 0){
          this.cityList = res.result[0].cityList;
        }
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  searchArea(){
    this.countryStateAreaList = [];
    let is_active_status = this.filter.is_active ? 'Y' : 'N';
    const url = `/api/v1/cityArea/area/view/${this.jsonFlag.institute_id}?country_ids=${this.filter.country_ids}&state_ids=${this.filter.state_ids}&city_ids=${this.filter.city_ids}&is_active=${is_active_status}`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.countryStateAreaList = res.result;
        this.tempArealist = res.result;
      },
      err => {
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
    this.editrecord.is_active_status = (this.editrecord.is_active == 'Y') ? true : false;
  }

  updateArea(){
    // use trim
    if(this.editrecord.area){
      if(!!this.editrecord.area && this.editrecord.area.length > 0){
        let obj = {
          "area": this.editrecord.area,
        	"main_branch_instId": this.jsonFlag.institute_id,
        	"city_id": this.editrecord.city_id,
        	"is_active": 'Y'
        };
        obj.is_active = this.editrecord.is_active_status ? 'Y' : 'N';
        const url = `/api/v1/cityArea/area/update/${this.editrecord.id}`
        this.httpService.putData(url, obj).subscribe(
          (res: any) => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', res.message);
            $('#editCityArea').modal('hide');
            this.searchArea();
          },
          err => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
          }
        )
      }
      else{
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please enter Area name');
      }
    }
  }

  deleteArea(area_id){
    if (confirm("Are you sure you want to delete it?")) {
      const url = `/api/v1/cityArea/area/delete/${this.jsonFlag.institute_id}/${area_id}`
      this.httpService.deleteData(url, null).subscribe(
        (res: any) => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', res.message);
          this.searchArea();
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        }
      )
    }
  }

  toggleAddArea(){
    if(this.addArea){
      this.addArea = false;
    }
    else{
      this.addArea = true;
    }
  }
}
