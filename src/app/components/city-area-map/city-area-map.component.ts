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
    city_ids: "-1"
  };

  editrecord: any;
  editAreaName = '';
  countryStateAreaList: any[] = [];
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];

  areaSearchInput: any;
  tempArealist: any[] = [];


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
    this.getInstituteSpecificArea();
    this.getCountryList();
  }

  // get all created area of institute specific
  getInstituteSpecificArea(){
    const url = `/api/v1/cityArea/area/view/${this.jsonFlag.institute_id}`
    this.httpService.getData(url).subscribe(
      (res: any) => {
        console.log(res)
        this.countryStateAreaList = res.result;
        this.tempArealist = res.result;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
      }
    )
  }

  // get all country list
  getCountryList(){
    let defaultCountryList = sessionStorage.getItem('country_data')
    this.countryList = JSON.parse(defaultCountryList);
    this.filter.country_ids = '1';  //  default country as India
    this.getStateList();

    // const url = `/api/v1/country/all`
    // this.httpService.getData(url).subscribe(
    //   (res: any) => {
    //     this.countryList = res;
    //     this.filter.country_ids = '1';  //  default country as India
    //     this.getStateList();
    //   },
    //   err => {
    //     this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
    //   }
    // )
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
        this.cityList = res.result[0].cityList;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  searchArea(){
    this.countryStateAreaList = [];
    const url = `/api/v1/cityArea/area/view/${this.jsonFlag.institute_id}?country_ids=${this.filter.country_ids}&state_ids=${this.filter.state_ids}&city_ids=${this.filter.city_ids}`
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.countryStateAreaList = res.result;
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
      let searchData = this.tempArealist.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.areaSearchInput.toLowerCase()))
      );
      this.countryStateAreaList = searchData;
    }
  }

  editArea(record){
    this.editrecord = record;
    if(this.editrecord.is_active == 'Y'){
      this.editrecord.is_active_status = true;
    }
    else{
      this.editrecord.is_active_status = false;
    }
  }

  updateArea(){
    if(this.editrecord.area){
      if(!!this.editrecord.area && this.editrecord.area.length > 0){
        let check = 'Y';
        if(!this.editrecord.is_active_status){
          check = 'N'
        }
        let obj = {
          "area": this.editrecord.area,
        	"main_branch_instId": this.jsonFlag.institute_id,
        	"city_id": this.editrecord.city_id,
        	"is_active": check
        };
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
    let obj = {}
    const url = `/api/v1/cityArea/area/delete/${this.jsonFlag.institute_id}/${area_id}`
    this.httpService.deleteData(url, obj).subscribe(
      (res: any) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Area deleted successfully!');
        this.searchArea();
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }


  /*** pagination functions */
  /* Fetch next set of data from server and update table */
  // fetchNext() {
  //   this.pageIndex++;
  //   this.fectchTableDataByPage(this.pageIndex);
  // }
  //
  // /* Fetch previous set of data from server and update table */
  // fetchPrevious() {
  //   this.pageIndex--;
  //   this.fectchTableDataByPage(this.pageIndex);
  // }
  //
  // /* Fetch table data by page index */
  // fectchTableDataByPage(index) {
  //   this.pageIndex = index;
  //   let startindex = this.displayBatchSize * (index - 1);
  //   this.searchCampaign(startindex);
  // }
  //
  // /* Fetches Data as per the user selected batch size */
  // updateTableBatchSize(num) {
  //   this.pageIndex = 1;
  //   this.displayBatchSize = parseInt(num);
  //   this.searchCampaign(this.startindex);
  // }

}
