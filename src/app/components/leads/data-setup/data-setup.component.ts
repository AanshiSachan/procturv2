import { Component, OnInit } from '@angular/core';
import { ClosingReasonService } from '../services/closing-reason.service';
import { AppComponent } from '../../../app.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
declare var $;

@Component({
  selector: 'app-data-setup',
  templateUrl: './data-setup.component.html',
  styleUrls: ['./data-setup.component.scss']
})
export class DataSetupComponent implements OnInit {

  showToggle: boolean = false;
  createNewReasonObj = {
    closing_desc: "",
    institution_id: this.service.institute_id
  }
  getAllClosingReasons: any[] = [];
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1];
  dataStatus: boolean = false;
  activeSession: any = 'source';
  sourceDetails: any = [];
  referList: any = [];
  createSource = {
    name: "",
    inst_id: sessionStorage.getItem('institute_id'),
  }
  createReferer = {
    name: "",
    inst_id: sessionStorage.getItem('institute_id')
  }

  /// city/Area

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
    city: ''
  };

  constructor(
    private service: ClosingReasonService,
    private appC: AppComponent,
    private services: MessageShowService,
    private httpService: HttpService,
    private auth: AuthenticatorService
  ) { }

  ngOnInit() {
    // this.getAllReasons();
    this.getSourceDetails();
  }


  toggleCreateNewReason() {
    if (this.showToggle == false) {
      this.showToggle = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.showToggle = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  getAllReasons() {
    this.dataStatus = true;
    this.auth.showLoader();
    this.service.getAllReasons().subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.dataStatus = false;
        this.getAllClosingReasons = data;
      },
      (error: any) => {
        this.auth.hideLoader();
        this.dataStatus = false;
        // this.errorMessage(error);
      }
    )
  }


  saveInformation(row, index) {
    if (row.new_source_name == "" || row.new_source_name == null) {
      this.appC.popToast({ type: 'error', body: "Closing reason can't be empty" })
    }
    else {
      if (this.isName(row.new_source_name) == true) {
        this.services.showErrorMessage("error", "", "Please enter alphabets only")
      }

      else if (this.checkLength(row.new_source_name) == false) {
        this.services.showErrorMessage("error", "", "Limits should not be more than 50")
      }
      else {
        let obj = {
          closing_desc: row.new_source_name,
          institution_id: this.service.institute_id
        }
        this.auth.showLoader();
        this.service.updateClosingReason(obj, row.closing_reason_id).subscribe(
          (data: any) => {
            this.auth.hideLoader();
            this.services.showErrorMessage("success", "", "Reason updated successfully")
            this.getAllReasons();
          },
          err => {
            this.auth.hideLoader();
            this.errorMessage(err);
          }
        )
      }
    }
  }


  createNewReason() {
    if (this.createNewReasonObj.closing_desc == "") {
      this.services.showErrorMessage("error", "", "Closing reason can't be empty")
    }

    else {
      if (this.isName(this.createNewReasonObj.closing_desc) == true) {
        this.services.showErrorMessage("error", "", "Please enter alphabets only")
      }

      else if (this.checkLength(this.createNewReasonObj.closing_desc) == false) {
        this.services.showErrorMessage("error", "", "Limits should not be more than 50")
      }
      else {
        this.auth.showLoader();
        this.service.createReason(this.createNewReasonObj).subscribe(
          (data: any) => {
            this.auth.hideLoader();
            this.services.showErrorMessage("success", "", "Reason Created Successfully")
            this.showToggle = false;
            this.getAllReasons();
            this.createNewReasonObj.closing_desc = "";
            document.getElementById('showAddBtn').style.display = "inline-block";
            document.getElementById('showCloseBtn').style.display = "none";
          },
          (error: any) => {
            this.auth.hideLoader();
            this.errorMessage(error);
          }
        )
      }
    }
  }

  checkLength(el) {
    if (el.length > 50) {
      return false;
    }
    else {
      return true;
    }
  }


  isName(str) {
    let letters = /^[A-Za-z \n]+$/
    if (letters.test(str)) {
      return false;
    }
    else {
      return true;
    }
  }

  errorMessage(error) {
    this.services.showErrorMessage("success", "", error.error.message)
  }

  toggle(id) {
    this.activeSession = id;
    this.createSource.name = '';
    this.createReferer.name = '';
    this.createNewReasonObj.closing_desc = '';
  }

  EditSource(obj, name) {
    obj.isEdit = true;
    obj.new_source_name = name;
  }

  cancelEditSource(obj) {
    obj.isEdit = false;
    obj.new_source_name = '';
  }

  updateSource(obj) {
    let data = {
      id: obj.id,
      name: obj.new_source_name,
      inst_id: sessionStorage.getItem('institute_id')
    }
    if (obj.new_source_name.trim() != '') {
      if ((this.sourceDetails.filter(x => (x.name == obj.new_source_name.trim() && x.id != obj.id))).length == 0) {
        this.auth.showLoader();
        this.httpService.putData("/api/v1/enquiry_campaign/master/lead_source", data).subscribe(
          res => {
            this.auth.hideLoader();
            this.services.showErrorMessage('success', '', 'Source updated successfully');
            this.getSourceDetails();
          },
          err => {
            this.auth.hideLoader();
            this.services.showErrorMessage('error', '', err.error.message);
          }
        );
      } else {
        this.services.showErrorMessage('error', '', 'Source name already exist!');
      }
    } else {
      this.services.showErrorMessage('error', '', 'Please enter source name');
    }
  }

  deleteSource(obj) {
    let data = {
      id: obj.id,
      name: obj.name,
      inst_id: sessionStorage.getItem('institute_id')
    }
    this.auth.showLoader();
    this.httpService.deleteData('/api/v1/enquiry_campaign/master/lead_source', data).subscribe(
      res => {
        this.auth.hideLoader();
        this.services.showErrorMessage('success', '', 'Source deleted successfully');
        $('#deleteModal').modal('hide');
        this.getSourceDetails();
      },
      err => {
        this.auth.hideLoader();
        this.services.showErrorMessage('error', '', err.error.message);
        $('#deleteModal').modal('hide');
      }
    )
  }

  getSourceDetails() {
    let url = "/api/v1/enquiry_campaign/master/lead_source/" + sessionStorage.getItem('institute_id') + "/all";

    this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.sourceDetails = res;
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }

  addSourceData() {
    let url = "/api/v1/enquiry_campaign/master/lead_source";
    if (this.createSource.name.trim() != '') {
      if ((this.sourceDetails.filter(x => x.name == this.createSource.name.trim())).length == 0) {
        this.auth.showLoader();
        this.httpService.postData(url, this.createSource).subscribe(
          el => {
            this.auth.hideLoader();
            this.services.showErrorMessage('success', '', 'Source added successfully');
            this.getSourceDetails();
            this.createSource.name = '';
          },
          err => {
            this.auth.hideLoader();
            this.services.showErrorMessage('error', '', err.error.message);
          }
        );
      } else {
        this.services.showErrorMessage('error', '', 'Source name already exist!');
      }
    } else {
      this.services.showErrorMessage('error', '', 'Please enter source name');
    }
  }


  addReferData() {
    if (this.createReferer.name.trim() != '') {
      if ((this.referList.filter(x => x.name == this.createReferer.name.trim())).length == 0) {
        this.auth.showLoader();
        this.httpService.postData('/api/v1/enquiry_campaign/master/lead_referred_by', this.createReferer).subscribe(
          el => {
            this.createReferer.name = '';
            this.auth.hideLoader();
            this.fetchReferInfo();
            this.services.showErrorMessage('success', '', 'Referrer Added Successfully');
          },
          err => {
            this.auth.hideLoader();
            this.services.showErrorMessage('error', '', err.error.message);
          }
        );
      } else {
        this.services.showErrorMessage('error', '', 'Referrer name already exist!');
      }
    } else {
      this.services.showErrorMessage('error', '', 'Please enter Referrer name');
    }
  }

  fetchReferInfo() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/enquiry_campaign/master/lead_referred_by/' + sessionStorage.getItem('institute_id') + "/all").subscribe(
      data => {
        this.auth.hideLoader();
        this.referList = data;
      },
      err => {
        this.auth.hideLoader();
        this.referList = [];
      }
    )
  }

  updateRefer(obj) {
    let data = {
      id: obj.id,
      name: obj.new_source_name,
      inst_id: sessionStorage.getItem('institute_id')
    };
    if (obj.new_source_name.trim() != '') {
      if ((this.referList.filter(x => (x.name == obj.new_source_name.trim() && x.id != obj.id))).length == 0) {
        this.auth.showLoader();
        this.httpService.putData('/api/v1/enquiry_campaign/master/lead_referred_by', data).subscribe(
          res => {
            this.auth.hideLoader();
            this.services.showErrorMessage('success', '', 'Reference updated Successfully');
            this.fetchReferInfo();
          },
          err => {
            this.auth.hideLoader();
            this.services.showErrorMessage('error', '', err.error.message);
          }
        )
      } else {
        this.services.showErrorMessage('error', '', 'Referrer name already exist!');
      }
    } else {
      this.services.showErrorMessage('error', '', 'Please enter Referrer name');
    }
  }


  deleteRefer(obj) {
    let data = {
      id: obj.id,
      name: obj.name,
      inst_id: sessionStorage.getItem('institute_id')
    };
    this.auth.showLoader();
    this.httpService.deleteData('/api/v1/enquiry_campaign/master/lead_referred_by', data).subscribe(
      res => {
        this.auth.hideLoader();
        this.services.showErrorMessage('success', '', 'Reference deleted Successfully');
        $('#deleteModal').modal('hide');
        this.fetchReferInfo();
      },
      err => {
        this.auth.hideLoader();
        $('#deleteModal').modal('hide');
        if (err.status == 500) {
          // msg = JSON.parse(err._body);
          this.services.showErrorMessage('error', '', err.error.message);
        } else {
          this.services.showErrorMessage('error', '', err.error.message);
        }
      }
    );
  }


  ///// City/Areaa




  // get all country list
  getCountryList() {
    this.areaSearchInput = '';
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
  getStateList() {
    this.stateList = [];
    this.cityList = [];
    this.filter.state_ids = '-1';
    this.filter.city_ids = '-1';   // reset state and city once Country change
    const url = `/api/v1/country/state?country_ids=${this.filter.country_ids}`
    this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if (res.result.length > 0) {
          this.stateList = res.result[0].stateList;
        }
      },
      err => {
        this.auth.hideLoader();
        this.services.showErrorMessage('error', '', err);
      }
    )
  }

  // get city list as per state selection
  getCityList() {
    this.cityList = [];
    this.filter.city_ids = '-1';
    const url = `/api/v1/country/city?state_ids=${this.filter.state_ids}`
    this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if (res.result.length > 0) {
          this.cityList = res.result[0].cityList;
        }
      },
      err => {
        this.auth.hideLoader();
        this.services.showErrorMessage('error', '', err);
      }
    )
  }

  searchArea() {  //get default institute all country, state, city & area.
    this.countryStateAreaList = [];
    let is_active_status = this.filter.is_active ? 'Y' : 'N';
    const url = `/api/v1/cityArea/area/view/${sessionStorage.getItem('institute_id')}?country_ids=${this.filter.country_ids}&state_ids=${this.filter.state_ids}&city_ids=${this.filter.city_ids}&is_active=${is_active_status}`;
    this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.countryStateAreaList = res.result;
        this.tempArealist = res.result;
      },
      err => {
        this.auth.hideLoader();
        this.services.showErrorMessage('error', '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
      }
    )
  }

  searchDatabase() {   // quick search
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

  editArea(record) {
    this.editrecord = record;
    this.editAreaName = this.editrecord.area;
    this.editIsActiveStatus = (this.editrecord.is_active == 'Y') ? true : false;
  }

  updateArea() {
    // use trim
    if (this.editAreaName.trim().length > 0) {
      let obj = {
        "area": this.editAreaName,
        "main_branch_instId": sessionStorage.getItem("institute_id"),
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
          this.services.showErrorMessage('success', '', res.message);
          $('#editCityArea').modal('hide');
          this.searchArea();
        },
        err => {
          this.auth.hideLoader();
          this.services.showErrorMessage('error', '', err);
        }
      )
    }
    else {
      this.services.showErrorMessage('error', '', 'Please enter Area name');
    }
  }

  setDeleteAreaId(areaId) {
    this.deleteAreaId = areaId;
  }

  deleteArea() {
    const url = `/api/v1/cityArea/area/delete/${sessionStorage.getItem('institute_id')}/${this.deleteAreaId.id}`
    this.auth.showLoader();
    this.httpService.deleteData(url, null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.services.showErrorMessage('success', '', res.message);
        this.deleteAreaId = '';
        $('#deleteModal').modal('hide');
        this.searchArea();
      },
      err => {
        this.auth.hideLoader();
        this.services.showErrorMessage('error', '', err.error.message);
      }
    )
  }

  toggleAddArea() {
    if (this.addArea) {
      this.addArea = false;
      this.searchArea();
    }
    else {
      this.addArea = true;
      this.selectedData.country = this.filter.country_ids;
      this.selectedData.state = this.filter.state_ids;
      this.selectedData.city = this.filter.city_ids;
    }
  }

}
