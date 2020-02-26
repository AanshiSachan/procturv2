import { Component, OnInit, Output, Input, ElementRef, HostListener, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MessageShowService } from '../../services/message-show.service';
import { HttpService  } from '../../services/http.service';
declare var $;

@Component({
  selector: 'app-add-city-area',
  templateUrl: './add-city-area.component.html',
  styleUrls: ['./add-city-area.component.scss']
})
export class AddCityAreaComponent implements OnInit {

  @Output() closePopup = new EventEmitter<boolean>();

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
  };

  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];

  addArea = {
    country_id: "-1",
    state_id: "-1",
    city_id: "-1",
    areaName: ""
  }

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
   }

  ngOnInit() {
    $('#addAreaModal').modal('show');
    this.getCountryList()
  }

  getCountryList(){
    let defaultCountryList = sessionStorage.getItem('country_data')
    this.countryList = JSON.parse(defaultCountryList);
    this.getStateList();
  }

  getStateList(){
    this.stateList = [];
    this.cityList = [];
    this.addArea.state_id = '-1';
    this.addArea.city_id = '-1';   // reset state and city once Country change
    const url = `/api/v1/country/state?country_ids=${this.addArea.country_id}`
    this.httpService.getData(url).subscribe(
      (res: any) => {
        if(res.result.length > 0){
          this.stateList = res.result[0].stateList;
        }
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getCityList(){
    this.cityList = [];
    const url = `/api/v1/country/city?state_ids=${this.addArea.state_id}`
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

  addNewArea(){
    let validation = this.validateInputs();
    if(validation){
      let obj = {
        "area":this.addArea.areaName,
        "main_branch_instId": this.jsonFlag.institute_id,
        "city_id": this.addArea.city_id
      }
      const url = `/api/v1/cityArea/create/area`
      this.httpService.postData(url, obj).subscribe(
        (res: any) => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Area added successfully');
          this.closePopups(false);
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        }
      )
    }
  }

  validateInputs(){
    if(this.addArea.country_id == "" || this.addArea.country_id == "-1"){
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please enter country details');
      return false;
    }
    else{
      if(this.addArea.state_id == "" || this.addArea.state_id == "-1"){
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please enter state details');
        return false;
      }
      else{
        if(this.addArea.city_id == "" || this.addArea.city_id == "-1"){
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please enter city details');
          return false;
        }
        else{
          if(this.addArea.areaName.trim() == "" || this.addArea.areaName.trim().length == 0){
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please enter area details');
            return false;
          }
          else{
            return true;
          }
        }
      }
    }
  }


  closePopups($event) {
    $('#addAreaModal').modal('hide');
    this.closePopup.emit(false);
  }

}
