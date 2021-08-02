import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';
import { AuthenticatorService } from '../../../services/authenticator.service'
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
declare var $;
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  active: boolean = false;
  activeb: boolean = true;
  activeclass: string;
  assetAllData: any = [];
  assetcategoryData: any = [];
  assetDataToDownload= [];
  catDataToDownload= [];
  displayBatchSize: number = 25;
  excelheaderseting: any = [];
  headerSetting: any;
  headerSettingForAsset: any;
  institute_id = sessionStorage.getItem('institute_id');
  is_asset_cat: boolean = true;
  is_asset: boolean = false;
  isadd: boolean;
  isedit;
  isUpdate: boolean;
  locationData: any = [];
  pageIndex: number = 1;
  rowColumnForAsset: any;
  rowColumns: any;
  searchParams: any;
  show: boolean = true;
  sizeArr: any[] = [2, 50, 100, 150, 200, 500, 1000];
  staticPageData: any = [];
  staticPageDataForAsset: any = [];
  submitted = false;
  tableSetting: any;
  tableSettingForAsset: any;
  tempLocationList: any;
  tempObjForCat;
  totalRecords: number = 0;
  @ViewChild('assetcat', { static: false }) assetcat: NgForm;

  category_model = {
    id: '',
    active: true,
    category_code: null,
    category_name: '',
    institute_id: sessionStorage.getItem('institute_id')
  }
  errordata: any = [];

  constructor(
    private httpService: ProductService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.setTableData();
    this.getCategoryDetails();
    this.setTableDataForAsset();
    this.getLocationDetails();
    this.getAssetDetails();

  }

  //function for toggle view 
  toggle(param) {
    this.active = param;
    this.activeb = !param;
    this.is_asset_cat = !param;
    this.is_asset = param;

  }
  //TABLE CODING FOR ASSET
  setTableDataForAsset() {
    this.headerSettingForAsset = [
      // {
      //   primary_key: 'id',
      //   value: "#",
      //   charactLimit: 25,
      //   sorting: true,
      //   visibility: true
      // },
      {
        primary_key: 'asset_code',
        value: "Code",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'asset_name',
        value: "Name ",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'category_name',
        value: "Category ",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'quantity',
        value: "Quantity ",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'available',
        value: "Available Qty ",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'asset_condition',
        value: "Condition",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'location_names_string',
        value: " Location ",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },

      {
        primary_key: 'action',
        value: "Action",
        charactLimit: 10,
        sorting: false,
        visibility: true,
        view: false,
        edit: true,
        delete: true,

      },
    ],
      this.tableSettingForAsset = [
        {
          width: "100%",
          height: "58vh"
        }

      ],
      this.rowColumnForAsset = [
        // {
        //   width: "5%",
        //   textAlign: "left"
        // },
        {
          width: "10%",
          textAlign: "left"
        },
        {
          width: "10%",
          textAlign: "left"
        },
        {
          width: "15%",
          textAlign: "left"
        },
        {
          width: "10%",
          textAlign: "left"
        },
        {
          width: "15%",
          textAlign: "left"
        },
        {
          width: "10%",
          textAlign: "left"
        },
        {
          width: "25%",
          textAlign: "left"
        },
        {
          width: "10%",
          textAlign: "left"
        }
      ]

  }

  //multiselect

  moderatorSettingsforasset: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'location_name',
    enableCheckAll: false,
    itemsShowLimit: 2
  }
  setTableData() {
    this.headerSetting = [
      // {
      //   primary_key: 'id',
      //   value: "Id",
      //   charactLimit: 25,
      //   sorting: true,
      //   visibility: true
      // },
      {
        primary_key: 'category_code',
        value: " Code",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'category_name',
        value: " Name ",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'action',
        value: "Action",
        charactLimit: 10,
        sorting: false,
        visibility: true,
        view: false,
        edit: true,
        delete: true,

      },
    ]

    this.tableSetting = {
      width: "100%",
      height: "58vh",
    }

    this.rowColumns = [
      // {
      //   width: "20%",
      //   textAlign: "left"
      // },
      {
        width: "40%",
        textAlign: "left"

      },
      {
        width: "40%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },


    ]
  }
  excelheadersettingforcat: any = [{
    primary_key: 'category_code',
    value: " Code",
    charactLimit: 25,
    sorting: true,
    visibility: true
  },
  {
    primary_key: 'category_name',
    value: " Name ",
    charactLimit: 25,
    sorting: true,
    visibility: true
  },]
  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.getDataFromDataSource(startindex);
  }
  fetchNext() {
    this.pageIndex++;
    this.fetchTableDataByPage(this.pageIndex);
  }
  fetchPrevious() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.fetchTableDataByPage(this.pageIndex);
    }
  }
  getDataFromDataSource(startindex) {
    this.getAssetDetails();


  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }

  //crud for category
  saveCategoryDetails() {
    if (this.assetcat.valid) {
      if (this.model.asset_code === '') {
        this.model.asset_code = null;
      }
      this.httpService.postMethod('api/v2/asset/category/create', this.category_model).then((res) => {
        this.submitted = true;
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Category added successfully");
        $('#myModalforcat').modal('hide');
        this.getCategoryDetails();
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);
        }
      )

    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all mandatory field");
    }
  }
  //get category details
  getCategoryDetails() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/category/all?all=1&instituteId=' + this.category_model.institute_id, null).subscribe((res: any) => {
      this.assetcategoryData = res.result.response;
      this.staticPageData = res.result.response;
      this.totalRecords = res.result.total_elements;
      this.staticPageData = this.getDataFromDataSource(0);
      this.auth.hideLoader();
    },
      err => {
        this.auth.hideLoader();
      })

  }
  editRow(object) {
    this.isedit = true;
    this.category_model.id = object.data.id;
    this.category_model.active = object.data.category_model;
    this.category_model.category_code = object.data.category_code;
    this.category_model.category_name = object.data.category_name;
    this.category_model.institute_id = object.data.institute_id;
    $('#myModalforcat').modal('show');
  }
  //update category
  updateAssetCategory() {
    if (this.assetcat.valid) {
      this.httpService.putMethod('api/v2/asset/category/update', this.category_model).then(() => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Updated Successfully")
        $('#myModalforcat').modal('hide');
        this.getCategoryDetails();
      },
        err => {
          //this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "A Category already exists with the same Name / ID");
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);
        }

      )
    }
    else {
      this.msgService.showErrorMessage('error', '', 'Please fill all mandatory field');
    }
  }

  //delete category
  showCatDelete(object) {
    this.tempObjForCat = object.data.id;
    $('#deletesModal').modal('show')
  }
  deleteRow(object) {
    this.httpService.deleteMethod('api/v2/asset/category/delete/' + object + '?instituteId=' + this.category_model.institute_id).then((res: any) => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage('success', '', 'Deleted Successfully');
      this.getCategoryDetails();
      $('#deletesModal').modal('hide')
    },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);

      });

  }
  //code for add asset table 
  @ViewChild('assetaddForm', { static: false }) assetaddForm: NgForm
  model = {
    active: true,
    category_id: '-1',
    asset_code: null,
    asset_condition: -1,
    location_ids: [],
    asset_name: '',
    institute_id: sessionStorage.getItem('institute_id'),
    quantity: '',
    id: '',
    

  }
  //get location data
  getLocationDetails() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/location/all?all=1&instituteId=' + this.institute_id, null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.locationData = res.result.response;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  //save asset details
  saveAssetDetails() {
    if (this.assetaddForm.valid) {
      let obj: any = {
        active: this.model.active,
        category_id: this.model.category_id,
        asset_code: this.model.asset_code,
        asset_condition: this.model.asset_condition,
        location_ids: this.model.location_ids,
        asset_name: this.model.asset_name,
        institute_id: sessionStorage.getItem('institute_id'),
        quantity: this.model.quantity,
        //id: this.model.active
      }
      let newasset: any = []
      let location_ids: any = obj.location_ids;
      for (let data in location_ids) {
        newasset.push(location_ids[data].id);
      }
      obj.location_ids = newasset
      this.httpService.postMethod('api/v2/asset/create', obj).then((res) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset added successfully");
        $('#myModalforasset').modal('hide');
        this.getAssetDetails();
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);

        })
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all mandatory field");

    }

  }

  //get location
  getAssetDetails() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.assetAllData = res.result.response;
        this.staticPageData = res.result.response;
        this.tempLocationList = res.result.response;
        this.totalRecords = res.result.total_elements;
        // $('#myModalforasset').modal('hide');
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //edit asset data
  editAssetRow(object) {
    this.isedit = true;
    this.model.id = object.data.id;
    this.model.active = object.data.active;
    this.model.asset_code = object.data.asset_code;
    this.model.asset_condition = object.data.asset_condition;
    this.model.location_ids = object.data.location_ids;
    this.model.asset_name = object.data.asset_name;
    this.model.institute_id = object.data.institute_id;
    this.model.quantity = object.data.quantity;
    this.model.category_id = object.data.category_id;
    $('#myModalforasset').modal('show');
    let temp = object.data.location_ids;
    let location_names = object.data.location_names_string.split(',');
    this.model.location_ids = [];
    for (let i = 0; i < temp.length; i++) {
      let obj: any = {
        id: '',
        location_name: ''
      }
      obj.id = temp[i];
      obj.location_name = location_names[i];
      this.model.location_ids.push(obj);

    }
  }

  //update asset details
  updateAssetDetails() {
    this.auth.showLoader();
    if (this.assetaddForm.valid) {
      // var location_ids = JSON.parse("[" + this.model.location_ids + "]");
      // this.model.location_ids = location_ids;
      let obj: any = {

        active: this.model.active,
        category_id: this.model.category_id,
        asset_code: this.model.asset_code,
        asset_condition: this.model.asset_condition,
        location_ids: this.model.location_ids,
        asset_name: this.model.asset_name,
        institute_id: sessionStorage.getItem('institute_id'),
        quantity: this.model.quantity,
        id: this.model.id
      }
      if (this.model.asset_code === '') {
        obj.asset_code = null;
      }
      let newasset: any = []
      let location_ids: any = obj.location_ids;
      for (let data in location_ids) {
        newasset.push(location_ids[data].id);
      }
      obj.location_ids = newasset

      this.httpService.putMethod('api/v2/asset/update', obj).then(() => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Updated Successfully")
       this.getCategoryDetails();
        this.getAssetDetails();
        this.auth.hideLoader();
        $('#myModalforasset').modal('hide');
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);
        }

      )
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All fields Required")
    }
  }

  //delete asset 
  temObjForAsset;
  showAssetDelete(object) {
    this.temObjForAsset = object.data.id;
    $('#deletesAssetModal').modal('show');

  }
  deleteAssetRow(object) {
    this.httpService.deleteMethod('api/v2/asset/delete/' + object + '?instituteId=' + this.model.institute_id).then((res: any) => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage('success', '', 'Deleted Successfully');
      this.getAssetDetails();
      $('#deletesAssetModal').modal('hide');

    },
      err => {
        this.msgService.showErrorMessage('error', '', 'Asset is being assigned to an user');
        //this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);
      })

  }

  //search asset
  searchDatabase() {
    this.staticPageData=[];
    if (this.searchParams == undefined || this.searchParams == null) {
      this.searchParams = "";
      this.staticPageData = this.tempLocationList;

    }
    else {
      this.auth.showLoader();
      this.httpService.getMethod('api/v2/asset/search?searchString='+this.searchParams +'&instituteId='+this.model.institute_id, null).subscribe(
        (res: any) => {
          this.staticPageData = res.result.response;
          this.tempLocationList = res.result.response;
          this.totalRecords = res.result.total_elements;
          this.auth.hideLoader();
          if(this.staticPageData.length==0){
            this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "No Data Found");
          }
        },
        err => {
          this.auth.hideLoader();
        }
      );
      let searchData = this.tempLocationList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchParams.toLowerCase()))
      );
      this.staticPageData = searchData;
      this.totalRecords = this.staticPageData.length;
    }
  }
  exportToExcel() {

    this.httpService.getMethod('api/v2/asset/category/all?all=1&instituteId=' + this.category_model.institute_id, null).subscribe(
      (res: any) => {
        this.auth.showLoader();
        this.catDataToDownload = res.result.response;
        let Excelarr = [];
        this.catDataToDownload.map(
          (ele: any) => {
            let json = {}
            this.excelheadersettingforcat.map((keys) => {
              json[keys.value] = ele[keys.primary_key]
            })
            Excelarr.push(json);
          }
        )
        this.excelService.exportAsExcelFile(
          Excelarr,
          'asset_category'
        );
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }

    );
    this.auth.hideLoader();
  }

  downloadPdf() {
    this.httpService.getMethod('api/v2/asset/category/all?all=1&instituteId=' + this.category_model.institute_id, null).subscribe(
      (res: any) => {
        this.catDataToDownload = res.result.response;
        for(let i=0;i<this.catDataToDownload.length;i++){
          this.catDataToDownload[i].id=i+1;
        }
        let arr = [];

    this.catDataToDownload.map(
      (ele: any) => {
        let json = [
          // ele.id,
          ele.category_code,
          ele.category_name,
        ]
        arr.push(json);
      })

    let rows = [];
    rows = [['Code', ' Name']]
    let columns = arr;
    this._pdfService.exportToPdf(rows, columns, 'Category List');
    this.auth.hideLoader();

        //this.auth.showLoader();
      },
      err => {
        this.auth.hideLoader();
      }

    );
    
  }
  //array to export

  assetExportToExcel() {
    this.excelheaderseting = [
      {
        primary_key: 'asset_code',
        value: "Code",
        
      },
      {
        primary_key: 'asset_name',
        value: "Name ",
      
      },
      {
        primary_key: 'category_name',
        value: "Category ",
      
      },
      {
        primary_key: 'quantity',
        value: "Quantity ",
       
      },
      {
        primary_key: 'available',
        value: "Available Qty ",
       
      },
      {
        primary_key: 'asset_condition',
        value: "Condition",
        
      },
      {
        primary_key: 'location_names_string',
        value: " Locations ",
        
      },
    ]
    this.httpService.getMethod('api/v2/asset/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.auth.showLoader();
        this.assetDataToDownload = res.result.response;
        let Excelarr = [];
        this.assetDataToDownload.map(
          (ele: any) => {
            let json = {}
            this.excelheaderseting.map((keys) => {
              json[keys.value] = ele[keys.primary_key]
            })
            Excelarr.push(json);
          }
        )
        this.excelService.exportAsExcelFile(
          Excelarr,
          'asset_data'
        );
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }

    );
    this.auth.hideLoader();

  }

  assetDownloadPdf() {
    this.httpService.getMethod('api/v2/asset/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.assetDataToDownload = res.result.response;
        for(let i=0;i<this.assetDataToDownload.length;i++){
          this.assetDataToDownload[i].id=i+1;
        }
        //this.auth.showLoader();
        let arr = [];

    this.assetDataToDownload.map(
      (ele: any) => {
        let json = [
          // ele.id,
          ele.asset_code,
          ele.asset_name,
          ele.category_name,
          ele.quantity,
          ele.available,
          ele.asset_condition,
          ele.location_names_string
        ]
        arr.push(json);
      })

    let rows = [];
    rows = [['Code', ' Asset Name', 'Category', 'Quantity','Available Qty', 'Condition', 'Locations']]
    let columns = arr;
    this._pdfService.exportToPdf(rows, columns, 'Asset List');
    this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }

    );
    
  }
  //cancel 
  cancel() {
    // this.assetaddForm.resetForm();
    // this.assetcat.resetForm();
    this.isedit = false;
    this.category_model = {
      active: true,
      category_code: null,
      category_name: '',
      institute_id: sessionStorage.getItem('institute_id'),
      id: ''
    }
    this.model = {
      active: true,
      category_id: '-1',
      asset_code: null,
      asset_condition: -1,
      location_ids: [],
      asset_name: '',
      institute_id: sessionStorage.getItem('institute_id'),
      quantity: '',
      id: ''
    }
    this.assetaddForm.reset(this.model);
    this.assetcat.reset(this.category_model);

  }
  
  maxlenth(data,limit){
    if(data.length>limit){
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Please Enter upto"+  " " + limit + " "+ "character only");
    }
}
}
