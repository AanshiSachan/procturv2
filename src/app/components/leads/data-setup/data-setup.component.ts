import { Component, OnInit } from '@angular/core';
import { ClosingReasonService } from '../services/closing-reason.service';
import { AppComponent } from '../../../app.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';

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
  schoolModel: boolean = false;

  activeSession: any = 'source';
  sourceDetails: any = [];
  referList: any = [];
  custumFieldList:any=[];
  componentShell:any[] = [];
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
  isEditcustumfield:string=""
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
  component_id:any='';
  isProfessional:boolean = false;
  isEditCustumFormField:string=''

  selectedData = {
    country: '',
    state: '',
    city: ''
  };
  editCustomFormField:any = {
    comp_length: '',
    description: "",
    institution_id: sessionStorage.getItem('institute_id'),
    is_required: "N",
    is_searchable: "N",
    label: "",
    page: 1,
    prefilled_data: "",
    sequence_number: "",
    type: "-1",
    on_both: "Y",
    defaultValue: "",
    is_external: "N"
  }
  constructor(
    private service: ClosingReasonService,
    private appC: AppComponent,
    private services: MessageShowService,
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private postData:PostEnquiryDataService
  ) { }

  ngOnInit() {
    this.auth.schoolModel.subscribe(
      res => {
        this.schoolModel = false;
        if (res) {
          this.schoolModel = true;
        }
      }
    )

    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true; // batch module
        } else {
          this.isProfessional = false;  //course module
        }
      }
    );
    // this.getAllReasons();
    this.getSourceDetails();
    this.fetchPrefillData()
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
      // if (this.isName(row.new_source_name) == true) {
      //   this.services.showErrorMessage("error", "", "Please enter alphabets only")
      // }
      if (row.new_source_name.trim() == '') {
        this.services.showErrorMessage("error", "", "Please enter closing reason")
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
      // if (this.isName(this.createNewReasonObj.closing_desc) == true) {
      //   this.services.showErrorMessage("error", "", "Please enter alphabets only")
      // }
      if (this.createNewReasonObj.closing_desc.trim() == '' ) {
        this.services.showErrorMessage("error", "", "Please enter closing reason")
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
  // =====================custm-frm-field================
  checkValuetype(value) {
    this.editCustomFormField.comp_length = value == 1 ? 50 : 0
  }
  fetchPrefillData() {
    this.auth.showLoader();
    let url ='/api/v1/masterData/type/CUSTOM_COMPONENT_TYPE'
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.componentShell = res;
        console.log("type value",this.componentShell)
      }, (err) => {
        this.auth.hideLoader();
      }
    );
  }
fetchCustomFild(){
  this.auth.showLoader();
  let url ='/api/v1/instCustomComp/getAll/' +sessionStorage.getItem('institute_id') + "?page=1"
  this.httpService.getData(url).subscribe(
  res => {
    this.auth.hideLoader();
    this.custumFieldList = res;
    console.log("custom filed data",this.custumFieldList)
  },
  err => {
    this.auth.hideLoader();
    this.custumFieldList = [];
  }
)
  
}
addNewCustomField(){

 //Case 1 Label/Type is not empty and MaxLength and Sequence
 if (this.editCustomFormField.label.trim() != "-1") {
  if (this.editCustomFormField.type != "-1") {
    //Case 2 if its a select or multiselect dropdown list cannot be empty or duplicate
    if (this.editCustomFormField.type == "3" ||
      this.editCustomFormField.type == "4") {
      /* Validate Prefilled Data */
      if (this.validateDropDown(this.editCustomFormField.prefilled_data)) {
        if (this.validateDropdownDefvalue(this.editCustomFormField.prefilled_data, this.editCustomFormField.defaultValue)) {
          this.auth.showLoader();
          this.postData.addNewCustomComponent(this.editCustomFormField).subscribe(
            res => {
              this.auth.hideLoader();
              this.services.showErrorMessage('success', '', 'Form-Field added successfully');
              this.fetchCustomFild()

              this.cleareForm();
            },
            err => {
              this.auth.hideLoader();
              this.services.showErrorMessage('error', '', 'Label name is already created with the same name');
            });
        }
        else {
          this.services.showErrorMessage('error', '', 'dropdown default value should be present in prefilled data');
        }
      }
      else {
        this.services.showErrorMessage('error', '', 'Prefill data has to be unique and non-empty');
      }
    }
    /* Date Custom Component */
    else if (this.editCustomFormField.type == "5") {
      /* Date cannot be searchable and does not a default value */
      if (this.editCustomFormField.is_searchable == "N" && this.editCustomFormField.defaultValue.trim() == "") {
        this.auth.showLoader();
        this.postData.addNewCustomComponent(this.editCustomFormField).subscribe(
          res => {
            this.auth.hideLoader();
            this.services.showErrorMessage('success', '', 'Form-Field added successfully');
            this.fetchCustomFild()

            this.cleareForm();

          },
          err => {
            this.auth.hideLoader();
            this.services.showErrorMessage('error', '', 'There was an error processing your request' + err.error.message);
          });
      }
      else {
        this.services.showErrorMessage('error', '', 'Date Field Cannot Be Searchable Or have any default value');
      }
    }
    /* Textbox and Checkbox */
    else if (this.editCustomFormField.type != "3" && this.editCustomFormField.type != "4" && this.editCustomFormField.type != "5") {
      this.auth.showLoader();
      this.postData.addNewCustomComponent(this.editCustomFormField).subscribe(
        res => {
          this.auth.hideLoader();
          this.services.showErrorMessage('success', '', 'Form-Field added successfully');
          this.fetchCustomFild()

          this.cleareForm();
        },
        err => {
          this.auth.hideLoader();
          this.services.showErrorMessage('error', '', 'Label name already exists');
        });
    }
  }
  else {
    this.services.showErrorMessage('error', '', 'Please mention a type');
  }
}
else {
  this.services.showErrorMessage('error', '', 'Please mention a Label');
}


}
  

    onClickeditCustomField(obj){
      //this.component_id = obj.component_id
      this.editCustomFormField = obj
      this.isEditCustumFormField='Edit'

    
    }
    onClickAddField(types){
      this.isEditCustumFormField = types
    }
updateCustumField(){


  let data = this.editCustomFormField;
  //Case 1 Label/Type is not empty and MaxLength and Sequence
  if (data.label.trim() != "" && data.type != "") {
    //Case 2 if its a select or multiselect dropdown list cannot be empty or duplicate
    if (data.type == "3" || data.type == "4") {
      /* Validate Prefilled Data */
      if (this.validateDropDown(data.prefilled_data)) {
        if (this.validateDropdownDefvalue(data.prefilled_data, data.defaultValue)) {
          this.auth.showLoader();
          this.postData.updateCustomComponent(data).subscribe(
            res => {
              this.auth.hideLoader();
              this.services.showErrorMessage('success', '', 'Form-Field  Updated Successfully');
              this.cleareForm();


            },
            err => {
              this.auth.hideLoader();
              this.services.showErrorMessage('error', '', err.error.message);
            }
          );
        }
        else {
          this.services.showErrorMessage('error', 'dropdown default value should be present in prefilled data', '');
        }
      }
      else {
        this.services.showErrorMessage('error', 'Prefill data has to be unique and non-empty', '');
      }
    }

    /* Date Custom Component */
    else if (data.type == "5") {
      /* Date cannot be searchable and does not a default value */
      if (data.is_searchable == "N" && data.defaultValue.trim() == "") {
        this.auth.showLoader();
        this.postData.updateCustomComponent(data).subscribe(
          res => {
            this.auth.hideLoader();
            this.services.showErrorMessage('success', '', 'Form-Field updated successfully');

            this.cleareForm();

          },
          err => {
            this.auth.hideLoader();
            this.services.showErrorMessage('error', '', err.error.message);
          }
        );
      }
      else {
        this.services.showErrorMessage('error', 'Date field cannot be searchable Or have any default value', '');
      }
    }
    /* Textbox and Checkbox */
    else if (data.type != "3" && data.type != "4" && data.type != "5") {
      this.auth.showLoader();
      this.postData.updateCustomComponent(data).subscribe(
        res => {
          this.auth.hideLoader();
          this.services.showErrorMessage('success', '', 'Form-Field updated successfully');
          this.fetchCustomFild()
          this.cleareForm();

        },
        err => {
          this.auth.hideLoader();
          this.services.showErrorMessage('error', '', err.error.message);
        }
      );
    }
  }
  else {
    this.services.showErrorMessage('error', '', 'Please mention a label/type');
  }
}
  // this.isEditCustumFormField='Edit'

  // let obj =this.editCustomFormField
  // this.auth.showLoader();
  // this.postData.updateCustomComponent(obj).subscribe(
  //   res => {
  //     this.auth.hideLoader();
  //     this.services.showErrorMessage('success', '', 'Form-Field  Updated Successfully');
  //     this.cleareForm()
  //     $('#customField').modal('hide');

  //   },
  //   err => {
  //     this.auth.hideLoader();
  //     this.services.showErrorMessage('error', '', err.error.message);
  //   }
  // );



selecteCustomformId(obj){
  this.component_id = obj
}
deleteCustumfomField(){
  let obj = this.component_id
  this.auth.showLoader();
  this.postData.deleteCustomComponent(obj).subscribe(
    res => {
      this.auth.hideLoader();
      this.services.showErrorMessage('success', 'Form-field Deleted ', 'requested form-field deleted Successfully');
     this.fetchCustomFild()
     $('#deleteModal').modal('hide');


     
    },
    err => {
      this.auth.hideLoader();
      this.services.showErrorMessage('error', '', err.error.message);
    }
  );
}
cleareForm(){
  this.isEditCustumFormField =""
  this.emptyCustomField()
}

emptyCustomField(){
  this.editCustomFormField = {
    comp_length: '',
    description: "",
    institution_id: sessionStorage.getItem('institute_id'),
    is_required: "N",
    is_searchable: "N",
    label: "",
    page: 1,
    prefilled_data: "",
    sequence_number: "",
    type: "",
    on_both: "Y",
    defaultValue: "",
    is_external: "N"
  }

}


  // =========================end===============================

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
  toggleNewPopupsVisisbility(type) {
    this.isEditcustumfield = type;
    //this.emptyObject();
  }
  cancelRow() {
    
    this.isEditcustumfield = '';
   
  }
  validateDropDown(data) {
    let arr: any[] = data.split(',');
    /* boolean for non empty value */
    let test1 = arr.every(function checkNonEmpty(el) {
      return (el != "" && el != " ");
    });
    /* convert array to set unique value */
    this.editCustomFormField.prefilled_data = Array.from(new Set(arr)).join(',');
    return test1
  }

  validateDropdownDefvalue(tocheck, tomatch) {
    let arr = tocheck.split(',');
    for (let i = 0; i < arr.length; i++) {
      if (tomatch === arr[i].trim()) {
        return true;
      }
    }
    return false;
  }

  validateDropDownUpdate(data) {
    let arr: any[] = data.split(',');
    /* boolean for non empty value */
    let test1 = arr.every(function checkNonEmpty(el) {
      return (el != "" && el != " ");
    });
    /* convert array to set unique value */
    return test1
  }

}
